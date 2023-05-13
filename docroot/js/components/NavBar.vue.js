const NavBarComponent = {
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow">
      <div class="container-fluid">
        <router-link class="navbar-brand fs-4 fw-bold" :to="{ name: 'RemoteAccess' }">My Dashboard</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <i class="bi bi-list"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <div class="navbar-nav me-auto">
            <a class="nav-link" target="_blank" v-for="(link, index) in links" :key="index" :href="link.url">{{ link.label }}</a>
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
      if ("menu" in response.data) {
        this.links = response.data.menu;
      }
    }).catch((error) => {
      console.error("Fail to get menu");
    });
  }
};