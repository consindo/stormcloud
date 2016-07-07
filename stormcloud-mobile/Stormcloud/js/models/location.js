var Location = Backbone.Model.extend({
  defaults: {
    "link": "http://map.getstormcloud.com/?zoom=11&lat=40.714272&lon=-74.005966",
    "place": "New York",
    "country": "US",
    "zip": 5128581,
    "temperature": "20°",
    "windSpeed": 2,
    "windUnit": "mph",
    "windDirection": 149,
    "humidity": "81%",
    "week": {
      "0": {
        "day": "Thu",
        "code": "partly_cloudy_day",
        "low": "19°",
        "high": "22°",
        "average": "21°"
      },
      "1": {
        "day": "Fri",
        "code": "rain",
        "low": "17°",
        "high": "18°",
        "average": "18°"
      },
      "2": {
        "day": "Sat",
        "code": "partly_cloudy_day",
        "low": "15°",
        "high": "23°",
        "average": "19°"
      },
      "3": {
        "day": "Sun",
        "code": "rain",
        "low": "15°",
        "high": "24°",
        "average": "20°"
      }
    },
    "code": "cloudy",
    "background": "rgb(151, 84, 103)",
    "gradientbackground": "rgb(151, 84, 103)"
  },

  background: function (temp) {
    /// <signature helpKeyword="Location.background">
    /// <summary locid="Location.background">
    /// Takes a temperature and turns it into a colour based on the warmness.
    /// </summary>
    /// <param name="temperature" type="String" locid="Location.background_p:temp">
    /// Temperature (Farenheit)
    /// </param>
    /// <returns type="String" locid="Location.background_returnValue">
    /// The colour as a rgb triplet
    /// </returns>
    /// </signature>

    // Convert RGB array to CSS
    var convert = function (i) {
      // Array to RGB
      if (typeof (i) == 'object') {
        return 'rgb(' + i.join(', ') + ')';

        // Hex to array
      } else if (typeof (i) == 'string') {
        var output = [];
        if (i[0] == '#') i = i.slice(1);
        if (i.length == 3) i = i[0] + i[0] + i[1] + i[1] + i[2] + i[2];
        output.push(parseInt(i.slice(0, 2), 16))
        output.push(parseInt(i.slice(2, 4), 16))
        output.push(parseInt(i.slice(4, 6), 16))
        return output;
      }
    };

    // Get color at position
    var blend = function (x) {
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
        color: false,
        percent: 0
      };

      // Get the 2 closest stops to the specified position
      for (var i = 0, l = gradient.length; i < l; i++) {
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
        Math.round((left.color[2] * left.percent) + (right.color[2] * right.percent))
      ];
      return convert(blend);
    };

    //Sets Background Color
    var percentage = Math.round((temp - 45) * 2.2)
    return blend(percentage)
  },

  code: function (code) {
    /// <signature helpKeyword="Location.code">
    /// <summary locid="Location.code">
    /// Converts the OpenWeatherMap weather code to the filename of the icon.
    /// </summary>
    /// <param name="code" type="String" locid="Location.code:code">
    /// OpenWeatherMap Weather Code
    /// </param>
    /// <returns type="String" locid="Location.code_returnValue">
    /// The filename
    /// </returns>
    /// </signature>
    var b = {
      200: ["rain", 50],
      201: ["rain", 50],
      202: ["rain", 50],
      210: ["rain", 50],
      211: ["rain", 50],
      212: ["rain", 50],
      221: ["rain", 50],
      230: ["rain", 50],
      231: ["rain", 50],
      232: ["rain", 50],
      300: ["rain", 40],
      301: ["rain", 40],
      302: ["rain", 40],
      310: ["rain", 40],
      311: ["rain", 40],
      312: ["rain", 40],
      313: ["rain", 40],
      314: ["rain", 40],
      321: ["rain", 40],
      500: ["rain", 30],
      501: ["rain", 30],
      502: ["rain", 30],
      503: ["rain", 30],
      504: ["rain", 30],
      511: ["rain", 30],
      520: ["rain", 30],
      521: ["rain", 30],
      522: ["rain", 30],
      531: ["rain", 30],
      600: ["snow", 0],
      601: ["snow", 0],
      602: ["snow", 0],
      611: ["snow", 0],
      612: ["snow", 0],
      615: ["snow", 0],
      616: ["snow", 0],
      620: ["snow", 0],
      621: ["snow", 0],
      622: ["snow", 0],
      701: ["fog", 40],
      711: ["fog", 40],
      721: ["fog", 40],
      731: ["fog", 40],
      741: ["fog", 40],
      751: ["fog", 40],
      761: ["fog", 40],
      771: ["fog", 40],
      781: ["fog", 40],
      800: ["clear_day", 100],
      801: ["clear_day", 100],
      802: ["partly_cloudy_day", 80],
      803: ["partly_cloudy_day", 80],
      804: ["cloudy", 50],
      900: ["wind", 50],
      901: ["wind", 50],
      902: ["wind", 50],
      903: ["cloudy", 0],
      904: ["clear_day", 100],
      905: ["wind", 30],
      906: ["sleet", 15],
      950: ["wind", 30],
      951: ["wind", 30],
      952: ["wind", 30],
      953: ["wind", 30],
      954: ["wind", 30],
      955: ["wind", 30],
      956: ["wind", 30],
      957: ["wind", 30],
      958: ["wind", 50],
      959: ["wind", 50],
      960: ["wind", 50],
      961: ["wind", 50],
      962: ["wind", 50]
    }
    return b[code]
  },

  saveWeather: function() {
    // save the data to the model given by the get weather function
    var dfd = new Zepto.Deferred()

    var self = this
    self.trigger('syncStart')
    self.getWeather().done(function(data) {
      self.set(data)
      dfd.resolve('success')
    }).fail(function () {
      dfd.reject('failed')
    }).always(function () {
      self.trigger('syncFinish')
    })

    return dfd.promise()
  },

  getWeather: function () {
    /// <signature helpKeyword="Location.code">
    /// <summary locid="Location.getWeather">
    /// Returns weather data for a particular location (async).
    /// </summary>
    /// <param name="location" type="Object" locid="Location.getWeather:location">
    /// Location request Object. Must contain zip code at very least.
    /// </param>
    /// <returns type="Promise" locid="Location.getWeather_returnValue">
    /// Returns a promise with forecast on resolve (async).
    /// </returns>
    /// </signature>
    var temperatureConvert = function (temp, unit) {
      if (unit == 'c') {
        return Math.round((temp - 273.15)) + '°'
      } else if (unit == 'k') {
        return Math.round(temp) + 'K'
      } else {
        return Math.round((temp - 273.15) * 1.8 + 32) + '°'
      }
    }

    var self = this;
    var promise = new Zepto.Deferred()

    // holds our promises
    var p = [new Zepto.Deferred(), new Zepto.Deferred()]

    var getWeather = function (zip) {
      var p1opts = {
        url: 'http://api.openweathermap.org/data/2.5/weather?id=' + zip + '&' + Math.round(Math.random() * 1000000),
        responseType: 'json',
        timeout: 10000,
        xhrFields: {
          mozSystem: true
        }
      }
      var p1done = function (data) {
        if (typeof (data.response) === 'string') {
          try {
            response = JSON.parse(data.response)
          } catch (err) {
            p[0].reject('network error')
            return
          }
        } else {
          response = data
        }
        var result = {}

        //Current Weather
        result.code = response.weather[0].id
        result.temperature = response.main.temp
        result.windSpeed = response.wind.speed
        result.windDirection = response.wind.deg
        result.humidity = response.main.humidity + '%'

        // Temperature & Conversions
        var temp = result.temperature
        result.temperature = temperatureConvert(temp, settings.get('temperature'))

        // Wind Speed & Converstions
        result.windUnit = settings.get('speed')
        if (result.windUnit != 'm/s') {
          result.windSpeed = (result.windUnit == 'km/h') ? Math.round(result.windSpeed * 3.6) : Math.round(result.windSpeed * 2.2369)
        }

        // Calculates the pretty colours
        result.gradientbackground = self.background((temp - 273.15) * 1.8 + 32)
        result.background = result.gradientbackground

        if (settings.get('color') === 'weather') {
          result.background = self.background(Math.round(self.code(result.code)[1] / 2.2 + 45))
        } else if (settings.get('color') === 'accent') {
          result.background = 'Highlight'
        }

        // Converts from code to image ref
        result.code = self.code(result.code)[0]

        // Calls Back
        p[0].resolve(result)
      }
      var p1fail = function () {
        p[0].reject('network error')
      }

      var p2opts = {
        url: 'http://api.openweathermap.org/data/2.5/forecast/daily?id=' + zip + '&cnt=4&mode=json&' + Math.round(Math.random() * 1000000),
        responseType: 'json',
        timeout: 10000,
        xhrFields: {
          mozSystem: true
        }
      }
      var p2done = function (data) {
        if (typeof (data.response) === 'string') {
          try {
            response = JSON.parse(data.response)
          } catch (err) {
            p[1].reject('network error')
            return
          }
        } else {
          response = data
        }
        var result = {}

        //Location
        result.link = 'http://map.getstormcloud.com/?zoom=11&lat=' + response.city.coord.lat + '&lon=' + response.city.coord.lon
        result.place = response.city.name
        result.country = response.city.country

        // hack for always changing zips on geolocation
        result.zip = self.get('zip')

        var tempUnit = settings.get('temperature')
        var weekArr = response.list
        result.week = {}
        for (var i = 0; i < weekArr.length; i++) {
          result.week[i] = {}
          result.week[i].day = new Date(weekArr[i].dt * 1000).toDateString().substr(0, 3)
          result.week[i].code = self.code(weekArr[i].weather[0].id)[0]

          // convert da temperatures
          result.week[i].low = temperatureConvert(weekArr[i].temp.min, tempUnit)
          result.week[i].high = temperatureConvert(weekArr[i].temp.max, tempUnit)
          result.week[i].average = temperatureConvert(((weekArr[i].temp.min + weekArr[i].temp.max) / 2), tempUnit)
        }

        p[1].resolve(result)
      }
      var p2fail = function () {
        p[1].reject('network error')
      }

      // do the actual ajax down here
      if (platform === 'wp') {
        WinJS.xhr(p1opts).done(p1done, p1fail)
        WinJS.xhr(p2opts).done(p2done, p2fail)
      } else {
        $.ajax(p1opts).done(p1done).fail(p1fail)
        $.ajax(p2opts).done(p2done).fail(p2fail)
      }
    }

    if (self.get('zip') === 'current') {
      // define up here so we can use in ff & wp.
      var geocomplete = function(pos) {
        // callbacks
        var done = function(data) {
          // depends on the use of WinJS.xhr or .getJSON()
          if (typeof (data.response) === 'string') {
            try {
              response = JSON.parse(data.response)
            } catch (err) {
              appView.showError("Error: please check your internet connection")
            }
          } else {
            response = data
          }
          if (response.list.length > 0) {
            // We get the weather for the current location
            getWeather(response.list[0].id)
          } else {
            appView.showError("Error: could not find location")
          }
        }
        var fail = function() {
          appView.showError("Error: failed to connect")
        }

        // the web request
        if (platform === 'wp') {
          WinJS.xhr({
            url: 'http://api.openweathermap.org/data/2.5/find?lat=' + pos.coordinate.point.position.latitude + '&lon=' + pos.coordinate.point.position.longitude + '&cnt=1',
            dataType: 'json',
            timeout: 10000
          }).done(done, fail)
        } else {
          $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/find?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude + '&cnt=1',
            timeout: 10000,
            xhrFields: {
              mozSystem: true
            }
          }).done(done).fail(fail)
        }
      }
      var geoerror = function(err) {
        appView.showError("Error: could not get current location")
        geocomplete({ coordinate: { point: { position: { latitude: "40.714272", longitude: "-74.005966" } } } })
      }

      // yay. windows phone uses a different api.
      if (platform === 'wp') {
        var loc = new Windows.Devices.Geolocation.Geolocator()
        loc.getGeopositionAsync().then(geocomplete, geoerror)
      } else {
        navigator.geolocation.getCurrentPosition(geocomplete, geoerror)
      }
    } else {
      getWeather(self.get('zip'))
    }

    // when both our ajax calls are over
    Zepto.when(p[0], p[1]).done(function(d1, d2) {
      //combines objects
      var result = d1
      for (var attrname in d2) { result[attrname] = d2[attrname]; }

      promise.resolve(result)
    }).fail(function () {
      promise.reject('network error')
    })
    return promise;
  }
});
