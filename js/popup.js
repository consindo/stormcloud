/*jshint asi: true*/
window.app = "chrome"

var stormcloud = {},
	slider = new Swipe(document.getElementById('container'))

$(function() {
	// Copy Ze localstorage over
	$("body").addClass(window.app).append(stormcloud.loadSettings())
	stormcloud.reload()

	$("#panel .sliderControls img").click(function() {
		if ($(this).hasClass("left")) {
			slider.prev()
		} else {
			slider.next()
		}
		stormcloud.posChange()
	})

	$("#panel .sync img").click(function() {
		$("#settings").toggle()
	})

	// So, it won't be instant but close enough (100secs)
	// Yes, I should have used a MVC framework
	setInterval(function() {
		stormcloud.softreload()
	}, 100000)
})

stormcloud.reload = function() {

	var template = Handlebars.templates['pane.template'],
		weather = JSON.parse(localStorage.stormcloud_weathercache)

	$('#container ul').html("")

	for (var i in weather) {
		$("#container ul").append("<li><div></div></li>")
		$("#container li > div")[i].innerHTML = template(weather[i])
	}

	slider = new Swipe(document.getElementById('container'))
	stormcloud.textfix()
	stormcloud.posChange()
}

stormcloud.softreload = function() {
	var template = Handlebars.templates['pane.template'],
		weather = JSON.parse(localStorage.stormcloud_weathercache)

	for (var i in weather) {
		$("#container li > div")[i].innerHTML = template(weather[i])
	}

	stormcloud.textfix()
	stormcloud.posChange()
}

stormcloud.posChange = function() {
	if (localStorage.stormcloud_color == "gradient") {
		$('#container').css('background-color', $($('.middle')[slider.getPos()]).attr("data-background"))
	} else {
		$('#container').css('background-color', localStorage.color)
	}
}

stormcloud.loadSettings = function() {

	// Reload Function
	var reload = function(type) {
		chrome.extension.getBackgroundPage().stormcloud_cli.render(
			JSON.parse(localStorage.stormcloud_location),
			function() {
				if (type == "hard") {
					stormcloud.reload()
				} else {
					stormcloud.softreload()
				}
			}
		)
	}

	var settingsObj = {}

	//Sets Speed & Temp Measurements
	settingsObj.measurement = $("<div><span data-type='c'><img src='img/climacons/Degrees-Celcius.svg'></span><span data-type='f'><img src='img/climacons/Degrees-Fahrenheit.svg'></span><span data-type='k'>K</span></div>").children().filter("[data-type=" + localStorage.stormcloud_measurement +"]").addClass("selected").parent().html()
	settingsObj.speed = $("<div><span data-type='mph'>mph</span><span data-type='kph'>kph</span><span data-type='ms'>m/s</span></div>").children().filter("[data-type=" + localStorage.stormcloud_speed +"]").addClass("selected").parent().html()
	settingsObj.location = JSON.parse(localStorage.stormcloud_location)
	if (localStorage.stormcloud_color == 'desktop') {
		settingsObj.desktop = true
	} else {
		settingsObj.desktop = false
	}

	//Translations Guff
	settingsObj.locationsText = $.i18n._("Locations")
	settingsObj.locationText = $.i18n._("Location")
	settingsObj.charmText = $.i18n._("Use Chameleonic Background")
	settingsObj.creditsText = $.i18n._("Credits")

	//Set up handlers if not already done
	if (!stormcloud.settingsHandles) {
		stormcloud.settingsHandles = true;

		//Sets up the Toggle Switches
		$('body').on('click', '.toggleswitch span', function() {
			$(this).parent().children().removeClass('selected')
			localStorage.setItem("stormcloud_" + $(this).parent().attr("class").replace("toggleswitch ", ""), $(this).addClass('selected').attr("data-type"))

			reload("hard")
		})

		$('body').on('click', '.color span', function() {
			localStorage.stormcloud_color = "#" + $(this).attr("data-color")
			if ($(this).attr("data-color") == "gradient") {
				$("#background").attr("style", "")
				localStorage.stormcloud_color = 'gradient'
			} else {
				$("#background").css('background', localStorage.stormcloud_color)
			}

			reload("soft")
		})

		$('body').on('click', '#desktopswitch', function() {
			if ($(this).is(':checked')) {
				localStorage.stormcloud_color = 'desktop'
			} else {
				localStorage.stormcloud_color = 'gradient'
			}
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
			chrome.extension.getBackgroundPage().stormcloud_cli.dataGet.zipcode($(locationInput).val(), function(data) {
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

				reload("hard")

				//Animate it =)
				$(this).hide()
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

				$(this).parent().addClass("deleting")
				var elem = $(this).parent()
				setTimeout(function() {
					elem.remove()
					localStorage.stormcloud_location = makeLocationArray()

					reload("hard")
				}, 600)
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
	return "<div id='settings'>" + Handlebars.templates['settings.template'](settingsObj) + "</div>"
}

stormcloud.textfix = function() {
	$(".city").fitText(0.29)
	$(".left").fitText(0.17)
	$(".right").fitText(0.5)
	$(".forecast span.day, .forecast span.temp").fitText(0.17)
}
