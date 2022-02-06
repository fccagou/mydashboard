const DomainComponent = {
    props: [
        'name',
        'groups',
    ],
    emits: ['connection-request'],
    template: `
    <div class="col align-self-start remote-domain">
        <p class="remote-domain">{{ name }}</p>
        <div class="btn-group-vertical">
            <template v-for="(hosts, groupName) in formattedGroups">
                <host v-for="(param, hostName) in hosts"
                    :key="name + '-' + hostName"
                    :hostname="hostName"
                    :group="groupName"
                    :specific_parameters="param"
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