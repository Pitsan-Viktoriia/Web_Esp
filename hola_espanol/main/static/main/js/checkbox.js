let flashcard_counter = 0;

async function getJsonByURL(url) {
  const response = await fetch(url);
  return await response.json();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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
  link.href = '/static/main/css/flashcard.css';
  document.head.appendChild(link);

  const container = document.createElement('div');
  container.className = 'flashcard_container';

  const card = document.createElement('div');
  card.className = 'flashcard_div';
  card.id = 'flashcard_div';

  const front = document.createElement('div');
  front.className = 'flashcard_front';
  front.id = 'flashcard_front';

  const back = document.createElement('div');
  back.className = 'flashcard_back';
  back.id = 'flashcard_back';

  function renderCard(idx, instant = false) {
    if (instant) {
      card.classList.add('no-transition');
    }
    front.innerHTML = data.content.items[idx].front;
    back.innerHTML = data.content.items[idx].back;
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

  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'buttons_container';
  controlsContainer.style.display = 'flex';
  controlsContainer.style.gap = '10px';

  const btnFlip = document.createElement('button');
  btnFlip.className = 'logout_button';
  btnFlip.textContent = 'Перегорнути';
  btnFlip.onclick = () => card.classList.toggle('flipped');

  const btnNext = document.createElement('button');
  btnNext.className = 'logout_button';

  function goNext() {
    flashcard_counter++;
    renderCard(flashcard_counter, true);
    if (flashcard_counter === data.content.items.length - 1) {
      btnNext.textContent = 'Спробувати знову';
      btnNext.onclick = retry;
    }
  }

  function retry() {
    flashcard_counter = 0;
    renderCard(0, true);
    btnNext.textContent = 'Наступна картка';
    btnNext.onclick = goNext;
  }

  btnNext.textContent = 'Наступна картка';
  btnNext.onclick = goNext;

  controlsContainer.append(btnFlip, btnNext);
  document.getElementById('main_class').append(container, controlsContainer);
}

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
  if (dataType === 'matchpair') return;

  const total = items.length;
  function updateState() {
    let answered = 0;
    for (let i = 0; i < total; i++) {
      if (dataType === 'checkbox') {
        if (document.querySelector(`input.answer_input[name="q${i}"]:checked`))
          answered++;
      } else if (dataType === 'dropdown') {
        const sel = document.querySelector(`select.answer_input[name="q${i}"]`);
        if (sel && sel.selectedIndex > 0) answered++;
      } else {
        const inp = document.querySelector(`input.answer_input[name="q${i}"]`);
        if (inp && inp.value.trim()) answered++;
      }
    }
    btnCheck.disabled = answered < total;
    btnReset.disabled = answered === 0;
  }
  document.getElementById('main_class').addEventListener('change', updateState);
  document.getElementById('main_class').addEventListener('input', updateState);
  updateState();
}

