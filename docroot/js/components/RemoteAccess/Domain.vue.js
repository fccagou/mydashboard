const DomainComponent = {
    props: [
        'name',
        'groups',
        'lock',
    ],
    emits: ['connection-request'],
    template: `
    <div class="d-flex flex-column align-items-center">
        <p>{{ name }}</p>
        <div class="btn-group-vertical shadow-lg">
            <template v-for="group in groups">
                <host v-for="host in group.hosts"
                    :key="name + '-' + host.name"
                    :host="host"
                    :groupName="group.name"
                    :lock="lock"
                    @connection-request="forwardConnectionRequest"/>
            </template>
        </div>
    </div>`,
    methods: {
        forwardConnectionRequest(connection) {
            connection['domain'] = this.name;
            this.$emit('connection-request', connection);
        }
    }
};