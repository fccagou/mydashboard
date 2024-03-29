const NavBarComponent = {
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow">
      <div class="container-fluid">
        <router-link class="navbar-brand" :to="{ name: 'RemoteAccess' }">My Dashboard</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <div class="navbar-nav" id="mynav">
            <a class="nav-link" target="_blank" v-for="(value, key, index) in links" key="{{ key }}-{{ index }}" :href="value">{{ key }}</a>
          </div>
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