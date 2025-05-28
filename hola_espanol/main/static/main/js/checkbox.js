let flashcard_counter = 0

async function getJsonByURL(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function next_card(data) {
    flashcard_counter = (flashcard_counter + 1) % data['content']['items'].length
    document.getElementById('flashcard_front').textContent = data['content']['items'][flashcard_counter]['front']
    document.getElementById('flashcard_back').textContent = data['content']['items'][flashcard_counter]['back']
    document.getElementById('flashcard_div').classList.remove('flipped')
}

function flip_card() {
    document.getElementById('flashcard_div').classList.toggle('flipped')
}

function flashcard(data) {
    let link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = '/static/main/css/flashcard.css'
    document.getElementsByTagName('HEAD')[0].appendChild(link)
    console.log(data['content'])
    let flashcard_container = document.createElement('div')
    flashcard_container.setAttribute('class', 'flashcard_container')
    let flashcard_div = document.createElement('div')
    flashcard_div.setAttribute('class', 'flashcard_div')
    flashcard_div.setAttribute('id', 'flashcard_div')
    let front_div = document.createElement('div')
    front_div.setAttribute('class', 'flashcard_front')
    front_div.setAttribute('id', 'flashcard_front')
    front_div.innerHTML = data['content']['items'][0]['front']
    let back_div = document.createElement('div')
    back_div.setAttribute('class', 'flashcard_back')
    back_div.setAttribute('id', 'flashcard_back')
    back_div.innerHTML = data['content']['items'][0]['back']

    let buttons_container = document.createElement('div')
    buttons_container.setAttribute('class', 'buttons_container')
    let button_flip = document.createElement('button')
    button_flip.setAttribute('class', 'logout_button')
    button_flip.innerHTML = 'Перегорнути'
    button_flip.onclick = function() {flip_card()}
    let button_next = document.createElement('button')
    button_next.innerHTML = 'Наступна картка'
    button_next.setAttribute('class', 'logout_button')
    button_next.onclick = function() {next_card(data)}
    buttons_container.appendChild(button_flip)
    buttons_container.appendChild(button_next)

    let main = document.getElementById('main_class')
    flashcard_div.appendChild(front_div)
    flashcard_div.appendChild(back_div)
    flashcard_container.appendChild(flashcard_div)
    main.appendChild(flashcard_container)
    main.appendChild(buttons_container)
}

function check_checkbox_answers(data) {
    let main = document.getElementById('main_class')
    let answers = document.createElement('div')
    answers.setAttribute('class', 'answers_checkbox_class')
    for (let i = 0; i < data['content']['items'].length; i++)
    {
        console.log(document.querySelector('input[name="q' + i + '"]:checked'))
        let label = document.createElement('label')
        if (document.querySelector('input[name="q' + i + '"]:checked').value == 1)
        {
            label.innerHTML = 'Відповідь ' + i + ' правильна!'
        }
        else
        {
            label.innerHTML = 'Відповідь ' + i + ' неправильна!'
        }
        answers.appendChild(label)
    }
    main.querySelector('div').appendChild(answers)
}

function check_dropdown_answers(data) {
    let main = document.getElementById('main_class')
    let answers = document.createElement('div')
    answers.setAttribute('class', 'answers_checkbox_class')
    for (let i = 0; i < data['content']['items'].length; i++)
    {
        console.log(document.querySelector('select[name="q' + i + '"]').options[document.querySelector('select[name="q' + i + '"]').selectedIndex].value)
        let label = document.createElement('label')
        if (document.querySelector('select[name="q' + i + '"]').options[document.querySelector('select[name="q' + i + '"]').selectedIndex].value == 1)
        {
            label.innerHTML = 'Відповідь ' + i + ' правильна!'
        }
        else
        {
            label.innerHTML = 'Відповідь ' + i + ' неправильна!'
        }
        answers.appendChild(label)
    }
    main.querySelector('div').appendChild(answers)
}

function check_fillgap_answers(data) {
    let main = document.getElementById('main_class')
    let answers = document.createElement('div')
    answers.setAttribute('class', 'answers_checkbox_class')
    for (let i = 0; i < data['content']['items'].length; i++)
    {
        console.log(document.querySelector('input[name="q' + i + '"]').getAttribute('for'))
        let label = document.createElement('label')
        if (document.querySelector('input[name="q' + i + '"]').value == document.querySelector('input[name="q' + i + '"]').getAttribute('for'))
        {
            label.innerHTML = 'Відповідь ' + i + ' правильна!'
        }
        else
        {
            label.innerHTML = 'Відповідь' + i + ' неправильна!'
        }
        answers.appendChild(label)
    }
    main.querySelector('div').appendChild(answers)
}

function checkbox(data) {
    let main = document.getElementById('main_class')
    let questions_grid = document.createElement('div')
    questions_grid.setAttribute('class', 'questions_grid')
    for (let i = 0; i < data['content']['items'].length; i++) {
        console.log(data['content']['items'][i])

        let question_container = document.createElement('div')
        question_container.setAttribute('class', 'question_container')

        // question_container filling
        let p = document.createElement('p')
        p.innerHTML = data['content']['items'][i]['text']
        question_container.appendChild(p)
        
        for (let j = 0; j < data['content']['items'][i]['options'].length; j++)
        {
            let label = document.createElement('label')
            label.innerHTML = data['content']['items'][i]['options'][j]
            let input = document.createElement('input')
            input.setAttribute('type', 'radio')
            input.setAttribute('name', 'q' + i)
            if (data['content']['items'][i]['correct_option_index'] == j)
            {
                input.setAttribute('value', 1)
            }
            else
            {
                input.setAttribute('value', 0)
            }
            // input.setAttribute('value', data['content']['items'][i]['options'][j])
            question_container.appendChild(input)
            question_container.appendChild(label)
        }

        questions_grid.appendChild(question_container)
    }
    let submit_button = document.createElement('button')
    submit_button.setAttribute('class', 'logout_button')
    submit_button.innerHTML = 'Перевірити відповіді'
    submit_button.onclick = function() {check_answers(data)}
    questions_grid.appendChild(submit_button)
    main.appendChild(questions_grid)
}

function dropdown(data) {
    let main = document.getElementById('main_class')
    let questions_grid = document.createElement('div')
    questions_grid.setAttribute('class', 'questions_grid')
    for (let i = 0; i < data['content']['items'].length; i++) {
        console.log(data['content']['items'][i])

        let question_container = document.createElement('div')
        question_container.setAttribute('class', 'question_container')

        // question_container filling
        let p = document.createElement('p')

        let text = data['content']['items'][i]['text']
        let final_text = ""
        let prev_text_position = 0
        // fill text with gaps
        for (let j = 0; j < data['content']['items'][i]['gaps'].length; j++)
        {
            let gap_select = document.createElement('select')
            gap_select.setAttribute('name', 'q' + i)
            for (let k = 0; k < data['content']['items'][i]['gaps'][j]['options'].length; k++)
            {
                let option = document.createElement('option')
                option.innerHTML = data['content']['items'][i]['gaps'][j]['options'][k]
                if (data['content']['items'][i]['gaps'][j]['correct_option_index'] == k)
                {
                    option.setAttribute('value', 1)
                }
                else
                {
                    option.setAttribute('value', 0)
                }
                gap_select.appendChild(option)
            }
            final_text = final_text + text.slice(prev_text_position, data['content']['items'][i]['gaps'][j]['text_position_index']) + ' ' + gap_select.outerHTML + ' '
            prev_text_position = data['content']['items'][i]['gaps'][j]['text_position_index']
        }
        final_text = final_text + text.slice(prev_text_position, text.length)
        let label = document.createElement('label')
        label.innerHTML = final_text
        // console.log(final_text)
        question_container.appendChild(label)
        questions_grid.appendChild(question_container)
    }
    let submit_button = document.createElement('button')
    submit_button.setAttribute('class', 'logout_button')
    submit_button.innerHTML = 'Перевірити відповіді'
    submit_button.onclick = function() {check_dropdown_answers(data)}
    questions_grid.appendChild(submit_button)
    main.appendChild(questions_grid)
}

function fillgap(data) {
    let main = document.getElementById('main_class')
    let questions_grid = document.createElement('div')
    questions_grid.setAttribute('class', 'questions_grid')
    for (let i = 0; i < data['content']['items'].length; i++) {
        console.log(data['content']['items'][i])

        let question_container = document.createElement('div')
        question_container.setAttribute('class', 'question_container')

        // question_container filling
        let p = document.createElement('p')

        let text = data['content']['items'][i]['text']
        let final_text = ""
        let prev_text_position = 0
        // fill text with gaps
        for (let j = 0; j < data['content']['items'][i]['gaps'].length; j++)
        {
            let input = document.createElement('input')
            input.setAttribute('name', 'q' + i)
            input.setAttribute('for', data['content']['items'][i]['gaps'][j]['correct_answer'])
            final_text = final_text + text.slice(prev_text_position, data['content']['items'][i]['gaps'][j]['text_position_index']) + ' ' + input.outerHTML + ' '
            prev_text_position = data['content']['items'][i]['gaps'][j]['text_position_index']
        }
        final_text = final_text + text.slice(prev_text_position, text.length)
        let label = document.createElement('label')
        label.innerHTML = final_text
        // console.log(final_text)
        question_container.appendChild(label)
        questions_grid.appendChild(question_container)
    }
    let submit_button = document.createElement('button')
    submit_button.setAttribute('class', 'logout_button')
    submit_button.innerHTML = 'Перевірити відповіді'
    submit_button.onclick = function() {check_fillgap_answers(data)}
    questions_grid.appendChild(submit_button)
    main.appendChild(questions_grid)
}

document.addEventListener('DOMContentLoaded', function() {
    let current_url = window.location.href
    let exercise_id = current_url.split('/')[current_url.split('/').length - 2]
    getJsonByURL('/info/exercise/' + exercise_id + '/').then(data => {
        if (data['type'] == 'checkbox') {
            checkbox(data)
        }
        if (data['type'] == 'dropdown')
        {
            dropdown(data)
        }
        if (data['type'] == 'fillgap')
        {
            fillgap(data)
        }
        // let html_content = data['content']['html_content']
        // document.getElementById('main_class').innerHTML = html_content
    })
}, false);