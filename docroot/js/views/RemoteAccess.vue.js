const RemoteAccessComponent = {
    template: `
    <div class="d-flex flex-wrap gap-4 justify-content-evenly">
        <site v-for="(site, index) in sites_ordered" :key="site.name"
            :name="site.name"
            :domains="site.domains"
            :ordering="domains_ordering(site.name)"
            :lock="connectionInProgress"
            @connection-request="executeConnection"
            @menu-request="showHostMenu"
            />
    </div>
    <host-menu :host="hostMenuPayload" :trigger="triggerMenu" @connection-request="executeConnection" />`,
    data() {
        return {
            hosts: [],
            sites: [],
            ordering: {},
            connectionInProgress: false,
            interval: null,
            triggerMenu: false,
            hostMenuPayload: {},
        }
    },
    beforeMount() {
        if (!this.interval) {
            this.loadData();
            this.interval = setInterval(this.loadData, 60000);
        }
    },
    beforeUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = null;
    },
    methods: {
        loadData() {
            axios.get('/remote/list').then((response) => {
                this.hosts = response.data.hosts;
                this.ordering = response.data.ordering;

                // generate site -> domain -> group structure
                this.sites = [];
                for (const host of this.hosts) {
                    if (!('site' in host.config && 'domain' in host.config && 'group' in host.config)) {
                        continue;
                    }
                    let site = this.sites.find(e => e.name === host.config.site);
                    if (!site) {
                        site = { 'name': host.config.site, 'domains': [] };
                        this.sites.push(site);
                    }
                    let domain = site.domains.find(e => e.name === host.config.domain);
                    if (!domain) {
                        domain = { 'name': host.config.domain, 'groups': [] };
                        site.domains.push(domain);
                    }
                    let group = domain.groups.find(e => e.name === host.config.group);
                    if (!group) {
                        group = { 'name': host.config.group, 'hosts': [] };
                        domain.groups.push(group);
                    }
                    group.hosts.push(host);
                }

                // TODO: disply toast if errors
            }).catch((error) => {
                this.$store.commit('addToast', {
                    type: 'warning',
                    title: 'Unable to contact API',
                    body: 'Impossible to retrieve information of the available hosts',
                    delaySecond: 10,
                })
            });
        },
        executeConnection(connection) {
            if (this.connectionInProgress) {
                this.$store.commit('addToast', {
                    type: 'warning',
                    title: 'Remote Connection',
                    body: 'A connection is already in progress!',
                    delaySecond: 10,
                })
                return;
            }
            this.connectionInProgress = true;
            connection.host_data_ref.loading = true;
            axios.get(`/remote/connect/${connection.host_uuid}`).then((response) => {
                if (response.data.status !== 0) {
                    this.$store.commit('addToast', {
                        type: 'danger',
                        title: 'Connection error',
                        body: `Cant't connect to ${connection.hostname}`,
                        delaySecond: 60,
                        modal: {
                            title: 'Remote exec error (' + response.data.status + ')',
                            body: "<p>URL: " + response.request.responseURL + "</p><hr>" +
                                "<p>Command:<br/>" +
                                response.data.cmd +
                                "</p><hr>" +
                                "<p>Message:<br/>" +
                                response.data.msg.replace(/\n/g, "</br>") +
                                "</p>",
                        }
                    });
                }
            }).catch((error) => {
                if (error.response) {
                    this.$store.commit('addToast', {
                        type: 'danger',
                        title: 'Connection error',
                        body: 'Incorrect use of the API',
                        delaySecond: 60,
                        modal: {
                            title: "Error (" + error.response.status + ") occurs accessing " + error.request.responseURL,
                            body: error.response.data,
                        }
                    });
                } else {
                    this.$store.commit('addToast', {
                        type: 'danger',
                        title: 'Unable to connect API',
                        delaySecond: 10,
                    });
                }
            }).finally(() => {
                this.connectionInProgress = false;
                connection.host_data_ref.loading = false;
            })
        },
        domains_ordering: function (site_name) {
            return this.ordering.hasOwnProperty(site_name) ? this.ordering[site_name] : {};
        },
        showHostMenu: function (host) {
            this.hostMenuPayload = host;
            this.triggerMenu = !this.triggerMenu;
        },
    },
    computed: {
        sites_ordered: function () {
            return this.sites.sort((a, b) => {
                const order_a = this.ordering.hasOwnProperty(a.name) ? this.ordering[a.name].order : 0;
                const order_b = this.ordering.hasOwnProperty(b.name) ? this.ordering[b.name].order : 0;
                return order_a > order_b;
            });
        }
    }
};
