from pathlib import Path
from html import escape
import json
import re

ROOT = Path(__file__).resolve().parent
SITE = ROOT/'site'  # publish directory (Netlify serves this folder)
PRODUCTS = [
 dict(slug='student-wellbeing',name='Wellbeing Companion',category='Mental Wellbeing',state='In Development',tone='',headline='A clearer view of your wellbeing, on your terms.',tagline='Understand patterns. Reflect on change. Find support.',description='An everyday wellbeing concept for check-ins, personal reflection, and understanding everyday patterns.',audience='For people, communities, and wellbeing partners',challenge='Everyday life changes quickly. Understanding how routines, experiences, and personal wellbeing change together can be difficult. We are exploring a more approachable way for people to reflect on these patterns and decide when to seek support.',ideas=[('Voluntary check-ins','A space to reflect on how you feel, when you choose. The proposed experience starts with self-reflection and explicit participation.'),('Patterns in everyday life','Explore whether optional everyday signals can support a clearer view of routines. Any interpretation would need to communicate uncertainty and be evaluated with users.'),('Support on your terms','Explore understandable feedback and routes to appropriate support, with people retaining meaningful choice over their participation.')],research='This direction draws on user modeling, behavioral understanding, and personalized support. A central research question is whether self-reported experiences and optional everyday signals can support useful reflection without overstating what those signals reveal.',hypothesis='The usefulness of these signals, the quality of feedback, and the effects on everyday wellbeing remain questions for evaluation.',boundaries=[('Reflection, not diagnosis','This concept is intended for reflection and support. It is not a diagnostic tool, treatment service, or emergency support channel.'),('Signals have limits','Everyday signals are incomplete and can have multiple explanations. They cannot establish a mental health condition, and any interpretation must communicate uncertainty.'),('Participation and data access','Self-assessment and optional signals would require clear information and appropriate authorization. Any pilot must define what participants choose to share, who can access it, and the limits on access by organizations.')],cta='Discuss a Wellbeing Pilot'),

]

def link(path):
    return path

def button(text,href,kind=''):
    return f'<a class="button {kind}" href="{href}">{text}</a>'
def textlink(text,href):
    return f'<a class="text-link" href="{href}">{text}</a>'
def eyebrow(text): return f'<div class="eyebrow">{text}</div>'
def badge(text): return f'<span class="badge">{text}</span>'
def brand(): return (ROOT/'components/landing.svg').read_text()+'<span>AI SafeLanding</span>'

THEMES = [
    ('research', 'Research', 'Scientific depth, human warmth.', '#122333', '#d4bdf5', '#faf9f5'),
    ('care', 'Care', 'Calm, grounded, people first.', '#183b32', '#c8d8a5', '#f7f8f0'),
    ('human', 'Human', 'Warm, open, approachable.', '#f5ede1', '#9b4f36', '#302b26'),
    ('clarity', 'Clarity', 'Clear thinking, trusted technology.', '#eaf4f4', '#12696e', '#193b46')
]

def theme_switcher():
    options = ''.join(f'''<button type="button" class="theme-option" data-theme-option="{key}" aria-pressed="{'true' if key=='research' else 'false'}"><span class="theme-swatches" aria-hidden="true"><i style="background:{a}"></i><i style="background:{b}"></i><i style="background:{c}"></i></span><span class="theme-option-copy"><strong>{name}</strong><small>{caption}</small></span><span class="theme-check" aria-hidden="true">✓</span></button>''' for key,name,caption,a,b,c in THEMES)
    return f'''<div class="theme-switcher"><button type="button" id="theme-toggle" aria-expanded="false" aria-controls="theme-panel" aria-label="Change color theme"><span class="theme-dot" aria-hidden="true"></span>Theme<span class="chevron" aria-hidden="true"></span></button><div id="theme-panel" class="theme-panel" hidden><div class="theme-panel-heading"><strong>Choose a theme</strong><span>Four expressions of the same purpose.</span></div><div class="theme-options" role="group" aria-label="Color theme">{options}</div><div class="theme-panel-footer"><span id="theme-selection">Research selected</span><button type="button" id="copy-theme-link">Copy theme link</button></div><p id="theme-feedback" class="theme-feedback" role="status" aria-live="polite"></p></div></div>'''

