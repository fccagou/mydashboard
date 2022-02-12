const store = Vuex.createStore({
    state: {
        toasts: [],
    },
    mutations: {
        addToast(state, toast) {
            let taggedToast = toast;
            taggedToast['uuid'] = uuidv4();
            state.toasts.push(taggedToast);
        },
        removeToast(state, uuid) {
            this.state.toasts = state.toasts.filter((toast) => toast.uuid != uuid);
        }
    },
});

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}