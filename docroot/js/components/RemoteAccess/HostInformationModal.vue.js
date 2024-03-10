const HostInformationModal = {
    props: [
        'host_uuid',
        'trigger_show_modal'
    ],
    template: `
    <div ref="modal" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title">Connection Information of {{ hostname }}</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <!-- Modal body -->
            <div class="modal-body" v-if="hostDetailled">
                <ul>
                    <li>Name : {{ hostDetailled.name }}</li>
                    <li>Alias : {{ hostDetailled.alias }}</li>
                    <li>Site : {{ hostDetailled.config.site }}</li>
                    <li>Domain : {{ hostDetailled.config.domain }}</li>
                    <li>Group : {{ hostDetailled.config.group }}</li>
                    <li>Protocol : {{ hostDetailled.config.proto }}</li>
                    <li v-if="hostDetailled.config['proto-config']">
                        Protocol parameters :
                        <ul>
                            <li v-for="(v, k) in hostDetailled.config['proto-config']">{{ k }} : {{ v }}</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            loading: false,
            modalInstance: undefined,
            hostDetailled: undefined,
        }
    },
    mounted() {
        // Set modal
        const modal = this.$refs["modal"];
        this.modalInstance = new bootstrap.Modal(modal);
    },
    methods: {
        loadDetailledHost() {
            axios.get(`/remote/info/${this.host_uuid}`).then((response) => {
                this.hostDetailled = response.data;
            }).catch((error) => {
                this.$store.commit('addToast', {
                    type: 'warning',
                    title: 'Unable to contact API',
                    body: 'Impossible to retrieve information of the available hosts',
                    delaySecond: 10,
                })
            });
        },
    },
    computed: {
        disableButton: function () {
            return !this.loading && this.lock;
        },
        hostname: function () {
            if (this.hostDetailled === undefined) {
                return "Loading...";
            }
            if (this.hostDetailled.hasOwnProperty("alias")) {
                return this.hostDetailled.alias;
            }
            return this.hostDetailled.name;
        }
    },
    watch: {
        trigger_show_modal(newVal, oldVal) {
            this.modalInstance.show();
            this.loadDetailledHost();
        }
    }
};