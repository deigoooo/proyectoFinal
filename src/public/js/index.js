const socketClient = io();
let table = document.getElementById("realProduct");
let getProduct = document.getElementById("getProducts");
let btnDelete = document.getElementById("btnDelete");

const addProduct = async () => {
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
  const response = await fetch("/api/products", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Producto eliminado correctamente",
    });
  } else {
    const errorData = await response.json();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Hubo un error: ${errorData.error}`,
    });
  }
  socketClient.emit("productList", response);
};

const deleteProduct = async (id) => {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  });
  if (response.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Producto eliminado correctamente",
    });
  } else {
    const errorData = await response.json();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Hubo un error: ${errorData.error}`,
    });
  }
  socketClient.emit("productList", response);
};

async function purchase(cid) {
  const response = await fetch(`/api/carts/${cid}/purchase`);
  Swal.fire({
    title: "Compra Realizada",
    text: "¡Gracias por tu compra!",
    icon: "success",
    confirmButtonText: "Ir a productos",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/products";
    }
  });
}

async function deleteProductFromCart(pid) {
  let cartId = document.getElementById("cid");
  let cid = cartId.getAttribute("data-cid");
  const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  });
  if (response.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Producto eliminado correctamente",
    });
  } else {
    const errorData = await response.json();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Hubo un error: ${errorData.error}`,
    });
  }
  socketClient.emit("productList", response);
}

socketClient.on("productList", (data) => {
  table.innerHTML = `<tr>
      <td>ID</td>
      <td>Nombre</td>
      <td>Descripcion</td>
      <td>Precio</td>
      <td>Stock</td>
      <td>Codigo</td>
      <td>Categoria</td>
      <td></td>
      <td></td>
    </tr>`;
  for (product of data) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${product._id}</td>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
      <td>${product.code}</td>
      <td>${product.category}</td>
      <td><button onclick="deleteProduct('${product._id}')" class="btn btn-danger">Eliminar</button></td>
      <td><button class="btn btn-Primary"><a style="color: white; text-decoration: none"
                href="/products/modify/${product._id}">Modificar</a></button></td>`;
    table.getElementsByTagName("tbody")[0].appendChild(tr);
  }
});
const updateProduct = async (pid) => {
  const body = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
    stock: document.getElementById("stock").value,
    code: document.getElementById("code").value,
    status: document.getElementById("status").value,
    category: document.getElementById("category").value,
  };
  const response = await fetch(`/api/products/${pid}`, {
    method: "put",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  if (response.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Producto actualizado correctamente",
    });
  } else {
    const errorData = await response.json();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Hubo un error: ${errorData.message}`,
    });
  }
};

/* const btnAdmin = document.getElementById("btnAdmin");
const btnR = document.getElementById("role");
const role = btnR.textContent || btnR.innerText;
if (role === "user") {
  btnAdmin.style.display = "none";
}
const addProductToCart = async (pid) => {
  let cartId = document.getElementById("cid");
  let cid = cartId.getAttribute("data-cid");
  const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  Swal.fire(`Producto agregado`);
}; */
