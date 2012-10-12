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

"""Helpers for an Ubuntu application."""
import logging
import os

from . stormcloudconfig import get_data_file
from . Builder import Builder

import gettext
from gettext import gettext as _
gettext.textdomain('stormcloud')

def get_builder(builder_file_name):
    """Return a fully-instantiated Gtk.Builder instance from specified ui 
    file
    
    :param builder_file_name: The name of the builder file, without extension.
        Assumed to be in the 'ui' directory under the data path.
    """
    # Look for the ui file that describes the user interface.
    ui_filename = get_data_file('ui', '%s.ui' % (builder_file_name,))
    if not os.path.exists(ui_filename):
        ui_filename = None

    builder = Builder()
    builder.set_translation_domain('stormcloud')
    builder.add_from_file(ui_filename)
    return builder


# Owais Lone : To get quick access to icons and stuff.
def get_media_file(media_file_name):
    media_filename = get_data_file('media', '%s' % (media_file_name,))
    if not os.path.exists(media_filename):
        media_filename = None

    return "file:///"+media_filename

class NullHandler(logging.Handler):
    def emit(self, record):
        pass

def set_up_logging(opts):
    # add a handler to prevent basicConfig
    root = logging.getLogger()
    null_handler = NullHandler()
    root.addHandler(null_handler)

    formatter = logging.Formatter("%(levelname)s:%(name)s: %(funcName)s() '%(message)s'")

    logger = logging.getLogger('stormcloud')
    logger_sh = logging.StreamHandler()
    logger_sh.setFormatter(formatter)
    logger.addHandler(logger_sh)

    lib_logger = logging.getLogger('stormcloud_lib')
    lib_logger_sh = logging.StreamHandler()
    lib_logger_sh.setFormatter(formatter)
    lib_logger.addHandler(lib_logger_sh)

    # Set the logging level to show debug messages.
    if opts.verbose:
        logger.setLevel(logging.DEBUG)
        logger.debug('logging enabled')
    if opts.verbose > 1:
        lib_logger.setLevel(logging.DEBUG)

def get_help_uri(page=None):
    # help_uri from source tree - default language
    here = os.path.dirname(__file__)
    help_uri = os.path.abspath(os.path.join(here, '..', 'help', 'C'))

    if not os.path.exists(help_uri):
        # installed so use gnome help tree - user's language
        help_uri = 'stormcloud'

    # unspecified page is the index.page
    if page is not None:
        help_uri = '%s#%s' % (help_uri, page)

    return help_uri

def show_uri(parent, link):
    from gi.repository import Gtk # pylint: disable=E0611
    screen = parent.get_screen()
    Gtk.show_uri(screen, link, Gtk.get_current_event_time())

def alias(alternative_function_name):
    '''see http://www.drdobbs.com/web-development/184406073#l9'''
    def decorator(function):
        '''attach alternative_function_name(s) to function'''
        if not hasattr(function, 'aliases'):
            function.aliases = []
        function.aliases.append(alternative_function_name)
        return function
    return decorator
