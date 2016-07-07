var LocationTemplate = _.template('<div class="top">\
  <div class="city">\
    <div><span><%= place %></span><progress class="progress win-ring win-small xhr-request"></progress></div>\
  </div>\
</div>\
<div class="weather">\
  <canvas data-weather="<%= code %>"></canvas>\
</div>\
<div class="stats">\
  <div class="left">\
    <div><span><%= temperature %></span></div>\
  </div>\
  <div class="right">\
    <div>\
      <div class="inner-row">\
        <span><%= windSpeed %></span> <span><%= windUnit %></span>\
      </div>\
      <div class="inner-row">\
        <span><%= humidity %></span>\
      </div>\
    </div>\
  </div>\
</div>\
<div class="forecast">\
  <div class="0">\
    <span class="wday"><%= week[0].day %></span>\
    <span class="wcode"><img src="./images/climacons/<%= week[0].code %>.svg"></span>\
    <span class="wtemp"><span><%= week[0].high %></span>&nbsp;&nbsp;<span><%= week[0].low %></span></span>\
  </div>\
  <div class="1">\
    <span class="wday"><%= week[1].day %></span>\
    <span class="wcode"><img src="./images/climacons/<%= week[1].code %>.svg"></span>\
    <span class="wtemp"><span><%= week[1].high %></span>&nbsp;&nbsp;<span><%= week[1].low %></span></span>\
  </div>\
  <div class="2">\
    <span class="wday"><%= week[2].day %></span>\
    <span class="wcode"><img src="./images/climacons/<%= week[2].code %>.svg"></span>\
    <span class="wtemp"><span><%= week[2].high %></span>&nbsp;&nbsp;<span><%= week[2].low %></span></span>\
  </div>\
  <div class="3">\
    <span class="wday"><%= week[3].day %></span>\
    <span class="wcode"><img src="./images/climacons/<%= week[3].code %>.svg"></span>\
    <span class="wtemp"><span><%= week[3].high %></span>&nbsp;&nbsp;<span><%= week[3].low %></span></span>\
  </div>\
</div>')
