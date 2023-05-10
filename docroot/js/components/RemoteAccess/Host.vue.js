const HostComponent = {
    props: [
        'groupName',
        'host',
        'lock',
    ],
    emits: ['connection-request', 'host-information-modal-request'],
    template: `
    <button ref="button" class="btn no-z-index text-nowrap"
        role="button"
        :disabled="disableButton"
        v-on:click="handleRequestConnection"
        v-on:contextmenu.prevent="handleRightClick"
        :class="classObject">
        :class="[classObject, { 'cursor-wait': loading }]">
        <template v-if="loading">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </template>
        {{ hostname }}
    </button>`,
    data() {
        return {
            loading: false,
            classObject: {
                'host-padding': true,
            },
        }
    },
    beforeMount() {
        this.classObject['group-' + this.groupName] = true;
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
            this.$emit('host-information-modal-request', this.host.uuid);
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