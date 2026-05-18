const PERSONA_SVGS = {
  default: `<svg width="80" height="96" viewBox="0 0 44 52" style="image-rendering:pixelated">
    <rect x="6" y="2" width="32" height="28" rx="2" fill="#1F2937" stroke="#9CA3AF" stroke-width="1.5"/>
    <rect x="12" y="10" width="6" height="6" fill="#D1D5DB"/>
    <rect x="26" y="10" width="6" height="6" fill="#D1D5DB"/>
    <rect class="pupil-l" x="14" y="12" width="3" height="3" fill="#0F172A"/>
    <rect class="pupil-r" x="28" y="12" width="3" height="3" fill="#0F172A"/>
    <rect x="14" y="22" width="4" height="3" fill="#D1D5DB"/>
    <rect x="18" y="25" width="8" height="3" fill="#D1D5DB"/>
    <rect x="26" y="22" width="4" height="3" fill="#D1D5DB"/>
    <rect x="10" y="32" width="24" height="16" rx="2" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
    <rect x="13" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
    <rect x="25" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
  </svg>`,

  senior: `<svg width="80" height="96" viewBox="0 0 44 52" style="image-rendering:pixelated">
    <rect x="6" y="2" width="32" height="28" rx="2" fill="#1F2937" stroke="#9CA3AF" stroke-width="1.5"/>
    <rect x="8" y="2" width="28" height="4" fill="#E5E7EB"/>
    <rect x="6" y="4" width="4" height="4" fill="#E5E7EB"/>
    <rect x="34" y="4" width="4" height="4" fill="#E5E7EB"/>
    <rect x="12" y="11" width="6" height="5" fill="#D1D5DB"/>
    <rect x="26" y="11" width="6" height="5" fill="#D1D5DB"/>
    <rect class="pupil-l" x="14" y="12" width="3" height="3" fill="#0F172A"/>
    <rect class="pupil-r" x="28" y="12" width="3" height="3" fill="#0F172A"/>
    <rect x="10" y="9" width="4" height="1" fill="#9CA3AF" opacity="0.5"/>
    <rect x="30" y="9" width="4" height="1" fill="#9CA3AF" opacity="0.5"/>
    <rect x="14" y="22" width="4" height="3" fill="#D1D5DB"/>
    <rect x="18" y="25" width="8" height="3" fill="#D1D5DB"/>
    <rect x="26" y="22" width="4" height="3" fill="#D1D5DB"/>
    <rect x="10" y="32" width="24" height="16" rx="2" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
    <rect x="13" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
    <rect x="25" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
  </svg>`,

  busy: `<svg width="80" height="96" viewBox="0 0 44 52" style="image-rendering:pixelated">
    <rect x="6" y="2" width="32" height="28" rx="2" fill="#1F2937" stroke="#9CA3AF" stroke-width="1.5"/>
    <rect x="12" y="10" width="6" height="6" fill="#D1D5DB"/>
    <rect x="26" y="10" width="6" height="6" fill="#D1D5DB"/>
    <rect class="pupil-l" x="14" y="12" width="3" height="3" fill="#0F172A"/>
    <rect class="pupil-r" x="28" y="12" width="3" height="3" fill="#0F172A"/>
    <rect x="14" y="22" width="4" height="3" fill="#D1D5DB"/>
    <rect x="18" y="25" width="8" height="3" fill="#D1D5DB"/>
    <rect x="26" y="22" width="4" height="3" fill="#D1D5DB"/>
    <rect x="34" y="8" width="4" height="6" rx="2" fill="#9CA3AF" opacity="0.7"/>
    <rect x="10" y="32" width="24" height="16" rx="2" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
    <rect x="13" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
    <rect x="25" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
  </svg>`,

  thinking: `<svg width="80" height="96" viewBox="0 0 62 52" style="image-rendering:pixelated">
    <rect x="6" y="2" width="32" height="28" rx="2" fill="#1F2937" stroke="#9CA3AF" stroke-width="1.5"/>
    <rect x="12" y="12" width="6" height="6" fill="#D1D5DB"/>
    <rect x="26" y="12" width="6" height="6" fill="#D1D5DB"/>
    <rect x="12" y="14" width="3" height="3" fill="#0F172A"/>
    <rect x="26" y="14" width="3" height="3" fill="#0F172A"/>
    <rect x="14" y="22" width="4" height="3" fill="#6B7280"/>
    <rect x="18" y="24" width="4" height="3" fill="#6B7280"/>
    <rect x="22" y="22" width="4" height="3" fill="#6B7280"/>
    <rect x="10" y="32" width="24" height="16" rx="2" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
    <rect x="36" y="28" width="14" height="18" rx="1" fill="#111827" stroke="#4B5563" stroke-width="1"/>
    <rect x="38" y="31" width="10" height="2" fill="#6B7280" opacity="0.6"/>
    <rect x="38" y="35" width="8" height="2" fill="#6B7280" opacity="0.4"/>
    <rect x="38" y="39" width="9" height="2" fill="#6B7280" opacity="0.4"/>
    <rect x="13" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
    <rect x="25" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
    <circle cx="47" cy="11" r="4" fill="#111827" stroke="#9CA3AF" stroke-width="1"/>
    <text x="45" y="14" font-size="5" fill="#9CA3AF" font-family="monospace">?</text>
    <circle cx="43" cy="20" r="2" fill="#9CA3AF" opacity="0.4"/>
    <circle cx="45" cy="16" r="1.5" fill="#9CA3AF" opacity="0.25"/>
  </svg>`,

  scanning: `<svg width="80" height="96" viewBox="0 0 44 52" style="image-rendering:pixelated">
    <rect x="6" y="2" width="32" height="28" rx="2" fill="#1F2937" stroke="#9CA3AF" stroke-width="1.5"/>
    <rect x="12" y="10" width="6" height="6" fill="#D1D5DB"/>
    <rect x="26" y="13" width="6" height="3" fill="#D1D5DB"/>
    <rect x="14" y="12" width="3" height="3" fill="#0F172A"/>
    <rect x="14" y="22" width="4" height="3" fill="#6B7280"/>
    <rect x="18" y="24" width="4" height="3" fill="#6B7280"/>
    <rect x="22" y="22" width="4" height="3" fill="#6B7280"/>
    <rect class="scan-line" x="6" y="2" width="32" height="2" fill="#9CA3AF" opacity="0.35"/>
    <rect x="10" y="32" width="24" height="16" rx="2" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
    <rect x="13" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
    <rect x="25" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#6B7280" stroke-width="1"/>
  </svg>`,

  ok: `<svg width="80" height="96" viewBox="0 0 44 52" style="image-rendering:pixelated">
    <rect x="6" y="2" width="32" height="28" rx="2" fill="#1F2937" stroke="#10B981" stroke-width="1.5"/>
    <rect x="12" y="12" width="6" height="3" fill="#D1D5DB"/>
    <rect x="12" y="10" width="6" height="2" fill="#1F2937"/>
    <rect x="26" y="12" width="6" height="3" fill="#D1D5DB"/>
    <rect x="26" y="10" width="6" height="2" fill="#1F2937"/>
    <rect x="14" y="21" width="4" height="3" fill="#D1D5DB"/>
    <rect x="18" y="23" width="8" height="3" fill="#D1D5DB"/>
    <rect x="26" y="21" width="4" height="3" fill="#D1D5DB"/>
    <rect x="10" y="18" width="4" height="2" fill="#9CA3AF" opacity="0.3"/>
    <rect x="30" y="18" width="4" height="2" fill="#9CA3AF" opacity="0.3"/>
    <rect x="10" y="32" width="24" height="16" rx="2" fill="#1F2937" stroke="#10B981" stroke-width="1"/>
    <rect x="34" y="30" width="6" height="10" rx="1" fill="#1F2937" stroke="#10B981" stroke-width="1"/>
    <rect x="34" y="26" width="6" height="6" rx="1" fill="#1F2937" stroke="#10B981" stroke-width="1"/>
    <rect x="13" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#10B981" stroke-width="1"/>
    <rect x="25" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#10B981" stroke-width="1"/>
  </svg>`,

  warning: `<svg width="80" height="96" viewBox="0 0 44 52" style="image-rendering:pixelated">
    <rect x="6" y="2" width="32" height="28" rx="2" fill="#1F2937" stroke="#F59E0B" stroke-width="1.5"/>
    <rect x="12" y="10" width="6" height="6" fill="#D1D5DB"/>
    <rect x="26" y="10" width="6" height="6" fill="#D1D5DB"/>
    <rect x="14" y="12" width="3" height="3" fill="#0F172A"/>
    <rect x="28" y="12" width="3" height="3" fill="#0F172A"/>
    <rect x="12" y="7" width="6" height="2" fill="#9CA3AF"/>
    <rect x="26" y="7" width="6" height="2" fill="#9CA3AF"/>
    <rect x="16" y="23" width="12" height="3" fill="#D1D5DB"/>
    <rect x="14" y="22" width="4" height="2" fill="#D1D5DB"/>
    <rect x="26" y="22" width="4" height="2" fill="#D1D5DB"/>
    <rect x="34" y="8" width="4" height="6" rx="2" fill="#9CA3AF" opacity="0.7"/>
    <rect x="10" y="32" width="24" height="16" rx="2" fill="#1F2937" stroke="#F59E0B" stroke-width="1"/>
    <rect x="13" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#F59E0B" stroke-width="1"/>
    <rect x="25" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#F59E0B" stroke-width="1"/>
  </svg>`,

  critical: `<svg width="80" height="96" viewBox="0 0 44 52" style="image-rendering:pixelated">
    <rect x="6" y="2" width="32" height="28" rx="2" fill="#1F2937" stroke="#EF4444" stroke-width="1.5"/>
    <rect x="12" y="12" width="6" height="6" fill="#D1D5DB"/>
    <rect x="26" y="12" width="6" height="6" fill="#D1D5DB"/>
    <rect x="14" y="12" width="3" height="3" fill="#0F172A"/>
    <rect x="28" y="12" width="3" height="3" fill="#0F172A"/>
    <rect x="12" y="8" width="3" height="2" fill="#9CA3AF"/>
    <rect x="15" y="7" width="3" height="2" fill="#9CA3AF"/>
    <rect x="29" y="7" width="3" height="2" fill="#9CA3AF"/>
    <rect x="32" y="8" width="3" height="2" fill="#9CA3AF"/>
    <rect x="16" y="24" width="4" height="2" fill="#D1D5DB"/>
    <rect x="20" y="23" width="4" height="2" fill="#D1D5DB"/>
    <rect x="24" y="24" width="4" height="2" fill="#D1D5DB"/>
    <rect x="12" y="18" width="2" height="6" rx="1" fill="#9CA3AF" opacity="0.8"/>
    <rect x="30" y="18" width="2" height="6" rx="1" fill="#9CA3AF" opacity="0.8"/>
    <rect x="10" y="32" width="24" height="16" rx="2" fill="#1F2937" stroke="#EF4444" stroke-width="1"/>
    <rect x="34" y="26" width="6" height="14" rx="1" fill="#1F2937" stroke="#EF4444" stroke-width="1"/>
    <rect x="34" y="24" width="8" height="6" rx="2" fill="#1F2937" stroke="#EF4444" stroke-width="1"/>
    <rect x="13" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#EF4444" stroke-width="1"/>
    <rect x="25" y="49" width="6" height="8" rx="1" fill="#1F2937" stroke="#EF4444" stroke-width="1"/>
  </svg>`,
};

