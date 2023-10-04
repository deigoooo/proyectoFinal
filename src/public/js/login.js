document.getElementById("login").addEventListener("click", () => {
  const body = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  fetch("/api/users/user", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
      //cambiar este endpoint para el login
      window.location.href = `/products`;
    })
    .catch((error) => alert(`Ocurrio un error:\n${error}`));
});

document.getElementById("registerOn").addEventListener("click", () => {
  window.location.href = `/login/register`;
});
/* document.getElementById("register").addEventListener("click", () => {
  console.log("entro aca");
  const body = {
    firstname: document.getElementById("firstname").value,
    lastname: document.getElementById("lastname").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  fetch("/api/users/", {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
      window.location.href = `/products`;
    })
    .catch((error) =>
      alert(`Ocurrio un
  error:\n${error}`)
    );
}); */
