const NavBarComponent = {
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow">
      <div class="container-fluid">
        <router-link class="navbar-brand" :to="{ name: 'RemoteAccess' }">My Dashboard</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <i class="bi bi-list"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <div class="navbar-nav me-auto">
            <a class="nav-link" target="_blank" v-for="(value, key, index) in links" key="{{ key }}-{{ index }}" :href="value">{{ key }}</a>
          </div>

          <router-link type="button" class="btn btn-success btn-settings rounded-pill" :to="{ name: 'UserPreferences' }"><i class="bi bi-gear-fill"></i> Settings</router-link>
        </div>
      </div>
    </nav>`,
  data() {
    return {
      links: [],
    }
  },
  beforeMount() {
    axios.get('/conf/menu').then((response) => {
      this.links = response.data;
    }).catch((error) => {
      console.error("Fail to get menu");
    });
  }
};