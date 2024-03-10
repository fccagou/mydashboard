const HostCustomModal = {
    props: [
        'host_uuid',
        'trigger_show_modal'
    ],
    template: `
    <div ref="modal" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title">Customization of {{ hostname }}</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <!-- Modal body -->
            <div class="modal-body" v-if="hostDetailled">
                <preference-input
                    v-for="preference in preferences"
                    v-bind:key="preference.name"
                    v-bind:name="preference.name"
                    v-bind:type="preference.type"
                    v-bind:default="preference.default"
                    v-model:value="preference.value">
                </preference-input>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">Save</button>
            </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            loading: false,
            modalInstance: undefined,
            hostDetailled: undefined,
            preferences: {},
        }
    },
    mounted() {
        // Set modal
        const modal = this.$refs["modal"];
        this.modalInstance = new bootstrap.Modal(modal);
    },
    methods: {
        loadDetailledHost() {
            axios.get(`/remote/info/${this.host_uuid}`).then((response) => {
                this.hostDetailled = response.data;
            }).catch((error) => {
                this.$store.commit('addToast', {
                    type: 'warning',
                    title: 'Unable to contact API',
                    body: 'Impossible to retrieve information of the available hosts',
                    delaySecond: 10,
                })
            });
        },
        requestGlobalPreferences() {
            axios.get('/user/preferences/global').then((response) => {
                this.updateSettings(response.data);
            });
        },
        updateSettings(payload) {
            this.preferences = payload.preferences;

            // parse the resolution into width and height
            for (let preference of this.preferences) {
                if (preference.type !== "bool" && preference.value === preference.default) {
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
    computed: {
        disableButton: function () {
            return !this.loading && this.lock;
        },
        hostname: function () {
            if (this.hostDetailled === undefined) {
                return "Loading...";
            }
            if (this.hostDetailled.hasOwnProperty("alias")) {
                return this.hostDetailled.alias;
            }
            return this.hostDetailled.name;
        }
    },
    watch: {
        trigger_show_modal(newVal, oldVal) {
            this.modalInstance.show();
            this.loadDetailledHost();
            this.requestGlobalPreferences();
        }
    }
};