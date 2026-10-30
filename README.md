# my-library-stub

Заглушка сайта-хранилища текстов (стихи, рассказы, песни, публицистика). Дизайн: Frutiger Aero Night. Сборки нет, всё работает на чистом HTML/CSS/JS.

## Как выложить на GitHub (через браузер)

1. На github.com нажми **+ → New repository**. Имя любое (это заглушка, потом сменишь в Settings → General → Repository name). Поставь **Public**, галочки README/gitignore не нужны. **Create repository**.
2. На странице пустого репозитория нажми **uploading an existing file** (или Add file → Upload files).
3. Распакуй архив и перетащи в окно **содержимое** папки (index.html, assets, data, texts, .nojekyll, README.md), а не саму папку и не zip. Папки перетаскиваются вместе со структурой.
4. Внизу **Commit changes**.
5. **Settings → Pages**. В разделе Build and deployment: Source = **Deploy from a branch**, Branch = **main**, папка **/ (root)**, **Save**.
6. Через 1–2 минуты сайт появится по адресу `https://ТВОЙ-ЛОГИН.github.io/ИМЯ-РЕПОЗИТОРИЯ/` (ссылка покажется на той же странице Pages).

Если файл .nojekyll не загрузился (точечные файлы иногда пропускаются), создай его вручную: Add file → Create new file → имя `.nojekyll`, содержимое пустое. Сайт и без него обычно работает.

## Как устроено

- `data/library.js` — всё дерево сайта: название, подзаголовок, подвал, разделы и тексты.
- `texts/` — сами тексты, по одному HTML-файлу на текст.
- `assets/css/style.css` — оформление, цвета в `:root` наверху.
- `assets/js/main.js` — навигация и отрисовка, трогать обычно не нужно.

## Как добавить текст

1. Создай файл в `texts/`, например `texts/moe-stihotvorenie.html`, и напиши в нём текст (стили смотри на странице «Шпаргалка по оформлению» на сайте или в `texts/styles.html`).
2. Открой `data/library.js` и добавь строку в нужный раздел:

```
{ id: "moe-stihotvorenie", title: "Название", file: "moe-stihotvorenie.html", meta: "стихотворение" }
```

`id` — латиницей без пробелов, он попадает в адрес страницы. Между записями нужны запятые.

## Как добавить раздел или вложенный сборник

Запись с полем `children` вместо `file`; вложенность любая:

```
{
  id: "new-section",
  title: "Название раздела",
  desc: "Короткое описание",
  children: [
    { id: "text-1", title: "Текст", file: "text-1.html", meta: "рассказ" }
  ]
}
```

## Локальный просмотр

Тексты подгружаются через fetch, поэтому двойной клик по index.html не сработает. Нужен локальный сервер: в папке проекта `python -m http.server`, затем http://localhost:8000.
