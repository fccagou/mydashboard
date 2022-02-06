const app = Vue.createApp({
    el: '#app',
    template: `
    <nav-bar/>
    <div class="container-fluid">
        <router-view/>
    </div>`,
});

// Configure routes
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});
app.use(router);

// Views
app.component('remote-access', RemoteAccessComponent);
app.component('customization', CustomizationComponent);

// Components
app.component('nav-bar', NavBarComponent);
app.component('site', SiteComponent);
app.component('domain', DomainComponent);
app.component('host', HostComponent);

window.addEventListener('DOMContentLoaded', () => {
    app.mount('#app');
});