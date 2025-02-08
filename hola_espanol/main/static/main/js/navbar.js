document.addEventListener('DOMContentLoaded', function() {
    fetch('/info/myuser/').then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('request failed');
        }
    }).then(data => {
        var message = data['message'];
        if (message != 'user not found')     // if user logged in
        {
            document.getElementById('nav__login').style.display = 'none';
            document.getElementById('nav__register').style.display = 'none';
        }
        else 
        {
            document.getElementById('nav__profile').style.display = 'none';
            document.getElementById('nav__learning').style.display = 'none';
        }
    }).catch(error => {
        console.error(error);
    });
}, false);