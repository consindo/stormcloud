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
	localStorage.stormcloud_location = localStorage.stormcloud_location || '[{"zip":"5128581","place":"New York"}]'
	localStorage.stormcloud_weathercache = localStorage.stormcloud_weathercache || '[{"link":"http://openweathermap.org/Maps?zoom=11&lat=40.714272&lon=-74.005966","place":"New York","country":"US","zip":5128581,"temperature":"7 &deg;","windSpeed":12,"windUnit":"mph","windDirection":336,"humidity":100,"week":[{"day":"Sat","code":"Cloud-Rain","low":"7&deg;","high":"7&deg;","average":"7&deg;"},{"day":"Sun","code":"Cloud-Rain","low":"7&deg;","high":"9&deg;","average":"8&deg;"},{"day":"Mon","code":"Sun","low":"9&deg;","high":"17&deg;","average":"13&deg;"},{"day":"Tue","code":"Sun","low":"9&deg;","high":"20&deg;","average":"14&deg;"}],"code":"Cloud-Rain","background":"rgb(0, 129, 211)","gradientbackground":"rgb(0, 129, 211)"}]'
} else {
	localStorage.stormcloud_location = localStorage.stormcloud_location || '[{"zip":"5128581","place":"New York"},{"zip":"2643743","place":"London"},{"zip":"1880252","place":"Singapore"}]'
	localStorage.stormcloud_weathercache = localStorage.stormcloud_weathercache || '[{"link":"http://openweathermap.org/Maps?zoom=11&lat=40.714272&lon=-74.005966","place":"New York","country":"US","zip":5128581,"temperature":"7 &deg;","windSpeed":12,"windUnit":"mph","windDirection":336,"humidity":100,"week":[{"day":"Sat","code":"Cloud-Rain","low":"7&deg;","high":"7&deg;","average":"7&deg;"},{"day":"Sun","code":"Cloud-Rain","low":"7&deg;","high":"9&deg;","average":"8&deg;"},{"day":"Mon","code":"Sun","low":"9&deg;","high":"17&deg;","average":"13&deg;"},{"day":"Tue","code":"Sun","low":"9&deg;","high":"20&deg;","average":"14&deg;"}],"code":"Cloud-Rain","background":"rgb(0, 129, 211)","gradientbackground":"rgb(0, 129, 211)"},{"link":"http://openweathermap.org/Maps?zoom=11&lat=51.50853&lon=-0.12574","place":"London","country":"GB","zip":2643743,"temperature":"5 &deg;","windSpeed":7,"windUnit":"mph","windDirection":343,"humidity":80,"week":[{"day":"Sat","code":"Sun","low":"5&deg;","high":"14&deg;","average":"10&deg;"},{"day":"Sun","code":"Sun","low":"8&deg;","high":"16&deg;","average":"12&deg;"},{"day":"Mon","code":"Cloud-Rain","low":"8&deg;","high":"15&deg;","average":"12&deg;"},{"day":"Tue","code":"Cloud-Rain","low":"8&deg;","high":"10&deg;","average":"9&deg;"}],"code":"Sun","background":"rgb(0, 129, 211)","gradientbackground":"rgb(0, 129, 211)"},{"link":"http://openweathermap.org/Maps?zoom=11&lat=1.28967&lon=103.850067","place":"Singapore","country":"SG","zip":1880252,"temperature":"32 &deg;","windSpeed":5,"windUnit":"mph","windDirection":257,"humidity":100,"week":[{"day":"Sat","code":"Cloud","low":"32&deg;","high":"33&deg;","average":"32&deg;"},{"day":"Sun","code":"Sun","low":"31&deg;","high":"33&deg;","average":"32&deg;"},{"day":"Mon","code":"Sun","low":"29&deg;","high":"31&deg;","average":"30&deg;"},{"day":"Tue","code":"Sun","low":"29&deg;","high":"31&deg;","average":"30&deg;"}],"code":"Cloud","background":"rgb(224, 66, 20)","gradientbackground":"rgb(224, 66, 20)"}]'
}

