(function () {
  const lib = window.LIBRARY;
  const app = document.getElementById('app');
  const crumbs = document.getElementById('crumbs');
  const foot = document.getElementById('foot');
  const rootEl = document.documentElement;
  let token = 0;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function href(ids) {
    return '#/' + ids.map(encodeURIComponent).join('/');
  }

  function parsePath() {
    return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
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

  function loadFontSize() {
    try {
      const v = parseFloat(localStorage.getItem('lib-fs'));
      if (v >= 0.8 && v <= 1.8) rootEl.style.setProperty('--fs', v + 'rem');
    } catch (e) {}
  }

  function changeFontSize(delta) {
    const current = parseFloat(getComputedStyle(rootEl).getPropertyValue('--fs')) || 1.1;
    const next = Math.min(1.8, Math.max(0.8, Math.round((current + delta) * 100) / 100));
    rootEl.style.setProperty('--fs', next + 'rem');
    try { localStorage.setItem('lib-fs', String(next)); } catch (e) {}
  }

  function card(node, ids) {
    const isDir = !!node.children;
    const meta = isDir ? 'внутри: ' + node.children.length : (node.meta || '');
    return '<a class="item ' + (isDir ? 'is-dir' : 'is-text') + '" href="' + href(ids) + '">' +
      '<span class="orb"></span>' +
      '<span class="item-main"><span class="item-title">' + esc(node.title) + '</span>' +
      (node.desc ? '<span class="item-desc">' + esc(node.desc) + '</span>' : '') +
      '</span><span class="item-meta">' + esc(meta) + '</span></a>';
  }

  function list(node, baseIds) {
    return '<div class="items">' + node.children.map(function (c) {
      return card(c, baseIds.concat(c.id));
    }).join('') + '</div>';
  }

  function renderCrumbs(chain, path) {
    if (path.length === 0) { crumbs.innerHTML = ''; return; }
    let html = '<a href="#/">Главная</a>';
    for (let i = 1; i < chain.length; i++) {
      html += '<span class="sep">»</span>';
      if (i === chain.length - 1) {
        html += '<span class="here">' + esc(chain[i].title) + '</span>';
      } else {
        html += '<a href="' + href(path.slice(0, i)) + '">' + esc(chain[i].title) + '</a>';
      }
    }
    crumbs.innerHTML = html;
  }

  function renderHome() {
    app.innerHTML =
      '<section class="hero">' +
        '<div class="big-orb"></div>' +
        '<h1 class="hero-title">' + esc(lib.site.title) + '</h1>' +
        '<p class="hero-tag">' + esc(lib.site.tagline) + '</p>' +
      '</section>' +
      '<section class="panel">' +
        '<p class="intro">' + esc(lib.site.intro) + '</p>' +
        list(lib.root, []) +
      '</section>';
    document.title = lib.site.title;
  }

  function renderSection(node, path) {
    app.innerHTML =
      '<section class="panel">' +
        '<h1 class="page-title">' + esc(node.title) + '</h1>' +
        (node.desc ? '<p class="page-desc">' + esc(node.desc) + '</p>' : '') +
        list(node, path) +
      '</section>';
    document.title = node.title + ' — ' + lib.site.title;
  }

  function renderText(chain, path) {
    const node = chain[chain.length - 1];
    const parent = chain[chain.length - 2];
    const parentIds = path.slice(0, -1);
    const siblings = (parent.children || []).filter(function (c) { return c.file; });
    const idx = siblings.indexOf(node);
    const prev = idx > 0 ? siblings[idx - 1] : null;
    const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

    let nav = '<nav class="pager">';
    nav += prev ? '<a class="btn" href="' + href(parentIds.concat(prev.id)) + '">‹ ' + esc(prev.title) + '</a>' : '<span></span>';
    nav += '<a class="btn" href="' + (parentIds.length ? href(parentIds) : '#/') + '">К списку</a>';
    nav += next ? '<a class="btn" href="' + href(parentIds.concat(next.id)) + '">' + esc(next.title) + ' ›</a>' : '<span></span>';
    nav += '</nav>';

    app.innerHTML =
      '<article class="panel reader">' +
        '<div class="reader-head">' +
          '<h1 class="page-title">' + esc(node.title) + '</h1>' +
          '<div class="tools">' +
            '<button class="btn small" data-fs="-0.1" type="button">A−</button>' +
            '<button class="btn small" data-fs="0.1" type="button">A+</button>' +
          '</div>' +
        '</div>' +
        '<div class="text-body" id="text-body">Загрузка…</div>' +
        nav +
      '</article>';
    document.title = node.title + ' — ' + lib.site.title;

    const mine = ++token;
    fetch('texts/' + node.file)
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(function (html) {
        if (mine !== token) return;
        document.getElementById('text-body').innerHTML = html;
      })
      .catch(function () {
        if (mine !== token) return;
        document.getElementById('text-body').innerHTML = '<p class="note">Не удалось загрузить текст: texts/' + esc(node.file) + '</p>';
      });
  }

  function renderNotFound() {
    app.innerHTML =
      '<section class="panel"><h1 class="page-title">Не найдено</h1>' +
      '<p class="page-desc">Такой страницы нет.</p>' +
      '<p><a class="btn" href="#/">На главную</a></p></section>';
    document.title = 'Не найдено — ' + lib.site.title;
  }

  function route() {
    token++;
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
      else renderText(chain, path);
    }
    window.scrollTo(0, 0);
  }

  function makeBubbles() {
    const box = document.getElementById('bubbles');
    for (let i = 0; i < 16; i++) {
      const b = document.createElement('span');
      const size = 30 + Math.random() * 130;
      b.className = 'bubble';
      b.style.width = b.style.height = size + 'px';
      b.style.left = Math.random() * 100 + '%';
      b.style.animationDuration = 22 + Math.random() * 30 + 's';
      b.style.animationDelay = -Math.random() * 40 + 's';
      box.appendChild(b);
    }
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-fs]');
    if (btn) changeFontSize(parseFloat(btn.getAttribute('data-fs')));
  });

  foot.textContent = lib.site.footer;
  loadFontSize();
  makeBubbles();
  window.addEventListener('hashchange', route);
  route();
})();
