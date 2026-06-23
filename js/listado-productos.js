import { inicializarProductos, listarProductos, eliminarProducto } from "./modulos/gestorProductos.js";
import { esAdministrador, actualizarInterfaz, configurarFormularioLogin } from "./modulos/gestorAuth.js";

window.onload = function () {
    inicializarProductos();
    actualizarInterfaz();
    configurarFormularioLogin();
    window.refrescarTablaProductos = mostrarProductos;
    mostrarProductos();
    configurarFiltros();
};

function configurarFiltros() {
    const inputBusqueda = document.getElementById("buscarProducto");
    const selectCategoria = document.querySelector("select");

    if (inputBusqueda !== null) {
        inputBusqueda.addEventListener("input", mostrarProductos);
    }

    if (selectCategoria !== null) {
        selectCategoria.addEventListener("change", mostrarProductos);
    }
}

function obtenerProductosFiltrados() {
    const productos = listarProductos();
    const inputBusqueda = document.getElementById("buscarProducto");
    const selectCategoria = document.querySelector("select");

    let busqueda = "";
    let categoriaFiltro = "";

    if (inputBusqueda !== null) {
        busqueda = inputBusqueda.value.toLowerCase();
    }

    if (selectCategoria !== null) {
        categoriaFiltro = selectCategoria.value;
    }

    const productosFiltrados = [];

    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        
        const cumpleBusqueda =producto.nombre.toLowerCase().includes(busqueda) || producto.descripcion.toLowerCase().includes(busqueda);
        
        const cumpleCategoria =categoriaFiltro === "Todas las categorías" || producto.categoria === categoriaFiltro;

        if (cumpleBusqueda && cumpleCategoria) {
            productosFiltrados.push(producto);
        }
    }

    return productosFiltrados;
}

function mostrarProductos() {
    const productos = obtenerProductosFiltrados();
    const esAdmin = esAdministrador();
    renderizarTablaProductos(productos, esAdmin);
    configurarEventosTabla();
}

function renderizarTablaProductos(productos, esAdmin) {
    const tabla = document.getElementById("tablaProductos");
    if (tabla === null) {
        return;
    }

    tabla.innerHTML = "";

    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        let botonesAdmin = "";

        if (esAdmin) {
            botonesAdmin = `
                <td>
                    <button class="btn btn-sm btn-outline-warning me-1" type="button" name="editar" value="${producto.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" type="button" name="eliminar" value="${producto.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>`;
        }

        tabla.innerHTML += `
            <tr>
                <th scope="row">${producto.id}</th>
                <td class="text-center">${producto.nombre}</td>
                <td class="text-center">${producto.descripcion}</td>
                <td class="text-center">$${producto.precio.toLocaleString("es-AR")}</td>
                <td class="text-center">${producto.stock}</td>
                <td class="text-center">
                    <img src="${producto.imagen}" class="img-fluid img-listado" alt="${producto.nombre}">
                </td>
                ${botonesAdmin}
            </tr>`;
    }
}

function configurarEventosTabla() {
    const botonesEliminar = document.getElementsByName("eliminar");
    for (let i = 0; i < botonesEliminar.length; i++) {
        botonesEliminar[i].onclick = function () {
            const id = Number(this.value);
            eliminarProducto(id);
            mostrarProductos();
        };
    }

    const botonesEditar = document.getElementsByName("editar");
    for (let i = 0; i < botonesEditar.length; i++) {
        botonesEditar[i].onclick = function () {
            const id = Number(this.value);
            alert("Editar producto " + id);
        };
    }
}
