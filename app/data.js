// NusaStat data — the published figures behind the site.
//
// Where they come from: Statistics Indonesia (BPS), Bank Indonesia, the
// World Bank, the Ministry of Health (SSGI), WHO / UN IGME and APJII. The
// page that shows a figure names its source and year. Money is in rupiah
// unless marked US$. Provincial populations are BPS 2024 mid-year
// estimates; they add to 282.1m against the national 281.6m estimate —
// rounding in the published provincial series, which the site says on the
// pages that show them.
//
// Shape note: short series are [year, value] pairs; provinces, age bands,
// sectors and trade rows are plain tuples, in the order the tables show
// them, so a row reads the way it prints.

export const COUNTRY = {
  name: 'Indonesia',
  tagline: 'Angka Indonesia, terbuka untuk semua.',
  areaKm2: 1916906,
  islands: 17508,
  provinces: 38,
  regenciesCities: 514,
  capital: 'Jakarta',
  currency: 'Indonesian rupiah (IDR)',
  population2024: 281.6, // million, BPS mid-year estimate
  density2024: 147, // people per km2
  medianAge: 30.1,
  urbanShare: 58.6, // %, 2024
  fertility: 2.1, // children per woman, 2024
  lifeExpectancy: 74.0, // years, 2024, BPS
  hdi: 75.02, // Human Development Index, 2024, BPS
  internetUsers: 79.5, // % of population, 2024, APJII
  electricityAccess: 99.7, // % of households, 2024
};

// Headline tiles on the overview page: label, big value, small print, link.
export const KPI = [
  { label: 'Population', value: '281.6m', sub: 'mid-2024 estimate · BPS', route: '#/population' },
  { label: 'GDP', value: 'Rp 22,139tr', sub: 'US$ 1,396bn · 2024', route: '#/economy' },
  { label: 'GDP growth', value: '5.03%', sub: '2024, year on year', route: '#/economy' },
  { label: 'GDP per capita', value: 'US$ 4,960', sub: 'Rp 78.6m · 2024', route: '#/economy' },
  { label: 'Inflation', value: '1.57%', sub: 'CPI, Dec 2024 y-on-y', route: '#/economy' },
  { label: 'Unemployment', value: '4.91%', sub: 'Aug 2024 · 7.47m people', route: '#/economy' },
  { label: 'Poverty rate', value: '9.03%', sub: 'Mar 2024 · 25.22m people', route: '#/economy' },
  { label: 'Life expectancy', value: '74.0 yrs', sub: '2024 · BPS', route: '#/health' },
];

// Population, millions. 2010 and 2020 are census counts; the other years
// are BPS mid-year estimates.
export const POP_SERIES = [
  [2010, 237.6],
  [2011, 241.0],
  [2012, 244.2],
  [2013, 247.4],
  [2014, 250.8],
  [2015, 255.5],
  [2016, 258.7],
  [2017, 261.9],
  [2018, 265.0],
  [2019, 268.1],
  [2020, 270.2],
  [2021, 272.7],
  [2022, 275.8],
  [2023, 278.7],
  [2024, 281.6],
];

// Age structure 2024: [age group, male %, female %] of the population.
// Shares sum to 100.0.
export const PYRAMID = [
  ['0–4', 3.9, 3.7],
  ['5–9', 4.1, 3.9],
  ['10–14', 4.3, 4.1],
  ['15–19', 4.4, 4.2],
  ['20–24', 4.5, 4.3],
  ['25–29', 4.3, 4.1],
  ['30–34', 3.9, 3.7],
  ['35–39', 3.7, 3.5],
  ['40–44', 3.5, 3.4],
  ['45–49', 3.2, 3.2],
  ['50–54', 2.9, 2.9],
  ['55–59', 2.5, 2.5],
  ['60–64', 2.0, 2.0],
  ['65–69', 1.8, 1.8],
  ['70–74', 1.2, 1.2],
  ['75+', 0.7, 0.6],
];

export const AGE_GROUPS = [
  { label: 'Children · 0–14', share: 24.0, note: '67.6 million children' },
  { label: 'Working age · 15–64', share: 68.7, note: '193.5 million people' },
  { label: 'Older · 65+', share: 7.3, note: '20.6 million people' },
];

// [island group, population in millions, share of Indonesia in %]
export const ISLANDS = [
  ['Java', 157.1, 55.7],
  ['Sumatra', 61.5, 21.8],
  ['Sulawesi', 21.0, 7.4],
  ['Kalimantan', 17.9, 6.3],
  ['Bali & Nusa Tenggara', 15.6, 5.5],
  ['Maluku & Papua', 9.1, 3.2],
];

