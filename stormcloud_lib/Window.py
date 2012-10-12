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

from gi.repository import Gio, Gtk # pylint: disable=E0611
import logging
logger = logging.getLogger('stormcloud_lib')

from . helpers import get_builder, show_uri

# This class is meant to be subclassed by StormcloudWindow.  It provides
# common functions and some boilerplate.
class Window(Gtk.Window):
    __gtype_name__ = "Window"

    # To construct a new instance of this method, the following notable 
    # methods are called in this order:
    # __new__(cls)
    # __init__(self)
    # finish_initializing(self, builder)
    # __init__(self)
    #
    # For this reason, it's recommended you leave __init__ empty and put
    # your initialization code in finish_initializing
    
    def __new__(cls):
        """Special static method that's automatically called by Python when 
        constructing a new instance of this class.
        
        Returns a fully instantiated BaseStormcloudWindow object.
        """
        builder = get_builder('StormcloudWindow')
        new_object = builder.get_object("stormcloud_window")
        new_object.finish_initializing(builder)
        return new_object

    def finish_initializing(self, builder):
        """Called while initializing this instance in __new__

        finish_initializing should be called after parsing the UI definition
        and creating a StormcloudWindow object with it in order to finish
        initializing the start of the new StormcloudWindow instance.
        """
        # Get a reference to the builder and set up the signals.
        self.builder = builder
        self.ui = builder.get_ui(self, True)

        # Optional Launchpad integration
        # This shouldn't crash if not found as it is simply used for bug reporting.
        # See https://wiki.ubuntu.com/UbuntuDevelopment/Internationalisation/Coding
        # for more information about Launchpad integration.
        try:
            from gi.repository import LaunchpadIntegration # pylint: disable=E0611
            LaunchpadIntegration.set_sourcepackagename('stormcloud')
        except ImportError:
            pass

    def on_mnu_close_activate(self, widget, data=None):
        """Signal handler for closing the StormcloudWindow."""
        self.destroy()

    def on_destroy(self, widget, data=None):
        """Called when the StormcloudWindow is closed."""
        # Clean up code for saving application state should be added here.
        Gtk.main_quit()