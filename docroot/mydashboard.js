

function api_exec( api ) {

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if ( xhr.status === 200 ) {
                // Code OK
                var exec = JSON.parse(xhr.responseText);
                if ( exec.status != "0" ) {
                    $("#myModalTitle").text( api );
                    $("#myModalBody").html( "<ul><li>Remote error: " + exec.status +"</li><li>" + exec.cmd + "</li></ul>");
                    // $("#myModalCloseBtn").attr("class", "btn btn-success");
                    $("#myModal").modal();
                }
            } else {
                // Code KO
                $("#myModalTitle").text( "Error ("+xhr.status+") occurs accessing " + api );
                $("#myModalBody").text( xhr.responseText );
                //$("#myModalCloseBtn").attr("class", "btn btn-danger");
                $("#myModal").modal();
            }
        }
    });

    xhr.open('GET', api);
    xhr.send(null);

}

function RemoteDisplay( container_id ) {

    $.getJSON('/remote/list', function ( data ) {

       var items = [];

        $.each( data , function (site) {

            items.push('<div class="col justify-content-center">');
            items.push('<div class="col">')
            items.push('<div class="card border-dark mb-3" >')
            items.push('<div class="card-header"><img src="/computer.png" />' + site +'</div>')
            items.push('<div class="card-body text-dark">')
            items.push('<div class="row">');

            $.each( data[site] , function (domain, val) {

                items.push('<div class="col align-self-start remote-domain"><p class="remote-domain">' + domain + '</p><div class="btn-group-vertical">');

                $.each( val , function(group, remote_host_list ) {

                    $.each( remote_host_list, function(h) {

                        remote_host=remote_host_list[h]
                        var url = '/remote/' + site + '/' + domain + '/' + group + '/' + remote_host;
                        items.push('<button onClick="api_exec(\'' + url +'\');" class="btn btn-' + group + '" role="button" data-toggle="tooltip" data-placement="top" title=" Connexion à '+domain+'">'+remote_host+'</span></button>');

                    }); // host_list

                }); // group

                items.push('</div></div>');

            }); // domain

            items.push('</div></div>');
            items.push('</div></div></div></div>');

        }); // site

        $(container_id).html(items.join(""));

    }); // data

}


function CreateNavBar( container_id ) {

    $.getJSON('/conf/menu', function ( data ) {
        var items = [];
        var i=0;
        $.each( data, function ( title ) {
            items.push('<li class="nav-item"><a class="nav-link" href="'+data[title]+'" target="menu'+i+'">'+title+'</a></li>');
            i++;
        });

        $(container_id).html(items.join(""));
    });
}

