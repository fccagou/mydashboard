const HostMenuComponent = {
    props: [
        'host',
        'trigger',
    ],
    emits: ['connection-request', 'host-information-modal-request'],
    template: `
        <ul ref="menu" class="dropdown-menu" v-click-outside="hideMenu" :class="{ show: showMenu }" :style="position">
            <li><a class="dropdown-item" href="#" v-on:click="connect"><i class="bi bi-plugin"></i> Connect</a></li>
            <li><a class="dropdown-item" href="#" v-on:click="showCustom"><i class="bi bi-pencil-square"></i> Customize</a></li>
            <li><a class="dropdown-item" href="#" v-on:click="showInformation"><i class="bi bi-info-circle"></i> Properties</a></li>
        </ul>
        <host-information-modal :host_uuid="host.host_uuid" :trigger_show_modal="triggerShowModal" />
        <host-custom-modal :host_uuid="host.host_uuid" :trigger_show_modal="triggerShowCustomModal" />
    `,
    data() {
        return {
            contextMenuInstance: null,
            triggerShowModal: false,
            triggerShowCustomModal: false,
            showMenu: false,
            position: {},
        }
    },
    beforeMount() {
        addEventListener("resize", () => this.hideMenu());
    },
    unmounted() {
        removeEventListener("resize", () => this.hideMenu());
    },
    methods: {
        connect() {
            this.$emit('connection-request', this.host);
            this.hideMenu();
        },
        showInformation() {
            this.triggerShowModal = !this.triggerShowModal;
            this.hideMenu();
        },
        showCustom() {
            this.triggerShowCustomModal = !this.triggerShowCustomModal;
            this.hideMenu();
        },
        hideMenu() {
            this.showMenu = false;
        },
        processPosition() {
            const x = this.host.event.clientX;
            const y = this.host.event.clientY;
            const menu = this.$refs.menu;
            const menuWidth = menu.offsetWidth;
            const menuHeight = menu.offsetHeight;
            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;
            const left = x - menuWidth - scrollX;
            const top = y - menuHeight + scrollY;

            return {
                'top': top + 'px',
                'left': left + 'px',
            };
        }
    },
    watch: {
        trigger(newTrigger, oldTrigger) {
            this.showMenu = true;
            this.position = this.processPosition();
        }
    }
};