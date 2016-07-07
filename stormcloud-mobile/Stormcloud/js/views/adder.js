var AdderView = Backbone.View.extend({
  el: '#adder',
  initialize: function () {
    this.el.innerHTML = AdderTemplate()

    var timeout;
    var floatyprogress = $('.floatyprogress')
    var resultList = $('#resultList')
    var queryBox = $("#locationQuery")
    var noResults = $("#noResults")

    resultList.on('click', 'h3', function () {
      planetView.planet.push(new Location({
        zip: $(this).attr('data-zip'),
        place: $(this).attr('data-place')
      }))
      appView.back()
    })

    queryBox.on('keyup', function (e) {
      // defined so we can call it on enter
      var timeoutFn = function () {
        // show progress spinner
        resultList.html('')
        queryBox.blur()
        noResults.hide()
        floatyprogress.addClass('show')

        $.ajax({
          url: 'http://api.openweathermap.org/data/2.5/find?q=' + $("#locationQuery").val() + '&mode=json',
          dataType: 'json',
          timeout: 5000,
          tryCount: 0,
          retryLimit: 2
        }).done(function(response) {
          // makes sure there are somethings in the list
          if (response.list && response.count > 0) {
            // push all the items into the binding list
            response.list.map(function (item) {
              resultList.append('<h3 data-zip="' + item.id + '" data-place="'+item.name+'">' + item.name + ', ' + item.sys.country + '</h3>')
            })
          } else {
            // no locations found
            noResults.show()
          }
        }).fail(function (xhr, textStatus) {
          if (textStatus == 'timeout') {
            this.tryCount++
            if (this.tryCount <= this.retryLimit) {
              //try again
              $.ajax(this)
              return;
            } else {
              // throw an error
              appView.showError("Error: failed to connect")
            }
            return;
          } else {
            // Throw an error
            appView.showError("Error: failed to connect")
          }
        }).always(function () {
          floatyprogress.removeClass('show')
        })

      }
      clearTimeout(timeout)

      // if the user hits enter, react instantly
      if (e.keyCode === 13) {
        timeoutFn()
      } else {
        timeout = setTimeout(timeoutFn, 1500)
      }
    })
  }
})
