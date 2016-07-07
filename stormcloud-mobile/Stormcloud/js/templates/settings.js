var SettingsTemplate = _.template('<div class="settings"><header>Settings<img src="./images/tick.svg"></header><div id="hub" class="hub">\
    <div class="section1 section"\
         data-win-control="WinJS.UI.PivotItem"\
         data-win-options="{ isHeaderStatic: true, header: \'locations\' }">\
        <div class="sectioncontrol" id="section1contenthost">\
            <progress class="win-progress top-progress"></progress>\
            <div class="locationSettingsList"></div>\
            <button id="addLocation">add location</button>\
            <button id="addCurrentLocation">add current location</button>\
        </div>\
    </div>\
    <div class="section2 section"\
         data-win-control="WinJS.UI.PivotItem"\
         data-win-options="{ isHeaderStatic: true, header: \'display\' }">\
        <div class="sectioncontrol" id="section2contenthost">\
            <h4>Temperature Unit</h4>\
            <div class="radio-container">\
                <div class="radio-button">\
                    <input type="radio" name="temperature-scale" value="f" id="temperature-scale-f">\
                    <label for="temperature-scale-f" class="win-type-medium">fahrenheit</label>\
                </div><div class="radio-button">\
                    <input type="radio" name="temperature-scale" value="c" id="temperature-scale-c">\
                    <label for="temperature-scale-c" class="win-type-medium">celsius</label>\
                </div><div class="radio-button">\
                    <input type="radio" name="temperature-scale" value="k" id="temperature-scale-k">\
                    <label for="temperature-scale-k" class="win-type-medium">kelvin</label>\
                </div>\
            </div>\
            <h4>Speed Unit</h4>\
            <div class="radio-container">\
                <div class="radio-button">\
                    <input type="radio" name="speed-scale" value="mph" id="speed-scale-mph">\
                    <label for="speed-scale-mph" class="win-type-medium">mph</label>\
                </div><div class="radio-button">\
                    <input type="radio" name="speed-scale" value="km/h" id="speed-scale-kmh">\
                    <label for="speed-scale-kmh" class="win-type-medium">km/h</label>\
                </div><div class="radio-button">\
                    <input type="radio" name="speed-scale" value="m/s" id="speed-scale-ms">\
                    <label for="speed-scale-ms" class="win-type-medium">m/s</label>\
                </div>\
            </div>\
            <h4>Background Color</h4>\
            <div class="radio-container">\
                <div class="radio-button">\
                    <input type="radio" name="background-color" value="gradient" id="background-color-gradient">\
                    <label for="background-color-gradient" class="win-type-medium">temperature</label>\
                </div><div class="radio-button">\
                    <input type="radio" name="background-color" value="weather" id="background-color-weather">\
                    <label for="background-color-weather" class="win-type-medium">weather</label>\
                </div><div class="radio-button">\
                    <input type="radio" name="background-color" value="accent" id="background-color-accent">\
                    <label for="background-color-accent" class="win-type-medium">accent</label>\
                </div>\
            </div>\
        </div>\
    </div>\
</div></div>')
