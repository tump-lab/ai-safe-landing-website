'use strict';
// Navigation stays native; JavaScript only enhances menus and concept interactions.
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const productToggle = document.querySelector('#product-toggle');
const productMenu = document.querySelector('#product-menu');
function closeProducts() {
  productMenu.hidden = true;
  productToggle.setAttribute('aria-expanded', 'false');
}
function closeNavigation() {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.innerHTML = 'Menu <span aria-hidden="true">+</span>';
  closeProducts();
}
menuToggle.addEventListener('click', () => {
  const open = !mainNav.classList.contains('open');
  mainNav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.innerHTML = open ? 'Close <span aria-hidden="true">−</span>' : 'Menu <span aria-hidden="true">+</span>';
  if (!open) closeProducts();
});
productToggle.addEventListener('click', () => {
  const open = productMenu.hidden;
  productMenu.hidden = !open;
  productToggle.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', event => {
  if (!event.target.closest('.dropdown')) closeProducts();
  if (!event.target.closest('.site-header')) closeNavigation();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!productMenu.hidden) { closeProducts(); productToggle.focus(); }
  else if (mainNav.classList.contains('open')) { closeNavigation(); menuToggle.focus(); }
});
document.addEventListener('focusin', event => {
  if (!event.target.closest('.dropdown')) closeProducts();
});
window.matchMedia('(min-width:1051px)').addEventListener('change', closeNavigation);

// This concept interaction uses ephemeral DOM state only; no health data is stored.
const reflectionPrompts = {
  'Low': 'What would you like to make a little more space for today?',
  'A little low': 'What is one small thing you would like to reflect on?',
  'Okay': 'What’s one thing you noticed about your day?',
  'Good': 'What felt good today that you would like to remember?',
  'Great': 'What made today feel meaningful to you?'
};
document.querySelectorAll('.mood').forEach(button => {
  button.addEventListener('click', () => {
    const app = button.closest('.concept-app');
    app.querySelectorAll('.mood').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    app.querySelector('.reflection-text').textContent = reflectionPrompts[button.dataset.mood];
  });
});

// Prepare an inquiry locally. There is deliberately no submission endpoint.
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const topic = new URLSearchParams(location.search).get('topic');
  const select = contactForm.elements.topic;
  if ([...select.options].some(option => option.value === topic)) select.value = topic;
  let draft = '';
  const feedback = document.querySelector('#form-feedback');
  const preview = document.querySelector('#draft-preview');
  contactForm.addEventListener('input', () => {
    preview.hidden = true;
    feedback.textContent = '';
    draft = '';
  });
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const values = new FormData(contactForm);
    if (!String(values.get('name')).trim() || String(values.get('message')).trim().length < 20) {
      feedback.textContent = 'Please enter your name and a message of at least 20 non-space characters.';
      return;
    }
    draft = `Subject: ${values.get('topic')} inquiry — AI SafeLanding\n\nName: ${String(values.get('name')).trim()}\nEmail: ${values.get('email')}\n${values.get('organization') ? `Organization: ${String(values.get('organization')).trim()}\n` : ''}\n${String(values.get('message')).trim()}`;
    document.querySelector('#draft-text').textContent = draft;
    preview.hidden = false;
    feedback.textContent = 'Draft prepared. Nothing has been sent. You can copy or download your inquiry.';
  });
  document.querySelector('#copy-draft').addEventListener('click', async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      feedback.textContent = 'Draft copied. Nothing has been sent.';
    } catch {
      feedback.textContent = 'Clipboard access is unavailable. Select the draft text to copy it, or download the file.';
    }
  });
  document.querySelector('#download-draft').addEventListener('click', () => {
    if (!draft) return;
    const url = URL.createObjectURL(new Blob([draft], {type: 'text/plain;charset=utf-8'}));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'AI-SafeLanding-Inquiry.txt';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    feedback.textContent = 'Draft download requested. Nothing has been sent.';
  });
}

