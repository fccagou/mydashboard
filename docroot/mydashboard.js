

function api_exec( api , html_object) {

    var xhr = new XMLHttpRequest();
    var prev_html = $(html_object).html();

    $(html_object).html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Connection...');

    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            $(html_object).html(prev_html);
            if ( xhr.status === 200 ) {
                // Code OK
                var exec = JSON.parse(xhr.responseText);
                if ( exec.status != "0" ) {
                    $("#myModalTitle").text( "Remote exec error (" + exec.status + ")" );
                    $("#myModalBody").html(
                        "<p>URL :" + api + "</p><hr>"
                        + "<p>Command:<br/>" + exec.cmd + "</p><hr>"
                        + "<p>Message:<br/>" + exec.msg.replace(/\n/g, '</br>') + "</p>"
                        );
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



async function RemoteDisplay( container_id ) {

    $.getJSON('/remote/list', function ( data ) {

       var items = [];

        var i=0;

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

                    $.each( remote_host_list, function(h, attrs) {
                        // TODO: add default value from conf
                        var url_options='';

                        if ( typeof(h) === 'number' ) {
                            remote_host=remote_host_list[h]
                        } else {
                            remote_host=h
                            if ( 'proto' in attrs ) {
                                // TODO: add check safe parameters.
                                url_options='?proto=' + attrs['proto'];
                                if ( 'sec' in attrs ) {
                                    url_options += '&sec=' + attrs['sec'];
                                }
                            }
                        }

                        var url = '/remote/' + site + '/' + domain + '/' + group + '/' + remote_host + url_options;
                        ;
                        items.push('<button onClick="api_exec(\'' + url +'\', \'#button'+i+'\');" class="btn btn-' + group + '" role="button" data-toggle="tooltip" data-placement="top" title=" Connexion à '+domain+'" id="button'+i+'">'+remote_host+'</button>');
                        i++;

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


async function CreateNavBar( container_id ) {

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




async function makeInterface () {
    await CreateNavBar('#mynav');
    await RemoteDisplay('#remote');
    setTimeout(makeInterface, 60000);
};
