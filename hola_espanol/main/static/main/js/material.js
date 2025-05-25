async function getJsonByURL(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', function() {
    let current_url = window.location.href
    let material_id = current_url.split('/')[current_url.split('/').length - 2]
    getJsonByURL('/info/material/' + material_id + '/').then(data => {
        let html_content = data['content']['html_content']
        document.getElementById('main_class').innerHTML = html_content
    })
}, false);