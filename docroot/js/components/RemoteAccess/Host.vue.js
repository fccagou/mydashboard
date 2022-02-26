const HostComponent = {
    props: [
        'group',
        'hostname',
        'specific_parameters',
        'lock',
    ],
    emits: ['connection-request'],
    template: `
    <button class="btn no-z-index text-nowrap"
        role="button"
        :disabled="disableButton"
        v-on:click="handleRequestConnection"
        :class="'group-' + group">
        <template v-if="loading">
            <span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
        </template>
        {{ hostname }}
    </button>`,
    data() {
        return {
            loading: false,
        }
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
    }
};