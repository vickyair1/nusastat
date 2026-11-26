// NusaStat pages. Each export builds one page out of data.js and returns
// the element the router puts into <main id="app">. Nothing here is a
// placeholder: the GDP range re-draws its chart, the economy tabs swap
// their panels, province tables sort and filter, the explorer shows a
// province's facts, and dataset buttons download a CSV made from the same
// numbers the charts draw.

import * as D from './data.js';
import { lineChart, barChart, columnChart, donut, pyramid } from './charts.js';

const PALETTE = ['#1f7a6d', '#c77f1a', '#0b3d4f', '#7a9e3f', '#4a6fa5', '#b3382e', '#8e6cc0', '#3f8f8a', '#a35d2a', '#5b7d6a', '#94a3b8'];

function frag(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function numFmt(n, d = 1) {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

function kpiTile(k) {
  const a = document.createElement('a');
  a.className = 'kpi';
  a.href = k.route;
  a.innerHTML = `<span class="kpi-label">${k.label}</span>`
    + `<span class="kpi-value">${k.value}</span>`
    + `<span class="kpi-sub">${k.sub}</span>`;
  return a;
}

function kpiRow(tiles) {
  const grid = frag('<div class="kpi-grid"></div>');
  for (const k of tiles) grid.appendChild(kpiTile(k));
  return grid;
}

function head2(title, sub) {
  return frag(`<div class="section-head"><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`);
}

function srcNote(text) {
  return frag(`<p class="source">Source: ${text}</p>`);
}

function chartCard(title, sub, chartEl) {
  const card = frag(`<section class="card chart-card"><h3>${title}</h3>${sub ? `<p class="card-sub">${sub}</p>` : ''}</section>`);
  card.appendChild(chartEl);
  return card;
}

function pageHead(title, intro) {
  return frag(`<section class="page-head"><h1>${title}</h1><p>${intro}</p></section>`);
}

function pairGrid(a, b) {
  const g = frag('<div class="grid-2"></div>');
  g.appendChild(a);
  g.appendChild(b);
  return g;
}

function barRow(label, note, display, colour, widthPct) {
  return frag(`<div class="age-row"><div><strong>${label}</strong>${note ? `<span>${note}</span>` : ''}</div>
    <div class="age-bar"><span style="width:${widthPct}%;${colour ? `background:${colour}` : ''}"></span></div><b>${display}</b></div>`);
}

// ---------------------------------------------------------------- overview
export function overview() {
  const root = frag('<div class="page"></div>');
  root.appendChild(frag(`<section class="hero">
    <p class="eyebrow">The national statistics portal of Indonesia</p>
    <h1>Indonesia in numbers</h1>
    <p class="lede">281.6 million people, 38 provinces and 17,508 islands — one open record of how the
    country lives, works and changes. Each figure on this site is published by Statistics Indonesia (BPS),
    Bank Indonesia or the World Bank, and every dataset behind it can be downloaded.</p>
    <div class="hero-links">
      <a class="btn" href="#/population">Explore the population</a>
      <a class="btn ghost" href="#/data">Download the data</a>
    </div></section>`));

  root.appendChild(kpiRow(D.KPI));

  // GDP chart with a working year-range control.
  const gdpCard = frag(`<section class="card chart-card"><h3>Gross domestic product, 2015–2024</h3>
    <p class="card-sub">GDP at current prices, rupiah trillion · BPS</p>
    <div class="controls"><label>Show:
      <select id="gdp-range">
        <option value="10">2015–2024</option>
        <option value="6">2019–2024</option>
        <option value="5">2020–2024</option>
      </select></label>
      <span class="control-note" id="gdp-note">GDP more than doubled in a decade: Rp 11,526tr in 2015 to Rp 22,139tr in 2024.</span>
    </div><div class="chart-slot" id="gdp-slot"></div></section>`);
  root.appendChild(gdpCard);
  const notes = {
    10: 'GDP more than doubled in a decade: Rp 11,526tr in 2015 to Rp 22,139tr in 2024.',
    6: 'Growth held above 5% every year since the 2020 pandemic contraction of −2.07%.',
    5: 'After the 2020 contraction, GDP rose from Rp 15,434tr to Rp 22,139tr in four years.',
  };
  const redrawGdp = (n) => {
    gdpCard.querySelector('#gdp-slot').replaceChildren(lineChart(D.GDP_SERIES.slice(-n), {
      label: 'GDP 2015 to 2024', color: '#1f7a6d',
      yfmt: (v) => 'Rp ' + Math.round(v / 1000) + 'k',
    }));
    gdpCard.querySelector('#gdp-note').textContent = notes[n];
  };
  redrawGdp(10);
  gdpCard.querySelector('#gdp-range').addEventListener('change', (e) => redrawGdp(Number(e.target.value)));

  const growthCard = chartCard('Real GDP growth, % per year', 'BPS — the 2020 pandemic contraction, then four years above 5%',
    columnChart(D.GROWTH_SERIES.slice(-6).map(([y, v]) => ({ label: String(y), value: v })), {
      label: 'GDP growth 2019 to 2024', yfmt: (v) => v + '%', fmt: (v) => v.toFixed(2) + '%',
    }));
  const sectorRows = D.SECTORS.slice(0, 6).map(([name, share], i) => ({ label: name, value: share, color: PALETTE[i] }));
  const rest = D.SECTORS.slice(6).reduce((a, [, s]) => a + s, 0);
  sectorRows.push({ label: 'All other industries', value: Math.round(rest * 10) / 10, color: '#94a3b8' });
  const donutCard = chartCard('What makes up GDP, 2024', 'Share of GDP by industry · BPS',
    donut(sectorRows, { centre: '100%', centreSub: 'of GDP' }));
  root.appendChild(pairGrid(growthCard, donutCard));

  const topCard = chartCard('Largest provinces, 2024', 'Population, millions · BPS mid-year estimates',
    barChart(D.PROVINCES.slice(0, 6).map(([name, , pop]) => ({ label: name, value: pop })), { labelW: 130, fmt: (v) => numFmt(v, 2) + 'm' }));
  const relCard = frag(`<section class="card"><h3>Latest releases</h3>
    <p class="card-sub">What BPS published most recently</p><ul class="releases"></ul>
    <p><a href="#/data">Browse all datasets →</a></p></section>`);
  const ul = relCard.querySelector('.releases');
  D.RELEASES.slice(0, 5).forEach((r) => {
    ul.appendChild(frag(`<li><span class="rel-date">${r.date}</span><strong>${r.title}</strong><span class="rel-note">${r.note}</span></li>`));
  });
  root.appendChild(pairGrid(topCard, relCard));

  root.appendChild(srcNote('Statistics Indonesia (BPS), Bank Indonesia and the World Bank. Figures are the latest published at the time this site was built (November 2026). See <a href="#/about">Sources &amp; method</a> for the full list.'));
  return root;
}

// --------------------------------------------------------------- population
export function population() {
  const root = frag('<div class="page"></div>');
  root.appendChild(pageHead('Population', '281.6 million people at mid-2024 — the world’s fourth-largest population — '
    + 'spread across 17,508 islands. Java alone holds more people than Sumatra, Kalimantan, Sulawesi, Bali, '
    + 'Nusa Tenggara, Maluku and Papua combined.'));

  root.appendChild(kpiRow([
    { label: 'Population, 2024', value: '281.6m', sub: 'BPS mid-year estimate', route: '#/population' },
    { label: 'Growth, 2023–24', value: '+1.05%', sub: 'about 2.9m more people', route: '#/population' },
    { label: 'Median age', value: '30.1 yrs', sub: 'a young country', route: '#/population' },
    { label: 'Urban share', value: '58.6%', sub: 'living in cities · 2024', route: '#/population' },
    { label: 'Density', value: '147/km²', sub: 'national average', route: '#/population' },
    { label: 'Fertility rate', value: '2.1', sub: 'children per woman · 2024', route: '#/population' },
  ]));

  root.appendChild(chartCard('Population, 2010–2024', 'Millions · 2010 and 2020 are census counts; other years are BPS mid-year estimates',
    lineChart(D.POP_SERIES, { label: 'Population 2010 to 2024', ymin: 200, ymax: 290, yfmt: (v) => numFmt(v, 0) + 'm' })));

  const pyramidCard = chartCard('Age structure, 2024', '% of the population by five-year age group and sex · BPS estimates',
    pyramid(D.PYRAMID, { label: 'Population pyramid 2024' }));
  const agesCard = frag(`<section class="card"><h3>Three generations</h3>
    <p class="card-sub">Who the 281.6 million are, by broad age group · 2024</p></section>`);
  for (const g of D.AGE_GROUPS) agesCard.appendChild(barRow(g.label, g.note, `${g.share}%`, null, g.share));
  agesCard.appendChild(frag(`<p class="card-note">The working-age share is still rising — Indonesia’s demographic
    dividend peaks around 2030, when the 15–64 group is at its largest share of the population.</p>`));
  root.appendChild(pairGrid(pyramidCard, agesCard));

  root.appendChild(head2('Where people live', 'Population by island group, 2024 · BPS'));
  root.appendChild(chartCard('Population by island group', 'Millions · Java holds 55.7% of the country on 6.6% of its land',
    barChart(D.ISLANDS.map(([island, pop]) => ({ label: island, value: pop })), { labelW: 190, fmt: (v) => numFmt(v, 1) + 'm' })));

  root.appendChild(head2('All 38 provinces', 'Population 2024, millions · BPS mid-year estimates. Click a column heading to sort; type to filter. Provincial estimates sum to 282.1 million against the national estimate of 281.6 million — the difference is rounding in the published provincial series.'));
  root.appendChild(provinceTable(D.PROVINCES, { showShare: true }));
  root.appendChild(srcNote('Statistics Indonesia (BPS): Population Census 2010 and 2020, and mid-year population estimates 2011–2024.'));
  return root;
}

// Sortable, filterable province table (shared by Population and Regions).
export function provinceTable(rows, opts = {}) {
  const wrap = frag(`<section class="card table-card">
    <div class="controls"><label>Filter provinces:
      <input type="search" class="filter-input" placeholder="Type a province name…" aria-label="Filter provinces"></label>
      <span class="control-note table-count"></span></div>
    <div class="table-scroll"><table class="data-table"><thead><tr>
      <th data-key="name">Province</th><th data-key="island">Island group</th>
      <th data-key="pop" class="num sorted-desc">Population (m)</th>
      ${opts.showShare ? '<th data-key="share" class="num">Share of Indonesia</th>' : ''}
    </tr></thead><tbody></tbody></table></div></section>`);
  const tbody = wrap.querySelector('tbody');
  const count = wrap.querySelector('.table-count');
  const data = rows.map(([name, island, pop]) => ({ name, island, pop, share: (pop / 281.6) * 100 }));
  let sortKey = 'pop';
  let sortDir = -1;
  const render = () => {
    const q = wrap.querySelector('.filter-input').value.trim().toLowerCase();
    const shown = data
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.island.toLowerCase().includes(q))
      .sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : a[sortKey] < b[sortKey] ? -1 : 0) * sortDir);
    tbody.replaceChildren(...shown.map((p) => frag(`<tr><td>${p.name}</td><td>${p.island}</td>
      <td class="num">${numFmt(p.pop, 2)}</td>${opts.showShare ? `<td class="num">${numFmt(p.share, 1)}%</td>` : ''}</tr>`)));
    count.textContent = `${shown.length} of ${data.length} provinces`;
    wrap.querySelectorAll('th').forEach((th) => {
      th.classList.toggle('sorted-asc', th.dataset.key === sortKey && sortDir === 1);
      th.classList.toggle('sorted-desc', th.dataset.key === sortKey && sortDir === -1);
    });
  };
  wrap.querySelectorAll('th').forEach((th) => {
    th.addEventListener('click', () => {
      if (sortKey === th.dataset.key) {
        sortDir *= -1;
      } else {
        sortKey = th.dataset.key;
        sortDir = th.dataset.key === 'name' || th.dataset.key === 'island' ? 1 : -1;
      }
      render();
    });
  });
  wrap.querySelector('.filter-input').addEventListener('input', render);
  render();
  return wrap;
}

