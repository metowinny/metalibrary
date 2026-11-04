window.GALLERY = {
  intro: "Портфолио: костюмы, предметы, медальки, иллюстрации и фоны.",
  profile: {
    name: "Винни Метонимий",
    pronouns: "он/его",
    role: "художник сайтовой команды CatWar",
    avatar: "",
    updated: "27.07.26",
    orders: [
      { label: "Индивидуальные заказы", open: false },
      { label: "Сайтовые и фракционные заказы", open: true }
    ],
    links: [
      { label: "Carrd", url: "https://met0w1nny.carrd.co/" },
      { label: "CatWar", url: "" }
    ]
  },
  sections: [
    {
      id: "costumes",
      title: "/костюмы",
      desc: "Костюмы для котов, 200×300",
      layout: "sprites",
      dir: "images/art/demo/",
      w: 200,
      h: 300,
      facts: ["Поверх модельки: от 400р", "Перекрывающий: от 600р"],
      groups: [
        {
          title: "Поверх модельки",
          items: [
            { src: "costume-1.svg", title: "Демо: костюм 1" },
            { src: "costume-2.svg", title: "Демо: костюм 2" },
            { src: "costume-3.svg", title: "Демо: костюм 3" }
          ]
        },
        {
          title: "Перекрывающие",
          items: [
            { src: "costume-4.svg", title: "Демо: костюм 4" },
            { src: "costume-5.svg", title: "Демо: костюм 5" }
          ]
        }
      ]
    },
    {
      id: "items",
      title: "/предметы",
      desc: "Предметы для котов",
      layout: "icons",
      dir: "images/art/demo/",
      w: 70,
      h: 70,
      items: [
        { src: "item-1.svg", title: "Демо: предмет 1" },
        { src: "item-2.svg", title: "Демо: предмет 2" },
        { src: "item-3.svg", title: "Демо: предмет 3" },
        { src: "item-4.svg", title: "Демо: предмет 4" },
        { src: "item-5.svg", title: "Демо: предмет 5" },
        { src: "item-6.svg", title: "Демо: предмет 6" },
        { src: "item-7.svg", title: "Демо: предмет 7", w: 64, h: 72 },
        { src: "item-8.svg", title: "Демо: предмет 8", w: 64, h: 72 }
      ]
    },
    {
      id: "medals",
      title: "/медальки",
      desc: "Медальки и значки",
      layout: "icons",
      dir: "images/art/demo/",
      w: 70,
      h: 70,
      items: [
        { src: "medal-1.svg", title: "Демо: медалька 1" },
        { src: "medal-2.svg", title: "Демо: медалька 2" },
        { src: "medal-3.svg", title: "Демо: медалька 3" },
        { src: "medal-4.svg", title: "Демо: медалька 4" },
        { src: "medal-5.svg", title: "Демо: медалька 5" },
        { src: "medal-6.svg", title: "Демо: медалька 6" }
      ]
    },
    {
      id: "illustrations",
      title: "/иллюстрации",
      desc: "Полноразмерные работы",
      layout: "masonry",
      dir: "images/art/demo/",
      pixel: false,
      facts: ["Цена договорная"],
      items: [
        { src: "illustration-1.svg", title: "Демо: иллюстрация 1", desc: "Описание, дата или инструменты, если нужно.", w: 1200, h: 1600 },
        { src: "illustration-2.svg", title: "Демо: иллюстрация 2", w: 1600, h: 1000 }
      ]
    },
    {
      id: "backgrounds",
      title: "/фоны",
      desc: "Фоны, 1000×1000",
      layout: "tiles",
      dir: "images/art/demo/",
      w: 1000,
      h: 1000,
      items: [
        { src: "background-1.svg", title: "Демо: фон 1" },
        { src: "background-2.svg", title: "Демо: фон 2" }
      ]
    }
  ]
};
