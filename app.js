const state = {
  items: [],
  viewerItem: null,
  collected: new Set(),
};

const intro = document.getElementById('intro');
const orb = document.getElementById('cursorOrb');
const featuredPackSlot = document.getElementById('featuredPackSlot');
const spotlightRail = document.getElementById('spotlightRail');
const scratchoffRail = document.getElementById('scratchoffRail');
const stickerWall = document.getElementById('stickerWall');
const bluePuzzleTiles = document.getElementById('bluePuzzleTiles');
const redPuzzleTiles = document.getElementById('redPuzzleTiles');
const viewer = document.getElementById('viewer');
const viewerImage = document.getElementById('viewerImage');
const viewerTitle = document.getElementById('viewerTitle');
const viewerSubtitle = document.getElementById('viewerSubtitle');
const viewerType = document.getElementById('viewerType');
const viewerSource = document.getElementById('viewerSource');
const closeViewer = document.getElementById('closeViewer');

const imageUrl = (item) => `./${item.local}`;

function prettyName(title) {
  return title
    .replace(/^DK cards 1982 sticker /i, '#')
    .replace(/^DK scratch off /i, 'Scratch-Off ')
    .replace(/^DK trading cards 1982/i, 'Pack / Set')
    .replace(/^DK cards packaging back/i, 'Packaging Back')
    .replace(/^DK cards packaging/i, 'Packaging')
    .trim();
}

function typeFor(title) {
  if (/sticker/i.test(title)) return 'Sticker card';
  if (/scratch off/i.test(title)) return 'Scratch-off card';
  return 'Packaging / set art';
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function rangePaths(folder, start, end, suffix = '', padWidth = 0) {
  return Array.from({ length: end - start + 1 }, (_, i) => {
    const number = padWidth ? pad2(start + i) : String(start + i);
    return `${folder}/${number}${suffix}.jpg`;
  });
}

function stickerItem(fileName, index) {
  const cardNumber = index + 1;
  const base = fileName.replace(/(?:Fr)?\.jpg$/i, '');
  return {
    title: `DK cards 1982 sticker ${cardNumber}.png`,
    local: `assets/images/tcdb-fronts/${fileName}`,
    backLocal: `assets/images/tcdb-backs/${pad2(cardNumber)}Bk.jpg`,
    source: `Local archive scan (${base})`,
  };
}

function scratchItem(fileName, label) {
  return {
    title: `DK scratch off ${label}.png`,
    local: `assets/images/Scratch Offs/${fileName}`,
    backLocal: 'assets/images/Scratch Offs/85906-6199642Fr.jpg',
    source: 'Local archive scan',
  };
}

function frontMarkup(item, index, options = {}) {
  const { showMeta = true } = options;
  const metaLabel = item.metaLabel || 'Click to flip';
  return `
    <div class="card__face card__face--front">
      <img src="${imageUrl(item)}" alt="${item.title}" loading="lazy" />
      ${showMeta ? `<div class="card__meta"><span>${metaLabel}</span></div>` : ''}
    </div>
  `;
}

function backMarkup(item, index) {
  const backLabel = /sticker/i.test(item.title) ? 'Sticker back' : 'Card back';
  if (item.backLocal) {
    return `
      <div class="card__face card__face--back">
        <img src="${imageUrl({ local: item.backLocal })}" alt="${item.title} back" loading="lazy" />
      </div>
    `;
  }
  return `
    <div class="card__face card__face--back">
      <div>
        <span class="back__label">${backLabel}</span>
        <h4 class="back__title">${prettyName(item.title)}</h4>
        <p class="back__copy">Back scan pending. Swap in a real back image here when you have it.</p>
        <div class="back__bars"></div>
      </div>
    </div>
  `;
}

function makeCard(item, index, options = {}) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'card';
  if (options.scratchoff) el.classList.add('card--scratchoff');
  el.innerHTML = `<div class="card__inner">${frontMarkup(item, index, options)}${backMarkup(item, index)}</div>`;
  el.addEventListener('click', () => {
    el.classList.toggle('is-flipped');
  });

  el.dataset.index = String(index);
  return el;
}

function makePuzzleTile(src, alt) {
  const el = document.createElement('div');
  el.className = 'puzzle-tile';
  el.innerHTML = `
    <img
      src="./${src}"
      alt="${alt}"
      loading="eager"
    />
  `;
  return el;
}

function openViewer(item) {
  state.viewerItem = item;
  viewerImage.src = imageUrl(item);
  viewerTitle.textContent = prettyName(item.title);
  viewerSubtitle.textContent = item.title;
  viewerType.textContent = typeFor(item.title);
  if (!item.source || item.source === 'Local archive scan') {
    viewerSource.textContent = 'Local archive scan';
  } else {
    try {
      viewerSource.textContent = new URL(item.source).hostname.replace(/^www\./, '');
    } catch {
      viewerSource.textContent = item.source;
    }
  }
  viewer.showModal();
}

