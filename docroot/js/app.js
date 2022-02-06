const app = Vue.createApp({
    el: '#app',
    template: '<app></app>',
});

app.component('app', App);
app.component('nav-bar', NavBar);

app.component('remote-access', RemoteAccess);
app.component('site', Site);
app.component('domain', Domain);
app.component('host', Host);

window.addEventListener('DOMContentLoaded', () => {
    app.mount('#app');
});