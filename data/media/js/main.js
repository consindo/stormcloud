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
	localStorage.stormcloud_launcher = localStorage.stormcloud_launcher || "checked"
	localStorage.stormcloud_location = localStorage.stormcloud_location || '[{"zip":"MYXX0008", "place": "Kuala Lumpur"}, {"zip":"USCA0091", "place": "Bieber"}, {"zip":"SWXX0031", "place": "Stockholm"}]'
})()

//UI Start
$(function() {

	//Sets up Background Color
	if (localStorage.stormcloud_color != "gradient") {
		$("#background").css('background', localStorage.stormcloud_color)
	}

	slider = new Swipe(document.getElementById('container'));

	$(".sliderControls img").click(function() {
		if ($(this).hasClass("right") && slider.getPos() != slider.length - 1) {
			slider.next()
		} else if ($(this).hasClass("left")) {
			slider.prev()
		}
		stormcloud.posChange()
	})

	$(document).keydown(function(e){
		if (e.keyCode == 37) {
			$(".sliderControls .left").trigger("click")
		} else if (e.keyCode == 39) {
			$(".sliderControls .right").trigger("click")
		}
	});

	$(".sync").click(function() {
		stormcloud.softReload()
	})

	//Tell Python / Wrapper some settings
	stormcloud.postSettings()
	stormcloud.softReload()

	//Sets up Credits
	document.getElementById('credits').innerHTML = Handlebars.templates['credits.template']()
	$("body").on("click", "a.credits", function() {
		$("#credits").addClass("show anim")
	})
	$("#credits img").click(function() {
		$("#credits").removeClass("show")
	})
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
						place = $($(locationData).find("name")).text()
					if (woeid) {
						woeid_request({woeid: woeid, place: place}, callback)
					} else {
						callback()
					}
				})
			}

			// WOEID Request to find Global ZIP Code
			function woeid_request(obj, callback) {
				$.get("http://weather.yahooapis.com/forecastrss?w=" + encodeURIComponent(obj.woeid), function(woeidData) {
					callback({zip: $($(woeidData).find("guid")).text().substring(0,8), place: obj.place})
				})
			}
		},
		weather: function(location, callback) {
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

					if (callback) {
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

	posChange: function() {
		// Settings fade out sync icon
		if (slider.getPos() == JSON.parse(localStorage.stormcloud_location).length) {
			$('#panel').addClass("dim")
		} else if (stormcloud.reload == true) {
			//We need to reload stormcloud
			stormcloud.reload = false
			stormcloud.softReload()
		} else {
			//We'll change the background here as well
			$('#container').css('background-color', $($('.middle')[slider.getPos()]).attr("data-background"))
			$("#panel").removeClass("dim")
		}
	},

	render: function(locations) {
		var template = Handlebars.templates['pane.template'],
			arr = []

		for (var i in locations) {
			//We need this so it's in the right order - stupid async programming
			arr[i] = locations[i].zip
			stormcloud.dataGet.weather(locations[i], function(weather) {
				$("#container li > div")[arr.indexOf(weather.zip)].innerHTML = template(weather)
				stormcloud.textfix()
				stormcloud.posChange()

				// If the first location loads, fade everything in
				if (arr.indexOf(weather.zip) == 0) {
					setTimeout(function() {
						$("#container, #panel").removeClass("transparent")
						$("#spinner").addClass("transparent")
					}, 50)
					setTimeout(function() {
						stormcloud.spinner.stop()
					}, 400)
				}
			})
		}
	},

	loadSettings: function() {

		var settingsObj = {}

		//Sets Speed & Temp Measurements
		settingsObj.measurement = $("<div><span data-type='c'><img src='img/climacons/Degrees-Celcius.svg'></span><span data-type='f'><img src='img/climacons/Degrees-Fahrenheit.svg'></span><span data-type='k'>K</span></div>").children().filter("[data-type=" + localStorage.stormcloud_measurement +"]").addClass("selected").parent().html()
		settingsObj.speed = $("<div><span data-type='mph'>mph</span><span data-type='kph'>kph</span><span data-type='ms'>m/s</span></div>").children().filter("[data-type=" + localStorage.stormcloud_speed +"]").addClass("selected").parent().html()
		settingsObj.location = JSON.parse(localStorage.stormcloud_location)
		settingsObj.launcher = localStorage.stormcloud_launcher
		if (settingsObj.launcher == 'false') {
			settingsObj.launcher = false
		}

		//Set up handlers if not already done
		if (!stormcloud.settingsHandles) {
			stormcloud.settingsHandles = true;

			//Sets up the Toggle Switches
			$('body').on('click', '.toggleswitch span', function() {
				$(this).parent().children().removeClass('selected')
				localStorage.setItem("stormcloud_" + $(this).parent().attr("class").replace("toggleswitch ", ""), $(this).addClass('selected').attr("data-type"))
				stormcloud.reload = true
			})

			$('body').on('click', '.color span', function() {
				localStorage.stormcloud_color = "#" + $(this).attr("data-color")
				if ($(this).attr("data-color") == "gradient") {
					$("#background").attr("style", "")
					localStorage.stormcloud_color = 'gradient'
				} else {
					$("#background").css('background', localStorage.stormcloud_color)
				}
				stormcloud.reload = true
			})

			$('body').on('click', '#launcherswitch', function() {
				localStorage.stormcloud_launcher = $('#launcherswitch').is(':checked')
				stormcloud.postSettings()
			})

			$('body').on('click', '.locationSettings .add', function() {
				$('.locationSettings ul .placeInput').val('').show()
			})

			var locationInput = '.locationSettings ul li.placeInput input',
				doneTypingInterval = 1500,
				typingTimer = '',
				statusElem = '.locationSettings ul li.placeInput .status'

			//on keyup, start the countdown
			$('body').on('keyup', locationInput, function(){
				typingTimer = setTimeout(doneTyping, doneTypingInterval)
			}).on('keydown', locationInput, function(){
			//on keydown, clear the countdown
				clearTimeout(typingTimer)
			})

			var doneTyping = function() {
				$(statusElem).attr('class', 'thinking status')
				stormcloud.dataGet.zipcode($(locationInput).val(), function(data) {
					if (data === undefined) {
						$(statusElem).attr('class', 'error status')
					} else {
						$(statusElem).attr({'class': 'success status', 'data-code': data.zip, 'data-place': data.place})
					}
				})
			}

			// This is the little tick icon that appears
			$('body').on('click', statusElem, function() {
				if ($(this).hasClass('success')) {
					$('.locationSettings ul li.placeInput').after('<li style="display:none"data-code="' + $(this).attr('data-code') + '"><span class="name">' + $(this).attr('data-place') + '</span><span class="delete">&#10005;</span></li>')
					$(this).removeClass('success')
					$('.locationSettings ul li.placeInput input').addClass("mimic")

					//Save to LocalStorage
					localStorage.stormcloud_location = makeLocationArray()

					//Animate it =)
					$(this).hide()
					stormcloud.reload = true

					setTimeout(function() {
						$('.locationSettings ul li.placeInput').hide().find('input').val('')
						$($('.locationSettings ul li')[1]).show()
						$('.locationSettings ul li.placeInput input').removeClass("mimic")
						$(statusElem).show()
					}, 700)
				}
			})

			// The remove button next to a location.
			$('body').on('click', '.locationSettings ul li .delete', function() {
				if ($('.locationSettings ul li').length != 2) {
					$(this).parent().remove()
					localStorage.stormcloud_location = makeLocationArray()
					stormcloud.reload = true
				}
			})
		}

		var makeLocationArray = function() {
			var obj = []
			$('.locationSettings ul li:not(:first-child)').map(function() {
				obj.push({zip: $(this).attr("data-code"), place: $(this).find('.name').text()})
			})
			return JSON.stringify(obj)
		}
		return "<li style='display: none'><div id='settings'>" + Handlebars.templates['settings.template'](settingsObj) + "</div></li>"
	},

	postSettings: function() {
		//This tells python to do shit
		if (localStorage.stormcloud_launcher == "true") {
			document.title = "enable_launcher"
		} else {
			document.title = "disable_launcher"
		}
	},

	textfix: function() {
		$(".city").fitText(0.29)
		$(".left").fitText(0.17)
		$(".right").fitText(0.5)
		$(".forecast span.day, .forecast span.temp").fitText(0.17)
	},

	softReload: function() {
		var obj = JSON.parse(localStorage.stormcloud_location),
			opts = {
				color: '#fff',
				lines: '13',
				length: '1',
				width: '3',
				radius: '8',
				corners: '10',
				rotate: '0',
				trail: '6',
				speed: '1.0',
				hwaccel: 'o'
			}

		$('#panel').show()
		stormcloud.spinner = new Spinner(opts).spin(document.getElementById("spinner"))
		$("#spinner").removeClass("transparent")
		$('#container, #panel').addClass("transparent")

		//This all gets timed out because of animations....
		setTimeout(function() {
			$('#container ul').html("")

			for (var i in obj) {
				$("#container ul").append("<li style='display: none'><div></div></li>")
			}

			$("#container ul").append(stormcloud.loadSettings())
			$("span[data-color]:not([data-color=gradient])").map(function() {
				$(this).css('background', '#' + $(this).attr("data-color"))
			})

			slider = new Swipe(document.getElementById('container'));
			stormcloud.render(obj)
		}, 350)
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
