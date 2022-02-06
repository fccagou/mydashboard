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

async function RemoteDisplay(container_id) {
  $.getJSON("/remote/list", function (data) {
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
  });
}
