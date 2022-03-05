const UserPreferencesComponent = {
    template: `
    <div class="container bg-white shadow rounded-2xl d-flex flex-column px-4 py-4">
        <h2 class="text-center">User Preferences</h2>
        <div>
            <div class="form-check form-switch user-select-none">
                <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="fullscreen">
                <label class="form-check-label" for="flexSwitchCheckDefault">Fullscreen</label>
            </div>
        </div>
    </div>`,
    data() {
        return {
            fullscreen: true,
        }
    },
};