//
// A JavaScript background task is specified in a .js file. The name of the file is used to
// launch the background task.
//
(function () {

  // so an error doesn't happen
  platform = 'wp'

  Zepto = {}
  appView = {
    showError: function (text) {
      // rather than throwing an error, just close the task
      console.log(text)
      close()
    }
  }

  // This var is used to get information about the current instance of the background task.
  var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;

  // This function will do the work of your background task.
  function doWork() {
    importScripts('//Microsoft.Phone.WinJS.2.1/js/base.js', '/js/libs/underscore-min.js', '/js/libs/backbone-min.js', '/js/libs/simply-deferred.js')
    importScripts('/js/models/settings.js', '/js/models/location.js', '/js/collections/planet.js', '/js/data.js')

    // Refresh first location
    planet.bind('ready', function () {
      if (planet.isConnected()) {
        //planet should be ready
        planet.models[0].saveWeather().done(function () {
          console.log('got weather')
          // Regenerate live tile by sending to the web server
          var params = [
            'icon=' + planet.models[0].get('code'),
            // 'place=' + planet.models[0].get('place') + " " + new Date().getHours() + ":" + new Date().getMinutes(),
            'place=' + planet.models[0].get('place'),
            'temp=' + planet.models[0].get('temperature').slice(0, -1),
            'unit=' + settings.get('temperature').toUpperCase(),
            'scale=' + settings.get('scale')
          ]

          var requestServer = function (params, size, callback) {
            WinJS.xhr({
              url: 'http://live.getstormcloud.com/?' + params.join('&') + '&size=' + size,
              responseType: 'blob'
            }).done(function (data) {
              var fileContents = data.response;
              Windows.Storage.ApplicationData.current.localFolder.createFileAsync(size + '.png',
              Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
                file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (stream) {
                  Windows.Storage.Streams.RandomAccessStream.copyAsync(fileContents.msDetachStream(), stream).then(function () {
                    stream.flushAsync().then(function () {
                      stream.close()
                      fileContents.msClose()

                      var xml;
                      if (size === 'medium') {
                        xml = notifications.TileUpdateManager.getTemplateContent(notifications.TileTemplateType.tileSquare150x150Image)
                      } else {
                        xml = notifications.TileUpdateManager.getTemplateContent(notifications.TileTemplateType.tileSquare71x71Image)
                      }
                      xml.getElementsByTagName('binding')[0].setAttribute('branding', 'none')
                      xml.getElementsByTagName('image')[0].setAttribute('src', 'ms-appdata:///local/' + size + '.png')

                      var tileNotification = new notifications.TileNotification(xml)
                      if (typeof (callback) !== undefined) {
                        callback(tileNotification)
                      }
                    })
                  })
                })
              })
            }, function (data) {
              close()
            })
          }

          requestServer(params, 'medium', function (notification_medium) {
            requestServer(params, 'small', function (notification_small) {
              var manager = notifications.TileUpdateManager.createTileUpdaterForApplication()
              manager.enableNotificationQueue(true)
              manager.clear()
              manager.update(notification_medium)
              manager.update(notification_small)
              console.log("all done!")
              close()
            })
          })

          // on error
        }).fail(function () {
          console.log("failed like a whale!")
          close()
        })
      // not connected
      } else {
        console.log('not connected?')
        close()
      }
    })
  }
  doWork()
})()
