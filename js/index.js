import {inicializarProductos, listarProductos} from "./modulos/gestorProductos.js";
import {actualizarInterfaz, configurarFormularioLogin, esAdministrador} from "./modulos/gestorAuth.js";
import {agregarAlCarrito} from "./modulos/gestorCarrito.js";

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
                        <h5 class="card-title mb-3 text-center">${producto.nombre}</h5>
                        <div class="mt-auto d-grid gap-2">
                            <button class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modal${producto.id}" type="button">
                                Ir al producto
                            </button>
                            <button class="btn btn-success" type="button" onclick="agregarAlCarrito(${producto.id})">
                                Agregar al carrito
                            </button>
                            ${esAdmin ? btnAdmin : ""}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal fade" id="modal${producto.id}" tabindex="-1" aria-labelledby="modalLabel${producto.id}" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content border-success">
                        <div class="modal-header border-success bg-success">
                            <h5 class="modal-title fw-bold" id="modalLabel${producto.id}">${producto.nombre}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-4 text-center">
                                <img src="${producto.imagen}" class="img-index-verMas rounded shadow" alt="${producto.nombre}">
                            </div>
                            <div class="mb-3">
                                <p class="text-secondary small mb-2">Descripción:</p>
                                <p class="fw-normal lh-lg">${producto.descripcion}</p>
                            </div>
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <span class="fw-bold fs-5">Precio: $${producto.precio.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="modal-footer border-success">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-success" onclick="agregarAlCarrito(${producto.id})">
                                <i class="bi bi-cart-plus me-2"></i>Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            
            
            `;
    }
}
