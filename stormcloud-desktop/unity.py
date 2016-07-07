#!/usr/bin/env python
import sys
from gi.repository import Unity, GObject

"""
I had something fancy with TCP going on
but it seems easier to use just command line args
and kill the process. One day I'll use sockets.
"""

loop = GObject.MainLoop()

launcher = Unity.LauncherEntry.get_for_desktop_id("stormcloud.desktop")
launcher.set_property("count", int(sys.argv[1]))
launcher.set_property("count_visible", True)

# This needs to be run =(
loop.run()
