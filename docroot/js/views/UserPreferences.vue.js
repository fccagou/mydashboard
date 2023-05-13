const UserPreferencesComponent = {
    template: `
    <div class="container bg-white shadow rounded-2xl d-flex flex-column px-4 py-4">
        <h2 class="text-center">User Preferences</h2>
        <p>This page allows you to set custom values that are global. This means that all hosts are affected by these settings.</p>
        <div>
            <preference-input
                v-for="preference in preferences"
                v-bind:key="preference.name"
                v-bind:name="preference.name"
                v-bind:type="preference.type"
                v-bind:default="preference.default"
                v-model:value="preference.value">
            </preference-input>
            <button class="btn btn-primary" @click="saveSettings">Save</button>
        </div>
    </div>`,
    data() {
        return {
            preferences: {},
        }
    },
    beforeMount() {
        this.requestGlobalPreferences();
    },
    methods: {
        requestGlobalPreferences() {
            axios.get('/user/preferences/global').then((response) => {
                this.updateSettings(response.data);
            });
        },
        updateSettings(payload) {
            this.preferences = payload.preferences;

            // parse the resolution into width and height
            for (let preference of this.preferences) {
                if (preference.type !== "boolean" && preference.value === preference.default) {
                    preference.value = "";
                }

                if (preference.type === 'resolution') {
                    // replace value with an object
                    if (preference.value) {
                        let resolution = preference.value.split('x');
                        preference.value = {
                            width: resolution[0],
                            height: resolution[1],
                        };
                    }
                    // replace default with an object
                    resolution = preference.default.split('x');
                    preference.default = {
                        width: resolution[0],
                        height: resolution[1],
                    };
                }
            }
        },
        saveSettings() {
            // make a request to the server to update the user's preferences

            let payload = JSON.parse(JSON.stringify(this.preferences));

            // parse the resolution into a string
            for (let preference of payload) {
                if (preference.type === 'resolution') {
                    if (!preference.value.width || !preference.value.height) {
                        preference.value = "";
                    } else {
                        preference.value = preference.value.width + 'x' + preference.value.height;
                    }
                }
            }

            // remove empty values or values that are the same as the default
            payload = payload.filter((preference) => {
                if (preference.value === "" || preference.value === preference.default) {
                    return false;
                }
                return true;
            });

            // remove attributes that are not needed by the server (default, type)
            payload = payload.map((preference) => {
                return {
                    name: preference.name,
                    value: preference.value,
                };
            });

            axios.post('/user/preferences/global', { "preferences": payload }).then((response) => {
                this.$store.commit('addToast', {
                    type: 'success',
                    title: 'Preferences saved',
                    body: 'Your preferences have been saved successfully',
                    delaySecond: 2,
                })
                this.requestGlobalPreferences();
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
