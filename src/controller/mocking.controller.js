import { faker } from "@faker-js/faker";
import { productService } from "../services/Factory.js";

export const getMockingController = async (req, res) => {
  try {
    const newProduct = [];
    for (let index = 0; index < 100; index++) {
      newProduct.push({
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 10, max: 1000, precision: 0.01 }),
        thumbnail: [faker.image.url],
        stock: faker.number.int({ min: 0, max: 1000 }),
        code: faker.string.uuid(),
        category: faker.commerce.department(),
      });
    }
    const result = await productService.create(newProduct);
    console.log(result);
    res
      .status(200)
      .json({ status: "success", message: `The products was created` });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
