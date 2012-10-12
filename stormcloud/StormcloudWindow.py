# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
### BEGIN LICENSE
# Copyright (C) 2012 Caffeinated Code <caffeinatedco.de>
# Copyright (C) 2012 Jono Cooper
# Thanks to <adamwhitcroft.com> for Climacons!
# 
# DON'T BE A DICK PUBLIC LICENSE
# 
#                     Version 1, December 2009
# 
#  Copyright (C) 2009 Philip Sturgeon <email@philsturgeon.co.uk>
#  
#  Everyone is permitted to copy and distribute verbatim or modified
#  copies of this license document, and changing it is allowed as long
#  as the name is changed.
# 
#                   DON'T BE A DICK PUBLIC LICENSE
#     TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
# 
#   1. Do whatever you like with the original work, just don't be a dick.
# 
#      Being a dick includes - but is not limited to - the following instances:
# 
#  1a. Outright copyright infringement - Don't just copy this and change the name.
#  1b. Selling the unmodified original with no work done what-so-ever, that's REALLY being a dick.
#  1c. Modifying the original work to contain hidden harmful content. That would make you a PROPER dick.
# 
#   2. If you become rich through modifications, related works/services, or supporting the original work,
#  share the love. Only a dick would make loads off this work and not buy the original works 
#  creator(s) a pint.
#  
#   3. Code is provided with no warranty. Using somebody else's code and bitching when it goes wrong makes 
#  you a DONKEY dick. Fix the problem yourself. A non-dick would submit the fix back.#  you a DONKEY dick. Fix the problem yourself. A non-dick would submit the fix back.#  you a DONKEY dick. Fix the problem yourself. A non-dick would submit the fix back.#  you a DONKEY dick. Fix the problem yourself. A non-dick would submit the fix back.#  you a DONKEY dick. Fix the problem yourself. A non-dick would submit the fix back.### END LICENSE

import gettext
from gettext import gettext as _
gettext.textdomain('stormcloud')

import subprocess
from gi.repository import Gtk, WebKit # pylint: disable=E0611
import logging
logger = logging.getLogger('stormcloud')

from stormcloud_lib import Window
from stormcloud_lib.helpers import get_media_file

try:
    from gi.repository import Unity
except ImportError:
    pass

# See stormcloud_lib.Window.py for more details about how this class works
class StormcloudWindow(Window):
    __gtype_name__ = "StormcloudWindow"
    
    def finish_initializing(self, builder): # pylint: disable=E1002
        """Set up the main window"""
        super(StormcloudWindow, self).finish_initializing(builder)

        self.box = self.builder.get_object("box")
        self.window = self.builder.get_object("stormcloud_window")
        self.drag = True

        # Code for other initialization actions should be added here.
        self.webview = WebKit.WebView()
        self.box.add(self.webview)
        self.webview.props.settings.enable_default_context_menu = False
        self.webviewsettings = self.webview.get_settings()
        self.webviewsettings.set_property("javascript-can-open-windows-automatically", True)
        self.webviewsettings.set_property("enable-universal-access-from-file-uris", True)
        self.webviewsettings.set_property("enable-developer-extras", True)
        self.webview.load_uri(get_media_file('app.html'))
        self.box.show_all()

        try:
            launcher = Unity.LauncherEntry.get_for_desktop_id("stormcloud.desktop")
            launcher.set_property("count_visible", True)
            
        except NameError:
            pass

        def navigation_requested_cb(view, frame, networkRequest):
            uri = networkRequest.get_uri()
            subprocess.Popen(['xdg-open', uri])
            return 1

        def console_message_cb(widget, message, line, source):
            logger.debug('%s:%s "%s"' % (source, line, message))
            return True

        def title_changed(widget, frame, title):
            
            if title == "close":
                Gtk.main_quit()

            # Stupid Names for Retina Support sorry =(
            elif title == "checked":
                self.window.set_size_request(600, 1000)
            elif title == "undefined":
                self.window.set_size_request(300, 500)

            # Disables Dragging
            elif title == "disabledrag":
                self.drag = False
            elif title == "enabledrag":
                self.drag = True

            else:
                try:
                    launcher.set_property("count", int(title))
                except NameError:
                    pass

        def press_button(widget, event):
            if event.button == 1:
                if self.drag == True:
                    Gtk.Window.begin_move_drag(self.window,event.button,event.x_root,event.y_root,event.time)

        self.webview.connect('title-changed', title_changed)
        self.webview.connect('navigation-requested', navigation_requested_cb)
        self.webview.connect('console-message', console_message_cb)
        self.webview.connect('button-press-event', press_button)