function buildStickerItems() {
  const stickerFiles = [
    '01Fr.jpg',
    '02Fr.jpg',
    '03Fr.jpg',
    '04Fr.jpg',
    '05Fr.jpg',
    '06Fr.jpg',
    '07Fr.jpg',
    '08Fr.jpg',
    '09Fr.jpg',
    '10Fr.jpg',
    '11Fr.jpg',
    '12Fr.jpg',
    '13Fr.jpg',
    '14Fr.jpg',
    '15Fr.jpg',
    '16Fr.jpg',
    '17Fr.jpg',
    '18Fr.jpg',
    '19Fr.jpg',
    '20Fr.jpg',
    '21Fr.jpg',
    '22Fr.jpg',
    '23Fr.jpg',
    '24Fr.jpg',
    '25Fr.jpg',
    '26Fr.jpg',
    '27Fr.jpg',
    '28Fr.jpg',
    '29Fr.jpg',
    '30Fr.jpg',
    '31.jpg',
    '32.jpg',
  ];

  return stickerFiles.map((fileName, i) => stickerItem(fileName, i));
}

function buildScratchItems() {
  return [
    scratchItem('85906-6199638RepFr.jpg', '25m'),
    scratchItem('85906-6199639Fr.jpg', '50m'),
    scratchItem('85906-6199640Fr.jpg', '75m'),
    scratchItem('85906-6199641Fr.jpg', '100m'),
  ];
}

function start() {
  const featuredPack = {
    title: 'DK cards packaging front.png',
    local: 'assets/images/DK cards packagingfront.png',
    backLocal: 'assets/images/DK cards packaging back.png',
    source: 'Local archive scan',
  };

  if (featuredPackSlot) {
    featuredPackSlot.replaceChildren(makeCard(featuredPack, 0, { showMeta: false }));
  }

  const spotlightItems = [
    {
      title: 'DK cards 1982 sticker 1.png',
      local: 'assets/images/tcdb-fronts/01Fr.jpg',
      backLocal: 'assets/images/tcdb-backs/01Bk.jpg',
      source: 'Local archive scan',
      metaLabel: '#1 - The first sticker in the set',
    },
    {
      title: 'DK cards 1982 sticker 24.png',
      local: 'assets/images/tcdb-fronts/24Fr.jpg',
      backLocal: 'assets/images/tcdb-backs/24Bk.jpg',
      source: 'Local archive scan',
      metaLabel: '#24 - Jump Man ~ Mario before Mario was Mario',
    },
    {
      title: 'DK cards 1982 sticker 31.png',
      local: 'assets/images/tcdb-fronts/31.jpg',
      backLocal: 'assets/images/tcdb-backs/31Bk.jpg',
      source: 'Local archive scan',
      metaLabel: '#31 - Puzzle A',
    },
    {
      title: 'DK cards 1982 sticker 32.png',
      local: 'assets/images/tcdb-fronts/32.jpg',
      backLocal: 'assets/images/tcdb-backs/32Bk.jpg',
      source: 'Local archive scan',
      metaLabel: '#32 - Puzzle B',
    },
  ];

  spotlightItems.forEach((item, i) => spotlightRail.appendChild(makeCard(item, i)));

  const scratchItems = buildScratchItems();
  scratchItems.forEach((item, i) => {
    scratchoffRail.appendChild(makeCard(item, i, { showMeta: false, scratchoff: true }));
  });

  const bluePuzzle = rangePaths('assets/images/tcdb-backs', 1, 15, 'Bk', 2);
  const redPuzzle = rangePaths('assets/images/tcdb-backs', 16, 30, 'Bk', 2);

  if (bluePuzzleTiles) {
    bluePuzzle.forEach((src) => bluePuzzleTiles.appendChild(makePuzzleTile(src, 'Blue puzzle back')));
  }
  if (redPuzzleTiles) {
    redPuzzle.forEach((src) => redPuzzleTiles.appendChild(makePuzzleTile(src, 'Red puzzle back')));
  }

  const stickers = buildStickerItems();
  stickers.forEach((item, i) => stickerWall.appendChild(makeCard(item, i, { showMeta: false })));

  if (viewerSource) {
    viewerSource.textContent = 'Local archive scan';
  }
}

intro.addEventListener('click', () => document.body.classList.add('ready'));
intro.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') document.body.classList.add('ready');
});

closeViewer.addEventListener('click', () => viewer.close());
viewer.addEventListener('click', (e) => {
  const rect = viewer.getBoundingClientRect();
  const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
  if (!inside) viewer.close();
});

document.addEventListener('mousemove', (e) => {
  orb.style.left = `${e.clientX}px`;
  orb.style.top = `${e.clientY}px`;
});

document.addEventListener('mouseover', (e) => {
  document.body.dataset.hoverCard = e.target.closest('.card') ? 'true' : 'false';
});

start().catch((err) => {
  console.error(err);
});
