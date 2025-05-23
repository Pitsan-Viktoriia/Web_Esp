async function getJsonByURL(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', function() {
    getJsonByURL('/info/topic/all/').then(data => {
        for (i = 0; i < data['id_list'].length; i++)
        {
            getJsonByURL('/info/topic/' + data['id_list'][i] + '/').then(data => {
                if (data['type'] == 'grammar') {
                    console.log(data)
                    let section = document.createElement('section')
                    let topic_name = document.createElement('h1')
                    let materials = document.createElement('h3')
                    let exercises = document.createElement('h3')
                    materials.innerText = 'Матеріали'
                    exercises.innerText = 'Вправи'
                    topic_name.innerText = data['name']
                    section.appendChild(topic_name)
                    section.appendChild(materials)
                    section.appendChild(exercises)
                    let main = document.getElementById('main')
                    main.appendChild(section)
                }
            })
        }
    });
}, false);