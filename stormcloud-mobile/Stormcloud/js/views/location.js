// represents a single location on the earth
var LocationView = Backbone.View.extend({
  tagName: 'div',
  className: 'item',

  initialize: function(){
    _.bindAll(this, 'syncStart', 'syncFinish', 'render', 'unrender') // every function that uses 'this' as the current object should be in here

    this.model.bind('change', this.render)
    this.model.bind('remove', this.unrender)

    this.model.bind('syncStart', this.syncStart)
    this.model.bind('syncFinish', this.syncFinish)
  },

  syncStart: function() {
    $(this.el).addClass('xhr')
  },
  syncFinish: function () {
    $(this.el).removeClass('xhr')
  },

  render: function() {
    $(this.el).html(LocationTemplate(this.model.attributes))
    return this
  },

  unrender: function() {
    $(this.el).remove()
  }
})