// An original scientific process diagram: many research possibilities converge
// through a considered development layer, then open into application fields and further exploration.
const canvas = document.querySelector('#research-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, frame = 0, visible = true;
  const nodes = Array.from({length: 88}, (_, i) => {
    const angle = i * 2.399963;
    const radius = Math.sqrt((i + .5) / 88);
    return {x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: Math.sin(i * 1.91), size: i % 7 === 0 ? 2 : 1};
  });
  function ellipse(x, y, rx, ry, color, lineWidth = 1) {
    ctx.beginPath();ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);ctx.strokeStyle = color;ctx.lineWidth = lineWidth;ctx.stroke();
  }
  let art;
  function readArtTheme() {
    const styles = getComputedStyle(document.documentElement);
    const token = name => styles.getPropertyValue(name).trim();
    art = {node: token('--art-node'), secondary: token('--art-secondary'), third: token('--art-third'), plate: token('--art-plate')};
    art.rgb = art.node.slice(1).match(/.{2}/g).map(value => parseInt(value, 16)).join(',');
  }
  readArtTheme();
  function draw(time = 0) {
    ctx.clearRect(0, 0, width, height);
    const sx = width / 540, sy = height / 450;
    ctx.save();ctx.scale(sx, sy);
    const phase = reducedMotion.matches ? 0 : time * .00015;
    const compact = window.matchMedia("(max-width: 600px)").matches;
    const centerX = 270, centerY = 210;
    // Quiet registration marks and field lines keep the visualization scientific.
    ctx.strokeStyle = art.third+'1a';ctx.lineWidth = .7;
    for (let x = 40; !compact && x < 540; x += 40) {
      for (let y = 40; y < 440; y += 40) {
        ctx.beginPath();ctx.moveTo(x-2,y);ctx.lineTo(x+2,y);ctx.moveTo(x,y-2);ctx.lineTo(x,y+2);ctx.stroke();
      }
    }
    ctx.setLineDash([]);ctx.strokeStyle=art.node+'2a';
    ctx.beginPath();ctx.moveTo(centerX,58);ctx.lineTo(centerX,404);ctx.stroke();ctx.setLineDash([]);
    const displayedNodes = compact ? nodes.filter((_, i) => i % 3 === 0) : nodes;
    const plotted = displayedNodes.map((node, i) => ({
      x: centerX + node.x * 187,
      y: 104 + node.y * 46 + node.z * 14 + Math.sin(phase + i * .7) * 3,
      node
    }));
    plotted.forEach((p, i) => {
      for (let j=i+1; j<plotted.length; j++) {
        const q=plotted[j],distance=Math.hypot(p.x-q.x,(p.y-q.y)*1.7);
        if (distance < (compact ? 92 : 58)) {
          ctx.strokeStyle=`rgba(${art.rgb},${.36*(1-distance/(compact ? 100 : 65))})`;
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
        }
      }
      ctx.fillStyle = i % 8 === 0 ? art.node : art.node+'bb';
      ctx.beginPath();ctx.arc(p.x,p.y,p.node.size,0,Math.PI*2);ctx.fill();
      if (i % (compact ? 6 : 9) === 0) {
        ctx.strokeStyle=art.node+'4a';ctx.beginPath();ctx.moveTo(p.x,p.y+3);
        ctx.bezierCurveTo(p.x,p.y+35,centerX+(p.x-centerX)*.4,180,centerX+(p.x-centerX)*.4,192);ctx.stroke();
      }
    });
    // Translucent elliptical development layers.
    for(let i=0;i<(compact ? 3 : 5);i++) {
      const y=centerY+10+i*9;
      ellipse(centerX,y,118,34,art.node+(i===0?'c0':'58'));
    }
    ctx.beginPath();ctx.ellipse(centerX,centerY,118,34,0,0,Math.PI*2);
    ctx.fillStyle=art.plate;ctx.fill();ctx.strokeStyle=art.node;ctx.lineWidth=1;ctx.stroke();
    ellipse(centerX,centerY,106,27,art.node+'30');
    // Three solid branches, one per application domain: health, education, finance.
    const targets=[
      {x:110,y:354,c:art.node},
      {x:270,y:367,c:art.secondary},
      {x:430,y:354,c:art.third}
    ];
    targets.forEach((p,i)=>{
      const startX=centerX+(i-1)*52;
      ctx.save();
      ctx.setLineDash([]);
      ctx.beginPath();ctx.moveTo(startX,253);
      ctx.bezierCurveTo(startX,292,p.x,292,p.x,p.y-20);
      ctx.strokeStyle=p.c+'a0';ctx.lineWidth=1.2;ctx.stroke();
      ellipse(p.x,p.y,44,18,p.c+'bb');ellipse(p.x,p.y+8,44,18,p.c+'65');
      ctx.setLineDash([]);
      if(p.exploring) {
        ctx.beginPath();ctx.moveTo(p.x-5,p.y);ctx.lineTo(p.x+5,p.y);
        ctx.moveTo(p.x,p.y-5);ctx.lineTo(p.x,p.y+5);
        ctx.strokeStyle=p.c;ctx.lineWidth=1.7;ctx.stroke();
      } else {
        ctx.beginPath();ctx.ellipse(p.x,p.y,35,13,0,0,Math.PI*2);ctx.fillStyle=p.c+'0b';ctx.fill();
        ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle=p.c;ctx.fill();
        ellipse(p.x,p.y,9,4,p.c+'60');
      }
      // Every branch carries a moving particle.
      const t=(phase*.6+i/3)%1;
      if (!reducedMotion.matches) {
        const pointX=startX+(p.x-startX)*(3*t*t-2*t*t*t);
        const pointY=253+(p.y-20-253)*t;
        ctx.beginPath();ctx.arc(pointX,pointY,1.8,0,Math.PI*2);ctx.fillStyle=p.c;ctx.fill();
      }
      ctx.restore();
    });
    ctx.restore();
    if(visible && !document.hidden && !reducedMotion.matches) frame=requestAnimationFrame(draw);
  }
  function restart() { cancelAnimationFrame(frame);draw(performance.now()); }
  function resize() {
    const box=canvas.getBoundingClientRect();width=box.width;height=box.height;
    const scale=Math.min(window.devicePixelRatio || 1,2);
    canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);
    ctx.setTransform(scale,0,0,scale,0,0);restart();
  }
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;restart();}).observe(canvas);
  document.addEventListener('visibilitychange',restart);
  reducedMotion.addEventListener('change',restart);
  document.addEventListener('asl:themechange', () => {readArtTheme();restart();});
}

