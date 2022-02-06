const SiteComponent = {
    props: [
        'name',
        'domains',
    ],
    emits: ['connection-request'],
    template: `
    <div class="col justify-content-center">
        <div class="col">
            <div class="card border-dark mb-3">
                <div class="card-header d-flex align-items-center">
                    <img class="site-icon" src="/img/computer.svg" /> {{ name }}
                </div>
                <div class="card-body text-dark">
                    <div class="row">
                        <domain v-for="(colors, domainName) in domains" :key="name + '-' + domainName"
                            :name="domainName" :colors="colors"
                            @connection-request="forwardConnectionRequest"
                            />
                    </div>
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