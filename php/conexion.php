<?php
//INCLUYO LOS IMPORTS NECESARIOS PARA QUE FUNCIONE LA CONEXION
@include("imports.php");

$conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

//OPTION ES LA VARIABLE QUE DETERMINA QUE ACCION SE VA A REALIZAR
//INSERT, UPDATE, DELETE, GETALL, GETBYID, GETLASTID
//Y LUEGO FILTRAMOS POR EL TIPO DE ELEMENTO: ISLETA, ZONA, ETIQUETA
//

if (isset($_POST['option'])) {
    switch ($_POST['option']) {
        case "INSERT":

            if ($_POST['tipo'] == 'isleta') {
                $sql = "INSERT INTO isleta (nombre, height, width, x, y, id_zona, prefijo, redonda) VALUES (:nombre, :height, :width, :x, :y, :id_zona, :prefijo, :redonda)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':x', $_POST['x']);
                $stmt->bindParam(':y', $_POST['y']);
                $stmt->bindParam(':nombre', $_POST['nombre']);
                $stmt->bindParam(':height', $_POST['height']);
                $stmt->bindParam(':width', $_POST['width']);
                $stmt->bindParam(':id_zona', $_POST['id_zona']);
                $stmt->bindParam(':prefijo', $_POST['prefijo']);
                $stmt->bindParam(':redonda', $_POST['redonda']);
                $stmt->execute();
                $id_objeto_creado = $conn->lastInsertId();
                echo $id_objeto_creado;
                break;
            } else if ($_POST['tipo'] == 'zona') {
                $nombre = $_POST['nombre'];
                $height = $_POST['height'];
                $width = $_POST['width'];
                $sql = "INSERT INTO zona (nombre, height, width) VALUES (:nombre, :height, :width)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':nombre', $nombre);
                $stmt->bindParam(':height', $height);
                $stmt->bindParam(':width', $width);
                $stmt->execute();
                $id_objeto_creado = $conn->lastInsertId();
                echo $id_objeto_creado;
                break;
            } else if ($_POST['tipo'] == 'etiqueta') {
                $nombre = $_POST['nombre'];
                $y = $_POST['y'];
                $x = $_POST['x'];
                $mac = $_POST['mac'];
                $id_isleta = $_POST['id_isleta'];
                $prefijo = $_POST['prefijo'];
                $posicion = $_POST['posicion'];
                $sql = "INSERT INTO etiqueta (nombre, mac, x, y, id_isleta, prefijo, posicion) VALUES (:nombre, :mac, :x, :y, :id_isleta, :prefijo, :posicion)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':nombre', $nombre);
                $stmt->bindParam(':y', $y);
                $stmt->bindParam(':x', $x);
                $stmt->bindParam(':mac', $mac);
                $stmt->bindParam(':id_isleta', $id_isleta);
                $stmt->bindParam(':prefijo', $prefijo);
                $stmt->bindParam(':posicion', $posicion);
                $stmt->execute();
                $id_objeto_creado = $conn->lastInsertId();
                echo $id_objeto_creado;
                break;
            } else if ($_POST['tipo'] == 'etiquetaFull') {
                $nombre = $_POST['nombre'];
                $y = $_POST['y'];
                $x = $_POST['x'];
                $mac = $_POST['mac'];
                $id_isleta = $_POST['id_isleta'];
                $prefijo = $_POST['prefijo'];
                $sql = "INSERT INTO etiqueta (nombre, mac, x, y, id_isleta, prefijo) VALUES (:nombre, :mac, :x, :y, :id_isleta, :prefijo)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':nombre', $nombre);
                $stmt->bindParam(':y', $y);
                $stmt->bindParam(':x', $x);
                $stmt->bindParam(':mac', $mac);
                $stmt->bindParam(':id_isleta', $id_isleta);
                $stmt->bindParam(':prefijo', $prefijo);
                $stmt->execute();
                break;
            } else if ($_POST['tipo'] == 'ap') {
                $sql = "INSERT INTO ap (nombre, x, y, id_zona) VALUES (:nombre, :x, :y, :id_zona)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':x', $_POST['x']);
                $stmt->bindParam(':y', $_POST['y']);
                $stmt->bindParam(':nombre', $_POST['nombre']);
                $stmt->bindParam(':id_zona', $_POST['id_zona']);
                $stmt->execute();
                $id_objeto_creado = $conn->lastInsertId();
                echo $id_objeto_creado;
                break;
            }


        case "UPDATE":
            if (isset($_POST['tipo'])) {
                $tipo = $_POST['tipo'];
                switch ($tipo) {
                    case 'isleta':
                        $sql = "UPDATE $tipo SET height = :height, width = :width, x = :x, y = :y where id = :id";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':id', $_POST['id']);
                        $stmt->bindParam(':height', $_POST['height']);
                        $stmt->bindParam(':width', $_POST['width']);
                        $stmt->bindParam(':x', $_POST['x']);
                        $stmt->bindParam(':y', $_POST['y']);
                        $stmt->execute();
                        break;
                    case 'zona':
                        $sql = "UPDATE $tipo SET height = :height, width = :width where id = :id";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':id', $_POST['id']);
                        $stmt->bindParam(':height', $_POST['height']);
                        $stmt->bindParam(':width', $_POST['width']);
                        $stmt->execute();
                        break;
                    case 'etiqueta':
                        $sql = "UPDATE $tipo SET x = :x, y = :y where id = :id";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':id', $_POST['id']);
                        $stmt->bindParam(':x', $_POST['x']);
                        $stmt->bindParam(':y', $_POST['y']);
                        $stmt->execute();
                        break;
                    case 'etiquetaMac':
                        $sql = "UPDATE etiqueta SET x = :x, y = :y, prefijo = :prefijo, id_isleta = :id_isleta where mac = :mac";
                        $stmt = $conn->prepare($sql);
                        $x = $_POST['x'];
                        $y = $_POST['y'];
                        $prefijo = $_POST['prefijo'];
                        $id_isleta = $_POST['id_isleta'];
                        $mac = $_POST['mac'];
                        $stmt->bindParam(':prefijo', $prefijo);
                        $stmt->bindParam(':x', $x);
                        $stmt->bindParam(':y', $y);
                        $stmt->bindParam(':id_isleta', $id_isleta);
                        $stmt->bindParam(':mac', $mac);
                        $stmt->execute();
                        break;
                    case 'ap':
                        $sql = "UPDATE $tipo SET x = :x, y = :y where id = :id";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':id', $_POST['id']);
                        $stmt->bindParam(':x', $_POST['x']);
                        $stmt->bindParam(':y', $_POST['y']);
                        $stmt->execute();
                        break;
                }

                echo "Coordenadas actualizadas correctamente correctamente en la base de datos.";
            } else {
                echo "Error: Altura y anchura no proporcionadas en la solicitud POST.";
            }

            break;

        case "DELETE":
            if (isset($_POST['tipo'])) {
                $id = $_POST['id'];
                $tipo = $_POST['tipo'];
                switch ($_POST['tipo']) {
                    case 'isleta':
                        $sql = "DELETE FROM $tipo WHERE id = :id";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':id', $id);
                        $stmt->execute();
                        echo "Etiqueta eliminada correctamente de la base de datos.";
                        break;
                    case 'etiqueta':
                        $sql = "DELETE FROM $tipo WHERE id = :id";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':id', $id);
                        $stmt->execute();
                        echo "Etiqueta eliminada correctamente de la base de datos.";
                        break;
                    case 'etiquetaFull':
                        $id_isleta = $_POST['id_isleta'];
                        $sql = "DELETE FROM etiqueta WHERE id_isleta = :id_isleta";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':id_isleta', $id_isleta);
                        $stmt->execute();
                        echo "Etiqueta eliminada correctamente de la base de datos.";
                        break;
                    case 'zona':
                        $sql = "DELETE FROM $tipo WHERE id = :id";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':id', $id);
                        $stmt->execute();
                        echo "Zona eliminada correctamente de la base de datos.";
                        break;
                    case 'ap':
                        $sql = "DELETE FROM $tipo WHERE id = :id";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':id', $id);
                        $stmt->execute();
                        echo "AP eliminado correctamente de la base de datos.";
                        break;
                }
            }
    }
} else if (isset($_GET['option'])) {

    switch ($_GET['option']) {
        case "EliminarEtiqueta":
            $id = $_GET['id'];
            $id_isleta = $_GET['id_isleta'];

            

            $sql2 = "UPDATE etiqueta 
            SET posicion = posicion - 1 
            WHERE id_isleta = :id_isleta
            AND posicion >= (SELECT posicion FROM etiqueta WHERE id = :id)";
            $stmt2 = $conn->prepare($sql2);
            $stmt2->bindParam(':id_isleta', $id_isleta);
            $stmt2->bindParam(':id', $id);
            $stmt2->execute();
            $result2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result2);

            $sql1 = "DELETE FROM etiqueta WHERE id = :id";
            $stmt1 = $conn->prepare($sql1);
            $stmt1->bindParam(':id', $id);
            $stmt1->execute();
            $result1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);
            
            break;
        case "GETALL":
            if ($_GET['tipo'] == 'isleta') {
                $sql = "SELECT * FROM isleta ";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
            } else if ($_GET['tipo'] == 'zona') {
                $sql = "SELECT * FROM zona ORDER BY id DESC";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
            }
            break;
        case "getIsletasByZonaID":
            $sql = "SELECT * FROM isleta where id_zona = :id_zona";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id_zona', $_GET['id_zona']);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);
            break;
        case "GetZonaByID":
            $id = $_GET['id_zona'];
            $sql = "SELECT * FROM zona where id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);
            break;
        case "GETPREFIJO":
            if ($_GET['tipo'] == 'isleta') {
                $id = $_GET['id'];
                $sql = "SELECT prefijo FROM isleta where id = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $id);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
            }
            break;
        case "GetEtiquetasByIsletaID":
            $id_isleta = $_GET['id_isleta'];
            $sql = "SELECT * FROM etiqueta where id_isleta = :id_isleta";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id_isleta', $id_isleta);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);
            break;
        case "GetEtiquetaByPrefijo":
            if ($_GET['tipo'] == 'etiqueta') {
                $prefijo = $_GET['prefijo'];
                $sql = "SELECT * FROM etiqueta where prefijo = :prefijo";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':prefijo', $prefijo);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
            }
            break;
        case "GetAPByZonaID":
            $id_zona = $_GET['id_zona'];
            $sql = "SELECT * FROM ap where id_zona = :id_zona";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id_zona', $id_zona);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);
            break;
    }
}
