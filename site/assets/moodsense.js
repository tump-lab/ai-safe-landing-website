/* MoodSense app preview for the Products page.
   A faithful web copy of the MoodSense app's four tabs (Home, Community, Recharge, You), driven by fake
   sample data held in this tab's memory only: nothing is sent anywhere or stored. All four phones share
   one store, so a check-in on one phone shows up on the others. */
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
  var LEVEL = { good: 1, calm: 0.85, tired: 0.45, stressed: 0.2, low: 0 };
  var UP = { calm: 1, good: 1 };
  var REASONS = [['sleep', 'Sleep'], ['work_study', 'Work or study'], ['people', 'People I care about'], ['body', 'How my body feels'], ['me_time', 'Time for myself'], ['other', 'Something else']];
  var REASON_LABEL = {}; REASONS.forEach(function (r) { REASON_LABEL[r[0]] = r[1]; });
  var PHQ_STEM = 'Over the last 2 weeks, how often have you been bothered by the following problem?';
  var PHQ = ['Feeling nervous, anxious, or on edge', 'Not being able to stop or control worrying', 'Little interest or pleasure in doing things', 'Feeling down, depressed, or hopeless'];
  var PHQ_OPTS = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

  var ITEMS = [
    ['breathing', 'Breathing Exercise', 'Box breathing · 2 min', '🫧', 'breathing', 'activity', 'box-breathing', 'focused'],
    ['calming-breath', 'Calming Breath', 'Longer out-breath · 1 min', '🌙', 'breathing', 'activity', 'calming-breath', 'calm'],
    ['mindfulness', 'Mindfulness Moment', '5-4-3-2-1 senses · 2 min', '👁', 'mindfulness', 'activity', 'senses-grounding', 'present'],
    ['gratitude', 'Gratitude Exercise', 'Three good things · 2 min', '🌿', 'mindfulness', 'activity', 'gratitude-pause', 'lighter'],
    ['guided-relaxation', 'Guided Relaxation', 'Body scan · 2 min', '🧘', 'relaxation', 'activity', 'body-scan', 'grounded'],
    ['short-rest', 'Take A Short Rest', 'Eyes closed · 5 min', '🛋', 'relaxation', 'tip', 'Set a 5-minute timer, close your eyes and let your body go heavy. You do not need to sleep; just stop doing for a moment.'],
    ['reduce-screen', 'Screen Break', 'Put the phone down · 15 min', '📵', 'relaxation', 'tip', 'Put your phone face down or in another room for the next 15 minutes. Tired eyes and a tired mind both recover faster without a screen.'],
    ['drink-water', 'Drink Some Water', 'A glass, right now', '💧', 'relaxation', 'tip', 'Even mild dehydration can feel like tiredness. Get up, pour a glass of water and drink it slowly.'],
    ['sleep-tip', 'Plan A Better Night', 'Sleep tip', '🛏', 'relaxation', 'tip', 'Tonight, try winding down 30 minutes earlier: dim the lights, put screens away and keep the same wake-up time tomorrow.'],
    ['calming-audio', 'Calming Sounds', 'Gentle rain', '🌧', 'music', 'sound'],
    ['relaxing-music', 'Relaxing Sounds', 'Ocean waves', '🌊', 'music', 'sound'],
    ['forest-sounds', 'Forest Sounds', 'Birds and leaves', '🌲', 'music', 'sound'],
    ['fireplace-sounds', 'Fireplace', 'Soft crackle', '🔥', 'music', 'sound'],
    ['relaxing-video', 'Relaxing Video', 'Nature scenery · opens YouTube', '🏞', 'videos', 'video'],
    ['uplifting-video', 'Uplifting Video', 'Something kind · opens YouTube', '🌞', 'videos', 'video'],
    ['reflection', 'Write It Down', 'A few lines about today', '📓', 'reflection', 'reflect', 'What is on your mind today? A few lines is enough, good or hard.'],
    ['stretching', 'Stretching', 'Four seated stretches · 1 min', '🤸', 'exercise', 'activity', 'quick-stretch', 'less tense'],
    ['short-walk', 'Take A Short Walk', 'Outside · 10 min', '🚶', 'exercise', 'tip', 'Step outside for a 10-minute walk. No destination needed; just notice the air, the light and what you pass.'],
    ['stand-tall', 'Stand Tall', 'Posture and self-talk · 1 min', '🌟', 'exercise', 'activity', 'power-pose', 'confident'],
    ['light-exercise', 'Light Exercise', 'Move a little · 10 min', '🏃', 'exercise', 'tip', 'A light jog, a few flights of stairs or a short dance to one song. Gentle movement helps keep a good mood going.'],
    ['mood-lift', 'Mood-Lifting Game', 'Bubble pop · no score', '🫧', 'games', 'game'],
    ['ripple-pond', 'Ripple Pond', 'Calm and slow', '💧', 'games', 'game'],
    ['constellation', 'Constellation', 'Connect the stars', '⭐', 'games', 'game'],
    ['contact-trusted', 'Reach Out To Someone', 'A friend or family member', '💬', 'reflection', 'tip', 'Send a short message to someone you trust. It can be as simple as "Thinking of you, how are you doing?"'],
    ['share-moment', 'Share The Good Moment', 'Tell someone', '🤝', 'reflection', 'tip', 'Tell someone about what went well today. Sharing a good moment makes it last longer for both of you.'],
    ['keep-routine', 'Keep Your Routine', 'What is working', '🔄', 'reflection', 'tip', 'Whatever got you here today, sleep, movement, people, keep it in tomorrow’s plan too.']
  ].map(function (a) { return { id: a[0], title: a[1], sub: a[2], emoji: a[3], cat: a[4], kind: a[5], x: a[6], goal: a[7] }; });
  var ITEM = {}; ITEMS.forEach(function (i) { ITEM[i.id] = i; });
  var CATS = [['for-you', 'For You'], ['breathing', 'Breathing'], ['mindfulness', 'Mindfulness'], ['relaxation', 'Relaxation'], ['music', 'Music'], ['videos', 'Videos'], ['reflection', 'Reflection'], ['exercise', 'Short Exercises'], ['games', 'Games']];
  var FOR_YOU = {
    stressed: ['breathing', 'guided-relaxation', 'short-walk', 'stretching', 'mindfulness', 'reflection'],
    low: ['mood-lift', 'gratitude', 'contact-trusted', 'short-walk', 'reflection', 'calming-audio'],
    tired: ['short-rest', 'calming-breath', 'stretching', 'reduce-screen', 'drink-water', 'sleep-tip'],
    calm: ['mindfulness', 'reflection', 'light-exercise', 'keep-routine', 'calming-audio'],
    good: ['gratitude', 'share-moment', 'keep-routine', 'light-exercise', 'reflection'],
    none: ['calming-breath', 'stretching', 'calming-audio']
  };
  var ACTION_ICON = { activity: 'play-circle-outline', sound: 'musical-notes-outline', game: 'game-controller-outline', reflect: 'create-outline', tip: 'chevron-forward', video: 'open-outline' };
  var ACTIVITIES = {
    'box-breathing': { title: 'Box Breathing', desc: 'Inhale, hold, exhale, hold — 4 seconds each, on repeat.', dur: 128, breath: true, steps: [['Breathe in', 4, 1], ['Hold', 4, 1], ['Breathe out', 4, 0.55], ['Hold', 4, 0.55]] },
    'calming-breath': { title: 'Calming Breathing', desc: 'A shorter reset — breathe in for 4, out for 6.', dur: 60, breath: true, steps: [['Breathe in', 4, 1], ['Breathe out', 6, 0.55]] },
    'quick-stretch': { title: 'Quick Stretch', desc: 'Four simple stretches you can do right where you sit.', dur: 60, steps: [['Neck roll', 15], ['Shoulder rolls', 15], ['Forward fold', 15], ['Side stretch', 15]] },
    'body-scan': { title: 'Body Scan', desc: 'A slow head-to-toe scan to settle your attention.', dur: 120, steps: [['Notice your feet', 24], ['Notice your legs', 24], ['Notice your breath', 24], ['Notice your shoulders', 24], ['Notice your whole body', 24]] },
    'senses-grounding': { title: '5-4-3-2-1 Senses', desc: 'Name what you can see, hear and feel to come back to the room.', dur: 120, steps: [['Five things you see', 30], ['Four things you feel', 25], ['Three things you hear', 25], ['Two things you smell', 20], ['One slow breath', 20]] },
    'power-pose': { title: 'Stand Tall', desc: 'Open posture and a few steady lines to say before what is next.', dur: 75, steps: [['Ground your feet', 15], ['Open your chest', 15], ['Lift your gaze', 15], ['Say it to yourself', 15], ['Carry it with you', 15]] },
    'gratitude-pause': { title: 'Three Good Things', desc: 'Bring to mind three things that went right, however small.', dur: 120, steps: [['Something small today', 30], ['Someone you are glad for', 30], ['Something about you', 30], ['Let it settle', 30]] }
  };
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
  var CHAT = {
    night: [['g', 'Welcome in. Tonight’s theme is winding down without a screen. What usually keeps you up?', '10:02 PM'], ['Mira', 'Day 3 of no phone after 11. Actually fell asleep faster 😮', '10:05 PM'], ['Jun', 'I keep replaying work stuff in bed. Anyone else?', '10:07 PM']],
    work: [['g', 'This is a space to vent and swap small fixes. No advice unless someone asks for it.', '12:10 PM'], ['Sam', 'Back-to-back meetings again. A 5 min walk between two of them helped.', '12:14 PM'], ['Lee', 'Stealing that idea.', '12:15 PM']],
    study: [['g', 'Exam week! Share one thing you finished today, however small.', '4:30 PM'], ['Priya', 'Finished one practice set. Taking a break now.', '4:41 PM'], ['Tom', 'Still on chapter 4 but I started, which counts.', '4:44 PM']],
    social: [['g', 'Small wins count here. What felt a little easier this week?', '7:00 PM'], ['Ana', 'Said hi to a neighbor first. Tiny, but I did it.', '7:06 PM']],
    wellbeing: [['g', 'How has today been, in one word?', '6:00 PM'], ['Kai', 'Steady.', '6:03 PM'], ['Noor', 'Busy, but okay.', '6:05 PM']]
  };
  var GUIDE_REPLIES = ['Thank you for sharing that. You are not the only one here who has felt it.', 'That sounds like a lot to carry. What is one small thing that might help tonight?', 'Noticing it is already a step. Anyone else want to share what has helped them?'];
  var MEMBERS = { night: [['🦉', 'Mira', 'Calm'], ['🌿', 'Jun', 'Tired']], work: [['☕', 'Sam', 'Stressed'], ['🐢', 'Lee', 'Good']], study: [['📖', 'Priya', 'Tired'], ['🎧', 'Tom', 'Stressed']], social: [['🌻', 'Ana', 'Good'], ['🐧', 'Eli', 'Calm']], wellbeing: [['🍵', 'Kai', 'Calm'], ['🌙', 'Noor', 'Good']] };
  var STAGES = [['Seed', 'Planted. Every check-in gives it a little water.'], ['Sprout', 'It is up. A handful of days of checking in did that.'], ['Sapling', 'Taking root — you have been coming back to it.'], ['Young Tree', 'Steady enough to take a rough week without noticing.'], ['Full Tree', 'Settled, with plenty of lighter days in the mix.'], ['In Blossom', 'You have been showing up for a while now, and it shows.']];

  /* ---------- fake data ---------- */
  var seed = 914;
  function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
  function pickMood(weights) { var r = rnd(), a = 0; for (var i = 0; i < 5; i++) { a += weights[i]; if (r < a) return MOODS[i]; } return 'calm'; }
  function dayStart(offset) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - offset); return d; }
  var history = []; // index 0 = 365 days ago ... last = yesterday
  for (var off = 365; off >= 1; off--) {
    var dd = dayStart(off), wk = dd.getDay(), weekend = wk === 0 || wk === 6;
    var w = weekend ? [0.34, 0.32, 0.1, 0.1, 0.14] : [0.26, 0.2, 0.26, 0.12, 0.16];
    var n = rnd() < 0.16 ? 0 : 1 + Math.floor(rnd() * 2.4), list = [];
    for (var j = 0; j < n; j++) list.push(pickMood(w));
    history.push({ date: dd, moods: list });
  }
  // A recognisable last week: Wed calm, Thu good, Fri stressed, Sat skipped, Sun calm, Mon low.
  var lastWeek = [['calm'], ['good'], ['stressed', 'tired'], [], ['calm', 'good'], ['low']];
  for (var k = 0; k < 6; k++) history[history.length - 6 + k].moods = lastWeek[k];
  function at(h, m) { var d = new Date(); d.setHours(h, m, 0, 0); return d.getTime(); }
  var S = {
    today: [{ ts: at(8, 42), mood: 'calm', reasons: ['sleep'] }, { ts: at(13, 15), mood: 'stressed', reasons: ['work_study'] }],
    phqDone: false, joined: { night: true }, rooms: {}, extraPoints: 0
  };
  function latestMood() { return S.today.length ? S.today[S.today.length - 1].mood : null; }
  function todayMoods() { return S.today.map(function (e) { return e.mood; }); }

  /* ---------- helpers ---------- */
  function icon(name, cls) { var d = ART.icons[name]; return d ? '<svg class="ms-ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 512 512" aria-hidden="true"><path d="' + d + '"/></svg>' : ''; }
  function mascot(mood) { return '<svg viewBox="0 0 64 64" aria-hidden="true">' + ART.mascots[mood] + '</svg>'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function time(ts) { return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
  function avgLevel(moods) { if (!moods.length) return null; var t = 0; moods.forEach(function (m) { t += LEVEL[m]; }); return t / moods.length; }
  function dominant(moods) { var c = {}, best = null; moods.forEach(function (m) { c[m] = (c[m] || 0) + 1; if (!best || c[m] > c[best]) best = m; }); return best; }
  function days(n) { // last n days ending today: [{date, moods, today}]
    var out = history.slice(-(n - 1)).map(function (h) { return { date: h.date, moods: h.moods }; });
    out.push({ date: dayStart(0), moods: todayMoods(), today: true });
    return out;
  }
  function wd(d) { return d.toLocaleDateString('en-US', { weekday: 'short' }); }
  function row(o) {
    return '<button type="button" class="ms-row"' + (o.act ? ' data-act="' + o.act + '"' : '') + (o.arg ? ' data-arg="' + o.arg + '"' : '') + '><span class="ms-tile' + (o.soft ? ' ms-soft' : '') + '"' + (o.bg ? ' style="background:' + o.bg + ';color:' + (o.fg || 'inherit') + '"' : '') + '>' + o.icon + '</span><span class="ms-rt"><b>' + o.title + '</b>' + (o.sub ? '<small>' + o.sub + '</small>' : '') + '</span>' + (o.right != null ? '<span class="ms-right' + (o.mutedRight ? ' ms-muted' : '') + '">' + o.right + '</span>' : '') + '</button>';
  }

  /* ---------- planet (Community feed on Home) ---------- */
  function cityCounts() {
    var c = { calm: 34, good: 32, stressed: 25, low: 16, tired: 15 };
    todayMoods().forEach(function (m) { c[m]++; });
    return c;
  }
  var CONT = { calm: [0.3, 0.2], good: [-0.25, 1.5], stressed: [0.15, 2.9], low: [-0.35, 4.2], tired: [0.45, 5.3] };
  var blobs = [];
  (function () {
    var s = 77; function r() { s = (s * 16807) % 2147483647; return s / 2147483647; }
    MOODS.forEach(function (m) {
      for (var i = 0; i < 40; i++) blobs.push({ m: m, i: i, lat: CONT[m][0] + (r() - 0.5) * 0.7, lon: CONT[m][1] + (r() - 0.5) * 0.95, r: 0.11 + r() * 0.1 });
    });
  })();
  function drawPlanet(cv, rot) {
    var dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
    if (!W || !H) return;
    if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    var g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    var cx = W / 2, cy = H * 0.44, R = Math.min(W, H) * 0.34, counts = cityCounts(), lm = latestMood();
    // distant planets + sparkles
    [[W * 0.14, H * 0.2, 9, '#e2e2ea', '#a6a8bb'], [W * 0.86, H * 0.72, 6, '#ecdfd3', '#b9a696']].forEach(function (p) { var gr = g.createRadialGradient(p[0] - p[2] / 3, p[1] - p[2] / 3, 1, p[0], p[1], p[2]); gr.addColorStop(0, p[3]); gr.addColorStop(1, p[4]); g.fillStyle = gr; g.beginPath(); g.arc(p[0], p[1], p[2], 0, 7); g.fill(); });
    ['#d9ad3f', '#e39abd', '#f0c24e', '#a493e0'].forEach(function (c, i) { var x = [0.22, 0.8, 0.9, 0.12][i] * W, y = [0.62, 0.16, 0.42, 0.46][i] * H, s = 4 + (i % 2) * 2; g.fillStyle = c; g.beginPath(); g.moveTo(x, y - s); g.quadraticCurveTo(x, y, x + s, y); g.quadraticCurveTo(x, y, x, y + s); g.quadraticCurveTo(x, y, x - s, y); g.quadraticCurveTo(x, y, x, y - s); g.fill(); });
    function ring(front) { g.save(); g.strokeStyle = '#9a86b8'; g.lineWidth = 1.6; g.globalAlpha = 0.75; g.beginPath(); g.ellipse(cx, cy, R * 1.45, R * 0.34, -0.22, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); g.stroke(); g.restore(); }
    ring(false);
    // sea
    var sea = g.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    sea.addColorStop(0, '#fffdf8'); sea.addColorStop(0.75, '#f3ebe0'); sea.addColorStop(1, '#e4d8ea');
    g.fillStyle = sea; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip();
    var youDrawn = null;
    blobs.forEach(function (b) {
      var share = counts[b.m] / 4; if (b.i >= share) return;
      var lon = b.lon + rot, x = Math.cos(b.lat) * Math.sin(lon), y = Math.sin(b.lat), z = Math.cos(b.lat) * Math.cos(lon);
      if (z < -0.05) return;
      var px = cx + R * x, py = cy - R * y, rr = R * b.r * (0.45 + 0.55 * Math.max(z, 0));
      g.fillStyle = MOOD[b.m].mid; g.globalAlpha = 0.55 + 0.45 * Math.max(z, 0);
      g.beginPath(); g.ellipse(px, py, rr * (0.35 + 0.65 * Math.max(z, 0.05)), rr, Math.atan2(x, 1) * 0.2, 0, Math.PI * 2); g.fill();
      if (lm && b.m === lm && b.i === 0 && z > 0.15) youDrawn = [px, py];
    });
    g.globalAlpha = 1;
    var shade = g.createRadialGradient(cx - R * 0.45, cy - R * 0.5, R * 0.2, cx, cy, R * 1.05);
    shade.addColorStop(0, 'rgba(255,255,255,0.35)'); shade.addColorStop(0.6, 'rgba(255,255,255,0)'); shade.addColorStop(1, 'rgba(90,70,110,0.22)');
    g.fillStyle = shade; g.fillRect(cx - R, cy - R, R * 2, R * 2);
    g.restore();
    g.strokeStyle = '#d8c8e0'; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
    if (youDrawn) { g.fillStyle = '#4f3f6e'; g.beginPath(); g.arc(youDrawn[0], youDrawn[1], 4, 0, 7); g.fill(); g.strokeStyle = '#fffdf8'; g.lineWidth = 2; g.stroke(); g.font = '600 10px -apple-system,Helvetica,sans-serif'; g.fillStyle = '#4f3f6e'; g.fillText('You', youDrawn[0] + 7, youDrawn[1] + 3); }
    ring(true);
    // moon
    var ma = rot * 0.6, mx = cx + Math.cos(ma) * R * 1.3, my = cy + Math.sin(ma) * R * 0.3 - 4;
    g.fillStyle = '#fffdf8'; g.strokeStyle = '#9a86b8'; g.lineWidth = 1.2; g.beginPath(); g.arc(mx, my, 7, 0, 7); g.fill(); g.stroke();
  }

  /* ---------- one phone ---------- */
  function Phone(root) {
    this.r = root; this.tab = root.getAttribute('data-ms-start') || 'home';
    this.trend = 'week'; this.youRange = 'week'; this.cat = 'for-you'; this.filter = 'all'; this.dot = null; this.report = null; this.rot = 0.4; this.anim = null; this.visible = false;
    var self = this;
    this.r.querySelectorAll('[data-ms-icon]').forEach(function (i) { i.innerHTML = icon(i.getAttribute('data-ms-icon') + '-outline') || icon(i.getAttribute('data-ms-icon')); });
    this.r.addEventListener('click', function (e) { self.click(e); });
    this.r.addEventListener('submit', function (e) { e.preventDefault(); self.send(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; self.spin(); }, { threshold: 0.1 }).observe(root);
    this.go(this.tab, true);
  }
  Phone.prototype.q = function (s) { return this.r.querySelector(s); };
  Phone.prototype.view = function (t) { return this.q('[data-ms-view="' + t + '"]'); };
  Phone.prototype.go = function (tab, first) {
    this.tab = tab; this.close();
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
  Phone.prototype.toast = function (msg) {
    var t = this.q('[data-ms-toast]'); t.textContent = msg; t.classList.add('is-on');
    clearTimeout(this.tt); this.tt = setTimeout(function () { t.classList.remove('is-on'); }, 2600);
  };

  /* Home */
  Phone.prototype.r_home = function () {
    var now = new Date(), h = now.getHours(), self = this;
    var html = '<p class="ms-title">' + (h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening') + '</p><p class="ms-subtitle">' + now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + '</p>';
    if (!S.today.length) html += '<div class="ms-card"><div class="ms-row" style="padding:0"><span style="font-size:28px">🔥</span><span class="ms-rt"><b>6-Day Streak</b><small>Daily check-ins keep your insights sharp</small></span></div></div>';
    html += '<div class="ms-card"><p class="ms-h2">How Are You Feeling Right Now?</p><div class="ms-faces">' + MOODS.map(function (m) { return '<button type="button" class="ms-face' + (self.flash === m ? ' is-on' : '') + '" data-act="mood" data-arg="' + m + '" aria-label="' + LABEL[m] + '">' + mascot(m) + '<span>' + LABEL[m] + '</span></button>'; }).join('') + '</div>';
    if (S.today.length) {
      var sel = S.today.filter(function (e) { return e.ts === self.dot; })[0];
      html += '<div class="ms-today"><div class="ms-today-head"><b>Today</b><span>' + (sel ? time(sel.ts) + ' · ' + LABEL[sel.mood] : 'Tap a dot to see it') + '</span></div><div class="ms-dots">' + S.today.map(function (e) { return '<button type="button" data-act="dot" data-arg="' + e.ts + '" class="' + (e.ts === self.dot ? 'is-on ' : '') + (e.fresh ? 'is-new' : '') + '" style="background:' + MOOD[e.mood].mid + '" aria-label="' + time(e.ts) + ', ' + LABEL[e.mood] + '"></button>'; }).join('') + '</div></div>';
    } else html += '<p class="ms-empty-note">Today’s check-ins will show up here.</p>';
    html += '</div><div class="ms-card ms-rows">' + (S.phqDone
      ? row({ act: 'phq', icon: '📋', bg: 'var(--primary-soft)', title: 'Mood Check Done This Week ✓', sub: 'Take it again any time your day has changed', right: '<span class="ms-pill" style="background:var(--primary-soft);color:var(--primary-deep)">Retake</span>' })
      : row({ act: 'phq', icon: '📋', title: 'Mood Check For This Week', sub: '4 questions · under a minute', right: '<span class="ms-pill">Start</span>' })) + '</div>';
    var c = cityCounts();
    html += '<div class="ms-sec"><span>Your Community</span><button type="button" class="ms-link" data-act="toast" data-arg="Choosing a community happens in the full app.">Change</button></div><p class="ms-community-label">Mountain View, California, United States</p>';
    html += '<div class="ms-planet" data-planet><canvas aria-label="Mood planet: each continent is one mood, sized by how many people nearby feel it today"></canvas><span class="ms-planet-hint">Drag to turn</span><div class="ms-planet-legend">' + MOODS.map(function (m) { return '<span><i style="background:' + MOOD[m].mid + '"></i>' + c[m] + ' ' + LABEL[m] + '</span>'; }).join('') + '</div></div>';
    html += this.trendCard();
    this.view('home').innerHTML = html;
    this.flash = null;
    S.today.forEach(function (e) { e.fresh = false; });
    this.bindPlanet();
  };
  Phone.prototype.trendCard = function () {
    var n = { week: 7, two: 14, month: 30 }[this.trend], ds = days(n);
    var W = 311, H = 150, left = 44, nextW = 32, right = W - 4, plotR = right - nextW, top = 12, bottom = 108;
    var step = (plotR - left) / (n - 1 + 0.5), xs = ds.map(function (d, i) { return left + 8 + i * step; }), nx = right - nextW / 2;
    function y(v) { return bottom - v * (bottom - top); }
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="margin-top:8px" aria-label="How you said you felt each day, with a dashed guess for tomorrow">';
    [top, (top + bottom) / 2, bottom].forEach(function (gy) { svg += '<line x1="' + left + '" x2="' + plotR + '" y1="' + gy + '" y2="' + gy + '" stroke="#d9d0c2" stroke-width="1" stroke-dasharray="1 5" stroke-linecap="round"/>'; });
    svg += '<rect x="' + (right - nextW) + '" y="2" width="' + nextW + '" height="' + (bottom + 12) + '" rx="6" fill="#ece9f3"/>';
    svg += '<text x="4" y="' + (top + 4) + '" font-size="10" font-weight="700" fill="#6f6559" letter-spacing=".5">HIGH</text><text x="9" y="' + (bottom + 4) + '" font-size="10" font-weight="700" fill="#6f6559" letter-spacing=".5">LOW</text>';
    // rhythm: mean of the period, gently pulled by weekday
    var lv = ds.map(function (d) { return avgLevel(d.moods); }), known = lv.filter(function (v) { return v != null; }), mean = known.reduce(function (a, b) { return a + b; }, 0) / Math.max(known.length, 1);
    var ry = y(mean * 0.9 + 0.05);
    svg += '<line x1="' + xs[0] + '" x2="' + nx + '" y1="' + ry + '" y2="' + ry + '" stroke="#5a5fb0" stroke-width="1.8" stroke-dasharray="5 4"/>';
    var path = '', pen = false;
    lv.forEach(function (v, i) { if (v == null) { pen = false; return; } path += (pen ? 'L' : 'M') + xs[i].toFixed(1) + ' ' + y(v).toFixed(1); pen = true; });
    svg += '<path d="' + path + '" fill="none" stroke="#3f7d63" stroke-width="2" stroke-linejoin="round"/>';
    lv.forEach(function (v, i) { if (v != null) svg += '<circle cx="' + xs[i] + '" cy="' + y(v) + '" r="' + (n > 14 ? 2.2 : 3.2) + '" fill="#3f7d63"/>'; });
    svg += '<circle cx="' + nx + '" cy="' + ry + '" r="6" fill="#fffdf8" stroke="#5a5fb0" stroke-width="2.5"/>';
    svg += '<rect x="' + (right - 78) + '" y="4" width="76" height="18" rx="9" fill="#5a5fb0"/><text x="' + (right - 40) + '" y="17" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">Early guess</text>';
    ds.forEach(function (d, i) {
      var label = d.today ? 'Now' : n === 7 ? wd(d.date) : n === 14 ? (i % 2 === 0 ? wd(d.date).charAt(0) : '') : (i % 7 === 2 ? String(d.date.getDate()) : '');
      if (label) svg += '<text x="' + xs[i] + '" y="' + (bottom + 26) + '" text-anchor="middle" font-size="11" ' + (d.today ? 'font-weight="700" fill="#3a322b"' : 'fill="#a2978a"') + '>' + label + '</text>';
    });
    svg += '<text x="' + nx + '" y="' + (bottom + 26) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#5a5fb0">Next</text></svg>';
    var t = this.trend;
    return '<div class="ms-card"><div class="ms-trend-head">' + mascot('calm') + '<div><p class="ms-h2">How You Have Been</p><small>However tomorrow goes, I am here. — Hedgie</small></div></div>' +
      '<div class="ms-chips">' + [['week', 'Week'], ['two', '2 Weeks'], ['month', 'Month']].map(function (c) { return '<button type="button" class="ms-chip' + (t === c[0] ? ' is-on' : '') + '" data-act="trend" data-arg="' + c[0] + '">' + c[1] + '</button>'; }).join('') + '</div>' + svg +
      '<div class="ms-legend"><span><i></i>How You Said You Felt</span><span><i class="dash"></i>Your Daily Rhythm</span></div><p class="ms-foot">An early guess for tomorrow — it gets better as you share more days</p></div>';
  };
  Phone.prototype.bindPlanet = function () {
    var box = this.view('home').querySelector('[data-planet]'), self = this;
    if (!box) return;
    this.cv = box.querySelector('canvas');
    drawPlanet(this.cv, this.rot);
    var sx = null, sr = 0;
    box.addEventListener('pointerdown', function (e) { sx = e.clientX; sr = self.rot; self.dragging = true; box.setPointerCapture(e.pointerId); });
    box.addEventListener('pointermove', function (e) { if (sx == null) return; self.rot = sr + (e.clientX - sx) / 60; drawPlanet(self.cv, self.rot); });
    box.addEventListener('pointerup', function () { sx = null; self.dragging = false; });
    box.addEventListener('pointercancel', function () { sx = null; self.dragging = false; });
  };
  Phone.prototype.spin = function () {
    var self = this;
    if (this.anim || !this.visible || this.tab !== 'home') return;
    var last = 0;
    var tick = function (t) {
      if (!self.visible || self.tab !== 'home' || !self.cv || !self.cv.isConnected) { self.anim = null; return; }
      if (t - last > 40) { if (!self.dragging) self.rot += 0.004; drawPlanet(self.cv, self.rot); last = t; }
      self.anim = requestAnimationFrame(tick);
    };
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.anim = requestAnimationFrame(tick);
  };

  /* Community */
  Phone.prototype.r_community = function () {
    var self = this;
    var html = '<p class="ms-title">Community</p><div class="ms-sec"><span>Peer Communities</span><button type="button" class="ms-link" data-act="toast" data-arg="Creating a community happens in the full app.">' + icon('add') + 'Create A Community</button></div><p class="ms-sub-line">Connect with people going through similar things.</p>';
    html += PEER.map(function (p) { return self.groupCard(p[0], p[1], p[2], '<span class="ms-gicon">' + p[3] + '</span>', null, true); }).join('');
    html += '<div class="ms-sec"><span>Official Communities</span></div><p class="ms-sub-line">Trusted organizations and support services near you.</p><div class="ms-filter"><button type="button" data-act="filter" data-arg="mine" class="' + (this.filter === 'mine' ? 'is-on' : '') + '">My Groups</button><button type="button" data-act="filter" data-arg="all" class="' + (this.filter === 'all' ? 'is-on' : '') + '">All Groups</button></div>';
    var logo = '<span class="ms-gicon ms-logo"><svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true"><path d="M6 22c6-1 12-6 16-14" stroke="#e8954a" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M8 26c7-1 14-6 18-14" stroke="#3d5a8c" stroke-width="4" stroke-linecap="round" fill="none"/></svg></span>';
    var list = OFFICIAL.filter(function (o) { return self.filter === 'all' || S.joined[o[0]]; });
    if (!list.length) html += '<div class="ms-card"><p class="ms-sub-line" style="text-align:center">Groups you join show up here.</p></div>';
    html += list.map(function (o) { return self.groupCard(o[0], o[1], o[2], logo, o[3] + '<br>Community Wellness Center · Mountain View, CA', false); }).join('');
    html += '<div class="ms-card ms-rows">' + row({ act: 'toast', arg: 'Calls the center’s front desk in the full app.', icon: '', title: 'Call The Wellness Center', sub: 'Ask about a group, or one you do not see here.', right: icon('call-outline') }).replace('<span class="ms-tile"></span>', '') + row({ act: 'toast', arg: 'Opens the center’s website in the full app.', icon: '', title: 'Meeting Links And Details', sub: 'The current list on their website.', right: icon('open-outline') }).replace('<span class="ms-tile"></span>', '') + '</div>';
    html += '<p class="ms-more">More Ways To Find A Group</p><div class="ms-card ms-rows">' + row({ act: 'toast', arg: 'Opens a national directory of peer-led groups.', icon: '', title: 'Peer Support Group Directory', sub: 'Free, peer-led groups for people living with a mental health condition.', right: icon('open-outline') }).replace('<span class="ms-tile"></span>', '') + '</div>';
    this.view('community').innerHTML = html;
  };
  Phone.prototype.groupCard = function (id, name, desc, iconHtml, meta, peer) {
    var j = !!S.joined[id];
    var act = j ? '<button type="button" class="ms-join is-joined" data-act="join" data-arg="' + id + '">' + icon('checkmark') + 'Joined</button>' + (peer ? '<button type="button" class="ms-join" data-act="chat" data-arg="' + id + '">' + icon('chatbubble-outline') + 'Chat</button>' : '') : '<button type="button" class="ms-join" data-act="join" data-arg="' + id + '">Join</button>';
    return '<div class="ms-card ms-group" style="margin-top:12px">' + iconHtml + '<div class="ms-gbody"><b>' + name + '</b><p>' + desc + '</p>' + (meta ? '<small>' + meta + '</small>' : '') + '</div><div class="ms-gact">' + act + '</div></div>';
  };
  Phone.prototype.openChat = function (id) {
    var g = PEER.filter(function (p) { return p[0] === id; })[0], log = S.rooms[id] || (S.rooms[id] = CHAT[id].slice());
    var mem = '<div class="ms-member"><span class="ms-avatar" style="background:var(--indigo-soft)">' + icon('sparkles') + '</span><span><b>Guide</b><small>AI member</small></span></div>' + MEMBERS[id].map(function (m) { return '<div class="ms-member"><span class="ms-avatar" style="background:' + MOOD[m[2].toLowerCase()].soft + '">' + m[0] + '</span><span><b>' + m[1] + '</b><small>' + m[2] + '</small></span></div>'; }).join('');
    this.full('<div class="ms-navbar"><button type="button" data-act="close" aria-label="Back">' + icon('arrow-back') + '</button><h4>' + g[1] + '</h4><button type="button" class="ms-leave" data-act="leave" data-arg="' + id + '">Leave</button></div><div class="ms-members">' + mem + '</div><div class="ms-msgs" data-msgs></div><form class="ms-composer"><span class="ms-guidechip">' + icon('sparkles') + 'Guide</span><input type="text" maxlength="300" placeholder="Message the group" aria-label="Message"><button type="submit" class="ms-send" aria-label="Send">' + icon('arrow-up') + '</button></form>');
    this.room = id; this.paintMsgs();
  };
  Phone.prototype.paintMsgs = function () {
    var box = this.q('[data-msgs]'); if (!box) return;
    box.innerHTML = S.rooms[this.room].map(function (m) {
      var who = m[0], cls = who === 'g' ? ' is-guide' : who === 'me' ? ' is-mine' : '';
      return '<div class="ms-bubble-row' + cls + '">' + (who === 'me' ? '' : '<span class="ms-bname">' + (who === 'g' ? icon('sparkles') + 'Guide' : esc(who)) + '</span>') + '<div class="ms-bubble">' + esc(m[1]) + '</div><span class="ms-btime">' + m[2] + '</span></div>';
    }).join('') + (this.typing ? '<p class="ms-typing">Guide is typing…</p>' : '');
    box.scrollTop = box.scrollHeight;
  };
  Phone.prototype.send = function () {
    var inp = this.q('.ms-composer input'); if (!inp) return;
    var v = inp.value.trim(), id = this.room, self = this; if (!v) return;
    var log = S.rooms[id]; log.push(['me', v, time(Date.now())]); inp.value = '';
    this.typing = true; this.paintMsgs();
    setTimeout(function () { log.push(['g', GUIDE_REPLIES[log.length % GUIDE_REPLIES.length], time(Date.now())]); self.typing = false; if (self.room === id) self.paintMsgs(); }, 1400);
  };

  /* Recharge */
  Phone.prototype.r_recharge = function () {
    var cat = this.cat, lm = latestMood();
    var html = '<p class="ms-title">Recharge</p><div class="ms-tabs" role="tablist">' + CATS.map(function (c) { return '<button type="button" role="tab" aria-selected="' + (cat === c[0]) + '" class="' + (cat === c[0] ? 'is-on' : '') + '" data-act="cat" data-arg="' + c[0] + '">' + c[1] + '</button>'; }).join('') + '</div>';
    var items;
    if (cat === 'for-you') {
      html += lm ? '<p class="ms-because">Because you are feeling <span class="ms-pill" style="background:' + MOOD[lm].soft + ';color:' + MOOD[lm].deep + '">' + LABEL[lm] + '</span></p>' : '<p class="ms-because">Check in on Home and these will match how you feel.</p>';
      items = FOR_YOU[lm || 'none'].slice(0, 3).map(function (id) { return ITEM[id]; });
    } else items = ITEMS.filter(function (i) { return i.cat === cat; });
    html += '<div class="ms-card ms-rows"' + (cat === 'for-you' ? '' : ' style="margin-top:12px"') + '>' + items.map(function (i) { return row({ act: 'item', arg: i.id, icon: i.emoji, soft: true, title: i.title, sub: i.sub, right: icon(ACTION_ICON[i.kind]) }); }).join('') + '</div>';
    html += '<div class="ms-sec"><span>Get Support</span></div>';
    html += '<div class="ms-card ms-rows" style="margin-top:0">' + row({ act: 'toast', arg: 'Shows local mental health services, programs and tools.', icon: icon('search-outline'), bg: 'var(--indigo-soft)', fg: 'var(--indigo)', title: 'Find Resources', sub: 'Local mental health services, programs, and tools', right: icon('chevron-forward'), mutedRight: true }) + '</div>';
    html += '<div class="ms-card ms-rows">' + row({ act: 'toast', arg: 'Connects you with trained staff by message, call or video.', icon: icon('chatbubble-ellipses-outline'), bg: 'var(--violet-soft)', fg: 'var(--violet)', title: 'Talk To Mental Health America', sub: 'Message, call, or video chat with staff', right: icon('chevron-forward'), mutedRight: true }) + '</div>';
    html += '<div class="ms-card ms-rows">' + row({ act: 'toast', arg: 'In a crisis in the US, call or text 988, any time.', icon: icon('warning-outline'), bg: 'var(--rose-soft)', fg: 'var(--rose)', title: 'Crisis Support', sub: 'Immediate help: 988 Suicide & Crisis Lifeline', right: icon('chevron-forward'), mutedRight: true }) + '</div>';
    this.view('recharge').innerHTML = html;
  };
  Phone.prototype.openItem = function (id) {
    var it = ITEM[id], self = this;
    if (it.kind === 'activity') return this.player(it);
    if (it.kind === 'sound') return this.sound(it);
    if (it.kind === 'video') return this.toast('Opens a ' + (id === 'uplifting-video' ? 'kind, uplifting' : 'relaxing nature') + ' video on YouTube.');
    if (it.kind === 'game') return this.toast(it.title + ': a calm, no-score game in the full app.');
    var body = it.kind === 'tip' ? '<p class="ms-sheet-body">' + esc(it.x) + '</p><button type="button" class="ms-btn" data-act="tried">I’ll Try It</button>'
      : '<p class="ms-sheet-body">' + esc(it.x) + '</p><textarea aria-label="Write here" placeholder="Write here" maxlength="1000"></textarea><p class="ms-note">Saved only on this phone.</p><button type="button" class="ms-btn" data-act="saveReflect">Save</button>';
    this.sheet('<div class="ms-sheet-top"><span class="ms-emoji">' + it.emoji + '</span><button type="button" class="ms-x" data-act="close" aria-label="Close">' + icon('close') + '</button></div><p class="ms-h2">' + it.title + '</p>' + body);
    void self;
  };
  Phone.prototype.player = function (it) {
    var a = ACTIVITIES[it.x], self = this, chips = { voice: true, music: true, pad: true };
    this.full('<div class="ms-navbar"><h4>' + a.title + '</h4><button type="button" data-act="close" aria-label="Close">' + icon('close') + '</button></div><div class="ms-player"><p class="ms-goal">To feel ' + (it.goal || 'refreshed') + '</p><p class="ms-player-desc">' + a.desc + '</p><div class="ms-orb"><div class="ms-orb-ring"><div class="ms-orb-glow" data-glow></div><div class="ms-orb-core">' + mascot('calm') + '</div></div></div><p class="ms-phase" data-phase>Get ready</p><p class="ms-left" data-left>' + fmtLeft(a.dur) + ' left</p><div class="ms-pchips"><button type="button" data-act="pchip" data-arg="voice">' + icon('mic-outline') + 'Voice on</button><button type="button" data-act="pchip" data-arg="music">' + icon('musical-notes-outline') + 'Music on</button><button type="button" data-act="pchip" data-arg="pad">' + icon('musical-note-outline') + 'Warm pad</button></div></div>');
    this.chips = chips;
    var glow = this.q('[data-glow]'), phase = this.q('[data-phase]'), left = this.q('[data-left]'), i = 0, remaining = a.dur;
    var step = function () {
      if (!phase.isConnected) return;
      if (remaining <= 0) {
        phase.textContent = 'Nice work'; left.textContent = 'Done for now'; glow.style.transform = 'scale(.8)';
        var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'ms-btn'; btn.style.marginTop = '18px'; btn.textContent = 'Done'; btn.setAttribute('data-act', 'close');
        phase.parentNode.appendChild(btn); S.extraPoints += 1; return;
      }
      var s = a.steps[i % a.steps.length], secs = Math.min(s[1], remaining);
      phase.textContent = s[0];
      glow.style.transitionDuration = secs + 's';
      glow.style.transform = 'scale(' + (a.breath ? s[2] : (i % 2 ? 0.7 : 0.95)) + ')';
      var t0 = remaining;
      var count = setInterval(function () { if (!left.isConnected) return clearInterval(count); remaining = Math.max(0, remaining - 1); left.textContent = fmtLeft(remaining) + ' left'; if (t0 - remaining >= secs) clearInterval(count); }, 1000);
      self.timers.push(count);
      i++;
      self.timers.push(setTimeout(step, secs * 1000));
    };
    this.timers.push(setTimeout(step, 1500));
  };
  function fmtLeft(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  Phone.prototype.sound = function (it) {
    this.full('<div class="ms-navbar"><h4>' + it.title + '</h4><button type="button" data-act="close" aria-label="Close">' + icon('close') + '</button></div><div class="ms-player"><p class="ms-goal">Soundscape</p><p class="ms-player-desc">' + it.sub + ' · loops until you stop it</p><div class="ms-orb"><div><div class="ms-sound-art is-playing" data-art>' + it.emoji + '</div><button type="button" class="ms-play" data-act="playpause" aria-label="Pause">' + icon('pause-circle-outline') + '</button></div></div><p class="ms-left">This preview has no audio.</p></div>');
  };

  /* You */
  Phone.prototype.r_you = function () {
    var r = this.youRange, total = S.today.length + S.extraPoints, need = Math.max(0, 18 - total + 2), stage = need === 0 ? 3 : 2;
    var html = '<p class="ms-title">You</p><p class="ms-subtitle">' + { week: 'Your last 7 days', month: 'Your last 30 days', year: 'Your last 12 months' }[r] + '</p>';
    html += '<div class="ms-card"><div class="ms-growth">' + tree(stage) + '<div><small>Level ' + (stage + 1) + ' of 6</small><b>' + STAGES[stage][0] + '</b><p>' + STAGES[stage][1] + '</p></div></div><div class="ms-progress"><span style="width:' + (need === 0 ? 8 : Math.round((18 - need) / 18 * 100)) + '%"></span></div><p class="ms-progress-note">' + (need === 0 ? '30 more to Full Tree' : need + ' more to ' + STAGES[stage + 1][0]) + '</p><p class="ms-growth-copy">Your tree grows every day you check in, however the day felt. A few days in a row helps it grow a little faster.</p></div>';
    html += '<div class="ms-card"><p class="ms-h2">Mood Trend</p><div class="ms-range">' + [['week', 'Week'], ['month', 'Month'], ['year', 'Year']].map(function (b) { return '<button type="button" class="ms-btn' + (r === b[0] ? '' : ' ms-ghost') + '" data-act="range" data-arg="' + b[0] + '">' + b[1] + '</button>'; }).join('') + '</div>' + trendChart(r) + '</div>';
    html += '<div class="ms-card"><p class="ms-h2">Your Summary</p><p class="ms-subtitle" style="margin-top:4px">A quick look back at how your day or week has gone.</p><div class="ms-report-btns"><button type="button" class="ms-btn' + (this.report === 'daily' ? '' : ' ms-ghost') + '" data-act="report" data-arg="daily">Today</button><button type="button" class="ms-btn' + (this.report === 'weekly' ? '' : ' ms-ghost') + '" data-act="report" data-arg="weekly">This Week</button></div>' + (this.report ? '<p class="ms-report">' + summary(this.report) + '</p>' : '') + '</div>';
    html += '<div class="ms-card ms-rows">' + row({ act: 'toast', arg: 'Settings: data & privacy choices, AI on or off, Mood Check cadence.', icon: icon('settings-outline'), title: 'Settings', sub: 'Your data, privacy and preferences', right: icon('chevron-forward'), mutedRight: true }) + '</div>';
    this.view('you').innerHTML = html;
  };
  function tree(stage) {
    var C = { line: '#e9e1d4', amber: '#a9702c', p: '#8dbb9f', pd: '#4f8264', rose: '#a4527c' };
    var shapes = [{ t: 0, c: [] }, { t: 20, c: [], seed: 1 }, { t: 34, c: [[60, 62, 16]] }, { t: 44, c: [[60, 52, 18], [44, 62, 13], [76, 62, 13]] }, { t: 52, c: [[60, 44, 21], [40, 56, 15], [80, 56, 15], [49, 32, 12], [72, 32, 12]] }];
    var s = shapes[Math.min(stage, 4)], top = 104 - s.t, o = '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M24 104 Q60 94 96 104" stroke="' + C.line + '" stroke-width="3" stroke-linecap="round" fill="none"/>';
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
        cols.push('<div title="' + d.date.toDateString() + '">' + inner + '</div>'); labels.push(wd(d.date));
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
  function summary(kind) {
    if (kind === 'daily') {
      var t = S.today, first = t[0], last = t[t.length - 1], rs = [];
      t.forEach(function (e) { (e.reasons || []).forEach(function (x) { if (rs.indexOf(x) < 0) rs.push(x); }); });
      if (!t.length) return 'No check-ins yet today. One tap on Home is enough to start.';
      return 'You checked in ' + (t.length === 1 ? 'once' : t.length + ' times') + ' today' + (t.length > 1 ? ', starting ' + LABEL[first.mood].toLowerCase() + ' and most recently ' + LABEL[last.mood].toLowerCase() : ', feeling ' + LABEL[first.mood].toLowerCase()) + '.' + (rs.length ? ' ' + rs.map(function (x) { return REASON_LABEL[x]; }).join(' and ') + ' came up.' : '') + (UP[last.mood] ? ' Whatever helped today is worth keeping in tomorrow’s plan.' : ' A short walk or a few slow breaths could help the rest of the day land a little softer.');
    }
    var all = []; days(7).forEach(function (d) { all = all.concat(d.moods); });
    var up = all.filter(function (m) { return UP[m]; }).length, dm = dominant(all), checked = days(7).filter(function (d) { return d.moods.length; }).length;
    return 'You checked in on ' + checked + ' of the last 7 days, ' + all.length + ' times in all. ' + up + ' of those were up and ' + (all.length - up) + ' were down, with ' + LABEL[dm].toLowerCase() + ' showing up most. The middle of the week was the hardest stretch; the weekend gave you some room back.';
  }

  /* overlays */
  Phone.prototype.sheet = function (inner) { var l = this.q('[data-ms-layer]'); this.clearTimers(); l.innerHTML = '<div class="ms-scrim" data-act="close"></div><div class="ms-sheet" role="dialog">' + inner + '</div>'; l.hidden = false; };
  Phone.prototype.full = function (inner) { var l = this.q('[data-ms-layer]'); this.clearTimers(); l.innerHTML = '<div class="ms-full" role="dialog">' + inner + '</div>'; l.hidden = false; };
  Phone.prototype.clearTimers = function () { (this.timers || []).forEach(function (t) { clearTimeout(t); clearInterval(t); }); this.timers = []; };
  Phone.prototype.close = function () { this.clearTimers(); this.room = null; this.typing = false; var l = this.q('[data-ms-layer]'); if (l) { l.hidden = true; l.innerHTML = ''; } };
  Phone.prototype.reasonSheet = function (mood) {
    this.pending = []; var m = MOOD[mood];
    this.sheet('<span class="ms-pill" style="background:' + m.soft + ';color:' + m.deep + ';font-weight:700">' + LABEL[mood] + '</span><p class="ms-h2" style="margin-top:10px">What might be contributing to how you feel?</p><p class="ms-sheet-sub">Optional — pick any that apply.</p><div class="ms-tags">' + REASONS.map(function (r) { return '<button type="button" data-act="reason" data-arg="' + r[0] + '" aria-pressed="false">' + r[1] + '</button>'; }).join('') + '</div><button type="button" class="ms-btn" data-act="reasonsDone">Skip</button>');
    this.reasonMood = mood;
  };
  Phone.prototype.phq = function () { this.qi = 0; this.qa = []; this.full('<div class="ms-navbar"><h4>Mood Check</h4><button type="button" data-act="close" aria-label="Close">' + icon('close') + '</button></div><div class="ms-full-body" data-phq></div>'); this.paintPhq(); };
  Phone.prototype.paintPhq = function () {
    var box = this.q('[data-phq]'); if (!box) return;
    if (this.qi >= 4) {
      box.innerHTML = '<p class="ms-title">Mood Check</p><p class="ms-subtitle">Result</p><div class="ms-card ms-done-card">' + mascot('good') + '<p class="ms-h2">Thanks for checking in</p><p class="ms-subtitle" style="margin-top:6px">Saved for this week. MoodSense uses it alongside your check-ins to notice when the weeks start to shift.</p></div><button type="button" class="ms-btn" style="margin-top:16px" data-act="close">Done</button>';
      S.phqDone = true; S.extraPoints += 1; renderAll(); return;
    }
    var cur = this.qa[this.qi];
    box.innerHTML = '<p class="ms-title">Mood Check</p><p class="ms-subtitle">Question ' + (this.qi + 1) + ' of 4</p><div class="ms-q-track"><span style="width:' + (this.qi / 4 * 100) + '%"></span></div><p class="ms-q-stem">' + PHQ_STEM + '</p><p class="ms-q">' + PHQ[this.qi] + '</p><div class="ms-opts">' + PHQ_OPTS.map(function (o, v) { return '<button type="button" class="ms-opt' + (cur === v ? ' is-on' : '') + '" data-act="ans" data-arg="' + v + '">' + o + '</button>'; }).join('') + '</div>' + (this.qi > 0 ? '<button type="button" class="ms-btn ms-ghost" style="margin-top:16px" data-act="qback">Back</button>' : '');
  };

  /* clicks */
  Phone.prototype.click = function (e) {
    var b = e.target.closest('[data-act],[data-ms-go]'); if (!b || !this.r.contains(b)) return;
    if (b.hasAttribute('data-ms-go')) return this.go(b.getAttribute('data-ms-go'));
    var act = b.getAttribute('data-act'), arg = b.getAttribute('data-arg'), self = this;
    switch (act) {
      case 'toast': return this.toast(arg);
      case 'close': return this.close();
      case 'mood': {
        var entry = { ts: Date.now(), mood: arg, reasons: [], fresh: true };
        S.today.push(entry); this.lastEntry = entry; this.flash = arg; this.dot = null;
        renderAll(this); this.render('home');
        var btn = this.view('home').querySelector('[data-arg="' + arg + '"].ms-face'); if (btn) btn.classList.add('is-on');
        this.timers = this.timers || [];
        setTimeout(function () { var x = self.view('home').querySelector('.ms-face.is-on'); if (x) x.classList.remove('is-on'); }, 450);
        return this.reasonSheet(arg);
      }
      case 'reason': {
        var on = b.getAttribute('aria-pressed') !== 'true', m = MOOD[this.reasonMood];
        b.setAttribute('aria-pressed', on); b.style.background = on ? m.soft : ''; b.style.color = on ? m.deep : ''; b.style.fontWeight = on ? '700' : ''; b.style.borderColor = on ? m.mid : '';
        if (on) this.pending.push(arg); else this.pending.splice(this.pending.indexOf(arg), 1);
        this.q('[data-act="reasonsDone"]').textContent = this.pending.length ? 'Done' : 'Skip';
        return;
      }
      case 'reasonsDone': if (this.lastEntry) this.lastEntry.reasons = this.pending.slice(); this.close(); if (this.pending.length) this.toast('Saved. Recharge has a few ideas for feeling ' + LABEL[this.reasonMood].toLowerCase() + '.'); return renderAll();
      case 'dot': this.dot = this.dot === +arg ? null : +arg; return this.render('home');
      case 'phq': return this.phq();
      case 'ans': this.qa[this.qi] = +arg; this.paintPhq(); setTimeout(function () { self.qi++; self.paintPhq(); }, 250); return;
      case 'qback': this.qi = Math.max(0, this.qi - 1); return this.paintPhq();
      case 'trend': this.trend = arg; return this.render('home');
      case 'join': S.joined[arg] = !S.joined[arg]; if (!S.joined[arg] && this.room === arg) this.close(); return renderAll();
      case 'leave': S.joined[arg] = false; this.close(); this.toast('You left the group.'); return renderAll();
      case 'chat': return this.openChat(arg);
      case 'filter': this.filter = arg; return this.render('community');
      case 'cat': this.cat = arg; return this.render('recharge');
      case 'item': return this.openItem(arg);
      case 'tried': this.close(); S.extraPoints += 1; this.toast('Nice. Small steps count.'); return renderAll();
      case 'saveReflect': { var ta = this.q('.ms-sheet textarea'); if (!ta.value.trim()) return this.toast('Write a few words first.'); this.close(); S.extraPoints += 1; this.toast('Saved only on this phone.'); return renderAll(); }
      case 'pchip': this.chips[arg] = !this.chips[arg]; b.classList.toggle('is-off', !this.chips[arg]); b.lastChild.textContent = { voice: 'Voice ', music: 'Music ', pad: 'Warm pad' }[arg] + (arg === 'pad' ? (this.chips[arg] ? '' : ' off') : (this.chips[arg] ? 'on' : 'off')); return;
      case 'playpause': { var art = this.q('[data-art]'), playing = art.classList.toggle('is-playing'); b.innerHTML = icon(playing ? 'pause-circle-outline' : 'play-circle-outline'); b.setAttribute('aria-label', playing ? 'Pause' : 'Play'); return; }
      case 'range': this.youRange = arg; return this.render('you');
      case 'report': this.report = arg; return this.render('you');
    }
  };

  var list = phones.map(function (p) { return new Phone(p); });
  function renderAll(except) { list.forEach(function (p) { if (p !== except) p.render(); }); }
})();
