// Función para obtener el carrito desde localStorage
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Función para guardar el carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(producto) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(p => p.id !== producto.id);
    guardarCarrito(carrito);
    actualizarCarritoEnPagina();
    actualizarContadorCarrito();
}

// Función para calcular el total del carrito
function calcularTotal() {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, producto) => total + (producto.precio * (producto.cantidad || 1)), 0);
}

// Función para mostrar productos en el carrito
function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const contenedorCarrito = document.getElementById("carrito-contenedor");
    contenedorCarrito.innerHTML = ''; // Limpia el contenedor

    carrito.forEach(producto => {
        const productoEnCarrito = document.createElement("div");
        productoEnCarrito.classList.add("producto-en-carrito");

        productoEnCarrito.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <button class="eliminar">Eliminar</button>
        `;

        contenedorCarrito.appendChild(productoEnCarrito);

        // Añade el manejador de eventos para el botón de eliminar
        productoEnCarrito.querySelector(".eliminar").addEventListener("click", () => eliminarDelCarrito(producto));
    });

    // Actualiza el total después de mostrar el carrito
    document.getElementById("total-costo").textContent = calcularTotal().toFixed(2);
}

// Función para manejar el clic en el botón "Pagar"
function manejarPago() {
    alert("El total a pagar es: $" + calcularTotal().toFixed(2));
}

// Función para actualizar el contador del carrito en la interfaz
function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        const totalCantidad = obtenerCarrito().reduce((total, producto) => total + (producto.cantidad || 1), 0);
        contador.textContent = totalCantidad;
    }
}

// Función para actualizar la visualización del carrito en la página
function actualizarCarritoEnPagina() {
    mostrarCarrito();
}

// Inicializar la página del carrito
function inicializarPaginaCarrito() {
    mostrarCarrito();
    actualizarContadorCarrito(); // Asegúrate de actualizar el contador cuando se cargue el carrito

    // Añadir el manejador de eventos para el botón "Pagar"
    const pagarBtn = document.getElementById("pagar-btn");
    if (pagarBtn) {
        pagarBtn.addEventListener("click", manejarPago);
    }
}

// Manejar la carga de la página
window.addEventListener('load', () => {
    const path = window.location.pathname;
    if (path.endsWith('cart.html')) {
        inicializarPaginaCarrito();
    }
});




