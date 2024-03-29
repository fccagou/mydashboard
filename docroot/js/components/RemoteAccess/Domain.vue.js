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
        <div class="btn-group-vertical">
            <template v-for="(hosts, groupName) in formattedGroups">
                <host v-for="(param, hostName) in hosts"
                    :key="name + '-' + hostName"
                    :hostname="hostName"
                    :group="groupName"
                    :specific_parameters="param"
                    :lock="lock"
                    @connection-request="forwardConnectionRequest"/>
            </template>
        </div>
    </div>`,
    computed: {
        formattedGroups: function () {
            let newGroups = {};
            for (let groupName in this.groups) {
                let hosts = this.groups[groupName];
                newGroups[groupName] = {};
                if (Array.isArray(hosts)) {
                    // Convert Array to object like { host: {} }
                    hosts.forEach((host) => newGroups[groupName][host] = {})
                } else {
                    // If already a object juste assign to group
                    newGroups[groupName] = hosts;
                }
            };
            return newGroups;
        }
    },
    methods: {
        forwardConnectionRequest(connection) {
            connection['domain'] = this.name;
            this.$emit('connection-request', connection);
        }
    }
};