def header(current):
    def nav(label,path):
        active=' aria-current="page"' if current==path else ''
        return f'<a href="@/{path}/"{active}>{label}</a>'
    return f'''<a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="wrap header-inner"><a class="brand" href="@/" aria-label="AI SafeLanding home">{brand()}</a><nav class="nav" id="main-nav" aria-label="Main navigation"><div class="dropdown"><button id="product-toggle" aria-expanded="false" aria-controls="product-menu">Products<span class="chevron" aria-hidden="true"></span></button><div class="dropdown-panel" id="product-menu" hidden><a href="@/products/">Wellbeing Companion</a></div></div>{nav('Research','research')}{nav('About Us','about')}{nav('Contact','contact')}</nav><div class="header-actions"><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">Menu <span aria-hidden="true">+</span></button>{theme_switcher()}</div></div></header>'''

def footer():
    return f'''<footer class="site-footer" id="site-footer"><div class="wrap"><div class="footer-main"><div class="footer-brand"><a class="brand" href="@/">{brand()}</a></div><div class="footer-links"><div><strong>Product</strong><a href="@/products/">Wellbeing Companion</a></div><div><strong>Research</strong><a href="@/research/#research-areas">Research Areas</a><a href="@/research/#publications">Selected Publications</a><a href="@/research/#events">Events</a></div><div><strong>Company</strong><a href="@/about/">About Us</a><a href="@/contact/">Contact</a></div></div></div><div class="footer-bottom"><span>© 2026 AI SafeLanding</span><div class="footer-legal"><span>Privacy Notice</span><span>Terms of Use</span><span>Product Safety &amp; Limitations</span></div><span>Research → Real life.</span></div></div></footer>'''

def closing(title="Bring research to life.",copy="Explore a research collaboration or product pilot with us."):
    return f'''<section class="closing"><div class="wrap closing-inner"><div>{eyebrow('AI SAFELANDING')}<h2>{title}</h2><p>{copy}</p></div><div class="closing-actions">{button('Contact Our Team','@/contact/')}</div></div></section>'''

def concept():
    images = ''.join(f'<img class="home-checkin-image" data-preview-theme="{theme}" src="@/assets/previews/checkin-{theme}.png?v=134" width="520" height="1040" alt="Wellbeing app concept: a complete daily check-in with mood selection, an optional note, and Save check-in." loading="lazy" decoding="async">' for theme in ['research', 'care', 'human', 'clarity'])
    return f'<div class="phone-showcase home-checkin-preview">{images}</div>'

def mobile_gallery():
    app = (ROOT/'components/moodsense-app.html').read_text()
    screens = []
    for tab, title, caption in [('home', 'Home', 'One tap to say how you feel.'), ('community', 'Community', 'Your city\u2019s mood, and your people.'), ('recharge', 'Recharge', 'Small steps matched to your mood.'), ('you', 'You', 'Your tree, your trend, your week.')]:
        phone = app.replace('class="ms-device" data-ms-phone', f'class="ms-device" data-ms-phone data-ms-start="{tab}"', 1)
        screens.append(f'<section class="gallery-screen" aria-label="{title}"><div class="gallery-screen-heading"><h4>{title}</h4><p>{caption}</p></div>{phone}</section>')
    return '<div class="mobile-gallery" id="app-preview"><p class="ms-gallery-hint">The MoodSense app, with sample data. Tap around: a check-in on Home updates the other tabs.</p><div class="ms-gallery">'+''.join(screens)+'</div></div>'

def story(name, **slots):
    html = (ROOT/f'components/story-{name}.html').read_text()
    for key, value in slots.items(): html = html.replace('{{'+key+'}}', value)
    return html

def products():
    return story('products', gallery=mobile_gallery())

