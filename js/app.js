const form = document.querySelector('#form');
const formCliente = document.querySelector('#formCliente');
let mostrarDatos = document.getElementById('fila-mostrar-datos');
let mostrarTotales = document.getElementById('mostrar-totales');
const datosCliente = document.querySelector('#datos-cliente');
const nuevaFacturacion = document.querySelector('#nueva-facturacion');
let guardarDatosCliente = [];
let guardarInformacion = [];
const inputs = document.querySelectorAll('#form input')
const inputsCliente = document.querySelectorAll('#formCliente input');
let contador = 0;

//expresiones regualares para validar la información introducida en los campos
const expresiones = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{3,50}$/, // Letras y espacios, pueden llevar acentos.    
    telefono: /^\d{1,10}$/, // 1 a 10 numeros.
}

const campos = {
    nombrePersona: false,
    apellidos: false,
    numDoc: false,
    telefono: false,
    nombre: false,
    porIva: false,
    precioConIva: false,
    cantidad: false
}

addEventListener('DOMContentLoaded', () => {
    $(document).ready(function () {
        $('#example').DataTable({
            responsive: true,
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla =(",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                },
                "buttons": {
                    "copy": "Copiar",
                    "colvis": "Visibilidad"
                }
            }
        });
    });
    if (localStorage.getItem('producto')) {
        guardarInformacion = JSON.parse(localStorage.getItem('producto'));
        mostrarVectores();
    }
    if (localStorage.getItem('cliente')) {
        guardarDatosCliente = JSON.parse(localStorage.getItem('cliente'));
        mostrarDatosCliente();
    }
    if (localStorage.getItem('contador')) {
        contador = JSON.parse(localStorage.getItem('contador'));
        guardarCliente();
    }
});

const validarFormulario = (e) => {
    switch (e.target.name) {
        case 'txtNombreCli':
            if (expresiones.nombre.test(e.target.value)) {
                campos['nombrePersona'] = true;
            } else {
                swal("Dato incorrecto!", "El valor introducido en el campo nombre producto es incorrecto. Intente nuevamente.", "error");
            }
            break;
        case 'txtApellidosCli':
            if (expresiones.nombre.test(e.target.value)) {
                campos['apellidos'] = true;
            } else {
                swal("Dato incorrecto!", "El valor introducido en el campo nombre producto es incorrecto. Intente nuevamente.", "error");
            }
            break;
        case 'txtNumDocCli':
            if (expresiones.telefono.test(e.target.value)) {
                campos['numDoc'] = true;
            } else {
                swal("Dato incorrecto!", "El valor introducido en el campo nombre producto es incorrecto. Intente nuevamente.", "error");
            }
            break;
        case 'txtTelefonoCli':
            if (expresiones.telefono.test(e.target.value)) {
                campos['telefono'] = true;
            } else {
                swal("Dato incorrecto!", "El valor introducido en el campo nombre producto es incorrecto. Intente nuevamente.", "error");
            }
            break;
        case 'txtNombreProd':
            if (expresiones.nombre.test(e.target.value)) {
                campos['nombre'] = true;
            } else {
                swal("Dato incorrecto!", "El valor introducido en el campo nombre producto es incorrecto. Intente nuevamente.", "error");
            }
            break;

        case 'txtPorIVA':
            if (expresiones.telefono.test(parseInt(e.target.value))) {
                campos['porIva'] = true;
            } else {
                swal("Dato incorrecto!", "El valor introducido en el campo porcentaje IVA producto es incorrecto. Intente nuevamente.", "error");
            }
            break;

        case 'txtPrecioIVA':
            if (expresiones.telefono.test(parseInt(e.target.value))) {
                campos['precioConIva'] = true;
            } else {
                swal("Dato incorrecto!", "El valor introducido en el campo precio producto con IVA es incorrecto. Intente nuevamente.", "error");
            }
            break;

        case 'txtCantidad':
            if (expresiones.telefono.test(parseInt(e.target.value))) {
                campos['cantidad'] = true;
            } else {
                swal("Dato incorrecto!", "El valor introducido en el campo cantidad producto es incorrecto. Intente nuevamente.", "error");
            }
            break;
    }
}

//les vamos a agregar un evento a cada uno de los inputs del formulario
inputs.forEach(input => {
    // input.addEventListener('keyup', validarFormulario)
    input.addEventListener('blur', validarFormulario);
})

inputsCliente.forEach(input => {
    // input.addEventListener('keyup', validarFormulario)
    input.addEventListener('blur', validarFormulario);
})