// Upgrades from Yahoo! to Open Weather Map
upgrader = function() {
	var list = JSON.parse(localStorage.stormcloud_location)
	if (isNaN(parseInt(list[0].zip))) {
		console.log("running upgrader")
		var newList = []
		for (item in list) {
			// Finds the latitude and longitude for each location
			$.get("http://xml.weather.yahoo.com/forecastrss/" + encodeURIComponent(list[item].zip) + "_f.xml", function(data) {
				var lat = $($(data).find('lat')).text()
				var long = $($(data).find('long')).text()
				$.get("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long, function(data) {
					newList.push({zip: data.city.id, place: data.city.name})
					localStorage.stormcloud_location = JSON.stringify(newList)

					// Chrome Extension or fast internet
					if (item == newList.length) {
						stormcloud_cli.render(JSON.parse(localStorage.stormcloud_location))
					}
				})
			})
		}
		// Temporarily set this.
		localStorage.stormcloud_location = '[{"zip":"5128581","place":"New York"}]'
		localStorage.stormcloud_weathercache = '[{"link":"http://openweathermap.org/Maps?zoom=11&lat=40.714272&lon=-74.005966","place":"New York","country":"US","zip":5128581,"temperature":"9 &deg;","windSpeed":8,"windUnit":"mph","windDirection":319,"humidity":98,"week":[{"day":"Sat","code":"Cloud-Rain","low":"9&deg;","high":"17&deg;","average":"150&deg;"},{"day":"Sat","code":"Cloud-Rain","low":"8&deg;","high":"10&deg;","average":"146&deg;"},{"day":"Sat","code":"Sun","low":"11&deg;","high":"18&deg;","average":"151&deg;"},{"day":"Sat","code":"Sun","low":"10&deg;","high":"20&deg;","average":"152&deg;"}],"code":"Cloud-Rain","background":"rgb(0, 124, 197)","gradientbackground":"rgb(0, 124, 197)"}]'
	}
}()

