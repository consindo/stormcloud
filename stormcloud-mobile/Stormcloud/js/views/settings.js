var SettingsView = Backbone.View.extend({
  el: "#settings",

  initialize: function () {
    _.bindAll(this, 'render')

    var self = this;
    var timeout;

    // something something name attributes are insecure
    if (platform === 'wp') {
      MSApp.execUnsafeLocalFunction(function () {
        self.el.innerHTML = SettingsTemplate()
      })

      // make the actual pivot
      new WinJS.UI.Pivot(document.getElementById('hub'), { title: 'SETTINGS' })
    } else {
      self.el.innerHTML = SettingsTemplate()
    }

    // set the prefs
    // at this point I gave up with the DOM and started using Zepto.js
    $('#temperature-scale-' + settings.get('temperature')).prop('checked', true)
    $('#speed-scale-' + settings.get('speed').replace('/', '')).prop('checked', true)
    $('#background-color-' + settings.get('color')).prop('checked', true)

    // bind the change events to save the data
    $('[name=speed-scale], [name=temperature-scale], [name=background-color]').on('change', this.save).on('change', function () {
      var timeoutFn = function () {
        planetView.planet.trigger('requestRefresh')
      }
      // set the thing to run after a second, just to not flood the users internet.
      clearTimeout(timeout)
      timeout = setTimeout(timeoutFn, 1500)
    })

    // render the location page
    this.render()

    planetView.planet.bind('add', this.render)
    planetView.planet.bind('remove', this.render)

    $("#addLocation").click(function () {
      if (platform === 'wp') {
        WinJS.UI.Animation.continuumBackwardOut(settingsView.el).done(function () {
          $(adderView.el).show()
          WinJS.UI.Animation.slideUp(adderView.el).done(function () {
            // invoke the keyboard
            $("#locationQuery").focus()
          })
        })
      } else {
        $(adderView.el).show()
        $("#locationQuery").focus()
      }
      appView.page = 'adder'
    })

    // handler for adding current location
    $('#addCurrentLocation').click(function () {
      // we're going to do something different - location is calculated on the fly
      planetView.planet.push(new Location({
        zip: 'current',
        place: 'Current Location'
      }))
    })
  },

  render: function () {
    var locList = $(this.el).find('.locationSettingsList')[0]
    // add the locations to the ui
    var htmlstr = ''
    var currentButton = true
    _(planetView.planet.models).each(function (location) {
      if (location.get('zip') === 'current') {
        htmlstr += '<h3 data-zip="' + location.get('zip') + '">Current Location</h3>'
        currentButton = false
      } else {
        htmlstr += '<h3 data-zip="' + location.get('zip') + '">' + location.get('place') + '</h3>'
      }
    }, this)
    locList.innerHTML = htmlstr

    // show or hide depending if the current location is already added
    $('#addCurrentLocation').toggle(currentButton)

    // handler for our popup menu
    $(locList).find('h3').on('click', function (e) {
      // make sure we have at least one location
      if (planetView.planet.length > 1) {
        var removeLocation = function(zip) {
          var location = planetView.planet.find(function (n) {
            if (n.get('zip') == zip) {
              return true
            }
          })
          location.destroy()
        }

        // create a popup
        var zip = $(e.currentTarget).attr('data-zip')
        if (platform === 'wp') {
          var popup = new Windows.UI.Popups.PopupMenu()
          popup.commands.append(new Windows.UI.Popups.UICommand("remove", function (e) {
            // look through our collection for the thing to destroy
            removeLocation(zip)
          }))
          var pos = $(e.target).offset()
          popup.showAsync({ x: pos.left, y: pos.top + pos.height })
        } else {
          if (confirm('Are you sure you want to remove ' + $(e.target).text() + '?')) {
            removeLocation(zip)
          }
        }
      }
    })
  },

  save: function () {
    settings.set('temperature', $("[name=temperature-scale]:checked").val())
    settings.set('speed', $("[name=speed-scale]:checked").val())
    settings.set('color', $("[name=background-color]:checked").val())
  }
})
