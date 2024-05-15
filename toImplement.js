/*
Crear una función para que cuando se deje de hacer resize, pille el último valor
y entonces ahí mande una consulta al servidor, para evitar que se hagan muchas consultas 

var resizeando = false;

    $(document).on('mousedown', '.ui-resizable-handle', function () {
        resizeando = true;
    });

    // Escuchar el evento mouseup en el documento para detectar el final de la redimensión
    $(document).on('mouseup', function () {
        if (resizeando) {
            // Lógica a ejecutar después de soltar el mouse al terminar la redimensión
            console.log('Se ha terminado de redimensionar');
            // Por ejemplo, puedes llamar a una función que realice alguna acción específica
            // actualizarTamaño(elemento, tipo);
            resizeando = false; // Restablecer la bandera de redimensionamiento
        }
    });

    */



/* 

anyadir opcion Ctrl + Z para deshacer la ultima accion
con ui-draggable-dragging

*/




/* 
PARA DETECTAR CANTIDAD DE ELEMENTOS QUE HAY EN LA PÁGINA WEB, EN ESTE CASO LOS AP

const allAp = document.querySelectorAll(".ap");
  const nrAp = allAp.length;
  $('#layoutAp').text(nrAp);

  layoutElements = {
    nrAp: nrAp,
    nrIsletas: nrSubGrid,
    nrEtiquetas: nrAllWidgets,
    nrEtiquetas42: nrWidgets42,
    nrEtiquetas75: nrWidgets75
  }

*/


/*

detector de raton y modificacion en tiempo real respecto la posición del ratón

 var icono = document.getElementById('icono');
    var contenedor = document.getElementById('body')

    // Función para actualizar la posición del icono
    function actualizarPosicion(event) {
        icono.style.display = 'block'; // Muestra el icono
        icono.style.left = event.clientX + 'px';
        icono.style.top = event.clientY + 'px';
    }

    // Función de animación
    

    $(document).on('mousemove scroll', function(event) {
        console.log("faaaa")
        // Actualizar la posición del icono relativa a las coordenadas del contenedor
        var rect = contenedor.getBoundingClientRect();
        var offsetX = event.clientX - rect.left;
        var offsetY = event.clientY - rect.top;
        icono.style.display = 'block'; // Mostrar el icono
        icono.style.left = offsetX + 'px'; // Ajustar la posición horizontal del icono
        icono.style.top = offsetY + 'px'; // Ajustar la posición vertical del icono
    });





    */