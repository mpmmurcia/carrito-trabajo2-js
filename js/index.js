document.addEventListener("DOMContentLoaded", () => {
    const conteiner = document.getElementById("productos-conteiner");

    fetch("./db/data.JSON")
        .then(response => {
           
            return response.json();
        })
        .then(data => {
            crearTarjetasProductosInicio(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function crearTarjetasProductosInicio(productos) {
        const contenedorTarjetas = document.getElementById("productos-conteiner");
        contenedorTarjetas.innerHTML = ''; 

        productos.forEach(producto => {
            const nuevaTarjeta = document.createElement("div");
            nuevaTarjeta.classList.add("tarjeta-producto");

            nuevaTarjeta.innerHTML = `
                <img src="${producto.img}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <div class="contador">
                    <button class="decrementar">-</button>
                    <input type="number" class="cantidad" value="0" min="0" readonly>
                    <button class="incrementar">+</button>
                </div>
                <button class="agregar">Agregar al carrito</button>
            `;

            contenedorTarjetas.appendChild(nuevaTarjeta);

            const cantidadInput = nuevaTarjeta.querySelector(".cantidad");
            nuevaTarjeta.querySelector(".incrementar").addEventListener("click", () => {
                cantidadInput.value = parseInt(cantidadInput.value) + 1;
            });
            nuevaTarjeta.querySelector(".decrementar").addEventListener("click", () => {
                cantidadInput.value = Math.max(0, parseInt(cantidadInput.value) - 1);
            });
            nuevaTarjeta.querySelector(".agregar").addEventListener("click", () => {
                const cantidad = parseInt(cantidadInput.value);
                if (cantidad > 0) {
                    agregarAlCarrito(producto, cantidad);
                    cantidadInput.value = 0; // Reinicia la cantidad en el input
                }
            });
        });

        actualizarContadorCarrito(); // Actualiza el contador al iniciar
    }

    function obtenerCarrito() {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    }

    function guardarCarrito(carrito) {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function agregarAlCarrito(producto, cantidad) {
        const carrito = obtenerCarrito();
        const productoExistente = carrito.find(p => p.id === producto.id);

        if (productoExistente) {
            productoExistente.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }

        guardarCarrito(carrito);
        actualizarContadorCarrito();
    }

    function actualizarContadorCarrito() {
        const contador = document.getElementById("contador-carrito");
        if (contador) {
            const totalCantidad = obtenerCarrito().reduce((total, producto) => total + (producto.cantidad || 0), 0);
            contador.textContent = totalCantidad;
        }
    }
});





