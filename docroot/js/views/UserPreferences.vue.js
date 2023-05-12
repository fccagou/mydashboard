const UserPreferencesComponent = {
    template: `
    <div class="container bg-white shadow rounded-2xl d-flex flex-column px-4 py-4">
        <h2 class="text-center">User Preferences</h2>
        <div>
            <div class="form-check form-switch user-select-none">
                <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="fullscreen" v-on:change="saveSettings">
                <label class="form-check-label" for="flexSwitchCheckDefault">Fullscreen</label>
            </div>
        </div>
    </div>`,
    data() {
        return {
            fullscreen: false,
        }
    },
    beforeMount() {
        this.requestGlobalPreferences();
    },
    methods: {
        requestGlobalPreferences() {
            axios.get('/user/prefs/global').then((response) => {
                this.updateSettings(response.data);
            });
        },
        updateSettings(payload) {
            // if fullscreen is in response data
            if ('fullscreen' in payload) {
                this.fullscreen = payload.fullscreen;
            }
        },
        saveSettings() {
            // make a request to the server to update the user's preferences
            axios.post('/user/prefs/global', {
                fullscreen: this.fullscreen,
            }).then((response) => {
                this.$store.commit('addToast', {
                    type: 'success',
                    title: 'Preferences saved',
                    body: 'Your preferences have been saved successfully',
                    delaySecond: 2,
                })
            }).catch((error) => {
                this.$store.commit('addToast', {
                    type: 'warning',
                    title: 'Failed to save preferences',
                    body: error.response.data.errors,
                    delaySecond: 10,
                })
            })
        },
    },
};