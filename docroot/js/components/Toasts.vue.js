const ToastsComponent = {
    template: `
    <div class="toast-container position-absolute bottom-0 end-0 m-2">
        <toast v-for="toast in $store.state.toasts" :toast="toast"/>
    </div>`,
};