// ----------------------------------------------------------------- economy
export function economy() {
  const root = frag('<div class="page"></div>');
  root.appendChild(pageHead('Economy', 'GDP of Rp 22,139 trillion in 2024 — about US$ 1.4 trillion, the largest economy in Southeast Asia — '
    + 'growing 5.03% in real terms, with inflation at 1.57%, unemployment at 4.91% and poverty at 9.03%.'));

  root.appendChild(kpiRow([
    { label: 'GDP, 2024', value: 'Rp 22,139tr', sub: 'US$ 1,396bn · BPS', route: '#/economy' },
    { label: 'GDP per capita', value: 'US$ 4,960', sub: 'Rp 78.6m · 2024', route: '#/economy' },
    { label: 'Growth, 2024', value: '5.03%', sub: 'real, year on year', route: '#/economy' },
    { label: 'Inflation, Dec 2024', value: '1.57%', sub: 'CPI, year on year', route: '#/economy' },
    { label: 'Unemployment', value: '4.91%', sub: 'Aug 2024 · 7.47m people', route: '#/economy' },
    { label: 'Poverty rate', value: '9.03%', sub: 'Mar 2024 · 25.22m people', route: '#/economy' },
  ]));

  // Working tabs: Growth / Prices & jobs / Trade.
  const tabs = frag(`<section class="card"><h3>Economy in detail</h3>
    <div class="tabs" role="tablist">
      <button role="tab" data-tab="growth" class="active">Growth &amp; GDP</button>
      <button role="tab" data-tab="prices">Prices, jobs &amp; poverty</button>
      <button role="tab" data-tab="trade">Trade</button>
    </div><div class="tab-panels"></div></section>`);
  const panels = tabs.querySelector('.tab-panels');

  const panelBuilders = {
    growth() {
      const g = pairGrid(
        chartCard('GDP, 2015–2024', 'Rupiah trillion, current prices · BPS',
          lineChart(D.GDP_SERIES, { label: 'GDP 2015 to 2024', yfmt: (v) => 'Rp ' + Math.round(v / 1000) + 'k' })),
        chartCard('Real growth, % per year', 'BPS — 2020 is the only contraction in the series',
          columnChart(D.GROWTH_SERIES.map(([y, v]) => ({ label: String(y), value: v })), {
            label: 'GDP growth 2015 to 2024', yfmt: (v) => v.toFixed(1) + '%', fmt: (v) => v.toFixed(2) + '%', h: 240,
          })),
      );
      return [g, frag(`<p class="card-note">Growth is broad-based: household consumption is about 54% of GDP,
        investment about 29%, and government spending about 8%. Manufacturing is the largest single industry at 18.7% of GDP.</p>`)];
    },
    prices() {
      const g = pairGrid(
        chartCard('Inflation, % per year', 'CPI, December year on year · BPS',
          lineChart(D.INFLATION_SERIES, { label: 'Inflation 2019 to 2024', ymin: 0, ymax: 6, yfmt: (v) => v.toFixed(1) + '%' })),
        chartCard('Unemployment &amp; poverty', '% · unemployment in August, poverty in March · BPS',
          lineChart(D.UNEMPLOYMENT_SERIES, { label: 'Unemployment 2019 to 2024', color: '#b3382e', ymin: 0, ymax: 12, yfmt: (v) => v.toFixed(1) + '%' })),
      );
      const table = frag(`<div class="table-scroll"><table class="data-table"><thead><tr>
        <th>Year</th><th class="num">Inflation (%)</th><th class="num">Unemployment (%)</th><th class="num">Poverty (%)</th></tr></thead>
        <tbody>${D.INFLATION_SERIES.map(([y, i]) => {
          const u = D.UNEMPLOYMENT_SERIES.find((s) => s[0] === y)[1];
          const p = D.POVERTY_SERIES.find((s) => s[0] === y)[1];
          return `<tr><td>${y}</td><td class="num">${i.toFixed(2)}</td><td class="num">${u.toFixed(2)}</td><td class="num">${p.toFixed(2)}</td></tr>`;
        }).join('')}</tbody></table></div>`);
      return [g, table, frag(`<p class="card-note">Poverty fell to 9.03% in March 2024 — the lowest since the series
        began — while unemployment fell to 4.91%, its lowest since 2019.</p>`)];
    },
    trade() {
      const tradeCard = chartCard('Exports &amp; imports, US$ billion', 'BPS / Bank Indonesia — exports have exceeded imports every year since 2020',
        columnChart(D.TRADE_SERIES.map(([year, ex, im]) => ({ label: String(year), values: [ex, im] })), {
          label: 'Exports and imports 2019 to 2024', groups: ['Exports', 'Imports'],
          groupColors: ['#1f7a6d', '#c77f1a'], yfmt: (v) => '$' + Math.round(v) + 'bn', h: 240,
        }));
      const factsCard = frag(`<section class="card"><h3>Trade, 2024</h3><p class="card-sub">US$ billion · BPS / Bank Indonesia</p><dl class="facts"></dl></section>`);
      const dl = factsCard.querySelector('.facts');
      for (const f of D.TRADE_2024) dl.appendChild(frag(`<div><dt>${f.label}</dt><dd><b>${f.value}</b><span>${f.sub}</span></dd></div>`));
      return [pairGrid(tradeCard, factsCard), frag(`<p class="card-note">Indonesia ran a goods surplus of US$ 31.0 billion in 2024 — the
        fifth surplus year in a row. Coal, palm oil and nickel products lead exports; China, the United States and
        Japan are the largest buyers.</p>`)];
    },
  };

  const showTab = (name) => panels.replaceChildren(...panelBuilders[name]());
  showTab('growth');
  tabs.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('active', b === btn));
      showTab(btn.dataset.tab);
    });
  });
  root.appendChild(tabs);

  root.appendChild(head2('What makes up GDP, 2024', 'Share of GDP by industry · BPS'));
  root.appendChild(chartCard('GDP by industry', 'Manufacturing leads at 18.7%; services together are more than half of the economy',
    barChart(D.SECTORS.map(([name, share], i) => ({ label: name, value: share, color: PALETTE[i % PALETTE.length] })), {
      labelW: 240, fmt: (v) => v.toFixed(1) + '%',
    })));
  root.appendChild(srcNote('Statistics Indonesia (BPS) and Bank Indonesia. GDP in rupiah at current prices; growth in real terms.'));
  return root;
}

