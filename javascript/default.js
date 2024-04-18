document.addEventListener("DOMContentLoaded", function () {

    //VASVARIABLES

    var zonaActivaId = null;
    var isletaActivaId = null;
    var etiquetaActivaId = null;

    var formIsleta = document.getElementById("isletaForm");
    var formEtiqueta = document.getElementById("etiquetaForm");

    //FUNCIONES
    function getPrefijo(idIsleta) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "php/conexion.php",
                type: "GET",
                data: {
                    option: "GETPREFIJO",
                    tipo: "isleta",
                    id: idIsleta,
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function (xhr, status, error) {
                    reject(error);
                }
            });
        });
    }

    //OBTIENE LAS ZONAS
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
                $(".containerDerecha").append("<ul class='list-group' id=ul></ul>");

                //Esto es para cargar limpiamente las zonas que nos dan de opcion al agregar una isleta
                var selectZona = $("#zonaPerteneciente");
                selectZona.empty();

                zonasInfo.forEach(zona => { 
                    //Limpiar las zonas cargadas, para cargarlas de nuevo

                    var zonaEstructura = $("<div class='d-flex flex-column'><li class='list-group-item' ><p style='font-size: 30px'><button class='btn btn-success mostrarZona '  id='" + zona.id + "'>VER </button> " + zona.nombre + "<button class='btn btn-danger eliminarZona ms-3' id='eliminarZona-" + zona.id + "'>X</button> </p></li></div>");
                    $("#ul").append(zonaEstructura);


                    selectZona.append('<option value="' + zona.id + '">' + zona.nombre + '</option>');

                });
            }


            //CARGANO LAS ZONAS EN LA PAGINA PRINCIPAL



        });
    }
    getZonas();

    //EVENT LISTENERS

    formIsleta.addEventListener("submit", function (event) {
        if ($(".isleta")) {
            $(".isleta").removeClass("zonaActiva");
        }
        // Detener el comportamiento predeterminado de enviar el formulario
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        var nombre = document.getElementById("nombreIsleta").value;
        var prefijo = document.getElementById("prefijoEtiquetas").value;

        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "LASTID",
                tipo: "isleta"
            },
            success: function (response) {
                // Una vez tenemos el ultimo id añadimos el div
                contador = JSON.parse(response);
                if (contador.id == 0) {
                    contador = 1;
                } else {
                    contador = contador[0].id + 1;
                }
                var isleta = $("<div class='isleta' id='" + contador + "'><h2>" + nombre + "(" + prefijo + ")" + "</h2></div>");


                var mainContentWidth = $('.zona#' + zonaActivaId).width();
                var mainContentHeight = $(".zona#" + zonaActivaId).height();
                //AQUI HAY QUE SELECCIONAR A LA ZONA A LA QUE QUIERES
                $("#zona-" + zonaActivaId.substring(5)).append(isleta);
                isleta
                    .css({
                        'position': 'absolute'
                    })
                    .draggable({
                        containment: ".zona#" + zonaActivaId
                    })
                    .resizable({
                        containment: ".zona#" + zonaActivaId,
                        maxWidth: mainContentWidth,
                        maxHeight: mainContentHeight,
                        minWidth: 100, // Establece el ancho mínimo permitido
                        minHeight: 100 // Establece la altura mínima permitida
                    })
                    console.log("Zona activa: " + zonaActivaId.substring(5));
                $.ajax({
                    url: "php/conexion.php",
                    type: "POST",
                    data: {
                        option: "INSERT",
                        nombre: nombre,
                        id: contador, // Asignar el ID único al cuadrado
                        height: isleta.width(),
                        width: isleta.height(),
                        x: isleta.position().left,
                        y: isleta.position().top,
                        tipo: "isleta",
                        id_zona: zonaActivaId,
                        prefijo: prefijo
                    },
                    success: function (response) {
                        console.log("Respuesta: " + response); // Manejar la respuesta del servidor
                        $('#añadirIsletaModal').modal('hide');
                        $('.isleta#' + contador).addClass("isletaActiva");
                        isletaActivaId = contador;
                    },
                    error: function (xhr, status, error) {
                        console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
                    }
                })


            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
            }
        });
    });

    formEtiqueta.addEventListener("submit", function (event) {
        if ($(".etiqueta")) {
            $(".etiqueta").removeClass("etiquetaActiva");
        }
        // Detener el comportamiento predeterminado de enviar el formulario
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        var nombre = document.getElementById("nombreEtiqueta").value;
        var mac = document.getElementById("macEtiqueta").value;
        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "LASTID",
                tipo: "etiqueta",
                id_isleta: isletaActivaId
            },
            success: function (response) {
                console.log("Resultado de LASTID(etiqueta): " + response);
                // Una vez tenemos el ultimo id añadimos el div
                contador = JSON.parse(response);
                console.log(contador);
                if (contador.id == null) {
                    contador = 0;
                } else {
                    contador = contador[0].id + 1;
                }
                $.ajax({
                    url: "php/conexion.php",
                    type: "GET",
                    data: {
                        option: "GETPREFIJO",
                        tipo: "isleta",
                        id: isletaActivaId
                    },
                    success: function (response) {
                        var prefijo = JSON.parse(response);
                        if(prefijo == "" ){
                            alert("No se ha seleccionado ninguna isleta");
                        }
                        prefijo = prefijo[0].prefijo;
                        if (!prefijo) {
                            prefijo = "XXX";
                        }
                            var etiqueta = $("<div class='etiqueta' id='"+ prefijo + contador +"'><h2>" + nombre + "(" + prefijo + contador + ")" + "</h2></div>");


                            var mainContentWidth = $(".isleta#" + isletaActivaId).width();
                            var mainContentHeight = $(".isleta#" + isletaActivaId).height();
                            //AQUI HAY QUE SELECCIONAR A LA ZONA A LA QUE QUIERES
                            $(".isleta#" + isletaActivaId).append(etiqueta);
                            etiqueta
                                .css({
                                    'position': 'absolute'
                                })
                                .draggable({
                                    containment: ".isleta#" + isletaActivaId,

                                })

                            $.ajax({
                                url: "php/conexion.php",
                                type: "POST",
                                data: {
                                    option: "INSERT",
                                    mac: mac,
                                    nombre: nombre,
                                    id: contador, // Asignar el ID único a la etiqueta
                                    x: etiqueta.position().left,
                                    y: etiqueta.position().top,
                                    tipo: "etiqueta",
                                    id_isleta: isletaActivaId,
                                    prefijo: prefijo + contador
                                },
                                success: function (response) {
                                    console.log(response); // Manejar la respuesta del servidor
                                    $('#añadirEtiquetaModal').modal('hide');
                                    $('#etiqueta-' + contador).addClass("etiquetaActiva");
                                },
                                error: function (xhr, status, error) {
                                    console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
                                }
                            })





                        
                    },
                    error: function (xhr, status, error) {
                    }
                })




            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
            }
        });
    });


    $("#añadirZona").click(function () {
        if ($(".zona")) {
            $(".zona").removeClass("zonaActiva");
        }
        $('.containerCentral').empty();
        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "LASTID",
                tipo: "zona"
            },
            success: function (response) {
                $(".containerDerecha").empty();
                console.log(response);
                contador = JSON.parse(response);
                if (contador.id == 0) {
                    contador = 1;
                } else {
                    contador = contador[0].id + 1;
                }
                var zona = $("<div class='zona' id='" + contador + "'><h2>Zona " + contador + "</h2></div>");
                var mainContentWidth = $(".containerCentral").width();
                var mainContentHeight = $(".containerCentral").height();

                $(".containerCentral").append(zona);
                contador
                zona
                    .resizable({
                        containment: ".containerCentral",
                        width: mainContentWidth,
                        height: mainContentHeight,
                    })

                $.ajax({
                    url: "php/conexion.php",
                    type: "POST",
                    data: {
                        option: "INSERT",
                        id: contador,
                        nombre: "zona-" + contador,
                        tipo: "zona",
                        height: zona.width(),
                        width: zona.height(),
                    },
                    success: function (response) {
                        $('.zona#' + contador).addClass("zonaActiva");
                        zonaActivaId = contador;
                        getZonas();
                    },
                    error: function (xhr, status, error) {
                        console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
                    }
                })

            },
            error: function (xhr, status, error) {

            }
        })
    });




    function actualizarTamaño(elemento, tipo, mac = null) {

        

        var id = elemento.attr("id");

        if (tipo == "isleta") {
            var x = elemento.position().left;
            var y = elemento.position().top;
            var id = id.substring(7);
        } else if (tipo == "zona") {
            
        } else if (tipo == "etiqueta") {
            var id = id.substring(9);
        }
        var height = elemento.height();
        var width = elemento.width();

        // Enviar las dimensiones a la base de datos
        $.ajax({
            url: "php/conexion.php",
            type: "POST",
            data: {
                id: id,
                height: height,
                width: width,
                x: x,
                y: y,
                option: "UPDATE",
                tipo: tipo
            },
            success: function (response) {
                console.log("Se ha actualizado correctamente"); // Manejar la respuesta del servidor
                // Cambiamos la isleta activa
                $('#isleta-' + isletaActivaId).removeClass('isletaActiva');
                isletaActivaId = id;
                $('#isleta-' + isletaActivaId).addClass("isletaActiva");
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
            }
        });
    };

    observer = new MutationObserver(function (mutations) {
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
        });
    });

    var observerOptions = {
        attributes: true,
        attributeFilter: ['style'],
        subtree: true
    };

    // Observar cambios en el contenedo
    observer.observe(document.getElementById('containerAreas'), observerOptions);

    //Seleccionar la zona activa

    $(document).on('click', '.zona', function () {
        $('.zona#' + zonaActivaId).removeClass("zonaActiva");
        zonaActivaId = $(this).attr('id');
        $('.zona#' + zonaActivaId).addClass("zonaActiva");
        console.log('Zona activa seleccionada:', zonaActivaId);

    });

    //Seleccionar la isleta activa

    $(document).on('click', '.isleta', function () {
        
        $(".isleta#" + isletaActivaId).removeClass("isletaActiva");
        isletaActivaId = $(this).attr('id');
        $(".isleta#" + isletaActivaId).addClass("isletaActiva");
        console.log('Isleta activa seleccionada:', isletaActivaId);

    });

    //Seleccionar la etiqueta activa

    $(document).on('click', '.etiqueta', function () {
        $('.etiqueta#' + etiquetaActivaId).removeClass("etiquetaActiva");
        etiquetaActivaId = $(this).attr('id');
        $('.etiqueta#' + etiquetaActivaId).addClass("etiquetaActiva");
        console.log('Etiqueta activa seleccionada:', etiquetaActivaId);

    });


    $(document).on('click', '.mostrarZona', function () {
        alert("La zona actual se ha guardado, cambiando de zona...");
        zonaAMostrar = $(this).attr('id');
        zonaActivaId = zonaAMostrar;
        $('.containerCentral').empty();

        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "GETISLETASBYZONAID",
                tipo: "zona",
                idZona: zonaActivaId,
            },
            success: function (response) {

                var isletasInfo = JSON.parse(response);
                console.log(isletasInfo);

                $.ajax({
                    url: "php/conexion.php",
                    type: "GET",
                    data: {
                        option: "GetZonaByID",
                        tipo: "zona",
                        idZona: zonaActivaId,
                    },
                    success: function (response) {
                        var infoZona = JSON.parse(response);
                        var zona = $("<div class='zona' id='" + zonaAMostrar + "' style='"
                            + "width: " + infoZona[0].width + "px;" +
                            "height: " + infoZona[0].height + "px;" +
                            "'><h2>Zona " + zonaActivaId + "</h2></div>");
                        var mainContentWidth = $(".containerCentral").width();
                        var mainContentHeight = $(".containerCentral").height();

                        $(".containerCentral").append(zona);
                        zona
                            .css({
                                'width': infoZona.width + "px",
                                'height': infoZona.height + "px"
                            })
                            .resizable({
                                containment: ".containerCentral",
                                width: mainContentWidth,
                                height: mainContentHeight,
                            })

                        isletasInfo.forEach(isleta => {
                            var isletaACrear = $("<div class='isleta' id='" + isleta.id + "'><h2>" + isleta.nombre + "(" + isleta.prefijo + ")</h2></div>");

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
                            $("#" + zonaAMostrar).append(isletaACrear);
                            $.ajax({
                                url: "php/conexion.php",
                                type: "GET",
                                data: {
                                    option: "GETETIQUETASBYISLETAID",
                                    tipo: "etiqueta",
                                    id: isleta.id,
                                },
                                success: function (response) {
                                    var etiquetasInfo = JSON.parse(response);
                                    console.log(etiquetasInfo);
                                    etiquetasInfo.forEach(etiqueta => {

                                        var etiqueta = $("<div class='etiqueta' id='"+ etiqueta.prefijo + etiqueta.id + +"'><h2>" + etiqueta.nombre + "(" + etiqueta.prefijo + etiqueta.id + ")" + "</h2></div>");
                                        console.log(isleta.id + "AAAAAAAAAAAAAAAAaaaa");

                                        var mainContentWidth = $(".isleta#" + isleta.id).width();
                                        var mainContentHeight = $(".isleta#" + isleta.id).height();
                                        //AQUI HAY QUE SELECCIONAR A LA ZONA A LA QUE QUIERES
                                        $(".isleta#" + isleta.id).append(etiqueta);
                                        etiqueta
                                            .css({
                                                'position': 'absolute',
                                                'left': etiqueta.x + "px",
                                                'top': etiqueta.y + "px",
                                                maxHeight: mainContentHeight,
                                                maxWidth: mainContentWidth,
                                                position: 'absolute'
                                            })
                                            .draggable({
                                                containment: ".isleta#" + isleta.id
                                            })
                                            
                                    }); 
                                },
                                error: function (xhr, status, error) {
                                    reject(error);
                                }
                            });


                        });
                        $('.zona#' + zonaAMostrar).addClass("zonaActiva");
                        
                    },
                    error: function (xhr, status, error) {
                        reject(error);
                    }
                });






            }
        })

    });

    $(document).on('click', '.eliminarZona', function () {

        var idZona = $(this).attr('id');
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
                console.log(response);
                $(".containerDerecha").empty();
                getZonas();
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
            }
        });
    });

});

