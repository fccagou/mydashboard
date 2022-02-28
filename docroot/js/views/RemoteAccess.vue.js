const RemoteAccessComponent = {
    template: `
    <div class="d-flex flex-wrap gap-4 justify-content-evenly">
        <site v-for="(domains, siteName, index) in sites" :key="siteName"
            :name="siteName"
            :domains="domains"
            :lock="connectionInProgress"
            @connection-request="executeConnection"
            />
    </div>`,
    data() {
        return {
            version: undefined,
            defaults: {},
            hosts: [],
            sites: [],
            connectionInProgress: false,
            interval: null,
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
                this.version = response.data.version;
                this.defaults = response.data.defaults;
                this.hosts = response.data.hosts;
                delete response.data['version'];
                delete response.data['defaults'];
                delete response.data['hosts'];
                this.sites = response.data;
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
            axios.get(`/remote/${connection.site}/${connection.domain}/${connection.group}/${connection.hostname}`, {
                params: connection.specific_parameters,
            }).then((response) => {
                if (response.data.status !== 0) {
                    this.$store.commit('addToast', {
                        type: 'danger',
                        title: 'Connection error',
                        body: `Cant't connect to ${connection.hostname}`,
                        delaySecond: 60,
                        modal: {
                            title: 'Remote exec error (' + response.data.status + ')',
                            body: "<p>URL :" + response.request.responseURL + "</p><hr>" +
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
        }
    },
};