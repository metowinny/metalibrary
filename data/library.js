window.LIBRARY = {
  site: {
    title: "outofsite",
    tagline: "Малые нерождённые миры.",
    intro: "Здесь будет короткое приветствие. Заглушка.",
    footer: "© Винни Метонимий, 2026"
  },
  root: {
    id: "root",
    title: "Главная",
    children: [
      {
        id: "poems",
        title: "/стихотворения",
        desc: "Коллекция сборников стихотворений и сольных строк",
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
        title: "/рассказы",
        desc: "Библиотека зарисовок с неизвестных натур",
        children: [
          { id: "story-1", title: "Название рассказа", file: "story-1.html", meta: "рассказ" }
        ]
      },
      {
        id: "songs",
        title: "/тексты_песен",
        desc: "Тексты глухих песен немых авторов",
        children: [
          { id: "song-1", title: "Название песни", file: "song-1.html", meta: "песня" }
        ]
      },
      {
        id: "essays",
        title: "/публицистика",
        desc: "Очерки о том, о чём лучше промолчать",
        children: [
          { id: "essay-1", title: "Название статьи", file: "essay-1.html", meta: "статья" }
        ]
      },
      {
        id: "styles",
        title: "/шпаргалка по оформлению",
        desc: "Все доступные стили текста в одном месте",
        file: "styles.html",
        meta: "справка"
      }
    ]
  }
};
