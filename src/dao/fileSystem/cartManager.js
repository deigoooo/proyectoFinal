import fs from "fs";

import ProductManager from "./productManager.js";

const pm = new ProductManager("./src/dao/fileSystem/products.txt");

class CartManager {
  #_path;
  constructor(path) {
    this.#_path = path;
    this.#init();
  }
  async #init() {
    if (!fs.existsSync(this.#_path)) {
      //si no existe el archivo
      await fs.promises.writeFile(this.#_path, "[]"); //lo creo con un array vacio
    }
  }
  async getCart() {
    if (!fs.existsSync(this.#_path)) return "[ERROR] Base de datos no existe";
    let BD = await fs.readFileSync(this.#_path, "utf8");
    let carts = JSON.parse(BD);
    return carts;
  }
  async getCartById(id) {
    const carts = await this.getCart();
    const cartId = carts.find((cart) => cart.id === id);
    if (!cartId) return "[ERROR] El Id no existe";
    return cartId;
  }
  async getProductsFromCartById(id) {
    const carts = await this.getCart();
    const cartId = carts.find((cart) => cart.id === id);
    if (!cartId) return "[ERROR] El Id no existe";
    return cartId.products;
  }
  async addCart() {
    if (!fs.existsSync(this.#_path))
      return "[ERROR] La Base de datos no existe";
    const carts = await this.getCart();
    const newCart = { id: this.#getNextID(carts), products: [] };
    carts.push(newCart);
    await fs.promises.writeFile(this.#_path, JSON.stringify(carts, null, "\t"));
    return newCart;
  }
  async addProductToCart(cid, pid) {
    const productId = await pm.getProductById(pid);
    if (typeof productId === "string") return `[ERROR] el ID: ${pid} no existe`;
    const cart = await this.getCartById(cid);
    if (typeof cart === "string") return `[ERROR] El carrito no existe`;
    const productIndex = cart.products.findIndex(
      (product) => product.pid === pid
    );
    if (productIndex > -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ pid: pid, quantity: 1 });
    }
    let carts = await this.getCart();
    carts = carts.map((item) => {
      if (item.id === cid) {
        return cart;
      } else {
        return item;
      }
    });
    await fs.promises.writeFile(this.#_path, JSON.stringify(carts, null, 2));
    return cart;
  }
  async deleteCart(id) {
    if (!fs.existsSync(this.#_path)) return "[ERROR] Base de datos no existe";
    let isFound = false;
    let carts = await this.getCart();
    let newCarts = carts.filter((cart) => cart.id !== id);
    if (carts.length !== newCarts.length) isFound = true;
    if (!isFound) return "[ERROR} El id no existe";
    await fs.promises.writeFile(this.#_path, JSON.stringify(newCarts, null, 2));
    return newCarts;
  }
  async updateCart(id, updateCart) {
    if (!fs.existsSync(this.#_path)) return "[ERROR] Base de datos no existe";
    let isFound = false;
    let carts = await this.getCart();
    let newCart = carts.map((cart) => {
      if (cart.id === id) {
        isFound = true;
        return { ...cart, ...updateCart };
      } else return cart;
    });
    console.log(newCart);
    if (!isFound) return "[ERROR] El Id no existe";
    await fs.promises.writeFile(this.#_path, JSON.stringify(newCart, null, 2));
    return carts.find((cart) => cart.id === id);
  }

  #getNextID(products) {
    return products.length === 0 ? 1 : products[products.length - 1].id + 1;
  }
}

export default CartManager;
