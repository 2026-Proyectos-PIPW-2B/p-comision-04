import {inicializarProductos, listarProductos, obtenerProductoPorId, editarProducto, eliminarProducto} from "./modulos/gestorProductos.js";
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

    const btnAdmin = (id) => `
        <button
            class="btn btn-warning btn-sm"
            data-admin-only="true"
            type="button"
            onclick="abrirEditarProducto(${id})"
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
                                ${esAdmin ? btnAdmin(producto.id) : ""}
                        </div>
                    </div>
                </div>
            </div>`;
    }
}

function abrirEditarProducto(id) {
    const producto = obtenerProductoPorId(id);
    if (producto === null) return;

    const campoId = document.getElementById("editarId");
    const campoNombre = document.getElementById("editarNombre");
    const campoPrecio = document.getElementById("editarPrecio");
    const campoStock = document.getElementById("editarStock");
    const contenedorError = document.getElementById("editarProductoError");

    if (campoId) campoId.value = producto.id;
    if (campoNombre) campoNombre.value = producto.nombre;
    if (campoPrecio) campoPrecio.value = producto.precio;
    if (campoStock) campoStock.value = producto.stock;
    if (contenedorError) {
        contenedorError.classList.add("d-none");
        contenedorError.textContent = "";
    }

    new bootstrap.Modal(document.getElementById("editarProductoModal")).show();
}

window.abrirEditarProducto = abrirEditarProducto;

const formularioEditarIndex = document.getElementById("editarProductoForm");

formularioEditarIndex.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const campoId = document.getElementById("editarId");
    const campoPrecio = document.getElementById("editarPrecio");
    const campoStock = document.getElementById("editarStock");
    const contenedorError = document.getElementById("editarProductoError");

    const id = Number(campoId.value);
    const precioValor = Number(campoPrecio.value);
    const stockValor = Number(campoStock.value);

    if (precioValor < 0 || stockValor < 0) {
            contenedorError.textContent = "Precio y stock deben ser números válidos y no negativos.";
            contenedorError.classList.remove("d-none");
        return;
    }

    editarProducto(id, { precio: precioValor, stock: stockValor });
    mostrarProductos();

    new bootstrap.Modal(document.getElementById("editarProductoModal")).hide();
});


const btnEliminarIndex = document.getElementById("editarEliminarBtn");

btnEliminarIndex.addEventListener("click", function () {

    if (!confirm("¿Estás seguro que querés eliminar este producto?")) return;

    eliminarProducto(id);
    mostrarProductos();

    new bootstrap.Modal(document.getElementById("editarProductoModal")).hide();
});
