// NusaStat charts — every chart on the site is drawn here as inline SVG,
// straight from the numbers in data.js. No chart library, no canvas, no
// network: the browser only ever renders elements this file creates.

const NS = 'http://www.w3.org/2000/svg';
const INK = '#0b3d4f';
const TEAL = '#1f7a6d';
const AMBER = '#c77f1a';
const GRID = '#e3ddd2';
const GREY = '#6b7280';
const RED = '#b3382e';

function node(tag, attrs, text) {
  const e = document.createElementNS(NS, tag);
  if (attrs) {
    for (const k of Object.keys(attrs)) e.setAttribute(k, attrs[k]);
  }
  if (text !== undefined && text !== null) e.textContent = text;
  return e;
}

function tickLabel(v) {
  return Math.abs(v) >= 1000
    ? v.toLocaleString('en-US', { maximumFractionDigits: 0 })
    : String(v);
}

// Five horizontal gridlines with y-axis labels, shared by line and column
// charts. y maps a value to pixels; span is [lo, hi]; fmt formats labels.
function gridlines(svg, y, span, x0, x1, fmt) {
  const [lo, hi] = span;
  const format = fmt || tickLabel;
  for (let i = 0; i <= 4; i++) {
    const v = lo + ((hi - lo) * i) / 4;
    const py = y(v);
    svg.appendChild(node('line', { x1: x0, y1: py, x2: x1, y2: py, stroke: GRID, 'stroke-width': 1 }));
    svg.appendChild(node('text', { x: x0 - 8, y: py + 4, 'text-anchor': 'end', 'font-size': 11, fill: GREY }, format(v)));
  }
}

