if (platform === 'wp') {
  var app = WinJS.Application
  var notifications = Windows.UI.Notifications
  var Imaging = Windows.Graphics.Imaging
}
var Planet = Backbone.Collection.extend({
  model: Location,

  isConnected: function () {
    // the windows phone api
    if (platform === 'wp') {
      var profile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile()
      if (profile) {
        return (profile.getNetworkConnectivityLevel() != Windows.Networking.Connectivity.NetworkConnectivityLevel.none);
      } else {
        return false;
      }
    // normal html5 api
    } else {
      return window.navigator.onLine
    }
  },

  refresh: function () {
    // make sure the internet works before even trying
    if (this.isConnected()) {
      var promises = []
      _(this.models).each(function (location) {
        promises.push(location.saveWeather())
      }, this)
      // regenerates the live tile of the first one tile
      if (platform === 'wp') {
        promises[0].done(function () {
          // enable notification cycling
          // finds out how retina the display is.
          var pixelRatio = settings.get('scale')
          var manager = notifications.TileUpdateManager.createTileUpdaterForApplication()
          manager.enableNotificationQueue(true)
          manager.clear()
          // passing as an object to have *some* code reuse
          var weatherData = {
            icon: 'ms-appx:///images/climacons/' + planetView.planet.models[0].get('code') + '.svg',
            place: planetView.planet.models[0].get('place'),
            temperature: planetView.planet.models[0].get('temperature').slice(0, -1),
            unit: settings.get('temperature').toUpperCase()
          }
          // update them seperately because I was too lazy to write a loop
          app.updateTile(weatherData, 'medium', pixelRatio, function () {
            // ahaha ahaha fuck you use branding none to disable the godamm namme
            var xml = notifications.TileUpdateManager.getTemplateContent(notifications.TileTemplateType.tileSquare150x150Image)
            xml.getElementsByTagName('binding')[0].setAttribute('branding', 'none')
            xml.getElementsByTagName('image')[0].setAttribute('src', 'ms-appdata:///local/medium.png')

            var tileNotification = new notifications.TileNotification(xml)
            manager.update(tileNotification)
          })
          app.updateTile(weatherData, 'small', pixelRatio, function () {
            var xml = notifications.TileUpdateManager.getTemplateContent(notifications.TileTemplateType.tileSquare71x71Image)
            xml.getElementsByTagName('image')[0].setAttribute('src', 'ms-appdata:///local/small.png')

            var tileNotification = new notifications.TileNotification(xml)
            manager.update(tileNotification)
          })
        })
        $.when.apply(this || window, promises).fail(function () {
          appView.showError('Error: could not connect. Please try again.')
        })
      }
    } else {
      appView.showError('Error: could not connect to internet.')
    }
  }
})