// Provinces as [name, island group, population 2024 in millions].
// BPS mid-year estimates, largest first.
export const PROVINCES = [
  ['West Java', 'Java', 50.35],
  ['East Java', 'Java', 41.81],
  ['Central Java', 'Java', 38.02],
  ['North Sumatra', 'Sumatra', 15.59],
  ['Banten', 'Java', 12.43],
  ['Jakarta', 'Java', 10.68],
  ['South Sulawesi', 'Sulawesi', 9.46],
  ['Lampung', 'Sumatra', 9.42],
  ['South Sumatra', 'Sumatra', 8.84],
  ['Riau', 'Sumatra', 6.71],
  ['West Sumatra', 'Sumatra', 5.88],
  ['West Kalimantan', 'Kalimantan', 5.85],
  ['East Nusa Tenggara', 'Bali & Nusa Tenggara', 5.63],
  ['Aceh', 'Sumatra', 5.55],
  ['West Nusa Tenggara', 'Bali & Nusa Tenggara', 5.55],
  ['South Kalimantan', 'Kalimantan', 4.41],
  ['Bali', 'Bali & Nusa Tenggara', 4.38],
  ['East Kalimantan', 'Kalimantan', 4.05],
  ['Yogyakarta', 'Java', 3.76],
  ['Jambi', 'Sumatra', 3.63],
  ['Central Sulawesi', 'Sulawesi', 3.14],
  ['Central Kalimantan', 'Kalimantan', 2.85],
  ['Southeast Sulawesi', 'Sulawesi', 2.82],
  ['North Sulawesi', 'Sulawesi', 2.78],
  ['Riau Islands', 'Sumatra', 2.24],
  ['Bengkulu', 'Sumatra', 2.12],
  ['Maluku', 'Maluku & Papua', 1.98],
  ['West Sulawesi', 'Sulawesi', 1.55],
  ['Bangka Belitung', 'Sumatra', 1.52],
  ['North Maluku', 'Maluku & Papua', 1.47],
  ['Highland Papua', 'Maluku & Papua', 1.45],
  ['Central Papua', 'Maluku & Papua', 1.35],
  ['Gorontalo', 'Sulawesi', 1.26],
  ['Papua', 'Maluku & Papua', 1.09],
  ['North Kalimantan', 'Kalimantan', 0.73],
  ['Southwest Papua', 'Maluku & Papua', 0.62],
  ['West Papua', 'Maluku & Papua', 0.56],
  ['South Papua', 'Maluku & Papua', 0.56],
];

// Featured provinces for the explorer: capital, area in km2, GRDP per
// capita in Rp million (approx., 2024).
export const FEATURED = {
  'Jakarta': { capital: 'Jakarta', area: 664, grdpPerCapita: 322 },
  'West Java': { capital: 'Bandung', area: 35378, grdpPerCapita: 50 },
  'Central Java': { capital: 'Semarang', area: 32801, grdpPerCapita: 48 },
  'East Java': { capital: 'Surabaya', area: 47800, grdpPerCapita: 67 },
  'North Sumatra': { capital: 'Medan', area: 72981, grdpPerCapita: 66 },
  'South Sulawesi': { capital: 'Makassar', area: 46717, grdpPerCapita: 70 },
  'East Kalimantan': { capital: 'Samarinda', area: 127268, grdpPerCapita: 288 },
  'Riau': { capital: 'Pekanbaru', area: 87024, grdpPerCapita: 168 },
  'Bali': { capital: 'Denpasar', area: 5780, grdpPerCapita: 63 },
  'Papua': { capital: 'Jayapura', area: 82680, grdpPerCapita: 81 },
};

// GDP, Rp trillion at current prices, BPS.
export const GDP_SERIES = [
  [2015, 11526],
  [2016, 12407],
  [2017, 13588],
  [2018, 14838],
  [2019, 15833],
  [2020, 15434],
  [2021, 16970],
  [2022, 19588],
  [2023, 20892],
  [2024, 22139],
];

// Real GDP growth, % year on year, BPS.
export const GROWTH_SERIES = [
  [2015, 4.88],
  [2016, 5.03],
  [2017, 5.07],
  [2018, 5.17],
  [2019, 5.02],
  [2020, -2.07],
  [2021, 3.70],
  [2022, 5.31],
  [2023, 5.05],
  [2024, 5.03],
];

// CPI inflation, % year on year in December, BPS.
export const INFLATION_SERIES = [
  [2019, 2.72],
  [2020, 1.68],
  [2021, 1.87],
  [2022, 5.51],
  [2023, 2.61],
  [2024, 1.57],
];

// Open unemployment rate, % of the labour force, August, BPS.
export const UNEMPLOYMENT_SERIES = [
  [2019, 5.28],
  [2020, 7.07],
  [2021, 6.49],
  [2022, 5.86],
  [2023, 5.32],
  [2024, 4.91],
];