form.addEventListener('submit', e => {
    e.preventDefault();
    cargarVectores();
})

formCliente.addEventListener('submit', e => {
    e.preventDefault();
    guardarCliente();
})

mostrarDatos.addEventListener('click', e => {
    btnAccion(e);
})

nuevaFacturacion.addEventListener('click', () => {
    guardarInformacion = [];
    guardarDatosCliente = [];
    contador = 0;
    localStorage.removeItem('contador');
    mostrarVectores();
    mostrarDatosCliente();
    window.location.reload();
})

const guardarCliente = () => {
    if (campos.nombrePersona === false || campos.apellidos === false || campos.numDoc === false
        || campos.telefono === false) {
        swal("Datos incorrectos!", "Los datos introducidos en los campos son incorrectos. Intente nuevamente!", "error");
    } else {
        const nombreCliente = document.getElementById('txtNombreCli').value;
        const apellidoCliente = document.getElementById('txtApellidosCli').value;
        const numDocCliente = document.getElementById('txtNumDocCli').value;
        const telefonoCliente = document.getElementById('txtTelefonoCli').value;

        const datosCliente = {
            id: Date.now(),
            nombreCliente,
            apellidoCliente,
            numDocCliente,
            telefonoCliente
        }

        if (contador === 0) {
            contador = 1;
            localStorage.setItem('contador', JSON.stringify(contador))
            guardarDatosCliente.push(datosCliente);
            swal("Registro exitoso", `El cliente ${datosCliente.nombreCliente} ha sido registrado exitosamente :)`, "success");
            formCliente.reset();
            $('#agregar_cliente').modal("hide");//nos derigimos a la modal y lo ocultamos
            inputsCliente.forEach(input => input.setAttribute('disabled', 'disabled'));
            document.getElementById('boton-cliente').setAttribute('disabled', 'disabled');
            mostrarDatosCliente();
        } else {
            swal("Error", `No puede agregar más de un cliente para una misma facturación`, "warning");
            inputsCliente.forEach(input => input.setAttribute('disabled', 'disabled'));
            document.getElementById('boton-cliente').setAttribute('disabled', 'disabled');
            mostrarDatosCliente();
        }
    }
}
const mostrarDatosCliente = () => {
    localStorage.setItem('cliente', JSON.stringify(guardarDatosCliente));
    guardarDatosCliente.innerHTML = '';
    guardarDatosCliente.forEach(element => {
        datosCliente.innerHTML = `
            <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-dark">
                Nombre:
                <button type="button" class="btn btn-outline-dark">${element.nombreCliente}</button>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-warning"">
                Apellidos:
                <button type="button" class="btn btn-outline-dark">${element.apellidoCliente}</button>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-dark">
                Número de documento:
                <button type="button" class="btn btn-outline-dark">${element.numDocCliente}</button>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-warning"">
                Número de teléfono:
                <button type="button" class="btn btn-outline-dark">${element.telefonoCliente}</button>
            </li>
        `
    })
}

