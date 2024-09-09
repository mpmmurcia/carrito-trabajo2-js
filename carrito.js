
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


function calcularTotal() {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, producto) => total + (producto.precio * (producto.cantidad || 1)), 0);
}


function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const contenedorCarrito = document.getElementById("carrito-contenedor");
    contenedorCarrito.innerHTML = ''; 
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

        
        productoEnCarrito.querySelector(".eliminar").addEventListener("click", () => eliminarDelCarrito(producto));
    });

    
    document.getElementById("total-costo").textContent = calcularTotal().toFixed(2);
}


function manejarPago() {
    alert("El total a pagar es: $" + calcularTotal().toFixed(2));
}


function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        const totalCantidad = obtenerCarrito().reduce((total, producto) => total + (producto.cantidad || 1), 0);
        contador.textContent = totalCantidad;
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
}


window.addEventListener('load', () => {
    const path = window.location.pathname;
    if (path.endsWith('cart.html')) {
        inicializarPaginaCarrito();
    }
});




