const app = Vue.createApp({
    el: '#app',
    template: '<app></app>',
});

app.component('app', App);
app.component('nav-bar', NavBar);

window.addEventListener('DOMContentLoaded', () => {
    app.mount('#app');
});