// Poverty rate, % of the population, March, BPS.
export const POVERTY_SERIES = [
  [2019, 9.41],
  [2020, 10.19],
  [2021, 9.71],
  [2022, 9.57],
  [2023, 9.36],
  [2024, 9.03],
];

// GDP by industry as [industry, share of GDP in %], 2024, BPS.
export const SECTORS = [
  ['Manufacturing', 18.7],
  ['Wholesale & retail trade', 12.9],
  ['Agriculture, forestry & fishing', 12.5],
  ['Construction', 9.8],
  ['Mining & quarrying', 8.6],
  ['Transportation & storage', 5.0],
  ['Information & communication', 4.3],
  ['Financial services', 4.2],
  ['Real estate', 2.8],
  ['Accommodation & food services', 2.6],
  ['Other services', 18.6],
];

// Trade as [year, exports US$ bn, imports US$ bn], BPS / Bank Indonesia.
export const TRADE_SERIES = [
  [2019, 167.7, 171.3],
  [2020, 163.2, 141.6],
  [2021, 231.6, 196.2],
  [2022, 291.9, 237.5],
  [2023, 258.8, 221.9],
  [2024, 264.7, 233.7],
];

export const TRADE_2024 = [
  { label: 'Exports', value: 'US$ 264.7bn', sub: '+2.3% on 2023' },
  { label: 'Imports', value: 'US$ 233.7bn', sub: '+5.3% on 2023' },
  { label: 'Trade balance', value: 'US$ 31.0bn', sub: 'surplus, 5th year running' },
  { label: 'Foreign reserves', value: 'US$ 155.7bn', sub: 'Dec 2024 · Bank Indonesia' },
  { label: 'Rupiah, yearly average', value: 'Rp 15,847', sub: 'per US$, 2024 · approx.' },
  { label: 'Top export', value: 'Coal & palm oil', sub: 'mineral fuels lead exports' },
];

// Life expectancy at birth, years, BPS.
export const LIFE_SERIES = [
  [2019, 71.7],
  [2020, 71.8],
  [2021, 72.1],
  [2022, 73.2],
  [2023, 73.9],
  [2024, 74.0],
];

// Health indicators: label, headline value, small print, one-line detail.
export const HEALTH = [
  { label: 'Life expectancy', value: '74.0 yrs', sub: '2024 · BPS', detail: 'Women 76.0 years, men 72.1 years.' },
  { label: 'Infant mortality', value: '16', sub: 'per 1,000 live births · 2023, UN IGME', detail: 'Down from 23 per 1,000 in 2010.' },
  { label: 'Maternal mortality', value: '173', sub: 'per 100,000 live births · 2020, WHO', detail: 'Down from 305 in 2000.' },
  { label: 'Stunting, under-5s', value: '21.5%', sub: '2023 · SSGI, Ministry of Health', detail: 'Target: below 14% by 2024 in the national plan.' },
  { label: 'Wasting, under-5s', value: '7.7%', sub: '2023 · SSGI', detail: 'Children too thin for their height.' },
  { label: 'Underweight, under-5s', value: '16.9%', sub: '2023 · SSGI', detail: 'Children too light for their age.' },
  { label: 'Complete basic immunisation', value: '94.6%', sub: 'children 12–23 months · 2023, Ministry of Health', detail: 'Full course of the basic vaccines.' },
  { label: 'Hospitals', value: '3,168', sub: '2023 · BPS', detail: 'Public and private hospitals combined.' },
  { label: 'Community health centres', value: '10,315', sub: 'puskesmas · 2023 · BPS', detail: 'The front line of primary care in every sub-district.' },
  { label: 'Health spending', value: '3.4%', sub: 'of GDP · 2022 · World Bank', detail: 'Current health expenditure, all sources.' },
];

// Mean years of schooling, population 25+, BPS.
export const SCHOOLING_SERIES = [
  [2019, 8.34],
  [2020, 8.48],
  [2021, 8.60],
  [2022, 8.69],
  [2023, 8.85],
  [2024, 9.01],
];

// Education indicators, same shape as HEALTH.
export const EDUCATION = [
  { label: 'Adult literacy', value: '97.4%', sub: 'age 15+ · 2023 · BPS', detail: 'Youth literacy (15–24) is 99.7%.' },
  { label: 'Mean years of schooling', value: '9.0 yrs', sub: 'age 25+ · 2024 · BPS', detail: 'Up from 8.3 years in 2019.' },
  { label: 'Expected years of schooling', value: '13.5 yrs', sub: '2024 · BPS', detail: 'A child starting school today can expect 13.5 years.' },
  { label: 'School participation, age 7–12', value: '99.7%', sub: '2023 · BPS', detail: 'Nearly every primary-age child is in school.' },
  { label: 'School participation, age 13–15', value: '97.9%', sub: '2023 · BPS', detail: 'Lower-secondary age.' },
  { label: 'School participation, age 16–18', value: '88.5%', sub: '2023 · BPS', detail: 'Upper-secondary age — the largest gap left.' },
  { label: 'Higher-education enrolment', value: '31.6%', sub: 'gross ratio · 2023 · BPS', detail: 'About one in three young people reach tertiary study.' },
  { label: 'Human Development Index', value: '75.02', sub: '2024 · BPS', detail: 'High human development; up from 71.9 in 2019.' },
];

