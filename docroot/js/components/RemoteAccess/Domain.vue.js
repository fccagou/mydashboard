const DomainComponent = {
    props: [
        'name',
        'colors',
    ],
    emits: ['connection-request'],
    template: `
    <div class="col align-self-start remote-domain">
        <p class="remote-domain">{{ name }}</p>
        <div class="btn-group-vertical">
            <template v-for="(hosts, colorName) in formattedColors">
                <host v-for="(param, hostName) in hosts"
                    :key="name + '-' + hostName"
                    :hostname="hostName"
                    :color="colorName"
                    :specific_parameters="param"
                    @connection-request="forwardConnectionRequest"/>
            </template>
        </div>
    </div>`,
    computed: {
        formattedColors: function () {
            let newColors = {};
            for (let colorName in this.colors) {
                let hosts = this.colors[colorName];
                newColors[colorName] = {};
                if (Array.isArray(hosts)) {
                    // Convert Array to object like { host: {} }
                    hosts.forEach((host) => newColors[colorName][host] = {})
                } else {
                    // If already a object juste assign to color
                    newColors[colorName] = hosts;
                }
            };
            return newColors;
        }
    },
    methods: {
        forwardConnectionRequest(connection) {
            connection['domain'] = this.name;
            this.$emit('connection-request', connection);
        }
    }
};