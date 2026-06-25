import { guardarDato, obtenerDato } from "./gestorBD.js";

const PRODUCTOS_KEY = "productos";

const PRODUCTOS_INICIALES = [
    {
        id: 1,
        nombre: "Zowie XL2546",
        descripcion: "Monitor Gamer 24,5 pulgadas",
        precio: 800000,
        stock: 3,
        imagen: "img/240.webp",
        categoria: "Monitores"
    },
    {
        id: 2,
        nombre: "Monitor Samsung Curvo",
        descripcion: "Odyssey Ark 55\" 4K Mini-LED",
        precio: 1200000,
        stock: 5,
        imagen: "img/curvo.webp",
        categoria: "Monitores"
    },
    {
        id: 3,
        nombre: "Auriculares HyperX",
        descripcion: "Compatibles PC, PS5, Xbox, Switch",
        precio: 85000,
        stock: 8,
        imagen: "img/Auris.webp",
        categoria: "Periféricos"
    },
    {
        id: 4,
        nombre: "Razer Deathadder v3 Pro",
        descripcion: "Mouse inalámbrico gaming",
        precio: 120000,
        stock: 15,
        imagen: "img/mouse.webp",
        categoria: "Periféricos"
    },
    {
        id: 5,
        nombre: "MSI 5080 White",
        descripcion: "RTX 5080 White Edition",
        precio: 2800000,
        stock: 1,
        imagen: "img/aorus.webp",
        categoria: "Placas de video"
    },
    {
        id: 6,
        nombre: "Ventus 5070 Ti",
        descripcion: "Ventus 5070 Ti 8GB",
        precio: 1500000,
        stock: 2,
        imagen: "img/ventus5070.webp",
        categoria: "Placas de video"
    },
    {
        id: 7,
        nombre: "Asus Prime 5070 Ti",
        descripcion: "Asus Prime 5070 Ti 8GB",
        precio: 1500000,
        stock: 3,
        imagen: "img/ventus.webp",
        categoria: "Placas de video"
    },
    {
        id: 8,
        nombre: "MSI Prime 5080",
        descripcion: "MSI Prime 5080 8GB",
        precio: 1500000,
        stock: 4,
        imagen: "img/msiplaca.webp",
        categoria: "Placas de video"
    }
];

export {inicializarProductos,listarProductos,obtenerProductoPorId,agregarProducto,eliminarProducto,editarProducto};

function inicializarProductos() {
    const productosGuardados = obtenerDato(PRODUCTOS_KEY);
    if (productosGuardados === null) {
        guardarDato(PRODUCTOS_KEY, PRODUCTOS_INICIALES);
    }
}

function listarProductos() {
    const productosGuardados = obtenerDato(PRODUCTOS_KEY);
    if (productosGuardados === null) {
        return [];
    }
    return productosGuardados;
}

function obtenerProductoPorId(id) {
    const productos = listarProductos();
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
            return productos[i];
        }
    }
    return null;
}

function agregarProducto(productoNuevo) {
    const productos = listarProductos();
    productos.push(productoNuevo);
    guardarDato(PRODUCTOS_KEY, productos);
}

function eliminarProducto(id) {
    const productos = listarProductos();
    const nuevosProductos = [];
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id !== id) {
            nuevosProductos.push(productos[i]);
        }
    }
    guardarDato(PRODUCTOS_KEY, nuevosProductos);
}

function editarProducto(id, datosActualizados) {
    const productos = listarProductos();
    let modificado = false;

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
            productos[i].precio = datosActualizados.precio;
            productos[i].stock = datosActualizados.stock;
            modificado = true;
        }
    }

    if (modificado) {
        guardarDato(PRODUCTOS_KEY, productos);
    }
}
