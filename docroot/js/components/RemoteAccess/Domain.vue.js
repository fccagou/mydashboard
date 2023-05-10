const DomainComponent = {
    props: [
        'name',
        'groups',
        'ordering',
        'lock',
    ],
    emits: ['connection-request', 'host-information-modal-request'],
    template: `
    <div class="d-flex flex-column align-items-center">
        <p>{{ name }}</p>
        <div class="btn-group-vertical shadow-lg">
            <template v-for="group in groups_ordered">
                <host v-for="host in group.hosts"
                    :key="name + '-' + host.name"
                    :host="host"
                    :groupName="group.name"
                    :lock="lock"
                    @connection-request="forwardConnectionRequest"
                    @host-information-modal-request="forwardHostModalRequest"/>
            </template>
        </div>
    </div>`,
    methods: {
        forwardConnectionRequest(connection) {
            connection['domain'] = this.name;
            this.$emit('connection-request', connection);
        },
        forwardHostModalRequest(host) {
            this.$emit('host-information-modal-request', host);
        }
    },
    computed: {
        groups_ordered: function () {
            return this.groups.sort((a, b) => {
                if (this.ordering.hasOwnProperty("groups")) {
                    const order_a = this.ordering["groups"].hasOwnProperty(a.name) ? this.ordering["groups"][a.name].order : 0;
                    const order_b = this.ordering["groups"].hasOwnProperty(b.name) ? this.ordering["groups"][b.name].order : 0;
                    return order_a > order_b;
                } else {
                    return 0;
                }
            });
        }
    }
};