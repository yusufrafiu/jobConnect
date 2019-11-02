/**
prefixes: 
        ed -> edit (button)
        su -> submit (submit to server )
        di -> display (edit form)

suffixes:
        f -> form (edit form)

*/


var ed_pd = document.getElementById('ed-pd');
var pd = document.getElementById('pd');
var di_pd_f = document.getElementById('di-pd-f');


function pushNewValues (values) {
    var posts = document.querySelectorAll('p[data-post]');
    for(i=0; i < posts.length; i++) {
        var post = posts[i];
        var property = post.getAttribute('data-post');

        if(values.hasOwnProperty(property)) {
            // input.classList.add('error');
            post.textContent = values[property];

        }
    }

}

ed_pd.addEventListener('click', function(e) {
    e.preventDefault();

    var action = ed_pd.getAttribute('href');
    var xhr = new XMLHttpRequest();
    xhr.open('GET',action, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-url-encoded');

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText;
            di_pd_f.innerHTML = result;

            pd.style.display = "none";
            di_pd_f.style.display = "block";
        }

    }
    xhr.send();

});

if($("#pd-f")) {

    $('#su-pd').click(function(e) {    
        e.preventDefault();

        var form = $("#pd-f");
        // var action = form.getAttribute("action");
        // var form_data = new FormData(form);

        // set request and header
        var xhr = new XMLHttpRequest();
        xhr.open('POST', action, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Form-Type', 'Summary');

        // check for ajax ready state
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                var result = xhr.responseText;
                var json = JSON.parse(result);

                pushNewValues (json);

                pd.style.display = "block";
                di_pd_f.style.display = "none";

            }
        }

        xhr.send(form_data);

    });

}