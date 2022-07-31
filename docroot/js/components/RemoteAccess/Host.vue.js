const HostComponent = {
    props: [
        'groupName',
        'host',
        'lock',
    ],
    emits: ['connection-request'],
    template: `
    <button ref="button" class="btn no-z-index text-nowrap"
        role="button"
        :disabled="disableButton"
        v-on:click="handleRequestConnection"
        v-on:contextmenu.prevent="handleRightClick"
        :class="classObject">
        <template v-if="loading">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </template>
        {{ hostname }}
    </button>

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
                    <li>Protocol parameters : {{ hostDetailled.config[hostDetailled.config.proto] }}</li>
                </ul>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="connectWithModal">Connect</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            loading: false,
            classObject: {
                'host-padding': true,
            },
            modalInstance: undefined,
            modalIsShow: false,
            hostDetailled: undefined,
        }
    },
    beforeMount() {
        this.classObject['group-' + this.groupName] = true;
    },
    mounted() {
        // Set modal
        let modal = this.$refs["modal"];
        modal.addEventListener('show.bs.modal', () => this.modalIsShow = true, false)
        modal.addEventListener('hidden.bs.modal', () => this.modalIsShow = false, false);
        this.modalInstance = new bootstrap.Modal(modal);
    },
    methods: {
        handleRequestConnection() {
            if (this.loading) { // ignore when already loading...
                return;
            }
            this.$emit('connection-request', {
                host_uuid: this.host.uuid,
                hostname: this.hostname,
                host_data_ref: this.$data
            });
        },
        loadDetailledHost() {
            axios.get(`/remote/info/${this.host.uuid}`).then((response) => {
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
        handleRightClick() {
            //TODO: Context menu
            if (this.loading) { // ignore when already loading...
                return;
            }
            this.loadDetailledHost();
            this.modalInstance.show();
        },
        connectWithModal() {
            this.modalInstance.hide();
            this.handleRequestConnection();
        }
    },
    computed: {
        disableButton: function () {
            return !this.loading && this.lock;
        },
        hostname: function () {
            if (this.host.hasOwnProperty("alias")) {
                return this.host.alias;
            }
            return this.host.name;
        }
    },
    watch: {
        loading(newStatus, oldStatus) {
            if (newStatus) {
                // add 2px for border
                this.$refs.button.style.width = (this.$refs.button.clientWidth + 2) + 'px';
                this.classObject['host-padding'] = false;
            } else {
                this.$refs.button.style.removeProperty('width');
                this.classObject['host-padding'] = true;
            }
        }
    }
};