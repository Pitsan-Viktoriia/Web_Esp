async function getJsonByURL(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', function() {
    getJsonByURL('/info/topic/' + data['id_list'][i] + '/').then(data => {
        if (data['type'] == 'grammar') {
            console.log(data)
            // form section by creating elements
            let section = document.createElement('section')
            let topic_name = document.createElement('h1')
            let materialsmaterials_h3 = document.createElement('h3')
            let exercisesexercises_h3 = document.createElement('h3')
            materials.innerText
            let materials_ul = document.createElement('ul')
            let exercises_ul = document.createElement('ul')

            // setting up elements
            materials_h3.innerText = 'Матеріали'
            exercises.innerTextexercises_h3.innerText = 'Вправи'
            topic_name.innerText = data['name']
            section.appendChild(topic_name)
            section.appendChild(materials)
            section.appendChild(exercises)
            getJsonByURL('/info/topic/' + data['id'] + '/materials/').then(data => {
                for (j = 0; j < data['id_list'].length; j++)
                {
                    getJsonByURL('/info/material/' + data['id_list'][j]).then(data => {
                        let li = document.createElement('li')
                        let a = document.createElement('a')
                        a.setAttribute('href', 'material/' + data['id'])
                        a.innerText = data['content']['name']
                        li.appendChild(a)
                        materials_ul.appendChild(li)
                    })
                }
            })
            getJsonByURL('/info/topic/' + data['id'] + '/exercises/').then(data => {
                for (j = 0; j < data['id_list'].length; j++)
                {
                    getJsonByURL('/info/exercise/' + data['id_list'][j]).then(data => {
                        let li = document.createElement('li')
                        let a = document.createElement('a')
                        a.setAttribute('href', 'exercise/' + data['id'])
                        a.innerText = data['content']['name']
                        li.appendChild(a)
                        exercises_ul.appendChild(li)
                    })
                }
            })
            section.appendChild(materials_h3)
            section.appendChild(materials_ul)
            section.appendChild(exercises_h3)
            section.appendChild(exercises_ul)

            let main = document.getElementById('main')
            main.appendChild(section)
        }
    });
}, false);