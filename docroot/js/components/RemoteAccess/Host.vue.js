const HostComponent = {
    props: [
        'groupName',
        'host',
        'lock',
    ],
    emits: ['connection-request', 'menu-request'],
    template: `
    <div class="btn-group dropend">
        <button ref="button" class="btn no-z-index text-nowrap"
            type="button"
            :disabled="disableButton"
            v-on:click="handleRequestConnection"
            v-on:contextmenu.prevent="handleRightClick"
            :class="[classObject, { 'cursor-wait': loading }]">
            <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            {{ hostname }}
        </button>
    </div>
    `,
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
        handleRightClick(event) {
            if (this.loading) { // ignore when already loading...
                return;
            }
            this.$emit('menu-request', {
                host_uuid: this.host.uuid,
                hostname: this.hostname,
                host_data_ref: this.$data,
                event: event,
            });
        },
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