function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

function extractFeatures(desc) {
  const d = (desc || '').toLowerCase();

  let gender = 'neutral';
  if (/여자|여성|여대생|girl|female/.test(d)) gender = 'female';
  else if (/남자|남성|남대생|boy|male/.test(d)) gender = 'male';

  let hair = 'default';
  if (/장발|긴\s?머리|long.?hair/.test(d)) hair = 'long';
  else if (/단발|짧은\s?머리|숏컷|short.?hair/.test(d)) hair = 'short';
  else if (/대머리|bald/.test(d)) hair = 'bald';

  let age = 'young';
  if (/10대|십대/.test(d)) age = 'teen';
  else if (/20대|이십대/.test(d)) age = 'young';
  else if (/30대|40대|삼십|사십/.test(d)) age = 'adult';
  else if (/50대|60대|오십|육십|중년|장년|노인|어르신/.test(d)) age = 'senior';

  let build = 'default';
  if (/키\s?크|tall|장신/.test(d)) build = 'tall';
  else if (/키\s?작|단신/.test(d)) build = 'short_build';
  else if (/뚱뚱|비만|heavy|chubby/.test(d)) build = 'heavy';

  let style = 'default';
  if (/학생|대학생|고등학생/.test(d)) style = 'student';
  else if (/직장인|회사원|사무직/.test(d)) style = 'worker';
  else if (/바쁜|프리랜서|busy/.test(d)) style = 'busy';
  else if (/디지털.{0,4}낮|낮.{0,4}디지털|리터러시.{0,4}낮/.test(d)) style = 'lowliteracy';

  return { gender, hair, age, build, style };
}

