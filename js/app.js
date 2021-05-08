const form = document.querySelector('#form');
let mostrarDatos = document.getElementById('fila-mostrar-datos');
let guardarInformacion = [];
// console.log(guardarInformacion);
let subtotalSinIva;
let precioBaseProducto;
let valorIvaProducto;
let totalConIvaProducto;

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
    }
    mostrarVectores();
});

form.addEventListener('submit', e => {
    e.preventDefault();
    cargarVectores();
})

mostrarDatos.addEventListener('click', e => {
    btnAccion(e);
})

// const realizarCalculos = () => {
//     //sacar el precio base del producto (precio sin iva)
//     //1. Pasar el valor del iva a decimal
//     porcentajeIva = (porcentajeIva / 100);
//     /*
//     Para calcular el valor del iva se debe dividir el valor total del producto (valor con iva),
//     entre el valor del iva + 1
//     */
//     precioBaseProducto = (precioConIva / (porcentajeIva + 1));
//     //sacar el valor del valor del iva
//     valorIvaProducto = (precioConIva - precioBaseProducto);
//     //subtotal sin iva
//     subtotalSinIva = (precioBaseProducto * cantidadProducto);
//     //sacar el total con iva
//     totalConIvaProducto = (precioConIva * cantidadProducto);
// }

const cargarVectores = () => {
    const nombreProducto = document.getElementById('txtNombreProd').value;
    let porcentajeIva = parseInt(document.getElementById('txtPorIVA').value);
    const precioConIva = parseInt(document.getElementById('txtPrecioIVA').value);
    const cantidadProducto = parseInt(document.getElementById('txtCantidad').value);

    if (nombreProducto === '' || porcentajeIva === '' || precioConIva === '' || cantidadProducto === '') {
        console.log('Campos vacios');
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
    valorIvaProducto = (precioConIva - precioBaseProducto);
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
        cantidad: cantidadProducto,
        subtotalSinIva: subtotalSinIva,
        valorIva: valorIvaProducto,
        totalConIva: precioConIva
    }
    //vamos a insertar los valores dentro del arreglo 
    guardarInformacion.push({ ...valores });
    form.reset();
    $('#agregar_nomina').modal("hide");//nos derigimos a la modal y lo ocultamos
    mostrarVectores();
}

const mostrarVectores = () => {

    localStorage.setItem('producto', JSON.stringify(guardarInformacion));

    mostrarDatos.innerHTML = '';
    guardarInformacion.forEach(element => {
        // console.log(element);        
        mostrarDatos.innerHTML += `
        <tr>
          <td>${element.id}</td>
          <td>${element.nombre}</td>
          <td>${(element.iva * 100)}%</td>
          <td>$${element.precioIva}</td>
          <td>${element.cantidad}</td>
          <td>$${element.subtotalSinIva}</td>
          <td>$${element.valorIva}</td>
          <td>$${element.totalConIva}</td>
          <td><span class="fas fa-edit" role="button" data-id=${element.id}></span> | <span class="fas fa-trash" role="button" data-id=${element.id}></span></td>
        </tr>`
        // console.log(mostrarDatos);
    })
}

const btnAccion = e => {

    $('#agregar_nomina').modal("hide");
}