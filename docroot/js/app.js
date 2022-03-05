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
app.component('nav-bar', NavBarComponent);
app.component('site', SiteComponent);
app.component('domain', DomainComponent);
app.component('host', HostComponent);

window.addEventListener('DOMContentLoaded', () => {
    app.mount('#app');
});