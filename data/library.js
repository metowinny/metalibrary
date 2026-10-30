window.LIBRARY = {
  site: {
    title: "Название сайта",
    tagline: "Подзаголовок-заглушка",
    intro: "Здесь будет короткое приветствие. Заглушка.",
    footer: "© Имя Автора, 2026 · всё написанное здесь — заглушка"
  },
  root: {
    id: "root",
    title: "Главная",
    children: [
      {
        id: "poems",
        title: "Стихотворения",
        desc: "Заглушка описания раздела",
        children: [
          {
            id: "metonymies",
            title: "Сборник «Метонимии»",
            desc: "Заглушка описания сборника",
            children: [
              { id: "m-1", title: "Первое стихотворение", file: "poem-1.html", meta: "стихотворение" },
              { id: "m-2", title: "Второе стихотворение", file: "poem-2.html", meta: "стихотворение" }
            ]
          }
        ]
      },
      {
        id: "stories",
        title: "Рассказы",
        desc: "Заглушка описания раздела",
        children: [
          { id: "story-1", title: "Название рассказа", file: "story-1.html", meta: "рассказ" }
        ]
      },
      {
        id: "songs",
        title: "Тексты песен",
        desc: "Заглушка описания раздела",
        children: [
          { id: "song-1", title: "Название песни", file: "song-1.html", meta: "песня" }
        ]
      },
      {
        id: "essays",
        title: "Публицистика",
        desc: "Заглушка описания раздела",
        children: [
          { id: "essay-1", title: "Название статьи", file: "essay-1.html", meta: "статья" }
        ]
      },
      {
        id: "styles",
        title: "Шпаргалка по оформлению",
        desc: "Все доступные стили текста в одном месте",
        file: "styles.html",
        meta: "справка"
      }
    ]
  }
};
