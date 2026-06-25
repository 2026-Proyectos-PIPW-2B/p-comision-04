import { inicializarProductos, listarProductos, eliminarProducto, agregarProducto, obtenerProductoPorId, editarProducto } from "./modulos/gestorProductos.js";
import { esAdministrador, actualizarInterfaz, configurarFormularioLogin } from "./modulos/gestorAuth.js";

window.onload = function () {
    inicializarProductos();
    actualizarInterfaz();
    configurarFormularioLogin();
    window.refrescarTablaProductos = mostrarProductos;
    mostrarProductos();
    configurarFiltros();
    configurarAgregarProducto();
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
            const producto = obtenerProductoPorId(id);

            const campoId = document.getElementById("editarId");
            const campoNombre = document.getElementById("editarNombre");
            const campoPrecio = document.getElementById("editarPrecio");
            const campoStock = document.getElementById("editarStock");
            const contenedorError = document.getElementById("editarProductoError");

            campoId.value = producto.id;
            campoNombre.value = producto.nombre;
            campoPrecio.value = producto.precio;
            campoStock.value = producto.stock;
            
            contenedorError.classList.add("d-none");
            contenedorError.textContent = "";
            

            new bootstrap.Modal(document.getElementById("editarProductoModal")).show();
        };
    }
}

const formularioEditar = document.getElementById("editarProductoForm");

formularioEditar.addEventListener("submit", function (evento) {
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

    editarProducto(id, {precio: precioValor, stock: stockValor});
    mostrarProductos();

    new bootstrap.Modal(document.getElementById("editarProductoModal")).hide();
});

const btnEliminarModal = document.getElementById("editarEliminarBtn");

btnEliminarModal.addEventListener("click", function () {
    const id = Number(document.getElementById("editarId").value);

    if (!confirm("¿Estás seguro que querés eliminar este producto?")) {
        return;
    }

    eliminarProducto(id);
    mostrarProductos();

    new bootstrap.Modal(document.getElementById("editarProductoModal")).hide();
});


function configurarAgregarProducto() {
    const formulario = document.getElementById("agregarProductoForm");
    const errorContenedor = document.getElementById("agregarProductoError");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        errorContenedor.classList.add("d-none");
        errorContenedor.textContent = "";

        const nombre = document.getElementById("nuevoNombre");
        const descripcion = document.getElementById("nuevoDescripcion");
        const precio = document.getElementById("nuevoPrecio");
        const stock = document.getElementById("nuevoStock");
        const categoria = document.getElementById("nuevoCategoria");
        const imagenInput = document.getElementById("nuevoImagen");

        const nombreValor = nombre.value.trim();
        const descripcionValor = descripcion.value.trim();
        const precioValor = Number(precio.value);
        const stockValor = Number(stock.value);
        const categoriaValor = categoria.value;

        if (nombreValor === "" || descripcionValor === "" || isNaN(precioValor) || precioValor < 0 || isNaN(stockValor) || stockValor < 0) {
            errorContenedor.textContent = "Completa todos los campos correctamente antes de guardar.";
            errorContenedor.classList.remove("d-none");
            return;
        }

        const procesarProducto = function(imagenValor) {
            const productos = listarProductos();
            const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;

            const productoNuevo = {
                id: nuevoId,
                nombre: nombreValor,
                descripcion: descripcionValor,
                precio: precioValor,
                stock: stockValor,
                imagen: imagenValor,
                categoria: categoriaValor
            };

            agregarProducto(productoNuevo);
            mostrarProductos();

           new bootstrap.Modal(document.getElementById("agregarProductoModal")).hide();

            formulario.reset();
        };

        const archivo = imagenInput.files && imagenInput.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = function(eventoArchivo) {
                procesarProducto(eventoArchivo.target.result);
            };
            lector.readAsDataURL(archivo);
        } else {
            procesarProducto("img/240.webp");
        }
    });
}


