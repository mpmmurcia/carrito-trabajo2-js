function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarDelCarrito(producto) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(p => p.id !== producto.id);
    guardarCarrito(carrito);
    actualizarCarritoEnPagina();
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    // Elimina el carrito del localStorage
    localStorage.removeItem("carrito");
    // Actualiza la vista del carrito en la página
    actualizarCarritoEnPagina();
}

function calcularTotal() {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
}

function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const contenedorCarrito = document.getElementById("carrito-contenedor");
    contenedorCarrito.innerHTML = '';

    if (carrito.length === 0) {
        document.getElementById("carrito-vacio").style.display = "block";
    } else {
        document.getElementById("carrito-vacio").style.display = "none";
        carrito.forEach(producto => {
            const productoEnCarrito = document.createElement("div");
            productoEnCarrito.classList.add("producto-en-carrito");

            productoEnCarrito.innerHTML = `
                <img src="${producto.img}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <div class="contador">
                    <button class="decrementar">-</button>
                    <input type="number" class="cantidad" value="${producto.cantidad}" min="0" readonly>
                    <button class="incrementar">+</button>
                </div>
                <button class="eliminar">Eliminar</button>
            `;

            contenedorCarrito.appendChild(productoEnCarrito);

            const cantidadInput = productoEnCarrito.querySelector(".cantidad");
            productoEnCarrito.querySelector(".incrementar").addEventListener("click", () => {
                cantidadInput.value = parseInt(cantidadInput.value) + 1;
                actualizarCantidad(producto, cantidadInput.value);
            });
            productoEnCarrito.querySelector(".decrementar").addEventListener("click", () => {
                cantidadInput.value = Math.max(0, parseInt(cantidadInput.value) - 1);
                actualizarCantidad(producto, cantidadInput.value);
            });
            productoEnCarrito.querySelector(".eliminar").addEventListener("click", () => eliminarDelCarrito(producto));
        });
    }

    document.getElementById("total-costo").textContent = calcularTotal().toFixed(2);
}

function manejarPago() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de proceder al pago.");
    } else {
        alert("El total a pagar es: $" + calcularTotal().toFixed(2));
    }
}


function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        const totalCantidad = obtenerCarrito().reduce((total, producto) => total + producto.cantidad, 0);
        contador.textContent = totalCantidad;
    }
}

function actualizarCantidad(producto, nuevaCantidad) {
    const carrito = obtenerCarrito();
    const productoExistente = carrito.find(p => p.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad = parseInt(nuevaCantidad);
        guardarCarrito(carrito);
        mostrarCarrito();
        actualizarContadorCarrito();
    }
}

function actualizarCarritoEnPagina() {
    mostrarCarrito();
}

function inicializarPaginaCarrito() {
    mostrarCarrito();
    actualizarContadorCarrito();

    const pagarBtn = document.getElementById("pagar-btn");
    if (pagarBtn) {
        pagarBtn.addEventListener("click", manejarPago);
    }

    const vaciarBtn = document.getElementById("vaciar-carrito-btn");
    if (vaciarBtn) {
        vaciarBtn.addEventListener("click", vaciarCarrito);
    }
}

inicializarPaginaCarrito();







