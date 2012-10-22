function getZipCode(location, callback) {
	//If it's a woeid, we bypass the first step
	if ($.isNumeric(location)) {
		woeid_request(location, callback)
	//If they use a normal location
	} else {
		$.get("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22" + encodeURIComponent(location) + "%22&format=xml", function(locationData) {
			// Gets the WOEID && Caches Location Name
			var woeid = $(locationData).children().children().children().first().children().filterNode("woeid").text()
			localStorage.stormcloud_location = $(locationData).children().children().children().first().children().filterNode("name").text()
			if (woeid) {
				// WOEID Request to find Global ZIP Code
				woeid_request(woeid, callback)
			} else {
				callback()
			}
		})
	}

	function woeid_request(woeid, callback) {
		$.get("http://weather.yahooapis.com/forecastrss?w=" + woeid, function(woeidData) {
			//Cache Name
			callback($(woeidData).children().children().children().filterNode("item").children().filterNode("guid").text().substring(0,8))
		})
	}
}

function getWeatherData(zipCode, callback) {
	$.ajax({
		url: 'http://xml.weather.yahoo.com/forecastrss/' + zipCode + '_f.xml?'+(Math.random() * 100),
		success: function(data) {
			$('#errorMessage').fadeOut(350)
			callback($(data).children().children().children())
		},
		error: function(data) {
			if (data.status === 0) {
				showError('network');
			}
		}
	});
}

function generateStats(data, callback) {
	//Weather Object
	weather = {}

	//Location
	weather.city = $(data).filterNode('yweather:location').attr("city")
	weather.country = $(data).filterNode('yweather:location').attr("country")

	//Temperature
	weather.temperature = $(data).filterNode('item').children().filterNode("yweather:condition").attr("temp")
	weather.temperatureUnit = $(data).filterNode('yweather:units').attr("temperature")

	//Wind
	weather.windUnit = $(data).filterNode('yweather:units').attr("speed")
	weather.windSpeed = $(data).filterNode('yweather:wind').attr("speed")
	weather.windDirection = $(data).filterNode('yweather:wind').attr('direction')

	//Humidity
	weather.humidity = $(data).filterNode('yweather:atmosphere').attr('humidity')

	//Weekly Weather
	weekArr = $(data).filterNode("item").children().filterNode("yweather:forecast")
	weather.week = []
	for (var i=0; i<4; i++) {
		weather.week[i] = {}
		weather.week[i].day = $(weekArr[i]).attr("day")
		weather.week[i].code = $(weekArr[i]).attr("code")
		weather.week[i].low = $(weekArr[i]).attr("low")
		weather.week[i].high = $(weekArr[i]).attr("high")
	}

	//Current Weather
	weather.code = $(data).filterNode('item').children().filterNode("yweather:condition").attr("code")
	if (weather.code == "3200") {
		weather.code = weather.week[0].code
	}

	if (callback) {
		callback(weather)
	}
}

function render(location) {
	$('.border .sync').addClass('busy');

	getWeatherData(location, function(rawdata) {
		generateStats(rawdata, function(weather) {
			$("#city").text(localStorage.stormcloud_location || weather.city)
			$("#code").text(weather_code(weather.code)).attr("class", "w" + weather.code)

			//Sets initial temp as Fahrenheit
			var temp = weather.temperature
			if (localStorage.stormcloud_measurement == "c") {
				temp = Math.round((weather.temperature -32)*5/9)
				$("#temperature").text(temp + " °")
			} else if (localStorage.stormcloud_measurement == "k") {
				temp = Math.round((weather.temperature -32)*5/9) + 273
				$("#temperature").text(temp + " K")
			} else {
				$("#temperature").text(temp + " °")
			}
			document.title = temp

			var windSpeed = weather.windSpeed
			if (localStorage.stormcloud_speed != "mph") {
				//Converts to either kph or m/s
				windSpeed = (localStorage.stormcloud_speed == "kph") ? Math.round(windSpeed * 1.609344) : Math.round(windSpeed * 4.4704) /10
			}
			$("#windSpeed").text(windSpeed)
			$("#windUnit").text((localStorage.stormcloud_speed == "ms") ? "m/s" : localStorage.stormcloud_speed)
			$("#humidity").text(weather.humidity + " %")

			//Background Color
			background(weather.temperature)

			//Weekly Bro.
			for (var i=0; i<4; i++) {
				$('#' + i + ' .day').text(weather.week[i].day)
				$('#' + i + ' .code').text(weather_code(weather.week[i].code))
				if (localStorage.stormcloud_measurement == "c") {
					$('#' + i + ' .temp').html(Math.round((weather.week[i].high -32)*5/9) + "°<span>" + Math.round((weather.week[i].low -32)*5/9) + "°</span>")
				} else if (localStorage.stormcloud_measurement == "k") {
					$('#' + i + ' .temp').html(Math.round((weather.week[i].high -32)*5/9) + 273 + "<span>" + Math.round((weather.week[i].low -32)*5/9 + 273)  + "</span>")
				} else {
					$('#' + i + ' .temp').html(weather.week[i].high + "°<span>" + weather.week[i].low + "°</span>")
				}
			}

			//Show Icon
			$('.border .sync, .border .settings').css("opacity", "0.8")
			$('#actualWeather').fadeIn(500)
			$("#locationModal").fadeOut(500)
			// spin the thing for 500ms longer than it actually takes, because
			// most of the time refreshing is actually instant :)
			setTimeout(function() { $('.border .sync').removeClass('busy'); }, 500)
		})
	})
}

