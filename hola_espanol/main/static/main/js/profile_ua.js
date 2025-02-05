document.addEventListener('DOMContentLoaded', function() {
    fetch('/info/myuser/').then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('request failed');
        }
    }).then(data => {
        document.getElementById('profile_header').innerHTML = `Hola, ${data['username']}!`;
        document.getElementById('profile_username').innerHTML = `Юзернейм: ${data['username']}`;
        document.getElementById('profile_date').innerHTML = `Дата реєстрації: ${data['date_joined']}`;
    }).catch(error => {
        console.error(error);
    });
}, false);