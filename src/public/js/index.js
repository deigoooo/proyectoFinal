const socketClient = io();
let allProducts = document.getElementById("allProducts");
let idUsuario = document.getElementById("idUsuario");
let addProduct = document.getElementById("addProduct");
let getProducts = document.getElementById("getProducts");

addProduct.addEventListener("submit", (element) => {
  const newProduct = {
    title: addProduct[0].value,
    description: addProduct[1].value,
    price: addProduct[2].value,
    thumbnail: addProduct[3].value,
    stock: addProduct[4].value,
    code: addProduct[5].value,
    category: addProduct[6].value,
  };
  socketClient.emit("add", newProduct);
  addProduct.reset();
});

/* socketClient.on("userId", (data) => {
  idUsuario.innerHTML = `Usuario: ${data}`;
}); */

socketClient.on("products", async (data) => {
  console.log(data);
  for (let index = 0; index < data.length; index++) {
    let row = ` <tr>
                  <td>${data[index].id}</td>
                  <td>${data[index].title}</td>
                  <td>${data[index].description}</td>
                  <td>${data[index].price}</td>
                  <td>${data[index].thumbnail}</td>
                  <td>${data[index].stock}</td>
                  <td>${data[index].code}</td>
                  <td>${data[index].status}</td>
                  <td>${data[index].category}</td>
                  <td><button
                    onclick="deleteProduct(${data[index].id})"
                    class="btn btn-danger"
                    >Eliminar</button></td>
                </tr>`;
    getProducts.innerHTML += row;
  }
});

const deleteProduct = (id) => {
  socketClient.emit("delete", id);
  location.reload();
};
