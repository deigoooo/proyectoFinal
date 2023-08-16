import fs from "fs";

class ProductManager {
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
  async getProduct() {
    if (!fs.existsSync(this.#_path)) return "[ERROR] Base de datos no existe";
    let BD = await fs.readFileSync(this.#_path, "utf8");
    let products = JSON.parse(BD);
    return products;
  }
  async getProductById(id) {
    const products = await this.getProduct();
    const productId = products.find((element) => element.id === id);
    if (!productId) return "[ERROR] El Id no existe";
    return productId;
  }
  async addProduct(product) {
    product.status = true;
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.code ||
      !product.stock ||
      !product.status ||
      !product.category
    ) {
      return "[ERROR] El producto tiene algun campo faltante";
    }
    if (!fs.existsSync(this.#_path))
      return "[ERROR] La Base de datos no existe";
    const products = await this.getProduct();
    const code = products.find((element) => element.code === product.code);
    if (code) {
      console.log(`[ERROR] El codigo ${code.code} ya existe`);
      return "[ERROR] El Codigo ya existe";
    }

    console.log(product);
    const newProduct = { id: this.#getNextID(products), ...product };
    products.push(newProduct);
    await fs.promises.writeFile(
      this.#_path,
      JSON.stringify(products, null, "\t")
    );
    return newProduct;
  }
  async deleteProduct(id) {
    if (!fs.existsSync(this.#_path)) return "[ERROR] Base de datos no existe";
    let isFound = false;
    let products = await this.getProduct();
    let newProducts = products.filter((element) => element.id !== id);
    if (products.length !== newProducts.length) isFound = true;
    if (!isFound) return "[ERROR} El id no existe";
    await fs.promises.writeFile(
      this.#_path,
      JSON.stringify(newProducts, null, 2)
    );
    return newProducts;
  }
  async updateProduct(id, updateProduct) {
    if (!fs.existsSync(this.#_path)) return "[ERROR] Base de datos no existe";
    let isFound = false;
    let products = await this.getProduct();
    let newProducts = products.map((element) => {
      if (element.id === id) {
        isFound = true;
        return { ...element, ...updateProduct };
      } else return element;
    });
    if (!isFound) return "[ERROR] El Id no existe";
    await fs.promises.writeFile(
      this.#_path,
      JSON.stringify(newProducts, null, 2)
    );
    return newProducts.find((element) => element.id === id);
  }

  #getNextID(products) {
    return products.length === 0 ? 1 : products[products.length - 1].id + 1;
  }
}

export default ProductManager;
