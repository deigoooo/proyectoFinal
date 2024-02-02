const socketClient = io();
let table = document.getElementById("usersTable");
let getUsers = document.getElementById("usersTable");

async function deleteUser(uid) {
  const response = await fetch(`/api/users/${uid}`, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  });
  if (response.status===200) {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Usuario eliminado correctamente",
    });
  }else {
    const errorData = await response.json();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Hubo un error: ${errorData.error}`,
    });
  }
  socketClient.emit("updateUser", response);
}

async function changeRolUser(uid){
  const response = await fetch(`/api/users/${uid}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
  });
  if (response.status===200) {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Rol modificado correctamente",
    });
  }else {
    const errorData = await response.json();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Hubo un error: ${errorData.error}`,
    });
  }
  socketClient.emit("updateUser", response);
}

socketClient.on("updateUser", (data) => {
  table.innerHTML = `
        <tr>
          <th class="col-1">ID</th>
          <th class="col-2">Nombre</th>
          <th class="col-2">Apellido</th>
          <th class="col-2">Email</th>
          <th class="col-1">Rol</th>
          <th class="col-1"></th>
          <th class="col-1"></th>
        </tr>`;
  for (user of data) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${user._id}</td>
        <td>${user.first_name}</td>
        <td>${user.last_name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td><button onclick="deleteUser('${user._id}')" class="btn btn-danger">Eliminar</button></td>
        <td><button onclick="changeRolUser('${user._id}')" class="btn btn-Primary" style="width:115px;">Cambiar Rol</button></td>`;
    table.getElementsByTagName("tbody")[0].appendChild(tr);
  }
});
