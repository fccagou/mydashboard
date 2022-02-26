const SiteComponent = {
    props: [
        'name',
        'domains',
        'lock',
    ],
    emits: ['connection-request'],
    template: `
    <div class="col">
        <div class="card h-100">
            <div class="card-header d-flex align-items-center">
                <img class="site-icon" src="/img/computer.svg" /> {{ name }}
            </div>
            <div class="card-body">
                <div class="row">
                    <domain v-for="(groups, domainName) in domains" :key="name + '-' + domainName"
                        :name="domainName" :groups="groups" :lock="lock"
                        @connection-request="forwardConnectionRequest"
                        />
                </div>
            </div>
        </div>
    </div>`,
    methods: {
        forwardConnectionRequest(connection) {
            connection['site'] = this.name;
            this.$emit('connection-request', connection);
        }
    }
};