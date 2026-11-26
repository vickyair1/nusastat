// NusaStat router — hash routes, one per page. The nav marks the current
// page, the view scrolls to the top on every change, and the phone menu
// closes whenever a page is picked.

import * as views from './views.js';

const PAGES = [
  { path: '/', title: 'Indonesia in numbers', render: views.overview },
  { path: '/population', title: 'Population', render: views.population },
  { path: '/economy', title: 'Economy', render: views.economy },
  { path: '/health', title: 'Health', render: views.health },
  { path: '/education', title: 'Education', render: views.education },
  { path: '/regions', title: 'Regions', render: views.regions },
  { path: '/data', title: 'Data & downloads', render: views.dataPage },
  { path: '/about', title: 'Sources & method', render: views.about },
];

const BY_PATH = new Map(PAGES.map((p) => [p.path, p]));

function currentPath() {
  const raw = (location.hash || '#/').slice(1).split('?')[0];
  return BY_PATH.has(raw) ? raw : '/';
}

function render() {
  const path = currentPath();
  const page = BY_PATH.get(path);
  document.getElementById('app').replaceChildren(page.render());
  document.title = `${page.title} · NusaStat — Statistik Indonesia`;
  document.querySelectorAll('.main-nav a').forEach((a) => {
    const active = a.getAttribute('href') === '#' + path;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const nav = document.getElementById('main-nav');
  nav.classList.remove('open');
  document.getElementById('nav-toggle').setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
}

document.getElementById('nav-toggle').addEventListener('click', () => {
  const nav = document.getElementById('main-nav');
  const open = nav.classList.toggle('open');
  document.getElementById('nav-toggle').setAttribute('aria-expanded', String(open));
});

window.addEventListener('hashchange', render);
render();
