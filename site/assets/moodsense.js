/* MoodSense app preview for the Products page.
   A web copy of the MoodSense app's four tabs (Home, Community, Recharge, You) as they look by default,
   filled with fake sample data held in this tab's memory only: nothing is sent anywhere or stored.
   Tabs and in-page toggles work; feature screens (chat, players, questionnaires) are not opened.
   All four phones share one store, so a check-in on one phone shows up on the others. */
(function () {
  'use strict';
  var phones = [].slice.call(document.querySelectorAll('[data-ms-phone]'));
  if (!phones.length || !window.MS_ART) return;
  var ART = window.MS_ART;

  /* ---------- theme + content copied from the app ---------- */
  var MOODS = ['calm', 'good', 'stressed', 'low', 'tired'];
  var LABEL = { calm: 'Calm', good: 'Good', stressed: 'Stressed', low: 'Low', tired: 'Tired' };
  var MOOD = {
    calm: { deep: '#3f7d63', mid: '#9ccbb0', soft: '#e4f2ea' },
    good: { deep: '#8a6a12', mid: '#f0d27a', soft: '#fbf1cf' },
    stressed: { deep: '#b25f3a', mid: '#f2b592', soft: '#fbe6da' },
    low: { deep: '#5d67a3', mid: '#adb6de', soft: '#e9ebf6' },
    tired: { deep: '#7a6a8a', mid: '#c9b8d8', soft: '#f1ebf6' }
  };
  var LEVEL = { good: 1, calm: 0.8, tired: 0.42, stressed: 0.22, low: 0 };
  var UP = { calm: 1, good: 1 };

  var ITEMS = [
    ['breathing', 'Breathing Exercise', 'Box breathing · 2 min', '🫧', 'breathing', 'activity'],
    ['calming-breath', 'Calming Breath', 'Longer out-breath · 1 min', '🌙', 'breathing', 'activity'],
    ['mindfulness', 'Mindfulness Moment', '5-4-3-2-1 senses · 2 min', '👁', 'mindfulness', 'activity'],
    ['gratitude', 'Gratitude Exercise', 'Three good things · 2 min', '🌿', 'mindfulness', 'activity'],
    ['guided-relaxation', 'Guided Relaxation', 'Body scan · 2 min', '🧘', 'relaxation', 'activity'],
    ['short-rest', 'Take A Short Rest', 'Eyes closed · 5 min', '🛋', 'relaxation', 'tip'],
    ['reduce-screen', 'Screen Break', 'Put the phone down · 15 min', '📵', 'relaxation', 'tip'],
    ['drink-water', 'Drink Some Water', 'A glass, right now', '💧', 'relaxation', 'tip'],
    ['sleep-tip', 'Plan A Better Night', 'Sleep tip', '🛏', 'relaxation', 'tip'],
    ['calming-audio', 'Calming Sounds', 'Gentle rain', '🌧', 'music', 'sound'],
    ['relaxing-music', 'Relaxing Sounds', 'Ocean waves', '🌊', 'music', 'sound'],
    ['forest-sounds', 'Forest Sounds', 'Birds and leaves', '🌲', 'music', 'sound'],
    ['fireplace-sounds', 'Fireplace', 'Soft crackle', '🔥', 'music', 'sound'],
    ['relaxing-video', 'Relaxing Video', 'Nature scenery · opens YouTube', '🏞', 'videos', 'video'],
    ['uplifting-video', 'Uplifting Video', 'Something kind · opens YouTube', '🌞', 'videos', 'video'],
    ['reflection', 'Write It Down', 'A few lines about today', '📓', 'reflection', 'reflect'],
    ['stretching', 'Stretching', 'Four seated stretches · 1 min', '🤸', 'exercise', 'activity'],
    ['short-walk', 'Take A Short Walk', 'Outside · 10 min', '🚶', 'exercise', 'tip'],
    ['stand-tall', 'Stand Tall', 'Posture and self-talk · 1 min', '🌟', 'exercise', 'activity'],
    ['light-exercise', 'Light Exercise', 'Move a little · 10 min', '🏃', 'exercise', 'tip'],
    ['mood-lift', 'Mood-Lifting Game', 'Bubble pop · no score', '🫧', 'games', 'game'],
    ['ripple-pond', 'Ripple Pond', 'Calm and slow', '💧', 'games', 'game'],
    ['constellation', 'Constellation', 'Connect the stars', '⭐', 'games', 'game'],
    ['contact-trusted', 'Reach Out To Someone', 'A friend or family member', '💬', 'reflection', 'tip'],
    ['share-moment', 'Share The Good Moment', 'Tell someone', '🤝', 'reflection', 'tip'],
    ['keep-routine', 'Keep Your Routine', 'What is working', '🔄', 'reflection', 'tip']
  ].map(function (a) { return { id: a[0], title: a[1], sub: a[2], emoji: a[3], cat: a[4], kind: a[5] }; });
  var ITEM = {}; ITEMS.forEach(function (i) { ITEM[i.id] = i; });
  var CATS = [['for-you', 'For You'], ['breathing', 'Breathing'], ['mindfulness', 'Mindfulness'], ['relaxation', 'Relaxation'], ['music', 'Music'], ['videos', 'Videos'], ['reflection', 'Reflection'], ['exercise', 'Short Exercises'], ['games', 'Games']];
  var FOR_YOU = {
    stressed: ['breathing', 'guided-relaxation', 'short-walk'],
    low: ['mood-lift', 'gratitude', 'contact-trusted'],
    tired: ['short-rest', 'calming-breath', 'stretching'],
    calm: ['mindfulness', 'reflection', 'light-exercise'],
    good: ['gratitude', 'share-moment', 'keep-routine'],
    none: ['calming-breath', 'stretching', 'calming-audio']
  };
  var ACTION_ICON = { activity: 'play-circle-outline', sound: 'musical-notes-outline', game: 'game-controller-outline', reflect: 'create-outline', tip: 'chevron-forward', video: 'open-outline' };
  var PEER = [
    ['night', 'Late-Night Insomnia Support', 'For the nights sleep will not come. Company and gentle wind-down ideas.', '🌙'],
    ['work', 'Workplace Stress Zone', 'Deadlines, bosses and burnout, talked through with people who get it.', '💼'],
    ['study', 'Study Pressure Support', 'Exams, grades and expectations. Study breaks welcome.', '📚'],
    ['social', 'Social Anxiety Support', 'A low-pressure space to share small wins and hard moments.', '👥'],
    ['wellbeing', 'Emotional Wellbeing Group', 'Everyday ups and downs, and what helps.', '💛']
  ];
  var OFFICIAL = [
    ['o1', 'Depression & Bipolar Support', 'Peer-led support for people living with mood conditions.', 'Weekly, Tuesdays, 6:00-7:30 pm · In Person'],
    ['o2', 'Friday Social Hour', 'A welcoming space to connect, for adults 18 and older.', 'Weekly, Fridays, 10:00-11:00 am · In Person'],
    ['o3', 'Recovery And Depression', 'Support for recovery and depression.', 'Weekly, Thursdays, 4:00-5:00 pm · Online'],
    ['o4', 'Loss & Grief Circle', 'For loved ones navigating a loss.', '2nd Monday, 7:00-8:30 pm · In Person + Online']
  ];
  var STAGES = [['Seed', 'Planted. Every check-in gives it a little water.'], ['Sprout', 'It is up. A handful of days of checking in did that.'], ['Sapling', 'Taking root — you have been coming back to it.'], ['Young Tree', 'Steady enough to take a rough week without noticing.'], ['Full Tree', 'Settled, with plenty of lighter days in the mix.'], ['In Blossom', 'You have been showing up for a while now, and it shows.']];

  /* ---------- fake data ---------- */
  var seed = 914;
  function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
  function pickMood(weights) { var r = rnd(), a = 0; for (var i = 0; i < 5; i++) { a += weights[i]; if (r < a) return MOODS[i]; } return 'calm'; }
  function dayStart(offset) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - offset); return d; }
  var history = []; // oldest first, ends yesterday
  for (var off = 365; off >= 1; off--) {
    var dd = dayStart(off), wk = dd.getDay(), weekend = wk === 0 || wk === 6;
    var w = weekend ? [0.34, 0.32, 0.1, 0.1, 0.14] : [0.27, 0.2, 0.25, 0.12, 0.16];
    var n = rnd() < 0.06 ? 0 : 1 + Math.floor(rnd() * 3), list = [];
    for (var j = 0; j < n; j++) list.push(pickMood(w));
    history.push({ date: dd, moods: list });
  }
  // A recognisable last week with ups and downs and no gaps.
  var lastWeek = [['calm', 'tired'], ['good', 'calm'], ['stressed', 'tired', 'calm'], ['calm', 'good', 'good'], ['good', 'calm', 'tired'], ['low', 'stressed', 'calm']];
  for (var k = 0; k < 6; k++) history[history.length - 6 + k].moods = lastWeek[k];
  function at(h, m) { var d = new Date(); d.setHours(h, m, 0, 0); return d.getTime(); }
  var S = { today: [{ ts: at(8, 42), mood: 'calm' }, { ts: at(13, 15), mood: 'stressed' }], joined: { night: true } };
  function latestMood() { return S.today.length ? S.today[S.today.length - 1].mood : null; }
  function todayMoods() { return S.today.map(function (e) { return e.mood; }); }

  /* ---------- helpers ---------- */
  function icon(name) { var d = ART.icons[name]; return d ? '<svg class="ms-ico" viewBox="0 0 512 512" aria-hidden="true"><path d="' + d + '"/></svg>' : ''; }
  function mascot(mood) { return '<svg viewBox="0 0 64 64" aria-hidden="true">' + ART.mascots[mood] + '</svg>'; }
  function time(ts) { return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
  function avgLevel(moods) { if (!moods.length) return null; var t = 0; moods.forEach(function (m) { t += LEVEL[m]; }); return t / moods.length; }
  function dominant(moods) { var c = {}, best = null; moods.forEach(function (m) { c[m] = (c[m] || 0) + 1; if (!best || c[m] > c[best]) best = m; }); return best; }
  function days(n) {
    var out = history.slice(-(n - 1)).map(function (h) { return { date: h.date, moods: h.moods }; });
    out.push({ date: dayStart(0), moods: todayMoods(), today: true });
    return out;
  }
  function wd(d) { return d.toLocaleDateString('en-US', { weekday: 'short' }); }
  /* A static row, laid out like the app's <Row>; it is not a link in this preview. */
  function row(o) {
    return '<div class="ms-row"><span class="ms-tile' + (o.soft ? ' ms-soft' : '') + '"' + (o.bg ? ' style="background:' + o.bg + ';color:' + (o.fg || 'inherit') + '"' : '') + '>' + (o.icon || '') + '</span><span class="ms-rt"><b>' + o.title + '</b>' + (o.sub ? '<small>' + o.sub + '</small>' : '') + '</span>' + (o.right != null ? '<span class="ms-right' + (o.mutedRight ? ' ms-muted' : '') + '">' + o.right + '</span>' : '') + '</div>';
  }

  /* ---------- the mood planet (moodsense-planet.js, ported from the app) ---------- */
  function cityCounts() {
    var c = { calm: 34, good: 32, stressed: 25, low: 16, tired: 15 };
    todayMoods().forEach(function (m) { c[m]++; });
    return c;
  }
  function countList() { var c = cityCounts(); return MOODS.map(function (m) { return c[m]; }); }

  /* ---------- one phone ---------- */
  function Phone(root) {
    this.r = root; this.tab = root.getAttribute('data-ms-start') || 'home';
    this.trend = 'week'; this.youRange = 'week'; this.cat = 'for-you'; this.filter = 'all'; this.dot = null; this.report = 'weekly'; this.visible = false;
    var self = this;
    this.r.addEventListener('click', function (e) { self.click(e); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; self.spin(); }, { threshold: 0.1 }).observe(root);
    this.go(this.tab, true);
  }
  Phone.prototype.view = function (t) { return this.r.querySelector('[data-ms-view="' + t + '"]'); };
  Phone.prototype.go = function (tab, first) {
    this.tab = tab;
    var self = this;
    ['home', 'community', 'recharge', 'you'].forEach(function (t) { self.view(t).hidden = t !== tab; });
    this.r.querySelectorAll('[data-ms-go]').forEach(function (b) {
      var on = b.getAttribute('data-ms-go') === tab, name = { home: 'home', community: 'people', recharge: 'leaf', you: 'person' }[b.getAttribute('data-ms-go')];
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
      b.querySelector('i').innerHTML = icon(on ? name : name + '-outline');
    });
    this.render(tab);
    if (!first) this.view(tab).scrollTop = 0;
    this.spin();
  };
  Phone.prototype.render = function (tab) { this['r_' + (tab || this.tab)](); };

  /* Home */
  Phone.prototype.r_home = function () {
    var now = new Date(), h = now.getHours(), self = this;
    var html = '<p class="ms-title">' + (h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening') + '</p><p class="ms-subtitle">' + now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + '</p>';
    html += '<div class="ms-card"><p class="ms-h2">How Are You Feeling Right Now?</p><div class="ms-faces">' + MOODS.map(function (m) { return '<button type="button" class="ms-face' + (self.flash === m ? ' is-on' : '') + '" data-act="mood" data-arg="' + m + '" aria-label="' + LABEL[m] + '">' + mascot(m) + '<span>' + LABEL[m] + '</span></button>'; }).join('') + '</div>';
    var sel = S.today.filter(function (e) { return e.ts === self.dot; })[0];
    html += '<div class="ms-today"><div class="ms-today-head"><b>Today</b><span>' + (sel ? time(sel.ts) + ' · ' + LABEL[sel.mood] : 'Tap a dot to see it') + '</span></div><div class="ms-dots">' + S.today.map(function (e) { return '<button type="button" data-act="dot" data-arg="' + e.ts + '" class="' + (e.ts === self.dot ? 'is-on ' : '') + (e.fresh ? 'is-new' : '') + '" style="background:' + MOOD[e.mood].mid + '" aria-label="' + time(e.ts) + ', ' + LABEL[e.mood] + '"></button>'; }).join('') + '</div></div></div>';
    html += '<div class="ms-card ms-rows">' + row({ icon: '📋', title: 'Mood Check For This Week', sub: '4 questions · under a minute', right: '<span class="ms-pill">Start</span>' }) + '</div>';
    html += '<div class="ms-sec"><span>Your Community</span><span class="ms-link">Change</span></div><p class="ms-community-label">Mountain View, California, United States</p>';
    html += '<div data-planet-slot></div>';
    html += this.trendCard();
    this.view('home').innerHTML = html;
    this.flash = null;
    S.today.forEach(function (e) { e.fresh = false; });
    this.bindPlanet();
  };
  Phone.prototype.trendCard = function () {
    var n = { week: 7, two: 14, month: 30 }[this.trend], ds = days(n);
    var W = 311, H = 150, left = 44, right = W - 2, nextW = 40, plotR = right - nextW, top = 12, bottom = 108;
    var x0 = left + 10, x1 = plotR - 18, step = (x1 - x0) / (n - 1), xs = ds.map(function (d, i) { return x0 + i * step; }), nx = right - nextW / 2;
    function y(v) { return bottom - v * (bottom - top); }
    var lv = ds.map(function (d) { return avgLevel(d.moods); });
    // Your daily rhythm: a smoothed line through what you said, carried one day ahead as the guess.
    var rh = lv.map(function (v, i) { var a = 0, c = 0; for (var k = Math.max(0, i - 2); k <= Math.min(lv.length - 1, i + 2); k++) if (lv[k] != null) { a += lv[k]; c++; } return c ? a / c : 0.6; });
    var guess = (rh[rh.length - 1] * 0.6 + rh[rh.length - 2] * 0.4) * 0.9 + 0.08;
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="margin-top:8px" aria-label="How you said you felt each day, with your daily rhythm and a guess for tomorrow">';
    [top, (top + bottom) / 2, bottom].forEach(function (gy) { svg += '<line x1="' + left + '" x2="' + plotR + '" y1="' + gy + '" y2="' + gy + '" stroke="#d9d0c2" stroke-width="1" stroke-dasharray="1 5" stroke-linecap="round"/>'; });
    svg += '<rect x="' + (right - nextW) + '" y="2" width="' + nextW + '" height="' + (bottom + 12) + '" rx="6" fill="#ece9f3"/>';
    svg += '<text x="4" y="' + (top + 4) + '" font-size="10" font-weight="700" fill="#6f6559" letter-spacing=".5">HIGH</text><text x="4" y="' + ((top + bottom) / 2 + 4) + '" font-size="10" font-weight="700" fill="#a2978a" letter-spacing=".5">OKAY</text><text x="9" y="' + (bottom + 4) + '" font-size="10" font-weight="700" fill="#6f6559" letter-spacing=".5">LOW</text>';
    var rp = 'M' + xs.map(function (x, i) { return x.toFixed(1) + ' ' + y(rh[i]).toFixed(1); }).join(' L') + ' L' + nx + ' ' + y(guess).toFixed(1);
    svg += '<path d="' + rp + '" fill="none" stroke="#5a5fb0" stroke-width="1.8" stroke-dasharray="5 4" stroke-linejoin="round" opacity=".9"/>';
    var path = '', pen = false;
    lv.forEach(function (v, i) { if (v == null) { pen = false; return; } path += (pen ? 'L' : 'M') + xs[i].toFixed(1) + ' ' + y(v).toFixed(1); pen = true; });
    svg += '<path d="' + path + '" fill="none" stroke="#3f7d63" stroke-width="2" stroke-linejoin="round"/>';
    lv.forEach(function (v, i) { if (v != null) svg += '<circle cx="' + xs[i] + '" cy="' + y(v) + '" r="' + (n > 14 ? 2.2 : 3.2) + '" fill="#3f7d63"/>'; });
    svg += '<circle cx="' + nx + '" cy="' + y(guess) + '" r="6" fill="#fffdf8" stroke="#5a5fb0" stroke-width="2.5"/>';
    svg += '<rect x="' + (right - 78) + '" y="4" width="76" height="18" rx="9" fill="#5a5fb0"/><text x="' + (right - 40) + '" y="17" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">Early guess</text>';
    ds.forEach(function (d, i) {
      var label = d.today ? 'Now' : n === 7 ? wd(d.date) : n === 14 ? (i % 2 === 1 ? wd(d.date).charAt(0) : '') : (i % 7 === 1 ? String(d.date.getDate()) : '');
      if (label) svg += '<text x="' + xs[i] + '" y="' + (bottom + 26) + '" text-anchor="middle" font-size="11" ' + (d.today ? 'font-weight="700" fill="#3a322b"' : 'fill="#a2978a"') + '>' + label + '</text>';
    });
    svg += '<text x="' + nx + '" y="' + (bottom + 26) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#5a5fb0">Next</text></svg>';
    var t = this.trend;
    return '<div class="ms-card"><div class="ms-trend-head">' + mascot('calm') + '<div><p class="ms-h2">How You Have Been</p><small>However tomorrow goes, I am here. — Hedgie</small></div></div>' +
      '<div class="ms-chips">' + [['week', 'Week'], ['two', '2 Weeks'], ['month', 'Month']].map(function (c) { return '<button type="button" class="ms-chip' + (t === c[0] ? ' is-on' : '') + '" data-act="trend" data-arg="' + c[0] + '">' + c[1] + '</button>'; }).join('') + '</div>' + svg +
      '<div class="ms-legend"><span><i></i>How You Said You Felt</span><span><i class="dash"></i>Your Daily Rhythm</span></div><p class="ms-foot">An early guess for tomorrow — it gets better as you share more days</p></div>';
  };
  Phone.prototype.bindPlanet = function () {
    var slot = this.view('home').querySelector('[data-planet-slot]');
    if (!slot || !window.MSPlanet) return;
    if (!this.planetEl) {
      this.planetEl = document.createElement('div');
      this.planetEl.className = 'ms-planet';
      this.planetEl.setAttribute('role', 'img');
      this.planet = window.MSPlanet.mount(this.planetEl, countList);
    }
    var c = cityCounts();
    this.planetEl.setAttribute('aria-label', 'One planet with a continent for each mood in your community today: ' + MOODS.map(function (m) { return c[m] + ' ' + LABEL[m].toLowerCase(); }).join(', ') + '. You are the moon.');
    slot.replaceWith(this.planetEl);
    this.spin();
  };
  Phone.prototype.spin = function () {
    if (this.planet) { this.planet.setVisible(this.visible && this.tab === 'home'); this.planet.draw(); }
  };

  /* Community */
  Phone.prototype.r_community = function () {
    var self = this;
    var html = '<p class="ms-title">Community</p><div class="ms-sec"><span>Peer Communities</span><span class="ms-link">' + icon('add') + 'Create A Community</span></div><p class="ms-sub-line">Connect with people going through similar things.</p>';
    html += PEER.map(function (p) { return self.groupCard(p[0], p[1], p[2], '<span class="ms-gicon">' + p[3] + '</span>', null, true); }).join('');
    html += '<div class="ms-sec"><span>Official Communities</span></div><p class="ms-sub-line">Trusted organizations and support services near you.</p><div class="ms-filter"><button type="button" data-act="filter" data-arg="mine" class="' + (this.filter === 'mine' ? 'is-on' : '') + '">My Groups</button><button type="button" data-act="filter" data-arg="all" class="' + (this.filter === 'all' ? 'is-on' : '') + '">All Groups</button></div>';
    var logo = '<span class="ms-gicon ms-logo"><svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true"><path d="M6 22c6-1 12-6 16-14" stroke="#e8954a" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M8 26c7-1 14-6 18-14" stroke="#3d5a8c" stroke-width="4" stroke-linecap="round" fill="none"/></svg></span>';
    var list = OFFICIAL.filter(function (o) { return self.filter === 'all' || S.joined[o[0]]; });
    if (!list.length) html += '<div class="ms-card"><p class="ms-sub-line" style="text-align:center">Groups you join show up here.</p></div>';
    html += list.map(function (o) { return self.groupCard(o[0], o[1], o[2], logo, o[3] + '<br>Community Wellness Center · Mountain View, CA', false); }).join('');
    html += '<div class="ms-card ms-rows">' + row({ title: 'Call The Wellness Center', sub: 'Ask about a group, or one you do not see here.', right: icon('call-outline') }).replace('<span class="ms-tile"></span>', '') + row({ title: 'Meeting Links And Details', sub: 'The current list on their website.', right: icon('open-outline') }).replace('<span class="ms-tile"></span>', '') + '</div>';
    html += '<p class="ms-more">More Ways To Find A Group</p><div class="ms-card ms-rows">' + row({ title: 'Peer Support Group Directory', sub: 'Free, peer-led groups for people living with a mental health condition.', right: icon('open-outline') }).replace('<span class="ms-tile"></span>', '') + '</div>';
    this.view('community').innerHTML = html;
  };
  Phone.prototype.groupCard = function (id, name, desc, iconHtml, meta, peer) {
    var j = !!S.joined[id];
    var act = j ? '<button type="button" class="ms-join is-joined" data-act="join" data-arg="' + id + '">' + icon('checkmark') + 'Joined</button>' + (peer ? '<span class="ms-join">' + icon('chatbubble-outline') + 'Chat</span>' : '') : '<button type="button" class="ms-join" data-act="join" data-arg="' + id + '">Join</button>';
    return '<div class="ms-card ms-group" style="margin-top:12px">' + iconHtml + '<div class="ms-gbody"><b>' + name + '</b><p>' + desc + '</p>' + (meta ? '<small>' + meta + '</small>' : '') + '</div><div class="ms-gact">' + act + '</div></div>';
  };

  /* Recharge */
  Phone.prototype.r_recharge = function () {
    var cat = this.cat, lm = latestMood();
    var html = '<p class="ms-title">Recharge</p><div class="ms-tabs" role="tablist">' + CATS.map(function (c) { return '<button type="button" role="tab" aria-selected="' + (cat === c[0]) + '" class="' + (cat === c[0] ? 'is-on' : '') + '" data-act="cat" data-arg="' + c[0] + '">' + c[1] + '</button>'; }).join('') + '</div>';
    var items;
    if (cat === 'for-you') {
      html += lm ? '<p class="ms-because">Because you are feeling <span class="ms-pill" style="background:' + MOOD[lm].soft + ';color:' + MOOD[lm].deep + '">' + LABEL[lm] + '</span></p>' : '<p class="ms-because">Check in on Home and these will match how you feel.</p>';
      items = FOR_YOU[lm || 'none'].map(function (id) { return ITEM[id]; });
    } else items = ITEMS.filter(function (i) { return i.cat === cat; });
    html += '<div class="ms-card ms-rows"' + (cat === 'for-you' ? '' : ' style="margin-top:12px"') + '>' + items.map(function (i) { return row({ icon: i.emoji, soft: true, title: i.title, sub: i.sub, right: icon(ACTION_ICON[i.kind]) }); }).join('') + '</div>';
    html += '<div class="ms-sec"><span>Get Support</span></div>';
    html += '<div class="ms-card ms-rows" style="margin-top:0">' + row({ icon: icon('search-outline'), bg: 'var(--indigo-soft)', fg: 'var(--indigo)', title: 'Find Resources', sub: 'Local mental health services, programs, and tools', right: icon('chevron-forward'), mutedRight: true }) + '</div>';
    html += '<div class="ms-card ms-rows">' + row({ icon: icon('chatbubble-ellipses-outline'), bg: 'var(--violet-soft)', fg: 'var(--violet)', title: 'Talk To Mental Health America', sub: 'Message, call, or video chat with staff', right: icon('chevron-forward'), mutedRight: true }) + '</div>';
    html += '<div class="ms-card ms-rows">' + row({ icon: icon('warning-outline'), bg: 'var(--rose-soft)', fg: 'var(--rose)', title: 'Crisis Support', sub: 'Immediate help: 988 Suicide & Crisis Lifeline', right: icon('chevron-forward'), mutedRight: true }) + '</div>';
    this.view('recharge').innerHTML = html;
  };

  /* You */
  Phone.prototype.r_you = function () {
    var r = this.youRange, need = Math.max(3, 18 - S.today.length);
    var html = '<p class="ms-title">You</p><p class="ms-subtitle">' + { week: 'Your last 7 days', month: 'Your last 30 days', year: 'Your last 12 months' }[r] + '</p>';
    html += '<div class="ms-card"><div class="ms-growth">' + tree(2) + '<div><small>Level 3 of 6</small><b>' + STAGES[2][0] + '</b><p>' + STAGES[2][1] + '</p></div></div><div class="ms-progress"><span style="width:' + Math.round((18 - need) / 18 * 100) + '%"></span></div><p class="ms-progress-note">' + need + ' more to ' + STAGES[3][0] + '</p><p class="ms-growth-copy">Your tree grows every day you check in, however the day felt. A few days in a row helps it grow a little faster.</p></div>';
    html += '<div class="ms-card"><p class="ms-h2">Mood Trend</p><div class="ms-range">' + [['week', 'Week'], ['month', 'Month'], ['year', 'Year']].map(function (b) { return '<button type="button" class="ms-btn' + (r === b[0] ? '' : ' ms-ghost') + '" data-act="range" data-arg="' + b[0] + '">' + b[1] + '</button>'; }).join('') + '</div>' + trendChart(r) + '</div>';
    html += '<div class="ms-card"><p class="ms-h2">Your Summary</p><p class="ms-subtitle" style="margin-top:4px">A quick look back at how your day or week has gone.</p><div class="ms-report-btns"><button type="button" class="ms-btn' + (this.report === 'daily' ? '' : ' ms-ghost') + '" data-act="report" data-arg="daily">Today</button><button type="button" class="ms-btn' + (this.report === 'weekly' ? '' : ' ms-ghost') + '" data-act="report" data-arg="weekly">This Week</button></div><p class="ms-report">' + summary(this.report) + '</p></div>';
    html += '<div class="ms-card ms-rows">' + row({ icon: icon('settings-outline'), title: 'Settings', sub: 'Your data, privacy and preferences', right: icon('chevron-forward'), mutedRight: true }) + '</div>';
    this.view('you').innerHTML = html;
  };
  function tree(stage) {
    var C = { line: '#e9e1d4', amber: '#a9702c', p: '#8dbb9f', pd: '#4f8264' };
    var shapes = [{ t: 0, c: [] }, { t: 20, c: [], seed: 1 }, { t: 34, c: [[60, 62, 16]] }, { t: 44, c: [[60, 52, 18], [44, 62, 13], [76, 62, 13]] }];
    var s = shapes[stage], top = 104 - s.t, o = '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M24 104 Q60 94 96 104" stroke="' + C.line + '" stroke-width="3" stroke-linecap="round" fill="none"/>';
    o += s.t === 0 ? '<circle cx="60" cy="99" r="5" fill="' + C.amber + '"/>' : '<rect x="56.5" y="' + top + '" width="7" height="' + s.t + '" rx="3.5" fill="' + C.amber + '"/>';
    if (s.seed) o += '<ellipse cx="46" cy="' + (top + 4) + '" rx="13" ry="8" fill="' + C.p + '"/><ellipse cx="74" cy="' + (top + 4) + '" rx="13" ry="8" fill="' + C.pd + '"/>';
    if (s.c.length > 1) s.c.forEach(function (b) { o += '<line x1="60" y1="' + (top + 10) + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="' + C.amber + '" stroke-width="3" stroke-linecap="round"/>'; });
    s.c.forEach(function (b, i) { o += '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="' + (i % 2 ? C.pd : C.p) + '" opacity="' + (i % 2 ? 0.85 : 1) + '"/>'; });
    return o + '</svg>';
  }
  function trendChart(r) {
    var cols = [], labels = [];
    if (r === 'week') {
      days(7).forEach(function (d) {
        var es = d.moods.slice(0, 4), inner = '';
        if (!es.length) inner = '<span class="ms-ring ms-hollow"></span>';
        else es.forEach(function (m, i) { var size = 12 + i * 8; inner = '<span class="ms-ring" style="width:' + size + 'px;height:' + size + 'px;background:' + MOOD[m].mid + '">' + inner + '</span>'; });
        cols.push('<div>' + inner + '</div>'); labels.push(wd(d.date));
      });
    } else {
      var pts = [], cmax = r === 'month' ? 5 : 20, maxDot = r === 'month' ? 9 : 16;
      if (r === 'month') days(30).forEach(function (d, i) { pts.push({ moods: d.moods, label: i % 5 === 4 || d.today ? String(d.date.getDate()) : '' }); });
      else for (var m = 11; m >= 0; m--) {
        var ref = new Date(); ref.setDate(1); ref.setMonth(ref.getMonth() - m); var ms = [];
        history.concat([{ date: new Date(), moods: todayMoods() }]).forEach(function (h) { if (h.date.getMonth() === ref.getMonth() && h.date.getFullYear() === ref.getFullYear()) ms = ms.concat(h.moods); });
        pts.push({ moods: ms, label: ref.toLocaleDateString('en-US', { month: 'narrow' }) });
      }
      pts.forEach(function (p) {
        if (!p.moods.length) cols.push('<div><span class="ms-ring ms-hollow ms-thin" style="width:8px;height:8px"></span></div>');
        else { var conf = Math.min(p.moods.length, cmax) / cmax, size = 6 + (maxDot - 6) * conf; cols.push('<div><span class="ms-ring" style="width:' + size + 'px;height:' + size + 'px;background:' + MOOD[dominant(p.moods)].mid + ';opacity:' + (0.35 + 0.65 * conf).toFixed(2) + '"></span></div>'); }
        labels.push(p.label);
      });
    }
    return '<div class="ms-chart">' + cols.join('') + '</div><div class="ms-chart-labels">' + labels.map(function (l) { return '<span>' + l + '</span>'; }).join('') + '</div>';
  }
  /* General, plain-language summaries in the voice of the app's non-AI report. */
  function summary(kind) {
    var moods = kind === 'daily' ? todayMoods() : [].concat.apply([], days(7).map(function (d) { return d.moods; }));
    if (!moods.length) return 'Nothing to look back on yet. One check-in on Home is enough to start.';
    var up = moods.filter(function (m) { return UP[m]; }).length / moods.length;
    if (kind === 'daily') {
      return up >= 0.6 ? 'A mostly lighter day so far. Whatever helped today is worth keeping in tomorrow’s plan.'
        : up >= 0.4 ? 'A mixed day, with some easier moments and some heavier ones. A short pause or a few slow breaths could help the rest of it land a little softer.'
          : 'A heavier day so far. Be gentle with yourself, and if it keeps feeling like this, it may help to talk to someone you trust.';
    }
    return up >= 0.6 ? 'Overall a steady week, with more lighter days than heavy ones. Keep doing what has been working, and take the harder moments as they come.'
      : up >= 0.4 ? 'A mixed week, with lighter days alongside some harder ones. That is normal. Small breaks and regular sleep tend to help the busy stretches.'
        : 'A tougher week than usual. Small things like rest, a short walk or reaching out to someone can make a difference.';
  }

  /* clicks: in-page toggles only */
  Phone.prototype.click = function (e) {
    var b = e.target.closest('[data-act],[data-ms-go]'); if (!b || !this.r.contains(b)) return;
    if (b.hasAttribute('data-ms-go')) return this.go(b.getAttribute('data-ms-go'));
    var act = b.getAttribute('data-act'), arg = b.getAttribute('data-arg'), self = this;
    switch (act) {
      case 'mood': {
        S.today.push({ ts: Date.now(), mood: arg, fresh: true }); this.flash = arg; this.dot = null;
        renderAll(this); this.render('home');
        setTimeout(function () { var x = self.view('home').querySelector('.ms-face.is-on'); if (x) x.classList.remove('is-on'); }, 450);
        return;
      }
      case 'dot': this.dot = this.dot === +arg ? null : +arg; return this.render('home');
      case 'trend': this.trend = arg; return this.render('home');
      case 'join': S.joined[arg] = !S.joined[arg]; return renderAll();
      case 'filter': this.filter = arg; return this.render('community');
      case 'cat': this.cat = arg; return this.render('recharge');
      case 'range': this.youRange = arg; return this.render('you');
      case 'report': this.report = arg; return this.render('you');
    }
  };

  var list = phones.map(function (p) { return new Phone(p); });
  function renderAll(except) { list.forEach(function (p) { if (p !== except) p.render(); }); }
})();