// ------------------------------------------------------------------ health
export function health() {
  const root = frag('<div class="page"></div>');
  root.appendChild(pageHead('Health', 'Indonesians live 74.0 years on average — up from 71.7 in 2019. The hardest problem left is '
    + 'child nutrition: 21.5% of children under five are stunted, even as infant deaths keep falling.'));

  const cards = frag('<div class="stat-grid"></div>');
  for (const s of D.HEALTH) {
    cards.appendChild(frag(`<article class="stat-card"><span class="stat-label">${s.label}</span>
      <span class="stat-value">${s.value}</span><span class="stat-sub">${s.sub}</span>
      <p>${s.detail}</p></article>`));
  }
  root.appendChild(cards);

  root.appendChild(chartCard('Life expectancy at birth, 2019–2024', 'Years · BPS — the 2021 dip is the COVID-19 pandemic; the recovery since is the fastest on record',
    lineChart(D.LIFE_SERIES, { label: 'Life expectancy 2019 to 2024', ymin: 70, ymax: 75, yfmt: (v) => v.toFixed(1) })));

  const nutCard = frag(`<section class="card"><h3>Child nutrition, 2023</h3>
    <p class="card-sub">% of children under five · SSGI, Ministry of Health</p></section>`);
  nutCard.appendChild(barRow('Stunting (too short for age)', '', '21.5%', '#b3382e', 21.5 * 3));
  nutCard.appendChild(barRow('Underweight (too light for age)', '', '16.9%', '#c77f1a', 16.9 * 3));
  nutCard.appendChild(barRow('Wasting (too thin for height)', '', '7.7%', '#1f7a6d', 7.7 * 3));
  nutCard.appendChild(frag(`<p class="card-note">Stunting fell from 37.2% in 2013 to 21.5% in 2023, but it is still
    the country’s largest child-health problem — about one child in five.</p>`));
  const careCard = frag(`<section class="card"><h3>Care within reach</h3>
    <p class="card-sub">Facilities and coverage · 2023</p><dl class="facts">
    <div><dt>Hospitals</dt><dd><b>3,168</b><span>public and private · BPS</span></dd></div>
    <div><dt>Community health centres</dt><dd><b>10,315</b><span>puskesmas · BPS</span></dd></div>
    <div><dt>Complete basic immunisation</dt><dd><b>94.6%</b><span>children 12–23 months · Ministry of Health</span></dd></div>
    <div><dt>Health spending</dt><dd><b>3.4% of GDP</b><span>2022 · World Bank</span></dd></div>
    </dl></section>`);
  root.appendChild(pairGrid(nutCard, careCard));
  root.appendChild(srcNote('Statistics Indonesia (BPS), Ministry of Health (SSGI 2023, Indonesian Health Profile 2023), World Bank and WHO.'));
  return root;
}