function buildPersonaSvg(features, strokeColor, animOpts) {
  const { gender, hair, age, build, style } = Object.assign(
    { gender: 'neutral', hair: 'default', age: 'young', build: 'default', style: 'default' },
    features
  );
  const stroke = strokeColor || '#9CA3AF';
  const { state = 'idle', facingLeft = false, eyeOX = 1, eyeOY = 0, blinkScale = 1 } = animOpts || {};

  // Eye offset: absolute coords, no CSS transform (fixes scaleX(-1) bug)
  const ex = facingLeft ? -eyeOX : eyeOX;
  const ey = eyeOY;
  const bs = blinkScale;

  // Per-state leg poses
  const LEGS = {
    walk:   (s) => `<rect x="13" y="46" width="6" height="8" rx="1" fill="#1F2937" stroke="${s}" stroke-width="1"/>
                    <rect x="25" y="46" width="6" height="8" rx="1" fill="#1F2937" stroke="${s}" stroke-width="1"/>`,
    idle:   (s) => `<rect x="13" y="46" width="6" height="8" rx="1" fill="#1F2937" stroke="${s}" stroke-width="1"/>
                    <rect x="25" y="46" width="6" height="8" rx="1" fill="#1F2937" stroke="${s}" stroke-width="1"/>`,
    jump:   (s) => `<rect x="11" y="44" width="6" height="8" rx="1" fill="#1F2937" stroke="${s}" stroke-width="1" transform="rotate(-20 14 48)"/>
                    <rect x="27" y="44" width="6" height="8" rx="1" fill="#1F2937" stroke="${s}" stroke-width="1" transform="rotate(20 30 48)"/>`,
    sit:    (s) => `<rect x="10" y="48" width="10" height="5" rx="1" fill="#1F2937" stroke="${s}" stroke-width="1"/>
                    <rect x="24" y="48" width="10" height="5" rx="1" fill="#1F2937" stroke="${s}" stroke-width="1"/>`,
    run:    (s) => `<rect x="11" y="44" width="6" height="9" rx="1" fill="#1F2937" stroke="${s}" stroke-width="1" transform="rotate(-30 14 46)"/>
                    <rect x="27" y="44" width="6" height="9" rx="1" fill="#1F2937" stroke="${s}" stroke-width="1" transform="rotate(15 30 46)"/>`,
    thrown: (s) => `<rect x="11" y="44" width="6" height="8" rx="1" fill="#1F2937" stroke="${s}" stroke-width="1" transform="rotate(-25 14 48)"/>
                    <rect x="27" y="44" width="6" height="8" rx="1" fill="#1F2937" stroke="${s}" stroke-width="1" transform="rotate(25 30 48)"/>`,
  };

  // Per-state arm poses
  const ARMS = {
    walk:   (s) => `<rect x="4"  y="34" width="6" height="3" rx="1" fill="#1F2937" stroke="${s}" stroke-width="0.8"/>
                    <rect x="34" y="34" width="6" height="3" rx="1" fill="#1F2937" stroke="${s}" stroke-width="0.8"/>`,
    idle:   (s) => `<rect x="5"  y="36" width="5" height="3" rx="1" fill="#1F2937" stroke="${s}" stroke-width="0.8"/>
                    <rect x="34" y="36" width="5" height="3" rx="1" fill="#1F2937" stroke="${s}" stroke-width="0.8"/>`,
    jump:   (s) => `<rect x="2"  y="28" width="6" height="3" rx="1" fill="#1F2937" stroke="${s}" stroke-width="0.8" transform="rotate(-40 5 30)"/>
                    <rect x="36" y="28" width="6" height="3" rx="1" fill="#1F2937" stroke="${s}" stroke-width="0.8" transform="rotate(40 39 30)"/>`,
    sit:    (s) => `<rect x="5"  y="38" width="5" height="3" rx="1" fill="#1F2937" stroke="${s}" stroke-width="0.8"/>
                    <rect x="34" y="38" width="5" height="3" rx="1" fill="#1F2937" stroke="${s}" stroke-width="0.8"/>`,
    run:    (s) => `<rect x="2"  y="30" width="6" height="3" rx="1" fill="#1F2937" stroke="${s}" stroke-width="0.8" transform="rotate(-20 5 32)"/>
                    <rect x="36" y="30" width="6" height="3" rx="1" fill="#1F2937" stroke="${s}" stroke-width="0.8" transform="rotate(20 39 32)"/>`,
    thrown: (s) => `<rect x="2"  y="26" width="6" height="3" rx="1" fill="#1F2937" stroke="${s}" stroke-width="0.8" transform="rotate(-50 5 28)"/>
                    <rect x="36" y="26" width="6" height="3" rx="1" fill="#1F2937" stroke="${s}" stroke-width="0.8" transform="rotate(50 39 28)"/>`,
  };

  // Per-state mouth
  const MOUTHS = {
    walk:   `<rect x="14" y="22" width="4" height="3" fill="#D1D5DB"/><rect x="18" y="25" width="8" height="3" fill="#D1D5DB"/><rect x="26" y="22" width="4" height="3" fill="#D1D5DB"/>`,
    idle:   `<rect x="14" y="22" width="4" height="3" fill="#D1D5DB"/><rect x="18" y="25" width="8" height="3" fill="#D1D5DB"/><rect x="26" y="22" width="4" height="3" fill="#D1D5DB"/>`,
    jump:   `<rect x="16" y="23" width="12" height="3" fill="#6B7280"/>`,
    sit:    `<rect x="14" y="22" width="4" height="3" fill="#D1D5DB"/><rect x="18" y="25" width="8" height="3" fill="#D1D5DB"/><rect x="26" y="22" width="4" height="3" fill="#D1D5DB"/>`,
    run:    `<rect x="16" y="24" width="12" height="2" fill="#6B7280"/>`,
    thrown: `<rect x="16" y="23" width="4" height="3" fill="#D1D5DB"/><rect x="24" y="23" width="4" height="3" fill="#D1D5DB"/>`,
  };

  const legFn   = LEGS[state]   || LEGS.idle;
  const armFn   = ARMS[state]   || ARMS.idle;
  const mouthSvg = MOUTHS[state] || MOUTHS.idle;

  // Feature-based visuals (unchanged from original)
  const hairColor = age === 'senior' ? '#E5E7EB'
    : gender === 'female' ? '#92400E'
    : '#374151';

  let hairSvg = '';
  if (age === 'senior') {
    hairSvg = `<rect x="8" y="0" width="28" height="5" fill="#E5E7EB"/>
      <rect x="6" y="2" width="4" height="4" fill="#E5E7EB"/>
      <rect x="34" y="2" width="4" height="4" fill="#E5E7EB"/>`;
  } else if (hair === 'long' || (hair === 'default' && gender === 'female')) {
    hairSvg = `<rect x="6" y="0" width="32" height="5" rx="1" fill="${hairColor}"/>
      <rect x="4" y="4" width="4" height="20" rx="1" fill="${hairColor}"/>
      <rect x="36" y="4" width="4" height="20" rx="1" fill="${hairColor}"/>`;
  } else if (hair !== 'bald') {
    hairSvg = `<rect x="8" y="0" width="28" height="4" rx="1" fill="${hairColor}"/>
      <rect x="6" y="2" width="4" height="4" rx="1" fill="${hairColor}"/>
      <rect x="34" y="2" width="4" height="4" rx="1" fill="${hairColor}"/>`;
  }

  const lashes = gender === 'female' ? `
    <rect x="12" y="9" width="2" height="2" fill="#9CA3AF" opacity="0.6"/>
    <rect x="15" y="8" width="2" height="2" fill="#9CA3AF" opacity="0.6"/>
    <rect x="18" y="8" width="2" height="1" fill="#9CA3AF" opacity="0.4"/>
    <rect x="26" y="9" width="2" height="2" fill="#9CA3AF" opacity="0.6"/>
    <rect x="29" y="8" width="2" height="2" fill="#9CA3AF" opacity="0.6"/>
    <rect x="24" y="8" width="2" height="1" fill="#9CA3AF" opacity="0.4"/>` : '';

  const earring = gender === 'female' ? `
    <rect x="3" y="17" width="3" height="3" rx="1" fill="#F472B6" opacity="0.85"/>
    <rect x="38" y="17" width="3" height="3" rx="1" fill="#F472B6" opacity="0.85"/>` : '';

  const glasses = (age === 'senior' || style === 'lowliteracy') ? `
    <rect x="10" y="10" width="8" height="6" rx="1" fill="none" stroke="#9CA3AF" stroke-width="1"/>
    <rect x="26" y="10" width="8" height="6" rx="1" fill="none" stroke="#9CA3AF" stroke-width="1"/>
    <rect x="18" y="12" width="8" height="1" fill="#9CA3AF"/>
    <rect x="8" y="12" width="2" height="1" fill="#9CA3AF"/>
    <rect x="34" y="12" width="2" height="1" fill="#9CA3AF"/>` : '';

  const eyeH = gender === 'female' ? 7 : 6;

  const bodyX = gender === 'female' ? 8 : 10;
  const bodyW = gender === 'female' ? 28 : 24;
  const viewH = build === 'tall' ? 62 : build === 'short_build' ? 52 : 58;
  const bodyH = build === 'tall' ? 20 : build === 'short_build' ? 12 : 16;
  const legsY = 32 + bodyH + 2;

  const bodyExtra = style === 'worker' ? `
    <rect x="20" y="33" width="4" height="8" rx="1" fill="#6B7280"/>
    <rect x="19" y="41" width="6" height="4" rx="1" fill="#4B5563"/>` :
    style === 'busy' ? `
    <rect x="34" y="30" width="5" height="8" rx="1" fill="#374151" stroke="#6B7280" stroke-width="0.5"/>
    <rect x="35" y="31" width="3" height="1" fill="#6B7280" opacity="0.5"/>
    <rect x="35" y="33" width="3" height="1" fill="#6B7280" opacity="0.4"/>` :
    style === 'student' ? `
    <rect x="2" y="34" width="7" height="10" rx="1" fill="#1E3A5F" stroke="#3B82F6" stroke-width="0.5"/>
    <rect x="4" y="32" width="3" height="4" rx="1" fill="none" stroke="#3B82F6" stroke-width="0.5"/>` : '';

  return `<svg width="80" height="96" viewBox="0 0 44 ${viewH}" style="image-rendering:pixelated">
    ${hairSvg}
    ${armFn(stroke)}
    <rect x="6" y="2" width="32" height="28" rx="2" fill="#1F2937" stroke="${stroke}" stroke-width="1.5"/>
    ${lashes}
    <rect x="12" y="10" width="6" height="${eyeH}" fill="#D1D5DB"/>
    <rect x="26" y="10" width="6" height="${eyeH}" fill="#D1D5DB"/>
    <rect x="${14 + ex}" y="${12 + ey}" width="3" height="${3 * bs}" fill="#0F172A"/>
    <rect x="${28 + ex}" y="${12 + ey}" width="3" height="${3 * bs}" fill="#0F172A"/>
    ${earring}${glasses}${mouthSvg}
    <rect x="${bodyX}" y="32" width="${bodyW}" height="${bodyH}" rx="2" fill="#1F2937" stroke="${stroke}" stroke-width="1"/>
    ${bodyExtra}
    ${legFn(stroke)}
  </svg>`;
}

