async function getJsonByURL(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', async function() {
    getJsonByURL('/info/topic/all/').then(async data => {
        for (i = 0; i < data['id_list'].length; i++)
        {
            await getJsonByURL('/info/topic/' + data['id_list'][i] + '/').then(async data => {
                if (data['type'] == 'grammar') {
                    // form section by creating elements
                    let section = document.createElement('section')
                    let topic_name = document.createElement('h1')
                    let materials_h3 = document.createElement('h3')
                    let exercises_h3 = document.createElement('h3')
                    let materials_ul = document.createElement('ul')
                    let exercises_ul = document.createElement('ul')

                    // setting up elements
                    materials_h3.innerText = 'Матеріали'
                    exercises_h3.innerText = 'Вправи'
                    topic_name.innerText = data['name']
                    section.appendChild(topic_name)
                    await getJsonByURL('/info/topic/' + data['id'] + '/materials/').then(async data => {
                        for (j = 0; j < data['id_list'].length; j++)
                        {
                            await getJsonByURL('/info/material/' + data['id_list'][j]).then(data => {
                                let li = document.createElement('li')
                                let a = document.createElement('a')
                                a.setAttribute('href', 'material/' + data['id'])
                                a.innerText = data['content']['name']
                                li.appendChild(a)
                                materials_ul.appendChild(li)
                            })
                        }
                    })
                    await getJsonByURL('/info/topic/' + data['id'] + '/exercises/').then(async data => {
                        for (j = 0; j < data['id_list'].length; j++)
                        {
                            await getJsonByURL('/info/exercise/' + data['id_list'][j]).then(data => {
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
            })
        }
    });
}, false);