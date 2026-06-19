//import {obtenerSesion} from ".js/auth.js";
//import {cachito1 as  obtenerSesion} from "./auth.js";
import {cachito as ALGO} from "./modulos/auth.js";

export{
  inicializarProductos,
  mostrarProductosInicio
}


const PRODUCTOS_INICIALES = [
    {
        id: 1,
        nombre: "Zowie XL2546",
        descripcion: "Monitor Gamer 24,5 pulgadas",
        precio: 800000,
        stock: 3,
        imagen: "img/240.webp"
    },
    {
        id: 2,
        nombre: "Monitor Samsung Curvo",
        descripcion: "Odyssey Ark 55\" 4K Mini-LED",
        precio: 1200000,
        stock: 5,
        imagen: "img/curvo.webp"
    },
    {
        id: 3,
        nombre: "Auriculares HyperX",
        descripcion: "Compatibles PC, PS5, Xbox, Switch",
        precio: 85000,
        stock: 8,
        imagen: "img/Auris.webp"
    },
    {
        id: 4,
        nombre: "Razer Deathadder v3 Pro",
        descripcion: "Mouse inalámbrico gaming",
        precio: 120000,
        stock: 15,
        imagen: "img/mouse.webp"
    },
    {
        id: 5,
        nombre: "MSI 5080 White",
        descripcion: "RTX 5080 White Edition",
        precio: 2800000,
        stock: 1,
        imagen: "img/aorus.webp"
    },
    {
        id: 6,
        nombre: "Ventus 5070 Ti",
        descripcion: "Ventus 5070 Ti 8GB",
        precio: 1500000,
        stock: 2,
        imagen: "img/ventus5070.webp"
    },
    {
        id: 7,
        nombre: "Asus Prime 5070 Ti",
        descripcion: "Asus Prime 5070 Ti 8GB",
        precio: 1500000,
        stock: 3,
        imagen: "img/ventus.webp"
    }
    ,
    {
        id: 8,
        nombre: "MSI Prime 5080",
        descripcion: "MSI Prime 5080 8GB",
        precio: 1500000,
        stock: 4,
        imagen: "img/msiplaca.webp"
    }
];

function inicializarProductos() {

    const productosGuardados =
        localStorage.getItem("productos");

    if (productosGuardados === null) {

        localStorage.setItem(
            "productos",
            JSON.stringify(PRODUCTOS_INICIALES)
        );

    }

}

function obtenerProductos() {

    const productosGuardados =
        localStorage.getItem("productos");

    return JSON.parse(productosGuardados);

}

function agregarProducto(productoNuevo) {

    const productos =
        obtenerProductos();

    productos.push(productoNuevo);

    guardarProductos(productos);

}

function mostrarProductos() {

    const tabla =
        document.getElementById("tablaProductos");

    if (tabla === null) {
        return;
    }

    const productos =
        obtenerProductos();

    tabla.innerHTML = "";

    for (let i = 0; i < productos.length; i++) {

        const producto =
            productos[i];

        let badgeStock = "";

        if (producto.stock <= 0) {

            badgeStock =
                '<span class="badge bg-danger">Sin stock</span>';

        } else if (producto.stock <= 3) {

            badgeStock =
                '<span class="badge bg-warning text-dark">Últimas unidades</span>';

        } else {

            badgeStock =
                '<span class="badge bg-success">En stock</span>';

        }

        tabla.innerHTML += `
            <tr>
                <th scope="row">${producto.id}</th>

                <td class="text-center">
                    ${producto.nombre}
                </td>

                <td class="text-center">
                    ${producto.descripcion}
                </td>

                <td class="text-center">
                    $${producto.precio.toLocaleString("es-AR")}
                </td>

                <td class="text-center">
                    ${badgeStock}
                </td>

                <td class="text-center">
                    <img
                        src="${producto.imagen}"
                        class="img-fluid img-listado"
                        alt="${producto.nombre}"
                    >
                </td>

                <td class="d-none" data-admin-only>
                    <button
                        class="btn btn-sm btn-outline-warning me-1"
                    >
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button
                        class="btn btn-sm btn-outline-danger"
                    >
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }

}

function mostrarProductosInicio() {

    const contenedor =
        document.getElementById("contenedorProductos");

    if (contenedor === null) {
        return;
    }

    const productos =
        obtenerProductos();

    contenedor.innerHTML = "";
    
    const esAdmin= ALGO()
    const btnAdmin=`<button
                              class="btn btn-warning btn-sm"
                                data-admin-only="true"
                            >
                                <i class="bi bi-pencil-fill"></i>
                                Editar producto
                            </button>`
    for (let i = 0; i < productos.length; i++) {

        const producto =
            productos[i];

                contenedor.innerHTML += `
            <div class="col-12 col-md-6 col-lg-3">

                <div class="card h-100 bg-dark text-light border-success">

                    <img
                        src="${producto.imagen}"
                        class="card-img-top"
                        alt="${producto.nombre}"
                    >

                    <div class="card-body d-flex flex-column">

                        <h5 class="card-title">
                            ${producto.nombre}
                        </h5>

                        <p class="card-text">
                            ${producto.descripcion}
                        </p>

                        <div class="mt-auto d-grid gap-2">

                            <button
                                class="btn btn-outline-success"
                            >
                                Ir al producto
                            </button>

                            <button
                                class="btn btn-success"
                                onclick="agregarAlCarrito(${producto.id})"
                            >
                                Agregar al carrito
                            </button>

                            ${esAdmin? btnAdmin:""}

                        </div>

                    </div>

                </div>

            </div>`;
            
    }

}

function guardarProductos(productos) {

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

}

function agregarAlCarrito(idProducto) {

    let carrito =
        JSON.parse(
            localStorage.getItem("carrito")
        );

    if (carrito === null) {
        carrito = [];
    }

    const productos =
        obtenerProductos();

    let productoSeleccionado =
        null;

    for (let i = 0; i < productos.length; i++) {

        if (productos[i].id === idProducto) {

            productoSeleccionado =
                productos[i];

            break;
        }
    }

    if (productoSeleccionado !== null) {

        carrito.push(productoSeleccionado);

        localStorage.setItem(
            "carrito",
            JSON.stringify(carrito)
        );

        mostrarMensaje(
            "Producto agregado al carrito"
        );
    }
}

document.addEventListener(
    "DOMContentLoaded",
    function() {

        inicializarProductos();
        mostrarProductos();
        mostrarProductosInicio();

    }
);
