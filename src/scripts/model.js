// подключаем Firebase, FireStore
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOXDys5ZF3VVDNNg4il1MgFY5tTxpKgE0",
  authDomain: "ecommerce-app-869b1.firebaseapp.com",
  projectId: "ecommerce-app-869b1",
  storageBucket: "ecommerce-app-869b1.appspot.com",
  messagingSenderId: "159311137942",
  appId: "1:159311137942:web:ff7a7a73e7426c42b786b7",
};

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

// создаём оригинал класса Model
export class Model {
  constructor() {
    // данные. которые получаем из локалсторадж
    this.orders = this.getOrderLocalStorage();
    this.basket = this.getLocalStorage();
    this.shopList = [];
    this.payMethod = "nothing";
  }

  // МЕТОДЫ МОДЕЛИ

  // функция для обновления массива(просто так его не обновить,
  // потому что данные всегда берутся из оригинала,
  // когда создается экземпляра значит он будет пустой всегда)
  update(list) {
    this.shopList = list;
  }

  // функция для загрузки данных из Firestore(из документации)
  async getProducts() {
    const querySnapshot = await getDocs(collection(db, "products"));
    const shopList = [];
    querySnapshot.forEach((doc) => {
      shopList.push({
        id: doc.id,
        name: doc.data().name,
        desc: doc.data().desc,
        img: doc.data().img,
        price: doc.data().price,
      });
    });
    // здесь мы запушили данные в массив, но помним, что он не изменился в оригинальной модели
    return shopList;
  }

  // работа с локал сторадж ("ключ", массив)
  setLocalStorage() {
    return localStorage.setItem("data", JSON.stringify(this.basket));
  }

  getLocalStorage() {
    const data = localStorage.getItem("data");
    return JSON.parse(data) || [];
  }

  deleteStorageData() {
    return localStorage.removeItem("data");
  }

  setOrderLocalStorage() {
    return localStorage.setItem("orders", JSON.stringify(this.orders));
  }

  getOrderLocalStorage() {
    const orders = localStorage.getItem("orders");
    return JSON.parse(orders) || [];
  }
}
