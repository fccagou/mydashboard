const HostComponent = {
    props: [
        'group',
        'hostname',
        'specific_parameters',
        'lock',
    ],
    emits: ['connection-request'],
    template: `
    <button ref="button" class="btn no-z-index text-nowrap"
        role="button"
        :disabled="disableButton"
        v-on:click="handleRequestConnection"
        :class="classObject">
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
        this.classObject['group-' + this.group] = true;
    },
    methods: {
        handleRequestConnection() {
            if (this.loading) { // ignore when already loading...
                return;
            }
            this.$emit('connection-request', {
                group: this.group,
                hostname: this.hostname,
                specific_parameters: this.specific_parameters,
                host_data_ref: this.$data
            });
        }
    },
    computed: {
        disableButton: function () {
            return !this.loading && this.lock;
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