const app = Vue.createApp({
    el: '#app',
    template: `
    <nav-bar/>
    <div class="container-fluid px-4">
        <router-view class="mt-4"/>
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
app.component('customization', CustomizationComponent);
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