import { guardarDato, obtenerDato } from "./gestorBD.js";
import { obtenerProductoPorId } from "./gestorProductos.js";

export {inicializarCarrito,obtenerCarrito,agregarAlCarrito,eliminarDelCarrito,actualizarCantidadDelCarrito,vaciarCarrito,calcularTotal};

const CLAVE_CARRITO = "carrito";

function inicializarCarrito() {
    const datos = obtenerDato(CLAVE_CARRITO);
    if (datos === null) {
        guardarDato(CLAVE_CARRITO, []);
    }
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
}

function vaciarCarrito() {
    guardarCarrito([]);
}

function calcularTotal() {
    const carrito = obtenerCarrito();
    let total = 0;

    for (let i = 0; i < carrito.length; i++) {
        total = total + carrito[i].precio * carrito[i].cantidad;
    }

    return total;
}