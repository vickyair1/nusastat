[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/vickyair1/nusastat/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/vickyair1/nusastat/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# NusaStat — the national statistics portal of Indonesia

A complete, original national statistics site that runs offline in a desktop browser or on a phone
from its own static files. An entry for [make.fun's "Make the best national statistics site" bounty](https://make.fun/competitions/best-national-statistics-site-20261126-0539).

Indonesia in numbers: 281.6 million people, 38 provinces, 17,508 islands — population, economy,
health, education and regions, every figure published by Statistics Indonesia (BPS), Bank Indonesia
or the World Bank, and every dataset downloadable as CSV.

## What is in the site

- **8 linked pages**: Overview, Population, Economy, Health, Education, Regions, Data & downloads,
  Sources & method — every one reached from the top navigation on desktop and from the menu on a phone.
- **Real figures, nothing placeholder**: population 281.6m (2024), GDP Rp 22,139 trillion / US$ 1,396bn,
  growth 5.03%, inflation 1.57%, unemployment 4.91%, poverty 9.03%, life expectancy 74.0 years,
  literacy 97.4%, plus 38-province populations, age pyramid, sector shares, trade, schooling and health series.
- **Charts drawn in code**: GDP and population line charts, growth and trade column charts, a GDP-by-industry
  donut, a population pyramid and island-group bars — all inline SVG, no library, no network.
- **Controls that work**: a year-range selector that re-draws the GDP chart; economy tabs (Growth & GDP /
  Prices, jobs & poverty / Trade); province tables that sort by column and filter as you type; a province
  explorer (capital, area, density, GRDP per capita) for 10 featured provinces; dataset buttons that
  download a real CSV generated from the same numbers the charts draw.
- **Offline by construction**: no network request of any kind (verified in a headless browser — zero
  external requests), system fonts only, one data-URI favicon. Responsive down to a 360px phone.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

Open `http://localhost:8080` — or open `app/index.html` directly in a browser.

## Layout

- `app/` — the site: `index.html`, `style.css`, `main.js` (router), `views.js` (pages),
  `charts.js` (SVG chart builders), `data.js` (every published figure, with its source and year).
- `screenshots/` — 4 real renders: overview, population and economy at 1280×800, regions at 390×844 (phone).
- `main.ts` — the handover program: copies `app/` and `screenshots/` to `/output` and writes
  `/output/dossier.json` with the kit's `buildDossier`.
- `vendor/makefun-frontend.ts` — the kit's library, unchanged.
