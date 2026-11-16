/* The Egyptian Cubit Ruler — the royal cubit divided into 28 fingers.
   Values from Clea's CAD studies (2012-2014). Honest math, no fudge factors. */

const FINGER_IN = 0.74064375;          // 11.8503 in / 16 fingers
const FINGER_CM = FINGER_IN * 2.54;    // 1.88124 cm
const CUBIT = 28;                       // fingers
const FOOT = 16;                        // Egyptian foot mark
const REMEN = 20;                       // remen mark
const PHI = 1.6180339887;
const PHI_POINT = FOOT + (CUBIT - FOOT) / PHI; // 16 + 12/phi = 23.42

/* The 28 gods of the cubit, from E.A. Wallis Budge, The Gods of the Egyptians,
   Vol. 2, pp. 291-292. Budge gives each name and hieroglyph; meanings are his
   where noted, and marked uncertain where they are not. */
const MARKS = {
  1:  { name: 'Uu', note: 'Uu (two chicks). Value ww/uu; Sumerian value 20, the god Shamash. Finger 1, the base unit of the ruler: 0.7406 in · 1.881 cm.' },
  2:  { name: 'Amsu', note: 'Amsu (Min). Fertility, virility.' },
  3:  { name: 'Sheps', note: 'Sheps. Noble.' },
  4:  { name: 'Her-aua', note: 'Her-aua. Meaning uncertain; possibly a form of Horus, the falcon.' },
  5:  { name: 'An-Her', note: 'An-Her (Onuris). He who brings back the distant one.' },
  6:  { name: 'Seb', note: 'Seb (the star). A star-god, distinct from Seb the bird at mark 25.' },
  7:  { name: 'Septu', note: 'Septu (Sopdu). Skilled one, falcon of the east.' },
  8:  { name: 'Hak', note: 'Hak (Hakau). Meaning uncertain; possibly "the magics," plural of Heka. Budge himself put a question mark after this name.' },
  9:  { name: 'Ar-ren-f-tchesef', note: 'Ar-ren-f-tchesef. He who makes his own name.' },
  10: { name: 'Maa-en-tef', note: 'Maa-en-tef. He who sees his father.' },
  11: { name: 'Armaua', note: 'Armaua. Meaning uncertain; possibly a form of Horus, "he of the two arms."' },
  12: { name: 'Heq', note: 'Heq (Heka). Magic, ruler.' },
  13: { name: 'Sep', note: 'Sep. Budge links Sep with Anubis in the Underworld; Sep is one of the localities where Anubis was worshipped.' },
  14: { name: 'Tehuti', note: 'Tehuti (Thoth). Wisdom, writing, the moon.' },
  15: { name: 'Qebhsennuf', note: 'Qebhsennuf (Qebehsenuef). Guards the intestines.' },
  16: { name: 'Tuamatef', note: 'Tuamatef (Duamutef). Guards the stomach. The Egyptian foot mark: 11.8503 in · 30.10 cm, related to the equatorial measure of the earth.' },
  17: { name: 'Hap', note: 'Hap (Hapi). Guards the lungs.' },
  18: { name: 'Mest', note: 'Mest (Imsety). Guards the liver.' },
  19: { name: 'Heru', note: 'Heru (Horus). The distant one, the falcon.' },
  20: { name: 'Nebt-het', note: 'Nebt-het (Nephthys). Mistress of the House. The remen mark: 20 fingers, half the diagonal of the royal-cubit square.' },
  21: { name: 'Set', note: 'Set. Storm, chaos.' },
  22: { name: 'Ast', note: 'Ast (Isis). The throne, great mother.' },
  23: { name: 'Asar', note: 'Asar (Osiris). The throne, lord of the dead.' },
  24: { name: 'Nut', note: 'Nut. Sky. The Small cubit (meh nedjes), the documented name for this mark. Clea reads it as the phi mark: 16 + 12/φ ≈ 23.4, rounding to the 24th mark.' },
  25: { name: 'Seb', note: 'Seb (Geb, the bird or goose). Earth. Distinct from Seb the star at mark 6.' },
  26: { name: 'Khent', note: 'Khent. Foremost one.' },
  27: { name: 'Shu', note: 'Shu. Air, dryness, light.' },
  28: { name: 'Ra', note: 'Ra. The sun, creator and supreme god. The royal cubit: 20.738 in · 52.67 cm. 7 palms × 4 fingers = 28 fingers.' },
};

const KEY_MARKS = [1, 16, 20, 24, 28];

function fmt(n, max = 4) {
  if (!isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 10000 || abs < 0.0001) return n.toExponential(3);
  return parseFloat(n.toPrecision(max)).toString();
}

function inToCm(i) { return i * 2.54; }

/* ---- 28-mark ruler ---- */
const ruler = document.getElementById('ruler');
const detailTitle = document.getElementById('detail-title');
const detailBody = document.getElementById('detail-body');

function showDetail(f) {
  const m = MARKS[f];
  if (!m) return;
  detailTitle.textContent = m.name;
  detailBody.innerHTML =
    '<p>' + m.note + '</p>' +
    '<p class="dim">' + f + ' fingers · ' + fmt(f * FINGER_IN) + ' in · ' + fmt(f * FINGER_CM) + ' cm</p>';
}

