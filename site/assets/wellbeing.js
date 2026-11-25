(() => {
'use strict';
  const feelings = ['Low', 'A bit low', 'Okay', 'Good', 'Great'];
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const dateAt = offset => {const day = new Date(today);day.setDate(day.getDate() + offset);return day;};
  const longDate = date => date.toLocaleDateString('en', {month: 'short', day: 'numeric'});
  const dayName = date => date.toLocaleDateString('en', {weekday: 'short'});
  const sampleScores = [3, 4, 3, null, 2, 3, 4, 3, 2, 3, 4, null, 4, null];
  const sampleDays = () => sampleScores.map((feeling, index) => ({
    date: dateAt(index - 13), feeling, sample: true,
    routines: feeling ? (index % 2 ? ['Movement', 'Connection'] : ['Rest', 'Focus']) : [],
    note: feeling ? (index % 2 ? 'A walk and a conversation made space in a busy day.' : 'Took a short break between tasks.') : ''
  }));
  const sampleJournal = () => [
    {id: 'sample-1', date: dateAt(-1), note: 'An evening walk helped me slow down. I’d like to make time for that again.', sample: true},
    {id: 'sample-2', date: dateAt(-3), note: 'I asked a friend for help with something I’d been putting off. It felt good to talk.', sample: true}
  ];
  let days = sampleDays(), journal = sampleJournal(), sequence = 0;
  let paused = false, preferences = {sleep: false, activity: false};
  const controllers = [];
  const publish = (reset = false) => controllers.forEach(controller => controller(reset));
document.querySelectorAll('.wb-app').forEach(app => {
  const scoped = selector => selector.replace(/#(wb-[\w-]+)/g, (_, id) => '#' + (app.dataset.instance || '') + id);
  const $ = selector => app.querySelector(scoped(selector));
  const $$ = selector => [...app.querySelectorAll(scoped(selector))];
  let range = 7, selectedDay = null, editId = null, checkinSignature = null;
  let statusTimer;
  const status = message => {
    clearTimeout(statusTimer); $('#wb-status').textContent = message;
    if (message) statusTimer = setTimeout(() => {$('#wb-status').textContent = '';}, 5500);
  };
  $$('[data-wb-date]').forEach(node => {node.textContent = today.toLocaleDateString('en', {weekday: 'short', month: 'short', day: 'numeric'});});

  function showView(view, focus = true) {
    $$('[data-wb-panel]').forEach(panel => {panel.hidden = panel.dataset.wbPanel !== view;});
    $$('[data-wb-view]').forEach(button => {
      if (button.dataset.wbView === view) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    $('#wb-breadcrumb').textContent = {today: 'Your daily space', patterns: 'Your patterns', journal: 'Your journal', privacy: 'Your preferences', support: 'Find support'}[view];
    if (view === 'patterns') renderCharts();
    if (view === 'journal') renderJournal();
    status('');
    const heading = $(`[data-wb-panel="${view}"] h3`);
    if (focus) heading.focus({preventScroll: true});
    $('.wb-workspace').scrollTop = 0;
  }
  $$('[data-wb-view]').forEach(button => button.addEventListener('click', () => showView(button.dataset.wbView)));
  $$('[data-wb-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.wbGo)));

  $$('[data-wb-prompt]').forEach(button => button.addEventListener('click', () => {
    if (paused) {showView('privacy');status('Resume entries to write a reflection.');return;}
    showView('journal');
    const field = $('#wb-journal-note');
    field.value = field.value.trim() ? field.value + '\n\n' + button.dataset.wbPrompt : button.dataset.wbPrompt;
    field.focus();field.setSelectionRange(field.value.length, field.value.length);
  }));

  function renderInsight() {
    const recent = days.slice(-7).filter(day => day.feeling);
    const prior = days.slice(0, 7).filter(day => day.feeling);
    const all = [...prior, ...recent];
    const hasSamples = all.some(day => day.sample);
    $('#wb-insight-source').textContent = hasSamples ? 'Includes examples · this week vs last. Not a health assessment.' : 'Your entries · this week vs last. Not a health assessment.';
    if (recent.length < 3 || prior.length < 3) {
      $('#wb-insight-title').textContent = 'A little more context first.';
      $('#wb-insight-copy').textContent = 'At least three check-ins in each week are needed for this comparison. Missing days stay empty; there is no need to catch up.';
      return;
    }
    const average = list => list.reduce((sum, day) => sum + day.feeling, 0) / list.length;
    const change = average(recent) - average(prior);
    $('#wb-insight-title').textContent = change < -0.4 ? 'A quieter week, perhaps.' : change > 0.4 ? 'Some brighter moments.' : 'A familiar rhythm.';
    const trend = change < -0.4 ? 'lower than' : change > 0.4 ? 'higher than' : 'similar to';
    $('#wb-insight-copy').textContent = `Your check-ins were ${trend} last week’s (${recent.length} this week, ${prior.length} last week). What felt different?`;
  }
  function describe(day) {
    return `${longDate(day.date)} · ${day.feeling ? feelings[day.feeling - 1] : 'No check-in'}${day.feeling ? (day.sample ? ' · Sample entry' : ' · Your check-in') : ''}`;
  }
  function selectDay(index) {
    selectedDay = index;
    const day = days[index];
    $$('[data-wb-day]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.wbDay) === index)));
    $$('[data-wb-caption]').forEach(caption => {caption.textContent = describe(day);});
    $('#wb-day-title').textContent = `${longDate(day.date)} · ${day.feeling ? feelings[day.feeling - 1] : 'No check-in'}`;
    $('#wb-day-note').textContent = day.feeling ? day.note || 'No reflection added.' : 'You can leave a day empty. Check in when you want to.';
    const tags = $('#wb-day-routines');tags.replaceChildren();
    day.routines.forEach(routine => {const tag = document.createElement('span');tag.textContent = routine;tags.append(tag);});
  }
  function renderCharts() {
    $$('[data-wb-chart]').forEach(chart => {
      const count = chart.dataset.wbChart === 'week' ? 7 : range;
      chart.replaceChildren();
      const axis = document.createElement('div');axis.className = 'wb-chart-axis';axis.setAttribute('aria-hidden', 'true');
      ['Great', 'Okay', 'Low'].forEach(label => {const span = document.createElement('span');span.textContent = label;axis.append(span);});
      const plot = document.createElement('div');plot.className = 'wb-chart-plot';plot.style.setProperty('--days', count);
      days.slice(-count).forEach((day, i) => {
        const index = 14 - count + i;
        const button = document.createElement('button');button.type = 'button';button.className = 'wb-day';button.dataset.wbDay = index;
        button.setAttribute('aria-label', describe(day));button.setAttribute('aria-pressed', String(index === selectedDay));
        if (index === 13) button.classList.add('is-today');
        const track = document.createElement('span');track.className = 'wb-bar-track';
        const bar = document.createElement('span');bar.className = 'wb-bar';
        if (day.feeling) bar.style.height = `${16 + day.feeling * 15}%`;
        else {bar.classList.add('wb-no-entry');bar.style.height = '5px';}
        const label = document.createElement('span');label.className = 'wb-day-label';label.textContent = count === 14 ? day.date.getDate() : (index === 13 ? 'Today' : dayName(day.date));
        track.append(bar);button.append(track, label);button.addEventListener('click', () => selectDay(index));plot.append(button);
      });
      chart.append(axis, plot);
    });
    if (selectedDay !== null) selectDay(selectedDay);
    renderInsight();
  }
  $$('[data-wb-range]').forEach(button => button.addEventListener('click', () => {
    range = Number(button.dataset.wbRange);
    if (selectedDay !== null && selectedDay < 14 - range) selectedDay = 14 - range;
    $$('[data-wb-range]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderCharts();
  }));

  $('#wb-checkin-form').addEventListener('submit', event => {
    event.preventDefault();
    if (paused) {status('Entries are paused. Resume in Privacy.');return;}
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const input = new FormData(form);
    const note = String(input.get('note')).trim();
    days[13] = {date: new Date(today), feeling: Number(input.get('feeling')), routines: input.getAll('routine'), note, sample: false};
    if (note) {
      const existing = journal.find(entry => entry.id === 'today-checkin');
      if (existing) existing.note = note;
      else journal.unshift({id: 'today-checkin', date: new Date(today), note, sample: false});
    } else journal = journal.filter(entry => entry.id !== 'today-checkin');
    $('#wb-checkin-state').textContent = 'Saved for today';
    form.querySelector('[type="submit"]').textContent = 'Update check-in';
    selectedDay = 13;publish();
    status('Check-in saved for this demo session. Your patterns and journal are updated.');
  });

  function cancelEdit() {
    editId = null;$('#wb-journal-note').value = '';$('#wb-journal-note').setCustomValidity('');
    $('#wb-journal-mode').textContent = 'A new reflection';
    $('#wb-journal-form [type="submit"]').textContent = 'Save reflection';
    $('#wb-cancel-edit').hidden = true;
  }
  function renderJournal() {
    const list = $('#wb-journal-entries');list.replaceChildren();
    if (!journal.length) {const empty = document.createElement('p');empty.className = 'wb-empty';empty.textContent = 'Your reflections will appear here.';list.append(empty);}
    journal.forEach(entry => {
      const card = document.createElement('article');card.className = 'wb-journal-entry';
      const meta = document.createElement('div');meta.className = 'wb-entry-meta';
      const date = document.createElement('span');date.textContent = longDate(entry.date);
      const label = document.createElement('span');label.textContent = entry.sample ? 'Example' : 'Your reflection';meta.append(date, label);
      const note = document.createElement('p');note.textContent = entry.note;
      const actions = document.createElement('div');actions.className = 'wb-entry-actions';
      if (!entry.sample) {
        const edit = document.createElement('button');edit.type = 'button';edit.className = 'wb-text-button';edit.textContent = 'Edit';edit.setAttribute('aria-label', `Edit reflection from ${longDate(entry.date)}`);
        edit.addEventListener('click', () => {editId = entry.id;$('#wb-journal-note').value = entry.note;$('#wb-journal-mode').textContent = 'Editing your reflection';$('#wb-journal-form [type="submit"]').textContent = 'Save changes';$('#wb-cancel-edit').hidden = false;$('#wb-journal-note').focus();});
        const remove = document.createElement('button');remove.type = 'button';remove.className = 'wb-text-button';remove.textContent = 'Delete';remove.setAttribute('aria-label', `Delete reflection from ${longDate(entry.date)}`);
        remove.addEventListener('click', () => {
          journal = journal.filter(item => item.id !== entry.id);
          if (entry.id === 'today-checkin') {days[13].note = '';$('#wb-checkin-note').value = '';renderCharts();}
          if (editId === entry.id) cancelEdit();
          publish();status('Reflection deleted from this session.');$('#wb-journal-heading-focus')?.focus();
        });
        actions.append(edit, remove);
      }
      card.append(meta, note, actions);list.append(card);
    });
  }
  $('#wb-journal-form').addEventListener('submit', event => {
    event.preventDefault();if (paused) {status('Entries are paused. Resume in Privacy.');return;}const note = $('#wb-journal-note').value.trim();
    if (!note) {$('#wb-journal-note').setCustomValidity('Write a reflection first.');$('#wb-journal-note').reportValidity();return;}
    if (editId) {
      const entry = journal.find(item => item.id === editId);if (entry) entry.note = note;
      if (editId === 'today-checkin') {days[13].note = note;$('#wb-checkin-note').value = note;renderCharts();}
    } else journal.unshift({id: `reflection-${++sequence}`, date: new Date(today), note, sample: false});
    cancelEdit();publish();status('Reflection saved for this demo session.');
  });
  $('#wb-journal-note').addEventListener('input', event => event.target.setCustomValidity(''));
  $('#wb-cancel-edit').addEventListener('click', cancelEdit);
  $$('[data-wb-preference]').forEach(button => button.addEventListener('click', () => {
    preferences[button.dataset.wbPreference] = !preferences[button.dataset.wbPreference];publish();
    status('Preference updated across the previews. No device data is collected.');
  }));
  $('#wb-pause').addEventListener('click', () => {
    paused = !paused;publish();status(paused ? 'New entries paused across all previews.' : 'You can add entries again.');
  });
  $('#wb-export').addEventListener('click', () => {
    const payload = {type: 'AI SafeLanding concept session', exportedAt: new Date().toISOString(), paused, optionalSignalPreferences: preferences,
      checkins: days.filter(day => day.feeling), reflections: journal};
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url;link.download = 'wellbeing-session.json';link.click();setTimeout(() => URL.revokeObjectURL(url), 1000);
    status('Session downloaded. Example entries are marked as samples.');
  });
  const dialog = $('#wb-delete-dialog');
  $('#wb-delete').addEventListener('click', () => dialog.showModal());
  $('#wb-delete-cancel').addEventListener('click', () => dialog.close());
  $('#wb-delete-confirm').addEventListener('click', () => {
    days = sampleDays().map(day => ({...day, feeling: null, routines: [], note: '', sample: false}));journal = [];
    preferences = {sleep: false, activity: false};
    publish(true);dialog.close();status('Session data and drafts deleted from all previews.');
  });
  $('#wb-reset').addEventListener('click', () => {
    days = sampleDays();journal = sampleJournal();paused = false;preferences = {sleep: false, activity: false};publish(true);
    status('Example data restored across all previews.');
  });
  controllers.push(reset => {
    if (reset) {
      range = 7;selectedDay = null;cancelEdit();$('#wb-checkin-form').reset();
      $$('[data-wb-range]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.wbRange === '7')));
      $$('[data-wb-caption]').forEach(caption => {caption.textContent = 'Check-ins · tap a day to explore.';});
      $('#wb-day-title').textContent = 'Choose a day above';$('#wb-day-note').textContent = 'Your feeling, routines, and reflection will appear here.';$('#wb-day-routines').replaceChildren();
    }
    if (editId && !journal.some(entry => entry.id === editId)) cancelEdit();
    const signature = JSON.stringify(days[13]);
    if (checkinSignature !== signature) {
      checkinSignature = signature;
      $$('input[name="feeling"]').forEach(input => {input.checked = Number(input.value) === days[13].feeling;});
      $$('input[name="routine"]').forEach(input => {input.checked = days[13].routines.includes(input.value);});
      $('#wb-checkin-note').value = days[13].note;
    }
    const savedToday = !!days[13].feeling && !days[13].sample;
    $('#wb-checkin-state').textContent = savedToday ? 'Saved for today' : 'Today';
    $('#wb-checkin-form [type="submit"]').textContent = savedToday ? 'Update check-in' : 'Save check-in';
    $$('[data-wb-preference]').forEach(button => button.setAttribute('aria-checked', String(preferences[button.dataset.wbPreference])));
    $('#wb-pause').setAttribute('aria-checked', String(paused));
    $('#wb-pause-description').textContent = paused ? 'Paused across all previews. Your existing entries stay available.' : 'Check-ins and reflections are enabled.';
    $('.wb-paused-banner').hidden = !paused;
    $$('form input, form textarea, form button').forEach(control => {control.disabled = paused;});
    renderCharts();renderJournal();
  });
  renderCharts();renderJournal();
  if (app.dataset.startView) showView(app.dataset.startView, false);
});
publish();

})();
