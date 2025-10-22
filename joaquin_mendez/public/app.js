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

    const btnLogin = document.getElementById('btn-login')
    if (btnLogin) {

        const elem = document.getElementById('medium-modal')
        const modal = new Modal(elem)

        btnLogin.addEventListener(
            'htmx:beforeRequest',
            (e) => {
                const rut_login = document.getElementById("rut_login").value;

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
                }

            },
        );
    }

    const helper = localStorage.getItem("valRut")

    document.getElementById("rut_h").value = helper


    //TODO limpiar localstorage cuando presiona el boton salir

});
