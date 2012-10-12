#!/usr/bin/env python
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

###################### DO NOT TOUCH THIS (HEAD TO THE SECOND PART) ######################

import os
import sys

try:
    import DistUtilsExtra.auto
except ImportError:
    print >> sys.stderr, 'To build stormcloud you need https://launchpad.net/python-distutils-extra'
    sys.exit(1)
assert DistUtilsExtra.auto.__version__ >= '2.18', 'needs DistUtilsExtra.auto >= 2.18'

def update_config(values = {}):

    oldvalues = {}
    try:
        fin = file('stormcloud_lib/stormcloudconfig.py', 'r')
        fout = file(fin.name + '.new', 'w')

        for line in fin:
            fields = line.split(' = ') # Separate variable from value
            if fields[0] in values:
                oldvalues[fields[0]] = fields[1].strip()
                line = "%s = %s\n" % (fields[0], values[fields[0]])
            fout.write(line)

        fout.flush()
        fout.close()
        fin.close()
        os.rename(fout.name, fin.name)
    except (OSError, IOError), e:
        print ("ERROR: Can't find stormcloud_lib/stormcloudconfig.py")
        sys.exit(1)
    return oldvalues


def update_desktop_file(datadir):

    try:
        fin = file('stormcloud.desktop.in', 'r')
        fout = file(fin.name + '.new', 'w')

        for line in fin:            
            if 'Icon=' in line:
                line = "Icon=%s\n" % (datadir + 'media/stormcloud.svg')
            fout.write(line)
        fout.flush()
        fout.close()
        fin.close()
        os.rename(fout.name, fin.name)
    except (OSError, IOError), e:
        print ("ERROR: Can't find stormcloud.desktop.in")
        sys.exit(1)


class InstallAndUpdateDataDirectory(DistUtilsExtra.auto.install_auto):
    def run(self):
        values = {'__stormcloud_data_directory__': "'%s'" % (self.prefix + '/share/stormcloud/'),
                  '__version__': "'%s'" % self.distribution.get_version()}
        previous_values = update_config(values)
        update_desktop_file(self.prefix + '/share/stormcloud/')
        DistUtilsExtra.auto.install_auto.run(self)
        update_config(previous_values)


        
##################################################################################
###################### YOU SHOULD MODIFY ONLY WHAT IS BELOW ######################
##################################################################################

DistUtilsExtra.auto.setup(
    name='stormcloud',
    version='1.0',
    license='other',
    author='consindo',
    author_email='jono@caffeinatedco.de',
    #description='UI for managing …',
    #long_description='Here a longer description',
    url='https://launchpad.net/stormcloud',
    cmdclass={'install': InstallAndUpdateDataDirectory}
    )

