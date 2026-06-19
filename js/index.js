import {listarProductos} from "./modulos/gestorProductos.js"
import {esAdministrador} from "./modulos/gestorAuth.js"

window.onload = function(){
    mostrarProductos()
}

function mostrarProductos(){
    let productos = listarProductos()
    let esAdmin = esAdministrador()
    renderizarTablaProductos(productos, esAdmin)
}

function renderizarTablaProductos(productos, esAdmin){
    const contenedor = document.getElementById("contenedorProductos");
    
    contenedor.innerHTML = "";
    
    const btnAdmin =`<button
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
