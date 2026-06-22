import {inicializarProductos, listarProductos} from "./modulos/gestorProductos.js";
import {actualizarInterfaz, configurarFormularioLogin, esAdministrador} from "./modulos/gestorAuth.js";
import {inicializarCarrito, agregarAlCarrito} from "./modulos/gestorCarrito.js";

window.onload = function () {
    inicializarProductos();
    actualizarInterfaz();
    configurarFormularioLogin();
    window.agregarAlCarrito = agregarAlCarrito;
    window.refrescarTablaProductos = mostrarProductos;
    mostrarProductos();
};

function mostrarProductos() {
    const productos = listarProductos();
    const esAdmin = esAdministrador();
    renderizarTablaProductos(productos, esAdmin);
}

function renderizarTablaProductos(productos, esAdmin) {
    const contenedor = document.getElementById("contenedorProductos");
    if (contenedor === null) {
        return;
    }

    contenedor.innerHTML = "";

    const btnAdmin = `
        <button
            class="btn btn-warning btn-sm"
            data-admin-only="true"
            type="button"
        >
            <i class="bi bi-pencil-fill"></i>
            Editar producto
        </button>`;

    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];

        contenedor.innerHTML += `
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card h-100 bg-dark text-light border-success">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <div class="mt-auto d-grid gap-2">
                            <button class="btn btn-outline-success" type="button">
                                Ir al producto
                            </button>
                            <button class="btn btn-success" type="button" onclick="agregarAlCarrito(${producto.id})">
                                Agregar al carrito
                            </button>
                            ${esAdmin ? btnAdmin : ""}
                        </div>
                    </div>
                </div>
            </div>`;
    }
}