// --------------------------------------------------------------- education
export function education() {
  const root = frag('<div class="page"></div>');
  root.appendChild(pageHead('Education', '97.4% of adults can read and write, and a child starting school today can expect 13.5 years of it. '
    + 'The gap that remains is at the top: only about one in three young people reach higher education.'));

  const cards = frag('<div class="stat-grid"></div>');
  for (const s of D.EDUCATION) {
    cards.appendChild(frag(`<article class="stat-card"><span class="stat-label">${s.label}</span>
      <span class="stat-value">${s.value}</span><span class="stat-sub">${s.sub}</span>
      <p>${s.detail}</p></article>`));
  }
  root.appendChild(cards);

  const schoolCard = chartCard('Mean years of schooling, 2019–2024', 'Years, population aged 25+ · BPS — up from 8.34 to 9.01 in five years',
    lineChart(D.SCHOOLING_SERIES, { label: 'Mean years of schooling 2019 to 2024', ymin: 8, ymax: 9.5, yfmt: (v) => v.toFixed(2) }));
  const partCard = frag(`<section class="card"><h3>Who is in school, 2023</h3>
    <p class="card-sub">School participation rate by age group · BPS</p></section>`);
  partCard.appendChild(barRow('Age 7–12 · primary', '', '99.7%', '#1f7a6d', 99.7));
  partCard.appendChild(barRow('Age 13–15 · lower secondary', '', '97.9%', '#1f7a6d', 97.9));
  partCard.appendChild(barRow('Age 16–18 · upper secondary', '', '88.5%', '#c77f1a', 88.5));
  partCard.appendChild(frag(`<p class="card-note">Primary schooling is effectively universal. The drop comes at
    upper-secondary age, where about one child in nine is out of school — mostly in rural and eastern provinces.</p>`));
  root.appendChild(pairGrid(schoolCard, partCard));
  root.appendChild(srcNote('Statistics Indonesia (BPS): National Socio-Economic Survey and education statistics, 2023–2024.'));
  return root;
}

