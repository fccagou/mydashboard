const RemoteAccessComponent = {
    template: `
    <!-- The Modal -->
    <div class="modal fade" tabindex="-1" id="myModal">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">{{ modal.title }}</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <!-- Modal body -->
          <div class="modal-body" v-html="modal.body"></div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div id="remote" class="row">
        <site v-for="(domains, siteName) in sites" :key="siteName"
            :name="siteName"
            :domains="domains"
            @connection-request="executeConnection"
            />
    </div>`,
    data() {
        return {
            version: undefined,
            defaults: {},
            hosts: [],
            sites: [],
            connectionInProgress: false,
            modal: {
                title: '',
                body: '',
            },
            interval: null,
        }
    },
    beforeMount() {
        if (!this.interval) {
            this.loadData();
            this.interval = setInterval(this.loadData, 60000);
        }
    },
    beforeUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = null;
    },
    methods: {
        loadData() {
            axios.get('/remote/list').then((response) => {
                this.version = response.data.version;
                this.defaults = response.data.defaults;
                this.hosts = response.data.hosts;
                delete response.data['version'];
                delete response.data['defaults'];
                delete response.data['hosts'];
                this.sites = response.data;
            }).catch((error) => {
                //TODO: show error toast
                console.error("Fail to get list");
            });
        },
        executeConnection(connection) {
            if (this.connectionInProgress) {
                //TODO: show error toast... double connection in //
                return;
            }
            this.connectionInProgress = true;
            connection.host_data_ref.loading = true;
            axios.get(`/remote/${connection.site}/${connection.domain}/${connection.color}/${connection.hostname}`, {
                params: connection.specific_parameters,
            }).then((response) => {
                this.connectionInProgress = false;
                connection.host_data_ref.loading = false;
                if (response.data.status !== 0) {
                    this.modal.title = "Remote exec error (" + response.data.status + ")";
                    this.modal.body = "<p>URL :" +
                        response.request.responseURL +
                        "</p><hr>" +
                        "<p>Command:<br/>" +
                        response.data.cmd +
                        "</p><hr>" +
                        "<p>Message:<br/>" +
                        response.data.msg.replace(/\n/g, "</br>") +
                        "</p>";
                    new bootstrap.Modal(document.getElementById('myModal')).show();
                }
            }).catch((error) => {
                this.modal.title = "Error (" + error.response.status + ") occurs accessing " + error.request.responseURL;
                this.modal.body = error.response.data;
                new bootstrap.Modal(document.getElementById('myModal')).show();
            })
        }
    }
};