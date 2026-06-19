export function cachito(){
  return esAdministrador()
}

import {mostrarProductosInicio} from "../productos.js";

const CLAVE_SESION = "sebamax_session";

const LISTA_USUARIOS = [
  { nombreUsuario: "usuario", clave: "usuario", rol: "user" },
  { nombreUsuario: "admin", clave: "admin", rol: "admin" }
];

function obtenerSesion() {
  const datosGuardados = localStorage.getItem(CLAVE_SESION);

  if (datosGuardados === null) {
    return null;
  }

  const sesion = JSON.parse(datosGuardados);
  return sesion;
}

function guardarSesion(usuario) {
  const datosSesion = {
    nombreUsuario: usuario.nombreUsuario,
    rol: usuario.rol
  };

  localStorage.setItem(CLAVE_SESION, JSON.stringify(datosSesion));
}

function borrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

function esAdministrador() {
  const sesion = obtenerSesion();

  if (sesion === null) {
    return false;
  }

  if (sesion.rol === "admin") {
   
    return true;
  }

  return false;
}

function iniciarSesion(nombreUsuario, clave) {
  let usuarioEncontrado = null;

  for (let i = 0; i < LISTA_USUARIOS.length; i++) {
    const usuarioActual = LISTA_USUARIOS[i];

    if (usuarioActual.nombreUsuario === nombreUsuario && usuarioActual.clave === clave) {
      usuarioEncontrado = usuarioActual;
      break;
    }
  }

  if (usuarioEncontrado === null) {
    return false;
  }

  guardarSesion(usuarioEncontrado);
  return usuarioEncontrado;
}

function cerrarSesion() {
  borrarSesion();
  location.reload();
}

function actualizarInterfaz() {
  const sesion = obtenerSesion();

  const contenedoresAuth = document.querySelectorAll("[data-auth-container]");

  for (let i = 0; i < contenedoresAuth.length; i++) {
    const contenedor = contenedoresAuth[i];

    if (sesion === null) {
      contenedor.innerHTML =
        '<button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#loginModal">' +
        "Ingresar</button>";

    } else {
      let colorInsignia = "info text-dark";

      if (sesion.rol === "admin") {
        colorInsignia = "warning text-dark";
      }

      contenedor.innerHTML =
        '<span class="badge bg-' + colorInsignia + '">' +
        sesion.rol.toUpperCase() + ": " + sesion.nombreUsuario +
        "</span>" +
        '<button id="logoutBtn" class="btn btn-danger btn-sm ms-2">Salir</button>';

      const botonSalir = document.getElementById("logoutBtn");

      if (botonSalir !== null) {
        botonSalir.addEventListener("click", cerrarSesion);
      }
    }

    mostrarProductosInicio  ()
  }

  const elementosSoloAdmin = document.querySelectorAll("[data-admin-only]");
  const usuarioEsAdmin = esAdministrador();

  for (let i = 0; i < elementosSoloAdmin.length; i++) {
    if (usuarioEsAdmin === true) {
      elementosSoloAdmin[i].classList.remove("d-none");
    } else {
      elementosSoloAdmin[i].classList.add("d-none");
    }
  }

  const elementosSoloConSesion = document.querySelectorAll("[data-auth-only]");

  for (let i = 0; i < elementosSoloConSesion.length; i++) {
    if (sesion === null) {
      elementosSoloConSesion[i].classList.add("d-none");
    } else {
      elementosSoloConSesion[i].classList.remove("d-none");
    }
  }

  const elementosSinSesion =
    document.querySelectorAll("[data-no-auth]");

  for (let i = 0; i < elementosSinSesion.length; i++) {

    if (sesion === null) {
        elementosSinSesion[i].classList.remove("d-none");
    } else {
        elementosSinSesion[i].classList.add("d-none");
    }

  }
}

function configurarFormularioLogin() {
  const formulario = document.getElementById("loginForm");

  if (formulario === null) {
    return;
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const campoUsuario = document.getElementById("usuario");
    const campoClave = document.getElementById("password");
    const contenedorError = document.getElementById("loginError");

    const nombreUsuario = campoUsuario.value.trim();
    const clave = campoClave.value;

    const resultado = iniciarSesion(nombreUsuario, clave);

    if (resultado === false) {
      contenedorError.classList.remove("d-none");
      return;
    }

    const elementoModal = document.getElementById("loginModal");
    const instanciaModal = bootstrap.Modal.getInstance(elementoModal);

    if (instanciaModal !== null) {
      instanciaModal.hide();
    }

    actualizarInterfaz();

    let tipoDeMensaje = "success";

    if (resultado.rol === "admin") {
      tipoDeMensaje = "warning";
    }

    mostrarMensaje("Bienvenido " + resultado.nombreUsuario, tipoDeMensaje);
  });

  const campoUsuario = document.getElementById("usuario");
  const campoClave = document.getElementById("password");

  if (campoUsuario !== null) {
    campoUsuario.addEventListener("input", ocultarError);
  }

  if (campoClave !== null) {
    campoClave.addEventListener("input", ocultarError);
  }
}

function ocultarError() {
  const contenedorError = document.getElementById("loginError");

  if (contenedorError !== null) {
    contenedorError.classList.add("d-none");
  }
}

function mostrarMensaje(mensaje, tipo) {
  if (tipo === undefined) {
    tipo = "success";
  }

  let contenedorMensajes = document.getElementById("toastContainer");

  if (contenedorMensajes === null) {
    contenedorMensajes = document.createElement("div");
    contenedorMensajes.id = "toastContainer";
    contenedorMensajes.className = "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(contenedorMensajes);
  }

  let colorMensaje = "text-bg-success";

  if (tipo === "warning") {
    colorMensaje = "text-bg-warning";
  } else if (tipo === "danger") {
    colorMensaje = "text-bg-danger";
  }

  const mensajeToast = document.createElement("div");
  mensajeToast.className = "toast " + colorMensaje + " border-0";
  mensajeToast.innerHTML =
    '<div class="d-flex">' +
    '<div class="toast-body">' + mensaje + "</div>" +
    '<button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>' +
    "</div>";

  contenedorMensajes.appendChild(mensajeToast);

  const instanciaToast = new bootstrap.Toast(mensajeToast, { delay: 3000 });
  instanciaToast.show();

  mensajeToast.addEventListener("hidden.bs.toast", function () {
    mensajeToast.remove();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  //actualizarInterfaz();
  //configurarFormularioLogin();
});