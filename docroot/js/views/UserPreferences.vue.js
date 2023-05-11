const UserPreferencesComponent = {
    template: `
    <div class="container bg-white shadow rounded-2xl d-flex flex-column px-4 py-4">
        <h2 class="text-center">User Preferences</h2>
        <p>This page allows you to set custom values that are global. This means that all hosts are affected by these settings.</p>
        <div>
            <div class="form-check form-switch user-select-none">
                <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="fullscreen" v-on:change="saveSettings">
                <label class="form-check-label" for="flexSwitchCheckDefault">Fullscreen</label>
            </div>
            <div class="input-group mb-3">
                <input type="number" min="0" class="form-control" placeholder="Width" aria-label="Width" v-model="width" v-on:change="saveSettings">
                <span class="input-group-text">x</span>
                <input type="number" min="0" class="form-control" placeholder="Heigh" aria-label="Heigh" v-model="height" v-on:change="saveSettings">
            </div>
        </div>
    </div>`,
    data() {
        return {
            fullscreen: false,
            width: undefined,
            height: undefined,
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
            if ('resolution' in payload) {
                let resolution = payload.resolution.split('x');
                this.width = resolution[0];
                this.height = resolution[1];
            } else {
                this.width = screen.width
                this.height = screen.height
            }
        },
        saveSettings() {
            // make a request to the server to update the user's preferences
            axios.post('/user/prefs/global', {
                fullscreen: this.fullscreen,
                resolution: this.resolution,
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
    computed: {
        resolution() {
            if (this.width === "" || this.height === "") {
                return '';
            }
            return `${this.width}x${this.height}`;
        }
    },
};