function background(temp) {
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
			Math.round((left.color[2] * left.percent) + (right.color[2] * right.percent)),
		];
		return convert(blend);
	};

	//Sets Background Color
	if (localStorage.stormcloud_color == "gradient") {
		var percentage = Math.round((temp - 45) *  2.2)
		$("#container").css("background", blend(percentage))
	} else {
		$("#container").css("background", "#" + localStorage.stormcloud_color)
	}
}

// Converts Yahoo weather to icon font
function weather_code(a){var b={0:"(",1:"z",2:"(",3:"z",4:"z",5:"e",6:"e",7:"o",8:"3",9:"3",10:"9",11:"9",12:"9",13:"o",14:"o",15:"o",16:"o",17:"e",18:"e",19:"s",20:"s",21:"s",22:"s",23:"l",24:"l",25:"`",26:"`",27:"2",28:"1",29:"2",30:"1",31:"/",32:"v",33:"/",34:"v",35:"e",36:"v",37:"z",38:"z",39:"z",40:"3",41:"o",42:"o",43:"o",44:"`",45:"z",46:"o",47:"z",3200:"`"};return b[a]}

$(document).ready(function() {
	//Filters Proprietary RSS Tags
	jQuery.fn.filterNode = function(name){
	   return this.filter(function(){
	      return this.nodeName === name;
	   });
	};

	//APP START.
	init_settings()
	if (!localStorage.stormcloud) {
		show_settings("location")
	} else {
		//Has been run before
		render(localStorage.stormcloud)

		setInterval(function() {
			console.log("Updating Data...")
			$(".border .sync").click()
		}, 300000)
	}
});

function init_settings() {

	//Prevents Dragging on certain elements
	$('.border .settings, .border .sync, .border .close, #locationModal').mouseover(function() {
		document.title = "disabledrag"
	}).mouseout(function() {
		document.title = "enabledrag"
	}).click(function() {
		if ($(this).hasClass("close")) {
			document.title = 'close'
		} else if ($(this).hasClass("settings")) {
			show_settings("all")
		} else if ($(this).hasClass("sync")) {
			render(localStorage.stormcloud)
		}
	})

	//First Run
	var locationInput = $("#locationModal input")
	var typingTimer
	var doneTypingInterval = 1500

	//on keyup, start the countdown
	locationInput.keyup(function(){
	    typingTimer = setTimeout(doneTyping, doneTypingInterval)
	}).keydown(function(){
	//on keydown, clear the countdown
	    clearTimeout(typingTimer)
	});

	function doneTyping() {
		$("#locationModal .loader").attr("class", "loading loader").html("|")
		getZipCode(locationInput.val(), function(zipCode) {
			if (zipCode) {
				$("#locationModal .loader").attr("class", "tick loader").html("&#10003;").attr("data-code", zipCode)
			} else {
				$("#locationModal .loader").attr("class", "loader").html("&#10005;")
			}
		})
	}

	//This can only be run if there is a tick.
	$("#locationModal .loader").click(function() {
		if ($(this).hasClass("tick")) {
			localStorage.stormcloud = $("#locationModal .loader").attr("data-code")
			render(localStorage.stormcloud)
			show_settings("noweather")
			setInterval(function() {
				console.log("Updating Data...")
				$(".border .sync").click()
			}, 300000)
		}
	})

	// Sets up localstorage
	localStorage.stormcloud_measurement = (localStorage.stormcloud_measurement) ? localStorage.stormcloud_measurement : "f"
	localStorage.stormcloud_speed = (localStorage.stormcloud_speed) ? localStorage.stormcloud_speed : "mph"
	localStorage.stormcloud_color = (localStorage.stormcloud_color) ? localStorage.stormcloud_color : "gradient"
	localStorage.stormcloud_launcher = (localStorage.stormcloud_launcher) ? localStorage.stormcloud_launcher : "checked"

	$('#locationModal .measurement [data-type=' + localStorage.stormcloud_measurement + ']').addClass('selected')
	$('#locationModal .speed [data-type=' + localStorage.stormcloud_speed + ']').addClass('selected')

	//Sets up the Toggle Switches
	$('#locationModal .toggleswitch span').click(function() {
		$(this).parent().children().removeClass('selected')
		localStorage.setItem("stormcloud_" + $(this).parent().attr("class").replace("toggleswitch ", ""), $(this).addClass('selected').attr("data-type"))
	})

	//Color thing
	$('.color span').click(function() {
		localStorage.stormcloud_color = $(this).attr("data-color")
		background(null)
	})

	if (localStorage.stormcloud_launcher == "checked") {
		$('#locationModal .launcher input').attr("checked", "checked")
		document.title = "enable_launcher"
	}
	$('#locationModal .launcher input').click(function() {
		localStorage.stormcloud_launcher = $('#locationModal .retina input').attr("checked")
		if (localStorage.stormcloud_launcher == "checked") {
			document.title = "enable_launcher"
		} else {
			document.title = "disable_launcher"
		}
	})

	//Fuck CSS.
	$("span[data-color]:not([data-color=gradient])").map(function() { $(this).css('background', '#' + $(this).attr("data-color")) })

	/* Error Message Retry Button */
	$('#errorMessage .btn').click(function() {
		render(localStorage.stormcloud)
	})

}
function show_settings(amount) {

	if (amount == 'all') {
		$("#locationModal .full").show()
	} else if (amount == 'location') {
		$("#locationModal .full").hide()
	}

	if ($('#locationModal').css('display') != 'none') {
		//We do a render instead
		$(".border .sync").click()
		$("#locationModal").fadeOut(350)
		return;
	}

	//Show the Modal
	$("#locationModal").fadeToggle(350)
	if (amount != "noweather") {
		$("#actualWeather").fadeToggle(350)
	}
}
function showError() {
	$('#actualWeather').fadeOut(350)
	$('#errorMessage').fadeIn(350)
}