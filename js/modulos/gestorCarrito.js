import { guardarDato, obtenerDato } from "./gestorBD.js";
import { obtenerProductoPorId } from "./gestorProductos.js";
import {mostrarMensaje, obtenerSesion} from "./gestorAuth.js";

export {inicializarCarrito,obtenerCarrito,agregarAlCarrito,eliminarDelCarrito,actualizarCantidadDelCarrito,vaciarCarrito,calcularTotal, finalizarCompra, mostrarModalFinalizarCompra};

const CLAVE_CARRITO = "carrito";

function inicializarCarrito() {
    const datos = obtenerDato(CLAVE_CARRITO);
    if (datos === null) {
        guardarDato(CLAVE_CARRITO, []);
    }
    actualizarContadorCarrito();
}

function obtenerCarrito() {
    const datos = obtenerDato(CLAVE_CARRITO);
    if (datos === null) {
        return [];
    }
    return datos;
}

function guardarCarrito(carrito) {
    guardarDato(CLAVE_CARRITO, carrito);
}

function actualizarContadorCarrito() {
    const elementos = document.querySelectorAll('.carrito-contador');
    if (elementos.length === 0) {
        return;
    }

    const carrito = obtenerCarrito();
    let total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total += Number(carrito[i].cantidad);
    }

    elementos.forEach(el => {
        if (total > 0) {
            el.textContent = total;
            el.classList.remove('d-none');
        } else {
            el.classList.add('d-none');
        }
    });
}

function agregarAlCarrito(idProducto) {
    const producto = obtenerProductoPorId(idProducto);
    if (producto === null) {
        return;
    }

    const carrito = obtenerCarrito();
    let productoEnCarrito = null;

    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === idProducto) {
            productoEnCarrito = carrito[i];
            break;
        }
    }

    if (productoEnCarrito !== null) {
        productoEnCarrito.cantidad = productoEnCarrito.cantidad + 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    mostrarMensaje("El producto se agregó al carrito", "success");
    actualizarContadorCarrito();
}

function eliminarDelCarrito(idProducto) {
    const carrito = obtenerCarrito();
    const nuevoCarrito = [];

    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id !== idProducto) {
            nuevoCarrito.push(carrito[i]);
        }
    }

    guardarCarrito(nuevoCarrito);
    actualizarContadorCarrito();
}

function actualizarCantidadDelCarrito(idProducto, numeroAgregaroRestar) {
    const carrito = obtenerCarrito();

    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === idProducto) {
            carrito[i].cantidad = carrito[i].cantidad + numeroAgregaroRestar;
            if (carrito[i].cantidad < 1) {
                carrito[i].cantidad = 1;
            }
            break;
        }
    }

    guardarCarrito(carrito);
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    guardarCarrito([]);
    actualizarContadorCarrito();
}

function calcularTotal() {
    const carrito = obtenerCarrito();
    let total = 0;

    for (let i = 0; i < carrito.length; i++) {
        total = total + carrito[i].precio * carrito[i].cantidad;
    }

    return total;
}

function finalizarCompra() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío", "warning");
        return false;
    }

    const sesion = obtenerSesion();
    if (!sesion || sesion.rol !== "user") {
        mostrarMensaje("Solo los usuarios pueden finalizar una compra", "warning");
        return false;
    }

    vaciarCarrito();
    actualizarContadorCarrito();
    mostrarMensaje("Compra finalizada correctamente", "success");
    return true;
}

function mostrarModalFinalizarCompra() {
    let container = document.getElementById("modalFinalizarCompra");

    container = document.createElement("div");
    container.id = "modalFinalizarCompra";
    document.body.appendChild(container);

    container.innerHTML = `
    <div class="modal fade" id="pedidoRealizadoModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-light border-success">

                <div class="modal-header border-success">
                    <h5 class="modal-title text-success">
                        <i class="bi bi-check-circle-fill me-2"></i>
                        ¡Compra realizada!
                    </h5>
                    <button type="button"
                            class="btn-close btn-close-white"
                            data-bs-dismiss="modal">
                    </button>
                </div>

                <div class="modal-body text-center">

                    <i class="bi bi-box-seam display-1 text-success"></i>

                    <h4 class="mt-3">
                        Tu pedido fue confirmado correctamente.
                    </h4>

                    <p class="text-secondary mb-4">
                        Estamos preparando tu compra. En breve será despachada.
                    </p>

                    <div class="card bg-secondary-subtle text-dark mb-3">
                        <div class="card-body">
                            <h6 class="mb-2">Número de seguimiento</h6>
                            <h3 id="numeroTicket" class="text-success fw-bold"></h3>
                        </div>
                    </div>

                    <div class="alert alert-success mb-0">
                        <i class="bi bi-truck me-2"></i>
                        Tu pedido está en camino.
                    </div>

                </div>

                <div class="modal-footer border-success">
                    <button class="btn btn-success"
                            data-bs-dismiss="modal">
                        Aceptar
                    </button>
                </div>

            </div>
        </div>
    </div>`;

    const modalElement = container.querySelector('.modal');
    const modal = new bootstrap.Modal(modalElement);
    const ticketNumber = Math.floor(Math.random() * 900000) + 100000;
    const ticketElement = container.querySelector('#numeroTicket');
    ticketElement.textContent = ticketNumber;

    modal.show();
}