const receitas = [
    {
        id: 1,
        nome: "Bolo de cenoura",
        categoria: "Sobremesa",
        tempoPreparo: 45,
        porcoes: 10,
        ingredientes: [
            "3 cenouras",
            "3 ovos",
            "2 xícaras de açúcar",
            "2 xícaras de farinha de trigo",
            "1 colher de fermento"
        ],
        modoPreparo: "Bata os ingredientes no liquidificador, misture a farinha e o fermento e leve ao forno."
    },
    {
        id: 2,
        nome: "Panqueca de frango",
        categoria: "Almoço",
        tempoPreparo: 40,
        porcoes: 6,
        ingredientes: [
            "2 ovos",
            "2 xícaras de leite",
            "2 xícaras de farinha",
            "Frango desfiado",
            "Molho de tomate"
        ],
        modoPreparo: "Prepare a massa, faça as panquecas, recheie com frango e cubra com molho."
    }
];

module.exports = receitas;