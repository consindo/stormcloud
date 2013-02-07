/*jshint asi: true*/

//Stormcloud yall
(function() {

	//Upgrader
	if (localStorage.stormcloud) {
		//Cache the location and zip
		var zip = localStorage.stormcloud,
			location = localStorage.stormcloud_location

		//Remove the Keys
		localStorage.removeItem("stormcloud")
		localStorage.stormcloud_location = JSON.stringify([{place: location, zip: zip}])
	}
	// Sets up localstorage
	localStorage.stormcloud_measurement = localStorage.stormcloud_measurement || "f"
	localStorage.stormcloud_speed = localStorage.stormcloud_speed || "mph"
	localStorage.stormcloud_color =  localStorage.stormcloud_color || "gradient"
	localStorage.stormcloud_location = localStorage.stormcloud_location || '[{"zip":"MYXX0008", "place": "Kuala Lumpur"}, {"zip":"USCA0091", "place": "Bieber"}, {"zip":"SWXX0031", "place": "Stockholm"}]'
})()

// Can either be chrome or linux
window.app = "chrome"

//UI Start
$(function() {
	stormcloud.render(JSON.parse(localStorage.stormcloud_location))
})

stormcloud = {
	dataGet: {
		zipcode: function(location, callback) {
			//If it's a woeid, we bypass the first step
			if (parseInt(location)) {
				woeid_request(location, callback)
			//If they use a normal location
			} else {
				$.get("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22" + encodeURIComponent(location) + "%22&format=xml", function(locationData) {
					// Gets the WOEID && Caches Location Name
					var woeid = $($(locationData).find("woeid")[0]).text(),
						place = $($(locationData).find("name")[0]).text()

					if (woeid) {
						woeid_request({
							woeid: woeid,
							place: place
						}, callback)
					} else {
						callback()
					}
				})
			}

			// WOEID Request to find Global ZIP Code
			function woeid_request(obj, callback) {
				$.get("http://weather.yahooapis.com/forecastrss?w=" + encodeURIComponent(obj.woeid), function(woeidData) {
					try {
						callback({zip: $($(woeidData).find("guid")).text().substring(0,8), place: $($(woeidData).find("location")).attr("city")})
					} catch (err) {
						callback()
					}
				})
			}
		},
		weather: function(location, arr, callback) {
			var background = function(temp) {
				// Convert RGB array to CSS
				var convert = function(i) {
					// Array to RGB
					if (typeof(i) == 'object') {
						return 'rgb(' + i.join(', ') + ')';

					// Hex to array
					} else if (typeof(i) == 'string') {
						var output = [];
						if (i[0] == '#') i = i.slice(1);
						if (i.length == 3)	i = i[0] + i[0] + i[1] + i[1] + i[2] + i[2];
						output.push(parseInt(i.slice(0,2), 16))
						output.push(parseInt(i.slice(2,4), 16))
						output.push(parseInt(i.slice(4,6), 16))
						return output;
					}
				};

				// Get color at position
				var blend = function(x) {
					x = Number(x)
					var gradient = [{
						pos: 0,
						color: convert('#0081d3')
					}, {
						pos: 10,
						color: convert('#007bc2')
					}, {
						pos: 20,
						color: convert('#0071b2')
					}, {
						pos: 30,
						color: convert('#2766a2')
					}, {
						pos: 40,
						color: convert('#575591')
					}, {
						pos: 50,
						color: convert('#94556b')
					}, {
						pos: 60,
						color: convert('#af4744')
					}, {
						pos: 70,
						color: convert('#bb4434')
					}, {
						pos: 80,
						color: convert('#c94126')
					}, {
						pos: 90,
						color: convert('#d6411b')
					}, {
						pos: 100,
						color: convert('#e44211')
					}];

					var left = {
						pos: -1,
						color: false,
						percent: 0
					};
					var right = {
						pos: 101,
						color:  false,
						percent: 0
					};

					// Get the 2 closest stops to the specified position
					for (var i=0, l=gradient.length; i<l; i++) {
						var stop = gradient[i];
						if (stop.pos <= x && stop.pos > left.pos) {
							left.pos = stop.pos;
							left.color = stop.color;
						} else if (stop.pos >= x && stop.pos < right.pos) {
							right.pos = stop.pos;
							right.color = stop.color;
						}
					}

					// If there is no stop to the left or right
					if (!left.color) {
						return convert(right.color);
					} else if (!right.color) {
						return convert(left.color);
					}

					// Calculate percentages
					right.percent = Math.abs(1 / ((right.pos - left.pos) / (x - left.pos)));
					left.percent = 1 - right.percent;

					// Blend colors!
					var blend = [
						Math.round((left.color[0] * left.percent) + (right.color[0] * right.percent)),
						Math.round((left.color[1] * left.percent) + (right.color[1] * right.percent)),
						Math.round((left.color[2] * left.percent) + (right.color[2] * right.percent))
					];
					return convert(blend);
				};

				//Sets Background Color
				if (localStorage.stormcloud_color == "gradient") {
					var percentage = Math.round((temp - 45) *  2.2)
					return blend(percentage)
				} else {
					return localStorage.stormcloud_color
				}
			}

			$.ajax({
				url: 'http://xml.weather.yahoo.com/forecastrss/' + location.zip + '_f.xml?'+(Math.random() * 100),
				timeout: 10000,
				success: function(data) {

					//Weather Object
					weather = {}

					//Location
					weather.place = location.place || $(data).find('location').attr("city")
					weather.country = $(data).find('location').attr("country")
					weather.zip = $($(data).find("guid")).text().substring(0,8)

					//Temperature
					var temp = $(data).find("condition").attr("temp")
					weather.background = background(temp)
					if (localStorage.stormcloud_measurement == "c") {
						weather.temperature = Math.round((temp -32)*5/9) + " °"
					} else if (localStorage.stormcloud_measurement == "k") {
						temp = Math.round((temp -32)*5/9) + 273
						weather.temperature = temp + " K"
					} else {
						weather.temperature = temp + " °"
					}

					//Wind
					weather.windSpeed = $(data).find('wind').attr("speed")
					weather.windUnit = $(data).find('units').attr("speed")
					if (localStorage.stormcloud_speed != "mph") {
						weather.windSpeed = (localStorage.stormcloud_speed == "kph") ? Math.round(weather.windSpeed * 1.609344) : Math.round(weather.windSpeed * 4.4704) /10
						weather.windUnit = (localStorage.stormcloud_speed == "kph") ? "kph" : "m/s"
					}
					weather.windDirection = $(data).find('wind').attr('direction')

					//Humidity
					weather.humidity = $(data).find('atmosphere').attr('humidity')

					//Weekly Weather
					weekArr = $(data).find("forecast")
					weather.week = []
					for (var i=0; i<4; i++) {
						weather.week[i] = {}
						weather.week[i].day = $(weekArr[i]).attr("day")
						weather.week[i].code = weather_code($(weekArr[i]).attr("code"))

						if (localStorage.stormcloud_measurement == "c") {
							weather.week[i].low = Math.round(($(weekArr[i]).attr("low") -32)*5/9) + " °"
							weather.week[i].high = Math.round(($(weekArr[i]).attr("high") -32)*5/9) + " °"
						} else if (localStorage.stormcloud_measurement == "k") {
							weather.week[i].low = Math.round(($(weekArr[i]).attr("low") -32)*5/9) + 273 + " K"
							weather.week[i].high = Math.round(($(weekArr[i]).attr("high") -32)*5/9) + 273 + " K"
						} else {
							weather.week[i].low = $(weekArr[i]).attr("low") + " °"
							weather.week[i].high = $(weekArr[i]).attr("high") + " °"
						}
					}

					//Current Weather
					weather.code = $(data).find("condition").attr("code")
					if (weather.code == "3200") {
						weather.code = weather.week[0].code
					} else {
						weather.code = weather_code(weather.code)
					}

					if (callback && arr) {
						callback(weather, arr)
					} else if (callback) {
						callback(weather)
					} else {
						console.log(weather)
					}
				},
				error: function(data) {
					if (data.status === 0) {
						callback("error")
					}
				}
			})
		}
	},

	render: function(locations) {
		var arr = [],
			count = 0

		// Because its bad practice to define a function in a loop
		var callback = function(weather, arr) {
			arr[arr.indexOf(weather.zip)] = weather
			count++

			if (count == locations.length) {
				$("body").html(JSON.stringify(arr))
			}
		}

		for (var i in locations) {
			//We need this so it's in the right order - stupid async programming
			arr[i] = locations[i].zip
			stormcloud.dataGet.weather(locations[i], arr, callback)
		}
	}
}

