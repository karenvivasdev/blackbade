/* =========================================

/* =========================================
   ELEMENTOS
========================================= */

const btnServicios =
    document.getElementById("btnServicios");

const btnReserva =
    document.getElementById("btnReserva");

const modalServicios =
    document.getElementById("modalServicios");

const modalReserva =
    document.getElementById("modalReserva");

const cerrarServicios =
    document.getElementById("cerrarServicios");

const cerrarReserva =
    document.getElementById("cerrarReserva");

const btnReservarDesdeServicios =
    document.getElementById(
        "btnReservarDesdeServicios"
    );

const fecha =
    document.getElementById("fecha");

const horarios =
    document.querySelectorAll(
        ".horarios button"
    );

const continuarReserva =
    document.getElementById(
        "continuarReserva"
    );

const confirmarReserva =
    document.getElementById(
        "confirmarReserva"
    );

const paso1 =
    document.getElementById("paso1");

const paso2 =
    document.getElementById("paso2");

const selectorServicio =
    document.getElementById(
        "servicioSeleccionado"
    );


/* =========================================
   VARIABLES
========================================= */

let horarioSeleccionado = "";

let serviciosDisponibles = [];


/* =========================================
   CARGAR DATOS DESDE GOOGLE SHEETS
========================================= */

async function cargarDatos() {

    try {

        const respuesta =
            await fetch(API_URL);

        const datos =
            await respuesta.json();


        if (datos.error) {

            console.error(
                "Error de API:",
                datos.error
            );

            return;

        }


        serviciosDisponibles =
            datos.servicios.filter(
                servicio =>
                    String(
                        servicio.Activo
                    ).toLowerCase() === "sí" ||
                    String(
                        servicio.Activo
                    ).toLowerCase() === "si"
            );


        cargarServicios();


    } catch (error) {

        console.error(
            "No se pudieron cargar los datos:",
            error
        );

    }

}


/* =========================================
   CARGAR SERVICIOS
========================================= */

function cargarServicios() {

    /* -----------------------------------------
       SELECT DE RESERVA
    ----------------------------------------- */

    selectorServicio.innerHTML = `
        <option value="">
            Selecciona...
        </option>
    `;


    serviciosDisponibles.forEach(
        servicio => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                `${servicio.Servicio} - $${servicio.Precio}`;

            option.textContent =
                `${servicio.Servicio} — $${servicio.Precio}`;

            selectorServicio.appendChild(
                option
            );

        }
    );


    /* -----------------------------------------
       MODAL DE SERVICIOS
    ----------------------------------------- */

    const contenedor =
        document.querySelector(
            "#modalServicios .servicios"
        );


    if (!contenedor) {
        return;
    }


    contenedor.innerHTML = "";


    serviciosDisponibles.forEach(
        servicio => {

            const elemento =
                document.createElement(
                    "div"
                );

            elemento.className =
                "servicio";


            elemento.innerHTML = `

                <div>

                    <h3>
                        ${servicio.Servicio}
                    </h3>

                    <p>
                        Servicio disponible
                    </p>

                    <span>
                        ${servicio.Duracion} min
                    </span>

                </div>

                <strong>
                    $${servicio.Precio}
                </strong>

            `;


            contenedor.appendChild(
                elemento
            );

        }
    );

}


/* =========================================
   ABRIR SERVICIOS
========================================= */

btnServicios.addEventListener(
    "click",
    () => {

        modalServicios.classList.add(
            "activo"
        );

    }
);


/* =========================================
   CERRAR SERVICIOS
========================================= */

cerrarServicios.addEventListener(
    "click",
    () => {

        modalServicios.classList.remove(
            "activo"
        );

    }
);


/* =========================================
   ABRIR RESERVA
========================================= */

btnReserva.addEventListener(
    "click",
    () => {

        modalReserva.classList.add(
            "activo"
        );

    }
);


/* =========================================
   CERRAR RESERVA
========================================= */

cerrarReserva.addEventListener(
    "click",
    () => {

        modalReserva.classList.remove(
            "activo"
        );

    }
);


/* =========================================
   SERVICIOS → RESERVA
========================================= */

btnReservarDesdeServicios.addEventListener(
    "click",
    () => {

        modalServicios.classList.remove(
            "activo"
        );

        modalReserva.classList.add(
            "activo"
        );

    }
);


/* =========================================
   CERRAR MODAL HACIENDO CLICK AFUERA
========================================= */

modalServicios.addEventListener(
    "click",
    (e) => {

        if (
            e.target ===
            modalServicios
        ) {

            modalServicios.classList.remove(
                "activo"
            );

        }

    }
);


modalReserva.addEventListener(
    "click",
    (e) => {

        if (
            e.target ===
            modalReserva
        ) {

            modalReserva.classList.remove(
                "activo"
            );

        }

    }
);


/* =========================================
   FECHA MÍNIMA
========================================= */

const hoy = new Date();

const año =
    hoy.getFullYear();

const mes =
    String(
        hoy.getMonth() + 1
    ).padStart(2, "0");

