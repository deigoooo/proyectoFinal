const socketClient = io();
let table = document.getElementById("realProduct");
let getProduct = document.getElementById("getProducts");

document.getElementById("createBtn").addEventListener("click", async () => {
  const body = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
    stock: document.getElementById("stock").value,
    code: document.getElementById("code").value,
    category: document.getElementById("category").value,
  };
  //este fetch  es de metod post para enviarle el nuevo producto en el body
  await fetch("/api/products", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
    })
    //este fetch es un Get para tener la lista nueva completa
    .then(() => fetch("/api/products"))
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
      socketClient.emit("productList", result.payload);
      alert(`El producto fue agregado con exito \n Vista actualizada`);
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("price").value = "";
      document.getElementById("thumbnail").value = "";
      document.getElementById("stock").value = "";
      document.getElementById("code").value = "";
      document.getElementById("category").value = "";
    })
    .catch((error) => alert(`Ocurrio un error:\n${error}`));
});

const deleteProduct = async (id) => {
  await fetch(`/api/products/${id}`, {
    method: "delete",
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
      socketClient.emit("productList", result.payload);
      alert(`El product fue eliminado \nVista actualizada`);
    })
    .catch((error) => alert(`Ocurrio un error:\n${error}`));
};
async function deleteProductFromCart(pid) {
  let cartId = document.getElementById("cid");
  let cid = cartId.getAttribute("data-cid");
  console.log(`entro aca ${cid} y ${pid}`);
  await fetch(`/api/carts/${cid}/product/${pid}`, { method: "delete" })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
      alert(`El product fue eliminado
  \nVista actualizada`);
      location.reload();
    })
    .catch((error) =>
      alert(`Ocurrio
  un error:\n${error}`)
    );
}

socketClient.on("updateProduct", (data) => {
  table.innerHTML = `<tr>
      <td>ID</td>
      <td>Nombre</td>
      <td>Descripcion</td>
      <td>Precio</td>
      <td>Stock</td>
      <td>Codigo</td>
      <td>Categoria</td>
      <td></td>
    </tr>`;
  for (product of data) {
    console.log(product);
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${product._id}</td>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
      <td>${product.code}</td>
      <td>${product.category}</td>
      <td><button class="btn btn-danger" onclick="deleteProduct(${product._id})">Eliminar</button></td>`;
    table.getElementsByTagName("tbody")[0].appendChild(tr);
  }
});
