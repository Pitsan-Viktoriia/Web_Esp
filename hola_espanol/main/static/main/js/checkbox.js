let flashcard_counter = 0;

async function getJsonByURL(url) {
  const response = await fetch(url);
  return await response.json();
}

// ————— Flashcard implementation —————

function displayInstructions(mainElement, instructionsText) {
  if (instructionsText && instructionsText.trim() !== '') {
    const instructionDiv = document.createElement('div');
    instructionDiv.className = 'exercise_instructions';
    instructionDiv.innerHTML = instructionsText; 
    mainElement.prepend(instructionDiv);
  }
}

function flashcard(data) {
  const mainElement = document.getElementById('main_class');
  displayInstructions(mainElement, data.content?.instructions);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/static/main/css/flashcard.css'; // Assuming this path is correct
  document.head.appendChild(link);

  // build container
  const container = document.createElement('div');
  container.className = 'flashcard_container';

  // the card itself
  const card = document.createElement('div');
  card.className = 'flashcard_div';
  card.id = 'flashcard_div';

  const front = document.createElement('div');
  front.className = 'flashcard_front';
  front.id = 'flashcard_front';

  const back = document.createElement('div');
  back.className = 'flashcard_back';
  back.id = 'flashcard_back';

  // render (with optional instant swap)
  function renderCard(idx, instant = false) {
    if (instant) {
      card.classList.add('no-transition');
    }
    front.innerHTML = data.content.items[idx].front;
    back.innerHTML  = data.content.items[idx].back;
    card.classList.remove('flipped');
    if (instant) {
      requestAnimationFrame(() => {
        card.classList.remove('no-transition');
      });
    }
  }
  renderCard(0);

  card.append(front, back);
  container.append(card);

  // controls (flip + next/retry)
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'buttons_container';
  controlsContainer.style.display = 'flex';
  controlsContainer.style.gap     = '10px';

  // flip button
  const btnFlip = document.createElement('button');
  btnFlip.className = 'logout_button';
  btnFlip.textContent = 'Перегорнути';
  btnFlip.onclick = () => card.classList.toggle('flipped');

  // next/retry button
  const btnNext = document.createElement('button');
  btnNext.className = 'logout_button';

  function goNext() {
    flashcard_counter++;
    renderCard(flashcard_counter, true);
    if (flashcard_counter === data.content.items.length - 1) {
      btnNext.textContent = 'Спробувати знову';
      btnNext.onclick     = retry;
    }
  }

  function retry() {
    flashcard_counter = 0;
    renderCard(0, true);
    btnNext.textContent = 'Наступна картка';
    btnNext.onclick     = goNext;
  }

  // initialize as “Next”
  btnNext.textContent = 'Наступна картка';
  btnNext.onclick     = goNext;

  controlsContainer.append(btnFlip, btnNext);
  document.getElementById('main_class').append(container, controlsContainer);
}


// ————— Generic quiz controls (checkbox/dropdown/fillgap) —————

function createControls(main, onCheck, onReset, onRetry) {
  const wrapper = document.createElement('div');
  wrapper.className = 'buttons_container';
  wrapper.style.display = 'flex';
  wrapper.style.gap = '10px';

  const btnCheck = document.createElement('button');
  btnCheck.className = 'logout_button';
  btnCheck.textContent = 'Перевірити відповіді';
  btnCheck.disabled = true;
  btnCheck.onclick = onCheck;

  const btnReset = document.createElement('button');
  btnReset.className = 'logout_button';
  btnReset.textContent = 'Скинути відповіді';
  btnReset.disabled = true;
  btnReset.onclick = onReset;

  const btnRetry = document.createElement('button');
  btnRetry.className = 'logout_button';
  btnRetry.textContent = 'Спробувати знову';
  btnRetry.disabled = true;
  btnRetry.onclick = onRetry;

  wrapper.append(btnCheck, btnReset, btnRetry);
  main.appendChild(wrapper);

  return { btnCheck, btnReset, btnRetry };
}

