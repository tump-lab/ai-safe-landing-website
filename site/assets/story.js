// Research publications: four featured papers show first; the toggle reveals the full list with topic filters.
// Filters and thread links ("See N papers") always open the full list before filtering.
const pubFilters = document.querySelectorAll('[data-pub-filter]');
const pubCount = document.querySelector('.pub-result-count');
const pubMore = document.querySelector('[data-pub-more]');
const pubTools = document.querySelectorAll('[data-pub-tools]');
const pubItems = document.querySelectorAll('[data-pub-topics]');
let pubFilter = 'all';
let pubExpanded = !pubMore;
const renderPubs = () => {
  pubFilters.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.pubFilter === pubFilter)));
  let count = 0;
  pubItems.forEach(item => {
    const matches = pubFilter === 'all' || item.dataset.pubTopics.split(' ').includes(pubFilter);
    item.hidden = !matches || (!pubExpanded && !('pubFeatured' in item.dataset));
    if (!item.hidden) count++;
  });
  if (pubCount) pubCount.textContent = `${count} publication${count === 1 ? '' : 's'}`;
  pubTools.forEach(tool => { tool.hidden = !pubExpanded; });
  if (pubMore) {
    pubMore.hidden = false;
    pubMore.setAttribute('aria-expanded', String(pubExpanded));
    pubMore.textContent = pubExpanded ? 'Show fewer' : 'Show more publications';
  }
};
const applyPubFilter = filter => { pubFilter = filter; pubExpanded = true; renderPubs(); };
pubFilters.forEach(button => button.addEventListener('click', () => applyPubFilter(button.dataset.pubFilter)));
document.querySelectorAll('[data-pub-jump]').forEach(link => {
  link.addEventListener('click', () => applyPubFilter(link.dataset.pubJump));
});
if (pubMore) {
  pubMore.addEventListener('click', () => {
    pubExpanded = !pubExpanded;
    if (!pubExpanded) pubFilter = 'all';
    renderPubs();
    if (!pubExpanded) pubMore.scrollIntoView({block: 'nearest'});
  });
}
renderPubs();
