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

    if (nombreProducto.trim() === '' || porcentajeIva === '' || precioConIva === '' || cantidadProducto === '') {
        swal("Campos vacios!", "Se debe completar todos los campos!", "warning");
        return;
    }

    if (porcentajeIva < 0 || porcentajeIva > 100) {
        swal("Dato incorrecto!", "El porcentaje del IVA debe ser un número entre 0 y 100!", "error");
        return;
    }

    if (precioConIva < 0) {
        swal("Dato incorrecto!", "El precio del producto debe ser un valor mayor a 0.", "error");
        return;
    }

    if (cantidadProducto < 0) {
        swal("Dato incorrecto!", "La cantidad del producto debe ser mayor a 0.", "error");
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
          <td>$${element.precioSinIva}</td>
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
    if (e.target.classList.contains('fa-edit')) {
        $('#agregar_nomina').modal("hide");
    }

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
                            guardarInformacion.splice(element, 1);
                            swal("Producto eliminado correctamente.", {
                                icon: "success",
                            });
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