window.LIBRARY = {
  site: {
    title: "outofsite",
    tagline: "малые нерождённые миры",
    intro: "Архив стихотворений, песен, рассказов и других текстов, а также артов и спрайтов.",
    footer: "© Винни Метонимий, 2026",
      author: {
      avatar: "",
      name: "Винни Метонимий",
      nick: "met0w1nny",
      about: [
        "Писатель, художник, медийщик почти-с-дипломом и много кто ещё.",
        "Автор романа «Нулевой Трибунал», создатель его сайта и бюрократ Википедии, художник сайтовой команды CatWar, ранее художник и лоровед Calamity."
      ]
    },
    links: {
      tribunal: "https://metowinny.github.io/metowinny/index.html",
      vk: "https://vk.ru/meto.winny",
      telegram: "https://t.me/metowinny"
    }
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
            desc: "Грязная игра слов и образов",
            children: [
              { id: "m-1", title: "Дихотомии", file: "poem-1.html", meta: "стихотворение" },
              { id: "m-2", title: "Зевгма", file: "poem-2.html", meta: "стихотворение" },
              { id: "m-3", title: "Кубик Рубика", file: "poem-3.html", meta: "стихотворение" },
              { id: "m-4", title: "Не про тебя", file: "poem-4.html", meta: "стихотворение" }
            ]
          }
        ]
      },
      {
        id: "stories",
        title: "/рассказы",
        desc: "Библиотека зарисовок с неизвестных натур",
        children: [
          { id: "story-1", title: "Прошлый раз", file: "story-1.html", meta: "рассказ" }
        ]
      },
      {
        id: "songs",
        title: "/тексты_песен",
        desc: "Тексты глухих песен немых авторов",
        children: [
          { id: "song-1", title: "Название песни", file: "song-1.html", meta: "песня", hidden: true }
        ]
      },
      {
        id: "essays",
        title: "/публицистика",
        desc: "Очерки о том, о чём лучше промолчать",
        children: [
          { id: "essay-1", title: "Название статьи", file: "essay-1.html", meta: "статья", hidden: true }
        ]
      },
      {
        id: "art",
        title: "/арты",
        desc: "Портфолио: костюмы, предметы, медальки, иллюстрации и фоны",
        symbol: "◈",
        art: true,
        children: []
      },
      {
        id: "styles",
        title: "/шпаргалка по оформлению",
        desc: "Все доступные стили текста в одном месте",
        file: "styles.html",
        meta: "справка",
        hidden: true
      }
    ]
  }
};
