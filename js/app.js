"use strict";

/* =====================================================
   TECHFIX | Funciones principales
   Nota: los datos se almacenan localmente en el navegador.
===================================================== */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const formatearPesos = (valor) => Number(valor).toLocaleString("es-CO");
const guardarJSON = (clave, datos) => {
    try {
        localStorage.setItem(clave, JSON.stringify(datos));
        return true;
    } catch (error) {
        console.error("No fue posible guardar los datos:", error);
        return false;
    }
};
const leerJSON = (clave, valorPredeterminado) => {
    try {
        const datos = JSON.parse(localStorage.getItem(clave));
        return datos ?? valorPredeterminado;
    } catch (error) {
        return valorPredeterminado;
    }
};

/* Año del pie de página */
$("#anio").textContent = new Date().getFullYear();

/* =====================================================
   MENÚ RESPONSIVE
===================================================== */
const btnMenu = $("#btnMenu");
const menu = $("#menu");

btnMenu.addEventListener("click", () => {
    const abierto = menu.classList.toggle("menu-activo");
    btnMenu.setAttribute("aria-expanded", String(abierto));
});

$$("a", menu).forEach((enlace) => {
    enlace.addEventListener("click", () => {
        menu.classList.remove("menu-activo");
        btnMenu.setAttribute("aria-expanded", "false");
    });
});

/* =====================================================
   MODO CLARO / OSCURO CON PREFERENCIA GUARDADA
===================================================== */
const btnTema = $("#btnTema");
const temaGuardado = localStorage.getItem("temaTechFix");

function aplicarTema(oscuro) {
    document.body.classList.toggle("modo-oscuro", oscuro);
    btnTema.textContent = oscuro ? "☀️ Modo claro" : "🌙 Modo oscuro";
    btnTema.setAttribute("aria-pressed", String(oscuro));
}

aplicarTema(temaGuardado === "oscuro");

btnTema.addEventListener("click", () => {
    const activarOscuro = !document.body.classList.contains("modo-oscuro");
    aplicarTema(activarOscuro);
    localStorage.setItem("temaTechFix", activarOscuro ? "oscuro" : "claro");
});

/* =====================================================
   CATÁLOGO: BÚSQUEDA Y FILTROS
===================================================== */
const tarjetasServicio = $$(".tarjeta-servicio");
const botonesFiltro = $$(".filtro");
const buscarServicio = $("#buscarServicio");
const sinResultados = $("#sinResultados");
let filtroActual = "todos";

function filtrarServicios() {
    const termino = buscarServicio.value.trim().toLocaleLowerCase("es");
    let visibles = 0;

    tarjetasServicio.forEach((tarjeta) => {
        const categoria = tarjeta.dataset.categoria;
        const texto = tarjeta.textContent.toLocaleLowerCase("es");
        const coincideCategoria = filtroActual === "todos" || categoria === filtroActual;
        const coincideTexto = texto.includes(termino);
        const mostrar = coincideCategoria && coincideTexto;
        tarjeta.hidden = !mostrar;
        if (mostrar) visibles++;
    });

    sinResultados.hidden = visibles !== 0;
}

botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
        filtroActual = boton.dataset.filtro;
        botonesFiltro.forEach((otro) => {
            const activo = otro === boton;
            otro.classList.toggle("activo", activo);
            otro.setAttribute("aria-pressed", String(activo));
        });
        filtrarServicios();
    });
});
buscarServicio.addEventListener("input", filtrarServicios);

/* =====================================================
   CARRITO PERSISTENTE
===================================================== */
const CLAVE_CARRITO = "techfixCarrito";
let carrito = leerJSON(CLAVE_CARRITO, []);
if (!Array.isArray(carrito)) carrito = [];

carrito = carrito.filter((item) =>
    item && typeof item.id === "string" &&
    typeof item.nombre === "string" &&
    Number.isFinite(item.precio) && item.precio > 0 &&
    Number.isInteger(item.cantidad) && item.cantidad > 0
);

const listaCarrito = $("#listaCarrito");
const totalElemento = $("#total");
const contadorCarrito = $("#contadorCarrito");
const btnVaciar = $("#btnVaciar");

function persistirCarrito() {
    guardarJSON(CLAVE_CARRITO, carrito);
}

