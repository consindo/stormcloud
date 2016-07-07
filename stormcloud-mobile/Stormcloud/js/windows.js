(function () {

  platform = 'wp'

  var app = WinJS.Application
  var activation = Windows.ApplicationModel.Activation

  WinJS.UI.Pages.define("windows.html", {

    ready: function (element, options) {
      // add listeners for our appbar
      document.getElementById('mapBtn').addEventListener('click', appView.barHandler.map)
      document.getElementById('refreshBtn').addEventListener('click', appView.barHandler.refresh)
      document.getElementById('settingsBtn').addEventListener('click', appView.barHandler.settings)

      // handle back button
      app.onbackclick = appView.back

      // set the pixel density for the background helper
      settings.set('scale', Windows.Graphics.Display.DisplayInformation.getForCurrentView().rawPixelsPerViewPixel)

      // register the background task to run every 30 mins
      if (Windows.ApplicationModel.Background.BackgroundTaskRegistration.allTasks.size < 1) {
        app.register()
      }
    }
  })

  app.register = function () {
    app.registerBackgroundTask("background.js",
      "RefreshWeatherTile",
      new Windows.ApplicationModel.Background.TimeTrigger(30, false),
    null);
  }
  app.unregister = function () {
    Windows.ApplicationModel.Background.BackgroundTaskRegistration.allTasks.first().current.value.unregister(true)
  }

  //way too many params
  app.updateTile = function (weatherData, tile, scale, callback) {
    var size = 168
    if (tile === 'small') {
      size = 79.5
    }
    if (weatherData.unit != 'K') {
      weatherData.unit = '°'
    }

    var canvas = document.createElement('canvas')
    canvas.width = size * scale
    canvas.height = size * scale
    var ctx = canvas.getContext('2d')

    // draw location name
    ctx.fillStyle = "#fff"
    if (tile === 'small') {
      ctx.font = "600 " + 10 * scale + " Segoe WP"
      ctx.fillText(weatherData.place, 7.5 * scale, scale * size - 8 * scale)
    } else {
      ctx.font = "600 " + 16 * scale + " Segoe WP"
      ctx.fillText(weatherData.place, 9.5 * scale, scale * size - 10 * scale)
    }

    // draw the icon
    var img = new Image()
    img.setAttribute('src', weatherData.icon)
    img.setAttribute('id', 'temp')
    // stupid hack to render to dom to actually get the width and height
    document.body.appendChild(img)
    img.onload = function () {
      var elem = $('#temp')
      img.width = elem.width()
      img.height = elem.height()
      elem.remove()
      // This is such a stupid positioning code. fml.
      // handles different font size & kelvin. I'm fucking amazing.
      var factor = size / 1.7 / img.width * scale
      var str = weatherData.temperature + weatherData.unit
      var fontsize
      if (tile == 'small') {
        if (weatherData.unit == 'K') {
          fontsize = 50 / str.length
        } else {
          fontsize = 55 / str.length
        }
        ctx.drawImage(img, (size * scale / 2) - img.width * factor / 1.2, (size * scale / 2) - img.height * factor / 2 - factor, img.width * factor, img.height * factor)
      } else {
        if (weatherData.unit == 'K') {
          fontsize = 110 / str.length
        } else {
          fontsize = 120 / str.length
        }
        ctx.drawImage(img, (size * scale / 2) - img.width * factor / 1.15, (size * scale / 2) - img.height * factor / 2 - factor, img.width * factor, img.height * factor)
      }
      ctx.font = "600 " + fontsize * scale + " Segoe WP"
      if (tile == 'small') {
        ctx.fillText(str, (size * scale / 2) + 8 * scale, (size * scale / 2) + scale * fontsize / 3 - factor)
      } else {
        ctx.fillText(str, (size * scale / 2) + 12 * scale, (size * scale / 2) + scale * fontsize / 3 - factor)
      }

      Windows.Storage.ApplicationData.current.localFolder.createFileAsync(tile + '.png',
        Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
          file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (stream) {

            Imaging.BitmapEncoder.createAsync(Imaging.BitmapEncoder.pngEncoderId, stream).then(function (encoder) {
              encoder.setPixelData(Imaging.BitmapPixelFormat.rgba8, Imaging.BitmapAlphaMode.straight,
                canvas.width, canvas.height, 96, 96,
                new Uint8Array(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data))
              encoder.flushAsync().then(function () {
                stream.flushAsync().then(function () {
                  stream.close()
                  if (callback) {
                    callback()
                  }
                })
              })
            })
          })
        })
    }
  }

  app.registerBackgroundTask = function (taskEntryPoint, taskName, trigger) {
    Windows.ApplicationModel.Background.BackgroundExecutionManager.requestAccessAsync().then(function () {
      var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder()

      builder.name = taskName
      builder.taskEntryPoint = taskEntryPoint
      builder.setTrigger(trigger)

      var task = builder.register()

      //BackgroundTaskSample.attachProgressAndCompletedHandlers(task)

      //BackgroundTaskSample.updateBackgroundTaskStatus(taskName, true)

      // Remove previous completion status from local settings.
      //var settings = Windows.Storage.ApplicationData.current.localSettings
      //settings.values.remove(taskName)
    })
  }

  app.onactivated = function (args) {

    if (args.detail.kind === activation.ActivationKind.launch) {
      if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
          // TODO: This application has been newly launched. Initialize
          // your application here.
      } else {
          // TODO: This application has been reactivated from suspension.
          // Restore application state here.
      }

      // color our app bar, because the css classes are shit
      Windows.UI.WebUI.Core.WebUICommandBar.getForCurrentView().backgroundColor = { r: 0, g: 0, b: 0, a: 127.5 }
      Windows.UI.WebUI.Core.WebUICommandBar.getForCurrentView().foregroundColor = { r: 255, g: 255, b: 255, a: 255 }

      // make our app bar show on top
      Windows.UI.ViewManagement.ApplicationView.getForCurrentView().setDesiredBoundsMode(Windows.UI.ViewManagement.ApplicationViewBoundsMode.useCoreWindow);

      // set our status bar to show on top
      Windows.UI.ViewManagement.StatusBar.getForCurrentView().foregroundColor = { r: 221, g: 221, b: 221, a: 255 }
      Windows.UI.ViewManagement.StatusBar.getForCurrentView().showAsync()

      // render out the winJS bits of the UI
      args.setPromise(WinJS.UI.processAll());
    }
  }

  app.oncheckpoint = function (args) {
      // TODO: This application is about to be suspended. Save any state
      // that needs to persist across suspensions here. You might use the
      // WinJS.Application.sessionState object, which is automatically
      // saved and restored across suspension. If you need to complete an
      // asynchronous operation before your application is suspended, call
      // args.setPromise().
  }

  app.start()
})()
