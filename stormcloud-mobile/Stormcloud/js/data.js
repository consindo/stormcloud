var settings = new Settings()
var planet = new Planet()

// create ze settings. not even sure if this is required anymore.
if (typeof (window) !== "undefined") {
  window.settings = settings
  window.planet = planet
}

(function () {

  var prefs;

  // apparently we should use localsettings for things that change less often
  // and localstorage for things that are more frequent
  if (platform === 'wp') {
    var localSettings = Windows.Storage.ApplicationData.current.localSettings.values
    var localStorage = WinJS.Application.local
  } else {
    var localSettings = window.localStorage
  }

  // read & set prefs
  if (localSettings['prefs']) {
    prefs = JSON.parse(localSettings['prefs'])
    settings.set(prefs)
  }

  // our saving function
  var save = function () {
    localSettings['prefs'] = JSON.stringify(settings.toJSON())

    if (platform === 'wp') {
      // weather data is stored in a more special way, one that can handle more data
      Windows.Storage.ApplicationData.current.localFolder
        .createFileAsync('locations.json', Windows.Storage.CreationCollisionOption.replaceExisting)
        .then(function (file) {
          var text = JSON.stringify(planet.toJSON())
          return Windows.Storage.FileIO.writeTextAsync(file, text)
        }).done(null, function (err) {
          // there was an error, so I think we'll just throw it away.
          // what's the worse that can happen?
          console.log("saveConfigFileAsync failed: ", err)
        }
      )
    } else {
      localSettings['locations'] = JSON.stringify(planet.toJSON())
    }
  }

  settings.on('change', save)

  // this sis so we can share code
  var bindPlanet = function(text) {
    // something else bad happened when saving last time.
    if (text.length === 0) {
      text = '[{"zip":"current"},{}]'
    }

    // I don't think there's a nice way to set the contents of a binding list
    var arr = JSON.parse(text).forEach(function (v) {
      planet.push(new Location(v))
    })

    // bind our events here to avoid unecessary io
    planet.bind('add', save)
    planet.bind('change', save)
    planet.bind('remove', save)

    // this is for our background webworker.
    planet.trigger('ready')
  }

  // read weather, async
  if (platform === 'wp') {
    Windows.Storage.ApplicationData.current.localFolder.getFileAsync('locations.json').then(
      function complete(file) {
        return Windows.Storage.FileIO.readTextAsync(file)
      },
       function (err) {
        return ''
      }).then(function (text) {
        bindPlanet(text)
      }
    )
  } else {
    // read & set planet. much easier on html5
    if (localSettings['locations']) {
      bindPlanet(localSettings['locations'])
    } else {
      bindPlanet('')
    }
  }
})()
