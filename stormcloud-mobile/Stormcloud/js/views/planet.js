var PlanetView = Backbone.View.extend({
  // el - stands for element. Every view has a element associate in with HTML
  //      content will be rendered.
  el: '#planetview',
  // It's the first function called when this view it's instantiated.
  initialize: function(){
    // create a new planet & load our locations
    _.bindAll(this, 'render', 'appendLocation', 'createScroller', 'removeLocation', 'reflow', 'currentLocation', 'scrollChange'); // every function that uses 'this' as the current object should be in here

    this.planet = window.planet
    this.planet.bind('add', this.appendLocation) // bind for future locations added
    this.planet.bind('change', this.reflow)
    this.planet.bind('remove', this.removeLocation)
    this.planet.bind('remove', this.reflow)

    // we're going to bind add and remove to refresh as well,
    this.planet.bind('add', this.planet.refresh)
    this.planet.bind('remove', this.planet.refresh)

    // there's some thing weird on ffos where it does a refresh
    $(window).resize(this.reflow)

    // to avoid causing lag to the ui thread
    this.planet.bind('requestRefresh', function () {
      if (platform === 'wp') {
        window.msSetImmediate(function () {
          this.planet.refresh()
        })
      } else {
        setTimeout(function() {
          this.planet.refresh()
        }, 50)
      }
    })

    // render our planet
    this.render()

    // create our scroller on fxos
    this.createScroller()

    $(this.el).parent().on('MSManipulationStateChanged', this.scrollChange)
  },

  createScroller: function() {
    // woo hoo this is our scrolling
    if (platform !== 'wp') {
      // global or else the app doesn't start.
      myScroll = new IScroll('#planetview-wrap', {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: '.item'
      })
      myScroll.on('scrollEnd', this.scrollChange)
    }
  },

  render: function(){
    // loop through our planet
    var self = this
    $(this.el).html('')
    _(this.planet.models).each(function(location) {
      self.appendLocation(location)
    }, this)

    this.reflow()
  },

  currentLocation: function() {
    if (platform === 'wp') {
      return Math.round(this.el.parentElement.scrollLeft / document.body.clientWidth)
    } else {
      if (typeof(myScroll) !== "undefined" && typeof(myScroll.currentPage.pageX) !== "undefined") {
        return myScroll.currentPage.pageX
      }
      return 0
    }
  },

  // changes the background of the app matching the location
  scrollChange: function () {
    if (this.planet.length > 0) {
      // always the sign of good, high quality code.
      try {
        var background = this.planet.models[this.currentLocation()].get('background')
      } catch (err) {
        var background = this.planet.models[0].get('background')
      }
      this.el.parentElement.parentElement.style.background = background
    }
  },

  reflow: function () {
    // This crashes if there's no elements
    if (this.planet.length > 0) {

      var self = this

      //requestAnimationFrame(function() {

        // Make our flexbox the right size
        $(self.el).width(document.body.clientWidth * this.planet.length)
        $(self.el).parent().css('-ms-scroll-snap-points-x', 'snapInterval(0px, ' + document.body.clientWidth + 'px)')

        self.scrollChange()

        // basically shows the div invisibly because this function requires the thing to be shown
        var state = 'shown'
        if ($(self.el).width() == 0) {
          $(self.el).parent().parent().show().css("visibility:hidden")
          state = 'hidden'
        }

        window.fitText(document.getElementsByClassName("city"), 1.2)
        window.fitText(document.getElementsByClassName("wday"), 0.6)

        // kelvin needs special sizings
        if (settings.get('temperature') === 'k') {
          window.fitText(document.getElementsByClassName("left"), 0.25)
          window.fitText(document.getElementsByClassName("right"), 0.6)
          window.fitText(document.getElementsByClassName("wtemp"), 0.65)

        } else {
          window.fitText(document.getElementsByClassName("left"), 0.17)
          window.fitText(document.getElementsByClassName("right"), 0.5)
          window.fitText(document.getElementsByClassName("wtemp"), 0.55)
        }

        // resets the div
        if (state === 'hidden') {
          $(self.el).parent().parent().hide().css("visibility:visible")
        }

        if (platform !== 'wp' && typeof(myScroll) !== "undefined") {
          myScroll.refresh()
        }

      // resize animated canvas elements properly
        skycons.pause()
        skycons.list.forEach(function (icon) {
          skycons.remove(icon.element)
        })

        // animates and fixes height
        $(".weather canvas").map(function () {
          skycons.add($(this)[0], Skycons[$(this).attr("data-weather").toUpperCase()])
          $(this)[0].height = $(this).parent().height()*0.9
        })
        skycons.play()
      //})
    }
  },
  appendLocation: function(location) {
    // restarts the scrolly thing
    var locationView = new LocationView({
      model: location
    })
    // addss the elem to the dom, then sets a data-zip property
    $(this.el).append(locationView.render().el).children().last().attr('data-zip', location.get('zip'))
    this.reflow()

    if (platform !== 'wp' && typeof(myScroll) !== "undefined") {
      myScroll.destroy()
      myScroll = undefined
      this.createScroller()
    }
  },

  removeLocation: function (location) {
    requestAnimationFrame(function() {
      planetView.render()
    })
  }
});