const cargarVectores = () => {

    if (campos.nombre === false || campos.porIva === false || campos.precioConIva === false || campos.cantidad === false) {
        swal("Datos incorrectos!", "Los datos introducidos en los campos son incorrectos. Intente nuevamente!", "error");
        return;
    } else {
        const nombreProducto = document.getElementById('txtNombreProd').value;
        let porcentajeIva = parseInt(document.getElementById('txtPorIVA').value);
        let precioConIva = parseInt(document.getElementById('txtPrecioIVA').value);
        const cantidadProducto = parseInt(document.getElementById('txtCantidad').value);

        let subtotalSinIva = 0;
        let precioBaseProducto = 0;
        let valorIvaProducto = 0;
        let totalConIvaProducto = 0;

        if (nombreProducto.length <= 0 || nombreProducto.trim() === '' || porcentajeIva === null || precioConIva === null || cantidadProducto === null) {
            swal("Campos vacios!", "Ningún campo puede estar vacio, todos son obligatorios. Intene nuevamente!", "warning");
            return;
        }

        if (porcentajeIva < 0 || porcentajeIva > 100) {
            swal("Campo incorrecto!", "El valor del campo porcentaje IVA debe ser un número entero entre 0 y 100. Intene nuevamente!", "warning");
            return;
        }

        if (precioConIva <= 0) {
            swal("Campo incorrecto!", "El valor del campo precio del producto con IVA, debe ser un número entero mayor a 0; no debe contener ni puntos ni comas. Intene nuevamente!", "warning");
            return;
        }
        if (cantidadProducto <= 0) {
            swal("Campo incorrecto!", "El valor del campo cantidad producto debe ser un número mayor a 0. Intene nuevamente!", "warning");
            return;
        }

        //operaciones
        //sacar el precio base del producto (precio sin iva)
        //1. Pasar el valor del iva a decimal
        porcentajeIva = (porcentajeIva / 100);
        /*
        Para calcular el valor del iva se debe dividir el valor total del producto (valor con iva),
        entre el valor del iva + 1
        */
        precioBaseProducto = (precioConIva / (porcentajeIva + 1));
        //sacar el valor del valor del iva
        valorIvaProducto = ((precioBaseProducto * porcentajeIva) * cantidadProducto);
        //subtotal sin iva
        subtotalSinIva = (precioBaseProducto * cantidadProducto);
        //sacar el total con iva
        totalConIvaProducto = (precioConIva * cantidadProducto);

        //crear el objeto que vamos a almacenar
        const valores = {
            id: Date.now(),
            nombre: nombreProducto,
            iva: porcentajeIva,
            precioIva: precioConIva,
            precioSinIva: precioBaseProducto,
            cantidad: cantidadProducto,
            subtotalSinIva: subtotalSinIva,
            valorIva: valorIvaProducto,
            totalConIva: totalConIvaProducto
        }
        //vamos a insertar los valores dentro del arreglo 
        guardarInformacion.push({ ...valores });
        swal("Registro exitoso", `El producto ${valores.nombre} ha sido registrado exitosamente :)`, "success");
        form.reset();
        // window.location.reload();
        $('#agregar_nomina').modal("hide");//nos derigimos a la modal y lo ocultamos
        mostrarVectores();
    }
}

const mostrarVectores = () => {

    localStorage.setItem('producto', JSON.stringify(guardarInformacion));
    /*
      * Darle formato de número a moneda
    */
    const formatterPeso = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    })
    mostrarDatos.innerHTML = '';
    guardarInformacion.forEach(element => {
        // console.log(element);        
        mostrarDatos.innerHTML += `
        <tr>
          <td>${element.id}</td>
          <td>${element.nombre}</td>
          <td>${(element.iva * 100)}%</td>
          <td>${formatterPeso.format(element.precioIva)}</td>
          <td>${formatterPeso.format(element.precioSinIva)}</td>
          <td>${element.cantidad}</td>
          <td>${formatterPeso.format(element.subtotalSinIva)}</td>
          <td>${formatterPeso.format(element.valorIva)}</td>
          <td>${formatterPeso.format(element.totalConIva)}</td>
          <td><span class="fas fa-trash text-center" role="button" data-id=${element.id}></span></td>
        </tr>`
        // console.log(mostrarDatos);
    })
    let subtotal = guardarInformacion.reduce((total, item) => {
        return total += item.subtotalSinIva;
    }, 0);

    let totalValorIva = guardarInformacion.reduce((total, item) => {
        return total += item.valorIva;
    }, 0);

    let totalAPagar = guardarInformacion.reduce((total, item) => {
        return total += item.totalConIva;
    }, 0);

    let cantidad = guardarInformacion.reduce((total, item) => {
        return total += item.cantidad;
    }, 0);

    subtotal = formatterPeso.format(subtotal);
    totalValorIva = formatterPeso.format(totalValorIva);
    totalAPagar = formatterPeso.format(totalAPagar);

    mostrarTotales.innerHTML = `
    <tr>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th>Total:</th>
        <th>${cantidad}</th>
        <th>${subtotal}</th>
        <th>${totalValorIva}</th>
        <th>${totalAPagar}</th>
        <th></th>
    </tr>
    `
}

const eliminarElemento = (arr, item) => {
    let i = arr.indexOf(item);

    if (i !== -1) {
        arr.splice(i, 1);
        swal("Producto eliminado correctamente.", {
            icon: "success",
        });
        mostrarVectores();
    }
}

const btnAccion = e => {
    // handleEdit(e.target.dataset.id);

    if (e.target.classList.contains('fa-trash')) {
        guardarInformacion.find(element => {
            if (element.id === parseInt(e.target.dataset.id)) {
                swal({
                    title: `Eliminar producto ${element.nombre}`,
                    text: `Esta seguro de eliminar el producto ${element.nombre}`,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            eliminarElemento(guardarInformacion, element);
                            mostrarVectores();
                        } else {
                            swal("No has eliminado el producto", "Sus datos estan ha salvo!", "success");
                        }
                    });
            }
        })
    }

    e.stopPropagation();
}