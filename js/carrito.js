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
    localStorage.removeItem("carrito");
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
        Swal.fire('El carrito está vacío.'); // Mensaje si el carrito está vacío
        return;
    }
    
    solicitarDatos(); // Llamamos a la función de solicitar datos
}

function manejarPago() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        return;
    }
    
    solicitarDatos(); 
}

function solicitarDatos() {
    Swal.fire({
        title: 'Bienvenido!',
        text: 'Ingresa Tus Datos',
        footer: 'Esta información es obligatoria para continuar con la compra',
        html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre">
            <input id="apellido" class="swal2-input" placeholder="Apellido">
            <input id="email" class="swal2-input" placeholder="Email">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const email = document.getElementById('email').value;
            if (!nombre || !apellido || !email) {
                Swal.showValidationMessage('Por favor, complete todos los campos!');
                return false; 
            }
            return { nombre, apellido, email };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { nombre, apellido, email } = result.value;
            const total = calcularTotal().toFixed(2);
            const recibo = `
                <strong>Recibo de Compra:</strong><br>
                Nombre: ${nombre}<br>
                Apellido: ${apellido}<br>
                Email: ${email}<br>
                Total: $${total}
            `;
            
            // Mostrar recibo con botones de Avanzar y Cancelar
            Swal.fire({
                title: 'Revisa tus Datos',
                html: recibo,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Avanzar con la compra',
                cancelButtonText: 'Cancelar compra'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('¡Felicitaciones!', 'Tu compra fue realizada con éxito.', 'success');
                } else {
                  Swal.fire('Compra Cancelada', 'La operación ha sido cancelada.', 'info');
                }
            });
        }
    });
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




