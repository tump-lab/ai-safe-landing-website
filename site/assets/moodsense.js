/* MoodSense app preview for the Products page.
   A web copy of the MoodSense app's four tabs (Home, Community, Recharge, You) and the screens they open,
   up to two taps deep, filled with fake sample data held in this tab's memory only: nothing is sent or
   stored. Content mirrors the app's Lafayette, Indiana (Purdue) catalog. All four phones share one store,
   so a check-in on one phone shows up on the others. Links to phones, texts and websites only show a note. */
(function () {
  'use strict';
  var phones = [].slice.call(document.querySelectorAll('[data-ms-phone]'));
  if (!phones.length || !window.MS_ART) return;
  var ART = window.MS_ART;
  var me = document.currentScript || [].slice.call(document.scripts).filter(function (s) { return /moodsense\.js/.test(s.src); })[0];
  var LOGO = (me && me.src ? me.src.replace(/moodsense\.js.*$/, '') : '') + 'moodsense-logos/';

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
  var REASONS = [['sleep', 'Sleep'], ['work_study', 'Work or study'], ['people', 'People I care about'], ['body', 'How my body feels'], ['me_time', 'Time for myself'], ['other', 'Other']];
  var REASON_LABEL = {}; REASONS.forEach(function (r) { REASON_LABEL[r[0]] = r[1]; });
  var PHQ_STEM = 'Over the last 2 weeks, how often have you been bothered by the following problem?';
  var PHQ = ['Feeling nervous, anxious or on edge', 'Not being able to stop or control worrying', 'Little interest or pleasure in doing things', 'Feeling down, depressed or hopeless'];
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
    stressed: ['breathing', 'guided-relaxation', 'short-walk'],
    low: ['mood-lift', 'gratitude', 'contact-trusted'],
    tired: ['short-rest', 'calming-breath', 'stretching'],
    calm: ['mindfulness', 'reflection', 'light-exercise'],
    good: ['share-moment', 'keep-routine', 'gratitude'],
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
    ['wellbeing', 'Emotional Wellbeing Group', 'Everyday ups and downs, and what helps.', '🌱', 3015],
    ['work', 'Workplace Stress Zone', 'Deadlines, bosses and burnout, talked through with people who get it.', '💼', 2108],
    ['night', 'Late-Night Insomnia Support', 'For the nights sleep will not come. Company and gentle wind-down ideas.', '🌙', 1842],
    ['study', 'Study Pressure Support', 'Exams, grades and expectations. Study breaks welcome.', '📚', 2467],
    ['social', 'Social Anxiety Support', 'A low-pressure space to share small wins and hard moments.', '👥', 1296]
  ];
  // Mental Health America Wabash Valley Region support groups (the app's US catalog).
  var OFFICIAL = [
    ['adb', 'Anxiety / Depression / Bipolar Disorder', 'Share experiences and support each other.', '1st and 3rd Wednesday, 6:00-7:30 pm · Online', ''],
    ['party', 'Party Line', 'A welcoming space to connect, for adults 18 and older.', 'Weekly, Tuesdays, 5:00 pm · Online', ''],
    ['party2', 'Party Line 2.0', 'A welcoming space to connect, for adults 18 and older.', 'Weekly, Thursdays, 10:00-11:00 am · In Person', '914 South St., Lafayette, Indiana'],
    ['meridian', 'Meridian’s Recovery And Depression', 'Support for recovery and depression.', 'Weekly, Thursdays, 4:00-5:00 pm · In Person', '914 South St., Lafayette, Indiana'],
    ['sos', 'Survivors Of Suicide', 'For loved ones left behind.', '3rd Monday, 7:00-8:30 pm · In Person + Online', '914 South St., Lafayette, Indiana']
  ];
  var FIND = [
    { id: 'mhawv', name: 'Wabash Valley', line: 'Local programs & support', logo: 'mha.png', title: 'Mental Health America Wabash Valley Region', blurb: 'Peer navigators, support groups, youth programs and training, from the local Mental Health America in Lafayette, Indiana.', items: [
      ['Let’s Talk Peer Navigators', 'One-on-one support for navigating mental health and substance use services.', 'Lafayette, Indiana', 'Peer Support', 'Adults 18+, including those looking for care for a child', 1],
      ['Support Groups', 'A range of local support groups, with meeting times and locations.', 'Lafayette, Indiana and online', 'Groups'],
      ['Veteran Mental Health Resource Center', 'Crisis help, peer counseling, help with Veterans Affairs benefits, and finding a local provider.', 'Lafayette, Indiana', 'Peer Support', 'Veterans, active-duty service members and their families'],
      ['Question, Persuade, Refer Suicide Prevention Training', 'How to spot the warning signs of a suicide crisis and help.', 'Lafayette, Indiana', 'Training', '', 1],
      ['Youth Advisory Council', 'Represent your peers and plan mental wellness work in your county.', 'Lafayette, Indiana', 'Youth', 'Students, and adults who want to mentor'],
      ['Training & Education', 'Presentations, discussions and workshops on mental health topics.', 'Lafayette, Indiana', 'Training', 'Community groups, workplaces and schools']] },
    { id: 'caps', name: 'Purdue Counseling', line: 'For Purdue students', logo: 'purdue.png', title: 'Purdue Counseling And Psychological Services', blurb: 'Counseling and Psychological Services for Purdue students. Everything is free except psychiatry. 601 Stadium Mall Drive, Room 224.', items: [
      ['Individual Therapy', 'Free, brief counseling focused on your goals, with no set session limit.', 'West Lafayette, Indiana', 'Therapy', 'Purdue students', 1],
      ['Let’s Talk Drop-In', 'A confidential, informal drop-in chat with a clinician about a brief concern.', 'West Lafayette, Indiana', 'Drop-In', 'Purdue students'],
      ['Group Therapy', 'Students who share common concerns meet weekly through the semester. Free.', 'West Lafayette, Indiana', 'Groups', 'Purdue students'],
      ['Uwill Teletherapy', 'Free therapy with a licensed counselor you choose.', 'Online', 'Therapy', 'Purdue students: online, West Lafayette and Indianapolis'],
      ['Skills Workshops', 'Anxiety Toolbox, Wellness and Resilience, The Art of Self-Care, and Beyond Small Talk.', 'West Lafayette, Indiana and online', 'Workshops', 'All Purdue students'],
      ['After-Hours Crisis Line', 'Call 765-494-6995 and press 1, weekday evenings and all weekend.', 'West Lafayette, Indiana', 'Crisis', 'Purdue students', 1]] },
    { id: 'check', name: 'Free Check-Up', line: 'Private online tests', logo: 'mha.png', title: 'Free Mental Health Check-Up', blurb: 'Free, confidential online tests from Mental Health America. Afterwards you get information and tools based on your answers.', items: [
      ['Universal Mental Health Screening', 'Covers 12+ common conditions in 5-10 minutes.', 'Online', 'Screening'],
      ['Depression Test', 'For overwhelming sadness or despair, low energy, or a negative self-image.', 'Online', 'Screening'],
      ['Anxiety Test', 'For extreme worry or fear that affects day-to-day life.', 'Online', 'Screening'],
      ['Social Anxiety Test', 'For extreme worry or fear in social situations.', 'Online', 'Screening'],
      ['Youth Mental Health Test', 'A check-in made for young people.', 'Online', 'Screening', 'Ages 11-17']] },
    { id: 'ctl', name: 'Crisis Text Line', line: 'Text HOME to 741741', logo: 'ctl.png', title: 'Crisis Text Line', blurb: 'Free, 24/7 support from a live, trained volunteer crisis counselor. Message and data rates may apply.', items: [
      ['Text HOME To 741741', 'Reach a crisis counselor by text, any time.', 'National', 'Text', '', 2],
      ['Chat Online', 'The same support through a web chat.', 'National', 'Online'],
      ['En Español', 'Text HOLA to 741741 for support in Spanish.', 'National', 'Text', '', 2]] },
    { id: 'help', name: 'Getting Help', line: 'Where to start', logo: 'mha.png', title: 'Getting Mental Health Help', blurb: 'Guides from Mental Health America on what kinds of help exist and how to start.', items: [
      ['Find a therapist', 'How to find a therapist who fits.', 'Online', 'Guide'],
      ['Types of mental health professionals', 'Who does what, so you know who to look for.', 'Online', 'Guide'],
      ['Find a support group', 'What support groups are and how to find one.', 'Online', 'Guide'],
      ['31 tips to boost your mental health', 'Small things to try, one for each day of the month.', 'Online', 'Guide']] },
    { id: 'helpline', name: 'Find A Helpline', line: 'Helplines in your country', logo: 'findahelpline.png', title: 'Find A Helpline', blurb: 'A directory of free, confidential helplines in your country.', items: [
      ['Helplines In The United States', 'Free, confidential helplines, searchable by topic.', 'National', 'Directory']] }
  ];
  var CRISIS = [
    ['988 Suicide & Crisis Lifeline', 'Call or text 988, any time, day or night.', 'Call 988', 'Text 988'],
    ['Crisis Text Line', 'Text HOME to 741741, any time.', '', 'Text 741741'],
    ['Purdue After-Hours Crisis Line', 'Call 765-494-6995 and press 1, weekday evenings and all weekend.', 'Call', ''],
    ['Find A Warmline', 'Talk with someone who has been there, when it is not a crisis.', '', '', 'Website'],
    ['Emergency', 'If you are in immediate danger, call 911.', 'Call 911', '']
  ];
  var CHAT = {
    night: [['Hopeful Fern', '@Guide any ideas for Sunday-night anxiety?', '12:26 PM'], ['g', 'That’s a really common one, Hopeful Fern. Steady Cedar’s Monday plan is a great example, and a short wind-down away from screens can help too. What has helped others here?', '12:27 PM'], ['Steady Cedar', 'Writing tomorrow’s first task on paper before bed. Then my brain lets it go.', '12:31 PM']],
    work: [['g', 'This is a space to vent and swap small fixes. No advice unless someone asks for it.', '12:10 PM'], ['Quiet River', 'Back-to-back meetings again. A five-minute walk between two of them helped.', '12:14 PM'], ['Brave Maple', 'Stealing that idea.', '12:15 PM']],
    study: [['g', 'Exam week! Share one thing you finished today, however small.', '4:30 PM'], ['Calm Harbor', 'Finished one practice set. Taking a break now.', '4:41 PM'], ['Bright Willow', 'Still on chapter 4 but I started, which counts.', '4:44 PM']],
    social: [['g', 'Small wins count here. What felt a little easier this week?', '7:00 PM'], ['Gentle Lark', 'Said hi to a neighbor first. Tiny, but I did it.', '7:06 PM']],
    wellbeing: [['g', 'How has today been, in one word?', '6:00 PM'], ['Warm Pebble', 'Steady.', '6:03 PM'], ['Sunny Moss', 'Busy, but okay.', '6:05 PM']]
  };
  var GUIDE_REPLIES = ['Thank you for sharing that. You are not the only one here who has felt it.', 'That sounds like a lot to carry. What is one small thing that might help tonight?', 'Noticing it is already a step. Anyone else want to share what has helped them?'];
  var RISK = /\b(kill myself|suicide|suicidal|end it all|end my life|want to die|hurt myself|self[- ]harm|no reason to live)\b/i;
  var CITIES = ['Lafayette, Indiana, United States', 'West Lafayette, Indiana, United States', 'Indianapolis, Indiana, United States', 'Chicago, Illinois, United States', 'Mountain View, California, United States'];
  var STAGES = [['Seed', 'Planted. Every check-in gives it a little water.'], ['Sprout', 'It is up. A handful of days of checking in did that.'], ['Sapling', 'Taking root — you have been coming back to it.'], ['Young Tree', 'Steady enough to take a rough week without noticing.'], ['Full Tree', 'Settled, with plenty of lighter days in the mix.'], ['In Blossom', 'You have been showing up for a while now, and it shows.']];

  /* ---------- fake data ---------- */
  var seed = 914;
  function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
  function pickMood(weights) { var r = rnd(), a = 0; for (var i = 0; i < 5; i++) { a += weights[i]; if (r < a) return MOODS[i]; } return 'calm'; }
  function dayStart(offset) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - offset); return d; }
  var history = [];
  for (var off = 365; off >= 1; off--) {
    var dd = dayStart(off), wk = dd.getDay(), weekend = wk === 0 || wk === 6;
    var w = weekend ? [0.34, 0.32, 0.1, 0.1, 0.14] : [0.27, 0.2, 0.25, 0.12, 0.16];
    var n = rnd() < 0.06 ? 0 : 1 + Math.floor(rnd() * 3), list = [];
    for (var j = 0; j < n; j++) list.push(pickMood(w));
    history.push({ date: dd, moods: list });
  }
  var lastWeek = [['calm', 'tired'], ['good', 'calm'], ['stressed', 'tired', 'calm'], ['calm', 'good', 'good'], ['good', 'calm', 'tired'], ['low', 'stressed', 'calm']];
  for (var k = 0; k < 6; k++) history[history.length - 6 + k].moods = lastWeek[k];
  function at(h, m) { var d = new Date(); d.setHours(h, m, 0, 0); return d.getTime(); }
  var S = {
    today: [{ ts: at(8, 30), mood: 'good', reasons: ['people', 'me_time'] }, { ts: at(13, 15), mood: 'calm', reasons: ['sleep'] }],
    joined: { night: true, wellbeing: true, adb: true }, rooms: {}, created: [], city: CITIES[0], phq: null,
    prefs: { motion: true, screen: true, health: true, sleep: true, apps: true, calls: false, ai: true, daily: false }
  };
  function latest() { return S.today.length ? S.today[S.today.length - 1] : null; }
  function todayMoods() { return S.today.map(function (e) { return e.mood; }); }

  /* ---------- helpers ---------- */
  function icon(name) { var d = ART.icons[name]; return d ? '<svg class="ms-ico" viewBox="0 0 512 512" aria-hidden="true"><path d="' + d + '"/></svg>' : ''; }
  function mascot(mood) { return '<svg viewBox="0 0 64 64" aria-hidden="true">' + ART.mascots[mood] + '</svg>'; }
  function logo(file, size) { return '<img src="' + LOGO + file + '" alt="" width="' + (size || 28) + '" height="' + (size || 28) + '" style="border-radius:8px;display:block;flex-shrink:0">'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function time(ts) { return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
  function avgLevel(moods) { if (!moods.length) return null; var t = 0; moods.forEach(function (m) { t += LEVEL[m]; }); return t / moods.length; }
  function dominant(moods) { var c = {}, best = null; moods.forEach(function (m) { c[m] = (c[m] || 0) + 1; if (!best || c[m] > c[best]) best = m; }); return best; }
  function days(n) {
    var out = history.slice(-(n - 1)).map(function (h) { return { date: h.date, moods: h.moods }; });
    out.push({ date: dayStart(0), moods: todayMoods(), today: true });
    return out;
  }
  function wd(d) { return d.toLocaleDateString('en-US', { weekday: 'short' }); }
  function members(n) { return n.toLocaleString('en-US') + ' members'; }
  function row(o) {
    var open = o.act ? 'button type="button" data-act="' + o.act + '"' + (o.arg != null ? ' data-arg="' + esc(o.arg) + '"' : '') : 'div';
    return '<' + open + ' class="ms-row">' + (o.icon != null ? '<span class="ms-tile' + (o.soft ? ' ms-soft' : '') + '"' + (o.bg ? ' style="background:' + o.bg + ';color:' + (o.fg || 'inherit') + '"' : '') + '>' + o.icon + '</span>' : '') + '<span class="ms-rt"><b>' + o.title + '</b>' + (o.sub ? '<small>' + o.sub + '</small>' : '') + '</span>' + (o.right != null ? '<span class="ms-right' + (o.mutedRight ? ' ms-muted' : '') + '">' + o.right + '</span>' : '') + '</' + (o.act ? 'button' : 'div') + '>';
  }
  function cityCounts() {
    var c = { calm: 22, good: 31, stressed: 27, low: 12, tired: 9 };
    todayMoods().forEach(function (m) { c[m]++; });
    return c;
  }
  function countList() { var c = cityCounts(); return MOODS.map(function (m) { return c[m]; }); }
  function fmtLeft(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function groupName(id) {
    var g = PEER.filter(function (p) { return p[0] === id; })[0] || OFFICIAL.filter(function (p) { return p[0] === id; })[0];
    if (g) return g[1];
    var c = S.created.filter(function (x) { return x.id === id; })[0]; return c ? esc(c.name) : 'Group chat';
  }

  /* ---------- one phone ---------- */
  function Phone(root) {
    this.r = root; this.tab = root.getAttribute('data-ms-start') || 'home';
    this.trend = 'two'; this.youRange = 'week'; this.cat = 'for-you'; this.filter = 'all'; this.dot = null; this.report = null; this.visible = false;
    this.stack = []; this.timers = [];
    var body = root.querySelector('.ms-body');
    this.layer = document.createElement('div'); this.layer.className = 'ms-layer'; this.layer.hidden = true; body.appendChild(this.layer);
    this.toastEl = document.createElement('p'); this.toastEl.className = 'ms-toast'; this.toastEl.setAttribute('role', 'status'); this.toastEl.setAttribute('aria-live', 'polite'); body.appendChild(this.toastEl);
    var self = this;
    this.r.addEventListener('click', function (e) { self.click(e); });
    this.r.addEventListener('submit', function (e) { e.preventDefault(); self.submit(e.target); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; self.spin(); }, { threshold: 0.1 }).observe(root);
    this.go(this.tab, true);
  }
  Phone.prototype.q = function (s) { return this.r.querySelector(s); };
  Phone.prototype.view = function (t) { return this.q('[data-ms-view="' + t + '"]'); };
  Phone.prototype.go = function (tab, first) {
    this.tab = tab; this.closeAll();
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
    var t = this.toastEl; t.textContent = msg; t.classList.add('is-on');
    clearTimeout(this.tt); this.tt = setTimeout(function () { t.classList.remove('is-on'); }, 2800);
  };
  Phone.prototype.external = function (what) { this.toast(what + ' — opens outside the app.'); };

  /* ----- overlays: a stack of screens, plus a sheet on top ----- */
  Phone.prototype.clearTimers = function () { this.timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); this.timers = []; };
  Phone.prototype.push = function (name, arg, title, modal) { this.clearTimers(); this.stack.push({ name: name, arg: arg, title: title, modal: modal }); this.paint(); };
  Phone.prototype.pop = function () { this.clearTimers(); this.stack.pop(); this.room = null; this.paint(true); };
  Phone.prototype.closeAll = function () { this.clearTimers(); this.stack = []; this.room = null; if (this.layer) { this.layer.hidden = true; this.layer.innerHTML = ''; } };
  Phone.prototype.paint = function (still) {
    var top = this.stack[this.stack.length - 1];
    if (!top) { this.layer.hidden = true; this.layer.innerHTML = ''; return; }
    var back = this.stack.length > 1 || !top.modal;
    var head = top.title == null ? '<div class="ms-navbar" style="background:var(--bg);border:0"><h4></h4><button type="button" data-act="closeAll" aria-label="Close">' + icon('close') + '</button></div>'
      : '<div class="ms-navbar">' + (back ? '<button type="button" data-act="back" aria-label="Back">' + icon('arrow-back') + '</button>' : '') + '<h4>' + top.title + '</h4>' + (back ? '' : '<button type="button" data-act="closeAll" aria-label="Close">' + icon('close') + '</button>') + '</div>';
    this.layer.innerHTML = '<div class="ms-full" role="dialog"' + (still ? ' style="animation:none"' : '') + '>' + head + '<div class="ms-slot" style="flex:1;display:flex;flex-direction:column;min-height:0"></div></div>';
    this.layer.hidden = false;
    this['s_' + top.name](this.layer.querySelector('.ms-slot'), top.arg);
  };
  Phone.prototype.refresh = function () {
    var top = this.stack[this.stack.length - 1], slot = this.layer.querySelector('.ms-slot');
    if (!top || !slot) return this.paint();
    var y = slot.firstElementChild ? slot.firstElementChild.scrollTop : 0;
    this['s_' + top.name](slot, top.arg);
    if (slot.firstElementChild) slot.firstElementChild.scrollTop = y;
  };
  Phone.prototype.sheet = function (inner) {
    this.closeSheet();
    var wrap = document.createElement('div'); wrap.className = 'ms-sheet-wrap'; wrap.style.cssText = 'position:absolute;inset:0;z-index:7';
    wrap.innerHTML = '<div class="ms-scrim" data-act="closeSheet"></div><div class="ms-sheet" role="dialog">' + inner + '</div>';
    this.layer.hidden = false; this.layer.appendChild(wrap);
  };
  Phone.prototype.closeSheet = function () { var w = this.layer.querySelector('.ms-sheet-wrap'); if (w) w.remove(); if (!this.stack.length) this.layer.hidden = true; };

  /* ================= Home ================= */
  Phone.prototype.r_home = function () {
    var now = new Date(), h = now.getHours(), self = this;
    var html = '<p class="ms-title">' + (h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening') + '</p><p class="ms-subtitle">' + now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + '</p>';
    html += '<div class="ms-card"><p class="ms-h2">How Are You Feeling Right Now?</p><div class="ms-faces">' + MOODS.map(function (m) { return '<button type="button" class="ms-face' + (self.flash === m ? ' is-on' : '') + '" data-act="mood" data-arg="' + m + '" aria-label="' + LABEL[m] + '">' + mascot(m) + '<span>' + LABEL[m] + '</span></button>'; }).join('') + '</div>';
    var sel = S.today.filter(function (e) { return e.ts === self.dot; })[0];
    html += '<div class="ms-today"><div class="ms-today-head"><b>Today</b><span>' + (sel ? time(sel.ts) + ' · ' + LABEL[sel.mood] : 'Tap a dot to see it') + '</span></div><div class="ms-dots">' + S.today.map(function (e) { return '<button type="button" data-act="dot" data-arg="' + e.ts + '" class="' + (e.ts === self.dot ? 'is-on ' : '') + (e.fresh ? 'is-new' : '') + '" style="background:' + MOOD[e.mood].mid + '" aria-label="' + time(e.ts) + ', ' + LABEL[e.mood] + '"></button>'; }).join('') + '</div></div></div>';
    html += '<div class="ms-card ms-rows">' + (S.phq
      ? row({ act: 'phq', icon: '📋', bg: 'var(--primary-soft)', title: 'Mood Check Done This Week ✓', sub: 'Take it again any time your day has changed', right: '<span class="ms-pill" style="background:var(--primary-soft);color:var(--primary-deep)">Retake</span>' })
      : row({ act: 'phq', icon: '📋', title: 'Mood Check For This Week', sub: '4 questions · under a minute', right: '<span class="ms-pill">Start</span>' })) + '</div>';
    html += '<div class="ms-sec"><span>Your Community</span><button type="button" class="ms-link" data-act="choose">Change</button></div><p class="ms-community-label">' + S.city + '</p>';
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
    var rh = lv.map(function (v, i) { var a = 0, c = 0; for (var k = Math.max(0, i - 2); k <= Math.min(lv.length - 1, i + 2); k++) if (lv[k] != null) { a += lv[k]; c++; } return c ? a / c : 0.6; });
    var guess = (rh[rh.length - 1] * 0.6 + rh[rh.length - 2] * 0.4) * 0.9 + 0.08;
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="margin-top:8px" aria-label="How you said you felt each day, with your daily rhythm and a forecast for tomorrow">';
    [top, (top + bottom) / 2, bottom].forEach(function (gy) { svg += '<line x1="' + left + '" x2="' + plotR + '" y1="' + gy + '" y2="' + gy + '" stroke="#d9d0c2" stroke-width="1" stroke-dasharray="1 5" stroke-linecap="round"/>'; });
    svg += '<rect x="' + (right - nextW) + '" y="2" width="' + nextW + '" height="' + (bottom + 12) + '" rx="6" fill="#ece9f3"/>';
    svg += '<text x="4" y="' + (top + 4) + '" font-size="10" font-weight="700" fill="#6f6559" letter-spacing=".5">HIGH</text><text x="4" y="' + ((top + bottom) / 2 + 4) + '" font-size="10" font-weight="700" fill="#a2978a" letter-spacing=".5">OKAY</text><text x="9" y="' + (bottom + 4) + '" font-size="10" font-weight="700" fill="#6f6559" letter-spacing=".5">LOW</text>';
    svg += '<path d="M' + xs.map(function (x, i) { return x.toFixed(1) + ' ' + y(rh[i]).toFixed(1); }).join(' L') + ' L' + nx + ' ' + y(guess).toFixed(1) + '" fill="none" stroke="#5a5fb0" stroke-width="1.8" stroke-dasharray="5 4" stroke-linejoin="round" opacity=".9"/>';
    var path = '', pen = false;
    lv.forEach(function (v, i) { if (v == null) { pen = false; return; } path += (pen ? 'L' : 'M') + xs[i].toFixed(1) + ' ' + y(v).toFixed(1); pen = true; });
    svg += '<path d="' + path + '" fill="none" stroke="#3f7d63" stroke-width="2" stroke-linejoin="round"/>';
    lv.forEach(function (v, i) { if (v != null) svg += '<circle cx="' + xs[i] + '" cy="' + y(v) + '" r="' + (n > 14 ? 2.2 : 3) + '" fill="#3f7d63"/>'; });
    svg += '<circle cx="' + nx + '" cy="' + y(guess) + '" r="6" fill="#fffdf8" stroke="#5a5fb0" stroke-width="2.5"/>';
    svg += '<rect x="' + (right - 70) + '" y="4" width="68" height="18" rx="9" fill="#5a5fb0"/><text x="' + (right - 36) + '" y="17" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">Forecast</text>';
    ds.forEach(function (d, i) {
      var label = d.today ? 'Now' : n === 7 ? wd(d.date) : n === 14 ? (i % 2 === 1 ? wd(d.date).charAt(0) : '') : (i % 7 === 1 ? String(d.date.getDate()) : '');
      if (label) svg += '<text x="' + xs[i] + '" y="' + (bottom + 26) + '" text-anchor="middle" font-size="11" ' + (d.today ? 'font-weight="700" fill="#3a322b"' : 'fill="#a2978a"') + '>' + label + '</text>';
    });
    svg += '<text x="' + nx + '" y="' + (bottom + 26) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#5a5fb0">Next</text></svg>';
    var t = this.trend;
    return '<div class="ms-card"><div class="ms-trend-head">' + mascot('good') + '<div><p class="ms-h2">How You Have Been</p><small>Tomorrow might feel a little lighter. — Hedgie</small></div></div>' +
      '<div class="ms-chips">' + [['week', 'Week'], ['two', '2 Weeks'], ['month', 'Month']].map(function (c) { return '<button type="button" class="ms-chip' + (t === c[0] ? ' is-on' : '') + '" data-act="trend" data-arg="' + c[0] + '">' + c[1] + '</button>'; }).join('') + '</div>' + svg +
      '<div class="ms-legend"><span><i></i>How You Said You Felt</span><span><i class="dash"></i>Your Daily Rhythm</span></div><p class="ms-foot">A forecast for tomorrow, from your own check-ins and daily rhythm</p></div>';
  };
  Phone.prototype.bindPlanet = function () {
    var slot = this.view('home').querySelector('[data-planet-slot]');
    if (!slot || !window.MSPlanet) return;
    if (!this.planetEl) {
      this.planetEl = document.createElement('div'); this.planetEl.className = 'ms-planet'; this.planetEl.setAttribute('role', 'img');
      this.planet = window.MSPlanet.mount(this.planetEl, countList);
    }
    var c = cityCounts();
    this.planetEl.setAttribute('aria-label', 'One planet with a continent for each mood in your community today: ' + MOODS.map(function (m) { return c[m] + ' ' + LABEL[m].toLowerCase(); }).join(', ') + '. You are the moon.');
    slot.replaceWith(this.planetEl);
    this.spin();
  };
  Phone.prototype.spin = function () { if (this.planet) { this.planet.setVisible(this.visible && this.tab === 'home'); this.planet.draw(); } };

  // Depth 1: the reason sheet after a check-in. Depth 2: picking reasons, then Done.
  Phone.prototype.reasonSheet = function (entry) {
    var m = MOOD[entry.mood];
    this.pending = []; this.reasonEntry = entry;
    this.sheet('<div class="ms-sheet-top"><span class="ms-pill" style="background:' + m.soft + ';color:' + m.deep + ';font-weight:700">' + LABEL[entry.mood] + '</span><button type="button" class="ms-x" data-act="closeSheet" aria-label="Close">' + icon('close') + '</button></div><p class="ms-h2" style="margin-top:10px">' + (UP[entry.mood] ? 'What made you feel good today?' : 'What might be contributing to how you feel?') + '</p><p class="ms-sheet-sub">Optional — pick any that apply.</p><div class="ms-tags">' + REASONS.map(function (r) { return '<button type="button" data-act="reason" data-arg="' + r[0] + '" aria-pressed="false">' + r[1] + '</button>'; }).join('') + '</div><button type="button" class="ms-btn" data-act="reasonsDone">Skip</button>');
  };
  // Depth 1: Mood Check questions. Depth 2: the result.
  Phone.prototype.s_phq = function (box) {
    if (this.qi >= 4) {
      var total = this.qa.reduce(function (a, b) { return a + b; }, 0), anx = this.qa[0] + this.qa[1], dep = this.qa[2] + this.qa[3];
      var band = total <= 2 ? 'None to minimal' : total <= 5 ? 'Mild' : total <= 8 ? 'Moderate' : 'Severe';
      S.phq = { total: total };
      box.innerHTML = '<div class="ms-full-body"><p class="ms-title">Mood Check</p><p class="ms-subtitle">Result</p><div class="ms-card"><p class="ms-subtitle" style="margin:0">These two weeks</p><p class="ms-result">' + band + '</p><div style="margin-top:8px"><div class="ms-sub-row">Anxiety<span>' + (anx >= 3 ? 'Worth keeping an eye on' : 'Within the usual range') + '</span></div><div class="ms-sub-row">Depression<span>' + (dep >= 3 ? 'Worth keeping an eye on' : 'Within the usual range') + '</span></div></div></div><p class="ms-foot" style="margin-top:12px">A short check-in, not a diagnosis. If things feel heavy, talking to someone can help.</p>' + (total >= 6 ? '<button type="button" class="ms-btn ms-ghost" style="margin-top:12px" data-act="openHelp" data-arg="crisis">Find a local helpline</button>' : '') + '<button type="button" class="ms-btn" style="margin-top:12px" data-act="closeAll">Done</button></div>';
      renderAll(); return;
    }
    var cur = this.qa[this.qi];
    box.innerHTML = '<div class="ms-full-body"><p class="ms-title">Mood Check</p><p class="ms-subtitle">Question ' + (this.qi + 1) + ' of 4</p><div class="ms-q-track"><span data-progress style="width:' + ((this.prevQ != null ? this.prevQ : this.qi) / 4 * 100) + '%"></span></div><p class="ms-q-stem">' + PHQ_STEM + '</p><p class="ms-q">' + PHQ[this.qi] + '</p><div class="ms-opts">' + PHQ_OPTS.map(function (o, v) { return '<button type="button" class="ms-opt' + (cur === v ? ' is-on' : '') + '" data-act="ans" data-arg="' + v + '">' + o + '</button>'; }).join('') + '</div>' + (this.qi > 0 ? '<button type="button" class="ms-btn ms-ghost" style="margin-top:16px" data-act="qback">Back</button>' : '') + '</div>';
    var bar = box.querySelector('[data-progress]'), qi = this.qi; this.prevQ = qi;
    requestAnimationFrame(function () { requestAnimationFrame(function () { bar.style.width = (qi / 4 * 100) + '%'; }); });
  };
  // Depth 1: Choose your community. Depth 2: choosing a city by hand.
  Phone.prototype.s_choose = function (box) {
    box.innerHTML = '<div class="ms-full-body"><p class="ms-intro">Choose your community</p><div class="ms-card ms-rows" style="margin-top:0">' + row({ act: 'pickCity', arg: 0, icon: icon('people'), soft: true, title: CITIES[0], sub: 'Based on your connection', right: S.city === CITIES[0] ? icon('checkmark') : icon('chevron-forward') }) + '</div><button type="button" class="ms-btn ms-ghost" style="margin-top:16px" data-act="chooseManual">Choose manually</button></div>';
  };
  Phone.prototype.s_chooseManual = function (box) {
    box.innerHTML = '<div class="ms-full-body"><p class="ms-intro">Choose your city</p><div class="ms-card" style="margin-top:0;padding-top:0;padding-bottom:0">' + CITIES.map(function (c, i) { return '<button type="button" class="ms-choice" data-act="pickCity" data-arg="' + i + '">' + c + (S.city === c ? '<i>' + icon('checkmark') + '</i>' : '') + '</button>'; }).join('') + '<button type="button" class="ms-choice" data-act="toast" data-arg="Other countries and cities are listed in the full app.">Other country<i>' + icon('chevron-forward') + '</i></button></div><p class="ms-foot" style="margin-top:10px">Only the city is used, to group anonymous check-ins. No position on the planet stands for a real place.</p></div>';
  };

  /* ================= Community ================= */
  Phone.prototype.r_community = function () {
    var self = this;
    var html = '<p class="ms-title">Community</p><div class="ms-sec"><span>Peer Communities</span><button type="button" class="ms-link" data-act="create">' + icon('add') + 'Create A Community</button></div><p class="ms-sub-line">Connect with people going through similar things.</p>';
    html += S.created.map(function (c) { return self.groupCard(c.id, esc(c.name), esc(c.desc || 'A community you started.'), '<span class="ms-gicon">✨</span>', '<span class="ms-created">Created by you · saved on this phone only</span>', true); }).join('');
    html += PEER.map(function (p) { return self.groupCard(p[0], p[1], p[2], '<span class="ms-gicon">' + p[3] + '</span>', members(p[4] + (S.joined[p[0]] ? 1 : 0)), true); }).join('');
    html += '<div class="ms-sec"><span>Official Communities</span></div><p class="ms-sub-line">Trusted organizations and support services near you.</p><div class="ms-filter"><button type="button" data-act="filter" data-arg="mine" class="' + (this.filter === 'mine' ? 'is-on' : '') + '">My Groups</button><button type="button" data-act="filter" data-arg="all" class="' + (this.filter === 'all' ? 'is-on' : '') + '">All Groups</button></div>';
    var list = OFFICIAL.filter(function (o) { return self.filter === 'all' || S.joined[o[0]]; });
    if (!list.length) html += '<div class="ms-card"><p class="ms-sub-line" style="text-align:center">Groups you join will show up here.</p></div>';
    html += list.map(function (o) { return self.groupCard(o[0], o[1], o[2], '<span class="ms-gicon ms-logo" style="overflow:hidden;background:#fff">' + logo('mha.png', 44) + '</span>', o[3] + (o[4] ? '<br>' + o[4] : ''), false); }).join('');
    html += '<div class="ms-card ms-rows">' + row({ act: 'ext', arg: 'Calling Mental Health America Wabash Valley Region', title: 'Call Mental Health America Wabash Valley Region', sub: 'Ask about a group, or one you do not see here.', right: icon('call-outline') }) + row({ act: 'ext', arg: 'The current group list on their website', title: 'Meeting Links And Details', sub: 'The current list on their website.', right: icon('open-outline') }) + '</div>';
    html += '<p class="ms-more">More Ways To Find A Group</p><div class="ms-card ms-rows">' + row({ act: 'ext', arg: 'National Alliance On Mental Illness support groups', title: 'National Alliance On Mental Illness Support Groups', sub: 'Free, peer-led groups for people living with a mental health condition.', right: icon('open-outline') }) + row({ act: 'ext', arg: 'Local Mental Health America affiliates', title: 'Find A Local Mental Health America Group', sub: 'Local Mental Health America affiliates run support groups and referrals.', right: icon('open-outline') }) + row({ act: 'ext', arg: 'Youth peer support lines', title: 'Youth Peer Support', sub: 'Free, anonymous call and text lines led by peers, for young people.', right: icon('open-outline') }) + '</div>';
    this.view('community').innerHTML = html;
  };
  Phone.prototype.groupCard = function (id, name, desc, iconHtml, meta, peer) {
    var j = !!S.joined[id];
    var act = j ? '<button type="button" class="ms-join is-joined" data-act="join" data-arg="' + id + '">' + icon('checkmark') + 'Joined</button><button type="button" class="ms-join" data-act="' + (peer ? 'chat' : 'officialChat') + '" data-arg="' + id + '">' + icon('chatbubble-outline') + 'Chat</button>' : '<button type="button" class="ms-join" data-act="join" data-arg="' + id + '">Join</button>';
    return '<div class="ms-card ms-group" style="margin-top:12px">' + iconHtml + '<div class="ms-gbody"><b>' + name + '</b><p>' + desc + '</p>' + (meta ? '<small>' + meta + '</small>' : '') + '</div><div class="ms-gact">' + act + '</div></div>';
  };
  // Depth 1: the group room. Depth 2: sending a message (Guide answers @Guide; a worrying message brings up the safety card).
  Phone.prototype.s_room = function (box, id) {
    if (!S.rooms[id]) S.rooms[id] = (CHAT[id] || [['g', 'Welcome! Say hello, and mention @Guide any time you want a thought from the AI member.', time(Date.now())]]).slice();
    var peer = PEER.filter(function (p) { return p[0] === id; })[0];
    box.innerHTML = '<div class="ms-members"><div class="ms-member"><span class="ms-avatar" style="background:var(--surface2)">🌠</span><span><b>Kind Comet</b><small>You</small></span></div><div class="ms-member"><span class="ms-avatar" style="background:var(--indigo-soft);color:var(--indigo)">' + icon('sparkles') + '</span><span><b>Guide</b><small>Artificial Intelligence</small></span></div><div class="ms-member"><span class="ms-avatar" style="background:var(--surface)">' + icon('people') + '</span><span><b>Members</b><small>' + (peer ? peer[4].toLocaleString('en-US') : '1') + '</small></span></div></div><div class="ms-msgs" data-msgs></div><form class="ms-composer"><button type="button" class="ms-guidechip" data-act="askGuide">' + icon('sparkles') + 'Guide</button><input type="text" maxlength="300" placeholder="Message the group" aria-label="Message"><button type="submit" class="ms-send" aria-label="Send">' + icon('arrow-up') + '</button></form>';
    this.room = id; this.paintMsgs();
    var nav = this.layer.querySelector('.ms-navbar'); if (nav) nav.insertAdjacentHTML('beforeend', '<button type="button" class="ms-leave" data-act="leave" data-arg="' + id + '">Leave</button>');
  };
  Phone.prototype.paintMsgs = function () {
    var box = this.layer.querySelector('[data-msgs]'); if (!box) return;
    box.innerHTML = S.rooms[this.room].map(function (m) {
      var who = m[0], cls = who === 'g' ? ' is-guide' : who === 'me' ? ' is-mine' : '';
      return '<div class="ms-bubble-row' + cls + '">' + (who === 'me' ? '' : '<span class="ms-bname">' + (who === 'g' ? icon('sparkles') + 'Guide · Artificial Intelligence' : esc(who)) + '</span>') + '<div class="ms-bubble">' + esc(m[1]) + '</div><span class="ms-btime">' + m[2] + '</span></div>';
    }).join('') + (this.typing ? '<p class="ms-typing">Guide is typing…</p>' : '');
    box.scrollTop = box.scrollHeight;
  };
  Phone.prototype.send = function (form) {
    var inp = form.querySelector('input'), v = inp.value.trim(), id = this.room, self = this; if (!v) return;
    var log = S.rooms[id]; log.push(['me', v, time(Date.now())]); inp.value = '';
    if (RISK.test(v)) { this.paintMsgs(); return this.safetySheet(); }
    if (!/@guide/i.test(v)) { this.paintMsgs(); return this.timers.push(setTimeout(function () { log.push(['Steady Cedar', 'Thanks for sharing. Same here some nights.', time(Date.now())]); if (self.room === id) self.paintMsgs(); }, 1600)); }
    this.typing = true; this.paintMsgs();
    this.timers.push(setTimeout(function () { log.push(['g', GUIDE_REPLIES[log.length % GUIDE_REPLIES.length], time(Date.now())]); self.typing = false; if (self.room === id) self.paintMsgs(); }, 1400));
  };
  Phone.prototype.safetySheet = function () {
    this.sheet('<p class="ms-h2" style="font-size:20px">You deserve support right now</p><p class="ms-sheet-body" style="margin-bottom:10px">What you shared matters, and thoughts like these are worth talking through with someone trained to help. You can reach a crisis counselor right now, any time of day.</p><p class="ms-sheet-body" style="margin:0 0 6px">You can call or text 988 anytime (United States).</p><p class="ms-note">Only you can see this.</p><div style="display:flex;gap:10px"><button type="button" class="ms-btn" style="background:var(--rose);color:#fff" data-act="ext" data-arg="Calling 988">Call 988</button><button type="button" class="ms-btn" style="background:transparent;color:var(--rose);border:1.5px solid var(--rose)" data-act="ext" data-arg="Texting 988">Text 988</button></div><button type="button" class="ms-link" style="display:block;margin:14px auto 0;color:var(--ink2)!important;font-weight:500;font-size:14px" data-act="closeSheet">Back to the group</button>');
  };
  // Depth 1: the Create sheet. Depth 2: Create adds the community.
  Phone.prototype.createSheet = function () {
    this.sheet('<div class="ms-sheet-top"><p class="ms-h2">Create A Community</p><button type="button" class="ms-x" data-act="closeSheet" aria-label="Close">' + icon('close') + '</button></div><form data-form="create"><input class="ms-field" name="name" maxlength="40" placeholder="Community name" aria-label="Community name"><input class="ms-field" name="desc" maxlength="90" placeholder="Short description (optional)" aria-label="Short description"><p class="ms-note" style="margin-top:8px">For now your community is saved on this phone only.</p><button type="submit" class="ms-btn">Create</button></form>');
  };

  /* ================= Recharge ================= */
  Phone.prototype.r_recharge = function () {
    var cat = this.cat, l = latest();
    var html = '<p class="ms-title">Recharge</p><div class="ms-tabs" role="tablist">' + CATS.map(function (c) { return '<button type="button" role="tab" aria-selected="' + (cat === c[0]) + '" class="' + (cat === c[0] ? 'is-on' : '') + '" data-act="cat" data-arg="' + c[0] + '">' + c[1] + '</button>'; }).join('') + '</div>';
    var items;
    if (cat === 'for-you') {
      html += l ? '<p class="ms-because" style="flex-wrap:wrap">Because you are feeling <span class="ms-pill" style="background:' + MOOD[l.mood].soft + ';color:' + MOOD[l.mood].deep + '">' + LABEL[l.mood] + '</span>' + (l.reasons || []).map(function (r) { return '<span class="ms-pill">' + REASON_LABEL[r] + '</span>'; }).join('') + '</p>' : '<p class="ms-because">Check in on Home and these will match how you feel.</p>';
      items = FOR_YOU[l ? l.mood : 'none'].map(function (id) { return ITEM[id]; });
    } else items = ITEMS.filter(function (i) { return i.cat === cat; });
    html += '<div class="ms-card ms-rows"' + (cat === 'for-you' ? '' : ' style="margin-top:12px"') + '>' + items.map(function (i) { return row({ act: 'item', arg: i.id, icon: i.emoji, soft: true, title: i.title, sub: i.sub, right: icon(ACTION_ICON[i.kind]) }); }).join('') + '</div>';
    html += '<div class="ms-sec"><span>Get Support</span></div>';
    html += '<div class="ms-card ms-rows" style="margin-top:0">' + row({ act: 'openHelp', arg: 'find', icon: icon('search-outline'), bg: 'var(--indigo-soft)', fg: 'var(--indigo)', title: 'Find Resources', sub: 'Local mental health services, programs, and tools', right: icon('chevron-forward'), mutedRight: true }) + '</div>';
    html += '<div class="ms-card ms-rows">' + row({ act: 'openHelp', arg: 'talk', icon: icon('chatbubble-ellipses-outline'), bg: 'var(--violet-soft)', fg: 'var(--violet)', title: 'Talk To Mental Health America', sub: 'Message, call, or video chat with staff', right: icon('chevron-forward'), mutedRight: true }) + '</div>';
    html += '<div class="ms-card ms-rows">' + row({ act: 'openHelp', arg: 'crisis', icon: icon('warning-outline'), bg: 'var(--rose-soft)', fg: 'var(--rose)', title: 'Crisis Support', sub: 'Immediate help: 988 Suicide & Crisis Lifeline', right: icon('chevron-forward'), mutedRight: true }) + '</div>';
    this.view('recharge').innerHTML = html;
  };
  Phone.prototype.openItem = function (id) {
    var it = ITEM[id];
    if (it.kind === 'activity') return this.push('player', id, ACTIVITIES[it.x].title, true);
    if (it.kind === 'sound') return this.push('sound', id, it.title, true);
    if (it.kind === 'game') return this.push('game', id, it.title, true);
    if (it.kind === 'video') return this.external(it.title + ' on YouTube');
    var body = it.kind === 'tip' ? '<p class="ms-sheet-body">' + esc(it.x) + '</p><button type="button" class="ms-btn" data-act="tried">I’ll Try It</button>'
      : '<p class="ms-sheet-body">' + esc(it.x) + '</p><textarea aria-label="Write here" placeholder="Write here" maxlength="1000"></textarea><p class="ms-note">Saved only on this phone.</p><button type="button" class="ms-btn" data-act="saveReflect">Save</button>';
    this.sheet('<div class="ms-sheet-top"><span class="ms-emoji">' + it.emoji + '</span><button type="button" class="ms-x" data-act="closeSheet" aria-label="Close">' + icon('close') + '</button></div><p class="ms-h2">' + it.title + '</p>' + body);
  };
  // Depth 1: the activity player. Depth 2: voice/music toggles, then Done.
  Phone.prototype.s_player = function (box, id) {
    var it = ITEM[id], a = ACTIVITIES[it.x], self = this;
    this.chips = { voice: true, music: true, pad: true };
    box.innerHTML = '<div class="ms-player"><p class="ms-goal">To feel ' + (it.goal || 'refreshed') + '</p><p class="ms-player-desc">' + a.desc + '</p><div class="ms-orb"><div class="ms-orb-ring"><div class="ms-orb-glow" data-glow></div><div class="ms-orb-core">' + mascot('calm') + '</div></div></div><p class="ms-phase" data-phase>Get ready</p><p class="ms-left" data-left>' + fmtLeft(a.dur) + ' left</p><div class="ms-pchips"><button type="button" data-act="pchip" data-arg="voice">' + icon('mic-outline') + '<span>Voice on</span></button><button type="button" data-act="pchip" data-arg="music">' + icon('musical-notes-outline') + '<span>Music on</span></button><button type="button" data-act="pchip" data-arg="pad">' + icon('musical-note-outline') + '<span>Warm pad</span></button></div></div>';
    var glow = box.querySelector('[data-glow]'), phase = box.querySelector('[data-phase]'), left = box.querySelector('[data-left]'), i = 0, remaining = a.dur;
    var step = function () {
      if (!phase.isConnected) return;
      if (remaining <= 0) {
        phase.textContent = 'Nice work'; left.textContent = 'Done for now'; glow.style.transform = 'scale(.8)';
        phase.parentNode.insertAdjacentHTML('beforeend', '<button type="button" class="ms-btn" style="margin-top:18px" data-act="closeAll">Done</button>'); return;
      }
      var s = a.steps[i % a.steps.length], secs = Math.min(s[1], remaining);
      phase.textContent = s[0]; glow.style.transitionDuration = secs + 's'; glow.style.transform = 'scale(' + (a.breath ? s[2] : (i % 2 ? 0.7 : 0.95)) + ')';
      var t0 = remaining;
      var count = setInterval(function () { if (!left.isConnected) return clearInterval(count); remaining = Math.max(0, remaining - 1); left.textContent = fmtLeft(remaining) + ' left'; if (t0 - remaining >= secs) clearInterval(count); }, 1000);
      self.timers.push(count); i++; self.timers.push(setTimeout(step, secs * 1000));
    };
    this.timers.push(setTimeout(step, 1500));
  };
  // Depth 1: the sound player. Depth 2: play / pause.
  Phone.prototype.s_sound = function (box, id) {
    var it = ITEM[id];
    box.innerHTML = '<div class="ms-player"><p class="ms-goal">Soundscape</p><p class="ms-player-desc">' + it.sub + ' · loops until you stop it</p><div class="ms-orb"><div><div class="ms-sound-art is-playing" data-art>' + it.emoji + '</div><button type="button" class="ms-play" data-act="playpause" aria-label="Pause">' + icon('pause-circle-outline') + '</button></div></div><p class="ms-left">This preview has no audio.</p></div>';
  };
  // Depth 1: the game. Depth 2: popping bubbles.
  Phone.prototype.s_game = function (box, id) {
    var it = ITEM[id], self = this, popped = 0;
    box.innerHTML = '<div class="ms-player" style="padding-bottom:12px"><p class="ms-goal">' + it.sub + '</p><p class="ms-player-desc">Tap a bubble to pop it. There is no score to keep.</p><div class="ms-bubbles" data-field></div><p class="ms-left" data-popped>Take your time.</p></div>';
    var field = box.querySelector('[data-field]'), out = box.querySelector('[data-popped]'), colors = ['#9ccbb0', '#f0d27a', '#f2b592', '#adb6de', '#c9b8d8'];
    var spawn = function () {
      if (!field.isConnected) return;
      var b = document.createElement('button'), size = 34 + Math.random() * 30; b.type = 'button'; b.className = 'ms-bubble-dot'; b.setAttribute('aria-label', 'Bubble');
      b.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (10 + Math.random() * 75) + '%;bottom:-70px;--c:' + colors[Math.floor(Math.random() * 5)] + ';animation-duration:' + (6 + Math.random() * 4) + 's';
      b.addEventListener('click', function () { if (b.classList.contains('is-pop')) return; b.classList.add('is-pop'); popped++; out.textContent = popped === 1 ? 'Pop.' : popped + ' popped. Breathe out with each one.'; setTimeout(function () { b.remove(); }, 260); });
      b.addEventListener('animationend', function (e) { if (e.animationName === 'msFloat') b.remove(); });
      field.appendChild(b); self.timers.push(setTimeout(spawn, 700 + Math.random() * 600));
    };
    spawn();
  };
  // Depth 1: Find Resources / Talk To / Crisis Support. Depth 2: a resource's offerings, or an action.
  Phone.prototype.s_help = function (box, section) {
    if (section === 'find') {
      box.innerHTML = '<div class="ms-full-body"><div class="ms-tiles">' + FIND.map(function (f, i) { return '<button type="button" class="ms-tile-card" data-act="resource" data-arg="' + i + '"><span class="ms-tile-ico" style="background:#fff;border:.5px solid var(--line);overflow:hidden">' + logo(f.logo, 36) + '</span><b>' + f.name + '</b><small>' + f.line + '</small></button>'; }).join('') + '</div></div>';
    } else if (section === 'talk') {
      box.innerHTML = '<div class="ms-full-body"><div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">' + logo('mha.png', 48) + '<p class="ms-intro" style="margin:0">Get support, ask questions, or learn about programs.</p></div><div class="ms-card ms-rows" style="margin-top:0">' + row({ act: 'ext', arg: 'Calling Mental Health America Wabash Valley Region (765-742-1800)', icon: icon('call-outline'), bg: 'var(--primary-soft)', fg: 'var(--primary-deep)', title: 'Call', sub: 'Call the Mental Health America office', right: icon('chevron-forward'), mutedRight: true }) + row({ act: 'ext', arg: 'Texting Mental Health America', icon: icon('chatbubble-outline'), bg: 'var(--indigo-soft)', fg: 'var(--indigo)', title: 'Message', sub: 'Send a text message', right: icon('chevron-forward'), mutedRight: true }) + row({ act: 'ext', arg: 'Video chat with Mental Health America staff', icon: icon('people-outline'), bg: 'var(--violet-soft)', fg: 'var(--violet)', title: 'Video Chat', sub: 'Talk with a staff member', right: icon('chevron-forward'), mutedRight: true }) + '</div><div class="ms-card" style="margin-top:12px"><p class="ms-res-title">Let’s Talk Peer Navigators</p><p class="ms-res-blurb">Certified peer support professionals help you set goals, understand insurance, schedule appointments and connect to local resources, in person or by phone.</p><p class="ms-fact"><b>Location:</b> Lafayette, Indiana</p></div></div>';
    } else {
      box.innerHTML = '<div class="ms-full-body"><p class="ms-intro">If you are in danger or thinking about ending your life, reach out now.</p>' + CRISIS.map(function (c) { return '<div class="ms-card" style="margin-top:10px"><p class="ms-res-title">' + c[0] + '</p><p class="ms-res-blurb">' + c[1] + '</p><div class="ms-actions">' + (c[2] ? '<button type="button" data-act="ext" data-arg="' + esc(c[2] === 'Call' ? 'Calling ' + c[0] : c[2]) + '">' + icon('call-outline') + c[2] + '</button>' : '') + (c[3] ? '<button type="button" data-act="ext" data-arg="' + c[3] + '">' + icon('chatbubble-outline') + c[3] + '</button>' : '') + (c[4] ? '<button type="button" data-act="ext" data-arg="' + esc(c[0]) + ' website">' + icon('open-outline') + c[4] + '</button>' : '') + '</div></div>'; }).join('') + '</div>';
    }
  };
  Phone.prototype.s_resource = function (box, i) {
    var f = FIND[i];
    box.innerHTML = '<div class="ms-full-body"><div style="display:flex;gap:12px;align-items:center">' + logo(f.logo, 48) + '<p class="ms-res-blurb" style="margin:0">' + f.blurb + '</p></div>' + f.items.map(function (it) {
      return '<div class="ms-card"><p class="ms-res-title">' + it[0] + '</p><p class="ms-res-blurb">' + it[1] + '</p>' + (it[2] ? '<p class="ms-fact"><b>Location:</b> ' + it[2] + '</p>' : '') + (it[3] ? '<p class="ms-fact"><b>Service Type:</b> ' + it[3] + '</p>' : '') + (it[4] ? '<p class="ms-fact"><b>For:</b> ' + it[4] + '</p>' : '') + '<div class="ms-actions">' + (it[5] === 1 ? '<button type="button" data-act="ext" data-arg="Calling ' + esc(f.title) + '">' + icon('call-outline') + 'Call</button>' : '') + (it[5] === 2 ? '<button type="button" data-act="ext" data-arg="Texting 741741">' + icon('chatbubble-outline') + 'Text</button>' : '') + '<button type="button" data-act="ext" data-arg="' + esc(it[0]) + ' page">' + icon('open-outline') + 'Learn More</button></div></div>';
    }).join('') + '</div>';
  };

  /* ================= You ================= */
  Phone.prototype.r_you = function () {
    var r = this.youRange, need = Math.max(3, 18 - S.today.length);
    var html = '<p class="ms-title">You</p><p class="ms-subtitle">' + { week: 'Your last 7 days', month: 'Your last 30 days', year: 'Your last 12 months' }[r] + '</p>';
    html += '<div class="ms-card"><div class="ms-growth">' + tree(2) + '<div><small>Level 3 of 6</small><b>' + STAGES[2][0] + '</b><p>' + STAGES[2][1] + '</p></div></div><div class="ms-progress"><span style="width:' + Math.round((18 - need) / 18 * 100) + '%"></span></div><p class="ms-progress-note">' + need + ' more to ' + STAGES[3][0] + '</p><p class="ms-growth-copy">Your tree grows every day you check in, however the day felt. A few days in a row helps it grow a little faster.</p></div>';
    html += '<div class="ms-card"><p class="ms-h2">Mood Trend</p><div class="ms-range">' + [['week', 'Week'], ['month', 'Month'], ['year', 'Year']].map(function (b) { return '<button type="button" class="ms-btn' + (r === b[0] ? '' : ' ms-ghost') + '" data-act="range" data-arg="' + b[0] + '">' + b[1] + '</button>'; }).join('') + '</div>' + trendChart(r) + '</div>';
    html += '<div class="ms-card"><p class="ms-h2">Your Summary</p><p class="ms-subtitle" style="margin-top:4px">A quick look back at how your day or week has gone.</p><div class="ms-report-btns"><button type="button" class="ms-btn' + (this.report === 'daily' ? '' : ' ms-ghost') + '" data-act="report" data-arg="daily">Today</button><button type="button" class="ms-btn' + (this.report === 'weekly' ? '' : ' ms-ghost') + '" data-act="report" data-arg="weekly">This Week</button></div>' + (this.report ? '<p class="ms-report">' + summary(this.report) + '</p>' : '') + '</div>';
    html += '<div class="ms-card ms-rows">' + row({ act: 'settings', icon: '⚙️', title: 'Settings', right: icon('chevron-forward'), mutedRight: true }) + '</div>';
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
  // Depth 1: Settings. Depth 2: its switches, and Terms & privacy.
  Phone.prototype.s_settings = function (box) {
    var P = S.prefs;
    function sw(key, ic, title) { return '<button type="button" class="ms-row" data-act="pref" data-arg="' + key + '"><span class="ms-tile">' + ic + '</span><span class="ms-rt"><b>' + title + '</b></span><span class="ms-switch' + (P[key] ? ' is-on' : '') + '" role="switch" aria-checked="' + P[key] + '"></span></button>'; }
    box.innerHTML = '<div class="ms-full-body"><p class="ms-group-h">Data & privacy</p><div class="ms-card ms-rows" style="margin-top:0">' + sw('motion', '📱', 'Motion & activity') + sw('screen', '🔓', 'Screen & usage') + sw('health', '❤️', 'Health data') + sw('sleep', '🌙', 'Sleep tracking') + sw('apps', '📊', 'App usage stats') + sw('calls', '📞', 'Call length') + '</div><p class="ms-group-h">Preferences</p><div class="ms-card ms-rows" style="margin-top:0">' + sw('ai', '✨', 'Use Artificial Intelligence') + sw('daily', '📋', 'Mood Check every day') + '</div><p class="ms-group-h">About</p><div class="ms-card ms-rows" style="margin-top:0">' + row({ act: 'terms', icon: '📄', title: 'Terms & privacy', right: icon('chevron-forward'), mutedRight: true }) + '</div><p class="ms-group-h">Delete account or data</p><div class="ms-card ms-rows" style="margin-top:0">' + row({ act: 'toast', arg: 'Deleting is turned off in this preview.', icon: '🗑️', title: 'Delete my data', sub: 'Check-ins, chats and sensing data. Your account stays.' }) + row({ act: 'toast', arg: 'Deleting is turned off in this preview.', icon: '⚠️', title: 'Delete my account', sub: 'Your account and all of your data.' }) + '</div></div>';
  };
  Phone.prototype.s_terms = function (box) {
    box.innerHTML = '<div class="ms-full-body ms-legal"><h4>What MoodSense collects</h4><p>Your check-ins, Mood Check answers and, only for the streams you turn on, everyday signals such as steps, screen use and sleep. You can turn any stream off at any time in Settings.</p><h4>How it is used</h4><p>To show you your own patterns, suggest small steps that fit how you feel, and group anonymous check-ins by city. No position on the community planet stands for a real place.</p><h4>Your choices</h4><p>You can delete your data or your whole account from Settings. MoodSense is a research app for reflection and support, not a diagnostic tool or an emergency service.</p></div>';
  };

  /* ================= clicks ================= */
  Phone.prototype.click = function (e) {
    var b = e.target.closest('[data-act],[data-ms-go]'); if (!b || !this.r.contains(b)) return;
    if (b.hasAttribute('data-ms-go')) return this.go(b.getAttribute('data-ms-go'));
    var act = b.getAttribute('data-act'), arg = b.getAttribute('data-arg'), self = this;
    switch (act) {
      case 'back': return this.pop();
      case 'closeAll': return this.closeAll();
      case 'closeSheet': return this.closeSheet();
      case 'toast': return this.toast(arg);
      case 'ext': return this.external(arg);
      case 'mood': {
        var entry = { ts: Date.now(), mood: arg, reasons: [], fresh: true };
        S.today.push(entry); this.flash = arg; this.dot = null;
        renderAll(this); this.render('home');
        setTimeout(function () { var x = self.view('home').querySelector('.ms-face.is-on'); if (x) x.classList.remove('is-on'); }, 450);
        return this.reasonSheet(entry);
      }
      case 'reason': {
        var on = b.getAttribute('aria-pressed') !== 'true', m = MOOD[this.reasonEntry.mood];
        b.setAttribute('aria-pressed', on); b.style.background = on ? m.soft : ''; b.style.color = on ? m.deep : ''; b.style.fontWeight = on ? '700' : ''; b.style.borderColor = on ? m.mid : '';
        if (on) this.pending.push(arg); else this.pending.splice(this.pending.indexOf(arg), 1);
        this.layer.querySelector('[data-act="reasonsDone"]').textContent = this.pending.length ? 'Done' : 'Skip';
        return;
      }
      case 'reasonsDone': this.reasonEntry.reasons = this.pending.slice(); this.closeSheet(); return renderAll();
      case 'dot': this.dot = this.dot === +arg ? null : +arg; return this.render('home');
      case 'trend': this.trend = arg; return this.render('home');
      case 'phq': this.qi = 0; this.qa = []; this.answering = false; this.prevQ = null; return this.push('phq', null, null, true);
      case 'ans': if (this.answering) return; this.answering = true; this.qa[this.qi] = +arg; b.classList.add('is-on'); this.timers.push(setTimeout(function () { self.answering = false; self.qi++; self.refresh(); }, 250)); return;
      case 'qback': this.qi = Math.max(0, this.qi - 1); return this.refresh();
      case 'choose': return this.push('choose', null, 'Choose Your Community', true);
      case 'chooseManual': return this.push('chooseManual', null, 'Choose Your Community');
      case 'pickCity': S.city = CITIES[+arg]; this.closeAll(); this.toast('Your community is now ' + S.city.split(',')[0] + '.'); return renderAll();
      case 'join': S.joined[arg] = !S.joined[arg]; return renderAll();
      case 'chat': return this.push('room', arg, groupName(arg));
      case 'officialChat': return this.external('This group meets ' + (OFFICIAL.filter(function (o) { return o[0] === arg; })[0] || ['', '', '', 'on its own schedule'])[3].split(' · ')[0] + '. Details on the organizer’s site');
      case 'leave': S.joined[arg] = false; this.closeAll(); this.toast('You left the group.'); return renderAll();
      case 'askGuide': { var inp = this.layer.querySelector('.ms-composer input'); if (inp && !/@guide/i.test(inp.value)) inp.value = '@Guide ' + inp.value; if (inp) inp.focus(); return; }
      case 'create': return this.createSheet();
      case 'filter': this.filter = arg; return this.render('community');
      case 'cat': this.cat = arg; return this.render('recharge');
      case 'item': return this.openItem(arg);
      case 'tried': this.closeSheet(); return this.toast('Nice. Small steps count.');
      case 'saveReflect': { var ta = this.layer.querySelector('.ms-sheet textarea'); if (!ta.value.trim()) return this.toast('Write a few words first.'); this.closeSheet(); return this.toast('Saved only on this phone.'); }
      case 'pchip': this.chips[arg] = !this.chips[arg]; b.classList.toggle('is-off', !this.chips[arg]); b.querySelector('span').textContent = arg === 'pad' ? (this.chips[arg] ? 'Warm pad' : 'Warm pad off') : ({ voice: 'Voice ', music: 'Music ' }[arg] + (this.chips[arg] ? 'on' : 'off')); return;
      case 'playpause': { var art = this.layer.querySelector('[data-art]'), playing = art.classList.toggle('is-playing'); b.innerHTML = icon(playing ? 'pause-circle-outline' : 'play-circle-outline'); b.setAttribute('aria-label', playing ? 'Pause' : 'Play'); return; }
      case 'openHelp': return this.push('help', arg, { find: 'Find Resources', talk: 'Talk To Mental Health America', crisis: 'Crisis Support' }[arg]);
      case 'resource': return this.push('resource', +arg, FIND[+arg].name);
      case 'range': this.youRange = arg; return this.render('you');
      case 'report': this.report = arg; return this.render('you');
      case 'settings': return this.push('settings', null, 'Settings');
      case 'pref': { S.prefs[arg] = !S.prefs[arg]; var sw = b.querySelector('.ms-switch'); sw.classList.toggle('is-on', S.prefs[arg]); sw.setAttribute('aria-checked', S.prefs[arg]); return; }
      case 'terms': return this.push('terms', null, 'Terms & privacy');
    }
  };
  Phone.prototype.submit = function (form) {
    if (form.classList.contains('ms-composer')) return this.send(form);
    if (form.getAttribute('data-form') === 'create') {
      var name = form.elements.name.value.trim(); if (!name) return this.toast('Give your community a name first.');
      var id = 'mine' + Date.now(); S.created.unshift({ id: id, name: name, desc: form.elements.desc.value.trim() }); S.joined[id] = true;
      this.closeSheet(); this.toast('Created. It’s at the top of Peer Communities.'); return renderAll();
    }
  };

  var list = phones.map(function (p) { return new Phone(p); });
  function renderAll(except) { list.forEach(function (p) { if (p !== except) p.render(); }); }
})();
