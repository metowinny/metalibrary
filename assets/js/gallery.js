window.createArt = function (ctx) {
  'use strict';

  const data = window.GALLERY || { sections: [], profile: {} };
  const lib = ctx.lib;
  const esc = ctx.esc;
  const href = ctx.href;
  const app = ctx.app;
  const LAYOUTS = { sprites: true, icons: true, masonry: true, tiles: true };
  const ZOOM_KEY = 'outofsite-art-zoom';
  const lb = { el: null, items: [], index: 0, opener: null, touchX: null };

  function plural(n, one, few, many) {
    const a = Math.abs(n) % 100;
    const b = a % 10;
    if (a > 10 && a < 20) return many;
    if (b > 1 && b < 5) return few;
    if (b === 1) return one;
    return many;
  }

  function countLabel(n) {
    return n + ' ' + plural(n, 'работа', 'работы', 'работ');
  }

  function resolveSrc(dir, src) {
    if (/^(https?:)?\/\//.test(src) || src.indexOf('images/') === 0 || src.charAt(0) === '/') return encodeURI(src);
    return encodeURI((dir || '') + src);
  }

  function normalize(section) {
    const out = [];
    const push = function (raw, group) {
      const item = typeof raw === 'string' ? { src: raw } : Object.assign({}, raw);
      if (!item.src) return;
      item.file = item.src;
      item.src = resolveSrc(section.dir, item.src);
      if (item.thumb) item.thumb = resolveSrc(section.dir, item.thumb);
      if (item.full) item.full = resolveSrc(section.dir, item.full);
      item.group = item.group || group || '';
      item.w = item.w || section.w || 0;
      item.h = item.h || section.h || 0;
      out.push(item);
    };
    (section.items || []).forEach(function (raw) { push(raw, ''); });
    (section.groups || []).forEach(function (g) {
      (g.items || []).forEach(function (raw) { push(raw, g.title); });
    });
    return out;
  }

  function isPixel(section, layout) {
    if (typeof section.pixel === 'boolean') return section.pixel;
    return layout === 'sprites' || layout === 'icons';
  }

  function hubNode() {
    return (lib.root.children || []).find(function (c) { return c.id === 'art'; });
  }

  function attach() {
    const hub = hubNode();
    if (!hub) return;
    hub.children = (data.sections || []).map(function (section) {
      const items = normalize(section);
      return {
        id: section.id,
        title: section.title,
        desc: section.desc,
        gallery: section,
        symbol: section.symbol || '▦',
        items: items,
        meta: countLabel(items.length),
        hidden: !!section.hidden
      };
    });
    const total = hub.children.reduce(function (sum, c) { return sum + c.items.length; }, 0);
    hub.total = total;
  }

  function readZoom() {
    try {
      const z = parseInt(localStorage.getItem(ZOOM_KEY), 10);
      if (z >= 1 && z <= 4) return z;
    } catch (e) {}
    return 2;
  }

  function saveZoom(z) {
    try { localStorage.setItem(ZOOM_KEY, String(z)); } catch (e) {}
  }

  function itemHTML(item, index, layout) {
    const label = item.title || ('Работа ' + (index + 1));
    const style = [];
    if (item.w) style.push('--w:' + item.w);
    if (item.w && item.h) style.push('--ratio:' + item.w + '/' + item.h);
    const dims = item.w && item.h && layout !== 'icons' ? ' width="' + item.w + '" height="' + item.h + '"' : '';
    const caption = item.title && layout !== 'icons' ? '<figcaption>' + esc(item.title) + '</figcaption>' : '';
    return '<figure class="art-item">' +
      '<button type="button" class="art-open" data-art-open="' + index + '" data-file="' + esc(item.file) + '" aria-label="Открыть: ' + esc(label) + '" title="' + esc(label) + '"' +
        (style.length ? ' style="' + style.join(';') + '"' : '') + '>' +
        '<img src="' + esc(item.thumb || item.src) + '" alt="' + esc(label) + '"' + dims + (item.w ? '' : ' data-auto') + ' loading="lazy" decoding="async">' +
      '</button>' + caption + '</figure>';
  }

  function boardHTML(items, layout, section) {
    const pixel = isPixel(section, layout);
    const cls = 'art-grid art-' + layout + (pixel ? ' is-pixel' : '');
    const cell = layout === 'sprites' ? ' style="--cell:' + ((section.w || 200) + 18) + 'px"' : '';
    let html = '';
    let run = [];
    let currentGroup = null;
    const flush = function () {
      if (!run.length) return;
      if (currentGroup) html += '<h2 class="art-sub">❯ ' + esc(currentGroup) + '</h2>';
      html += '<div class="' + cls + '"' + cell + '>' + run.join('') + '</div>';
      run = [];
    };
    items.forEach(function (item, i) {
      if (item.group !== currentGroup) {
        flush();
        currentGroup = item.group;
      }
      run.push(itemHTML(item, i, layout));
    });
    flush();
    return html;
  }

  function tabsHTML(node) {
    const hub = hubNode();
    if (!hub) return '';
    const tabs = (hub.children || []).filter(function (c) { return !c.hidden; });
    return '<nav class="art-tabs" aria-label="Разделы портфолио">' + tabs.map(function (tab) {
      const here = tab.id === node.id;
      return '<a class="art-tab' + (here ? ' is-current' : '') + '" href="' + href(['art', tab.id]) + '"' + (here ? ' aria-current="page"' : '') + '>' + esc(tab.title.replace(/^\//, '')) + '</a>';
    }).join('') + '</nav>';
  }

  function factsHTML(section) {
    if (!section.facts || !section.facts.length) return '';
    return '<ul class="art-facts">' + section.facts.map(function (line) { return '<li>' + esc(line) + '</li>'; }).join('') + '</ul>';
  }

  function zoomHTML(zoom) {
    let buttons = '';
    for (let z = 1; z <= 4; z++) {
      buttons += '<button type="button" class="btn small" data-art-zoom="' + z + '" aria-pressed="' + (z === zoom ? 'true' : 'false') + '">×' + z + '</button>';
    }
    return '<div class="art-tools" role="group" aria-label="Масштаб миниатюр"><span>Масштаб</span>' + buttons + '</div>';
  }

  function gallery(node, path) {
    const section = node.gallery;
    const layout = LAYOUTS[section.layout] ? section.layout : 'masonry';
    lb.items = node.items;
    const zoom = readZoom();
    app.innerHTML =
      '<section class="panel section-panel art-panel" style="--zoom:' + zoom + '">' +
        '<p class="eyebrow tiny">/art/' + esc(node.id) + ' · ' + esc(countLabel(node.items.length)) + '</p>' +
        '<h1 class="page-title">' + esc(node.title) + '</h1>' +
        (node.desc ? '<p class="page-desc">' + esc(node.desc) + '</p>' : '') +
        tabsHTML(node) +
        factsHTML(section) +
        (layout === 'icons' && node.items.length ? zoomHTML(zoom) : '') +
        (node.items.length ? boardHTML(node.items, layout, section) : '<p class="empty">Здесь пока ничего нет. [ empty directory ]</p>') +
        '<nav class="section-actions" aria-label="Навигация по разделу">' +
          '<a class="btn" href="' + href(path.slice(0, -1)) + '">‹ Назад</a>' +
        '</nav>' +
      '</section>';
    document.title = node.title + ' — ' + lib.site.title;
  }

  function priceHTML(hub) {
    const rows = [];
    (hub.children || []).forEach(function (child) {
      const facts = child.gallery && child.gallery.facts;
      if (!facts || !facts.length) return;
      rows.push('<div class="price-group"><a class="price-name" href="' + href(['art', child.id]) + '">' + esc(child.title) + '</a><div class="price-lines">' +
        facts.map(function (line) {
          const at = line.indexOf(':');
          if (at < 0) return '<div class="price-line"><span class="price-value">' + esc(line) + '</span></div>';
          return '<div class="price-line"><span class="price-label">' + esc(line.slice(0, at)) + '</span><span class="price-value">' + esc(line.slice(at + 1).trim()) + '</span></div>';
        }).join('') + '</div></div>');
    });
    if (!rows.length) return '';
    return '<h2 class="art-sub">❯ Прайс</h2><div class="price-board">' + rows.join('') + '</div>';
  }

  function linksHTML(links) {
    if (!links || !links.length) return '';
    return '<div class="art-links">' + links.map(function (link) {
      const url = ctx.externalURL(link.url);
      if (!url) return '<span class="btn is-placeholder" title="Ссылка пока не добавлена">' + esc(link.label) + '</span>';
      return '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(link.label) + ' ↗</a>';
    }).join('') + '</div>';
  }

  function hub(node, path) {
    const p = data.profile || {};
    const avatar = p.avatar ? '<img src="' + esc(encodeURI(p.avatar)) + '" alt="' + esc(p.name || '') + '">' : '<span class="avatar-glyph" aria-hidden="true">✦</span>';
    const rows = [];
    (p.orders || []).forEach(function (order) {
      rows.push([esc(order.label), '<span class="lamp ' + (order.open ? 'on' : 'off') + '" aria-hidden="true"></span>' + (order.open ? 'открыты' : 'закрыты')]);
    });
    if (p.updated) rows.push(['Обновлено', esc(p.updated)]);
    app.innerHTML =
      '<section class="panel section-panel art-panel">' +
        '<p class="eyebrow tiny">/portfolio · ' + esc(countLabel(node.total || 0)) + '</p>' +
        '<h1 class="page-title">' + esc(node.title) + '</h1>' +
        '<p class="page-desc">' + esc(data.intro || node.desc || '') + '</p>' +
        '<div class="profile-card">' +
          '<div class="profile-side"><div class="avatar">' + avatar + '</div>' +
            (p.name ? '<div class="profile-name">' + esc(p.name) + '</div>' : '') +
            (p.pronouns ? '<div class="profile-pronouns">' + esc(p.pronouns) + '</div>' : '') +
            (p.role ? '<div class="profile-role">' + esc(p.role) + '</div>' : '') +
          '</div>' +
          '<dl class="profile-rows">' + rows.map(function (row) {
            return '<div><dt>' + row[0] + '</dt><dd>' + row[1] + '</dd></div>';
          }).join('') + '</dl>' +
        '</div>' +
        linksHTML(p.links) +
        priceHTML(node) +
        '<h2 class="art-sub">❯ Разделы</h2>' +
        ctx.list(node, path) +
        '<nav class="section-actions" aria-label="Навигация по разделу">' +
          '<a class="btn" href="' + href(path.slice(0, -1)) + '">‹ Назад</a>' +
        '</nav>' +
      '</section>';
    document.title = node.title + ' — ' + lib.site.title;
  }

  function buildLightbox() {
    const el = document.createElement('div');
    el.className = 'lb';
    el.hidden = true;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Просмотр работы');
    el.innerHTML =
      '<div class="lb-bar"><span class="lb-count"></span><span class="lb-actions">' +
        '<a class="btn small lb-orig" target="_blank" rel="noopener noreferrer">Оригинал ↗</a>' +
        '<button type="button" class="btn small lb-close" aria-label="Закрыть">✕</button>' +
      '</span></div>' +
      '<div class="lb-stage">' +
        '<button type="button" class="lb-nav lb-prev" aria-label="Предыдущая работа">‹</button>' +
        '<div class="lb-fig"><img class="lb-img" alt=""></div>' +
        '<button type="button" class="lb-nav lb-next" aria-label="Следующая работа">›</button>' +
      '</div>' +
      '<div class="lb-cap"><strong class="lb-title"></strong><span class="lb-desc"></span></div>';
    document.body.appendChild(el);
    lb.el = el;
    el.addEventListener('click', function (event) {
      if (event.target.closest('.lb-close')) close();
      else if (event.target.closest('.lb-prev')) step(-1);
      else if (event.target.closest('.lb-next')) step(1);
      else if (event.target === el || event.target.classList.contains('lb-stage') || event.target.classList.contains('lb-fig')) close();
    });
    el.addEventListener('touchstart', function (event) {
      lb.touchX = event.touches.length === 1 ? event.touches[0].clientX : null;
    }, { passive: true });
    el.addEventListener('touchend', function (event) {
      if (lb.touchX === null) return;
      const dx = event.changedTouches[0].clientX - lb.touchX;
      lb.touchX = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    }, { passive: true });
    el.querySelector('.lb-img').addEventListener('load', fit);
  }

  function fit() {
    if (!lb.el || lb.el.hidden) return;
    const img = lb.el.querySelector('.lb-img');
    const item = lb.items[lb.index];
    img.style.width = '';
    img.style.height = '';
    if (!item || !item.pixel || !img.naturalWidth) return;
    const maxW = Math.max(120, window.innerWidth - 150);
    const maxH = Math.max(120, window.innerHeight - 190);
    const scale = Math.floor(Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight));
    if (scale > 1) {
      img.style.width = img.naturalWidth * scale + 'px';
      img.style.height = 'auto';
    }
  }

  function show() {
    const item = lb.items[lb.index];
    if (!item) return;
    const el = lb.el;
    const img = el.querySelector('.lb-img');
    const url = item.full || item.src;
    img.classList.toggle('is-pixel', !!item.pixel);
    img.style.width = '';
    img.style.height = '';
    img.alt = item.title || '';
    img.src = url;
    el.querySelector('.lb-count').textContent = (lb.index + 1) + ' / ' + lb.items.length;
    el.querySelector('.lb-title').textContent = item.title || '';
    el.querySelector('.lb-desc').textContent = [item.desc, item.date].filter(Boolean).join(' · ');
    const orig = el.querySelector('.lb-orig');
    orig.href = url;
    el.classList.toggle('single', lb.items.length < 2);
  }

  function open(index, opener) {
    if (!lb.el) buildLightbox();
    const nodePixel = currentPixel();
    lb.items.forEach(function (item) { item.pixel = nodePixel; });
    lb.index = index;
    lb.opener = opener || null;
    lb.el.hidden = false;
    document.documentElement.classList.add('lb-open');
    show();
    lb.el.querySelector('.lb-close').focus();
  }

  function currentPixel() {
    const grid = document.querySelector('.art-grid');
    return !!(grid && grid.classList.contains('is-pixel'));
  }

  function step(delta) {
    if (lb.items.length < 2) return;
    lb.index = (lb.index + delta + lb.items.length) % lb.items.length;
    show();
  }

  function close() {
    if (!lb.el || lb.el.hidden) return;
    lb.el.hidden = true;
    document.documentElement.classList.remove('lb-open');
    const img = lb.el.querySelector('.lb-img');
    img.removeAttribute('src');
    if (lb.opener && lb.opener.isConnected) lb.opener.focus();
    lb.opener = null;
  }

  document.addEventListener('keydown', function (event) {
    if (!lb.el || lb.el.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    else if (event.key === 'Tab') {
      const focusable = Array.prototype.filter.call(lb.el.querySelectorAll('button, a[href]'), function (n) { return n.offsetParent !== null; });
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener('click', function (event) {
    const opener = event.target.closest('[data-art-open]');
    if (opener) {
      event.preventDefault();
      open(parseInt(opener.getAttribute('data-art-open'), 10), opener);
      return;
    }
    const zoomBtn = event.target.closest('[data-art-zoom]');
    if (zoomBtn) {
      const z = parseInt(zoomBtn.getAttribute('data-art-zoom'), 10);
      const panel = zoomBtn.closest('.art-panel');
      if (panel) panel.style.setProperty('--zoom', z);
      zoomBtn.parentNode.querySelectorAll('[data-art-zoom]').forEach(function (b) {
        b.setAttribute('aria-pressed', b === zoomBtn ? 'true' : 'false');
      });
      saveZoom(z);
    }
  });

  document.addEventListener('load', function (event) {
    const img = event.target;
    if (!img || img.tagName !== 'IMG' || !img.hasAttribute('data-auto')) return;
    const holder = img.closest('.art-open');
    if (holder && img.naturalWidth) {
      holder.style.setProperty('--w', img.naturalWidth);
      holder.style.setProperty('--ratio', img.naturalWidth + '/' + img.naturalHeight);
    }
  }, true);

  document.addEventListener('error', function (event) {
    const img = event.target;
    if (!img || img.tagName !== 'IMG') return;
    const holder = img.closest('.art-open');
    if (holder) holder.classList.add('is-broken');
  }, true);

  window.addEventListener('resize', fit);

  return { attach: attach, hub: hub, gallery: gallery, close: close };
};
