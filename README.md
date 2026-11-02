# TECHFIX - Proyecto final de desarrollo web

Aplicación web demostrativa para un servicio técnico de computadores, desarrollada con HTML5, CSS3 y JavaScript.

## Estructura

```text
TECHFIX/
├── index.html
├── css/
│   └── estilo.css
├── js/
│   └── app.js
├── img/
│   ├── inicio.svg
│   ├── mantenimiento.svg
│   ├── reparacion.svg
│   └── software.svg
└── README.md
```

## Cómo ejecutar

1. Descarga y descomprime la carpeta.
2. Abre la carpeta `TECHFIX_Proyecto_Final` en Visual Studio Code.
3. Abre `index.html` en el navegador. También puedes usar la extensión Live Server.
4. Prueba el menú, el modo oscuro, los filtros, el carrito, el registro y el formulario.

No requiere instalación de dependencias ni servidor para la demostración básica.

## Funcionalidades

- Diseño adaptable a computador, tableta y celular.
- Menú de navegación responsive.
- Modo claro y oscuro con preferencia guardada.
- Búsqueda y filtros del catálogo.
- Carrito con cantidades, subtotales y total.
- Persistencia del carrito con `localStorage`.
- Registro y eliminación de clientes.
- Datos ficticios de demostración.
- Validación del formulario de contacto.
- Mensajes accesibles para lectores de pantalla.

## Importante sobre los datos

Esta aplicación es una demostración de frontend. `localStorage` guarda información únicamente en el navegador y dispositivo donde se utiliza. No existe una base de datos central, autenticación real ni envío de formularios a un servidor. Los clientes de ejemplo son ficticios. No ingresar datos personales reales.

## Publicación

El proyecto está compuesto por archivos estáticos y puede publicarse en un servicio de hosting estático, por ejemplo GitHub Pages o Netlify, si el docente autoriza esas plataformas.

Antes de publicar:
1. Confirmar con el docente la plataforma y el formato de entrega.
2. Probar todos los enlaces y funcionalidades.
3. Mantener los nombres de carpetas y archivos.
4. Publicar la carpeta raíz que contiene `index.html`.
5. Abrir el enlace público en una ventana privada para verificar que carga correctamente.

## Pruebas sugeridas

- Abrir el sitio en escritorio y en móvil.
- Cambiar el tema y recargar la página.
- Buscar un servicio y aplicar cada filtro.
- Agregar un servicio más de una vez y modificar cantidades.
- Recargar la página y verificar que el carrito permanece.
- Registrar un cliente y comprobar que aparece en la lista.
- Intentar registrar el mismo documento/correo/usuario.
- Eliminar un cliente.
- Enviar el formulario con teléfono inválido y luego válido.
