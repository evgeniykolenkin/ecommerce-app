export class View {
  constructor() {
    // общие элементы
    this.bodyNode = document.getElementById("body");
    this.cartIcon = document.getElementById("cart_amount");
    this.shop = document.getElementById("shop");
    this.label = document.getElementById("label");
    this.shopingCart = document.getElementById("shoping__cart");
    this.popupCardNode = document.getElementById("popup");
    this.dropdown = document.getElementById("dropdown");
    this.orders = document.getElementById("orders");

    // кнопки
    this.changePaymentBtn = document.getElementById("change__payment");
    this.changeAddressBtn = document.getElementById("change__address");
    this.saveAddressData = document.getElementById("checkout__btn");

    // всё, что касается адреса
    this.addressPopupContent = document.getElementById(
      "checkout__data-content"
    );
    this.addressNameData = document.getElementById("address__name");
    this.addressStreetData = document.getElementById("address__street");
    this.addressCityData = document.getElementById("address__city");
    this.addressPhoneData = document.getElementById("address__phone");
    // ------------попап адреса
    this.addressPopupData = document.getElementById("checkout__popup-data");
    this.addressNamePopup = document.getElementById("popup__name");
    this.addressStreetPopup = document.getElementById("popup__street");
    this.addressCityPopup = document.getElementById("popup__city");
    this.addressPhonePopup = document.getElementById("popup__phone");

    // всё, что касается оплаты
    this.paymentDataContent = document.getElementById("payment__data-content");
    this.paymentLabel = document.getElementById("payment__label");
    this.paymentDataDefault = document.getElementById("payment__data-default");
    this.paymentDataCard = document.getElementById("payment__data-card");
    this.paymentDataCash = document.getElementById("payment__data-cash");
    // ------------попап оплаты
    this.paymentPopupData = document.getElementById("payment__popup-data");
    this.cardInputNode = document.getElementById("card__input");
    this.cashInputNode = document.getElementById("cash__input");

    // всё, что касается проверки корзины
    this.checkCartNode = document.getElementById("order__cart-data");

    // всё, что касается заказов
    this.orderContentNode = document.getElementById("order__content");
    this.orderBasketNode = document.getElementById("order__basket");
    this.ordersNode = document.getElementById("orders");
    this.ordersListNode = document.getElementById("orders__list");
  }

  generateDropdown(products, data) {
    if (products.length !== 0) {
      return (this.dropdown.innerHTML = products
        .map((item) => {
          const { id } = item;
          const search = data.find((shopItem) => shopItem.id === id) || [];
          return `
          <div class="dropdown__item">
              <img src="${search.img}" alt="smth" />
              <div class="dropdown__details">
                <h4 class="dropdown__title">${search.name}</h4>
                <p class="dropdown__price">${search.price} $</p>
              </div>
            </div>
        `;
        })
        .join(""));
    } else {
      this.dropdown.innerHTML = ``;
    }
  }

  generateShop(data, products, isLoading) {
    if (isLoading) {
      return (this.shop.innerHTML = `
        <div>Загрузка...</div>
      `);
    }
    return (this.shop.innerHTML = data
      .map((item) => {
        const { id, name, desc, price, img } = item;
        const search = products.find((item) => item.id === id) || [];
        return `
      <li class="item" id="${id}">
        <img data-action="show" src="${img}" alt="" />
        <div class="details">
          <h3>${name}</h3>
          <h4>${desc.shortDesc}</h4>
          <div class="price_quantity">
            <h2>${price}$</h2>
            <div class="buttons">
              <i data-action="minus" class="bi bi-dash-lg"></i>
              <div class="quantity">${
                search.amount === undefined ? 0 : search.amount
              }</div>
              <i data-action="plus" class="bi bi-plus-lg"></i>
            </div>
          </div>
        </div>
       </li>
  `;
      })
      .join(""));
  }

  generateCartItems(products, data, isloading) {
    if (isloading) {
      return (this.shopingCart.innerHTML = `
      <div>Загрузка...</div>
      `);
    }
    if (products.length !== 0) {
      return (this.shopingCart.innerHTML = products
        .map((item) => {
          const { id, amount } = item;
          const search = data.find((shopItem) => shopItem.id === id) || [];
          return `
          <li class="cart__item" id="${search.id}">
            <img src="${search.img}" alt="smth"/>
            <div class="cart__details">
              <div class="title__price-x">
                <div class="title__price-shortdesc">
                  <h4 class="title__price">
                    <p class="title">${search.name}</p>
                    <p class="price">${search.price}$</p>
                  </h4>
                  <p class="short__title">${search.desc.shortDesc}</p>
                </div>
                <i data-action="cross" class="bi bi-x-lg"></i>
              </div>
              <div class="buttons__price">
                <div class="cart__buttons">
                  <i data-action="minus" class="bi bi-dash-lg"></i>
                  <div class="quantity">${amount}</div>
                  <i data-action="plus" class="bi bi-plus-lg"></i>
                </div>
                <h3 class="total__price">Всего: ${(
                  amount * search.price
                ).toFixed(2)}$</h3>
              </div>
            </div>
          </li>
        `;
        })
        .join(""));
    } else {
      this.shopingCart.innerHTML = ``;
      this.shopingCart.style.display = "none";
      this.label.innerHTML = `
      <h2 class="empty__cart">Корзина пуста</h2>
      <a href="index.html">
        <button class="home__btn">Продолжить покупки</button>
      </a>
      `;
    }
  }

  renderPopupCard(e, data) {
    const parentNode = e.target.closest(".item");
    const id = parentNode.id;
    const search = data.find((item) => item.id === id);
    const popup = (this.popupCardNode.innerHTML = `
    <div class="popup__content" id="popup__content">
      <div class="popup__product">
        <img src=${search.img} alt=""/>
        <div class="popup__product-info">
          <div class="popup__product-name">
            <p class="popup__product-title">${search.name}</p>
            <p class="popup__product-subtitle">${search.desc.shortDesc}</p>
          </div>
          <div class="popup__product-desc">
            <p class="popup__product-price">${search.price} $</p>
            <p class="popup__product-text">
              ${search.desc.fullDesc}
            </p>
          </div>
        </div>
      </div>
      <button id="${search.id}" data-action="add" class="popup__btn-add"><i class="bi bi-cart-plus"></i> Добавить в корзину</button>
      <button data-action="close" class="popup__btn-close" id="popup__btn-close">
        <i data-action="close" class="bi bi-x-lg "></i>
      </button>
    </div>
    `);
    return popup;
  }

  renderCheckoutPage(products, data) {
    return (this.checkCartNode.innerHTML = products
      .map((item) => {
        const { id, amount } = item;
        const search = data.find((shopItem) => shopItem.id === id) || [];
        return `
          <li class="cart__item checkout__cart-item" id="${search.id}">
            <img src="${search.img}" alt="smth"/>
            <div class="cart__details">
              <div class="title__price-x">
                <div class="title__price-shortdesc">
                  <h4 class="title__price">
                    <p class="title">${search.name}</p>
                    <p class="price">${search.price}$</p>
                  </h4>
                  <p class="short__title">${search.desc.shortDesc}</p>
                  <p class="quantity">Количество: ${amount}</p>
                </div>
              </div>
              <div class="buttons__price">
                <h3 class="total__price">Всего: ${(
                  amount * search.price
                ).toFixed(2)}$</h3>
              </div>
            </div>
          </li>
        `;
      })
      .join(""));
  }

  renderOrderData(orders, data) {
    const orderId = localStorage.getItem("orderId");
    localStorage.setItem("orderId", undefined);

    this.orderContentNode.innerHTML = orders
      .map((item) => {
        const { order } = item;
        const searchOrder = order.find((orderItem) => orderItem.id === orderId);
        if (!searchOrder) {
          return "";
        }

        const { id, name, street, city, phone, pay } = searchOrder;

        const paymentCard = pay === "card" ? "payment__data-card" : "hidden";
        const paymentCash = pay === "cash" ? "payment__data-cash" : "hidden";

        return `
          <div class="address order__item" id="${id}">
            <div class="address__content">
              <h2 class="order__item-title">АДРЕС ДОСТАВКИ</h2>
              <div class="address__data">
                <div class="address__name">
                  Имя: ${name}
                </div>
                <div class="address__street">
                  Улица: ${street}
                </div>
                <div class="address__city" id="address__city">Город: ${city}</div>
                <div class="address__phone">
                  Номер телефона: ${phone}
                </div>
                <div class="address__order-done">
                  Заказ оформлен
                </div>
                <div class="address__order-id">
                  Номер заказа: <p class="address__order-done">${id}</p>
                </div>
              </div>
            </div>
  
          </div>
  
          <div class="payment__method order__item">
            <div class="payment__content">
              <h2 class="order__item-title">СПОСОБ ОПЛАТЫ</h2>
              <div
              class="payment__data ${paymentCard}"
              id="payment__data-card"
              >
                <i class="bi bi-credit-card-fill"></i>
                <p>Оплата картой при получении</p>
            </div>
              <div
              class="payment__data ${paymentCash}"
              id="payment__data-cash"
              >
                <i class="bi bi-cash-coin"></i>
                <p>Оплата наличными при получении</p>
              </div>
            </div>
  
          </div>
          `;
      })
      .join("");

    this.checkCartNode.innerHTML = orders
      .map((item) => {
        const { order } = item;
        const searchOrder = order.find((orderItem) => orderItem.id === orderId);

        if (!searchOrder) {
          return "";
        }

        return searchOrder.basket.map((basketItem) => {
          const { id, amount } = basketItem;
          const searchData = data.find((shopItem) => shopItem.id === id) || [];
          return `
                <li class="cart__item checkout__cart-item" id="${
                  searchData.id
                }">
                  <img src="${searchData.img}" alt="smth"/>
                  <div class="cart__details">
                    <div class="title__price-x">
                      <div class="title__price-shortdesc">
                        <h4 class="title__price">
                          <p class="title">${searchData.name}</p>
                          <p class="price">${searchData.price}$</p>
                        </h4>
                        <p class="short__title">${searchData.desc.shortDesc}</p>
                        <p class="quantity">Количество: ${amount}</p>
                      </div>
                    </div>
                    <div class="buttons__price">
                      <h3 class="total__price">Всего: ${(
                        amount * searchData.price
                      ).toFixed(2)}$</h3>
                    </div>
                  </div>
                </li>
              `;
        });
      })
      .join("");
  }

  parseDate(dateNumber, id) {
    const date = new Date(dateNumber);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const fullYear = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `
      Заказ <p class="address__order-done" data-action="openOrder">#${id}</p> от ${day}.${month}.${fullYear} ${hours}:${minutes}:${seconds}
    `;
  }

  renderOrderLink(orders) {
    this.ordersListNode.innerHTML = orders
      .map((item) => {
        const { order } = item;
        return order.map((orderItem) => {
          return `
        <li class="orders__list-item">
          <a href="order.html" class="orders__list-number" data-action="openOrder" id="${
            orderItem.id
          }">${this.parseDate(+orderItem.id, orderItem.id)}</a>
        </li>
        `;
        });
      })
      .join("");
  }
}
