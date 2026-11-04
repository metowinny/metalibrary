window.GALLERY = {
  intro: "Художественное портфолио",
  profile: {
    name: "Винни Метонимий",
    pronouns: "он/его",
    role: "Эхосказ [1601504]",
    avatar: "",
    updated: "04.11.26",
    orders: [
      { label: "Индивидуальные заказы", open: false },
      { label: "Сайтовые и фракционные заказы", open: true }
    ],
    links: [
      { label: "Carrd", url: "https://met0w1nny.carrd.co/" },
      { label: "CatWar", url: "https://catwar.net/cat1601504" }
    ]
  },
  sections: [
    {
      id: "costumes",
      title: "/костюмы",
      desc: "Костюмы на 200х300",
      layout: "sprites",
      dir: "images/art/cost/",
      w: 200,
      h: 300,
      facts: ["Дополняющий: от 400р", "Перекрывающий: от 600р"],
      groups: [
        {
          title: "Поверх модельки",
          items: [
            { src: "cost1.png", title: "Сезонный костюм (осень '25)" },
            { src: "cost2.png", title: "Праздничный костюм (ДР КПВ '26)" },
            { src: "cost3.png", title: "Сезонный костюм (лето '26)" },
            { src: "cost4.png", title: "Праздничный костюм (Хэллоуин '26)" },
            { src: "cost5.png", title: "Праздничный костюм (ДР Вара '26)" },
            { src: "cost6.png", title: "Праздничный костюм (Хэллоуин '25)" },
            { src: "cost7.png", title: "Сезонный костюм (весна '26)" }
          ]
        },
        {
          title: "Перекрывающие",
          items: [
            { src: "percost1.png", title: "Костюм актёра (Острозуб)" },
            { src: "percost2.png", title: "Костюм актёра (Орёл)" },
            { src: "percost3.png", title: "Костюм актёра (Громосказ)" }
          ]
        }
      ]
    },
    {
      id: "items",
      title: "/предметы",
      desc: "Мелкоформатки (в основном предметы на 70х70 и ачивки)",
      layout: "icons",
      dir: "images/art/small/",
      w: 70,
      h: 70,
      items: [
        { src: "item1.png", title: "Памятный предмет (КПВ)" },
        { src: "item2.png", title: "Памятный предмет (КПВ)" },
        { src: "item3.png", title: "Памятный предмет (КПВ)" },
        { src: "item4.png", title: "Памятный предмет (КПВ)" }
      ]
    },
    {
      id: "medals",
      title: "/медальки",
      desc: "Медальки и другие значки",
      layout: "icons",
      dir: "images/art/small/",
      w: 70,
      h: 70,
      items: [
        { src: "medal1.png", title: "«Старательный помощник» (КПВ)" }
      ]
    },
    {
      id: "illustrations",
      title: "/иллюстрации",
      desc: "Полноразмерные работы",
      layout: "masonry",
      dir: "images/art/full/",
      pixel: false,
      facts: ["Цена договорная"],
      items: [
        { src: "full1.jpg", title: "Аймер ('26)", w: 1853, h: 2560 },
        { src: "full2.jpg", title: "Рекруты Рока ('26)", w: 2560, h: 1244 },
        { src: "full3.jpg", title: "Тобиас Нортенмор ('26)", w: 995, h: 1280 },
        { src: "full4.jpg", title: "Лотерея КПВ ('26)", w: 1280, h: 834 },
        { src: "full5.jpg", title: "Эйс ('26)", w: 1132, h: 1280 },
        { src: "full6.jpg", title: "Кеннет Хилл — обложка «Безбрежия Желаний» ('25)", w: 2559, h: 1828 },
      ]
    },
    {
      id: "backgrounds",
      title: "/фоны",
      desc: "Фоны на 1000×1000",
      layout: "tiles",
      dir: "images/art/back/",
      w: 1000,
      h: 1000,
      items: [
        { src: "back1.jpg", title: "Ствол дуба" },
        { src: "back2.jpg", title: "Застрявшие доски" }
      ]
    }
  ]
};
