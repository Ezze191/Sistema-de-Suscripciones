 Sistema de Gestión de Suscripciones
Este sistema fue desarrollado con React en el frontend y Laravel 10 en el backend, mediante el consumo de APIs.

Su propósito es gestionar eficientemente las suscripciones internas de Milenio, facilitando el control y permitiendo exportar cupones en formato PDF para un mejor seguimiento.

 Pantalla Principal
<img width="1917" height="1039" alt="Home" src="https://github.com/user-attachments/assets/e0516399-204c-4fff-a56e-c447d321729f" />
En esta vista se muestra:

Un apartado para seleccionar rangos de fecha y vigencia, lo que actualiza las suscripciones y genera un folio autoincrementable.

Un botón para agregar nuevas suscripciones mediante un formulario con los campos requeridos.

 Agregar Suscripción
<img width="307" height="1039" alt="Agregar" src="https://github.com/user-attachments/assets/2d9ab243-78cc-41dd-8d17-7ff2f4bb8a45" />
Formulario para registrar una nueva suscripción con los datos necesarios.

 Editar Suscripción
<img width="307" height="1039" alt="Actualizar" src="https://github.com/user-attachments/assets/e2de0651-b414-47e3-b0ec-bfc426a9dbb5" />
Vista para editar los datos de una suscripción previamente registrada. Permite modificar campos específicos y guardar los cambios.

 Exportación de Datos
En la parte inferior de la pantalla principal se encuentran dos botones:

Exportar a PDF: Abre la pantalla de personalización del cupón PDF.

Exportar a Excel: Descarga la tabla completa de suscripciones visibles en la página principal.

 Exportación a PDF
<img width="1919" height="1039" alt="PDF" src="https://github.com/user-attachments/assets/da39efed-e1ec-4188-ad5e-838d92634e2e" />
Antes de generar el PDF, puedes:

Ingresar una leyenda personalizada para el cupón.

Elegir si deseas mostrar la vigencia.

 Vista del PDF Generado
<img width="1919" height="1039" alt="pdfSuscriptions" src="https://github.com/user-attachments/assets/aae7fa8a-9c7a-428e-aed1-1e0ddbcac843" />
Así se visualizan los cupones en el PDF generado:

Cada hoja incluye 3 cupones, mostrando la información requerida y la leyenda personalizada (si fue añadida).

 Funciones Principales
Gestión completa de suscripciones: agregar, editar y eliminar.

Filtros por fecha y vigencia.

Generación automática de folios.

Exportación a Excel y PDF totalmente personalizable.
