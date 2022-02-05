// Return 1 if a > b
// Return -1 if a < b
// Return 0 if a == b
function version_compare(a, b) {
  if (a === b) {
    return 0;
  }

  var a_components = a.split(".");
  var b_components = b.split(".");

  var len = Math.min(a_components.length, b_components.length);

  // loop while the components are equal
  for (var i = 0; i < len; i++) {
    // A bigger than B
    if (parseInt(a_components[i]) > parseInt(b_components[i])) {
      return 1;
    }

    // B bigger than A
    if (parseInt(a_components[i]) < parseInt(b_components[i])) {
      return -1;
    }
  }

  // If one's a prefix of the other, the longer one is greater.
  if (a_components.length > b_components.length) {
    return 1;
  }

  if (a_components.length < b_components.length) {
    return -1;
  }

  // Otherwise they are the same.
  return 0;
}


function api_exec(api, html_object) {
  var xhr = new XMLHttpRequest();
  var prev_html = $(html_object).html();

  $(html_object).html(
    '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Connection...'
  );

  xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      $(html_object).html(prev_html);
      if (xhr.status === 200) {
        // Code OK
        var exec = JSON.parse(xhr.responseText);
        if (exec.status != "0") {
          $("#myModalTitle").text("Remote exec error (" + exec.status + ")");
          $("#myModalBody").html(
            "<p>URL :" +
              api +
              "</p><hr>" +
              "<p>Command:<br/>" +
              exec.cmd +
              "</p><hr>" +
              "<p>Message:<br/>" +
              exec.msg.replace(/\n/g, "</br>") +
              "</p>"
          );
          // $("#myModalCloseBtn").attr("class", "btn btn-success");
          $("#myModal").modal();
        }
      } else {
        // Code KO
        $("#myModalTitle").text(
          "Error (" + xhr.status + ") occurs accessing " + api
        );
        $("#myModalBody").text(xhr.responseText);
        //$("#myModalCloseBtn").attr("class", "btn btn-danger");
        $("#myModal").modal();
      }
    }
  });

  xhr.open("GET", api);
  xhr.send(null);
}

function host2api(h, defaults) {
  // Idee : Tester les Promise
  // faire une requête dédiée aux status de host pour décider de l'affichage
  // ou nom des hosts.
  var url = "";
  if (h.config.hasOwnProperty("proto")) {
    var proto = h.config.proto;

    switch (proto) {
      case "rdp":
        url = "?proto=" + proto;
        var sec = "";

        try {
          sec = h.config[proto].sec;
        } catch {
          try {
            sec = defaults.rdp.sec;
          } catch {
            sec = "";
          }
        }
        if (["nla", "tls", ""].find((e) => e == sec) === undefined) {
          // Check in default conf
          sec = "conf_error";
        }
        if (sec.length > 0) {
          url = url + "&sec=" + sec;
        }
        break;
      case "ssh":
        url = "?proto=" + proto;
        var port = 22;
        try {
          port = h.config[proto].port;
        } catch {
          try {
            port = defaults.ssh.port;
          } catch {
            // to nothing
          }
        }
        if (!typeof port === Number) {
          port = "-1";
        }
        url = url + "&port=" + port;
        break;
      default:
        // nothing todo
        url = "?proto=conf_error";
        break;
    }
  }
  return url;
}

