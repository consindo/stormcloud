window.app = "chrome"

$(function() {
	// Copy Ze localstorage over
	$("body").addClass(window.app)
	localStorage = chrome.extension.getBackgroundPage().localStorage
	stormcloud.reload()

	$("#panel .sliderControls img").click(function() {
		if ($(this).hasClass("left")) {
			slider.prev()
		} else {
			slider.next()
		}
	})
})

stormcloud = {
	reload: function() {

		var template = Handlebars.templates['pane.template'],
			weather = JSON.parse(localStorage.stormcloud_weathercache)

		$('#container ul').html("")

		for (var i in weather) {
			$("#container ul").append("<li style='display: none'><div></div></li>")
			$("#container li > div")[i].innerHTML = template(weather[i])
		}

		slider = new Swipe(document.getElementById('container'))
		stormcloud.textfix()

	},

	textfix: function() {
		$(".city").fitText(0.29)
		$(".left").fitText(0.17)
		$(".right").fitText(0.5)
		$(".forecast span.day, .forecast span.temp").fitText(0.17)
	}
}
