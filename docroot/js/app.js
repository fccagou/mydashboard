const app = Vue.createApp({
    el: '#app',
    template: `
    <nav-bar/>
    <div class="container-fluid px-4 flex-grow-1 py-4">
        <router-view/>
    </div>
    <toasts/>`,
});

// Configure routes
const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
});
app.use(router);

// const vuex = Vuex.createStore(store);
app.use(store);

// Views
app.component('remote-access', RemoteAccessComponent);
app.component('user-preferences', UserPreferencesComponent);
app.component('not-found', NotFoundComponent);

// Components
app.component('toasts', ToastsComponent);
app.component('toast', ToastComponent);
app.component('preference-input', PreferenceInputComponent);
app.component('nav-bar', NavBarComponent);
app.component('site', SiteComponent);
app.component('domain', DomainComponent);
app.component('host', HostComponent);
app.component('host-menu', HostMenuComponent);
app.component('host-information-modal', HostInformationModal);

const clickOutside = {
    beforeMount: (el, binding) => {
        el.clickOutsideEvent = event => {
            // here I check that click was outside the el and his children
            if (!(el == event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                binding.value();
            }
        };
        document.addEventListener("mousedown", el.clickOutsideEvent);
    },
    unmounted: el => {
        document.removeEventListener("mousedown", el.clickOutsideEvent);
    },
};
app.directive('click-outside', clickOutside);

window.addEventListener('DOMContentLoaded', () => {
    app.mount('#app');
});