const CLAVE_CARRITO = "carrito";

function inicializarCarrito() {

    const carritoGuardado =
        localStorage.getItem(CLAVE_CARRITO);

    if (carritoGuardado === null) {

        localStorage.setItem(
            CLAVE_CARRITO,
            JSON.stringify([])
        );

    }
}

function obtenerCarrito() {

    const carritoGuardado =
        localStorage.getItem(CLAVE_CARRITO);

    return JSON.parse(carritoGuardado);
}

function guardarCarrito(carrito) {

    localStorage.setItem(
        CLAVE_CARRITO,
        JSON.stringify(carrito)
    );
}

function agregarAlCarrito(idProducto) {

    const productos =
        obtenerProductos();

    const carrito =
        obtenerCarrito();

    const producto =
        productos.find(
            p => p.id === idProducto
        );

    if (producto === undefined) {
        return;
    }

    carrito.push(producto);

    guardarCarrito(carrito);
}

function mostrarCarrito() {

    const contenedor =
    document.getElementById(
        "productosCarrito"
    );

    const resumen =
    document.getElementById(
        "resumenCarrito"
    );

    if (
        contenedor === null ||
        resumen === null
    ) {
        return;
    }

    const carrito =
        obtenerCarrito();

    let totalCompra = 0;

    contenedor.innerHTML = "";

    for (let i = 0; i < carrito.length; i++) {

        const producto =
            carrito[i];

        totalCompra +=
            producto.precio;

        contenedor.innerHTML += `
            <div class="card mb-3">
                <div class="card-body">

                    <div class="row align-items-center">

                        <div class="col-3">
                            <img
                                src="${producto.imagen}"
                                class="img-carrito"
                            >
                        </div>

                        <div class="col">
                            <h5>
                                ${producto.nombre}
                            </h5>

                            <p>
                                ${producto.descripcion}
                            </p>
                        </div>

                        <div class="col-auto">
                            <strong>
                                $${producto.precio.toLocaleString("es-AR")}
                            </strong>
                        </div>

                    </div>

                </div>
            </div>
        `;
    }

        resumen.innerHTML = `
            <h3 class="mb-4">
                RESUMEN
            </h3>

            <div class="d-flex justify-content-between mb-3">
                <span>
                    ${carrito.length} producto(s)
                </span>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="fs-4">
                    Total
                </span>

                <strong class="fs-2">
                    $${totalCompra.toLocaleString("es-AR")}
                </strong>
            </div>

            <div class="d-grid gap-3 mt-4">

                <button class="btn btn-success">
                    <i class="bi bi-credit-card me-2"></i>
                    Iniciar compra
                </button>

                <a
                    href="listado-productos.html"
                    class="btn btn-outline-success"
                >
                    Ver más productos
                </a>

            </div>
        `;
}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        inicializarCarrito();
        mostrarCarrito();

    }
);