// Line chart over [x, y] pairs. opts: w, h, ymin, ymax, yfmt, color, label.
export function lineChart(series, opts = {}) {
  const w = opts.w || 640;
  const h = opts.h || 260;
  const L = 52, R = w - 14, T = 18, B = h - 28;
  const xs = series.map((p) => p[0]);
  const ys = series.map((p) => p[1]);
  const xLo = Math.min(...xs), xHi = Math.max(...xs);
  const yLo = opts.ymin ?? Math.min(0, ...ys);
  let yHi = opts.ymax ?? Math.max(...ys);
  if (yHi === yLo) yHi = yLo + 1;
  const colour = opts.color || TEAL;
  const fmt = opts.yfmt || tickLabel;
  const px = (x) => L + ((x - xLo) / (xHi - xLo)) * (R - L);
  const py = (y) => T + (1 - (y - yLo) / (yHi - yLo)) * (B - T);

  const svg = node('svg', { viewBox: `0 0 ${w} ${h}`, role: 'img', 'aria-label': opts.label || 'line chart' });
  gridlines(svg, py, [yLo, yHi], L, R, fmt);

  const pts = series.map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`).join(' ');
  svg.appendChild(node('polygon', { points: `${L},${py(yLo)} ${pts} ${px(xHi)},${py(yLo)}`, fill: colour, opacity: 0.12 }));
  svg.appendChild(node('polyline', { points: pts, fill: 'none', stroke: colour, 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));

  // X labels: every other year when the series is long, else every year.
  const step = series.length > 8 ? 2 : 1;
  series.forEach(([x], i) => {
    if (i % step !== 0 && i !== series.length - 1) return;
    svg.appendChild(node('text', { x: px(x), y: h - 8, 'text-anchor': 'middle', 'font-size': 11, fill: GREY }, String(x)));
  });
  series.forEach(([x, y], i) => {
    svg.appendChild(node('circle', { cx: px(x), cy: py(y), r: 3.2, fill: '#fff', stroke: colour, 'stroke-width': 2 }));
    if (i !== 0 && i !== series.length - 1) return;
    const anchor = px(x) < 60 ? 'start' : px(x) > w - 60 ? 'end' : 'middle';
    svg.appendChild(node('text', { x: px(x), y: py(y) - 10, 'text-anchor': anchor, 'font-size': 12, 'font-weight': 700, fill: INK }, fmt(y)));
  });
  return svg;
}

// Horizontal bars. rows: [{label, value, color?}]. opts: w, barH, labelW, fmt, color.
export function barChart(rows, opts = {}) {
  const w = opts.w || 640;
  const barH = opts.barH || 26;
  const gap = 10;
  const labelW = opts.labelW || 210;
  const h = rows.length * (barH + gap) + 8;
  const top = Math.max(...rows.map((r) => r.value));
  const svg = node('svg', { viewBox: `0 0 ${w} ${h}`, role: 'img', 'aria-label': opts.label || 'bar chart' });
  rows.forEach((row, i) => {
    const y = 4 + i * (barH + gap);
    const width = Math.max(2, ((w - labelW - 64) * row.value) / top);
    svg.appendChild(node('text', { x: 0, y: y + barH / 2 + 4, 'font-size': 12.5, fill: INK }, row.label));
    svg.appendChild(node('rect', { x: labelW, y, width, height: barH, rx: 4, fill: row.color || opts.color || TEAL }));
    svg.appendChild(node('text', { x: labelW + width + 8, y: y + barH / 2 + 4, 'font-size': 12.5, 'font-weight': 700, fill: INK }, (opts.fmt || tickLabel)(row.value)));
  });
  return svg;
}

// Vertical columns. rows: [{label, value}] or grouped [{label, values: [...]}]
// with opts.groups and opts.groupColors. opts: w, h, yfmt, fmt.
export function columnChart(rows, opts = {}) {
  const w = opts.w || 640;
  const h = opts.h || 260;
  const L = 46, R = w - 10, T = 24, B = h - 28;
  const grouped = Array.isArray(rows[0]?.values);
  const all = rows.flatMap((r) => grouped ? r.values : [r.value]);
  const hi = Math.max(...all.map((v) => Math.abs(v)));
  const lo = Math.min(0, ...all);
  const py = (v) => T + (1 - (v - lo) / (hi - lo)) * (B - T);
  const svg = node('svg', { viewBox: `0 0 ${w} ${h}`, role: 'img', 'aria-label': opts.label || 'column chart' });
  gridlines(svg, py, [lo, hi], L, R, opts.yfmt);

  const slot = (R - L) / rows.length;
  const bw = grouped ? Math.min(24, slot * 0.34) : Math.min(46, slot * 0.62);
  rows.forEach((row, i) => {
    const vals = grouped ? row.values : [row.value];
    vals.forEach((v, j) => {
      const x = grouped
        ? L + i * slot + (slot - vals.length * bw - (vals.length - 1) * 4) / 2 + j * (bw + 4)
        : L + i * slot + (slot - bw) / 2;
      const top = py(Math.max(0, v));
      const height = Math.abs(py(v) - py(0));
      const colour = grouped ? (opts.groupColors?.[j] || TEAL) : (row.color || opts.color || TEAL);
      svg.appendChild(node('rect', { x, y: top, width: bw, height: Math.max(1.5, height), rx: 3, fill: v < 0 ? RED : colour }));
      if (grouped) return;
      svg.appendChild(node('text', {
        x: x + bw / 2, y: v < 0 ? py(v) + 14 : top - 6, 'text-anchor': 'middle',
        'font-size': 11, 'font-weight': 700, fill: INK,
      }, (opts.fmt || tickLabel)(v)));
    });
    svg.appendChild(node('text', { x: L + i * slot + slot / 2, y: h - 8, 'text-anchor': 'middle', 'font-size': 11, fill: GREY }, row.label));
  });
  if (grouped && opts.groups) {
    opts.groups.forEach((g, j) => {
      const x = L + j * 110;
      svg.appendChild(node('rect', { x, y: 2, width: 12, height: 12, rx: 2, fill: opts.groupColors?.[j] || TEAL }));
      svg.appendChild(node('text', { x: x + 17, y: 12, 'font-size': 11, fill: INK }, g));
    });
  }
  return svg;
}

// Donut with a legend beside it. rows: [{label, value, color}].
// Returns a <div class="donut-wrap">.
export function donut(rows, opts = {}) {
  const size = opts.size || 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const thick = 34;
  const total = rows.reduce((a, b) => a + b.value, 0);
  const svg = node('svg', { viewBox: `0 0 ${size} ${size}`, role: 'img', 'aria-label': opts.label || 'donut chart' });
  let angle = -Math.PI / 2;
  for (const row of rows) {
    const frac = row.value / total;
    const next = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(angle), y0 = cy + r * Math.sin(angle);
    const x1 = cx + r * Math.cos(next), y1 = cy + r * Math.sin(next);
    svg.appendChild(node('path', {
      d: `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`,
      fill: 'none', stroke: row.color || TEAL, 'stroke-width': thick,
    }));
    angle = next;
  }
  svg.appendChild(node('text', { x: cx, y: cy - 4, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: INK }, opts.centre || ''));
  svg.appendChild(node('text', { x: cx, y: cy + 16, 'text-anchor': 'middle', 'font-size': 11, fill: GREY }, opts.centreSub || ''));

  const wrap = document.createElement('div');
  wrap.className = 'donut-wrap';
  wrap.appendChild(svg);
  const legend = document.createElement('ul');
  legend.className = 'legend';
  for (const row of rows) {
    const li = document.createElement('li');
    const swatch = document.createElement('span');
    swatch.className = 'swatch';
    swatch.style.background = row.color || TEAL;
    li.appendChild(swatch);
    li.appendChild(document.createTextNode(`${row.label} — ${row.value}%`));
    legend.appendChild(li);
  }
  wrap.appendChild(legend);
  return wrap;
}

// Population pyramid. rows are [age group, male %, female %]: men grow
// left from the centre, women right, the age label between them.
export function pyramid(rows, opts = {}) {
  const w = opts.w || 640;
  const barH = 15, gap = 3;
  const h = rows.length * (barH + gap) + 34;
  const peak = Math.max(...rows.map(([, m, f]) => Math.max(m, f)));
  const mid = w / 2;
  const svg = node('svg', { viewBox: `0 0 ${w} ${h}`, role: 'img', 'aria-label': opts.label || 'population pyramid' });
  svg.appendChild(node('text', { x: mid - 70, y: 14, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: TEAL }, 'Male %'));
  svg.appendChild(node('text', { x: mid + 70, y: 14, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: AMBER }, 'Female %'));
  rows.forEach(([group, m, f], i) => {
    const y = 22 + i * (barH + gap);
    const mw = (mid - 34) * (m / peak);
    const fw = (mid - 34) * (f / peak);
    svg.appendChild(node('rect', { x: mid - 30 - mw, y, width: mw, height: barH, rx: 2, fill: TEAL }));
    svg.appendChild(node('rect', { x: mid + 30, y, width: fw, height: barH, rx: 2, fill: AMBER }));
    svg.appendChild(node('text', { x: mid, y: y + barH / 2 + 4, 'text-anchor': 'middle', 'font-size': 11, fill: GREY }, group));
  });
  return svg;
}