// ----------------------------------------------------------------- regions
export function regions() {
  const root = frag('<div class="page"></div>');
  root.appendChild(pageHead('Regions', '38 provinces across six island groups — from Jakarta, the densest province on earth at over '
    + '16,000 people per square kilometre, to Papua, where 13 people share each square kilometre.'));

  // Province explorer: pick a province, see its facts.
  const explorer = frag(`<section class="card"><h3>Province explorer</h3>
    <p class="card-sub">Pick a province to see its capital, size, density and output per person</p>
    <div class="controls"><label>Province:
      <select id="prov-select"></select></label></div>
    <div class="explorer" id="explorer"></div></section>`);
  const select = explorer.querySelector('#prov-select');
  for (const name of Object.keys(D.FEATURED)) {
    select.appendChild(frag(`<option value="${name}">${name}</option>`));
  }
  const showProvince = (name) => {
    const [pName, island, pop] = D.PROVINCES.find(([n]) => n === name);
    const f = D.FEATURED[name];
    const density = Math.round((pop * 1000000) / f.area);
    explorer.querySelector('#explorer').replaceChildren(frag(`<div class="explorer-grid">
      <div><span class="stat-label">Capital</span><b>${f.capital}</b></div>
      <div><span class="stat-label">Population, 2024</span><b>${numFmt(pop, 2)} million</b><span>${numFmt((pop / 281.6) * 100, 1)}% of Indonesia</span></div>
      <div><span class="stat-label">Area</span><b>${f.area.toLocaleString('en-US')} km²</b></div>
      <div><span class="stat-label">Density</span><b>${density.toLocaleString('en-US')} / km²</b></div>
      <div><span class="stat-label">GRDP per capita</span><b>Rp ${f.grdpPerCapita} million</b><span>2024 · approx. · BPS</span></div>
      <div><span class="stat-label">Island group</span><b>${island}</b></div>
    </div>`));
  };
  select.addEventListener('change', (e) => showProvince(e.target.value));
  showProvince('Jakarta');
  root.appendChild(explorer);

  root.appendChild(head2('All 38 provinces', 'Population 2024, millions · BPS mid-year estimates. Click a column heading to sort; type to filter.'));
  root.appendChild(provinceTable(D.PROVINCES, { showShare: true }));
  root.appendChild(srcNote('Statistics Indonesia (BPS). Areas are the official provincial areas; densities are population divided by area. GRDP per capita is rounded to the nearest million rupiah.'));
  return root;
}