stormcloud_cli = {
	dataGet: {
		zipcode: function(location, callback) {
			//If it's a woeid, we bypass the first step
			if (parseInt(location)) {
				woeid_request(location, callback)
			//If they use a normal location
			} else {
				$.get("http://api.openweathermap.org/data/2.5/find?q=" + encodeURIComponent(location) + "&mode=json&cnt=0&" + Math.round(Math.random() * 1000000), function(locationData) {
					if (locationData.count != 0) {
						callback({zip: locationData.list[0].id, place: locationData.list[0].name})
					} else {
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

				url: 'http://api.openweathermap.org/data/2.5/forecast/daily?id=' + location.zip + "&cnt=4&mode=json&" + Math.round(Math.random() * 1000000),
				timeout: 10000,
				success: function(data) {

					//Weather Object
					weather = {}
					if (localStorage.stormcloud_average == "true") {
						weather.average = true
					}

					//Location
					weather.link = "http://openweathermap.org/Maps?zoom=11&lat=" + data.city.coord.lat + "&lon=" + data.city.coord.lon
					weather.place = location.place || data.city.name
					weather.country = data.city.country
					weather.zip = data.city.id

					//Temperature - not current temp (we're lying that it is)
					time = new Date().getHours()
					if (time >= 6 && time < 10) {
						var temp = data.list[0].temp.morn
					} else if (time >= 10 && time < 4) {
						var temp = data.list[0].temp.day
					} else if (time >= 4 && time < 8) {
						var temp = data.list[0].temp.eve
					} else {
						var temp = data.list[0].temp.night
					}

					if (localStorage.stormcloud_measurement == "c") {
						weather.temperature = Math.round((temp - 273.15)) + " &deg;"
					} else if (localStorage.stormcloud_measurement == "k") {
						weather.temperature = Math.round(temp) + " K"
					} else {
						weather.temperature = Math.round((temp - 273.15)* 1.8 + 32) + " &deg;"
					}

					//Wind
					weather.windSpeed = data.list[0].speed
					if (localStorage.stormcloud_speed != "ms") {
						weather.windSpeed = (localStorage.stormcloud_speed == "kph") ? Math.round(weather.windSpeed * 3.6) : Math.round(weather.windSpeed * 2.2369)
						weather.windUnit = (localStorage.stormcloud_speed == "kph") ? "kph" : "mph"
					}
					weather.windDirection = data.list[0].deg

					//Humidity
					weather.humidity =  data.list[0].humidity

					// //Weekly Weather
					weekArr = data.list
					weather.week = []
					for (var i=0; i<weekArr.length; i++) {
						weather.week[i] = {}
						weather.week[i].day = new Date(weekArr[i].dt * 1000).toDateString().substr(0,3)
						weather.week[i].code = weather_code(weekArr[i].weather[0].id)[0]

						if (localStorage.stormcloud_measurement == "c") {
							weather.week[i].low = Math.round(weekArr[i].temp.min - 273.15) + "&deg;"
							weather.week[i].high = Math.round(weekArr[i].temp.max - 273.15) + "&deg;"
							weather.week[i].average = Math.round(((weekArr[i].temp.min- 273.15) + (weekArr[i].temp.max- 273.15))/2) + "&deg;"
						} else if (localStorage.stormcloud_measurement == "k") {
							weather.week[i].low = Math.round(weekArr[i].temp.min) + "K"
							weather.week[i].high = Math.round(weekArr[i].temp.max) + "K"
							weather.week[i].average = Math.round((weekArr[i].temp.min + weekArr[i].temp.max)/2) + "K"
						} else {
							weather.week[i].low = Math.round((weekArr[i].temp.min - 273.15)* 1.8 + 32) + "&deg;"
							weather.week[i].high = Math.round((weekArr[i].temp.max - 273.15)* 1.8 + 32) + "&deg;"
							weather.week[i].average = Math.round((((weekArr[i].temp.min- 273.15) + (weekArr[i].temp.max- 273.15))* 1.8 + 32)/2) + "&deg;"
						}
					}

					//Current Weather
					weather.code = data.list[0].weather[0].id

					// Converts it into names etc
					weather.background = background(Math.round(weather_code(weather.code)[1]/2.2 + 45))
					weather.code = weather_code(weather.code)[0]

					if (localStorage.stormcloud_color == "gradient") {
						weather.background = background((temp - 273.15)* 1.8 + 32)
					}
					weather.gradientbackground = background((temp - 273.15)* 1.8 + 32)

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
			arr[arr.indexOf(weather.zip.toString())] = weather
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
						chrome.browserAction.setBadgeText({text: arr[0].temperature.replace(" &deg;", "°")})
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
						pyserver = exec("./unity.py " + arr[0].temperature.replace(" &deg;", ""))
					}
				}

				if (callbackfn) {
					callbackfn()
				}
			}
		}

		for (var i in locations) {
			//We need this so it's in the right order - stupid async programming
			arr[i] = locations[i].zip.toString()
			stormcloud_cli.dataGet.weather(locations[i], arr, callback)
		}
	}
}

function weather_code(a) {
	// Icon Name & Colour Percentage
    var b = {
    	200: ["Cloud-Lightning", 50],
		201: ["Cloud-Lightning", 50],
		202: ["Cloud-Lightning", 50],
		210: ["Cloud-Lightning", 50],
		211: ["Cloud-Lightning", 50],
		212: ["Cloud-Lightning", 50],
		221: ["Cloud-Lightning", 50],
		230: ["Cloud-Lightning", 50],
		231: ["Cloud-Lightning", 50],
		232: ["Cloud-Lightning", 50],
		300: ["Cloud-Drizzle", 40],
		301: ["Cloud-Drizzle", 40],
		302: ["Cloud-Drizzle", 40],
		310: ["Cloud-Drizzle", 40],
		311: ["Cloud-Drizzle", 40],
		312: ["Cloud-Drizzle", 40],
		321: ["Cloud-Drizzle", 40],
		500: ["Cloud-Rain", 30],
		501: ["Cloud-Rain", 30],
		502: ["Cloud-Rain", 30],
		503: ["Cloud-Rain", 30],
		504: ["Cloud-Rain", 30],
		511: ["Cloud-Rain", 30],
		520: ["Cloud-Rain", 30],
		521: ["Cloud-Rain", 30],
		522: ["Cloud-Rain", 30],
		600: ["Cloud-Snow", 0],
		601: ["Cloud-Snow", 0],
		602: ["Cloud-Snow", 0],
		611: ["Cloud-Snow", 0],
		621: ["Cloud-Snow", 0],
		800: ["Sun", 100],
		801: ["Sun", 100],
		701: ["Cloud-Fog", 40],
		711: ["Cloud-Fog", 40],
		721: ["Cloud-Fog", 40],
		731: ["Cloud-Fog", 40],
		741: ["Cloud-Fog", 40],
		802: ["Cloud-Sun", 80],
		803: ["Cloud-Sun", 80],
		803: ["Cloud", 50],
		900: ["Tornado", 50],
		901: ["Tornado", 50],
		902: ["Tornado", 50],
		903: ["Cloud", 0],
		904: ["Sun", 100],
		905: ["Cloud-Wind", 30],
		906: ["Cloud-Hail", 15]
    };
    return b[a]
}

// App Start
stormcloud_cli.render(JSON.parse(localStorage.stormcloud_location))

// Refreshes Every 1.5 hrs
setInterval(function() {
	stormcloud_cli.render(JSON.parse(localStorage.stormcloud_location))
}, 5400000)