const dia =
    String(
        hoy.getDate()
    ).padStart(2, "0");


fecha.min =
    `${año}-${mes}-${dia}`;


/* =========================================
   SELECCIONAR HORARIO
========================================= */

horarios.forEach(
    (boton) => {

        boton.addEventListener(
            "click",
            () => {

                horarios.forEach(
                    (b) => {

                        b.classList.remove(
                            "seleccionado"
                        );

                    }
                );


                boton.classList.add(
                    "seleccionado"
                );


                horarioSeleccionado =
                    boton.textContent.trim();

            }
        );

    }
);


/* =========================================
   CONTINUAR
========================================= */

continuarReserva.addEventListener(
    "click",
    () => {

        const servicio =
            selectorServicio.value;


        const fechaSeleccionada =
            fecha.value;


        if (!servicio) {

            alert(
                "Selecciona un servicio."
            );

            return;

        }


        if (!fechaSeleccionada) {

            alert(
                "Selecciona una fecha."
            );

            return;

        }


        if (!horarioSeleccionado) {

            alert(
                "Selecciona un horario."
            );

            return;

        }


        document.getElementById(
            "resumenServicio"
        ).textContent =
            servicio;


        const fechaFormateada =
            new Date(
                fechaSeleccionada +
                "T00:00:00"
            ).toLocaleDateString(
                "es-MX",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        document.getElementById(
            "resumenFecha"
        ).textContent =
            fechaFormateada;


        document.getElementById(
            "resumenHora"
        ).textContent =
            horarioSeleccionado;


        paso1.classList.add(
            "oculto"
        );


        paso2.classList.remove(
            "oculto"
        );

    }
);


/* =========================================
   CONFIRMAR RESERVA
========================================= */

confirmarReserva.addEventListener(
    "click",
    () => {


        const nombre =
            document.getElementById(
                "nombre"
            ).value.trim();


        const telefono =
            document.getElementById(
                "telefono"
            ).value.trim();


        const servicio =
            selectorServicio.value;


        const fechaSeleccionada =
            fecha.value;


        /* VALIDACIONES */

        if (!nombre) {

            alert(
                "Escribe tu nombre."
            );

            return;

        }


        if (!telefono) {

            alert(
                "Escribe tu teléfono."
            );

            return;

        }


        if (!servicio) {

            alert(
                "Selecciona un servicio."
            );

            return;

        }


        if (!fechaSeleccionada) {

            alert(
                "Selecciona una fecha."
            );

            return;

        }


        if (!horarioSeleccionado) {

            alert(
                "Selecciona un horario."
            );

            return;

        }


        /* =================================
           PREPARAR FORMULARIO
        ================================= */


        document.getElementById(
            "formNombre"
        ).value =
            nombre;


        document.getElementById(
            "formTelefono"
        ).value =
            telefono;


        document.getElementById(
            "formServicio"
        ).value =
            servicio;


        document.getElementById(
            "formFecha"
        ).value =
            fechaSeleccionada;


        document.getElementById(
            "formHora"
        ).value =
            horarioSeleccionado;


        /* =================================
           ENVIAR A GOOGLE SHEETS
        ================================= */

        document.getElementById(
            "formReserva"
        ).submit();


        /* =================================
           MOSTRAR CONFIRMACIÓN
        ================================= */

        mostrarReservaConfirmada({

            nombre:
                nombre,

            telefono:
                telefono,

            servicio:
                servicio,

            fecha:
                fechaSeleccionada,

            hora:
                horarioSeleccionado

        });

    }
);


/* =========================================
   CONFIRMACIÓN
========================================= */

function mostrarReservaConfirmada(
    datos
) {


    const modalContent =
        document.querySelector(
            "#modalReserva .modal-content"
        );


    const fechaBonita =
        new Date(
            datos.fecha +
            "T00:00:00"
        ).toLocaleDateString(
            "es-MX",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    modalContent.innerHTML = `

        <div class="confirmacion">


            <div class="check-confirmacion">

                <i class="bi bi-check-lg"></i>

            </div>


            <p class="modal-small">

                RESERVA CONFIRMADA

            </p>


            <h2>

                ¡Nos vemos pronto!

            </h2>


            <p class="mensaje-confirmacion">

                Tu cita ha sido registrada correctamente.

            </p>


            <div class="detalle-reserva">


                <div>

                    <span>
                        Cliente
                    </span>

                    <strong>
                        ${datos.nombre}
                    </strong>

                </div>


                <div>

                    <span>
                        Servicio
                    </span>

                    <strong>
                        ${datos.servicio}
                    </strong>

                </div>


                <div>

                    <span>
                        Fecha
                    </span>

                    <strong>
                        ${fechaBonita}
                    </strong>

                </div>


                <div>

                    <span>
                        Hora
                    </span>

                    <strong>
                        ${datos.hora}
                    </strong>

                </div>


            </div>


            <button
                class="btn-principal"
                onclick="location.reload()"
            >

                Listo

            </button>


        </div>

    `;

}


/* =========================================
   INICIAR SISTEMA
========================================= */

cargarDatos();