// -------------------------------------------------------------------- data
export function dataPage() {
  const root = frag('<div class="page"></div>');
  root.appendChild(pageHead('Data & downloads', 'Every figure on this site, as a spreadsheet-ready CSV. The files are made in your browser from '
    + 'the same numbers the charts draw — nothing is fetched, and nothing leaves your device.'));

  const card = frag(`<section class="card table-card"><div class="table-scroll"><table class="data-table">
    <thead><tr><th>Dataset</th><th>Years</th><th class="num">Rows</th><th>Columns</th><th>Source</th><th></th></tr></thead>
    <tbody></tbody></table></div></section>`);
  const tbody = card.querySelector('tbody');
  for (const ds of D.DATASETS) {
    tbody.appendChild(frag(`<tr><td><strong>${ds.name}</strong></td><td>${ds.years}</td><td class="num">${ds.rows}</td>
      <td>${ds.cols}</td><td>${ds.source}</td><td><button class="btn small" data-ds="${ds.id}">Download CSV</button></td></tr>`));
  }
  card.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ds]');
    if (!btn) return;
    const ds = D.DATASETS.find((x) => x.id === btn.dataset.ds);
    const blob = new Blob([D.datasetCsv(ds.id)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `nusastat-${ds.id}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    btn.textContent = 'Downloaded ✓';
    setTimeout(() => { btn.textContent = 'Download CSV'; }, 2000);
  });
  root.appendChild(card);

  root.appendChild(frag(`<section class="card"><h3>How to cite this site</h3>
    <p class="card-sub">NusaStat, Portal Statistik Indonesia — figures as published by Statistics Indonesia (BPS),
    Bank Indonesia and the World Bank, data vintage November 2026. Example citation: “Population 2024: 281.6 million
    (BPS mid-year estimate), via NusaStat.” Each dataset names its source in the table above.</p></section>`));
  return root;
}

// ------------------------------------------------------------------- about
export function about() {
  const root = frag('<div class="page"></div>');
  root.appendChild(pageHead('Sources & method', 'NusaStat is an independent, original statistics portal. It is not affiliated with Statistics '
    + 'Indonesia or any government body; it republishes their published figures with their sources named.'));

  root.appendChild(frag(`<section class="card"><h3>Sources</h3><dl class="facts">
    <div><dt>Statistics Indonesia (BPS)</dt><dd><span>Population censuses 2010 &amp; 2020; mid-year population estimates; GDP, inflation, unemployment and poverty releases; education and health statistics.</span></dd></div>
    <div><dt>Bank Indonesia</dt><dd><span>Foreign exchange reserves and the rupiah exchange rate; trade figures with BPS.</span></dd></div>
    <div><dt>World Bank</dt><dd><span>GDP in US dollars, health expenditure as a share of GDP, urban population share.</span></dd></div>
    <div><dt>Ministry of Health</dt><dd><span>Indonesian Nutrition Status Survey (SSGI) 2023 for stunting, wasting and underweight; Indonesian Health Profile 2023.</span></dd></div>
    <div><dt>WHO &amp; UN IGME</dt><dd><span>Maternal mortality (2020) and infant mortality (2023) estimates.</span></dd></div>
    <div><dt>APJII</dt><dd><span>Internet users as a share of the population, 2024.</span></dd></div>
    </dl></section>`));

  root.appendChild(frag(`<section class="card"><h3>Method &amp; notes</h3><ul class="notes">
    <li>Figures are the latest published at the time this site was built (November 2026). Years are labelled on every figure.</li>
    <li>Provincial populations are BPS 2024 mid-year estimates. They sum to 282.1 million against the national estimate of 281.6 million; the difference is rounding in the published provincial series.</li>
    <li>Money is in Indonesian rupiah unless marked US$. GRDP per capita by province is rounded to the nearest million rupiah and marked approximate.</li>
    <li>Population shares by age group are BPS 2024 estimates, rounded to one decimal place; they sum to 100.0%.</li>
    <li>This site works entirely offline: it makes no network request, loads no outside file, and stores nothing about its visitors.</li>
    </ul></section>`));

  root.appendChild(frag(`<section class="card"><h3>About NusaStat</h3>
    <p class="card-sub">NusaStat — from <i>nusa</i>, the Indonesian word for island — is an original design built
    for the make.fun “best national statistics site” competition. Its pages, charts, text and name are its own.
    Built with plain HTML, CSS and JavaScript; every chart is drawn in code from the published figures.</p></section>`));
  return root;
}
