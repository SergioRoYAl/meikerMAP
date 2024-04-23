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


    //FUNCIONES

    function activarElemento(selector, claseActiva, idActivo, nombreIdActivo) {
        $(document).on('click', selector, function () {
            $('#' + idActivo).removeClass(claseActiva);
            idActivo = $(this).attr('id');
            $('#' + idActivo).addClass(claseActiva);
            console.log(claseActiva.replace('Activa', '') + ' activa seleccionada:', idActivo);
            switch (claseActiva) {
                case 'zonaActiva':
                    idZonaActiva = idActivo;
                    break;
                case 'isletaActiva':
                    idIsletaActiva = idActivo;
                    break;
                case 'etiquetaActiva':
                    idEtiquetaActiva = idActivo;
                    break;
                case 'apActivo':
                    idApActivo = idActivo;
                    break;
                }
        });
    }

    function mostrarZona(idZona) {
        //Quitamos la "z" de el id de la zona zXX -> XX
        idZonaAMostrar = idZona.substring(1);

        //Vaciamos el contenedor central de cualquier elemento
        $('.containerCentral').empty();

        //Obtenemos las isletas respecto de la zona
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
                
                //Obtenemos la zona a mostrar
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
                        var zona = $("<div class='zona' id='z" + idZonaAMostrar + "'><h2 class='ms-2'>" + infoZona[0].nombre + "</h2></div>");
                        var mainContentWidth = $(".containerCentral").width();
                        var mainContentHeight = $(".containerCentral").height();
                        $(".containerCentral").append(zona);
                        zona
                            .css({
                                'width': infoZona[0].width + "px",
                                'height': infoZona[0].height + "px"
                            })
                            .resizable({
                                containment: ".containerCentral",
                                width: mainContentWidth,
                                height: mainContentHeight,
                            })

                        isletasArray.forEach(isleta => {
                            var isletaACrear = $("<div class='isleta' id='i" + isleta.id + "'><div class='borrar-isleta'>&#10006;</div><p>" + isleta.nombre + "(" + isleta.prefijo + ")</p></div>");
                            
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
                                    minWidth: 100, // Establece el ancho mínimo permitido
                                    minHeight: 100 // Establece la altura mínima permitida
                                })

                            $("#z" + idZonaAMostrar).append(isletaACrear);

                            //Obtenemos las etiquetas asociadas a la isleta
                            $.ajax({
                                url: "php/conexion.php",
                                type: "GET",
                                data: {
                                    option: "GetEtiquetasByIsletaID",
                                    tipo: "etiqueta",
                                    id_isleta: isleta.id,
                                },
                                success: function (Etiquetas) {
                                    var etiquetasInfo = JSON.parse(Etiquetas);
                                    etiquetasInfo.forEach(etiqueta => {
                                        var etiquetaAInsertar = $("<div class='etiqueta' id='e" + etiqueta.id + "'><div class='borrar-etiqueta' style='font-size: 22px'>x</div><p>" + etiqueta.nombre + "(" + etiqueta.prefijo + etiqueta.posicion + ")</p></div>");
                                        var mainContentWidth = $("#i" + isleta.id).width();
                                        var mainContentHeight = $("#i" + isleta.id).height();
                                        //AQUI HAY QUE SELECCIONAR A LA ZONA A LA QUE QUIERES
                                        $("#i" + isleta.id).append(etiquetaAInsertar);
                                        etiquetaAInsertar
                                            .css({
                                                'display': 'flex',
                                                'flex-direction': 'column',
                                                'position': 'absolute',
                                                'left': etiqueta.x + "px",
                                                'top': etiqueta.y + "px",
                                                maxHeight: mainContentHeight,
                                                maxWidth: mainContentWidth,
                                                'border': '2px solid yellow',
                                                'border-radius': '5px',
                                            })
                                            .draggable({
                                                containment: "#i" + isleta.id
                                            })
                                        etiquetas_array.push(etiqueta);
                                    });
                                },
                                error: function (xhr, status, error) {
                                    console.log(error)
                                }
                            });
                        });
                        $('#' + zonaAMostrar).addClass("zonaActiva");
                        $.ajax({
                            url: "php/conexion.php",
                            type: "GET",
                            data: {
                                option: "GetAPByZonaID",
                                id_zona: idZonaAMostrar,
                            },success: function (response) {
                                var aps = JSON.parse(response);
                                aps.forEach(ap => {
                                    var apACrear = $("<div class='ap' id='ap" + ap.id + "'><div class='borrar-ap'>x</div><p>" + ap.nombre + "</p></div>");
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
                                        })
                                    
        
                                });
                            }, error: function (xhr, status, error) {   
                            
                            }
                        })
                    },
                    error: function (xhr, status, error) {
                        reject(error);
                    }
                });
                
            }, error: function (xhr, status, error) {
                console.log(error);
            }
        })
    }

    //ACTUALIZA LOS ELEMENTOS DE EL CUADRO DERECHO
    function getZonas() {
        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "GETALL",
                tipo: "zona",
            },
            success: function (response) {
                var zonasInfo = JSON.parse(response);
                $(".containerDerecha").append("<ul class='list-group' id='zonas'></ul>");
                zonasInfo.forEach(zona => {
                    var zonaEstructura = $("<div class='d-flex flex-column'><li class='list-group-item' ><p style='font-size: 20px'><button class='btn btn-success mostrarZona '  id='z" + zona.id + "'>VER </button> " + zona.nombre + "<button class='btn btn-danger eliminarZona ms-3' id='eliminarZona-" + zona.id + "'>X</button> </p></li></div>");
                    $("#zonas").append(zonaEstructura);
                });
            }
        });
    }

    //EVENT LISTENERS

    formZona.addEventListener("submit", function (event) {
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

        $.ajax({
            url: "php/conexion.php",
            type: "POST",
            data: {
                option: "INSERT",
                nombre: nombreZona,
                tipo: "zona",
                height: 777,
                width: 999,
            },
            success: function (idZona) {
                idZonaActiva = "z" + idZona;
                var zona = $("<div class='zona' id='z" + idZona + "'><h2 class='ms-2'>" + nombreZona + "</h2></div>");
                var mainContentWidth = $(".containerCentral").width();
                var mainContentHeight = $(".containerCentral").height();

                $(".containerCentral").append(zona);
                zona
                    .resizable({
                        containment: ".containerCentral",
                        width: mainContentWidth,
                        height: mainContentHeight,
                    })

                $('#z' + idZona).addClass("zonaActiva");
                $('#añadirZonaModal').modal('hide');
                idZonaActiva = "z" + idZona;
                getZonas();
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
        var prefijoEtiquetas = document.getElementById("prefijoEtiquetas").value.toUpperCase();

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
                width: 150
            },
            success: function (idIsleta) {
                var isleta =
                    $("<div class='isleta' id='i" + idIsleta + "'><div class='borrar-isleta'>x</div><p>" + nombreIsleta + "(" + prefijoEtiquetas + ")" + "</p></div>");
                var mainContentWidth = $('#' + idZonaActiva).width();
                var mainContentHeight = $("#" + idZonaActiva).height();
                //AQUI HAY QUE SELECCIONAR A LA ZONA A LA QUE QUIERES
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
                $('#añadirIsletaModal').modal('hide');
                $('#i' + idIsleta).addClass("isletaActiva");
                idIsletaActiva = "i" + idIsleta;
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
        var mac = document.getElementById("macEtiqueta").value;
        console.log(idIsletaActiva)
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
                    },
                    success: function (idEtiqueta) {
                        var etiqueta = $("<div class='etiqueta' id='e" + idEtiqueta + "'><div class='borrar-etiqueta' style='font-size: 12px'>x</div><p>" + nombreEtiqueta + "(" + prefijo[1] + ")" + "</p></div>");
                        var mainContentWidth = $("#" + idIsletaActiva).width();
                        var mainContentHeight = $("#" + idIsletaActiva).height();
                        $("#i" + idIsletaActiva).append(etiqueta);
                        etiqueta
                            .css({
                                'position': 'absolute',
                                'display': 'flex',
                                'flex-direction': 'column',
                                'position': 'absolute',
                                maxHeight: mainContentHeight,
                                maxWidth: mainContentWidth,
                                'border': '2px solid yellow',
                                'border-radius': '5px',

                            })
                            .draggable({
                                containment: "#i" + idIsletaActiva,
                            })
                        $('#añadirEtiquetaModal').modal('hide');
                        $('#e' + idEtiqueta).addClass("etiquetaActiva");
                        idEtiquetaActiva = "e" + idEtiqueta;
                    },
                    error: function (xhr, status, error) {
                    }
                });
            }
        });
    });

    formAP.addEventListener("submit", function (event) {
        if ($(".ap")) {
            $(".ap").removeClass("apActivo");
        }
        event.preventDefault();
        var nombreAP = document.getElementById("nombreAP").value;
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

                var ap = $("<div class='ap' id='ap" + idAP + "'><div class='borrar-ap'>x</div><p>" + nombreAP + "</p></div>");
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
                data.id = elemento.attr("id").substring(1);
                data.x = elemento.position().left;
                data.y = elemento.position().top;
                data.height = elemento.height();
                data.width = elemento.width();
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
                break;
            case 'ap':
                console.log(data)
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
    activarElemento('.zona', 'zonaActiva', idZonaActiva);
    activarElemento('.isleta', 'isletaActiva', idIsletaActiva);
    activarElemento('.etiqueta', 'etiquetaActiva', idEtiquetaActiva);
    activarElemento('.ap', 'apActivo', idApActivo);

    //Funcion para mostrar la zona con todos los elementos
    $(document).on('click', '.mostrarZona', function () {
        zonaAMostrar = $(this).attr('id');
        mostrarZona(zonaAMostrar);
        idZonaActiva = zonaAMostrar;
    });

    $(document).on('click', '#añadirEtiqueta', function () {
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

                        console.log(idIsletaActiva + " ----- " + isleta.id)
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

    $(document).on('click', '.eliminarZona', function () {

        var idZona = $(this).attr('id');
        var zonaActiva = null;
        if ($('.zona').attr('id')) {
            zonaActiva = $('.zona').attr('id').substring(1);
        }
        idZona = idZona.substring(13);
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
                }
                $(".containerDerecha").empty();
                getZonas();
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
            }
        });
    });

    $(document).on('click', '.borrar-isleta', function () {
        var isletaId = $(this).closest('.isleta').attr('id');
        idIsletaABorrar = isletaId.substring(1);
        $.ajax({
            url: "php/conexion.php",
            type: "POST",
            data: {
                option: "DELETE",
                tipo: "isleta",
                id: idIsletaABorrar
            },
            success: function (response) {
                $('#' + isletaId).remove();
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
            }
        });
        // Aquí puedes agregar la lógica para eliminar la isleta con el ID isletaId
        console.log('Borrar isleta con ID:', isletaId);
        // Por ejemplo, puedes usar jQuery para eliminar la isleta del DOM
        $('#' + isletaId).remove();
    });

    /*
    $(document).on('click', '.borrar-etiqueta', function () {
        var etiquetaId = $(this).closest('.etiqueta').attr('id');
        var isletaId = $(this).closest('.isleta').attr('id');
        var arrayEtiquetas = [];
        var prefijoEliminado = null;
        var prefijoTemporal = null;
        var idEliminado = null;
        var idTemporal = null;
        var comienzo = false;
        var swap = 0;
        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "GetEtiquetasByIsletaID",
                tipo: "etiqueta",
                id_isleta: isletaId.substring(1),
            }, success: function (response) {
                var etiquetas = JSON.parse(response);
                etiquetas.forEach(etiqueta => {
                    if (etiqueta.prefijo == etiquetaId) {
                        etiquetaId = false;
                        comienzo = true;
                        prefijoEliminado = etiqueta.prefijo;
                        idEliminado = etiqueta.id;
                        $.ajax({
                            url: "php/conexion.php",
                            type: "POST",
                            data: {
                                option: "DELETE",
                                tipo: "etiqueta",
                                prefijo: etiquetaId,
                                id_isleta: isletaId.substring(1)
                            },
                            success: function (response) {
                                $('#' + etiquetaId).remove();


                            },
                            error: function (xhr, status, error) {
                                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
                            }
                        });
                    } else if (comienzo == false) {
                        arrayEtiquetas.push(etiqueta);
                    } else {
                        if (swap == 0) {
                            idTemporal = etiqueta.id;
                            prefijoTemporal = etiqueta.prefijo;
                            etiqueta.id = idEliminado;
                            etiqueta.prefijo = prefijoEliminado;
                            swap = 1
                        } else {
                            idEliminado = etiqueta.id;
                            prefijoEliminado = etiqueta.prefijo;
                            etiqueta.id = idTemporal;
                            etiqueta.prefijo = prefijoTemporal;
                            swap = 0;
                        }
                        arrayEtiquetas.push(etiqueta);
                    }

                });

                $.ajax({
                    url: "php/conexion.php",
                    type: "POST",
                    data: {
                        option: "DELETE",
                        tipo: "etiquetaFull",
                        id_isleta: isletaId.substring(1)
                    },
                    success: function (response) {
                        console.log("Se han borrado todas las etiquetas de la isleta")
                        if (arrayEtiquetas.length >= 1) {
                            arrayEtiquetas.forEach(etiqueta => {
                                console.log(etiqueta)
                                $.ajax({
                                    url: "php/conexion.php",
                                    type: "POST",
                                    data: {
                                        option: "INSERT",
                                        tipo: "etiquetaFull",
                                        id_isleta: isletaId.substring(1),
                                        id: etiqueta.id,
                                        nombre: etiqueta.nombre,
                                        x: etiqueta.x,
                                        y: etiqueta.y,
                                        mac: etiqueta.mac,
                                        prefijo: etiqueta.prefijo,
                                    },
                                    success: function (response) {

                                    },
                                    error: function (xhr, status, error) {
                                        console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
                                    }
                                });
                            });

                        }
                        mostrarZona(idZonaActiva);
                    },
                    error: function (xhr, status, error) {
                        console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
                    }
                });


            }, error: function (xhr, status, error) {
                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
            }

        })

        // Aquí puedes agregar la lógica para eliminar la isleta con el ID isletaId

    });
    */

    $(document).on('click', '.borrar-etiqueta', function () {
        var etiquetaId = $(this).closest('.etiqueta').attr('id');
        $.ajax({

        })
        $.ajax({
            url: "php/conexion.php",
            type: "POST",
            data: {
                option: "DELETE",
                tipo: "etiqueta",
                id: etiquetaId.substring(1)
            },
            success: function (response) {
                console.log(response)
                console.log(etiquetas_array)
                $('#' + etiquetaId).remove();

            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
            }
        });
    });

    $(document).on('click', '.borrar-ap', function () {
        var apId = $(this).closest('.ap').attr('id');
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
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
            }
        });
    });

    getZonas();
});