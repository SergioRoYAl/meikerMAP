document.addEventListener("DOMContentLoaded", function () {

    //VASVARIABLES

    var zonaActivaId = null;
    var isletaActivaId = null;
    var etiquetaActivaId = null;

    var form = document.getElementById("isletaForm");

    //FUNCIONES

    function getZonaById(idZonaBuscada) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "php/conexion.php",
                type: "GET",
                data: {
                    option: "GetZonaByID",
                    tipo: "zona",
                    idZona: idZonaBuscada,
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

                    var zonaEstructura = $("<div class='d-flex flex-column'><li class='list-group-item' ><button class='btn btn-success mostrarZona' id='zonaMostrar-" + zona.id + "'>VER </button> " + zona.nombre + " </p></li></div>");
                    $("#ul").append(zonaEstructura);


                    selectZona.append('<option value="' + zona.id + '">' + zona.nombre + '</option>');

                });
            }


            //CARGANO LAS ZONAS EN LA PAGINA PRINCIPAL



        });
    }


    getZonas();
    //EVENT LISTENERS

    form.addEventListener("submit", function (event) {
        if ($(".isleta")) {
            $(".isleta").removeClass("zonaActiva");
        }
        // Detener el comportamiento predeterminado de enviar el formulario
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        var nombre = document.getElementById("nombreIsleta").value;
        var prefijo = document.getElementById("prefijoEtiquetas").value;

        console.log(nombre);
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
                var isleta = $("<div class='isleta' id='isleta-" + contador + "'><h2>" + nombre + "(" + prefijo + ")" + "</h2></div>");


                var mainContentWidth = $("#zona-" + zonaActivaId.substring(5)).width();
                var mainContentHeight = $("#zona-" + zonaActivaId.substring(5)).height();

                console.log(mainContentHeight)
                console.log(mainContentWidth)
                //AQUI HAY QUE SELECCIONAR A LA ZONA A LA QUE QUIERES
                $("#zona-" + zonaActivaId.substring(5)).append(isleta);
                isleta
                    .draggable({
                        containment: "#zona-" + zonaActivaId.substring(5)
                    })
                    .resizable({
                        containment: "#zona-" + zonaActivaId.substring(5),
                        maxWidth: mainContentWidth,
                        maxHeight: mainContentHeight,
                        minWidth: 100, // Establece el ancho mínimo permitido
                        minHeight: 100 // Establece la altura mínima permitida
                    })

                $.ajax({
                    url: "php/conexion.php",
                    type: "POST",
                    data: {
                        option: "INSERT",
                        idKey: contador,
                        nombre: nombre,
                        id: "isleta-" + contador, // Asignar el ID único al cuadrado
                        height: isleta.width(),
                        width: isleta.height(),
                        x: isleta.position().left,
                        y: isleta.position().top,
                        tipo: "isleta",
                        id_zona: zonaActivaId.substring(5),
                        prefijo: prefijo
                    },
                    success: function (response) {
                        console.log(response); // Manejar la respuesta del servidor
                        $('#exampleModal').modal('hide');
                        $('#isleta-' + contador).addClass("isletaActiva");
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

    $("#añadirZona").click(function () {
        if ($(".zona")) {
            $(".zona").removeClass("zonaActiva");
        }
        $.ajax({
            url: "php/conexion.php",
            tipo: "GET",
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
                var zona = $("<div class='zona' id='zona-" + contador + "'><h2>Zona " + contador + "</h2></div>");
                var mainContentWidth = $(".containerCentral").width();
                var mainContentHeight = $(".containerCentral").height();

                $(".containerCentral").append(zona);
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
                    },
                    success: function (response) {
                        console.log(response); // Manejar la respuesta del servidor
                        $('#zona-' + contador).addClass("zonaActiva");
                        //Recargar las zonas
                        getZonas();
                        zonaActivaId = "zona-" + contador;
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

        var id = elemento.attr("id");
        console.log(id + "SSSSAAA");
        if (tipo == "isleta") {
            var x = elemento.position().left;
            var y = elemento.position().top;
            var id = id.substring(7);
        } else if (tipo == "zona") {
            var id = id.substring(5);
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
                $('#' + isletaActivaId).removeClass('isletaActiva');
                isletaActivaId = id;
                $('#' + isletaActivaId).addClass("isletaActiva");
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
                console.log($(mutation.target));
                actualizarTamaño($(mutation.target), "isleta");
            }
            if ($(mutation.target).hasClass('zona')) {
                console.log($(mutation.target));
                actualizarTamaño($(mutation.target), "zona");
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
        $('#' + isletaActivaId).removeClass("isletaActiva");
        isletaActivaId = $(this).attr('id');
        $('#' + isletaActivaId).addClass("isletaActiva");
        console.log('Isleta activa seleccionada:', isletaActivaId);

    });


    $(document).on('click', '.mostrarZona', function () {
        alert("La zona actual se ha guardado, cambiando de zona...");
        zonaAMostrar = $(this).attr('id');
        $('.containerCentral').empty();

        $.ajax({
            url: "php/conexion.php",
            type: "GET",
            data: {
                option: "GETISLETASBYZONAID",
                tipo: "zona",
                idZona: zonaAMostrar.substring(12),
            },
            success: function (response) {

                getZonaById(zonaAMostrar.substring(12))
                    .then(function (infoZona) {
                        
                        var zona = $("<div class='zona' id='" + zonaAMostrar + "'><h2>Zona " + zonaAMostrar.substring(12) + "</h2></div>");
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

                        var isletasInfo = JSON.parse(response);
                        isletasInfo.forEach(isleta => {
                            var isleta = $("<div class='isleta' id='isleta-" + isleta.id + "'><h2>" + isleta.nombre + "(" + isleta.prefijo + ")</h2></div>");

                            isleta
                                .css({
                                    'left': isleta.x + "px",
                                    'top': isleta.y + "px",
                                    'width': isleta.width + "px",
                                    'height': isleta.height + "px"
                                })
                                .draggable({
                                    containment: ".containerCentral"
                                })
                                .resizable({
                                    containment: ".containerCentral",
                                    maxWidth: $(".containerCentral").width(),
                                    maxHeight: $(".containerCentral").height(),
                                    minWidth: 100, // Establece el ancho mínimo permitido
                                    minHeight: 100 // Establece la altura mínima permitida
                                })
                            $("#" + zonaAMostrar).append(isleta);

                        });
                        $('#' + zonaAMostrar).addClass("zonaActiva");
                    })


            }
        })

        console.log(zonaAMostrar);

    });

});