function actualizarCarrito() {
    listaCarrito.replaceChildren();

    if (carrito.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "mensaje-vacio";
        vacio.textContent = "Tu carrito está vacío. Agrega un servicio para comenzar.";
        listaCarrito.appendChild(vacio);
    }

    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach((producto) => {
        total += producto.precio * producto.cantidad;
        cantidadTotal += producto.cantidad;

        const item = document.createElement("div");
        item.className = "item-carrito";

        const descripcion = document.createElement("div");
        const nombre = document.createElement("strong");
        nombre.textContent = producto.nombre;
        const detalle = document.createElement("small");
        detalle.textContent = `$${formatearPesos(producto.precio)} por servicio`;
        descripcion.append(nombre, detalle);

        const controles = document.createElement("div");
        controles.className = "cantidad-controles";
        controles.setAttribute("aria-label", `Cantidad de ${producto.nombre}`);

        const disminuir = document.createElement("button");
        disminuir.type = "button";
        disminuir.textContent = "−";
        disminuir.setAttribute("aria-label", `Disminuir ${producto.nombre}`);
        disminuir.addEventListener("click", () => cambiarCantidad(producto.id, -1));

        const cantidad = document.createElement("span");
        cantidad.textContent = producto.cantidad;

        const aumentar = document.createElement("button");
        aumentar.type = "button";
        aumentar.textContent = "+";
        aumentar.setAttribute("aria-label", `Aumentar ${producto.nombre}`);
        aumentar.addEventListener("click", () => cambiarCantidad(producto.id, 1));

        controles.append(disminuir, cantidad, aumentar);

        const subtotal = document.createElement("strong");
        subtotal.textContent = `$${formatearPesos(producto.precio * producto.cantidad)}`;

        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.className = "btn-eliminar";
        eliminar.textContent = "Eliminar";
        eliminar.addEventListener("click", () => eliminarProducto(producto.id));

        const acciones = document.createElement("div");
        acciones.append(subtotal, document.createElement("br"), eliminar);

        item.append(descripcion, controles, acciones);
        listaCarrito.appendChild(item);
    });

    totalElemento.textContent = formatearPesos(total);
    contadorCarrito.textContent = cantidadTotal;
    btnVaciar.disabled = carrito.length === 0;
    persistirCarrito();
}

function agregarProducto(id, nombre, precio) {
    const existente = carrito.find((producto) => producto.id === id);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }
    actualizarCarrito();
}

function cambiarCantidad(id, cambio) {
    const producto = carrito.find((item) => item.id === id);
    if (!producto) return;
    producto.cantidad += cambio;
    if (producto.cantidad <= 0) {
        carrito = carrito.filter((item) => item.id !== id);
    }
    actualizarCarrito();
}

function eliminarProducto(id) {
    carrito = carrito.filter((producto) => producto.id !== id);
    actualizarCarrito();
}

$$(".btn-agregar").forEach((boton) => {
    boton.addEventListener("click", () => {
        const precio = Number(boton.dataset.precio);
        const id = boton.dataset.id;
        const nombre = boton.dataset.nombre;

        if (!id || !nombre || !Number.isSafeInteger(precio) || precio <= 0) return;
        agregarProducto(id, nombre, precio);

        const textoOriginal = boton.textContent;
        boton.textContent = "¡Agregado!";
        window.setTimeout(() => { boton.textContent = textoOriginal; }, 900);
    });
});

btnVaciar.addEventListener("click", () => {
    carrito = [];
    actualizarCarrito();
});
actualizarCarrito();

/* =====================================================
   REGISTRO DE CLIENTES (ALMACENAMIENTO LOCAL)
===================================================== */
const CLAVE_CLIENTES = "clientesTechFix";
const formRegistro = $("#formRegistro");
const mensajeRegistro = $("#mensajeRegistro");
const listaClientes = $("#listaClientes");
const cantidadClientes = $("#cantidadClientes");

let clientes = leerJSON(CLAVE_CLIENTES, []);
if (!Array.isArray(clientes)) clientes = [];

clientes = clientes.filter((cliente) =>
    cliente && Number.isSafeInteger(cliente.id) &&
    ["nombre", "documento", "correo", "telefono", "usuario"].every(
        (campo) => typeof cliente[campo] === "string"
    )
);

function mostrarMensaje(elemento, texto, tipo = "") {
    elemento.textContent = texto;
    elemento.classList.remove("exito", "error");
    if (tipo) elemento.classList.add(tipo);
}

function guardarClientes() {
    return guardarJSON(CLAVE_CLIENTES, clientes);
}

