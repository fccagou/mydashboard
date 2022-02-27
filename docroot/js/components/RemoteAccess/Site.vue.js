const SiteComponent = {
    props: [
        'name',
        'domains',
        'lock',
    ],
    emits: ['connection-request'],
    template: `
    <div class="bg-white shadow rounded-2xl site-width">
        <div class="d-flex align-items-center px-3 py-2 bg-site rounded-top-2xl border-bottom border-2">
            <img class="site-icon" src="/img/computer.svg" /> <span class="font-bold">{{ name }}</span>
        </div>
        <div class="px-5 py-3 d-flex flex-wrap flex-md-nowrap gap-5 justify-content-evenly">
            <domain v-for="(groups, domainName) in domains" :key="name + '-' + domainName"
                :name="domainName" :groups="groups" :lock="lock"
                @connection-request="forwardConnectionRequest"
                />
        </div>
    </div>`,
    methods: {
        forwardConnectionRequest(connection) {
            connection['site'] = this.name;
            this.$emit('connection-request', connection);
        }
    }
};