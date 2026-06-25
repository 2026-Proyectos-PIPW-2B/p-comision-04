import {actualizarInterfaz, configurarFormularioLogin, esAdministrador} from "./modulos/gestorAuth.js";

window.onload = function () {
    actualizarInterfaz();
    configurarFormularioLogin();

    if (!esAdministrador()) {
        location.href = "index.html";
        return;
    }
};
