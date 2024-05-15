document.addEventListener("DOMContentLoaded", function () {

    //VARIABLES para saber el ID del último elemento activado 
    var idZonaActiva = null;
    var idIsletaActiva = null;
    var idEtiquetaActiva = null;
    var idApActivo = null;

    //Variables para el dom
    var formIsleta = document.getElementById("isletaForm");
    var formEtiqueta = document.getElementById("etiquetaForm");
    var formAP = document.getElementById("apForm");
    var formZona = document.getElementById("zonaForm");

    //Variables de patrones
    var regex = /\((.*?)\)/;

    //Variables array
    var aps_array = []
    var isletas_array = []
    var etiquetas_array = []
    var zona_array = []

    var borrando = null
    var editando = null
    var bloqueando = null


    var permitirBorradoEtiqueta = false
    var permitirBorradoIsleta = false

    var elementoConZIndexMasAlto = null;
    var elem = document.documentElement;
    var requestFullScreen = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;
    var exitFullScreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;


    //PARA MAXIMIZAR LA VENTANA Y OPTIMIZAR EL ESPACIO

    function estadoHerramientas(borrado, editado, bloqueo) {
        if (borrado) {
            borrando = false;
            $('.activarBorrado')
                .css({
                    'background-color': 'transparent'

                })
        }
        if (editado) {
            editando = false;
            $('.activarEditado')
                .css({
                    'background-color': 'transparent'

                })
        }
        if (bloqueo) {
            bloqueando = false;
            $('.activarBloqueo')
                .css({
                    'background-color': 'transparent'

                })
        }


    }
    //FUNCIONES PARA ACTUALIZAR LOS ID DE LOS ELEMENTOS ACTIVOS
    function borrarIsleta(isletaId) {

        var isletaPrefijo = $('#' + isletaId).find('p').text().match(/\((.*?)\)/)[1];
        var isletaNombre = $('#' + isletaId).find('p').text().split("(")[0];

        Swal.fire({
            title: "Borrar la isleta " + isletaNombre + " " + isletaPrefijo + "?",
            text: "NO SE PUEDE DESHACER",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, borralo"
        }).then((result) => {
            if (result.isConfirmed) {
                idIsletaABorrar = isletaId.substring(1);
                console.log(idIsletaABorrar)
                $.ajax({
                    url: "php/conexion.php",
                    type: "POST",
                    data: {
                        option: "DELETE",
                        tipo: "isleta",
                        id: idIsletaABorrar
                    },
                    success: function (response) {
                        if (!($('#' + isletaId).closest('.isleta').attr('id'))) {
                            $('#z' + document.closest('.zona').attr('id')).css({
                                minHeight: "0px",
                                minWidth: "0px"
                            })
                        }
                        $('#' + isletaId).remove();
                        idIsletaActiva = $('.isleta').attr('id');
                        etiquetas_array = etiquetas_array.filter(etiqueta => etiqueta.id_isleta != idIsletaABorrar)
                        isletas_array = isletas_array.filter(isleta => isleta.id != idIsletaABorrar)
                        estadoBotones();
                        actualizarNavbar();
                        $.toast({
                            heading: 'Se ha eliminado correctamente',
                            showHideTransition: 'plain',
                            icon: 'success'
                        })
                    },
                    error: function (xhr, status, error) {
                        console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
                    }
                });
                // Aquí puedes agregar la lógica para eliminar la isleta con el ID isletaId
                console.log('Borrar isleta con ID:', isletaId);


            } else {
                $.toast({
                    heading: 'Error',
                    text: 'No se ha podido borrar el elemento, inténtelo de nuevo',
                    icon: 'error'
                })
            }
        });


    }

    function borrarEtiqueta(etiquetaId) {
        idIsletaActiva = $(etiquetaId).closest('.isleta').attr('id');
        var idIsleta = null
        if (idIsletaActiva != null) {
            idIsleta = idIsletaActiva.substring(1)
        } else {
            idIsleta = $("#" + etiquetaId).closest('.isleta').attr('id').substring(1)
            idIsletaActiva = idIsleta
        }

        if (etiquetaId != null) {
            etiquetaId = etiquetaId.substring(1)
        }

        alertify.confirm('Está seguro que quiere borrar el elemento?', 'No se puede deshacer'
            , function () {
                $.ajax({
                    url: "php/conexion.php",
                    type: "GET",
                    data: {
                        option: "EliminarEtiqueta",
                        id_isleta: idIsleta,
                        id: etiquetaId
                    },
                    success: function (response) {
                        idIsletaActiva = "i" + idIsleta;
                        $('#e' + etiquetaId).remove();
                        $('#i' + idIsleta).find('.etiqueta').remove();
                        idEtiquetaActiva = null;
                        $.ajax({
                            url: "php/conexion.php",
                            type: "GET",
                            data: {
                                option: "GetEtiquetasByIsletaID",
                                tipo: "etiqueta",
                                id_isleta: idIsleta,
                            },
                            success: function (etiquetas) {
                                etiquetas_array = [];
                                idIsletaActiva = "i" + idIsleta;
                                var etiquetasInfo = JSON.parse(etiquetas);
                                etiquetasInfo.forEach(function (etiqueta) {
                                    var etiquetaAInsertar = $("<div class='etiqueta' id='e" + etiqueta.id + "'><p>" + etiqueta.nombre + "<br>(" + etiqueta.prefijo + "-" + etiqueta.posicion + ")</p></div>");
                                    var mainContentWidth = $("#i" + idIsleta).width();
                                    var mainContentHeight = $("#i" + idIsleta).height();
                                    $("#i" + idIsleta).append(etiquetaAInsertar);
                                    etiquetaAInsertar.css({
                                        'display': 'flex',
                                        'flex-direction': 'column',
                                        'position': 'absolute',
                                        'left': etiqueta.x + "px",
                                        'top': etiqueta.y + "px",
                                        maxHeight: mainContentHeight,
                                        maxWidth: mainContentWidth,
                                        'border': '2px solid yellow',
                                        'border-radius': '5px',
                                    }).draggable({
                                        containment: "#i" + idIsleta
                                    });
                                    etiquetas_array.push(etiqueta);
                                });
                            },
                            error: function (xhr, status, error) {
                                console.log(error);
                            }
                        });
                        actualizarNavbar();

                        $.toast({
                            heading: 'Se ha eliminado correctamente',
                            showHideTransition: 'plain',
                            icon: 'success'
                        })
                    }, error: function (xhr, status, error) {
                        console.log(error)
                    }
                })
            },
            function () {
                $.toast({
                    heading: 'Error',
                    text: 'No se ha podido borrar el elemento, inténtelo de nuevo',
                    icon: 'error'
                })

            });


    }

    function borrarAP(apId) {
        alertify.confirm('Está seguro que quiere borrar el elemento?', 'No se puede deshacer'
            , function () {


                $.ajax({
                    url: "php/conexion.php",
                    type: "POST",
                    data: {
                        option: "DELETE",
                        tipo: "ap",
                        id: apId.substring(2)
                    },
                    success: function (response) {
                        $('#' + apId).remove();
                        idApActivo = null;
                        $.toast({
                            heading: 'Éxito',
                            text: 'Se ha borrado correctamente el ap',
                            icon: 'success'
                        })
                        actualizarNavbar();
                        estadoBotones();
                    },
                    error: function (xhr, status, error) {
                        console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
                    }
                });


            }
            , function () {
                $.toast({
                    heading: 'Error',
                    text: 'No se ha podido borrar el elemento, inténtelo de nuevo',
                    icon: 'error'
                })
            });

    }

    function estadoBotones() {
        if (idZonaActiva == null) {
            $('#añadirIsleta').prop('disabled', true);
            $('#añadirEtiqueta').prop('disabled', true);
            $('#añadirAP').prop('disabled', true);
        } else if (idIsletaActiva == null) {
            $('#añadirIsleta').prop('disabled', false);
            $('#añadirEtiqueta').prop('disabled', true);
            $('#añadirAP').prop('disabled', false);
        } else {
            $('#añadirIsleta').prop('disabled', false);
            $('#añadirEtiqueta').prop('disabled', false);
            $('#añadirAP').prop('disabled', false);
        }
    }

    function actualizarNavbar() {
        const allAp = document.querySelectorAll(".ap");
        const cAp = allAp.length;
        $('#cantidadAPS').text("APs: " + cAp);

        const allEtiquetas = document.querySelectorAll(".etiqueta");
        const cantidadEtiquetas = allEtiquetas.length;
        if (cantidadEtiquetas == 0) {
            $('#cantidadEtiquetas').text("ETEs: " + etiquetas_array.length);
        } else {
            $('#cantidadEtiquetas').text("ETEs: " + cantidadEtiquetas);
        }

        const allisletas = document.querySelectorAll(".isleta");
        const cantidadIsletas = allisletas.length;
        $('#cantidadIsletas').text("Isletas: " + cantidadIsletas);

    }

    function mostrarZona(idZona) {
        Swal.close();
        etiquetas_array = [];
        isletas_array = [];
        aps_array = [];
        // Quitamos la "z" de el id de la zona zXX -> XX
        var idZonaAMostrar = idZona.substring(1);
        // Vaciamos el contenedor central de cualquier elemento
        $('.containerCentral').empty();

        // Obtenemos las isletas respecto de la zona
        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "getIsletasByZonaID",
                id_zona: idZonaAMostrar,
            },
            success: function (Isletas) {
                var isletasArray = JSON.parse(Isletas);
                isletas_array = isletasArray;
                console.log(isletasArray)
                // Obtenemos la zona a mostrar
                $.ajax({
                    url: "php/conexion.php",
                    type: "GET",
                    data: {
                        option: "GetZonaByID",
                        id_zona: idZonaAMostrar,
                    },
                    success: function (Zona) {
                        var infoZona = JSON.parse(Zona);
                        zona_array = infoZona;
                        var zona = $("<div class='zona zonaActiva' id='z" + idZonaAMostrar + "'></div>");
                        var mainContentWidth = $(".containerCentral").width();
                        var mainContentHeight = $(".containerCentral").height();
                        $(".containerCentral").append(zona);
                        idZonaActiva = "z" + idZonaAMostrar;

                        $('#nombrePlanoNavbar').text("Plano: " + infoZona[0].nombre);

                        zona
                            .css({
                                'width': infoZona[0].width + "px",
                                'height': infoZona[0].height + "px",
                            })
                            .resizable({
                                containment: ".containerCentral",
                                width: mainContentWidth,
                                height: mainContentHeight,
                            })
                        isletasArray.forEach(isleta => {
                            var ancho = 0
                            var alto = 0
                            var isletaACrear = $("<div class='isleta' id='i" + isleta.id + "'><p>" + isleta.nombre + "(" + isleta.prefijo + ")</p></div>");
                            idIsletaActiva = "i" + isleta.id;
                            if (isleta.redonda == 1) {
                                var isletaACrear = $("<div class='isleta' id='i" + isleta.id + "'><p>" + isleta.nombre + "(" + isleta.prefijo + ")</p></div>");
                                isletaACrear.css({
                                    'border-radius': '50%',
                                    'overflow': 'visible',
                                })
                            }
                            isletaACrear
                                .css({
                                    'left': isleta.x + "px",
                                    'top': isleta.y + "px",
                                    'width': isleta.width + "px",
                                    'height': isleta.height + "px",
                                    'position': 'absolute'
                                })
                                .draggable({
                                    containment: ".zona"
                                })
                                .resizable({
                                    containment: ".zona",
                                    maxWidth: $(".zona").width(),
                                    maxHeight: $(".zona").height(),
                                    minWidth: 100,
                                    minHeight: 100
                                })

                            if ((isleta.x + isleta.width > ancho)) {
                                ancho = isleta.x + isleta.width + 30
                            }
                            if ((isleta.y + isleta.height > alto)) {
                                alto = isleta.y + isleta.height + 30
                            }

                            $('#z' + idZonaAMostrar).css({
                                minHeight: alto,
                                minWidth: ancho
                            })




                            $("#z" + idZonaAMostrar).append(isletaACrear);

                            // Obtenemos las etiquetas asociadas a la isleta

                            $.ajax({
                                url: "php/conexion.php",
                                type: "GET",
                                data: {
                                    option: "GetEtiquetasByIsletaID",
                                    tipo: "etiqueta",
                                    id_isleta: isleta.id,
                                },
                                success: function (etiquetas) {
                                    idIsletaActiva = "i" + isleta.id;
                                    var etiquetasInfo = JSON.parse(etiquetas);
                                    etiquetasInfo.forEach(function (etiqueta) {
                                        var etiquetaAInsertar = $("<div class='etiqueta' id='e" + etiqueta.id + "'><p>" + etiqueta.nombre + "<br>(" + etiqueta.prefijo + "-" + etiqueta.posicion + ")</p></div>");
                                        var mainContentWidth = $("#i" + isleta.id).width();
                                        var mainContentHeight = $("#i" + isleta.id).height();
                                        $("#i" + isleta.id).append(etiquetaAInsertar);
                                        etiquetaAInsertar.css({
                                            'display': 'flex',
                                            'flex-direction': 'column',
                                            'position': 'absolute',
                                            'left': etiqueta.x + "px",
                                            'top': etiqueta.y + "px",
                                            maxHeight: mainContentHeight,
                                            maxWidth: mainContentWidth,
                                            'border': '2px solid yellow',
                                            'border-radius': '5px',
                                        }).draggable({
                                            containment: "#i" + isleta.id
                                        });
                                        etiquetas_array.push(etiqueta);

                                    });
                                },
                                error: function (xhr, status, error) {
                                    console.log(error);
                                }
                            });

                            //


                        });

                        if (isletasArray.length == 0) {
                            idIsletaActiva = null;
                        }


                        $('#z' + idZonaAMostrar).addClass("zonaActiva");
                        $.ajax({
                            url: "php/conexion.php",
                            type: "GET",
                            data: {
                                option: "GetAPByZonaID",
                                id_zona: idZonaAMostrar,
                            },
                            success: function (response) {
                                var aps = JSON.parse(response);
                                aps.forEach(ap => {
                                    var apACrear = $("<div class='ap' id='ap" + ap.id + "'><p>" + ap.nombre + "</p></div>");
                                    var mainContentWidth = $("#z" + idZonaAMostrar).width();
                                    var mainContentHeight = $("#z" + idZonaAMostrar).height();
                                    $("#z" + idZonaAMostrar).append(apACrear);
                                    apACrear
                                        .css({
                                            'position': 'absolute',
                                            'display': 'flex',
                                            'flex-direction': 'column',
                                            'border': '2px solid blue',
                                            'border-radius': '50%',
                                            "height": "50px",
                                            "width": "50px",
                                            'left': ap.x + "px",
                                            'top': ap.y + "px",
                                            maxHeight: mainContentHeight,
                                            maxWidth: mainContentWidth,
                                        })
                                        .draggable({
                                            containment: "#z" + idZonaAMostrar,
                                        });
                                });
                                estadoBotones();

                            },
                            error: function (xhr, status, error) { }
                        });
                        estadoBotones();
                    },
                    error: function (xhr, status, error) {
                        reject(error);
                    }
                });
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
        setTimeout(function () {
            actualizarNavbar();
        }, 150);
    }

    //ACTUALIZA LOS ELEMENTOS DE EL CUADRO DERECHO CON LAS ZONAS EXISTENTES
    function getZonas() {
        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "GETALL",
                tipo: "zona",
            },
            success: function (response) {
                $('.planos-popup').empty()
                var zonasInfo = JSON.parse(response);
                $(".planos-popup").append("<ul class='list-group' id='zonas'></ul>");
                zonasInfo.forEach(zona => {
                    var zonaEstructura = $("<div class='d-flex flex-column'><li class='list-group-item'><p class='zonasDerecha' style='font-size: 20px; height: 50px; display: flex; align-items: center;'><a class='mostrarZona" + zona.id + "'><i class='fa-solid fa-eye' ></i></a>" + zona.nombre + " <a class='eliminarZona ms-3' id='eliminarZona-" + zona.id + "'><i class='fa-solid fa-xmark' id='eliminarZonaDerecha'></i></a></p></li></div>");
                    $("#zonas").append(zonaEstructura);
                });
            }
        });
    }

    $(document).on('click', '.containerCentral', function (event) {
        // Obtener todos los elementos en el punto del clic
        var elementos = document.elementsFromPoint(event.clientX, event.clientY);
        var zIndexMasAlto = -Infinity;

        // Iterar sobre los elementos y encontrar el que tenga el zIndex más alto
        elementos.forEach(function (elemento) {
            // Obtener el zIndex del elemento actual
            var zIndex = parseInt($(elemento).css('zIndex'));

            // Verificar si el zIndex es válido y mayor que el actual máximo
            if (!isNaN(zIndex) && zIndex > zIndexMasAlto) {
                zIndexMasAlto = zIndex;
                elementoConZIndexMasAlto = elemento;
            }
        });
        console.log($(this))
        if (elementoConZIndexMasAlto.id.substring(0, 1) == "e") {
            $('#'+elementoConZIndexMasAlto.id).closest('.isleta').addClass('isletaActiva')
            permitirBorradoEtiqueta = true;
            $("#" + elementoConZIndexMasAlto.id).trigger('click');
        } else if (elementoConZIndexMasAlto.id.substring(0, 1) == "i") {
            $('#' + elementoConZIndexMasAlto.id).addClass('isletaActiva')
            permitirBorradoIsleta = true;
            $("#" + elementoConZIndexMasAlto.id).trigger('click');
        }
        elementoConZIndexMasAlto == null;

        // Mostrar el elemento con el zIndex más alto
        console.log("Elemento con el zIndex más alto:", elementoConZIndexMasAlto);
    });

    $(document).on('touchstart', '.containerCentral', function (event) {
        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
        var posX = touch.clientX;
        var posY = touch.clientY;
        var elementos = document.elementsFromPoint(posX, posY);

        // Inicializar variables para el elemento con mayor zIndex

        var zIndexMasAlto = -Infinity;

        // Iterar sobre los elementos y encontrar el que tenga el zIndex más alto
        elementos.forEach(function (elemento) {
            // Obtener el zIndex del elemento actual
            var zIndex = parseInt($(elemento).css('zIndex'));

            // Verificar si el zIndex es válido y mayor que el actual máximo
            if (!isNaN(zIndex) && zIndex > zIndexMasAlto) {
                zIndexMasAlto = zIndex;
                elementoConZIndexMasAlto = elemento;
            }
        });
        if (elementoConZIndexMasAlto.id.substring(0, 1) == "e") {
            $('#'+elementoConZIndexMasAlto.id).closest('.isleta').addClass('isletaActiva')
            $('#' + idIsletaActiva).removeClass('isletaActiva')
            permitirBorradoEtiqueta = true;
            $("#" + elementoConZIndexMasAlto.id).trigger('click');
        } else if (elementoConZIndexMasAlto.id.substring(0, 1) == "i") {
            $('#' + elementoConZIndexMasAlto.id).addClass('isletaActiva')
            permitirBorradoIsleta = true;
            $("#" + elementoConZIndexMasAlto.id).trigger('click');
        }
        elementoConZIndexMasAlto == null;

        // Mostrar el elemento con el zIndex más alto
        console.log("Elemento con el zIndex más alto:", elementoConZIndexMasAlto);
    });

    $(document).on('touchend', '.isleta', function () {
        $('#' + idIsletaActiva).removeClass('isletaActiva');
        $('#' + $(this).attr('id')).addClass('isletaActiva')
        idIsletaActiva = $(this).closest('.isleta').attr('id');
    })

    $(document).on('click', '.isleta', function () {
        $('#' + idIsletaActiva).removeClass('isletaActiva');
        $('#' + $(this).attr('id')).addClass('isletaActiva')
        idIsletaActiva = $(this).closest('.isleta').attr('id');
        if (permitirBorradoIsleta) {
            if (borrando) {
                borrarIsleta($(this).attr('id'));
            }
           
            permitirBorradoIsleta = false;
        }
        if (editando) {

        }
        if (bloqueando) {
            $(this).draggable('disable')
            $(this).resizable('disable')
            $(this).addClass('blocked')
        } else if (!bloqueando) {
            $(this).draggable('enable')
            $(this).resizable('enable')
            $(this).removeClass('blocked')

        }

    })

    $(document).on('click', '.zona', function () {
        $('#' + idZonaActiva).removeClass('zonaActiva');
        $('#' + $(this).closest('.zona').attr('id')).addClass('zonaActiva')
        idZonaActiva = $(this).closest('.zona').attr('id');
        if (bloqueando) {
            $(this).resizable('disable')
            $(this).addClass('blocked')
        } else if (!bloqueando) {
            $(this).resizable('enable')
            $(this).removeClass('blocked')

        }

    })

    $(document).on('click', '.ap', function () {
        $('#' + idIsletaActiva).removeClass('apActiva');
        $('#' + $(this).closest('.ap').attr('id')).addClass('apActiva')
        idApActivo = $(this).closest('.ap').attr('id');
        if (borrando) {
            borrarAP($(this).attr('id'))
        }
        if (bloqueando) {
            $(this).draggable('disable')
            $(this).addClass('blocked')
        } else if (!bloqueando) {
            $(this).draggable('enable')
            $(this).removeClass('blocked')

        }
    })

    $(document).on('click', '.etiqueta', function () {
        $('#' + idIsletaActiva).removeClass('etiquetaActiva');
        if (permitirBorradoEtiqueta) {
            $('#' + idIsletaActiva).removeClass('etiquetaActiva');
            $('#' + $(this).closest('.etiqueta').attr('id')).addClass('etiquetaActiva')
            idEtiquetaActiva = $(this).closest('.etiqueta').attr('id');
            if (borrando) {
                borrarEtiqueta($(this).attr('id'));
            }
            if (bloqueando) {
                $(this).draggable('disable')
                $(this).addClass('blocked')
            } else if (!bloqueando) {
                $(this).draggable('enable')
                $(this).removeClass('blocked')
            }
            permitirBorradoEtiqueta = false;
        }

    })

    $(document).on('touchend', '.zona', function () {
        $('#' + idIsletaActiva).removeClass('zonaActiva');
        $('#' + $(this).closest('.zona').attr('id')).addClass('zonaActiva')
        idZonaActiva = $(this).closest('.zona').attr('id');
        if (bloqueando) {
            $(this).resizable('disable')
            $(this).addClass('blocked')
        } else if (!bloqueando) {
            $(this).resizable('enable')
            $(this).removeClass('blocked')

        }

    })

    $(document).on('touchend', '.ap', function () {
        $('#' + idIsletaActiva).removeClass('apActiva');
        $('#' + $(this).closest('.ap').attr('id')).addClass('apActiva')
        idApActivo = $(this).closest('.ap').attr('id');
        if (borrando) {
            borrarAP($(this).attr('id'))
        }
        if (bloqueando) {
            $(this).draggable('disable')
            $(this).addClass('blocked')
        } else if (!bloqueando) {
            $(this).draggable('enable')
            $(this).removeClass('blocked')

        }
    })


    //FORMULARIOS ASOCIADOS A LOS MODAL DE AÑADIR ELEMENTOS

    formZona.addEventListener("submit", function (event) {
        //PRIMERO DESACTIVAMOS LAS OPCIONES DE BOORADO, EDICIÓN Y BLOQUEO


        //Reseteamos la zona activa
        if ($(".zona")) {
            $(".zona").removeClass("zonaActiva");
        }
        //Interrumpimos el evento del botón de envío
        event.preventDefault();
        //Limpiamos el plano central donde se muestra el plano contenido por la zona
        $('.containerCentral').empty();
        //Limpiamos el cuadro derecho donde se listan las zonas a mostrar
        $(".containerDerecha").empty();

        nombreZona = document.getElementById("nombreZona").value
        //SACAMOS EL ANCHO Y EL ALTO DE LA ZONA
        $('#nombrePlanoNavbar').text("Plano: " + nombreZona);
        var mainContentWidthArea = $(".containerCentral").width();
        var mainContentHeightArea = $(".containerCentral").height();

        $.ajax({
            url: "php/conexion.php",
            type: "POST",
            data: {
                option: "INSERT",
                nombre: nombreZona,
                tipo: "zona",
                height: mainContentHeightArea,
                width: mainContentWidthArea,
            },
            success: function (idZona) {
                idZonaActiva = "z" + idZona;
                var zona = $("<div class='zona' id='z" + idZona + "'></div>");
                var mainContentWidth = $(".containerCentral").width();
                var mainContentHeight = $(".containerCentral").height();

                $(".containerCentral").append(zona);
                zona
                    .css({
                        'width': mainContentWidth + "px",
                        'height': mainContentHeight + "px",

                    })
                    .resizable({
                        containment: ".containerCentral",
                        width: mainContentWidth,
                        height: mainContentHeight,
                    })

                $('#z' + idZona).addClass("zonaActiva");
                $('#añadirZonaModal').modal('hide');
                idZonaActiva = "z" + idZona;
                $('#nombrePlanoNavbar').text("Plano: " + nombreZona);
                $('#cantidadAPS').text("APs: 0");
                $('#cantidadEtiquetas').text("ETEs: 0");
                $('#cantidadIsletas').text("Isletas: 0");
                getZonas();
                estadoBotones();
                etiquetas_array = [];
                actualizarNavbar();
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
            }
        })
    });

    formIsleta.addEventListener("submit", function (event) {

        //Si no está en selección ninguna zona, no se podrá crear la isleta
        //Esto se podría hacer directamente que no muestre los botones, o que esten deshabilitados
        //y una vez que se cree la zona, se habiliten
        if (idZonaActiva == null) {
            alert("No se ha seleccionado ninguna zona");
        }
        //Al crearla, será la activa, 'desactivando' la anterior
        if ($(".isleta")) {
            $(".isleta").removeClass("isletaActiva");
        }
        //Interrumpimos el efecto del botón de envío
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        var nombreIsleta = document.getElementById("nombreIsleta").value;
        var prefijoEtiquetas = null;
        if ($("#prefijoEtiquetas").val().trim() == "") {
            prefijoEtiquetas = nombreIsleta.substring(0, 3).toUpperCase();
        } else {
            prefijoEtiquetas = document.getElementById("prefijoEtiquetas").value.toUpperCase();
        }


        //Obtengo todos los parrafos de las isletas, su prefijo y lo comparo con el prefijo que se quiere añadir
        const elementosP = document.querySelectorAll('.isleta p');

        elementosP.forEach(elemento => {
            console.log(elemento.closest('.isleta').id)
            var textoCompleto = elemento.textContent;
            var prefijo = textoCompleto.match(/\((.*?)\)/)[1];
            var contador = 0;
            console.log(prefijo + " y " + prefijoEtiquetas)
            if (prefijo == prefijoEtiquetas) {
                var contador = contador + 1;
                if (!prefijoEtiquetas.substring(3, 4)) {
                    prefijoEtiquetas = prefijoEtiquetas + "2";
                    prefijo = prefijo + "1";
                    $('#' + elemento.closest('.isleta').id).find('p').text(nombreIsleta + "<br>(" + prefijo + ")")
                    
                } else if (prefijoEtiquetas.substring(3, 4) != null) {

                    prefijoEtiquetas = prefijoEtiquetas.substring(0, 3) + (parseInt(prefijo.substring(3, 4)) + 1)

                } else if (prefijoEtiquetas.substring(0, 3) == prefijo.substring(0, 3)){
                    prefijoEtiquetas = prefijoEtiquetas + contador;
                }

            }
        });

        var tipoSuperficie = document.querySelector('input[name="tipoSuperficie"]:checked').value;
        var superficie = null;
        if (tipoSuperficie == "redonda") {
            superficie = 1;
        } else {
            superficie = 0;
        }
        //Creo la isleta y recibo los parametros
        $.ajax({
            url: "php/conexion.php",
            type: "POST",
            data: {
                option: "INSERT",
                tipo: "isleta",
                nombre: nombreIsleta,
                prefijo: prefijoEtiquetas,
                id_zona: idZonaActiva.substring(1),
                x: 0,
                y: 0,
                height: 150,
                width: 150,
                redonda: superficie
            },
            success: function (idIsleta) {
                var isleta =
                    $("<div class='isleta ' id='i" + idIsleta + "'><p>" + nombreIsleta + "<br>(" + prefijoEtiquetas + ")" + "</p></div>");
                var mainContentWidth = $('#' + idZonaActiva).width();
                var mainContentHeight = $("#" + idZonaActiva).height();
                //AQUI HAY QUE SELECCIONAR A LA ZONA A LA QUE QUIERES
                if (superficie == 1) {

                    isleta = $("<div class='isleta' id='i" + idIsleta + "'><p>" + nombreIsleta + "<br>(" + prefijoEtiquetas + ")</p></div>");


                    isleta.css({
                        'border-radius': '50%',
                        'overflow': 'visible',
                    })
                }
                $("#" + idZonaActiva).append(isleta);



                isleta
                    .css({
                        'left': isleta.x + "px",
                        'top': isleta.y + "px",
                        'width': isleta.width + "px",
                        'height': isleta.height + "px",
                        'position': 'absolute'
                    })
                    .draggable({
                        containment: ".zona"
                    })
                    .resizable({
                        containment: ".zona",
                        maxWidth: $(".zona").width(),
                        maxHeight: $(".zona").height(),
                        minWidth: 100, // Establece el ancho mínimo permitido
                        minHeight: 100 // Establece la altura mínima permitida
                    })

                if (tipoSuperficie == "redonda") {
                    isleta.css({
                        'border-radius': '50%',
                        'overflow': 'visible',

                    })
                }


                $('#añadirIsletaModal').modal('hide');
                idIsletaActiva = "i" + idIsleta;
                $('#i' + idIsleta).addClass("isletaActiva");
                isletas_array.push({
                    id: idIsleta,
                    nombre: nombreIsleta,
                    prefijo: prefijoEtiquetas,
                    x: 0,
                    y: 0,
                    height: 150,
                    width: 150,
                    redonda: superficie
                })
                $.ajax({
                    url: "php/conexion.php",
                    type: "UPDATE",
                    data: {
                        option: "",
                        tipo: "isletaPrefijo",
                        id_isleta: idIsleta,
                    },
                })
                estadoBotones();
                actualizarNavbar();

            },
            error: function (xhr, status, error) {
                console.error("No se ha podido insertar"); // Manejar errores de la solicitud AJAX
            }
        })
    });

    formEtiqueta.addEventListener("submit", function (event) {

        if ($(".etiqueta")) {
            $(".etiqueta").removeClass("etiquetaActiva");
        }
        // Detener el comportamiento predeterminado de enviar el formulario
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        var nombreEtiqueta = document.getElementById("nombreEtiqueta").value;
        // var mac = document.getElementById("macEtiqueta").value;
        var mac = "00:00:00:00:00:00";
        var cantidadEtiquetasAAñadir = document.getElementById("cantidadEtiquetasAAñadir").value;
        var posicion = null;
        if (idIsletaActiva == null) {
            var idIsletaActiva = document.getElementById("isletaPerteneciente").value;
        } else {
            var idIsletaActiva = idIsletaActiva.substring(1)


        }
        prefijo = regex.exec(document.querySelector('#i' + idIsletaActiva).querySelector('p').textContent)

        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "GetEtiquetasByIsletaID",
                id_isleta: idIsletaActiva,
                tipo: "etiqueta"
            },
            success: function (response) {
                var etiquetas = JSON.parse(response);
                if (etiquetas.length == 0) {
                    posicion = 1;
                } else {
                    posicion = parseInt(etiquetas[etiquetas.length - 1].posicion) + 1;
                }
                $.ajax({
                    url: "php/conexion.php",
                    type: "POST",
                    data: {
                        option: "INSERT",
                        nombre: nombreEtiqueta,
                        mac: mac,
                        tipo: "etiqueta",
                        id_isleta: idIsletaActiva,
                        x: parent.innerHeight / 2,
                        y: parent.innerWidth / 2,
                        prefijo: prefijo[1],
                        posicion: posicion,
                        cantidad: cantidadEtiquetasAAñadir
                    },
                    success: function (idEtiqueta) {
                        console.log(cantidadEtiquetasAAñadir + "AAAAAAAAAAAAAAAAAAa")
                        contadorId = idEtiqueta

                        while (cantidadEtiquetasAAñadir >= 0) {
                            var mainContentWidth = $("#" + idIsletaActiva).width();
                            var mainContentHeight = $("#" + idIsletaActiva).height();

                            if (cantidadEtiquetasAAñadir != 1) {
                                var cantidadColumnas = mainContentWidth / cantidadEtiquetasAAñadir
                            }
                            $("#i" + idIsletaActiva).append(etiqueta);
                            if (borrando) {
                                var etiqueta = $("<div class='etiqueta' id='e" + contadorId + "'><p>" + nombreEtiqueta + "<br>(" + prefijo[1] + "-" + posicion + ")" + "</p></div>");

                            } else {
                                var etiqueta = $("<div class='etiqueta' id='e" + contadorId + "'><p>" + nombreEtiqueta + "<br>(" + prefijo[1] + "-" + posicion + ")" + "</p></div>");
                            }

                            etiqueta
                                .css({
                                    'display': 'flex',
                                    'flex-direction': 'column',
                                    'position': 'absolute',
                                    maxHeight: mainContentHeight,
                                    maxWidth: mainContentWidth,
                                    'border': '2px solid yellow',
                                    'border-radius': '5px',
                                    'top': '10px',
                                    'left': '10px',

                                })
                                .draggable({
                                    containment: "#i" + idIsletaActiva,
                                })

                            $('#añadirEtiquetaModal').modal('hide');
                            $('#e' + idEtiqueta).addClass("etiquetaActiva");
                            etiquetas_array.push({
                                id: contadorId,
                                nombre: nombreEtiqueta,
                                id_isleta: idIsletaActiva,
                                mac: mac,
                                x: parent.innerHeight / 2,
                                y: parent.innerWidth / 2,
                                prefijo: prefijo[1],
                                posicion: posicion
                            })
                            contadorId++
                            cantidadEtiquetasAAñadir--
                            posicion++
                        }
                        idEtiquetaActiva = "e" + idEtiqueta;
                        idIsletaActiva = "i" + idIsletaActiva;
                        actualizarNavbar();
                    },
                    error: function (xhr, status, error) {
                    }

                });

            }
        });
    }





    );

    formAP.addEventListener("submit", function (event) {
        if ($(".ap")) {
            $(".ap").removeClass("apActivo");
        }
        event.preventDefault();
        var nombreAP = document.getElementById("nombreAP").value;
        console.log(idZonaActiva)
        $.ajax({
            url: "php/conexion.php",
            type: "POST",
            data: {
                option: "INSERT",
                tipo: "ap",
                nombre: nombreAP,
                x: 0,
                y: 0,
                id_zona: idZonaActiva.substring(1),
            },
            success: function (idAP) {
                var mainContentWidth = $("#" + idZonaActiva).width();
                var mainContentHeight = $("#" + idZonaActiva).height();

                var ap = $("<div class='ap' id='ap" + idAP + "'><p>" + nombreAP + "</p></div>");
                $("#" + idZonaActiva).append(ap);
                ap
                    .css({
                        'position': 'absolute',
                        'display': 'flex',
                        'flex-direction': 'column',
                        'border': '2px solid blue',
                        'border-radius': '50%',
                        "height": "50px",
                        "width": "50px",
                        maxHeight: mainContentHeight,
                        maxWidth: mainContentWidth,
                    })
                    .draggable({
                        containment: "#" + idZonaActiva,
                    })

                $('#añadirAPModal').modal('hide');
                $('#ap' + idAP).addClass("apActivo");
                idApActivo = "ap" + idAP;
                actualizarNavbar();
            },
            error: function (xhr, status, error) {
            }
        })
    });


    //DETECTA LA MUTACIÓN DE "STYLE" DE CUALQUIER ELEMENTO 
    function actualizarTamaño(elemento, tipo) {
        var data = {
            option: "UPDATE",
            tipo: tipo
        };
        //Dependiendo del tipo de elemento, se actualiza el tamaño con los valores actuales
        switch (tipo) {
            case 'isleta':
                const idIsleta = elemento.attr("id").substring(1);
                data = {
                    option: "UPDATE",
                    tipo: tipo,
                    id: idIsleta,
                    x: elemento.position().left,
                    y: elemento.position().top,
                    height: elemento.height(),
                    width: elemento.width()
                };
                var isleta = isletas_array.filter(isleta => isleta.id === idIsleta);
                if (isleta.length != 0) {
                    if (isleta[0].width != elemento.width() || isleta[0].height != elemento.height()) {
                        console.log(etiquetas_array) //CONTINUAR LA TRAZA PARA COMPLETAR EL CODIGO, voy arrib a buscar como añadir las etiquetas array al mostrarse la zona
                        etiquetas_array.forEach(etiqueta => {
                            if (etiqueta.id_isleta == idIsleta) {
                                proporcionalidadX = etiqueta.x / isleta[0].width;
                                proporcionalidadY = etiqueta.y / isleta[0].height;
                                console.log("Proporcionalidad X: " + proporcionalidadX + " y Proporcionalidad Y: " + proporcionalidadY)

                                var posicionXFinal = elemento.width() * proporcionalidadX;
                                var posicionYFinal = elemento.height() * proporcionalidadY;
                                console.log('la posicion X: ' + posicionXFinal + ' la posicion Y: ' + posicionYFinal)
                                $('#e' + etiqueta.id).css({
                                    left: posicionXFinal + "px",
                                    top: posicionYFinal + "px",
                                })
                            }
                        });

                    }

                }



                const index = isletas_array.findIndex(isleta => isleta.id == data.id);
                if (index !== -1) {
                    isletas_array[index] = { ...isletas_array[index], ...data };
                }

                console.log(data);
                break;

            case 'zona':
                data.id = elemento.attr("id").substring(1);
                data.height = elemento.height();
                data.width = elemento.width();
                break;
            case 'etiqueta':
                data.id = elemento.attr("id").substring(1);
                data.x = elemento.position().left;
                data.y = elemento.position().top;
                etiquetas_array.forEach(etiqueta => {
                    if (etiqueta.id == data.id) {
                        etiqueta.x = data.x;
                        etiqueta.y = data.y;
                    }
                });
                break;
            case 'ap':
                data.id = elemento.attr("id").substring(2);
                data.x = elemento.position().left;
                data.y = elemento.position().top;
                break;
        }
        // Enviar las dimensiones a la base de datos
        $.ajax({
            url: "php/conexion.php",
            type: "POST",
            data: data,
            success: function (response) {
                var idZnaActivaSolo;
                if (tipo == "isleta") {
                    if (idZonaActiva != null) {
                        idZonaActivaSolo = idZonaActiva.substring(1)
                    }
                    $.ajax({
                        url: "php/conexion.php",
                        type: "GET",
                        data: {
                            option: 'getIsletasByZonaID',
                            tipo: 'isleta',
                            id_zona: idZonaActivaSolo,
                        }, success: function (response) {

                            var isletas = JSON.parse(response);
                            var ancho = 0;
                            var alto = 0;
                            isletas.forEach(isleta => {
                                if ((isleta.x + isleta.width > ancho)) {
                                    ancho = isleta.x + isleta.width + 30
                                }
                                if ((isleta.y + isleta.height > alto)) {
                                    alto = isleta.y + isleta.height + 30
                                }
                            })
                            $('#z' + idZonaActivaSolo).css({
                                minHeight: alto,
                                minWidth: ancho
                            })


                        }, error: function (xhr, status, error) {
                            console.log(error)
                        }
                    })
                }
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
            }
        });
    };
    observer = new MutationObserver(function (mutations) {
        //Por cada detección de cambio en el estilo del DOM
        mutations.forEach(function (mutation) {
            if ($(mutation.target).hasClass('isleta')) {
                // Ejecutar la función para actualizar el tamaño
                actualizarTamaño($(mutation.target), "isleta");
            }
            if ($(mutation.target).hasClass('zona')) {
                actualizarTamaño($(mutation.target), "zona");
            }
            if ($(mutation.target).hasClass('etiqueta')) {
                actualizarTamaño($(mutation.target), "etiqueta");
            }
            if ($(mutation.target).hasClass('ap')) {
                actualizarTamaño($(mutation.target), "ap");
            }
        });
    });
    var observerOptions = {
        attributes: true,
        attributeFilter: ['style'],
        subtree: true
    };
    observer.observe(document.getElementById('containerAreas'), observerOptions);



    //MODIFICAR QUE ELEMENTO ESTÁ ACTIVO MEDIANTE CLICK

    //Funcion para mostrar la zona con todos los elementos

    $(document).on('click', '[class^="mostrarZona"]', function () {
        estadoHerramientas(true, true, true)
        var zonaAMostrar = $(this).attr('class').substring(11);
        mostrarZona("z" + zonaAMostrar);
        idZonaActiva = zonaAMostrar;
    });

    $(document).on('click', '#añadirEtiqueta', function () {
        estadoHerramientas(true, true, true)
        if (idZonaActiva != null) {
            $.ajax({
                url: "php/conexion.php",
                type: "GET",
                data: {
                    option: "getIsletasByZonaID",
                    id_zona: idZonaActiva.substring(1),
                },
                success: function (response) {
                    var isletas = JSON.parse(response);
                    console.log(isletas)
                    var selectIsleta = $("#isletaPerteneciente");
                    selectIsleta.empty();
                    isletas.forEach(isleta => {
                        if (idIsletaActiva != null && isleta.id == idIsletaActiva.substring(1)) {
                            selectIsleta.append('<option value="' + isleta.id + '" selected>' + isleta.prefijo + "(preseleccionado)</option>'");
                        } else {
                            selectIsleta.append('<option value="' + isleta.id + '">' + isleta.prefijo + '</option>');
                        }

                    });
                },
                error: function (xhr, status, error) {
                    console.log(xhr, status, error)
                }
            })
        } else {
            alert("No hay ninguna zona activa")
        }

    });

    $(document).on('touchstart', '#añadirEtiqueta', function () {
        estadoHerramientas(true, true, true)
        if (idZonaActiva != null) {
            $.ajax({
                url: "php/conexion.php",
                type: "GET",
                data: {
                    option: "getIsletasByZonaID",
                    id_zona: idZonaActiva.substring(1),
                },
                success: function (response) {
                    var isletas = JSON.parse(response);
                    console.log(isletas)
                    var selectIsleta = $("#isletaPerteneciente");
                    selectIsleta.empty();
                    isletas.forEach(isleta => {
                        if (idIsletaActiva != null && isleta.id == idIsletaActiva.substring(1)) {
                            selectIsleta.append('<option value="' + isleta.id + '" selected>' + isleta.nombre + "(preseleccionado)</option>'");
                        } else {
                            selectIsleta.append('<option value="' + isleta.id + '">' + isleta.nombre + '</option>');
                        }

                    });
                },
                error: function (xhr, status, error) {
                    console.log(xhr, status, error)
                }
            })
        } else {
            alert("No hay ninguna zona activa")
        }

    });

    $(document).on('click', '#añadirIsleta', function () {
        estadoHerramientas(true, true, true)
    })
    $(document).on('click', '#añadirAP', function () {
        estadoHerramientas(true, true, true)
    })

    $(document).on('click', '.eliminarZona', function () {

        var idZona = $(this).attr('id');
        var zonaActiva = null;


        if ($('.zona').attr('id')) {
            zonaActiva = $('.zona').attr('id').substring(1);
        }
        idZona = idZona.substring(13);

        Swal.fire({
            title: "Borrar la zona " + $(this).closest('.zonasDerecha').text().trim() + "?",
            text: "NO SE PUEDE DESHACER",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, borralo"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "php/conexion.php",
                    type: "POST",
                    data: {
                        option: "DELETE",
                        tipo: "zona",
                        id: idZona
                    },
                    success: function (response) {
                        if (zonaActiva == idZona) {
                            $('.containerCentral').empty();
                            idZonaActiva = null;
                            $('#nombreZonaNavbar').text("Plano: ");
                            $('#cantidadAPS').text("APs: ");
                            $('#cantidadEtiquetas').text("ETEs: ");
                            $('#cantidadIsletas').text("Isletas: ");
                        }
                        $(".containerDerecha").empty();
                        getZonas();
                        estadoBotones();
                        $.toast({
                            heading: 'Éxito',
                            text: 'Se ha borrado correctamente la zona',
                            icon: 'success'
                        })
                    },
                    error: function (xhr, status, error) {
                        console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
                    }
                });
            } else {
                $.toast({
                    heading: 'Error',
                    text: 'No se ha podido borrar la zona, inténtelo de nuevo',
                    icon: 'error'
                })
            }
        })
    });

    $(document).on('click', '.activarBorrado', function () {
        $(this).addClass('expandiendo')
        estadoHerramientas(false, true, true)

        if (borrando) {
            estadoHerramientas(true, false, false)
        } else {
            $('.activarBorrado')
                .css({
                    'background-color': 'lightcoral'
                })
            borrando = true;
            $.toast({
                heading: 'Activando el borrado',
                showHideTransition: 'plain',
                icon: 'error',
            })
        }

    });


    $(document).on('click', '.activarBloqueo', function () {
        $(this).addClass('expandiendo')
        estadoHerramientas(true, true, false)
        if (bloqueando) {
            estadoHerramientas(false, false, true)
        } else {
            $('.activarBloqueo')
                .css({
                    'background-color': 'lightblue'
                })
            bloqueando = true;
            $.toast({
                heading: 'Activando el bloqueo',
                showHideTransition: 'plain',
                icon: 'warning'
            })
        }
    });

    $(document).on('touchend', '.activarBloqueo', function () {
        $(this).addClass('expandiendo')
        estadoHerramientas(true, true, false)
        if (bloqueando) {
            estadoHerramientas(false, false, true)
        } else {
            $('.activarBloqueo')
                .css({
                    'background-color': 'lightblue'
                })
            bloqueando = true;
            $.toast({
                heading: 'Activando el bloqueo',
                showHideTransition: 'plain',
                icon: 'warning'
            })
        }
    });

    $(document).on('click', '.activarEditado', function () {
        $(this).addClass('expandiendo')
        estadoHerramientas(true, false, true)
        if (editando) {
            estadoHerramientas(false, true, false)
        } else {
            $('[class^="editar-"]').css({
                display: 'block'
            })
            $('.activarEditado')
                .css({
                    'background-color': 'lightgreen'
                })
            $.toast({
                heading: 'Se permite la edición',
                showHideTransition: 'plain',
                icon: 'success'
            })
            editando = true;
        }
    })

    $(document).on('click', '#planos', function () {
        var posicionXInicialModal = $(this).width() + $(this).position().left;
        var posicionYInicialModal = $(this).height() + $(this).position().top;
        getZonas()
        Swal.fire({
            showConfirmButton: false,
            customClass: {
                popup: 'planos-popup',
            }
        }).then((result) => {
            $('.planos-popup').css({
                'top': posicionXInicialModal + 'px',
                'left': posicionYInicialModal + ' +px'
            })

        });
    });

    $(document).on('click', '#maximixe', function () {
        if (requestFullScreen) {
            requestFullScreen.call(elem);
        }
        if (exitFullScreen) {
            exitFullScreen.call(document);
        }

    })

    //PARA DESHABILITAR LAS ZONAS ACTIVAS AL HACER CLICK EN OTRO LADO



    //Si no hay ninguna zona deshabilitar los botones de añadir isleta, etiqueta y ap


    //QUe detecte cuando la clase ui-draggable-dragging se asigna a unu elemento
    //se puede saber cuando se 



    estadoBotones();

});
//Por Sergio Romero Alarcón