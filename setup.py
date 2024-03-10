#! /usr/bin/env python
# -*- encoding: utf-8 -*-

# This file is part of mydashboard.
# Copyright 2019-2021 fccagou <me@fccagou.fr>
#
# mydashboard is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# mydashboard is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
# or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public
# License for more details.
#
# You should have received a copy of the GNU General Public License
# along with pyap. If not, see <http://www.gnu.org/licenses/>.

from distutils.core  import setup
setup(name='mydashboard',
        version='0.1.2',
        description='Userland Dashboard microservice',
        url='http://github.com/fccagou/tools',
        author='fccagou',
        author_email='me@fccagou.fr',
        license='GPLv3+',
        long_description="Userland Dashboard",
        scripts=[
            'mydashboard'
            ],
        install_requires=[
            'python3'
            ],
        packages=[
            ],
        data_files=[
            ('share/doc/mydashboard',[
                'doc/README.md',
                'doc/LICENSE.md',
                ]),
            ('share/doc/mydashboard/samples',[
                'data/conf.json',
                'data/rdp_connection.sh',
                'data/remote_connection.sh',
                'data/remote.json',
                ]),
            ('/etc/mydashboard', [
                'data/mydashboard.conf-default'
                ]),
            ('/etc/mydashboard/html', [
                'docroot/index.html',
                ]),
            ('/etc/mydashboard/html/img', [
                'docroot/img/favicon.ico',
                'docroot/img/computer.svg',
                ]),
            ('/etc/mydashboard/html/css', [
                'docroot/css/bootstrap.min.css',
                'docroot/css/bootstrap-icons.css',
                'docroot/css/fonts/bootstrap-icons.woff',
                'docroot/css/fonts/bootstrap-icons.woff2',
                'docroot/css/mydashboard.css',
                ]),
            ('/etc/mydashboard/html/js', [
                'docroot/js/bootstrap.bundle.js',
                'docroot/js/axios.min.js',
                'docroot/js/vue.global.prod.min.js',
                'docroot/js/vuex.global.prod.min.js',
                'docroot/js/vue-router.global.prod.min.js',
                'docroot/js/app.js',
                'docroot/js/routes.js',
                'docroot/js/store.js',
                ]),
            ('/etc/mydashboard/html/js/views', [
                'docroot/js/bootstrap.bundle.js',
                'docroot/js/views/RemoteAccess.vue.js',
                'docroot/js/views/UserPreferences.vue.js',
                'docroot/js/views/NotFound.vue.js',
                ]),
            ('/etc/mydashboard/html/js/components', [
                'docroot/js/components/NavBar.vue.js',
                'docroot/js/components/Toasts.vue.js',
                'docroot/js/components/Toast.vue.js',
                'docroot/js/components/PreferenceInput.vue.js',
                ]),
            ('/etc/mydashboard/html/js/components/RemoteAccess', [
                'docroot/js/components/RemoteAccess/Site.vue.js',
                'docroot/js/components/RemoteAccess/Domain.vue.js',
                'docroot/js/components/RemoteAccess/Host.vue.js',
                'docroot/js/components/RemoteAccess/HostInformationModal.vue.js',
                'docroot/js/components/RemoteAccess/HostCustomModal.vue.js',
                'docroot/js/components/RemoteAccess/HostMenu.vue.js',
                ]),
            ],
        )
