const regexNombre = /^[^\d]+$/;
const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const regexRut = /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/;

function validarRut(rutCompleto) {
    rutCompleto = rutCompleto.replace(/\./g, "").replace(/-/g, "");
    if (rutCompleto.length === 0) return false;
    const cuerpo = rutCompleto.slice(0, -1);
    const dv = rutCompleto.slice(-1).toUpperCase();
    if (cuerpo.length < 7) return false;

    // Calculo digito verificador
    let suma = 0;
    let factor = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i), 10) * factor;
        factor = (factor === 7) ? 2 : factor + 1;
    }
    const dvCalculado = 11 - (suma % 11);
    const dvFinal = (dvCalculado === 11)
        ? "0"
        : ((dvCalculado === 10) ? "K" : dvCalculado.toString());
    return dvFinal === dv;
}

document.addEventListener("DOMContentLoaded", () => {

    //sitio registro.html
    const btnRegistro = document.getElementById("btn-registro")
    if (btnRegistro) {
        btnRegistro.addEventListener(
            "htmx:beforeRequest",
            (e) => {
                const nombre = document.getElementById("nombre_completo").value;
                const email = document.getElementById("email").value;
                const rut = document.getElementById("rut").value;

                document.getElementById("nombreError").textContent = "";
                document.getElementById("correoError").textContent = "";
                document.getElementById("rutError").textContent = "";

                let formValido = true;

                if (!regexNombre.test(nombre)) {
                    document.getElementById("nombreError").textContent =
                        "El nombre no debe contener números.";
                    formValido = false;
                }

                if (!regexRut.test(rut) || !validarRut(rut)) {
                    document.getElementById("rutError").textContent = "El RUT es invalido.";
                    formValido = false;
                }

                if (!regexEmail.test(email)) {
                    document.getElementById("correoError").textContent =
                        "El correo no tiene el formato correcto.";
                    formValido = false;
                }

                if (!formValido) {
                    e.preventDefault();
                }
            },
        );
    }

    //sitio login.html

    //TODO agregar afterswap para que rescate despues que renderize el form
    const btnLogin = document.getElementById('btn-login')
    if (btnLogin) {


        const elem = document.getElementById('medium-modal')
        const modal = new Modal(elem)

        btnLogin.addEventListener(
            'htmx:beforeRequest',
            (e) => {

                document.body.addEventListener("htmx:afterSwap", () => {
                    const rut_login = document.getElementById("rut_login").value;
                    const helper = document.getElementById("assist_h").value;
                    //if (helper) {
                    //helper.value = 
                    //}

                    document.getElementById("rut_loginError").textContent = "";

                    let formValido = true;

                    if (!regexRut.test(rut_login) || !validarRut(rut_login)) {
                        document.getElementById("rut_loginError").textContent =
                            "El RUT es invalido.";
                        formValido = false;
                    }

                    if (!formValido) {
                        e.preventDefault();
                    } else {
                        modal.show();
                        localStorage.setItem("valRut", rut_login)

                        //[x]TODO revisar si guardar al momento de validar o el login
                        localStorage.setItem("help", helper)
                    }

                })
            },
        );
    }

    //sitio asistencia.html

    const ingreso = document.getElementById("btn-i")
    const salida = document.getElementById("btn-s")
    if (ingreso && salida) {
        const estado = localStorage.getItem("help")
        if (estado === "I") {
            ingreso.disabled = true
            ingreso.classList.remove("hover:bg-emerald-800")

            ingreso.classList.remove("bg-emerald-700")
            ingreso.classList.add("bg-emerald-950")
        } else if (estado === "S") {
            salida.disabled = true
            salida.classList.remove("hover:bg-red-800")

            salida.classList.remove("bg-red-700")
            salida.classList.add("bg-red-950")
        } else {
            salida.disabled = true
            salida.classList.remove("hover:bg-red-800")
        };

        const toast = document.getElementById("toast-success")
        ingreso.addEventListener("click", () => {

            toast.classList.remove("hidden")
            setTimeout(() => {
                ingreso.disabled = true
                ingreso.classList.remove("hover:bg-emerald-800")
                salida.disabled = false
                salida.classList.add("hover:bg-red-800")
                toast.classList.add("hidden")
            }, 3000)
        })
        salida.addEventListener("click", () => {

            toast.classList.remove("hidden")
            setTimeout(() => {
                ingreso.disabled = false
                ingreso.classList.add("hover:bg-emerald-800")
                salida.disabled = true
                salida.classList.remove("hover:bg-red-800")
                toast.classList.add("hidden")
            }, 3000)
        })


    }

    const helper_r = localStorage.getItem("valRut")
    const rut_h = document.getElementById("rut_h")

    if (rut_h) {
        rut_h.value = helper_r
    }
    //document.getElementById("rut_h").value = helper_r


    //[x]TODO limpiar localstorage cuando presiona el boton salir
    const btnSalir = document.getElementById("cerrar_session")
    if (btnSalir) {
        btnSalir.addEventListener("click", () => {
            //localStorage.removeItem("valRut")
            localStorage.clear()
            window.location.href = "login.html"
        })
    }

});