function mostrarClientes() {
    listaClientes.replaceChildren();
    cantidadClientes.textContent = clientes.length;

    if (clientes.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "mensaje-vacio";
        vacio.textContent = "Aún no hay clientes registrados.";
        listaClientes.appendChild(vacio);
        return;
    }

    clientes.forEach((cliente) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "cliente-registrado";

        const campos = [
            ["Nombre", cliente.nombre],
            ["Documento", cliente.documento],
            ["Correo", cliente.correo],
            ["Teléfono", cliente.telefono],
            ["Usuario", cliente.usuario]
        ];

        campos.forEach(([etiqueta, valor]) => {
            const parrafo = document.createElement("p");
            const nombreCampo = document.createElement("strong");
            nombreCampo.textContent = `${etiqueta}: `;
            parrafo.append(nombreCampo, document.createTextNode(valor));
            tarjeta.appendChild(parrafo);
        });

        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.className = "btn-eliminar-cliente";
        eliminar.textContent = "Eliminar cliente";
        eliminar.addEventListener("click", () => {
            clientes = clientes.filter((item) => item.id !== cliente.id);
            guardarClientes();
            mostrarClientes();
            mostrarMensaje(mensajeRegistro, "Cliente eliminado correctamente.", "exito");
        });

        tarjeta.appendChild(eliminar);
        listaClientes.appendChild(tarjeta);
    });
}

formRegistro.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = $("#nombreRegistro").value.trim();
    const documento = $("#documentoRegistro").value.trim();
    const correo = $("#correoRegistro").value.trim();
    const telefono = $("#telefonoRegistro").value.trim();
    const usuario = $("#usuarioRegistro").value.trim();

    if (!/^\d+$/.test(documento)) {
        mostrarMensaje(mensajeRegistro, "El documento debe contener solo números.", "error");
        return;
    }
    if (!/^\d{7,15}$/.test(telefono)) {
        mostrarMensaje(mensajeRegistro, "El teléfono debe contener entre 7 y 15 dígitos.", "error");
        return;
    }
    if (usuario.length < 3) {
        mostrarMensaje(mensajeRegistro, "El usuario debe tener al menos 3 caracteres.", "error");
        return;
    }

    const duplicado = clientes.some((cliente) =>
        cliente.documento === documento ||
        cliente.correo.toLowerCase() === correo.toLowerCase() ||
        cliente.usuario.toLowerCase() === usuario.toLowerCase()
    );

    if (duplicado) {
        mostrarMensaje(mensajeRegistro, "Ya existe un cliente con ese documento, correo o usuario.", "error");
        return;
    }

    const nuevoCliente = {
        id: Date.now(),
        nombre, documento, correo, telefono, usuario
    };

    clientes.push(nuevoCliente);
    if (!guardarClientes()) {
        clientes.pop();
        mostrarMensaje(mensajeRegistro, "No fue posible guardar el registro en este navegador.", "error");
        return;
    }

    mostrarClientes();
    formRegistro.reset();
    mostrarMensaje(mensajeRegistro, "¡Cliente registrado correctamente en TechFix!", "exito");
});

/* Clientes ficticios para demostración: solo se cargan una vez. */
if (clientes.length === 0 && localStorage.getItem("techfixDemoCargada") !== "si") {
    clientes = [
        { id: 1001, nombre: "Laura Marcela Gómez", documento: "1023456789", correo: "laura.gomez@example.com", telefono: "3104567890", usuario: "lauragomez" },
        { id: 1002, nombre: "Andrés Felipe Rodríguez", documento: "1034567890", correo: "andres.rodriguez@example.com", telefono: "3115678901", usuario: "andresrodriguez" },
        { id: 1003, nombre: "Camila Torres Martínez", documento: "1045678901", correo: "camila.torres@example.com", telefono: "3126789012", usuario: "camilatorres" },
        { id: 1004, nombre: "Juan David Ramírez", documento: "1056789012", correo: "juan.ramirez@example.com", telefono: "3137890123", usuario: "juanramirez" },
        { id: 1005, nombre: "Valentina Herrera López", documento: "1067890123", correo: "valentina.herrera@example.com", telefono: "3148901234", usuario: "valentinaherrera" }
    ];
    if (guardarClientes()) localStorage.setItem("techfixDemoCargada", "si");
}
mostrarClientes();

/* =====================================================
   FORMULARIO DE CONTACTO (VALIDACIÓN DEMOSTRATIVA)
===================================================== */
const formulario = $("#formulario");
const resultado = $("#resultado");

formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = $("#nombre").value.trim();
    const correo = $("#correo").value.trim();
    const telefono = $("#telefono").value.trim();
    const servicio = $("#servicio").value;
    const mensaje = $("#mensaje").value.trim();

    if (!nombre || !correo || !telefono || !servicio || !mensaje) {
        mostrarMensaje(resultado, "Por favor, completa todos los campos.", "error");
        return;
    }
    if (!/^\d{7,15}$/.test(telefono)) {
        mostrarMensaje(resultado, "El teléfono debe contener entre 7 y 15 dígitos.", "error");
        return;
    }

    mostrarMensaje(
        resultado,
        `Solicitud validada correctamente para ${nombre}. Esta demostración no envía los datos a un servidor.`,
        "exito"
    );
    formulario.reset();
});