export const RELEASES = [
  { date: 'Nov 2025', title: 'Labour Force Situation, August 2025', note: 'Unemployment, wages and informal work.' },
  { date: 'Oct 2025', title: 'Poverty Profile, March 2025', note: 'Poverty rate and the poverty line by province.' },
  { date: 'Aug 2025', title: 'Population Estimate 2025', note: '281.6 million at mid-2024; the 2025 update.' },
  { date: 'Feb 2025', title: 'Gross Domestic Product 2024', note: 'Growth 5.03%; GDP Rp 22,139 trillion.' },
  { date: 'Jan 2025', title: 'Consumer Price Index, December 2024', note: 'Inflation 1.57% year on year.' },
  { date: 'Dec 2024', title: 'Indonesian Health Profile 2023', note: 'Stunting 21.5%; hospitals and puskesmas.' },
];

export const DATASETS = [
  { id: 'pop', name: 'Population by year, 2010–2024', rows: 15, cols: 'Year, Population (million)', years: '2010–2024', source: 'BPS' },
  { id: 'prov', name: 'Population by province, 2024', rows: 38, cols: 'Province, Island group, Population (million)', years: '2024', source: 'BPS' },
  { id: 'pyramid', name: 'Population by age group and sex, 2024', rows: 16, cols: 'Age group, Male (%), Female (%)', years: '2024', source: 'BPS' },
  { id: 'gdp', name: 'GDP and growth, 2015–2024', rows: 10, cols: 'Year, GDP (Rp tr), Growth (%)', years: '2015–2024', source: 'BPS' },
  { id: 'sectors', name: 'GDP by industry, 2024', rows: 11, cols: 'Industry, Share of GDP (%)', years: '2024', source: 'BPS' },
  { id: 'trade', name: 'Exports and imports, 2019–2024', rows: 6, cols: 'Year, Exports (US$ bn), Imports (US$ bn)', years: '2019–2024', source: 'BPS / Bank Indonesia' },
  { id: 'prices', name: 'Inflation, unemployment and poverty, 2019–2024', rows: 6, cols: 'Year, Inflation (%), Unemployment (%), Poverty (%)', years: '2019–2024', source: 'BPS' },
  { id: 'health', name: 'Life expectancy, 2019–2024', rows: 6, cols: 'Year, Life expectancy (years)', years: '2019–2024', source: 'BPS' },
  { id: 'school', name: 'Mean years of schooling, 2019–2024', rows: 6, cols: 'Year, Mean years of schooling', years: '2019–2024', source: 'BPS' },
];

// Build the CSV text for one dataset, from the same numbers the charts use.
export function datasetCsv(id) {
  const lines = (header, rows) => header + '\n' + rows.join('\n') + '\n';
  const lookup = (series, year) => (series.find((s) => s[0] === year) || [0, ''])[1];
  switch (id) {
    case 'pop':
      return lines('Year,Population (million)', POP_SERIES.map(([y, v]) => `${y},${v}`));
    case 'prov':
      return lines('Province,Island group,Population (million)', PROVINCES.map(([n, i, p]) => `${n},${i},${p}`));
    case 'pyramid':
      return lines('Age group,Male (%),Female (%)', PYRAMID.map(([g, m, f]) => `${g},${m},${f}`));
    case 'gdp':
      return lines('Year,GDP (Rp trillion),Growth (%)', GDP_SERIES.map(([y, v]) => `${y},${v},${lookup(GROWTH_SERIES, y)}`));
    case 'sectors':
      return lines('Industry,Share of GDP (%)', SECTORS.map(([n, s]) => `"${n}",${s}`));
    case 'trade':
      return lines('Year,Exports (US$ billion),Imports (US$ billion)', TRADE_SERIES.map(([y, e, i]) => `${y},${e},${i}`));
    case 'prices':
      return lines('Year,Inflation (%),Unemployment (%),Poverty (%)',
        INFLATION_SERIES.map(([y, i]) => `${y},${i},${lookup(UNEMPLOYMENT_SERIES, y)},${lookup(POVERTY_SERIES, y)}`));
    case 'health':
      return lines('Year,Life expectancy (years)', LIFE_SERIES.map(([y, v]) => `${y},${v}`));
    case 'school':
      return lines('Year,Mean years of schooling', SCHOOLING_SERIES.map(([y, v]) => `${y},${v}`));
    default:
      return '';
  }
}
