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