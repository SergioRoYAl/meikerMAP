document.addEventListener("DOMContentLoaded", function () {

    //VASVARIABLES

    var zonaActivaId = null;
    var isletaActivaId = null;
    var etiquetaActivaId = null;
    var letrasPrefijo = null;
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

    //VOY A HACER

    //OBTIENE LAS ZONAS
    function getElementos($tipo) {
        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "GETALL",
                tipo: $tipo,
            },
            success: function (response) {

                var zonasInfo = JSON.parse(response);
                $(".containerDerecha").append("<ul class='list-group' id=ul></ul>");

                //Esto es para cargar limpiamente las zonas que nos dan de opcion al agregar una isleta
                var selectZona = $("#zonaPerteneciente");
                selectZona.empty();

                zonasInfo.forEach(zona => {
                    //Limpiar las zonas cargadas, para cargarlas de nuevo

                    var zonaEstructura = $("<div class='d-flex flex-column'><li class='list-group-item' ><p style='font-size: 30px'><button class='btn btn-success mostrarZona '  id='z" + zona.id + "'>VER </button> " + zona.nombre + "<button class='btn btn-danger eliminarZona ms-3' id='eliminarZona-" + zona.id + "'>X</button> </p></li></div>");
                    $("#ul").append(zonaEstructura);


                    selectZona.append('<option value="' + zona.id + '">' + zona.nombre + '</option>');

                });
            }



            //CARGANO LAS ZONAS EN LA PAGINA PRINCIPAL



        });
    }

    function getIsletas() {
        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "GETALL",
                tipo: "isleta",
            },
            success: function (response) {

                var zonasInfo = JSON.parse(response);
                $(".containerDerecha").append("<ul class='list-group' id=ul></ul>");

                //Esto es para cargar limpiamente las zonas que nos dan de opcion al agregar una isleta
                var selectZona = $("#zonaPerteneciente");
                selectZona.empty();

                zonasInfo.forEach(zona => {
                    //Limpiar las zonas cargadas, para cargarlas de nuevo

                    var zonaEstructura = $("<div class='d-flex flex-column'><li class='list-group-item' ><p style='font-size: 30px'><button class='btn btn-success mostrarZona '  id='z" + zona.id + "'>VER </button> " + zona.nombre + "<button class='btn btn-danger eliminarZona ms-3' id='eliminarZona-" + zona.id + "'>X</button> </p></li></div>");
                    $("#ul").append(zonaEstructura);


                    selectZona.append('<option value="' + zona.id + '">' + zona.nombre + '</option>');

                });
            }
        });
    }

    getElementos("zona");

    //EVENT LISTENERS

    formIsleta.addEventListener("submit", function (event) {
        if ($(".isleta")) {
            $(".isleta").removeClass("isletaActiva");
        }
        // Detener el comportamiento predeterminado de enviar el formulario
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        var nombre = document.getElementById("nombreIsleta").value;
        var prefijo = document.getElementById("prefijoEtiquetas").value;
        console.log(prefijo)
        switch (prefijo) {
            case "..":
                letrasPrefijo = 2;
                break;
            case "...":
                letrasPrefijo = 3;
                break;
        }


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
                var isleta = $("<div class='isleta' id='i" + contador + "'><p>" + nombre + "(" + prefijo + ")" + "</p></div>");

                var mainContentWidth = $('#z' + zonaActivaId.substring(1)).width();
                var mainContentHeight = $("#z" + zonaActivaId.substring(1)).height();
                //AQUI HAY QUE SELECCIONAR A LA ZONA A LA QUE QUIERES
                $("#z" + zonaActivaId.substring(1)).append(isleta);
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
                        id_zona: zonaActivaId.substring(1),
                        prefijo: prefijo
                    },
                    success: function (response) {
                        $('#añadirIsletaModal').modal('hide');
                        $('#i' + contador).addClass("isletaActiva");
                        isletaActivaId = "i" + contador;
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
        if (isletaActivaId == null) {
            var isletaActivaId = document.getElementById("isletaPerteneciente").value;
        } else {
            var isletaActivaId = isletaActivaId.substring(1)
        }
        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "LASTID",
                tipo: "etiqueta",
                id_isleta: isletaActivaId
            },
            success: function (response) {
                // Una vez tenemos el ultimo id añadimos el div
                contador = JSON.parse(response);
                if (contador[0]['MAX(id)'] == null) {
                    contador = 0;
                } else {
                    contador = contador[0]['MAX(id)'] + 1;
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
                        if (prefijo == "") {
                            alert("No se ha seleccionado ninguna isleta");
                        }
                        prefijo = prefijo[0].prefijo;
                        if (!prefijo) {
                            prefijo = "XXX";
                        }
                        var etiqueta = $("<div class='etiqueta' id='" + prefijo + contador + "'><p>" + nombre + "(" + prefijo + contador + ")" + "</p></div>");


                        var mainContentWidth = $("#" + isletaActivaId).width();
                        var mainContentHeight = $("#" + isletaActivaId).height();
                        //AQUI HAY QUE SELECCIONAR A LA ZONA A LA QUE QUIERES
                        
                        $("#i" + isletaActivaId).append(etiqueta);
                        etiqueta
                            .css({
                                'position': 'absolute',
                                'display': 'flex',
                                'flex-direction': 'column',
                                'position': 'absolute',
                                maxHeight: mainContentHeight,
                                maxWidth: mainContentWidth,

                            })
                            .draggable({
                                containment: "#i" + isletaActivaId,
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
                                $('#añadirEtiquetaModal').modal('hide');
                                $('#e' + contador).addClass("etiquetaActiva");
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
                contador = JSON.parse(response);
                if (contador.id == 0) {
                    contador = 1;
                } else {
                    contador = contador[0].id + 1;
                }
                zonaActivaId = "z" + contador;
                var zona = $("<div class='zona' id='z" + contador + "'><h2>Zona " + contador + "</h2></div>");
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
                        $('#z' + contador).addClass("zonaActiva");
                        zonaActivaId = "z" + contador;
                        getElementos("zona");
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




    function actualizarTamaño(elemento, tipo) {
        var data = {
            option: "UPDATE",
            tipo: tipo
        };

        switch (tipo) {
            case 'isleta':
                data.id = elemento.attr("id").substring(1);
                data.x = elemento.position().left;
                data.y = elemento.position().top;
                data.height = elemento.height();
                data.width = elemento.width();
                console.log(data)
                break;
            case 'zona':
                data.id = elemento.attr("id").substring(1);
                data.height = elemento.height();
                data.width = elemento.width();
                break;
            case 'etiqueta':
                data.id = elemento.attr("id")
                data.prefijo = elemento.attr("id");
                data.x = elemento.position().left;
                data.y = elemento.position().top;
                console.log(data);
                break;
        }


        // Enviar las dimensiones a la base de datos
        $.ajax({
            url: "php/conexion.php",
            type: "POST",
            data: data,
            success: function (response) {
                console.log("Se ha actualizado correctamente"); // Manejar la respuesta del servidor
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
        $('#' + zonaActivaId).removeClass("zonaActiva");
        zonaActivaId = $(this).attr('id');
        $('#' + zonaActivaId).addClass("zonaActiva");
        console.log('Zona activa seleccionada:', zonaActivaId);

    });

    //Seleccionar la isleta activa

    $(document).on('click', '.isleta', function () {

        $("#" + isletaActivaId).removeClass("isletaActiva");
        isletaActivaId = $(this).attr('id');
        $("#" + isletaActivaId).addClass("isletaActiva");
        console.log('Isleta activa seleccionada:', isletaActivaId);

    });

    //Seleccionar la etiqueta activa

    $(document).on('click', '.etiqueta', function () {
        $('#e' + etiquetaActivaId).removeClass("etiquetaActiva");
        etiquetaActivaId = $(this).attr('id');
        $('#e' + etiquetaActivaId).addClass("etiquetaActiva");
        console.log('Etiqueta activa seleccionada:', etiquetaActivaId);

    });


    $(document).on('click', '.mostrarZona', function () {

        zonaAMostrar = $(this).attr('id');
        zonaActivaId = zonaAMostrar;

        alert("La zona actual se ha guardado, cambiando de zona...");

        $('.containerCentral').empty();



        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "GETISLETASBYZONAID",
                tipo: "zona",
                idZona: zonaActivaId.substring(1),
            },
            success: function (response) {

                var isletasInfo = JSON.parse(response);

                $.ajax({
                    url: "php/conexion.php",
                    type: "GET",
                    data: {
                        option: "GetZonaByID",
                        tipo: "zona",
                        idZona: zonaActivaId.substring(1),
                    },
                    success: function (response) {
                        var infoZona = JSON.parse(response);
                        console.log(infoZona);
                        var zona = $("<div class='zona' id='" + zonaAMostrar + "' style='"
                            + "width: " + infoZona[0].width + "px;" +
                            "height: " + infoZona[0].height + "px;" +
                            "'><h2>Zona " + zonaActivaId.substring(1) + "</h2></div>");
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
                            var isletaACrear = $("<div class='isleta' id='i" + isleta.id + "'><p>" + isleta.nombre + "(" + isleta.prefijo + ")</p></div>");

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

                            // console.log("Zona a mostrar" + zonaAMostrar);     zID
                            // console.log("isleta id" + isleta.id);              ID

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

                                    etiquetasInfo.forEach(etiqueta => {
                                        var x = etiqueta.x;
                                        var y = etiqueta.y;
                                        var etiqueta = $("<div class='etiqueta' id='" + etiqueta.prefijo + "'><p>" + etiqueta.nombre + "(" + etiqueta.prefijo + ")</p></div>");


                                        var mainContentWidth = $("#i" + isleta.id).width();
                                        var mainContentHeight = $("#i" + isleta.id).height();
                                        //AQUI HAY QUE SELECCIONAR A LA ZONA A LA QUE QUIERES
                                        $("#i" + isleta.id).append(etiqueta);
                                        etiqueta
                                            .css({
                                                'display': 'flex',
                                                'flex-direction': 'column',
                                                'position': 'absolute',
                                                'left': x + "px",
                                                'top': y + "px",
                                                maxHeight: mainContentHeight,
                                                maxWidth: mainContentWidth,
                                            })
                                            .draggable({
                                                containment: "#i" + isleta.id
                                            })

                                    });
                                },
                                error: function (xhr, status, error) {
                                    reject(error);
                                }
                            });


                        });
                        $('#' + zonaAMostrar).addClass("zonaActiva");

                    },
                    error: function (xhr, status, error) {
                        reject(error);
                    }
                });






            }
        })

    });

    $(document).on('click', '#añadirEtiqueta', function () {
        zonaId = zonaActivaId.substring(1);
        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "GETISLETASBYZONAID",
                tipo: "zona",
                idZona: zonaId,
            },
            success: function (response) {
                var isletas = JSON.parse(response);
                var selectIsleta = $("#isletaPerteneciente");
                isletas.forEach(isleta => {

                    selectIsleta.append('<option value="' + isleta.id + '">' + isleta.nombre + '</option>');

                });
            },
            error: function (xhr, status, error) {
                console.log(xhr, status, error)
            }
        })
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
                getElementos("zona");
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText); // Manejar errores de la solicitud AJAX
            }
        });
    });

});