// Research connections: filters change only the examples in this section.
document.querySelectorAll('[data-research-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const topic = button.dataset.researchFilter;
    document.querySelectorAll('[data-research-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    document.querySelectorAll('[data-research-topic]').forEach(card => {
      card.hidden = topic !== 'all' && card.dataset.researchTopic !== topic;
      if (!card.hidden) count++;
    });
    document.querySelector('.research-result-count').textContent = `${count} product connection${count === 1 ? '' : 's'}`;
  });
});

// Products hero: "Try the App" reveals the store badges — on hover for mouse users, on tap/Enter for touch and keyboard.
document.querySelectorAll('.try-app').forEach(box => {
  const trigger = box.querySelector('.try-app-trigger');
  if (!trigger) return;
  const set = open => { box.classList.toggle('is-open', open); trigger.setAttribute('aria-expanded', String(open)); };
  trigger.addEventListener('click', () => set(!box.classList.contains('is-open')));
  box.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') set(true); });
  box.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') set(false); });
  box.addEventListener('keydown', event => { if (event.key === 'Escape') { set(false); trigger.focus(); } });
});

// Home "How we work": the stages play automatically while the section is on screen. Hovering the stages pauses
// the autoplay and shows only the hovered stage; it resumes when the mouse leaves. A tap or keyboard focus stops it.
document.querySelectorAll('[data-stages]').forEach(box => {
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const duration = 4500;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0, timer = null, hovering = false, stopped = reduceMotion, inView = false;
  const select = index => {
    current = index;
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      panels[i].classList.toggle('is-active', on);
    });
  };
  const schedule = () => {
    clearTimeout(timer);
    box.classList.remove('is-playing');
    if (stopped || hovering || !inView) return;
    void box.offsetWidth; // restart the progress bar
    box.classList.add('is-playing');
    timer = setTimeout(() => { select((current + 1) % tabs.length); schedule(); }, duration);
  };
  const stop = () => { stopped = true; schedule(); };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') select(i); });
    tab.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') stop(); });
    tab.addEventListener('keydown', event => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : step ? (i + step + tabs.length) % tabs.length : null;
      if (next === null) return;
      event.preventDefault();
      tabs[next].focus();
    });
    tab.addEventListener('focus', () => { if (tab.matches(':focus-visible')) stop(); select(i); });
  });
  box.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovering = true; schedule(); } });
  box.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') { hovering = false; schedule(); } });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }, { threshold: 0.5 }).observe(box);
  }
  select(0);
  box.classList.add('is-ready');
  requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('is-live')));
});
