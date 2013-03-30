/*jshint asi: true*/

try {
	// This is terrible but kinda works.
	chrome
	app = "chrome"
} catch(err) {
	app = "linux"
}

if (app === "linux") {
	process.on("exit", function() {
		var exec = require("child_process").exec
		exec("kill -9 " + pyserver.pid)
		exec("kill -9 " + (pyserver.pid + 1))
	})
}

// Upgrader
if (localStorage.stormcloud) {
	//Cache the location and zip
	var zip = localStorage.stormcloud,
		location = localStorage.stormcloud_location

	//Remove the Keys
	localStorage.removeItem("stormcloud")
	localStorage.stormcloud_location = JSON.stringify([{place: location, zip: zip}])
}

// Sets up localstorage
localStorage.stormcloud_average = localStorage.stormcloud_average || "false"
localStorage.stormcloud_measurement = localStorage.stormcloud_measurement || "f"
localStorage.stormcloud_speed = localStorage.stormcloud_speed || "mph"
localStorage.stormcloud_color =  localStorage.stormcloud_color || "gradient"
localStorage.stormcloud_count =  localStorage.stormcloud_count || "true"
localStorage.stormcloud_font =  localStorage.stormcloud_font || "ubuntufont"
localStorage.stormcloud_license =  localStorage.stormcloud_license || ""
if (app == "chrome") {
	localStorage.stormcloud_location = localStorage.stormcloud_location || '[{"zip":"MYXX0008", "place": "Kuala Lumpur"}]'
	localStorage.stormcloud_weathercache = localStorage.stormcloud_weathercache || '[{"link":"http://us.rd.yahoo.com/dailynews/rss/weather/Kuala_Lumpur__MY/*http://weather.yahoo.com/forecast/MYXX0008_f.html","place":"Kuala Lumpur","country":"MY","zip":"MYXX0008","temperature":"91 °","windSpeed":"2","windUnit":"mph","windDirection":"40","humidity":"63","week":[{"day":"Thu","code":"Cloud-Lightning","low":"75 °","high":"92 °","average":"84 °"},{"day":"Fri","code":"Cloud-Lightning","low":"76 °","high":"93 °","average":"85 °"},{"day":"Sat","code":"Cloud-Sun","low":"75 °","high":"93 °","average":"84 °"},{"day":"Sun","code":"Cloud-Lightning","low":"76 °","high":"91 °","average":"84 °"}],"code":"Cloud-Sun","background":"rgb(228, 66, 17)"}]'
} else {
	localStorage.stormcloud_location = localStorage.stormcloud_location || '[{"zip":"MYXX0008", "place": "Kuala Lumpur"}, {"zip":"USCA0091", "place": "Bieber"}, {"zip":"SWXX0031", "place": "Stockholm"}]'
	localStorage.stormcloud_weathercache = localStorage.stormcloud_weathercache || '[{"link":"http://us.rd.yahoo.com/dailynews/rss/weather/Kuala_Lumpur__MY/*http://weather.yahoo.com/forecast/MYXX0008_f.html","place":"Kuala Lumpur","country":"MY","zip":"MYXX0008","temperature":"91 °","windSpeed":"2","windUnit":"mph","windDirection":"40","humidity":"63","week":[{"day":"Thu","code":"Cloud-Lightning","low":"75 °","high":"92 °","average":"84 °"},{"day":"Fri","code":"Cloud-Lightning","low":"76 °","high":"93 °","average":"85 °"},{"day":"Sat","code":"Cloud-Sun","low":"75 °","high":"93 °","average":"84 °"},{"day":"Sun","code":"Cloud-Lightning","low":"76 °","high":"91 °","average":"84 °"}],"code":"Cloud-Sun","background":"rgb(228, 66, 17)"},{"link":"http://us.rd.yahoo.com/dailynews/rss/weather/Bieber__CA/*http://weather.yahoo.com/forecast/USCA0091_f.html","place":"Bieber","country":"US","zip":"USCA0091","temperature":"26 °","windSpeed":"0","windUnit":"mph","windDirection":"0","humidity":"95","week":[{"day":"Wed","code":"Cloud-Snow","low":"23 °","high":"37 °","average":"30 °"},{"day":"Thu","code":"Sun","low":"22 °","high":"46 °","average":"34 °"},{"day":"Fri","code":"Sun","low":"22 °","high":"49 °","average":"36 °"},{"day":"Sat","code":"Sun","low":"23 °","high":"53 °","average":"38 °"}],"code":"Cloud-Moon","background":"rgb(0, 129, 211)"},{"link":"http://us.rd.yahoo.com/dailynews/rss/weather/Stockholm__SW/*http://weather.yahoo.com/forecast/SWXX0031_f.html","place":"Stockholm","country":"SW","zip":"SWXX0031","temperature":"23 °","windSpeed":"6","windUnit":"mph","windDirection":"310","humidity":"57","week":[{"day":"Thu","code":"Sun","low":"17 °","high":"33 °","average":"25 °"},{"day":"Fri","code":"Sun","low":"17 °","high":"33 °","average":"25 °"},{"day":"Sat","code":"Sun","low":"17 °","high":"29 °","average":"23 °"},{"day":"Sun","code":"Sun","low":"14 °","high":"27 °","average":"21 °"}],"code":"Moon","background":"rgb(0, 129, 211)"}]'
}
stormcloud_cli = {
	dataGet: {
		zipcode: function(location, callback) {
			//If it's a woeid, we bypass the first step
			if (parseInt(location)) {
				woeid_request(location, callback)
			//If they use a normal location
			} else {
				$.get("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22" + encodeURIComponent(location) + "%22&format=xml&" + Math.round(Math.random() * 1000000), function(locationData) {
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
				$.get("http://weather.yahooapis.com/forecastrss?w=" + encodeURIComponent(obj.woeid) + "&" + Math.round(Math.random() * 1000000), function(woeidData) {
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
				var percentage = Math.round((temp - 45) *  2.2)
				return blend(percentage)
			}

			$.ajax({
				url: 'http://xml.weather.yahoo.com/forecastrss/' + location.zip + '_f.xml?' + Math.round(Math.random() * 1000000),
				timeout: 10000,
				success: function(data) {

					//Weather Object
					weather = {}
					if (localStorage.stormcloud_average == "true") {
						weather.average = true
					}

					//Location
					weather.link = $($(data).find('link')[0]).text()
					weather.place = location.place || $(data).find('location').attr("city")
					weather.country = $(data).find('location').attr("country")
					weather.zip = $($(data).find("guid")).text().substring(0,8)

					//Temperature
					var temp = $(data).find("condition").attr("temp")

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
						weather.week[i].code = weather_code($(weekArr[i]).attr("code"))[0]

						if (localStorage.stormcloud_measurement == "c") {
							weather.week[i].low = Math.round(($(weekArr[i]).attr("low") -32)*5/9) + "°"
							weather.week[i].high = Math.round(($(weekArr[i]).attr("high") -32)*5/9) + "°"
							weather.week[i].average = Math.round(((parseInt($(weekArr[i]).attr("high")) + parseInt($(weekArr[i]).attr("low")) - 64)*5/9)/2) + " °"
						} else if (localStorage.stormcloud_measurement == "k") {
							weather.week[i].low = Math.round(($(weekArr[i]).attr("low") -32)*5/9) + 273 + "K"
							weather.week[i].high = Math.round(($(weekArr[i]).attr("high") -32)*5/9) + 273 + "K"
							weather.week[i].average = Math.round(((parseInt($(weekArr[i]).attr("high")) + parseInt($(weekArr[i]).attr("low")) - 64)*5/9)/2)+273 + " K"
						} else {
							weather.week[i].low = $(weekArr[i]).attr("low") + "°"
							weather.week[i].high = $(weekArr[i]).attr("high") + "°"
							weather.week[i].average = Math.round((parseInt($(weekArr[i]).attr("high")) + parseInt($(weekArr[i]).attr("low")))/2) + "°"
						}
					}

					//Current Weather
					weather.code = $(data).find("condition").attr("code")
					if (weather.code != "3200") {
						weather.background = background(Math.round(weather_code(weather.code)[1]/2.2 + 45))
						weather.code = weather_code(weather.code)[0]
					} else {
						// If Yahoo is a bitch and doesn't give current weather
						weather.code = weather.week[0].code
						weather.background = background(Math.round(weather_code($($(data).find("forecast")[0]).attr("code"))[1]/2.2+45))
					}

					if (localStorage.stormcloud_color == "gradient") {
						weather.background = background(temp)
					}
					weather.gradientbackground = background(temp)

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

	render: function(locations, callbackfn) {
		var arr = [],
			count = 0

		// Because its bad practice to define a function in a loop
		var callback = function(weather, arr) {
			arr[arr.indexOf(weather.zip)] = weather
			count++

			if (count == locations.length) {
				localStorage.stormcloud_weathercache = JSON.stringify(arr)

				// Update Count
				if(app == "chrome") {
					if (localStorage.stormcloud_count === "true") {

						var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

						//Function to convert hex format to a rgb color
						function rgb2hex(rgb) {
							rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
							return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
						}

						function hex(x) {
							return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
						}

						chrome.browserAction.setBadgeBackgroundColor({color: rgb2hex(arr[0].gradientbackground)})
						chrome.browserAction.setBadgeText({text: arr[0].temperature.replace(" ", "")})
					} else {
						chrome.browserAction.setBadgeText({text: ""})
					}
				} else {
					// Launch the Unity Server
					var exec = require('child_process').exec;

					// Kills the current PyServer
					if (typeof(pyserver) !== 'undefined') {
						// GObject doesn't like .kill()
						pyserver.kill()
					}

					if (localStorage.stormcloud_count === "true") {
						exec("chmod +x ./unity.py")
						pyserver = exec("./unity.py " + arr[0].temperature.replace(" °", ""))
					}
				}

				if (callbackfn) {
					callbackfn()
				}
			}
		}

		for (var i in locations) {
			//We need this so it's in the right order - stupid async programming
			arr[i] = locations[i].zip
			stormcloud_cli.dataGet.weather(locations[i], arr, callback)
		}
	}
}

function weather_code(a) {
	// Icon Name & Colour Percentage
    var b = {
        0: ["Tornado", 50],
        1: ["Cloud-Lightning", 50],
        2: ["Tornado", 50],
        3: ["Cloud-Lightning", 50],
        4: ["Cloud-Lightning", 50],
        5: ["Cloud-Hail", 15],
        6: ["Cloud-Hail", 15],
        7: ["Cloud-Snow", 0],
        8: ["Cloud-Drizzle", 40],
        9: ["Cloud-Drizzle", 40],
        10: ["Cloud-Rain", 30],
        11: ["Cloud-Rain", 30],
        12: ["Cloud-Rain", 30],
        13: ["Cloud-Snow", 0],
        14: ["Cloud-Snow", 0],
        15: ["Cloud-Snow", 0],
        16: ["Cloud-Snow", 0],
        17: ["Cloud-Hail", 15],
        18: ["Cloud-Hail", 15],
        19: ["Cloud-Fog", 40],
        20: ["Cloud-Fog", 40],
        21: ["Cloud-Fog", 40],
        22: ["Cloud-Fog", 40],
        23: ["Cloud-Wind", 30],
        24: ["Cloud-Wind", 30],
        25: ["Cloud", 50],
        26: ["Cloud", 50],
        27: ["Cloud-Moon", 40],
        28: ["Cloud-Sun", 80],
        29: ["Cloud-Moon", 40],
        30: ["Cloud-Sun", 80],
        31: ["Moon", 70],
        32: ["Sun", 100],
        33: ["Moon", 70],
        34: ["Sun", 100],
        35: ["Cloud-Hail", 15],
        36: ["Sun", 100],
        37: ["Cloud-Lightning", 50],
        38: ["Cloud-Lightning", 50],
        39: ["Cloud-Lightning", 50],
        40: ["Cloud-Drizzle", 40],
        41: ["Cloud-Snow", 0],
        42: ["Cloud-Snow", 0],
        43: ["Cloud-Snow", 0],
        44: ["Cloud", 50],
        45: ["Cloud-Lightning", 50],
        46: ["Cloud-Snow", 0],
        47: ["Cloud-Lightning", 50],
        3200: ["Cloud", 50]
    };
    return b[a]
}

// App Start
stormcloud_cli.render(JSON.parse(localStorage.stormcloud_location))

setInterval(function() {
	stormcloud_cli.render(JSON.parse(localStorage.stormcloud_location))
}, 150000)
