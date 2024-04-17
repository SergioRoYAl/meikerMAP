document.addEventListener("DOMContentLoaded", function () {

    //VASVARIABLES

    var zonaActivaId = null;
    var form = document.getElementById("isletaForm");

    //FUNCIONES

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

                var selectZona = $("#zonaPerteneciente");
                    selectZona.empty();
                
                zonasInfo.forEach(zona => {
                    //Limpiar las zonas cargadas, para cargarlas de nuevo
                    
                    var zonaEstructura = $("<div class='d-flex flex-column'><li class='list-group-item' id='zona-" + zona.id + "'><a href='google.es'>VER</a> " + zona.nombre + " </p></li></div>");
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
            if($(".zona")){
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
                            zonaActivaId = contador;
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




        function actualizarTamaño(elemento) {
            var id = elemento.attr("id");
            var height = elemento.height();
            var width = elemento.width();
            var x = elemento.position().left;
            var y = elemento.position().top;
            // Enviar las dimensiones a la base de datos
            $.ajax({
                url: "php/conexion.php",
                type: "POST",
                data: {
                    id: id.substring(7),
                    height: height,
                    width: width,
                    x: x,
                    y: y,
                    option: "UPDATE",
                    tipo: "isleta"
                },
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
                    console.log($(mutation.target));
                    actualizarTamaño($(mutation.target));
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

        $(document).on('click', '.zona', function () {
            zonaActivaId = $(this).attr('id');
            console.log('Zona activa seleccionada:', zonaActivaId);
        });


    });

