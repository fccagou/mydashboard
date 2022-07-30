const SiteComponent = {
    props: [
        'name',
        'domains',
        'ordering',
        'lock',
    ],
    emits: ['connection-request'],
    template: `
    <div class="bg-white shadow rounded-2xl site-width">
        <div class="d-flex align-items-center px-3 py-2 bg-site rounded-top-2xl border-bottom border-2">
            <img class="site-icon" src="/img/computer.svg" /> <span class="font-bold">{{ name }}</span>
        </div>
        <div class="px-5 py-3 d-flex flex-wrap gap-5 justify-content-evenly">
            <domain v-for="domain in domains_ordered" :key="name + '-' + domain.name"
                :name="domain.name" :groups="domain.groups" :lock="lock"
                @connection-request="forwardConnectionRequest"
                />
        </div>
    </div>`,
    methods: {
        forwardConnectionRequest(connection) {
            connection['site'] = this.name;
            this.$emit('connection-request', connection);
        }
    },
    computed: {
        domains_ordered: function () {
            return this.domains.sort((a, b) => {
                if (this.ordering["domains"].hasOwnProperty(a.name) && this.ordering["domains"].hasOwnProperty(b.name)) {
                    return this.ordering["domains"][a.name].order > this.ordering["domains"][b.name].order;
                } else {
                    return 0;
                }
            });
        }
    }
};