function buildRuler() {
  ruler.innerHTML = '';
  for (let f = 1; f <= CUBIT; f++) {
    const cell = document.createElement('div');
    cell.className = 'mark' + (KEY_MARKS.includes(f) ? ' key' : '');
    cell.dataset.f = f;
    const num = document.createElement('span');
    num.className = 'num';
    num.textContent = f;
    cell.appendChild(num);
    if (KEY_MARKS.includes(f)) {
      const lab = document.createElement('span');
      lab.className = 'lab';
      lab.textContent = MARKS[f].name.split(' ')[0];
      cell.appendChild(lab);
    }
    cell.addEventListener('click', () => {
      document.querySelectorAll('.mark').forEach(c => c.classList.remove('active'));
      cell.classList.add('active');
      showDetail(f);
    });
    ruler.appendChild(cell);
  }
  // highlight the exact phi point (23.42) as a thin marker
  const phi = document.createElement('div');
  phi.className = 'phi-marker';
  phi.style.left = (PHI_POINT / CUBIT * 100) + '%';
  phi.title = 'Exact phi point: ' + fmt(PHI_POINT) + ' fingers';
  ruler.appendChild(phi);
}

/* ---- harmonic cascade ---- */
const cascade = document.getElementById('cascade');

function buildCascade() {
  cascade.innerHTML = '';
  for (let n = 1; n <= 15; n++) {
    const frac = n / (n + 1);
    const row = document.createElement('div');
    row.className = 'casc-row';
    const lab = document.createElement('span');
    lab.className = 'casc-lab';
    lab.textContent = n + ' ÷ ' + (n + 1);
    const bar = document.createElement('div');
    bar.className = 'casc-bar';
    const fill = document.createElement('div');
    fill.className = 'casc-fill';
    fill.style.width = (frac * 100) + '%';
    bar.appendChild(fill);
    const val = document.createElement('span');
    val.className = 'casc-val';
    val.textContent = fmt(frac) + ' · ' + fmt(frac * FINGER_IN) + ' in';
    row.appendChild(lab);
    row.appendChild(bar);
    row.appendChild(val);
    cascade.appendChild(row);
  }
}

/* ---- Eye of Horus fractions ---- */
const horus = document.getElementById('horus');
const HORUS = [
  { f: '1/2',  v: 1 / 2 },
  { f: '1/4',  v: 1 / 4 },
  { f: '1/8',  v: 1 / 8 },
  { f: '1/16', v: 1 / 16 },
  { f: '1/32', v: 1 / 32 },
  { f: '1/64', v: 1 / 64 },
];

function buildHorus() {
  horus.innerHTML = '';
  HORUS.forEach(h => {
    const cell = document.createElement('div');
    cell.className = 'horus-cell';
    const frac = document.createElement('div');
    frac.className = 'horus-frac';
    frac.textContent = h.f;
    const bar = document.createElement('div');
    bar.className = 'horus-bar';
    const fill = document.createElement('div');
    fill.className = 'horus-fill';
    fill.style.width = (h.v * 100) + '%';
    bar.appendChild(fill);
    cell.appendChild(frac);
    cell.appendChild(bar);
    horus.appendChild(cell);
  });
  const sum = document.createElement('div');
  sum.className = 'horus-sum';
  sum.textContent = 'Sum = 63/64 · missing 1/64 (Thoth magic)';
  horus.appendChild(sum);
}

/* ---- 1/7 hieroglyph column ---- */
const column7 = document.getElementById('column7');
const SEVENTH = CUBIT / 7; // 4 fingers

function buildColumn7() {
  const wrap = document.createElement('div');
  wrap.className = 'col7-wrap';
  const cubitBar = document.createElement('div');
  cubitBar.className = 'col7-cubit';
  cubitBar.title = 'Royal cubit: ' + fmt(CUBIT * FINGER_IN) + ' in';
  const col = document.createElement('div');
  col.className = 'col7-col';
  col.style.width = (SEVENTH / CUBIT * 100) + '%';
  col.title = '1/7 column: ' + fmt(SEVENTH * FINGER_IN) + ' in · ' + fmt(SEVENTH * FINGER_CM) + ' cm';
  cubitBar.appendChild(col);
  wrap.appendChild(cubitBar);
  const lab = document.createElement('p');
  lab.className = 'col7-lab';
  lab.textContent = '1/7 of the cubit = ' + SEVENTH + ' fingers = ' + fmt(SEVENTH * FINGER_IN) + ' in = ' + fmt(SEVENTH * FINGER_CM) + ' cm';
  wrap.appendChild(lab);
  column7.appendChild(wrap);
}

/* ---- Old Kingdom canon: 6×6 division of the cubit ---- */
const canonGrid = document.getElementById('canonGrid');
const canonMath = document.getElementById('canonMath');
const SIXTH = CUBIT / 6; // 4.667 fingers

function buildCanon() {
  canonGrid.innerHTML = '';
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const cell = document.createElement('div');
      cell.className = 'canon-cell';
      cell.title = '1/6 cubit = ' + fmt(SIXTH) + ' fingers = ' + fmt(SIXTH * FINGER_IN) + ' in = ' + fmt(SIXTH * FINGER_CM) + ' cm';
      canonGrid.appendChild(cell);
    }
  }
  canonMath.textContent =
    '1/6 cubit = ' + fmt(SIXTH) + ' fingers = ' + fmt(SIXTH * FINGER_IN) + ' in = ' + fmt(SIXTH * FINGER_CM) + ' cm · ' +
    '18 squares = 3 cubits = ' + fmt(3 * CUBIT * FINGER_IN) + ' in = ' + fmt(3 * CUBIT * FINGER_CM) + ' cm';
}

buildRuler();
buildCascade();
buildHorus();
buildColumn7();
buildCanon();
showDetail(CUBIT);