document.addEventListener('alpine:init', () => {
  Alpine.data('personaApp', () => ({
    screen: 'input',
    files: [],
    personaDesc: '',
    taskDesc: '',
    dragging: false,
    error: '',
    copied: false,
    detailOpen: false,
    statusStep: 0,
    result: null,
    characterState: 'idle',
    personaFeatures: {},
    personaMinimized: false,
    _thinkInterval: null,
    _featureFetch: null,

    physX: 100,
    physY: 100,
    physVX: 0,
    physVY: 0,
    physState: 'wander',
    physTarget: { x: 200, y: 300 },
    _animFrame: null,
    _idleTimer: null,
    _dragOffset: { x: 0, y: 0 },
    _dragHistory: [],

    steps: [
      { label: '코드 파싱', icon: '📂' },
      { label: '페르소나 생성', icon: '🧬' },
      { label: 'UX 시뮬레이션', icon: '🔍' },
      { label: '리포트 생성', icon: '📊' },
    ],

    init() {
      this.physX = window.innerWidth * 0.8;
      this.physY = window.innerHeight * 0.7;
      this._pickWanderTarget();
      this._startPhysics();

      this._featureFetch = debounce(async (val) => {
        this.personaFeatures = extractFeatures(val);
        if (!val.trim()) return;
        try {
          const res = await fetch('/persona-features', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ persona_desc: val }),
          });
          if (res.ok) this.personaFeatures = await res.json();
        } catch (_) {}
      }, 500);

      this.$watch('personaDesc', (val) => {
        if (this.screen === 'input') this._featureFetch(val);
      });

      document.addEventListener('mousemove', (e) => {
        if (this.screen !== 'input') return;
        const wrap = this.$el.querySelector('.persona-svg-wrap');
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
        const dist = 2.5;
        const ox = +(Math.cos(angle) * dist).toFixed(1);
        const oy = +(Math.sin(angle) * dist).toFixed(1);
        wrap.querySelectorAll('.pupil-l, .pupil-r').forEach(p => {
          p.style.transform = `translate(${ox}px, ${oy}px)`;
        });
      });
    },

    handleFiles(e) {
      this.addFiles(Array.from(e.target.files || []));
    },

    handleDrop(e) {
      this.dragging = false;
      this.addFiles(Array.from(e.dataTransfer.files || []));
    },

    addFiles(incoming) {
      const allowed = ['.tsx', '.jsx', '.html', '.vue', '.js', '.ts', '.zip'];
      const filtered = incoming.filter(f =>
        allowed.some(ext => f.name.toLowerCase().endsWith(ext))
      );
      this.files = [...this.files, ...filtered];
    },

    removeFile(i) {
      this.files = this.files.filter((_, idx) => idx !== i);
    },

    _pickWanderTarget() {
      const W = 96, H = 140;
      this.physTarget = {
        x: Math.random() * (window.innerWidth - W),
        y: Math.random() * (window.innerHeight - H),
      };
    },

    _scheduleWander() {
      clearTimeout(this._idleTimer);
      this._idleTimer = setTimeout(() => {
        this._pickWanderTarget();
        this.physState = 'wander';
      }, 800 + Math.random() * 2400);
    },

    _startPhysics() {
      const GRAVITY = 0.45;
      const DAMPING = 0.52;
      const FRICTION = 0.96;
      const SPEED = 1.8;
      const W = 96, H = 140;

      const loop = () => {
        if (this.physState === 'thrown') {
          this.physVY += GRAVITY;
          this.physX += this.physVX;
          this.physY += this.physVY;

          const maxX = window.innerWidth - W;
          const maxY = window.innerHeight - H;

          if (this.physY >= maxY) {
            this.physY = maxY;
            this.physVY = -Math.abs(this.physVY) * DAMPING;
            this.physVX *= FRICTION;
            if (Math.abs(this.physVY) < 1) {
              this.physVY = 0;
              if (Math.abs(this.physVX) < 0.5) {
                this.physVX = 0;
                this.physState = 'idle';
                this._scheduleWander();
              }
            }
          }
          if (this.physX <= 0) { this.physX = 0; this.physVX = Math.abs(this.physVX) * DAMPING; }
          if (this.physX >= maxX) { this.physX = maxX; this.physVX = -Math.abs(this.physVX) * DAMPING; }
          if (this.physY <= 0) { this.physY = 0; this.physVY = Math.abs(this.physVY) * DAMPING; }
        }

        else if (this.physState === 'wander') {
          const dx = this.physTarget.x - this.physX;
          const dy = this.physTarget.y - this.physY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 4) {
            this.physState = 'idle';
            this._scheduleWander();
          } else {
            const speed = Math.min(SPEED, dist);
            this.physX += (dx / dist) * speed;
            this.physY += (dy / dist) * speed;
          }
        }

        this._animFrame = requestAnimationFrame(loop);
      };
      this._animFrame = requestAnimationFrame(loop);
    },

    onPersonaMousedown(e) {
      if (this.physState === 'thrown') return;
      this.physState = 'dragging';
      clearTimeout(this._idleTimer);
      cancelAnimationFrame(this._animFrame);

      this._dragOffset = { x: e.clientX - this.physX, y: e.clientY - this.physY };
      this._dragHistory = [{ x: e.clientX, y: e.clientY, t: Date.now() }];

      const onMove = (ev) => {
        this.physX = ev.clientX - this._dragOffset.x;
        this.physY = ev.clientY - this._dragOffset.y;
        this._dragHistory.push({ x: ev.clientX, y: ev.clientY, t: Date.now() });
        if (this._dragHistory.length > 8) this._dragHistory.shift();
      };

      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);

        const now = Date.now();
        const recent = this._dragHistory.filter(p => now - p.t < 120);
        if (recent.length >= 2) {
          const first = recent[0], last = recent[recent.length - 1];
          const dt = Math.max(last.t - first.t, 1);
          this.physVX = ((last.x - first.x) / dt) * 16;
          this.physVY = ((last.y - first.y) / dt) * 16;
          this.physState = 'thrown';
        } else {
          this.physState = 'idle';
          this._scheduleWander();
        }
        this._startPhysics();
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },

    startThinking() {
      this.characterState = 'thinking';
      this._thinkInterval = setInterval(() => {
        this.characterState = this.characterState === 'thinking' ? 'scanning' : 'thinking';
      }, 1500);
    },

    stopThinking() {
      clearInterval(this._thinkInterval);
      this._thinkInterval = null;
    },

    async analyze() {
      if (!this.files.length) {
        this.error = '파일을 업로드해주세요.';
        return;
      }
      this.error = '';
      this.personaFeatures = extractFeatures(this.personaDesc);
      this.screen = 'progress';
      this.startThinking();
      this.statusStep = 1;

      await sleep(800);
      this.statusStep = 2;
      await sleep(600);
      this.statusStep = 3;

      try {
        const formData = new FormData();
        formData.append('persona_desc', this.personaDesc.trim() || '20대 대학생');
        formData.append('task', this.taskDesc.trim() || '서비스 탐색하기');
        for (const file of this.files) {
          formData.append('files', file);
        }

        const response = await fetch('/analyze', {
          method: 'POST',
          body: formData,
        });

        this.statusStep = 4;
        await sleep(300);

        if (!response.ok) {
          throw new Error('backend');
        }

        this.stopThinking();
        this.result = await response.json();
        this.detailOpen = false;
        this.screen = 'result';

      } catch (err) {
        this.stopThinking();
        this.screen = 'input';
        this.error = err.message === 'backend'
          ? '⚠️ 분석 중 오류가 발생했어요. 파일 형식을 확인하거나 잠시 후 다시 시도해주세요.'
          : '⚠️ 서버에 연결할 수 없어요. 백엔드가 실행 중인지 확인해주세요. (http://localhost:8000)';
      }
    },

    async copyPrompts() {
      const text = (this.result?.fix_prompts || []).join('\n\n---\n\n');
      try {
        await navigator.clipboard.writeText(text);
        this.copied = true;
        setTimeout(() => { this.copied = false; }, 2000);
      } catch (_) {}
    },

    reset() {
      this.stopThinking();
      this.characterState = 'idle';
      this.personaFeatures = {};
      this.physState = 'idle';
      this.physVX = 0;
      this.physVY = 0;
      this._scheduleWander();
      this.screen = 'input';
      this.result = null;
      this.files = [];
      this.error = '';
      this.personaDesc = '';
    },

    get currentPersonaSvg() {
      if (this.screen === 'progress') {
        return PERSONA_SVGS[this.characterState] || PERSONA_SVGS.thinking;
      }
      const strokeColor = this.screen === 'result' && this.result
        ? ({ ok: '#10B981', warning: '#F59E0B', critical: '#EF4444' }[this.result.risk_level] || '#9CA3AF')
        : '#9CA3AF';
      return buildPersonaSvg(this.personaFeatures, strokeColor);
    },

    get personaLabel() {
      if (this.screen === 'progress') return '분석 중...';
      if (this.screen === 'result' && this.result) {
        return this.result.risk_label || '분석 완료';
      }
      if (!this.personaDesc.trim()) return '페르소나 대기 중';
      return this.personaDesc.trim().split(/\s+/).slice(0, 4).join(' ');
    },

    get riskConfig() {
      const configs = {
        critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', icon: '🔴' },
        warning:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', icon: '🟡' },
        ok:       { color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', icon: '🟢' },
      };
      return configs[this.result?.risk_level] || configs.ok;
    },

    get thinkAloudFirstSentence() {
      const text = this.result?.think_aloud || '';
      const match = text.match(/^[^.!?]+[.!?]/);
      return match ? match[0] : text.slice(0, 80) + (text.length > 80 ? '...' : '');
    },

    buildAnnotatedCode() {
      const source = this.result?.source_code || '';
      const top3 = this.result?.top3 || [];
      if (!source) return '';

      const lines = source.split('\n');
      const issueMap = {};
      for (const item of top3) {
        if (item.line_number) issueMap[item.line_number] = item;
      }

      const esc = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      const rows = lines.map((line, i) => {
        const n = i + 1;
        const escaped = esc(line).replace(/ /g, '&nbsp;');
        const issue = issueMap[n];
        if (issue) {
          const sev = issue.severity || 0;
          const sevKey = sev > 0.7 ? 'high' : sev > 0.4 ? 'med' : 'low';
          const sevLabel = sev > 0.7 ? 'HIGH' : sev > 0.4 ? 'MED' : 'LOW';
          const bg = sev > 0.7 ? '#3d1515' : sev > 0.4 ? '#3d2b0a' : '#1a2d3d';
          return `<tr style="background:${bg}">
            <td class="ln">${n}</td>
            <td class="lc">${escaped}</td>
            <td class="li"><span class="sev-label sev-label--${sevKey}">[${sevLabel}]</span> ${esc(issue.reason)}</td>
          </tr>`;
        }
        return `<tr>
          <td class="ln dim">${n}</td>
          <td class="lc dim">${escaped}</td>
          <td></td>
        </tr>`;
      }).join('');

      return `<div class="code-view">
        <p class="code-label">소스 코드 — 이슈 라인 하이라이트</p>
        <table style="border-collapse:collapse;width:100%">${rows}</table>
      </div>`;
    },

    buildIssueCards() {
      const top3 = this.result?.top3 || [];
      if (!top3.length) return '<p class="no-issues">감지된 이슈 없음</p>';

      const esc = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      return top3.map(item => {
        const sev = item.severity || 0;
        const sevPct = Math.round(sev * 100);
        const sevKey = sev > 0.7 ? 'high' : sev > 0.4 ? 'med' : 'low';
        const sevLabel = sev > 0.7 ? 'HIGH' : sev > 0.4 ? 'MED' : 'LOW';
        const borderColor = sev > 0.7
          ? 'rgba(239,68,68,0.3)'
          : sev > 0.4
          ? 'rgba(245,158,11,0.3)'
          : 'rgba(59,130,246,0.3)';
        return `<details class="issue-card" style="border-color:${borderColor}">
          <summary class="issue-summary">
            <span><span class="sev-label sev-label--${sevKey}">[${sevLabel}]</span> line ${item.line_number || '?'} — ${esc(item.reason)}</span>
            <span class="issue-sev">${sevPct}%</span>
          </summary>
          <div class="issue-body"><b>근거</b> — ${esc(item.evidence)}</div>
        </details>`;
      }).join('');
    },
  }));
});

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
