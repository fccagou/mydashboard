const HostComponent = {
    props: [
        'group',
        'hostname',
        'specific_parameters',
    ],
    emits: ['connection-request'],
    template: `
    <button class="btn"
        role="button"
        v-on:click="handleRequestConnection"
        :class="'group-' + group">
        <template v-if="loading">
            <span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> Connection...
        </template>
        <template v-else>{{ hostname }}</template>
    </button>`,
    data() {
        return {
            loading: false,
        }
    },
    methods: {
        handleRequestConnection() {
            this.$emit('connection-request', {
                group: this.group,
                hostname: this.hostname,
                specific_parameters: this.specific_parameters,
                host_data_ref: this.$data
            });
        }
    }
};