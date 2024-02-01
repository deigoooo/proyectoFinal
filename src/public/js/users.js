const socketClient = io();
let table = document.getElementById("usersTable");
let getUsers = document.getElementById("usersTable");

async function deleteUser(uid) {
  //const response = await
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
    tr.innerHTML = `<td>${product._id}</td>
        <td>${user._id}</td>
        <td>${user.first_name}</td>
        <td>${user.last_name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${user.category}</td>
        <td><button onclick="deleteUser('{{this._id}}')" class="btn btn-danger">Eliminar</button></td>
        <td><button onclick="changeRolUser('{{this._id}}')" class="btn btn-Primary" style="width:115px;">Cambiar Rol</button></td>`;
    table.getElementsByTagName("tbody")[0].appendChild(tr);
  }
});
