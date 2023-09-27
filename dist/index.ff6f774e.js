class View {
    constructor(){
        this.cartIcon = document.getElementById("cart_amount");
        this.shop = document.getElementById("shop");
        this.cartIcon = document.getElementById("cart_amount");
        this.label = document.getElementById("label");
        this.shopingCart = document.getElementById("shoping__cart");
    }
    generateShop(data, products) {
        return this.shop.innerHTML = data.map((item)=>{
            const { id, name, desc, price, img } = item;
            const search = products.find((item)=>item.id === id) || [];
            return `
      <li class="item" id="${id}">
        <img width="220px" src="${img}" alt="" />
        <div class="details">
          <h3>${name}</h3>
          <p>${desc}</p>
          <div class="price_quantity">
            <h2>${price}$</h2>
            <div class="buttons">
              <i data-action="minus" class="bi bi-dash-lg"></i>
              <div class="quantity">${search.amount === undefined ? 0 : search.amount}</div>
              <i data-action="plus" class="bi bi-plus-lg"></i>
            </div>
          </div>
        </div>
       </li>
  `;
        }).join("");
    }
    generateCartItems = (products, data)=>{
        if (products.length !== 0) return this.shopingCart.innerHTML = products.map((item)=>{
            const { id, amount } = item;
            const search = data.find((shopItem)=>shopItem.id === id) || [];
            return `
          <div class="cart__item" id="${search.id}">
            <img width="100px" src="${search.img}" alt="smth"/>
            <div class="details">
              <div class="title__price-x">
                <h4 class="title__price">
                  <p>${search.name}</p>
                  <p class="price">${search.price}$</p>
                </h4>
                <i data-action="cross" class="bi bi-x-lg"></i>
              </div>
              <div class="buttons">
                <i data-action="minus" class="bi bi-dash-lg"></i>
                <div class="quantity">${amount}</div>
                <i data-action="plus" class="bi bi-plus-lg"></i>
             </div>
              <h3 class="total__price">${amount * search.price}$</h3>
            </div>
          </div>
        `;
        }).join("");
        else {
            this.shopingCart.innerHTML = ``;
            this.label.innerHTML = `
      <h2>Корзина пуста</h2>
      <a href="index.html">
        <button class="home__btn">Продолжить покупки</button>
      </a>
      `;
        }
    };
}

//# sourceMappingURL=index.ff6f774e.js.map
