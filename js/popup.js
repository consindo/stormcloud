/*jshint asi: true*/

// So we dont have to define twice
try {
  chrome
  window.app = "chrome"
} catch(err) {
  window.app = "linux"
}


var stormcloud = {},
    slider = new Swipe(document.getElementById('container'))

$(function() {

  //Node Webkit Guff
  if (window.app === "linux") {

    // Load native UI library
    var gui = require('nw.gui')
    var win = gui.Window.get()
    win.show()
    win.showDevTools()

    //Bind Handlers
    $("#panel .close").click(function() {
      win.close()
    })

    $("#panel .minimize").click(function() {
      win.minimize()
    })

    //Opens links in browsers
    $('body').on("click", "a", function(e) {
      e.preventDefault()
      gui.Shell.openExternal($(e.currentTarget).attr("href"))
    })

    $(document).keydown(function(e){
      if (e.keyCode === 37) {
        $(".sliderControls .left").trigger("click")
      } else if (e.keyCode === 39) {
        $(".sliderControls .right").trigger("click")
      }
    });

    //Disables Dragging on Certain Elements
    $('body').on("mouseover", ".close, .minimize, .sync, .sliderControls, #settings, #credits a, #credits img, .city div span", function() {
      $('body').removeClass('drag')
    }).on("mouseout", ".close, .minimize, .sync, .sliderControls, #settings, #credits a, #credits img, .city div span", function() {
      $('body').addClass('drag')
    })

  } else if (window.app === "chrome") {
    $("body").removeClass('drag')
    console.log("Running under Chrome")
  }


  $("body").addClass(window.app).addClass(localStorage.stormcloud_font).append(stormcloud.loadSettings())
  stormcloud.reload()

  // Colourizes CSS because I'm an asshole and used HTML to style
  $("span[data-color]:not([data-color=gradient])").map(function() {
    $(this).css('background', '#' + $(this).attr("data-color"))
  })

  // Adds font in
  $("#settings .font").val(localStorage.stormcloud_font)

  $("#accordion").collapse({
    accordion: true,
    persist: false,
    open: function() {
      this.addClass("open")
      this.css({ height: this.children().outerHeight() })
    },
    close: function() {
      this.css({ height: "0px" })
      this.removeClass("open")
    }
   })

  //Sets up Credits
  document.getElementById('credits').innerHTML = Handlebars.templates['credits.template']()

  // Various Handlers
  $("body").on("click", "a.credits", function() {
    $("#credits").addClass("show anim")
  })
  $("#credits img").click(function() {
    $("#credits").removeClass("show")
  })

  $("#panel .sliderControls img").click(function() {
    if ($(this).hasClass("left")) {
      slider.prev()
    } else {
      slider.next()
    }
    stormcloud.posChange()
  })

  $("#panel .sync").click(function() {
    $(this).addClass("pulse")
    if (window.app === "chrome") {
      chrome.extension.getBackgroundPage().stormcloud_cli.render(JSON.parse(localStorage.stormcloud_location), function() {
        stormcloud.softreload()
      })
    } else {
      stormcloud_cli.render(JSON.parse(localStorage.stormcloud_location), function() {
        stormcloud.softreload()
      })
    }
  }).trigger("click")


  $("#panel").click(function(e) {
    if ($(e.target).hasClass("settingsImg")) {
      $("#settings").fadeToggle(200)
      if ($("#settings").is(":visible") && $($("#accordion").children()[1]).attr("aria-hidden") == "true") {
        $("#accordion").children().first().find("a").trigger("click")
      }
    } else {
      if ($("#settings").is(":visible")) {
        $("#settings").fadeOut(200)
      }
    }
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

  // Hardcoded dimensions
  if (window.app === "linux") {
    stormcloud.dimensions(300, 500)
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

  // This shouldn't need to be here but bugs.
  if (window.app === "linux") {
    stormcloud.dimensions(300, 500)
  }

  stormcloud.textfix()
  stormcloud.posChange()
  $("#panel .sync").removeClass("pulse")
}

stormcloud.posChange = function() {
  if (localStorage.stormcloud_color === "gradient" || localStorage.stormcloud_color === "weather") {
    $('#container').css('background-color', $($('.middle')[slider.getPos()]).attr("data-background"))
  } else if (localStorage.stormcloud_color === "desktop") {
    $('#container').css('background-color', stormcloud.getUnityDesktopBackgroundColor())
  } else {
    $('#container').css('background-color', localStorage.stormcloud_color)
  }
}

stormcloud.loadSettings = function() {

  var settingsObj = {}

  //Sets Speed & Temp Measurements
  settingsObj.measurement = $("<div><span data-type='c'><img src='img/climacons/Degrees-Celcius.svg'></span><span data-type='f'><img src='img/climacons/Degrees-Fahrenheit.svg'></span><span data-type='k'>K</span></div>").children().filter("[data-type=" + localStorage.stormcloud_measurement +"]").addClass("selected").parent().html()
  settingsObj.speed = $("<div><span data-type='mph'>mph</span><span data-type='kph'>kph</span><span data-type='ms'>m/s</span></div>").children().filter("[data-type=" + localStorage.stormcloud_speed +"]").addClass("selected").parent().html()

  // This is bad practice. I should fix this.
  settingsObj.gradient = $("<div><span data-type='gradient' data-color='gradient'>Temperature</span><span data-type='weather' data-color='weather'>Weather</span></div>").children().filter("[data-type=" + localStorage.stormcloud_color +"]").addClass("selected").parent().html()
  if (settingsObj.gradient === undefined) {
    settingsObj.gradient = "<span data-type='gradient' data-color='gradient'>Temperature</span><span data-type='weather' data-color='weather'>Weather</span>"
  }

  settingsObj.location = JSON.parse(localStorage.stormcloud_location)
  if (localStorage.stormcloud_color === 'desktop') {
    settingsObj.desktop = true
  } else {
    settingsObj.desktop = false
  }

  //Translations Guff
  settingsObj.locationsText = $.i18n._("Locations")
  settingsObj.appearanceText = $.i18n._("Appearance")
  settingsObj.otherText = $.i18n._("Other")
  settingsObj.locationText = $.i18n._("Add Location")
  settingsObj.charmText = $.i18n._("Use Chameleonic Background")
  settingsObj.creditsText = $.i18n._("Credits")
  settingsObj.proText = $.i18n._("Go Pro")

  //Set up handlers if not already done
  if (!stormcloud.settingsHandles) {
    stormcloud.settingsHandles = true;

    // Reload Function
    var reload = function(type) {

      if (window.app === "chrome") {
        chrome.extension.getBackgroundPage().stormcloud_cli.render(JSON.parse(localStorage.stormcloud_location),
          function() {
            if (type === "hard") {
              stormcloud.reload()
            } else {
              stormcloud.softreload()
            }
          })
      } else {
        stormcloud_cli.render(JSON.parse(localStorage.stormcloud_location),
          function() {
            if (type === "hard") {
              stormcloud.reload()
            } else {
              stormcloud.softreload()
            }
          })
      }
    }

    //Sets up the Toggle Switches
    $('body').on('click', '.toggleswitch span', function() {
      $(this).parent().children().removeClass('selected')
      console.log($(this).parent().attr("class"))
      localStorage.setItem("stormcloud_" + $(this).parent().attr("class").replace("toggleswitch ", ""), $(this).addClass('selected').attr("data-type"))

      reload("hard")
    })

    $('body').on('change', '.font', function() {
      $('body').removeClass(localStorage.stormcloud_font).addClass($(this).val())
      localStorage.stormcloud_font = $(this).val()
    })

    $('body').on('click', '.color.boxes span', function() {
      localStorage.stormcloud_color = "#" + $(this).attr("data-color")
      $(".toggleswitch.color").children().removeClass("selected")
      if ($(this).attr("data-color") === "gradient") {
        $("#background").attr("style", "")
        localStorage.stormcloud_color = 'gradient'
        $(".toggleswitch.color [data-color=gradient]").addClass("selected")
      } else {
        $("#container").css('background', localStorage.stormcloud_color)
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

      var callback = function(data) {
        if (data === undefined) {
          $(statusElem).attr('class', 'error status')
        } else {
          $(statusElem).attr({'class': 'success status', 'data-code': data.zip, 'data-place': data.place})
        }
      }

      if (window.app === "chrome") {
        chrome.extension.getBackgroundPage().stormcloud_cli.dataGet.zipcode($(locationInput).val(), function(data) {
          callback(data)
        })
      } else {
        stormcloud_cli.dataGet.zipcode($(locationInput).val(), function(data) {
          callback(data)
        })
      }

    }

    // This is the little tick icon that appears
    $('body').on('click', statusElem, function() {
      if ($(this).hasClass('success')) {
        $('.locationSettings ul li.placeInput').before('<li data-code="' + $(this).attr('data-code') + '"><span class="name">' + $(this).attr('data-place') + '</span><span class="delete">&#10005;</span></li>')
        $(this).removeClass('success')
        $('.locationSettings ul li.placeInput input').val("")

        //Save to LocalStorage
        localStorage.stormcloud_location = makeLocationArray()

        reload("hard")

        // Adjusts height of window
        $(".locationSettings").parent().parent().height($(".locationSettings").parent().outerHeight())
      }
    })

    // The remove button next to a location.
    $('body').on('click', '.locationSettings ul li .delete', function() {
      if ($('.locationSettings ul li').length !== 2) {

        $(this).parent().addClass("deleting")
        var elem = $(this).parent()
        setTimeout(function() {
          elem.remove()
          localStorage.stormcloud_location = makeLocationArray()

          reload("hard")

          $(".locationSettings").parent().parent().height($(".locationSettings").parent().outerHeight())
        }, 600)
      }
    })
  }

  var makeLocationArray = function() {
    var obj = []
    $('.locationSettings ul li:not(:last-child)').map(function() {
      obj.push({zip: $(this).attr("data-code"), place: $(this).find('.name').text()})
    })
    return JSON.stringify(obj)
  }
  return "<div id='settings'>" + Handlebars.templates['settings.template'](settingsObj) + "</div>"
}

stormcloud.dimensions = function(width, height) {
  $("#background, .middle").width(width).height(height)
}

stormcloud.textfix = function() {
  $(".city").fitText(0.29)
  $(".left").fitText(0.17)
  $(".right").fitText(0.5)
  $(".forecast span.day").fitText(0.17)
  $(".forecast span.temp").fitText(0.15)
}

stormcloud.getUnityDesktopBackgroundColor = function() {
  //Going to just do straight dom so I don't have to deal with nodes async model
  try {
    var exec = require('child_process').exec;
    exec("xprop -root | grep _GNOME_BACKGROUND_REPRESENTATIVE_COLORS", function(error, stdout) {
      if (error === null) {
        $("#container").css("background-color", stdout.substring(51, stdout.length -2))
      } else {
        $("#container").css("background-color", "#444444")
      }
    })
  } catch (err) {

  }
}