function clearPerQuestion(dataType, data) {
  if (dataType === 'matchpair') return;

  data.content.items.forEach((_, i) => {
    const qc = document.getElementById(`qc_${dataType}_${i}`);
    if (qc) {
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

function clearAnswers(dataType, data, controls) {
  if (dataType === 'matchpair') return;

  data.content.items.forEach((_, i) => {
    const qc = document.getElementById(`qc_${dataType}_${i}`);
    if (!qc) return;

    if (dataType === 'checkbox') {
      qc.querySelectorAll(`input.answer_input[name="q${i}"]`).forEach(
        (inp) => (inp.checked = false)
      );
    } else if (dataType === 'dropdown') {
      const sel = qc.querySelector(`select.answer_input[name="q${i}"]`);
      if (sel) sel.selectedIndex = 0;
    } else {
      const inp = qc.querySelector(`input.answer_input[name="q${i}"]`);
      if (inp) inp.value = '';
    }
  });
  if (controls) {
    const items = data.content.items;
    let answered = 0;
    for (let i = 0; i < items.length; i++) {
      if (dataType === 'checkbox') {
        if (document.querySelector(`input.answer_input[name="q${i}"]:checked`))
          answered++;
      } else if (dataType === 'dropdown') {
        const sel = document.querySelector(`select.answer_input[name="q${i}"]`);
        if (sel && sel.selectedIndex > 0) answered++;
      } else {
        const inp = document.querySelector(`input.answer_input[name="q${i}"]`);
        if (inp && inp.value.trim()) answered++;
      }
    }
    controls.btnCheck.disabled = answered < items.length;
    controls.btnReset.disabled = answered === 0;
  }
}

function showResults(dataType, data, controls) {
  if (dataType === 'matchpair') return;

  clearPerQuestion(dataType, data);
  clearSummary();

  let correct = 0;
  const total = data.content.items.length;
  for (let i = 0; i < total; i++) {
    let isCorrect = false;
    const qc = document.getElementById(`qc_${dataType}_${i}`);
    if (!qc) continue;

    if (dataType === 'checkbox') {
      const sel = document.querySelector(
        `input.answer_input[name="q${i}"]:checked`
      );
      isCorrect = sel && sel.value === '1';
    } else if (dataType === 'dropdown') {
      const sel = document.querySelector(`select.answer_input[name="q${i}"]`);
      isCorrect = sel && sel.value === '1';
    } else {
      const inp = document.querySelector(`input.answer_input[name="q${i}"]`);
      isCorrect =
        inp &&
        inp.value.trim().toLowerCase() ===
          inp.getAttribute('data-correct').trim().toLowerCase();
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

  controls.btnCheck.disabled = true;
  controls.btnReset.disabled = false;
  controls.btnRetry.disabled = false;
}

function resetHandler(dataType, data, controls) {
  if (dataType === 'matchpair') return;

  clearPerQuestion(dataType, data);
  clearSummary();
  clearAnswers(dataType, data, controls);
  controls.btnCheck.disabled = true;
  controls.btnReset.disabled = true;
  controls.btnRetry.disabled = true;

  const total = data.content.items.length;
  let answered = 0;
  if (dataType !== 'flashcard' && dataType !== 'matchpair') {
    controls.btnCheck.disabled = answered < total;
    controls.btnReset.disabled = answered === 0;
  }
}

function retryHandler(dataType, data, controls) {
  if (dataType === 'matchpair') return;
  resetHandler(dataType, data, controls);
}

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
      input.id = `q${i}_${j}`;
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
    () => retryHandler('checkbox', data, controls)
  );
  enableButtonsState(
    'checkbox',
    data.content.items,
    controls.btnCheck,
    controls.btnReset,
    controls.btnRetry
  );
}

function dropdown(data) {
  const main = document.getElementById('main_class');
  displayInstructions(main, data.content?.instructions);
  data.content.items.forEach((item, i) => {
    const qc = document.createElement('div');
    qc.className = 'question_container';
    qc.id = `qc_dropdown_${i}`;

    const questionContentWrapper = document.createElement('div');
    questionContentWrapper.className = 'question_content_wrapper';

    let currentTextPosition = 0;
    item.gaps.forEach((gap, j) => {
      if (gap.text_position_index > currentTextPosition) {
        questionContentWrapper.appendChild(
          document.createTextNode(
            item.text.slice(currentTextPosition, gap.text_position_index)
          )
        );
      }

      const sel = document.createElement('select');
      sel.id = `q${i}_${j}`;
      sel.className = 'answer_input';
      sel.name = `q${i}`;

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
      currentTextPosition = gap.text_position_index;
    });
    if (currentTextPosition < item.text.length) {
      questionContentWrapper.appendChild(
        document.createTextNode(item.text.slice(currentTextPosition))
      );
    }

    qc.appendChild(questionContentWrapper);
    main.appendChild(qc);
  });

  const controls = createControls(
    main,
    () => showResults('dropdown', data, controls),
    () => resetHandler('dropdown', data, controls),
    () => retryHandler('dropdown', data, controls)
  );
  enableButtonsState(
    'dropdown',
    data.content.items,
    controls.btnCheck,
    controls.btnReset,
    controls.btnRetry
  );
}

function fillgap(data) {
  const main = document.getElementById('main_class');
  displayInstructions(main, data.content?.instructions);

  data.content.items.forEach((item, i) => {
    const qc = document.createElement('div');
    qc.className = 'question_container dialog_item';
    qc.id = `qc_fillgap_${i}`;

    const lineA = document.createElement('div');
    lineA.className = 'dialog_line_a';

    if (item.b_reply && item.b_reply.trim() !== '') {
      const speakerA = document.createElement('span');
      speakerA.className = 'speaker_label';
      speakerA.textContent = 'A: ';
      lineA.appendChild(speakerA);
    }

    if (item.a_prefix && item.a_prefix.trim() !== '') {
      const prefixSpan = document.createElement('span');
      prefixSpan.className = 'text_prefix';
      prefixSpan.textContent = item.a_prefix;
      lineA.appendChild(prefixSpan);
    }

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.name = `q${i}`;
    inp.id = `q${i}_input`;
    inp.setAttribute('data-correct', item.correct_answer);
    inp.className = 'answer_input dialog_input';
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
      hintSpan.textContent = ` ${item.a_hint}`;
      lineA.appendChild(hintSpan);
    }

    qc.appendChild(lineA);

    if (item.b_reply && item.b_reply.trim() !== '') {
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

      qc.appendChild(lineB);
    }
    main.appendChild(qc);
  });

  const controls = createControls(
    main,
    () => showResults('fillgap', data, controls),
    () => resetHandler('fillgap', data, controls),
    () => retryHandler('fillgap', data, controls)
  );
  enableButtonsState(
    'fillgap',
    data.content.items,
    controls.btnCheck,
    controls.btnReset,
    controls.btnRetry
  );
}

const matchPairState = {
  activeSelection: null,
  userMatches: [],
  svgCanvas: null,
  wordElementsMap: new Map(),
  controls: null,
  data: null,
  mainElement: null,
  isShowingResults: false
};

function getElementConnectionPoint(el, columnSide) {
  const rect = el.getBoundingClientRect();
  const svgRect = matchPairState.svgCanvas.getBoundingClientRect();
  const x =
    columnSide === 'left'
      ? rect.right - svgRect.left
      : rect.left - svgRect.left;
  const y = rect.top + rect.height / 2 - svgRect.top;
  return { x, y };
}

function drawLine(el1, el2) {
  const p1 = getElementConnectionPoint(el1, 'left');
  const p2 = getElementConnectionPoint(el2, 'right');

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', p1.x);
  line.setAttribute('y1', p1.y);
  line.setAttribute('x2', p2.x);
  line.setAttribute('y2', p2.y);
  line.classList.add('matchpair_line');
  matchPairState.svgCanvas.appendChild(line);
  return line;
}

function updateMatchPairButtonStates() {
  if (
    !matchPairState.controls ||
    !matchPairState.data ||
    !matchPairState.data.content ||
    !matchPairState.data.content.items
  ) {
    return;
  }

  const totalPairs = matchPairState.data.content.items.length;
  const matchedCount = matchPairState.userMatches.length;

  if (matchPairState.isShowingResults) {
    matchPairState.controls.btnCheck.disabled = true;
    matchPairState.controls.btnReset.disabled = false;
    matchPairState.controls.btnRetry.disabled = false;
  } else {
    matchPairState.controls.btnCheck.disabled = matchedCount < totalPairs;
    matchPairState.controls.btnReset.disabled = matchedCount === 0;
    matchPairState.controls.btnRetry.disabled = true;
  }
}

function handleWordClick(event) {
  if (matchPairState.isShowingResults) return;

  const clickedEl = event.currentTarget;
  const clickedId = clickedEl.id;
  const clickedLang = clickedEl.dataset.lang;

  const existingMatchIndex = matchPairState.userMatches.findIndex(
    (match) => match.ukrEl.id === clickedId || match.espEl.id === clickedId
  );

  if (existingMatchIndex > -1) {
    const matchToRemove = matchPairState.userMatches[existingMatchIndex];
    matchToRemove.lineEl.remove();
    matchToRemove.ukrEl.classList.remove('matched', 'selected');
    matchToRemove.espEl.classList.remove('matched', 'selected');
    matchPairState.userMatches.splice(existingMatchIndex, 1);

    if (
      matchPairState.activeSelection &&
      matchPairState.activeSelection.element.id === clickedId
    ) {
      matchPairState.activeSelection = null;
    }
  } else if (matchPairState.activeSelection) {
    if (matchPairState.activeSelection.element.id === clickedId) {
      clickedEl.classList.remove('selected');
      matchPairState.activeSelection = null;
    } else if (matchPairState.activeSelection.lang !== clickedLang) {
      const firstSelectedEl = matchPairState.activeSelection.element;
      firstSelectedEl.classList.remove('selected');
      firstSelectedEl.classList.add('matched');
      clickedEl.classList.add('matched');

      let ukrEl, espEl;
      if (matchPairState.activeSelection.lang === 'ukrainian') {
        ukrEl = firstSelectedEl;
        espEl = clickedEl;
      } else {
        ukrEl = clickedEl;
        espEl = firstSelectedEl;
      }

      const lineEl = drawLine(ukrEl, espEl);
      const matchId = `match-${ukrEl.dataset.pairId}-${
        espEl.dataset.pairId
      }-${Date.now()}`;
      matchPairState.userMatches.push({ ukrEl, espEl, lineEl, id: matchId });
      matchPairState.activeSelection = null;
    } else {
      matchPairState.activeSelection.element.classList.remove('selected');
      clickedEl.classList.add('selected');
      matchPairState.activeSelection.element = clickedEl;
    }
  } else {
    clickedEl.classList.add('selected');
    matchPairState.activeSelection = { element: clickedEl, lang: clickedLang };
  }
  updateMatchPairButtonStates();
}

function showMatchPairResults() {
  matchPairState.isShowingResults = true;
  clearSummary();

  let correctMatches = 0;
  const totalPairs = matchPairState.data.content.items.length;

  matchPairState.userMatches.forEach((match) => {
    const ukrPairId = match.ukrEl.dataset.pairId;
    const espPairId = match.espEl.dataset.pairId;
    if (ukrPairId === espPairId) {
      correctMatches++;
      match.lineEl.classList.add('correct');
      match.ukrEl.classList.add('correct_match');
      match.espEl.classList.add('correct_match');
    } else {
      match.lineEl.classList.add('incorrect');
      match.ukrEl.classList.add('incorrect_match');
      match.espEl.classList.add('incorrect_match');
    }
    match.ukrEl.classList.remove('matched');
    match.espEl.classList.remove('matched');
  });

  const percent = Math.round((correctMatches / totalPairs) * 100);
  const summary = document.createElement('div');
  summary.className = 'results_summary';
  summary.innerHTML = `
    <p>
      <span style="color: green; font-weight: bold;">
        Правильно ${correctMatches}
      </span>
      з ${totalPairs} (${percent}%)
    </p>`.trim();
  matchPairState.mainElement.appendChild(summary);

  updateMatchPairButtonStates();
}

function resetMatchPairState(isFullRetry = false) {
  if (matchPairState.svgCanvas) {
    matchPairState.svgCanvas.innerHTML = '';
  }
  matchPairState.userMatches.forEach((match) => {
    match.ukrEl.classList.remove(
      'selected',
      'matched',
      'correct_match',
      'incorrect_match'
    );
    match.espEl.classList.remove(
      'selected',
      'matched',
      'correct_match',
      'incorrect_match'
    );
  });
  matchPairState.wordElementsMap.forEach((el) => {
    el.classList.remove(
      'selected',
      'matched',
      'correct_match',
      'incorrect_match'
    );
  });

  matchPairState.activeSelection = null;
  matchPairState.userMatches = [];
  matchPairState.isShowingResults = false;

  clearSummary();
  updateMatchPairButtonStates();

  if (isFullRetry && matchPairState.data) {
    // placeholder for re-shuffle logic
  }
}

function matchpair(data) {
  matchPairState.mainElement = document.getElementById('main_class');
  matchPairState.data = data;
  matchPairState.wordElementsMap.clear();
  resetMatchPairState();

  displayInstructions(matchPairState.mainElement, data.content?.instructions);

  const exerciseContainer = document.createElement('div');
  exerciseContainer.className = 'matchpair_exercise_container';

  const ukrainianColumn = document.createElement('div');
  ukrainianColumn.className = 'matchpair_column ukrainian_column';
  ukrainianColumn.id = 'matchpair_ukrainian_column';

  const spanishColumn = document.createElement('div');
  spanishColumn.className = 'matchpair_column spanish_column';
  spanishColumn.id = 'matchpair_spanish_column';

  matchPairState.svgCanvas = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  );
  matchPairState.svgCanvas.id = 'matchpair_svg_canvas';
  matchPairState.svgCanvas.classList.add('matchpair_svg_canvas');

  const items = data.content.items;
  const ukrainianItems = shuffleArray([...items]);
  const spanishItems = shuffleArray([...items]);

  ukrainianItems.forEach((item) => {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'matchpair_word_item';
    wordDiv.id = `matchitem-ukr-${item.id}`;
    wordDiv.textContent = item.ukrainian;
    wordDiv.dataset.pairId = item.id;
    wordDiv.dataset.lang = 'ukrainian';
    wordDiv.addEventListener('click', handleWordClick);
    ukrainianColumn.appendChild(wordDiv);
    matchPairState.wordElementsMap.set(wordDiv.id, wordDiv);
  });

  spanishItems.forEach((item) => {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'matchpair_word_item';
    wordDiv.id = `matchitem-esp-${item.id}`;
    wordDiv.textContent = item.spanish;
    wordDiv.dataset.pairId = item.id;
    wordDiv.dataset.lang = 'spanish';
    wordDiv.addEventListener('click', handleWordClick);
    spanishColumn.appendChild(wordDiv);
    matchPairState.wordElementsMap.set(wordDiv.id, wordDiv);
  });

  exerciseContainer.append(
    ukrainianColumn,
    matchPairState.svgCanvas,
    spanishColumn
  );
  matchPairState.mainElement.appendChild(exerciseContainer);

  matchPairState.controls = createControls(
    matchPairState.mainElement,
    showMatchPairResults,
    () => resetMatchPairState(false),
    () => resetMatchPairState(true)
  );
  updateMatchPairButtonStates();

  window.addEventListener('resize', () => {
    if (matchPairState.userMatches.length > 0 && matchPairState.svgCanvas) {
      const lines = matchPairState.svgCanvas.querySelectorAll('line');
      lines.forEach((line) => line.remove());
      const currentMatches = [...matchPairState.userMatches];
      matchPairState.userMatches = [];
      currentMatches.forEach((match) => {
        const newLineEl = drawLine(match.ukrEl, match.espEl);
        if (match.lineEl.classList.contains('correct'))
          newLineEl.classList.add('correct');
        if (match.lineEl.classList.contains('incorrect'))
          newLineEl.classList.add('incorrect');
        matchPairState.userMatches.push({
          ukrEl: match.ukrEl,
          espEl: match.espEl,
          lineEl: newLineEl,
          id: match.id
        });
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const mainElement = document.getElementById('main_class');
  if (!mainElement) {
    console.error("Element with ID 'main_class' not found.");
    return;
  }

  const parts = window.location.href.split('/');
  const exercise_id = parts.length > 1 ? parts[parts.length - 2] : null;

  if (!exercise_id) {
    console.error('Could not determine exercise_id from URL.');
    mainElement.textContent =
      'Error: Could not determine exercise ID from URL.';
    return;
  }

  const apiUrl = `/info/exercise/${exercise_id}/`;

  getJsonByURL(apiUrl)
    .then((data) => {
      if (!data || !data.type || !data.content || !data.content.items) {
        console.error('Invalid data structure received from API:', data);
        mainElement.textContent =
          'Error: Could not load exercise data. Structure is invalid.';
        return;
      }
      mainElement.innerHTML = '';
      if (matchPairState.svgCanvas) {
        resetMatchPairState();
        matchPairState.svgCanvas = null;
        matchPairState.wordElementsMap.clear();
      }

      switch (data.type) {
        case 'flashcard':
          flashcard(data);
          break;
        case 'checkbox':
          checkbox(data);
          break;
        case 'dropdown':
          dropdown(data);
          break;
        case 'fillgap':
          fillgap(data);
          break;
        case 'matchpair':
          matchpair(data);
          break;
        default:
          console.warn(`Unknown exercise type: ${data.type}`);
          mainElement.textContent = `Error: Unknown exercise type '${data.type}'.`;
      }
    })
    .catch((error) => {
      console.error('Error fetching or processing exercise data:', error);
      mainElement.textContent =
        'Error: Failed to load exercise. Please try again later.';
    });
});
