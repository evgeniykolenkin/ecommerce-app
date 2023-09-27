import { Model } from "./model.js";
import { View } from "./view.js";

export class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
  }

  initShop() {
    this.view.ordersNode.addEventListener("click", () => {
      this.showOrders();
    });
    this.view.shop.addEventListener("click", () => {
      this.increment(event, ".item", "plus");
    });
    this.view.shop.addEventListener("click", () => {
      this.decrement(event, ".item", "minus");
    });
    this.view.shop.addEventListener("click", () => {
      this.openCardPopup(event);
    });
    this.view.popupCardNode.addEventListener("click", () => {
      this.closePopup(event, "close");
    });
    this.view.popupCardNode.addEventListener("click", () => {
      this.addToCart(event);
    });
    this.view.ordersListNode.addEventListener("click", () => {
      this.openOrder(event);
    });
    this.view.generateShop(this.model.shopList, this.model.basket, true);
    this.model.getProducts().then((response) => {
      this.model.update(response);
      this.view.generateShop(this.model.shopList, this.model.basket);
      this.view.generateDropdown(this.model.basket, this.model.shopList);
    });
    this.view.renderOrderLink(this.model.orders);
    this.calculation();
  }

  initCart() {
    this.view.shopingCart.addEventListener("click", () => {
      this.increment(event, ".cart__item", "plus");
    });
    this.view.shopingCart.addEventListener("click", () => {
      this.decrement(event, ".cart__item", "minus");
    });
    this.view.shopingCart.addEventListener("click", () => {
      this.deleteCard(event, ".cart__item", "cross");
    });
    this.view.label.addEventListener("click", () => {
      this.clearCart(event, "clear");
    });
    this.view.generateCartItems(this.model.basket, this.model.shopList, true);
    this.model.getProducts().then((response) => {
      this.model.update(response);
      this.view.generateCartItems(this.model.basket, this.model.shopList);
      this.getTotal();
    });

    this.calculation();
  }

  initCheckout() {
    this.view.saveAddressData.addEventListener("click", () => {
      this.saveAdressData(event);
    });
    this.view.paymentDataContent.addEventListener("click", () => {
      this.choosePaymentMethod(event);
    });
    this.view.addressPopupData.addEventListener("click", () => {
      this.closeChangeAddressPopup(event);
    });
    this.view.paymentPopupData.addEventListener("click", () => {
      this.closeChangePaymentPopup(event);
    });
    this.view.changeAddressBtn.addEventListener("click", () => {
      this.openChangeAddressPopup();
    });
    this.view.changePaymentBtn.addEventListener("click", () => {
      this.openChangePaymentPopup();
    });
    this.view.label.addEventListener("click", () => {
      this.sendOrder(event);
    });
    this.model.getProducts().then((response) => {
      this.model.update(response);
      this.view.renderCheckoutPage(this.model.basket, this.model.shopList);
      this.getResult();
    });
    this.calculation();
  }

  initOrder() {
    this.model.getProducts().then((response) => {
      this.model.update(response);
      this.view.renderOrderData(this.model.orders, this.model.shopList);
    });
  }

  increment(e, parentClass, actionName) {
    const parentNode = e.target.closest(parentClass);
    const dropdown = document.querySelector(".dropdown");
    if (parentNode === null) {
      return;
    } else {
      const id = parentNode.id;
      const search = this.model.basket.find((item) => item.id === id);
      if (e.target.dataset.action === actionName) {
        if (search === undefined) {
          this.model.basket.push({
            id,
            amount: 1,
          });
          this.model.setLocalStorage();
          this.update(id);
          this.view.generateDropdown(this.model.basket, this.model.shopList);
        } else {
          search.amount += 1;
          this.update(id);
          this.model.setLocalStorage();
          if (dropdown) {
            this.view.generateDropdown(this.model.basket, this.model.shopList);
          } else {
            return;
          }
        }
      }
    }
  }

  decrement(e, parentClass, actionName) {
    const parentNode = e.target.closest(parentClass);
    const dropdown = document.querySelector(".dropdown");
    if (parentNode === null) {
      return;
    } else {
      const id = parentNode.id;
      const search = this.model.basket.find((item) => item.id === id);
      if (e.target.dataset.action === actionName) {
        if (search === undefined) {
          return;
        } else if (search.amount > 0) {
          search.amount -= 1;
          this.update(id);
          this.model.basket = this.model.basket.filter(
            (item) => item.amount !== 0
          );
          this.model.setLocalStorage();
          if (dropdown) {
            this.view.generateDropdown(this.model.basket, this.model.shopList);
          } else {
            return;
          }
        }
      }
    }
  }

  deleteCard(e, parentClass, actioName) {
    const parentNode = e.target.closest(parentClass);
    const id = parentNode.id;
    if (e.target.dataset.action === actioName) {
      this.model.basket = this.model.basket.filter((item) => item.id !== id);
    }
    this.view.generateCartItems(this.model.basket, this.model.shopList);
    this.getTotal();
    this.calculation();
    this.model.setLocalStorage();
  }

  clearCart(e, actionName) {
    if (e.target.dataset.action === actionName) {
      this.model.basket = [];
      this.view.generateCartItems(this.model.basket, this.model.shopList);
      this.calculation();
      this.model.setLocalStorage();
    }
  }

  getTotal() {
    const delivery = 6.99;
    if (this.model.basket.length !== 0) {
      const total = this.model.basket
        .map((item) => {
          const { id, amount } = item;
          const search =
            this.model.shopList.find((shopItem) => shopItem.id === id) || [];
          return amount * search.price;
        })
        .reduce((item, sum) => (sum += item), 0);
      const result = Number(total + delivery).toFixed(2);
      this.view.label.innerHTML = `
          <div class="total__result">
            <h3 class="total__result-title">Сумма</h3>
            <h2 class="total__result-subtitle">Товары: ${total.toFixed(2)}$</h2>
            <h2 class="total__result-subtitle">Доставка: ${delivery}$</h2>
          </div>
          <div class="total__result-price">Стоимость: ${result}$</div>
           <div class="total__result-buttons">
            <a href="checkout.html" data-action="check" class="checkout">Оформить</a>
            <button data-action="clear" class="clear__all">Очистить корзину</button>
           </div>   
        `;
    } else {
      return;
    }
  }

  getResult() {
    const delivery = 6.99;
    if (this.model.basket.length !== 0) {
      const total = this.model.basket
        .map((item) => {
          const { id, amount } = item;
          const search =
            this.model.shopList.find((shopItem) => shopItem.id === id) || [];
          return amount * search.price;
        })
        .reduce((item, sum) => (sum += item), 0);
      const result = Number(total + delivery).toFixed(2);
      this.view.label.innerHTML = `
          <div class="total__result">
            <h3 class="total__result-title">Сумма</h3>
            <h2 class="total__result-subtitle">Товары: ${total.toFixed(2)}$</h2>
            <h2 class="total__result-subtitle">Доставка: ${delivery}$</h2>
          </div>
          <div class="total__result-price">Стоимость: ${result}$</div>
           <div class="total__result-buttons">
            <button data-action="send" class="send__btn" id="send__btn">Разместить заказ</button>
           </div>   
        `;
    } else {
      return;
    }
  }

  update(id) {
    const search = this.model.basket.find((item) => item.id === id);
    const item = document.getElementById(id);
    const quantity = item.querySelector(".quantity");
    quantity.innerHTML = search.amount;
    this.calculation();
  }

  calculation() {
    this.view.cartIcon.innerHTML = this.model.basket
      .map((item) => item.amount)
      .reduce((amount, sum) => (sum += amount), 0);
  }

  togglePopup() {
    this.view.popupCardNode.classList.toggle("popup__open");
    this.view.bodyNode.classList.toggle("body__fixed");
  }

  openCardPopup(e) {
    const parentNode = e.target.closest(".item");
    if (parentNode === null) {
      return;
    } else if (e.target.dataset.action === "show") {
      this.view.renderPopupCard(event, this.model.shopList);
      this.togglePopup();
    }
  }

  openChangeAddressPopup() {
    this.view.addressPopupData.classList.toggle("checkout__popup-open");
    this.view.bodyNode.classList.toggle("body__fixed");
  }

  saveAdressData(e) {
    e.preventDefault();
    if (
      this.view.addressNamePopup.value.trim() &&
      this.view.addressStreetPopup.value.trim() &&
      this.view.addressCityPopup.value.trim() &&
      this.view.addressPhonePopup.value.trim()
    ) {
      this.view.addressNameData.innerHTML =
        this.view.addressNamePopup.value.trim();
      this.view.addressStreetData.innerHTML =
        this.view.addressStreetPopup.value.trim();
      this.view.addressCityData.innerHTML =
        this.view.addressCityPopup.value.trim();
      this.view.addressPhoneData.innerHTML =
        this.view.addressPhonePopup.value.trim();
      this.view.addressPopupData.classList.toggle("checkout__popup-open");
      this.view.bodyNode.classList.toggle("body__fixed");
    }
    if (!this.view.addressNamePopup.value.trim()) {
      this.view.addressNamePopup.classList.add("checkout__sign");
    } else {
      this.view.addressNamePopup.classList.remove("checkout__sign");
    }
    if (!this.view.addressStreetPopup.value.trim()) {
      this.view.addressStreetPopup.classList.add("checkout__sign");
    } else {
      this.view.addressStreetPopup.classList.remove("checkout__sign");
    }
    if (!this.view.addressCityPopup.value.trim()) {
      this.view.addressCityPopup.classList.add("checkout__sign");
    } else {
      this.view.addressCityPopup.classList.remove("checkout__sign");
    }
    if (!this.view.addressPhonePopup.value.trim()) {
      this.view.addressPhonePopup.classList.add("checkout__sign");
    } else {
      this.view.addressPhonePopup.classList.remove("checkout__sign");
    }
  }

  closeChangeAddressPopup(e) {
    const isClickOutsideContent = !e
      .composedPath()
      .includes(this.view.addressPopupContent);

    if (isClickOutsideContent) {
      this.view.addressPopupData.classList.toggle("checkout__popup-open");
      this.view.bodyNode.classList.toggle("body__fixed");
    }
  }

  openChangePaymentPopup() {
    this.view.paymentPopupData.classList.toggle("payment__popup-open");
    this.view.bodyNode.classList.toggle("body__fixed");
  }

  closeChangePaymentPopup(e) {
    const isClickOutsideContent = !e
      .composedPath()
      .includes(this.view.paymentDataContent);

    if (isClickOutsideContent) {
      this.view.paymentPopupData.classList.toggle("payment__popup-open");
      this.view.bodyNode.classList.toggle("body__fixed");
    }
  }

  choosePaymentMethod(e) {
    if (e.target.dataset.action === "cardpay") {
      this.model.payMethod = "card";
      this.view.paymentDataDefault.classList.add("hidden");
      this.view.paymentDataCash.classList.add("hidden");
      this.view.cashInputNode.checked = false;
      this.view.paymentDataCard.classList.remove("hidden");
      this.view.paymentPopupData.classList.toggle("payment__popup-open");
      this.view.bodyNode.classList.toggle("body__fixed");

      return this.model.payMethod;
    }
    if (e.target.dataset.action === "cashpay") {
      this.model.payMethod = "cash";
      this.view.paymentDataDefault.classList.add("hidden");
      this.view.paymentDataCard.classList.add("hidden");
      this.view.cardInputNode.checked = false;
      this.view.paymentDataCash.classList.remove("hidden");
      this.view.paymentPopupData.classList.toggle("payment__popup-open");
      this.view.bodyNode.classList.toggle("body__fixed");

      return this.payMethod;
    }
  }

  addToCart(e) {
    const parentNode = e.target.closest(".popup__content");
    if (e.target.dataset.action === "add") {
      const add = parentNode.querySelector(".popup__btn-add");
      const id = add.id;
      const search = this.model.basket.find((item) => item.id === id);
      if (search === undefined) {
        this.model.basket.push({
          id,
          amount: 1,
        });
        this.model.setLocalStorage();
        this.update(id);
        this.view.generateDropdown(this.model.basket, this.model.shopList);
      } else {
        search.amount += 1;
        this.update(id);
        this.model.setLocalStorage();
        this.view.generateDropdown(this.model.basket, this.model.shopList);
      }
      this.togglePopup();
    }
  }

  closePopup(e, actionName) {
    const parentNode = e.target.closest(".popup__content");
    if (parentNode === null || e.target.dataset.action === actionName) {
      this.togglePopup();
    }
  }

  sendOrder(e) {
    if (e.target.dataset.action === "send") {
      if (
        !(
          this.view.addressNamePopup.value.trim() &&
          this.view.addressStreetPopup.value.trim() &&
          this.view.addressCityPopup.value.trim() &&
          this.view.addressPhonePopup.value.trim()
        )
      ) {
        this.view.addressPopupData.classList.toggle("checkout__popup-open");
        this.view.bodyNode.classList.toggle("body__fixed");
        return;
      }
      if (this.model.payMethod === "nothing") {
        this.view.paymentPopupData.classList.toggle("payment__popup-open");
        this.view.bodyNode.classList.toggle("body__fixed");
        return;
      }

      const newID = Date.now().toString();

      this.model.orders.push({
        order: [
          {
            id: newID,
            name: this.view.addressNamePopup.value.trim(),
            street: this.view.addressStreetPopup.value.trim(),
            city: this.view.addressCityPopup.value.trim(),
            phone: this.view.addressPhonePopup.value.trim(),
            pay: this.model.payMethod,
            basket: this.model.basket,
          },
        ],
      });

      localStorage.setItem("orderId", newID);

      this.model.setOrderLocalStorage();

      this.model.deleteStorageData();

      setTimeout(function () {
        window.location.href = "order.html";
      }, 0.5 * 1000);
    }
  }

  openOrder(e) {
    if (e.target.dataset.action === "openOrder") {
      const parentNode = e.target.closest(".orders__list-item");
      const orderLink = parentNode.querySelector(".orders__list-number");
      const id = orderLink.id;
      localStorage.setItem("orderId", id);
    } else {
      return;
    }
  }

  showOrders() {
    this.view.ordersListNode.classList.add("show");
  }
}
