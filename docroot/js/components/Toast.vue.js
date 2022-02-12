const ToastComponent = {
    props: [
        'toast',
    ],
    template: `
    <div class="toast fade show" :class="'toast-' + toast.type" role="alert" @mouseover="hoverToast = true" @mouseleave="hoverToast = false">
        <div class="toast-header">
            <strong class="me-auto">{{ toast.title }}</strong>
            <button type="button" class="btn-close" aria-label="Close" v-on:click="close"></button>
        </div>
        <div v-if="toast.body" class="toast-body">
            {{ toast.body }}
            <button v-if="modalId" v-on:click="showModal" type="button" class="btn btn-sm" :class="'btn-outline-' + toast.type">Show more</button>
        </div>

        <!-- Modal -->
        <div v-if="modalId" class="modal" tabindex="-1" :id="modalId" @mouseover="hoverModal = true" @mouseleave="hoverModal = false">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">{{ toast.modal.title }}</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <!-- Modal body -->
                <div class="modal-body" v-html="toast.modal.body"></div>

                <!-- Modal footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            timeout: undefined,
            hoverToast: false,
            hoverModal: false,
            counter: 10,
            modalId: undefined,
            modalInstance: undefined,
            modalIsShow: false,
        }
    },
    methods: {
        refreshCounter() {
            if (this.decrementCounter) {
                this.counter--;
                if (this.counter < 0) {
                    this.close();
                }
            }
            this.timeout = setTimeout(this.refreshCounter, 1000);
        },
        close() {
            this.$store.commit('removeToast', this.toast.uuid);
        },
        showModal() {
            this.modalInstance.show();
        },
        modalOn() {
            this.modalIsShow = true;
        },
        modalOff() {
            this.modalIsShow = false;
        }
    },
    computed: {
        decrementCounter: function () {
            return !this.modalIsShow && !this.hoverToast;
        }
    },
    beforeMount() {
        // Set modal id
        if (this.toast.modal) {
            this.modalId = 'modal-toast-' + this.toast.uuid;
        }
    },
    mounted() {
        // Set delay
        if (this.toast.delaySecond) {
            this.counter = this.toast.delaySecond;
            this.timeout = setTimeout(this.refreshCounter, 1000);
        }

        // Set modal
        if (this.toast.modal) {
            let modal = document.getElementById(this.modalId);
            this.modalInstance = new bootstrap.Modal(modal);
            modal.addEventListener('show.bs.modal', this.modalOn, false)
            modal.addEventListener('hidden.bs.modal', this.modalOff, false);
        }
    },
    beforeUnmount() {
        // close modal
        if (this.modalId) {
            this.modalInstance.hide();
        }

        // clear timeout
        clearTimeout(this.timeout);
        this.timeout = undefined;
    }
};