async function RemoteDisplay(container_id) {
  $.getJSON("/remote/list", function (data) {
    var items = [];

    var i = 0;
    if (
      data.hasOwnProperty("version") &&
      version_compare(data.version, "0.0.13") > 0
    ) {
      var svg = d3.select(container_id).select("svg");
      svg.attr("width", 640).attr("height", 480);

      // defaults
      //   protocols
      //     protoname
      //        prop1: val1
      //        prop2: val2
      //
      // sitee
      // domains
      // hosts
      //     name:
      //     config:
      //        transport: rdp
      //        rdp:
      //            sec: nla
      //
      if (!data.hasOwnProperty("hosts")) {
        alert("no host defined");
      } else {

        var defaultConfig = {};
        if (data.hasOwnProperty("defaults")) {
          defaultConfig = data.defaults;
        }

        var hosts = svg.selectAll("g").data(data.hosts);

        var g = hosts.enter().append("g");

        g.append("circle")
          .attr("r", 10)
          .attr("fill", "green")
          .attr("cx", 30)
          .attr("cy", function (d, i) {
            return 40 * (i + 1);
          });
        g.append("text")
          .attr("x", 45)
          .attr("y", function (d, i) {
            return 40 * (i + 1) + 5;
          })
          .text(function (d, i) {
            return d.name;
          });

        g.on("click", function (d) {
          var h = d["originalTarget"].__data__;
          var urlParams = "";
          var url = "/remote";

          // Add api version prefix
          if (!h.hasOwnProperty("config")) {
            // Bad conf
            urlParams = "bad config";
          } else {
            urlParams = host2api(h, defaultConfig);
            url = [
              url,
              h.config.site,
              h.config.domain,
              h.config.group,
              h.name,
            ].join("/");
          }
          console.log(urlParams);
          api_exec(url + urlParams);
        });

        hosts.exit().attr("fill", "red");
        //.remove();


      }
    } else {
      $.each(data, function (site) {
        if (
          typeof data[site] === "string" ||
          site == "defaults" ||
          site == "hosts"
        ) {
          return;
        }
        items.push('<div class="col justify-content-center">');
        items.push('<div class="col">');
        items.push('<div class="card border-dark mb-3" >');
        items.push(
          '<div class="card-header"><img src="/computer.png" />' +
            site +
            "</div>"
        );
        items.push('<div class="card-body text-dark">');
        items.push('<div class="row">');

        $.each(data[site], function (domain, val) {
          items.push(
            '<div class="col align-self-start remote-domain"><p class="remote-domain">' +
              domain +
              '</p><div class="btn-group-vertical">'
          );

          $.each(val, function (group, remote_host_list) {
            $.each(remote_host_list, function (h, attrs) {
              // TODO: add default value from conf
              var url_options = "";

              if (typeof h === "number") {
                remote_host = remote_host_list[h];
              } else {
                remote_host = h;
                if ("proto" in attrs) {
                  // TODO: add check safe parameters.
                  url_options = "?proto=" + attrs["proto"];
                  if ("sec" in attrs) {
                    url_options += "&sec=" + attrs["sec"];
                  }
                }
              }

              var url =
                "/remote/" +
                site +
                "/" +
                domain +
                "/" +
                group +
                "/" +
                remote_host +
                url_options;
              items.push(
                "<button onClick=\"api_exec('" +
                  url +
                  "', '#button" +
                  i +
                  '\');" class="btn group-' +
                  group +
                  '" role="button" data-toggle="tooltip" data-placement="top" title=" Connexion à ' +
                  domain +
                  '" id="button' +
                  i +
                  '">' +
                  remote_host +
                  "</button>"
              );
              i++;
            }); // host_list
          }); // group

          items.push("</div></div>");
        }); // domain

        items.push("</div></div>");
        items.push("</div></div></div></div>");
      }); // site

      $(container_id).html(items.join(""));
    } //  version
    $("#loading").hide();
  }); // data
}

async function CreateNavBar(container_id) {
  $.getJSON("/conf/menu", function (data) {
    var items = [];
    var i = 0;
    $.each(data, function (title) {
      items.push(
        '<a class="nav-link" href="' +
          data[title] +
          '" target="menu' +
          i +
          '">' +
          title +
          "</a>"
      );
      i++;
    });

    $(container_id).html(items.join(""));
  });
}

async function makeInterface() {
  await CreateNavBar("#mynav");
  await RemoteDisplay("#remote");
  setTimeout(makeInterface, 60000);
}
