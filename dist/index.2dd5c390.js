class Controller {
    constructor(){
        this.model = new Model();
        this.view = new View();
    }
    initShop() {
        this.view.shop.addEventListener("click", ()=>{
            this.increment(event, ".item", "plus");
        });
        this.view.shop.addEventListener("click", ()=>{
            this.decrement(event, ".item", "minus");
        });
        this.view.generateShop(this.model.shopItemsData, this.model.basket);
        this.calculation();
    }
    initCart() {
        this.view.shopingCart.addEventListener("click", ()=>{
            this.increment(event, ".cart__item", "plus");
        });
        this.view.shopingCart.addEventListener("click", ()=>{
            this.decrement(event, ".cart__item", "minus");
        });
        this.view.shopingCart.addEventListener("click", ()=>{
            this.deleteCard(event, ".cart__item", "cross");
        });
        this.view.label.addEventListener("click", ()=>{
            this.clearCart(event, "clear");
        });
        this.view.generateCartItems(this.model.basket, this.model.shopItemsData);
        this.calculation();
        this.getTotal();
    }
    increment(e, parentClass, actionName) {
        const parentNode = e.target.closest(parentClass);
        const id = parentNode.id;
        const search = this.model.basket.find((item)=>item.id === id);
        if (e.target.dataset.action === actionName) {
            if (search === undefined) {
                this.model.basket.push({
                    id,
                    amount: 1
                });
                this.model.setLocalStorage();
                this.update(id);
            } else {
                search.amount += 1;
                this.update(id);
                this.model.setLocalStorage();
            }
        }
    }
    decrement(e, parentClass, actionName) {
        const parentNode = e.target.closest(parentClass);
        const id = parentNode.id;
        const search = this.model.basket.find((item)=>item.id === id);
        if (e.target.dataset.action === actionName) {
            if (search === undefined) return;
            else if (search.amount > 0) {
                search.amount -= 1;
                this.update(id);
                this.model.basket = this.model.basket.filter((item)=>item.amount !== 0);
                this.model.setLocalStorage();
            }
        }
    }
    deleteCard(e, parentClass, actioName) {
        const parentNode = e.target.closest(parentClass);
        const id = parentNode.id;
        if (e.target.dataset.action === actioName) this.model.basket = this.model.basket.filter((item)=>item.id !== id);
        this.view.generateCartItems(this.model.basket, this.model.shopItemsData);
        this.getTotal();
        this.calculation();
        this.model.setLocalStorage();
    }
    clearCart(e, actionName) {
        if (e.target.dataset.action === actionName) {
            this.model.basket = [];
            this.view.generateCartItems(this.model.basket, this.model.shopItemsData);
            this.calculation();
            this.model.setLocalStorage();
        }
    }
    getTotal() {
        if (this.model.basket.length !== 0) {
            const total = this.model.basket.map((item)=>{
                const { id, amount } = item;
                const search = this.model.shopItemsData.find((shopItem)=>shopItem.id === id) || [];
                return amount * search.price;
            }).reduce((item, sum)=>sum += item, 0);
            this.view.label.innerHTML = `
          <h2>Общяя стоимость: ${total}$</h2>
          <button data-action="check" class="checkout">Оформить</button>
          <button data-action="clear" class="clear__all">Очистить корзину</button>
        `;
        } else return;
    }
    update(id) {
        const search = this.model.basket.find((item)=>item.id === id);
        const item = document.getElementById(id);
        const quantity = item.querySelector(".quantity");
        quantity.innerHTML = search.amount;
        this.calculation();
    }
    calculation() {
        this.view.cartIcon.innerHTML = this.model.basket.map((item)=>item.amount).reduce((amount, sum)=>sum += amount, 0);
    }
}

//# sourceMappingURL=index.2dd5c390.js.map
