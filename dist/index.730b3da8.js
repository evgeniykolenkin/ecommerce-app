class Model {
    constructor(){
        this.basket = this.getLocalStorage();
        this.shopItemsData = [
            {
                id: "jfhgbvnscs",
                name: "Casual Shirt",
                price: 45,
                desc: "Lorem ipsum dolor sit amet consectetur adipisicing.",
                img: "resources/img-1.jpg"
            },
            {
                id: "ioytrhndcv",
                name: "Office Shirt",
                price: 100,
                desc: "Lorem ipsum dolor sit amet consectetur adipisicing.",
                img: "resources/img-2.jpg"
            },
            {
                id: "wuefbncxbsn",
                name: "T Shirt",
                price: 25,
                desc: "Lorem ipsum dolor sit amet consectetur adipisicing.",
                img: "resources/img-3.jpg"
            },
            {
                id: "thyfhcbcv",
                name: "Mens Suit",
                price: 300,
                desc: "Lorem ipsum dolor sit amet consectetur adipisicing.",
                img: "resources/img-4.jpg"
            }
        ];
    }
    setLocalStorage() {
        return localStorage.setItem("data", JSON.stringify(this.basket));
    }
    getLocalStorage() {
        const data = localStorage.getItem("data");
        return JSON.parse(data) || [];
    }
}

//# sourceMappingURL=index.730b3da8.js.map
