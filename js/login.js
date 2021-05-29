const form = document.querySelector('#form');
const inputs = document.querySelectorAll('#form input');
const boton = document.querySelector('.boton_ingresar');
let contador = 0;

form.addEventListener('submit', e => {
    e.preventDefault();

    if (inputs[0].value === "" || inputs[1].value === "") {
        swal("Campos vacios!", "Campos vacios, por favor intente nuevamente.", "error");
    }

    if (inputs[0].value === "Administrador" && inputs[1].value === "administrador") {
        location.href = 'index.html';
    } else {
        swal("Datos incorrectos!", "Los datos ingresados son incorrectos, por favor intente nuevamente.", "warning");
        contador++;
        console.log(contador);
        form.reset();

        if (contador === 3) {
            swal("Número de intentos excedidos!", "Ha ingresado sus credenciales 3 veces de forma incorrecta incorrectas. Espere 1 minuto para que lo vuelva a intentar.", "error");
            timer()
            inputs.forEach(input => input.setAttribute('disabled', 'disabled'));
            boton.setAttribute('disabled', 'disabled');

            setTimeout(() => {
                inputs.forEach(input => input.removeAttribute('disabled')); //el atributo
                boton.removeAttribute('disabled'); //el atributo
                contador = 0;
            }, 60000)

        } else {
            inputs.forEach(input => input.removeAttribute('disabled')); //el atributo
            boton.removeAttribute('disabled'); //el atributo
        }
    }
})

const timer = () => {
    let segundosTotales = 60;

    setInterval(() => {
        if (segundosTotales >= 0) {
            console.log(segundosTotales--);
        }
    }, 1000)
}

const validarFormulario = (input) => {
    if (input.value === "") {
        swal("Campos vacios!", "Campos vacios, por favor intente nuevamente.", "error");
    }

}

inputs.forEach(input => {
    input.addEventListener('blur', () => validarFormulario(input));
})