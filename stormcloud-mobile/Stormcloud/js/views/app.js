var AppView = Backbone.View.extend({
  // el - stands for element. Every view has a element associate in with HTML
  //      content will be rendered.
  el: '#contenthost',
  page: 'index',

  // It's the first function called when this view it's instantiated.
  initialize: function () {
    _.bindAll(this, 'back')

    this.render()
  },
  // $el - it's a cached jQuery object (el), in which you can use jQuery functions
  //       to push content. Like the Hello World in this case.
  render: function(){
    this.$el.html('<div id="planetview-wrap-wrap"><div id="planetview-wrap"><div id="planetview"></div></div></div>\
      <div id="settings"></div>\
      <div id="adder"></div>\
    ')

    // start our various views
    window.planetView = new PlanetView()
    window.settingsView = new SettingsView()
    window.adderView = new AdderView()

    if (platform !== 'wp') {
      $('#bottombar .syncbutton').click(this.barHandler.refresh)
      $('#bottombar .settingsbutton').click(this.barHandler.settings)

      $("#settings img").click(this.back)
      $("#adder img").click(this.back)
    }
  },

  /* THIS PROBABLY SHOULD HAVE A REFACTOR BUT FUCKIT FOR NOW */
  back: function () {
    if (this.page === 'settings') {
      if (platform === 'wp') {
        WinJS.UI.Animation.turnstileBackwardOut(settingsView.el).done(function () {
          $(settingsView.el).css({ visibility: 'hidden' })

          // Show main window, also make sure the colour is good.
          $(planetView.el.parentElement.parentElement).show()
          planetView.scrollChange()
          WinJS.UI.Animation.turnstileBackwardIn(planetView.el.parentElement.parentElement)
        })
        Windows.UI.WebUI.Core.WebUICommandBar.getForCurrentView().visible = true
      } else {
        $(settingsView.el).css({ visibility: 'hidden' })
        $(planetView.el.parentElement.parentElement).show()
        $("#bottombar").css({ visibility: 'visible' })
      }

      this.page = 'index'
      return true;
      // navgiating out from the adder thing
    } else if (this.page === 'adder') {
      if (platform === 'wp') {
        WinJS.UI.Animation.slideDown(adderView.el).done(function () {
          $(adderView.el).hide()
          WinJS.UI.Animation.continuumForwardIn(settingsView.el)
        })
      } else {
        $(adderView.el).hide()
      }
      this.page = 'settings'
      return true;
    }
    // we get out of the app
  },

  showError: function (msg) {
    console.error(msg)
    if (platform === 'wp') {
      var notifications = Windows.UI.Notifications

      // Get the toast notification manager for the current app.
      var notificationManager = notifications.ToastNotificationManager

      // The getTemplateContent method returns a Windows.Data.Xml.Dom.XmlDocument object
      // that contains the toast notification XML content.
      var toastXml = notificationManager.getTemplateContent(notifications.ToastTemplateType[notifications.ToastTemplateType.toastText02])

      var toastTextElements = toastXml.getElementsByTagName("text")
      toastTextElements[0].appendChild(toastXml.createTextNode(msg))

      // Create a toast notification from the XML, then create a ToastNotifier object
      // to send the toast.
      var toast = new notifications.ToastNotification(toastXml)
      toast.expirationTime = new Date(Date.now() + 5000)

      notificationManager.createToastNotifier().show(toast)
    }
  },

  barHandler: {
    map: function (e) {
      var uri = Windows.Foundation.Uri(planetView.planet.models[planetView.currentLocation()].get('link'))
      Windows.System.Launcher.launchUriAsync(uri)
    },

    refresh: function (e) {
      planetView.reflow()
      planetView.planet.refresh()
    },

    settings: function (e) {
      if (platform === 'wp') {
        // Animate in
        WinJS.UI.Animation.turnstileForwardOut(planetView.el.parentElement.parentElement).done(function () {
          $(planetView.el.parentElement.parentElement).hide()
          $(settingsView.el).css({ visibility: 'visible' })
          WinJS.UI.Animation.turnstileForwardIn(settingsView.el)
        })

        Windows.UI.WebUI.Core.WebUICommandBar.getForCurrentView().visible = false
      } else {
        $(planetView.el.parentElement.parentElement).hide()
        $(settingsView.el).css({ visibility: 'visible' })
        $("#bottombar").css({ visibility: 'hidden' })
      }

      // Set new page location
      appView.page = 'settings'
    }
  }
});