function enableButtonsState(dataType, items, btnCheck, btnReset, btnRetry) {
  const total = items.length;
  function updateState() {
    let answered = 0;
    for (let i = 0; i < total; i++) {
      if (dataType === 'checkbox') {
        if (document.querySelector(`input.answer_input[name="q${i}"]:checked`)) answered++;
      } else if (dataType === 'dropdown') {
        const sel = document.querySelector(`select.answer_input[name="q${i}"]`);
        if (sel && sel.selectedIndex > 0) answered++;
      } else { // fillgap
        const inp = document.querySelector(`input.answer_input[name="q${i}"]`);
        if (inp && inp.value.trim()) answered++;
      }
    }
    btnCheck.disabled = (answered < total);
    btnReset.disabled = (answered === 0);
  }
  // Add event listeners to the main container for delegation if items are dynamically added/removed
  // For simplicity, assuming items are static after initial load.
  document.addEventListener('change', updateState);
  document.addEventListener('input', updateState); // for text inputs in fillgap
  updateState(); // Initial check
}

function clearPerQuestion(dataType, data) {
  data.content.items.forEach((_, i) => {
    const qc = document.getElementById(`qc_${dataType}_${i}`);
    if (qc) { // Check if qc exists
        const old = qc.querySelector('.perq_result');
        if (old) old.remove();
    }
  });
}

function clearSummary() {
  const main = document.getElementById('main_class');
  const old = main.querySelector('.results_summary');
  if (old) old.remove();
}

function clearAnswers(dataType, data, controls) { // Added controls to potentially update their state
  data.content.items.forEach((_, i) => {
    const qc = document.getElementById(`qc_${dataType}_${i}`);
    if (!qc) return; // Skip if question container not found

    if (dataType === 'checkbox') {
      qc.querySelectorAll(`input.answer_input[name="q${i}"]`).forEach(inp => inp.checked = false);
    } else if (dataType === 'dropdown') {
      const sel = qc.querySelector(`select.answer_input[name="q${i}"]`);
      if (sel) sel.selectedIndex = 0;
    } else { // fillgap
      const inp = qc.querySelector(`input.answer_input[name="q${i}"]`);
      if (inp) inp.value = '';
    }
  });
   // After clearing answers, re-evaluate button states
  if (controls) {
    const items = data.content.items;
    let answered = 0; // Re-check answered count, should be 0
     for (let i = 0; i < items.length; i++) {
      if (dataType === 'checkbox') {
        if (document.querySelector(`input.answer_input[name="q${i}"]:checked`)) answered++;
      } else if (dataType === 'dropdown') {
        const sel = document.querySelector(`select.answer_input[name="q${i}"]`);
        if (sel && sel.selectedIndex > 0) answered++;
      } else { 
        const inp = document.querySelector(`input.answer_input[name="q${i}"]`);
        if (inp && inp.value.trim()) answered++;
      }
    }
    controls.btnCheck.disabled = (answered < items.length);
    controls.btnReset.disabled = (answered === 0);
    // btnRetry is usually enabled after a check, keep its logic in showResults or resetHandler
  }
}

function showResults(dataType, data, controls) {
  clearPerQuestion(dataType, data);
  clearSummary();

  let correct = 0;
  const total = data.content.items.length;
  for (let i = 0; i < total; i++) {
    let isCorrect = false;
    const qc = document.getElementById(`qc_${dataType}_${i}`);
    if (!qc) continue; // Skip if question container not found

    if (dataType === 'checkbox') {
      const sel = document.querySelector(`input.answer_input[name="q${i}"]:checked`);
      isCorrect = sel && sel.value === '1';
    } else if (dataType === 'dropdown') {
      const sel = document.querySelector(`select.answer_input[name="q${i}"]`);
      isCorrect = sel && sel.value === '1';
    } else { // fillgap
      const inp = document.querySelector(`input.answer_input[name="q${i}"]`);
      // Make comparison case-insensitive and trim whitespace for fillgap
      isCorrect = inp && inp.value.trim().toLowerCase() === inp.getAttribute('data-correct').trim().toLowerCase();
    }

    const span = document.createElement('div');
    span.className = 'perq_result';
    span.textContent = isCorrect ? 'Правильно' : 'Неправильно';
    span.style.color = isCorrect ? 'green' : 'red';
    qc.appendChild(span);
    if (isCorrect) correct++;
  }

  const percent = Math.round((correct / total) * 100);
  const summary = document.createElement('div');
  summary.className = 'results_summary';
  summary.innerHTML = `
    <p>
      <span style="color: green; font-weight: bold;">
        Правильно ${correct}
      </span>
      з ${total} (${percent}%)
    </p>`.trim();
  document.getElementById('main_class').appendChild(summary);

  controls.btnCheck.disabled = true; // Disable check after checking
  controls.btnReset.disabled = false;
  controls.btnRetry.disabled = false;
}

