import {actualizarInterfaz, configurarFormularioLogin, esAdministrador} from "./modulos/gestorAuth.js";

window.onload = function () { 
                if (!esAdministrador) {

                    window.location.replace("index.html");
                }

                actualizarInterfaz();
                configurarFormularioLogin();
            }