def possibilities():
    paths = {
      'mental-icon': '<path d="M8 30c-7-9 4-22 14-14 10-8 21 5 14 14L22 43Z"/><path d="M14 27h5l3-7 4 13 3-6h5"/>',
      'physical-icon': '<path d="M8 24h10l5-13 7 27 5-14h5"/><circle cx="24" cy="24" r="22"/>',
      'education-icon': '<path d="M24 40c-6-5-12-6-20-5V8c8-1 14 0 20 5 6-5 12-6 20-5v27c-8-1-14 0-20 5Z"/><path d="M24 13v27"/>'
    }
    icons = {key: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg>' for key,path in paths.items()}
    return story('possibilities', **icons)

def home():
    return story('home', **{'research-art': story('research-art'), 'checkin': concept()})

def innerhero(eyetext,title,copy,tone='',actions=''):
    return f'<section class="inner-hero {tone}"><div class="wrap reveal">{eyebrow(eyetext)}<h1>{title}</h1><p>{copy}</p>{actions}</div></section>'

def research():
    return story('research')

def about():
    return story('about', **{'brand-mark': (ROOT/'components/landing.svg').read_text(), 'team': (ROOT/'components/founding-team.html').read_text()})

def contact():
    return '''<section class="section contact-page"><div class="wrap contact-grid"><aside class="contact-aside"><h1>Let’s build safe&nbsp;AI together.</h1></aside><form class="contact-form" id="contact-form"><div class="form-row"><div class="field"><label for="name">Your name</label><input id="name" name="name" autocomplete="name" placeholder="Name" required maxlength="100"></div><div class="field"><label for="organization">Organization <span style="color:var(--muted)">(optional)</span></label><input id="organization" name="organization" autocomplete="organization" placeholder="Organization" maxlength="160"></div></div><div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" placeholder="you@organization.com" required maxlength="254"></div><div class="field"><label for="topic">I’d like to discuss</label><select id="topic" name="topic"><option value="Research">Research collaboration</option><option value="Product">A product direction</option><option value="Partnership">A potential partnership</option><option value="General">A general inquiry</option></select></div><div class="field"><label for="message">Your message</label><textarea id="message" name="message" placeholder="What would you like to explore?" required minlength="20" maxlength="4000"></textarea></div><p class="form-note">This preview prepares a draft in your browser. It does not submit your details to a server.</p><button type="submit" class="button">Prepare Inquiry </button><p id="form-feedback" class="form-feedback" role="status"></p><div id="draft-preview" class="draft-preview" hidden><strong style="font-size:18px">Your inquiry draft</strong><pre id="draft-text"></pre><div class="actions"><button type="button" class="button" id="copy-draft">Copy Draft</button><button type="button" class="button light" id="download-draft">Download .txt</button></div></div></form></div></section>'''

def legal(kind):
    if kind=='privacy':
        title='Privacy Notice';copy='How this website preview handles information.'
        body='''<h2>This preview</h2><p>This notice describes the local website preview. A company privacy notice, verified contact details, and product-specific data disclosures still need to be supplied before public launch.</p><h2>Contact drafts</h2><p>The contact form prepares an inquiry in your browser. The website does not send the entered details to a contact service or store them in browser storage. Copying or downloading a draft creates a copy under your control. Your browser may separately offer to remember form values through its own autofill settings.</p><h2>Concept interactions</h2><p>The five wellbeing previews share check-ins, reflections and preferences in this browser tab’s memory. Nothing is sent to a service or saved in browser storage. Refreshing clears your entries and restores examples. Pause prevents new check-ins and reflections; Delete session data clears entries and drafts from all previews. Download session creates a JSON file on your device, which remains until you delete it yourself. Optional signal switches demonstrate preferences only and do not access device data.</p><h2>Theme preference</h2><p>Your selected color theme is saved in local browser storage so it stays consistent across pages. This stores only the theme name, not form entries or wellbeing information. Theme links can also include this preference in the URL.</p><h2>Website resources</h2><p>This implementation uses local assets and includes no analytics, tracking cookies, external fonts, or third-party embeds. The web server used to serve the preview may keep ordinary request logs. Hosting and its data handling must be reviewed before launch.</p><h2>Before public launch</h2><p>The final notice should identify the responsible company and contact, describe the actual data collected and purposes, explain applicable choices and access arrangements, and reflect implemented product and hosting practices.</p>'''
    elif kind=='terms':
        title='Terms of Use';copy='Website preview status and intended use.'
        body='''<h2>A design and content preview</h2><p>This website presents proposed company content and exploratory product directions. Final company terms of use have not yet been supplied.</p><h2>Product availability</h2><p>Wellbeing Companion is presented as In Development in the supplied planning document. Physical Health and Education remain exploratory directions. This website does not provide access to released software or professional services.</p><h2>Illustrative interface</h2><p>The wellbeing interface is a concept preview. Its interaction demonstrates a proposed design and does not provide assessment, treatment, or personalized advice.</p><h2>Before public launch</h2><p>Verified company details, product availability, contact information, and approved terms must be added to reflect the actual service being offered.</p>'''
    else:
        title='Product Safety &amp; Limitations';copy='Clear boundaries for the product directions described on this website.'
        body='''<h2>Development and exploration</h2><p>Wellbeing Companion is described as In Development. Physical Health and Education are exploratory directions. Research goals, proposed experiences, and concept interfaces do not establish validated product performance.</p><h2>Wellbeing and healthcare</h2><p>These concepts do not provide medical diagnosis, treatment, medical advice, or emergency care. Everyday signals are incomplete, may have multiple explanations, and cannot establish a health condition.</p><h2>Data and participation</h2><p>Any future study or pilot needs clear purposes, appropriate authorization, defined access boundaries, and safeguards matched to the people and context involved. Product-specific practices must be described based on the mechanisms actually implemented.</p><h2>Our approach</h2><p>Safety is an ongoing development and evaluation principle. No certification, clinical effectiveness, institutional endorsement, or public-system integration is claimed by this preview.</p><a class="text-link" href="@/research/#responsible-translation">Explore responsible translation</a>'''
    return f'<section class="section legal-page"><div class="wrap legal"><div class="legal-top"><h1>{title}</h1><p>{copy}</p></div>{body}</div></section>'

PAGES={
'':('AI research deserves a safe landing',home(),'We turn advances in AI research into personalized, human-centered experiences that make everyday life better.'),
'products':('Wellbeing Companion',products(),'An everyday wellbeing app concept for daily check-ins, personal patterns, reflection, support and privacy control.'),
'research':('Our Research',research(),'User Modeling and User Simulation: research questions, methods, publications and projects for personalized AI applications.'),
'about':('About Us',about(),'AI SafeLanding is a research-driven AI company translating research into practical, human-centered products.'),
'contact':('Contact',contact(),'Prepare a conversation about research, products, or responsible AI partnerships.')}
# Legal pages are withheld until final texts are supplied; legal() is kept for later.
# for k in ['privacy','terms','safety']:PAGES[k]=({'privacy':'Privacy Notice','terms':'Terms of Use','safety':'Product Safety & Limitations'}[k],legal(k),'Website preview information and product boundaries.')

# Remove retired generated pages when rebuilding an existing checkout.
for retired in ('privacy/index.html', 'terms/index.html', 'safety/index.html', 'partnerships/index.html', 'products/healthy-ageing-care/index.html', 'products/personalized-learning/index.html'):
    (SITE/retired).unlink(missing_ok=True)

for route,(title,body,description) in PAGES.items():
    target=SITE/route/'index.html';target.parent.mkdir(parents=True,exist_ok=True)
    prefix='../'*len(route.split('/')) if route else './'
    html=f'''<!doctype html>
<!-- AI SafeLanding | V56 Unified editorial homepage. Design context: existing four themes; user modeling, simulation, applications, research and collaboration. Product UI is conceptual. Research publications supplied in the user-provided research page. -->
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="theme-color" content="#101e2d"><meta name="description" content="{escape(description,quote=True)}"><meta name="robots" content="noindex,nofollow"><title>{escape(title)} — AI SafeLanding</title><link id="site-favicon" rel="icon" type="image/svg+xml" href="@/assets/brand/favicon-research.svg" data-base="@/assets/brand/favicon-"><script src="@/assets/themes.js?v=134"></script><link rel="stylesheet" href="@/assets/site.css?v=134"><link rel="stylesheet" href="@/assets/wellbeing.css?v=134"><link rel="stylesheet" href="@/assets/themes.css?v=134"><link rel="stylesheet" href="@/assets/refinements.css?v=134"><link rel="stylesheet" href="@/assets/story.css?v=134"><link rel="stylesheet" href="@/assets/ui.css?v=134"><link rel="stylesheet" href="@/assets/moodsense.css?v=142"><script defer src="@/assets/story.js?v=134"></script><script defer src="@/assets/wellbeing.js?v=134"></script><script defer src="@/assets/moodsense-art.js?v=142"></script><script defer src="@/assets/moodsense-planet.js?v=142"></script><script defer src="@/assets/moodsense.js?v=142"></script><script defer src="@/assets/site.js?v=134"></script></head><body class="{'page-home' if not route else ('page-interior page-editorial' if route in ('research', 'about', 'products') or route.startswith('products/') else 'page-interior')}{' page-unified page-' + route if route in ('research', 'products', 'about') else ''}">{header(route)}<main id="main">{body}</main>{footer()}<noscript><div class="noscript">All pages remain accessible. JavaScript enables the mobile menu, concept interaction, and inquiry draft. Use the footer links to navigate.</div></noscript></body></html>'''
    target.write_text(html.replace('@/',prefix))
print(f'Built {len(PAGES)} pages in {SITE}')

# Keep previously shared student-app URLs working without duplicating product content.
legacy = SITE/'products/student-wellbeing/index.html'
legacy.parent.mkdir(parents=True, exist_ok=True)
legacy.write_text('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Wellbeing Companion</title><link rel="canonical" href="../"><script>location.replace('../'+location.search+location.hash);</script><meta http-equiv="refresh" content="0; url=../"></head><body><p>Wellbeing Companion is now on our <a href="../">Products page</a>.</p></body></html>''')
(SITE/'_redirects').write_text('/products/student-wellbeing/ /products/ 301\n/products/healthy-ageing-care/ /#possibilities 301\n/products/personalized-learning/ /#possibilities 301\n/privacy/ / 302\n/terms/ / 302\n/safety/ / 302\n')