function resetHandler(dataType, data, controls) {
  clearPerQuestion(dataType, data);
  clearSummary();
  clearAnswers(dataType, data, controls); // Pass controls to update their state after clearing
  controls.btnCheck.disabled = true; // Should be re-enabled by enableButtonState based on inputs
  controls.btnReset.disabled = true;
  controls.btnRetry.disabled = true;
  // Manually call updateState from enableButtonsState to refresh button states
  // This requires enableButtonsState to expose its updateState or be callable
  // For now, let's re-trigger a generic input event, or directly call parts of enableButtonsState logic
  // A simpler way is to call enableButtonsState again, but it adds duplicate listeners.
  // The best is to call the updateState function directly. Let's make it accessible or re-evaluate.
  // For now, the existing 'input'/'change' listeners should eventually update state if user interacts.
  // To immediately reflect:
  const total = data.content.items.length;
  let answered = 0; // Should be 0 after reset
  controls.btnCheck.disabled = (answered < total);
  controls.btnReset.disabled = (answered === 0);

}

function retryHandler(dataType, data, controls) {
  resetHandler(dataType, data, controls);
}

// ————— Checkbox version —————

function checkbox(data) {
  const main = document.getElementById('main_class');
  displayInstructions(main, data.content?.instructions);
  data.content.items.forEach((item, i) => {
    const qc = document.createElement('div');
    qc.className = 'question_container';
    qc.id = `qc_checkbox_${i}`;

    const p = document.createElement('p');
    p.textContent = item.text;
    qc.appendChild(p);

    const optionsWrapper = document.createElement('div');
    optionsWrapper.className = 'options_wrapper';

    item.options.forEach((opt, j) => {
      const optWrap = document.createElement('div');
      optWrap.className = 'option_wrapper';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${i}`;
      input.id   = `q${i}_${j}`;
      input.value = j === item.correct_option_index ? '1' : '0';
      input.className = 'answer_input';

      const label = document.createElement('label');
      label.htmlFor = input.id;
      label.textContent = opt;

      optWrap.append(input, label);
      optionsWrapper.appendChild(optWrap);
    });

    qc.appendChild(optionsWrapper);
    main.appendChild(qc);
  });

  const controls = createControls(
    main,
    () => showResults('checkbox', data, controls),
    () => resetHandler('checkbox', data, controls),
    () => retryHandler('checkbox', data, controls) // Pass controls
  );
  enableButtonsState('checkbox', data.content.items, controls.btnCheck, controls.btnReset, controls.btnRetry);
}

// ————— Dropdown version —————

function dropdown(data) {
  const main = document.getElementById('main_class');
  displayInstructions(main, data.content?.instructions);
  data.content.items.forEach((item, i) => {
    const qc = document.createElement('div');
    qc.className = 'question_container';
    qc.id = `qc_dropdown_${i}`;

    // For dropdown, text might be interspersed with select elements
    const questionContentWrapper = document.createElement('div'); // Wrapper for text and dropdowns
    questionContentWrapper.className = 'question_content_wrapper';


    let currentTextPosition = 0;
    item.gaps.forEach((gap, j) => {
      // Add text before the gap
      if (gap.text_position_index > currentTextPosition) {
        questionContentWrapper.appendChild(document.createTextNode(item.text.slice(currentTextPosition, gap.text_position_index)));
      }
      
      const sel = document.createElement('select');
      sel.name = `q${i}`; // If multiple gaps, name should be q${i}_${j} or all q${i} if it's one question
                           // Assuming each 'item' is one question, and 'gaps' are parts of it.
                           // If one 'item' is one question, and it has multiple dropdowns, they should have unique names or be handled differently.
                           // Given the existing structure, it seems one item = one question, and 'q${i}' refers to that question.
                           // If a question has multiple dropdowns, they probably should contribute to a single answer or be separate questions.
                           // Sticking to `name="q${i}"` implies all dropdowns in this item belong to the same question concept.
                           // For simplicity, if this item has multiple gaps, we'll name them q${i}_${j} to treat them distinctly if needed later by results logic.
                           // However, current `showResults` and `enableButtonsState` assume one input/select per `q${i}`.
                           // Let's assume one gap per item for dropdown for now or that all dropdowns for q${i} are part of one check.
                           // The provided JSON does not use this 'dropdown' type.
                           // For consistency with how `showResults` looks up `select.answer_input[name="q${i}"]`, we might need to adjust.
                           // If one item means one question, and it has multiple gaps that are dropdowns, then `name="q${i}"` might be an issue if only one can be selected.
                           // The original code uses `name="q${i}"` for the select in `dropdown`.
                           // And `id="q${i}_${j}"`. This is fine. `showResults` targets `select.answer_input[name="q${i}"]`. This takes the FIRST such select.
                           // This implies that for dropdown, each 'item' should effectively have one primary select or the logic in showResults needs to iterate `q${i}_${j}`.
                           // For now, keeping it as is.

      sel.id = `q${i}_${j}`;
      sel.className = 'answer_input';
      sel.name = `q${i}`; // If item implies one question, multiple dropdowns might share a name.

      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = '—';
      sel.append(placeholder);

      gap.options.forEach((opt, k) => {
        const o = document.createElement('option');
        o.value = k === gap.correct_option_index ? '1' : '0';
        o.textContent = opt;
        sel.append(o);
      });
      questionContentWrapper.appendChild(sel);
      currentTextPosition = gap.text_position_index; // Position of what? Start of gap, end of gap? Assume it means text resumes after this conceptual "gap".
                                                     // If text_position_index is where the dropdown is inserted, then text afterwards starts from there.
    });
    // Add any remaining text after the last gap
    if (currentTextPosition < item.text.length) {
        questionContentWrapper.appendChild(document.createTextNode(item.text.slice(currentTextPosition)));
    }
    
    qc.appendChild(questionContentWrapper);
    main.appendChild(qc);
  });

  const controls = createControls(
    main,
    () => showResults('dropdown', data, controls),
    () => resetHandler('dropdown', data, controls),
    () => retryHandler('dropdown', data, controls) // Pass controls
  );
  enableButtonsState('dropdown', data.content.items, controls.btnCheck, controls.btnReset, controls.btnRetry);
}


// ————— Fill-gap version (Updated) —————

function fillgap(data) {
  const main = document.getElementById('main_class');
  console.log({main, data})
  displayInstructions(main, data.content?.instructions);
  data.content.items.forEach((item, i) => {
    const qc = document.createElement('div');
    qc.className = 'question_container dialog_item'; // Added 'dialog_item' for styling
    qc.id = `qc_fillgap_${i}`;

    // Line A
    const lineA = document.createElement('div');
    lineA.className = 'dialog_line_a';

    const speakerA = document.createElement('span');
    speakerA.className = 'speaker_label';
    speakerA.textContent = 'A: ';
    lineA.appendChild(speakerA);

    if (item.a_prefix && item.a_prefix.trim() !== '') {
      const prefixSpan = document.createElement('span');
      prefixSpan.className = 'text_prefix';
      prefixSpan.textContent = item.a_prefix;
      lineA.appendChild(prefixSpan);
    }

    const inp = document.createElement('input');
    inp.type = 'text'; // Explicitly set type
    inp.name = `q${i}`;
    inp.id   = `q${i}_input`; // Unique ID for the input field
    inp.setAttribute('data-correct', item.correct_answer);
    inp.className = 'answer_input dialog_input'; // Added 'dialog_input' for styling
    lineA.appendChild(inp);

    if (item.a_postfix && item.a_postfix.trim() !== '') {
      const postfixSpan = document.createElement('span');
      postfixSpan.className = 'text_postfix';
      postfixSpan.textContent = item.a_postfix;
      lineA.appendChild(postfixSpan);
    }

    if (item.a_hint && item.a_hint.trim() !== '') {
      const hintSpan = document.createElement('span');
      hintSpan.className = 'translation_hint';
      hintSpan.textContent = ` ${item.a_hint}`; // Add leading space for separation
      lineA.appendChild(hintSpan);
    }

    // Line B
    const lineB = document.createElement('div');
    lineB.className = 'dialog_line_b';

    const speakerB = document.createElement('span');
    speakerB.className = 'speaker_label';
    speakerB.textContent = 'B: ';
    lineB.appendChild(speakerB);

    const replySpan = document.createElement('span');
    replySpan.className = 'reply_text';
    replySpan.textContent = item.b_reply;
    lineB.appendChild(replySpan);

    qc.append(lineA, lineB);
    main.appendChild(qc);
  });

  const controls = createControls(
    main,
    () => showResults('fillgap', data, controls),
    () => resetHandler('fillgap', data, controls),
    () => retryHandler('fillgap', data, controls) // Pass controls
  );
  enableButtonsState('fillgap', data.content.items, controls.btnCheck, controls.btnReset, controls.btnRetry);
}

// ————— Entry point —————

document.addEventListener('DOMContentLoaded', () => {
  const mainElement = document.getElementById('main_class');
  if (!mainElement) {
    console.error("Element with ID 'main_class' not found.");
    return;
  }

  const parts = window.location.href.split('/');
  // Ensure there are enough parts to get exercise_id, adjust index if needed
  const exercise_id = parts.length > 1 ? parts[parts.length - 2] : null;

  if (!exercise_id) {
    console.error("Could not determine exercise_id from URL.");
    // Potentially load a default state or show an error message
    // For now, if using a local JSON for testing, you might bypass this:
    // MOCK_DATA is defined below for testing without a live URL
    if (typeof MOCK_DATA !== 'undefined' && MOCK_DATA.type === 'fillgap') {
        console.warn("Using MOCK_DATA for fillgap exercise.");
        fillgap(MOCK_DATA);
    } else if (typeof MOCK_DATA_CHECKBOX !== 'undefined' && MOCK_DATA_CHECKBOX.type === 'checkbox'){
        console.warn("Using MOCK_DATA_CHECKBOX for checkbox exercise.");
        checkbox(MOCK_DATA_CHECKBOX);
    }
     // Add other types if needed for local testing
    return;
  }
  
  // Construct the URL carefully
  const apiUrl = `/info/exercise/${exercise_id}/`; // Ensure this matches your API endpoint

  getJsonByURL(apiUrl).then(data => {
    if (!data || !data.type || !data.content || !data.content.items) {
        console.error("Invalid data structure received from API:", data);
        mainElement.textContent = 'Error: Could not load exercise data.';
        return;
    }
    switch (data.type) {
      case 'flashcard': flashcard(data);  break;
      case 'checkbox':  checkbox(data);   break;
      case 'dropdown':  dropdown(data);   break;
      case 'fillgap':   fillgap(data);    break;
      default:
        console.warn(`Unknown exercise type: ${data.type}`);
        mainElement.textContent = `Error: Unknown exercise type '${data.type}'.`;
    }
  }).catch(error => {
    console.error("Error fetching or processing exercise data:", error);
    mainElement.textContent = 'Error: Failed to load exercise. Please try again later.';
  });
});