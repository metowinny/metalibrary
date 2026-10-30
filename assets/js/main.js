(function () {
  'use strict';

  const lib = window.LIBRARY;
  const app = document.getElementById('app');
  const crumbs = document.getElementById('crumbs');
  const foot = document.getElementById('foot');
  const socials = document.getElementById('socials');
  const progress = document.getElementById('reading-progress');
  const rootEl = document.documentElement;
  let requestToken = 0;
  let reading = false;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function href(ids) {
    return '#/' + ids.map(encodeURIComponent).join('/');
  }

  function parsePath() {
    try {
      return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    } catch (e) { return ['invalid-path']; }
  }

  function resolve(path) {
    const chain = [lib.root];
    let node = lib.root;
    for (const id of path) {
      const next = (node.children || []).find(function (c) { return c.id === id; });
      if (!next) return null;
      chain.push(next);
      node = next;
    }
    return chain;
  }

  function visibleChildren(node) {
    return (node.children || []).filter(function (child) { return !child.hidden; });
  }

  function flatten(node, baseIds, result) {
    visibleChildren(node).forEach(function (child) {
      const path = baseIds.concat(child.id);
      result.push({ node: child, path: path });
      if (child.children) flatten(child, path, result);
    });
    return result;
  }

  function textEntries(node, baseIds) {
    return flatten(node, baseIds, []).filter(function (item) { return !!item.node.file; });
  }

  function loadFontSize() {
    try {
      const size = parseFloat(localStorage.getItem('outofsite-font-size'));
      if (size >= 0.85 && size <= 1.7) rootEl.style.setProperty('--fs', size + 'rem');
      // Сохранённый размер из предыдущей версии сайта.
      else {
        const old = parseFloat(localStorage.getItem('lib-fs'));
        if (old >= 0.85 && old <= 1.7) rootEl.style.setProperty('--fs', old + 'rem');
      }
    } catch (e) { /* Storage может быть недоступен. */ }
  }

  function changeFontSize(delta) {
    const current = parseFloat(getComputedStyle(rootEl).getPropertyValue('--fs')) || 1.08;
    const next = Math.min(1.7, Math.max(0.85, Math.round((current + delta) * 100) / 100));
    rootEl.style.setProperty('--fs', next + 'rem');
    try { localStorage.setItem('outofsite-font-size', String(next)); } catch (e) {}
  }

  function externalURL(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const result = new URL(value.trim());
      return /^https?:$/.test(result.protocol) ? result.href : '';
    } catch (e) { return ''; }
  }

  function externalLink(key, name, abbr, prominent) {
    const url = externalURL((lib.site.links || {})[key]);
    const cls = 'social-link' + (prominent ? ' social-featured' : '') + (!url ? ' is-placeholder' : '');
    const label = url ? name + ' (откроется в новой вкладке)' : name + ': ссылка пока не добавлена';
    const inner = prominent ? '<span class="social-pixel" aria-hidden="true">✦</span><span>Трибунал</span><span aria-hidden="true">↗</span>' : '<span aria-hidden="true">' + abbr + '</span>';
    if (!url) return '<span class="' + cls + '" aria-label="' + esc(label) + '" title="' + esc(label) + '">' + inner + '</span>';
    return '<a class="' + cls + '" href="' + esc(url) + '" aria-label="' + esc(label) + '" title="' + esc(name) + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>';
  }

  function renderShell() {
    document.getElementById('brand').textContent = lib.site.title;
    socials.innerHTML = externalLink('vk', 'ВКонтакте', 'vk', false) +
      externalLink('telegram', 'Telegram', 'tg', false) +
      externalLink('tribunal', 'Сайт Нулевого Трибунала', '', true);
    const styleGuide = (lib.root.children || []).find(function (child) { return child.id === 'styles'; });
    foot.innerHTML = '<span>' + esc(lib.site.footer) + '</span>' +
      (styleGuide ? '<a class="foot-help" href="' + href([styleGuide.id]) + '" title="Шпаргалка по оформлению текстов" aria-label="Шпаргалка по оформлению">[ ? ]</a>' : '');
  }

  function card(node, ids, subtitle) {
    const isDir = !!node.children;
    const meta = isDir ? 'внутри: ' + visibleChildren(node).length : (node.meta || 'текст');
    return '<a class="item ' + (isDir ? 'is-dir' : 'is-text') + '" href="' + href(ids) + '">' +
      '<span class="item-symbol" aria-hidden="true">' + (isDir ? '▣' : '✎') + '</span>' +
      '<span class="item-main"><span class="item-title">' + esc(node.title) + '</span>' +
      (subtitle || node.desc ? '<span class="item-desc">' + esc(subtitle || node.desc) + '</span>' : '') +
      '</span><span class="item-meta">' + esc(meta) + '</span></a>';
  }

  function list(node, baseIds) {
    const entries = visibleChildren(node);
    if (!entries.length) return '<p class="empty">Здесь пока ничего нет. [ empty directory ]</p>';
    return '<div class="items">' + entries.map(function (child) {
      return card(child, baseIds.concat(child.id));
    }).join('') + '</div>';
  }

  function renderCrumbs(chain, path) {
    if (path.length === 0) { crumbs.innerHTML = ''; return; }
    let html = '<a href="#/">Главная</a>';
    for (let i = 1; i < chain.length; i++) {
      html += '<span class="sep" aria-hidden="true">›</span>';
      html += i === chain.length - 1
        ? '<span class="here" aria-current="page">' + esc(chain[i].title) + '</span>'
        : '<a href="' + href(path.slice(0, i)) + '">' + esc(chain[i].title) + '</a>';
    }
    crumbs.innerHTML = html;
  }

  function searchResults(query) {
    const container = document.getElementById('search-results');
    if (!container) return;
    const q = query.trim().toLocaleLowerCase('ru');
    if (!q) { container.innerHTML = ''; return; }
    const matches = flatten(lib.root, [], []).filter(function (item) {
      return (item.node.title + ' ' + (item.node.desc || '') + ' ' + (item.node.meta || '')).toLocaleLowerCase('ru').includes(q);
    });
    container.innerHTML = '<p class="search-caption">' + (matches.length ? 'Найдено: ' + matches.length : 'Совпадений не найдено') + '</p>' +
      (matches.length ? '<div class="items">' + matches.map(function (item) {
        const parents = resolve(item.path.slice(0, -1));
        const context = parents ? parents.slice(1).map(function (entry) { return entry.title.replace(/^\//, ''); }).join(' / ') : '';
        return card(item.node, item.path, context ? (context + (item.node.desc ? ' · ' + item.node.desc : '')) : item.node.desc);
      }).join('') + '</div>' : '');
  }

  function randomButton() {
    return '<button type="button" class="btn btn-quiet" data-random>✧ Случайный текст</button>';
  }

  function renderHome() {
    const count = textEntries(lib.root, []).length;
    app.innerHTML =
      '<section class="hero" aria-labelledby="hero-title">' +
        '<p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> PERSONAL WEB ARCHIVE / EST. 2026</p>' +
        '<h1 class="hero-title" id="hero-title">' + esc(lib.site.title) + '</h1>' +
        '<p class="hero-tag">' + esc(lib.site.tagline) + '</p>' +
        '<div class="hero-stars" aria-hidden="true">✦ ───── ✧ ───── ✦</div>' +
      '</section>' +
      '<section class="panel home-panel">' +
        '<div class="panel-label"><span class="panel-light" aria-hidden="true"></span> /directory <span class="panel-count">' + count + ' файлов</span></div>' +
        '<p class="intro">' + esc(lib.site.intro || '') + '</p>' +
        list(lib.root, []) +
        '<div class="home-extras">' +
          '<label class="search-label" for="library-search">⌕ Найти в архиве</label>' +
          '<input id="library-search" class="search-input" type="search" placeholder="Название, слово, раздел…" autocomplete="off" spellcheck="false">' +
          randomButton() +
        '</div><div id="search-results" class="search-results" aria-live="polite"></div>' +
      '</section>';
    document.title = lib.site.title + ' — ' + lib.site.tagline;
  }

  function renderSection(node, path) {
    const back = path.slice(0, -1);
    app.innerHTML =
      '<section class="panel section-panel">' +
        '<p class="eyebrow tiny">/directory · ' + visibleChildren(node).length + ' записей</p>' +
        '<h1 class="page-title">' + esc(node.title) + '</h1>' +
        (node.desc ? '<p class="page-desc">' + esc(node.desc) + '</p>' : '') +
        list(node, path) +
        '<nav class="section-actions" aria-label="Навигация по разделу">' +
          '<a class="btn" href="' + href(back) + '">‹ Назад</a>' +
          (textEntries(node, path).length ? randomButton() : '') +
        '</nav>' +
      '</section>';
    document.title = node.title + ' — ' + lib.site.title;
  }

  function renderText(chain, path) {
    const node = chain[chain.length - 1];
    const parent = chain[chain.length - 2];
    const parentIds = path.slice(0, -1);
    const siblings = visibleChildren(parent).filter(function (c) { return !!c.file; });
    const idx = siblings.indexOf(node);
    const prev = idx > 0 ? siblings[idx - 1] : null;
    const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;
    const prose = path[0] === 'stories' || path[0] === 'essays';
    const isGuide = node.id === 'styles';

    const nav = '<nav class="pager" aria-label="Навигация между произведениями">' +
      '<div class="pager-prev">' + (prev ? '<a class="btn" href="' + href(parentIds.concat(prev.id)) + '">‹ ' + esc(prev.title) + '</a>' : '') + '</div>' +
      '<a class="btn pager-list" href="' + href(parentIds) + '">‹ К списку</a>' +
      '<div class="pager-next">' + (next ? '<a class="btn" href="' + href(parentIds.concat(next.id)) + '">' + esc(next.title) + ' ›</a>' : '') + '</div>' +
    '</nav>';

    app.innerHTML =
      '<article class="panel reader' + (prose ? ' reader--prose' : '') + (isGuide ? ' reader--guide' : '') + '">' +
        '<p class="eyebrow tiny reader-kind">' + esc(node.meta || 'архив') + ' / ' + esc(lib.site.title) + '</p>' +
        '<div class="reader-head">' +
          '<h1 class="page-title">' + esc(node.title) + '</h1>' +
          '<div class="tools" aria-label="Настройки чтения">' +
            '<button class="btn small" data-fs="-0.1" type="button" aria-label="Уменьшить шрифт">A−</button>' +
            '<button class="btn small" data-fs="0.1" type="button" aria-label="Увеличить шрифт">A+</button>' +
            '<button class="btn small copy-link" data-copy type="button" aria-label="Скопировать ссылку на произведение" title="Скопировать ссылку">↗</button>' +
          '</div>' +
        '</div>' +
        '<div class="text-body" id="text-body" aria-live="polite"><p class="note">Загрузка текста…</p></div>' +
        nav +
      '</article>';
    document.title = node.title + ' — ' + lib.site.title;
    reading = true;

    const mine = ++requestToken;
    // Имя файла задаётся автором в library.js, а не читателем через URL.
    if (!/^[\w-]+\.html$/.test(node.file || '')) {
      document.getElementById('text-body').innerHTML = '<p class="note">Некорректное имя файла произведения.</p>';
      return;
    }
    fetch('texts/' + encodeURIComponent(node.file))
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (html) {
        if (mine !== requestToken) return;
        const body = document.getElementById('text-body');
        if (body) body.innerHTML = html;
        updateProgress();
      })
      .catch(function () {
        if (mine !== requestToken) return;
        const body = document.getElementById('text-body');
        if (body) body.innerHTML = '<p class="note">Не удалось загрузить файл texts/' + esc(node.file) + '. Проверь, существует ли он, и открывай сайт через веб-сервер.</p>';
      });
  }

  function renderNotFound() {
    app.innerHTML = '<section class="panel not-found"><p class="eyebrow">ERROR 404 / FILE NOT FOUND</p>' +
      '<h1 class="page-title">Страница не найдена</h1>' +
      '<p class="page-desc">Здесь больше ничего нет. Возможно, ссылка переехала.</p>' +
      '<a class="btn" href="#/">‹ На главную</a></section>';
    document.title = '404 — ' + lib.site.title;
  }

  function route() {
    requestToken++;
    reading = false;
    progress.style.width = '0%';
    progress.hidden = true;
    const path = parsePath();
    const chain = resolve(path);
    if (!chain) {
      crumbs.innerHTML = '';
      renderNotFound();
    } else {
      renderCrumbs(chain, path);
      const node = chain[chain.length - 1];
      if (path.length === 0) renderHome();
      else if (node.children) renderSection(node, path);
      else if (node.file) renderText(chain, path);
      else renderNotFound();
    }
    progress.hidden = !reading;
    window.scrollTo(0, 0);
    updateProgress();
  }

  function updateProgress() {
    if (!reading) return;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, window.scrollY / max * 100));
    progress.style.width = pct + '%';
  }

  function makeAmbient() {
    const box = document.getElementById('ambient');
    // Маленькие статичные/медленные искорки вместо крупных пузырей.
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement('span');
      dot.className = 'ambient-dot';
      dot.style.left = (7 + (i * 31 % 89)) + '%';
      dot.style.top = (8 + (i * 23 % 86)) + '%';
      dot.style.width = dot.style.height = (i % 4 === 0 ? 3 : 2) + 'px';
      dot.style.animationDelay = (-i * 2.9) + 's';
      dot.style.animationDuration = (16 + i % 7 * 3) + 's';
      box.appendChild(dot);
    }
  }

  document.addEventListener('click', function (event) {
    const fsButton = event.target.closest('[data-fs]');
    if (fsButton) { changeFontSize(parseFloat(fsButton.dataset.fs)); return; }
    const random = event.target.closest('[data-random]');
    if (random) {
      const path = parsePath();
      const chain = resolve(path);
      const current = chain ? chain[chain.length - 1] : lib.root;
      const entries = textEntries(current.children ? current : lib.root, current.children ? path : []);
      if (entries.length) location.hash = href(entries[Math.floor(Math.random() * entries.length)].path);
      return;
    }
    const copy = event.target.closest('[data-copy]');
    if (copy) {
      const url = location.href;
      const fallback = function () {
        const tmp = document.createElement('textarea');
        tmp.value = url;
        tmp.style.position = 'fixed';
        tmp.style.opacity = '0';
        document.body.appendChild(tmp);
        tmp.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        tmp.remove();
        return ok;
      };
      const report = function (ok) {
        copy.textContent = ok ? '✓' : '!';
        copy.title = ok ? 'Ссылка скопирована' : 'Не удалось скопировать';
        copy.setAttribute('aria-label', copy.title);
        setTimeout(function () {
          if (copy.isConnected) {
            copy.textContent = '↗';
            copy.title = 'Скопировать ссылку';
            copy.setAttribute('aria-label', copy.title);
          }
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { report(true); }).catch(function () { report(fallback()); });
      } else report(fallback());
    }
  });

  document.addEventListener('input', function (event) {
    if (event.target.id === 'library-search') searchResults(event.target.value);
  });

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  window.addEventListener('hashchange', route);

  renderShell();
  loadFontSize();
  makeAmbient();
  route();
})();
