import chai from "chai";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

const MONGO_URI="mongodb://0.0.0.0:27017";
const DB_NAME="ecommerce";

describe("Testing Proyecto Final Backend", () => {
  after(async function () {
    setTimeout(async function () {
      await mongoose.connect(MONGO_URI, {
        dbName: `${DB_NAME}`,
        useUnifiedTopology: true,
      });
      await mongoose.connection.collection('carts').drop();
      await mongoose.connection.collection('users').drop();
      await mongoose.connection.collection('products').drop();
      await mongoose.connection.collection('sessions').drop();
      await mongoose.connection.createCollection('carts');
      await mongoose.connection.createCollection('users');
      await mongoose.connection.createCollection('products');
      await mongoose.connection.createCollection('sessions');
      await mongoose.connection.close()
      console.log(`Base de datos limpia`);
    });
  });

  describe("Registro, Login and Current", () => {
    const mockUser = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: "secret",
    };

    it("debe registrar un usuario", async () => {
      const response = await requester.post("/session/register").send(mockUser);
      const { status, headers } = response;

      expect(status).to.equal(302);
      expect(headers).to.have.property("set-cookie");
    });

    it("Debe loguear un user y devolver una cookie", async () => {
      const result = await requester.post("/session/login").send({
        email: mockUser.email,
        password: mockUser.password,
      });

      const cookieResult = result.headers["set-cookie"][0];
      expect(cookieResult).to.be.ok;
    });

    it("Debe loguear y desloguear un usuario para luego eliminar la cookie", async () => {
      const loginResponse = await requester.post("/session/login").send({
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
      });
      const cookieBeforeLogout = loginResponse.headers["set-cookie"][0];

      const deleteResult = await requester
        .get("/session/logout")
        .set("Cookie", cookieBeforeLogout);
      expect(deleteResult.status).to.equal(302);
      expect(deleteResult.headers).to.not.have.property("set-cookie");
    });
  });
  describe("Test /api/products", () => {
    it("El endpoint POST /api/products debe registrar un producto", async () => {
      const adminUser = {
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
      };
      const productMock = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 10, max: 1000, precision: 0.01 }),
        thumbnail: [faker.image.url],
        stock: faker.number.int({ min: 0, max: 1000 }),
        code: faker.string.uuid(),
        category: faker.commerce.department(),
        owner: adminUser.email,
      };
      const loginResponse = await requester.post("/session/login").send({
        email: adminUser.email,
        password: adminUser.password,
      });
      const response = await requester
        .post("/api/products")
        .set("Cookie", loginResponse.headers["set-cookie"])
        .send(productMock);
      expect(response.status).to.equal(201);
      expect(response.body.payload).to.have.property("_id");
    });

    it("El endpoint delete /api/products debe eliminar un producto", async () => {
      const adminUser = {
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
      };
      const productMock = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 10, max: 1000, precision: 0.01 }),
        thumbnail: [faker.image.url],
        stock: faker.number.int({ min: 0, max: 1000 }),
        code: faker.string.uuid(),
        category: faker.commerce.department(),
        owner: adminUser.email,
      };
      const loginResponse = await requester.post("/session/login").send({
        email: adminUser.email,
        password: adminUser.password,
      });
      const responsePost = await requester
        .post("/api/products")
        .set("Cookie", loginResponse.headers["set-cookie"])
        .send(productMock);
      const id = responsePost.body.payload._id;
      const respondeDelete = await requester
        .delete(`/api/products/${id}`)
        .set("Cookie", loginResponse.headers["set-cookie"]);
      expect(respondeDelete.status).to.equal(200);
      expect(respondeDelete.body.payload).to.have.property("_id");
    });

    it("El endpoint POST /api/products no debe registrar un producto con datos vacíos", async () => {
      const productMock = {};

      const response = await requester.post("/api/products").send(productMock);
      const { status, ok, _body } = response;
      expect(ok).to.be.eq(false);
    });
  });
  describe("Test /api/carts", () => {
    it("El endpoint POST /api/carts debe crear un carrito", async () => {
      const response = await requester.post("/api/carts");
      expect(response.status).to.equal(200);
      expect(response.body.payload).to.have.property("_id");
    });
    it("El endpoint POST /api/carts intenta agregar un producto fake a un carrito", async () => {
      const responsePostCart = await requester.post("/api/carts");
      const idCart = responsePostCart.body.payload._id;
      const response = await requester.post(
        `/api/carts/${idCart}/product/65b197412f9de4ad4f126564`
      );
      expect(response.status).to.equal(403);
      expect(response.body.error).to.be.a("string");
    });
    it("El endpoint DELETE /api/carts crea un carrito y lo elimina", async () => {
      const responsePostCart = await requester.post("/api/carts");
      const idCart = responsePostCart.body.payload._id;
      const response = await requester.delete(`/api/carts/${idCart}`);
      expect(response.status).to.equal(200);
      expect(response.body.payload).to.have.property("_id");
    });
  });
});