function weather_code(a) {
    var b = {
        0: "Tornado",
        1: "Cloud-Lightning",
        2: "Tornado",
        3: "Cloud-Lightning",
        4: "Cloud-Lightning",
        5: "Cloud-Hail",
        6: "Cloud-Hail",
        7: "Cloud-Snow",
        8: "Cloud-Drizzle",
        9: "Cloud-Drizzle",
        10: "Cloud-Rain",
        11: "Cloud-Rain",
        12: "Cloud-Rain",
        13: "Cloud-Snow",
        14: "Cloud-Snow",
        15: "Cloud-Snow",
        16: "Cloud-Snow",
        17: "Cloud-Hail",
        18: "Cloud-Hail",
        19: "Cloud-Fog",
        20: "Cloud-Fog",
        21: "Cloud-Fog",
        22: "Cloud-Fog",
        23: "Cloud-Wind",
        24: "Cloud-Wind",
        25: "Cloud",
        26: "Cloud",
        27: "Cloud-Moon",
        28: "Cloud-Sun",
        29: "Cloud-Moon",
        30: "Cloud-Sun",
        31: "Moon",
        32: "Sun",
        33: "Moon",
        34: "Sun",
        35: "Cloud-Hail",
        36: "Sun",
        37: "Cloud-Lightning",
        38: "Cloud-Lightning",
        39: "Cloud-Lightning",
        40: "Cloud-Drizzle",
        41: "Cloud-Snow",
        42: "Cloud-Snow",
        43: "Cloud-Snow",
        44: "Cloud",
        45: "Cloud-Lightning",
        46: "Cloud-Snow",
        47: "Cloud-Lightning",
        3200: "Cloud"
    };
    return b[a]
}
