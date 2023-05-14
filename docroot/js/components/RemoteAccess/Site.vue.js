const SiteComponent = {
    props: [
        'name',
        'domains',
        'ordering',
        'lock',
    ],
    emits: ['connection-request', 'menu-request'],
    template: `
    <div class="bg-white shadow rounded-2xl site-width">
        <div class="d-flex align-items-center px-3 py-2 bg-site rounded-top-2xl border-bottom border-2">
            <img class="site-icon" src="/img/computer.svg" /> <span class="fw-bold">{{ name }}</span>
        </div>
        <div class="px-5 py-3 d-flex flex-wrap gap-5 justify-content-evenly">
            <domain v-for="domain in domains_ordered" :key="name + '-' + domain.name"
                :name="domain.name" :groups="domain.groups" :lock="lock" :ordering="domains_ordering(domain.name)"
                @connection-request="forwardConnectionRequest"
                @menu-request="forwardMenuRequest"
                />
        </div>
    </div>`,
    methods: {
        forwardConnectionRequest(connection) {
            connection['site'] = this.name;
            this.$emit('connection-request', connection);
        },
        forwardMenuRequest(host) {
            this.$emit('menu-request', host);
        },
        domains_ordering(domain_name) {
            if (!this.ordering.hasOwnProperty("domains")) {
                return {}
            }
            return this.ordering["domains"].hasOwnProperty(domain_name) ? this.ordering["domains"][domain_name] : {};
        }
    },
    computed: {
        domains_ordered: function () {
            return this.domains.sort((a, b) => {
                if (this.ordering.hasOwnProperty("domains")) {
                    const order_a = this.ordering["domains"].hasOwnProperty(a.name) ? this.ordering["domains"][a.name].order : 0;
                    const order_b = this.ordering["domains"].hasOwnProperty(b.name) ? this.ordering["domains"][b.name].order : 0;
                    return order_a > order_b;
                } else {
                    return 0;
                }
            });
        }
    }
};