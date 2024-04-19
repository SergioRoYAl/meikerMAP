<?php

@include("imports.php");

$conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


if (isset($_POST['option'])) {
    switch ($_POST['option']) {
        case "INSERT":

            if ($_POST['tipo'] == 'isleta') {

                $sql = "INSERT INTO isleta (id, nombre, height, width, x, y, id_zona, prefijo) VALUES (:id, :nombre, :height, :width, :x, :y, :id_zona, :prefijo)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':x', $_POST['x']);
                $stmt->bindParam(':y', $_POST['y']);
                $stmt->bindParam(':nombre', $_POST['nombre']);
                $stmt->bindParam(':height', $_POST['height']);
                $stmt->bindParam(':width', $_POST['width']);
                $stmt->bindParam(':id', $_POST['id']);
                $stmt->bindParam(':id_zona', $_POST['id_zona']);
                $stmt->bindParam(':prefijo', $_POST['prefijo']);
                $stmt->execute();

                echo "Almacenado correctamente en la base de datos.";
            } else if ($_POST['tipo'] == 'zona') {
                $id = $_POST['id'];
                $nombre = $_POST['nombre'];
                $height = $_POST['height'];
                $width = $_POST['width'];
                $sql = "INSERT INTO zona (id, nombre, height, width) VALUES (:id, :nombre, :height, :width)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':nombre', $nombre);
                $stmt->bindParam(':id', $id);
                $stmt->bindParam(':height', $height);
                $stmt->bindParam(':width', $width);
                $stmt->execute();
            } else if ($_POST['tipo'] == 'etiqueta') {
                print_r($_POST);
                $id = $_POST['id'];
                $nombre = $_POST['nombre'];
                $y = $_POST['y'];
                $x = $_POST['x'];
                $mac = $_POST['mac'];
                $id_isleta = $_POST['id_isleta'];
                $prefijo = $_POST['prefijo'];
                $sql = "INSERT INTO etiqueta (id, nombre, mac, x, y, id_isleta, prefijo) VALUES (:id, :nombre, :mac, :x, :y, :id_isleta, :prefijo)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $id);
                $stmt->bindParam(':nombre', $nombre);
                $stmt->bindParam(':y', $y);
                $stmt->bindParam(':x', $x);
                $stmt->bindParam(':mac', $mac);
                $stmt->bindParam(':id_isleta', $id_isleta);
                $stmt->bindParam(':prefijo', $prefijo);
                $stmt->execute();
            }
            break;

        case "UPDATE":
            if (isset($_POST['tipo'])) {
                $tipo = $_POST['tipo'];
                $id = $_POST['id'];
                
                switch ($tipo) {
                    case 'isleta':
                        $sql = "UPDATE $tipo SET height = :height, width = :width, x = :x, y = :y where id = :id";
                        $stmt = $conn->prepare($sql);
                        $height = $_POST['height'];
                        $width = $_POST['width'];
                        $x = $_POST['x'];
                        $y = $_POST['y'];
                        $stmt->bindParam(':id', $id);
                        $stmt->bindParam(':height', $height);
                        $stmt->bindParam(':width', $width);
                        $stmt->bindParam(':x', $x);
                        $stmt->bindParam(':y', $y);
                        break;
                    case 'zona':
                        $sql = "UPDATE $tipo SET height = :height, width = :width where id = :id";
                        $stmt = $conn->prepare($sql);
                        $height = $_POST['height'];
                        $width = $_POST['width'];
                        $stmt->bindParam(':id', $id);
                        $stmt->bindParam(':height', $height);
                        $stmt->bindParam(':width', $width);
                        break;
                    case 'etiqueta':
                        $sql = "UPDATE $tipo SET x = :x, y = :y where prefijo = :prefijo";
                        $stmt = $conn->prepare($sql);
                        $x = $_POST['x'];
                        $y = $_POST['y'];
                        $stmt->bindParam(':prefijo', $id);
                        $stmt->bindParam(':x', $x);
                        $stmt->bindParam(':y', $y);
                        break;
                }
                $stmt->execute();
                echo "Coordenadas actualizadas correctamente correctamente en la base de datos.";
            } else {
                echo "Error: Altura y anchura no proporcionadas en la solicitud POST.";
            }

            break;

        case "DELETE":
            if (isset($_POST['tipo'])) {
                $tipo = $_POST['tipo'];
                $id = $_POST['id'];
                $sql = "DELETE FROM $tipo WHERE id = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $id);
                $stmt->execute();
            }
            break;
    }
} else if (isset($_GET['option'])) {
    switch ($_GET['option']) {
        case "LASTID":
            if ($_GET['tipo'] == "zona" || $_GET['tipo'] == "isleta") {
                try {
                    $tipo = $_GET['tipo'];
                    $sql = "SELECT * FROM $tipo where id = (SELECT MAX(id) FROM $tipo)";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute();
                    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    if (count($result) == 0) {
                        echo json_encode(array("id" => 0));
                    } else {
                        echo json_encode($result);
                    }
                } catch (PDOException $e) {
                    echo "Error de conexión: " . $e->getMessage();
                }
            } else if ($_GET['tipo'] == "etiqueta") {
                try {
                    $tipo = $_GET['tipo'];
                    $id_isleta = $_GET['id_isleta'];
                    $sql = "SELECT MAX(id) FROM $tipo WHERE id_isleta = :id_isleta";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':id_isleta', $id_isleta);
                    $stmt->execute();
                    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    echo json_encode($result);
                } catch (PDOException $e) {
                    echo "Error de conexión: " . $e->getMessage();
                }
            }

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
        case "GETISLETASBYZONAID":
            if ($_GET['tipo'] == 'zona') {
                $sql = "SELECT * FROM isleta where id_zona = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $_GET['idZona']);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
            }
            break;
        case "GetZonaByID":
            if ($_GET['tipo'] == 'zona') {
                $id = $_GET['idZona'];
                $sql = "SELECT * FROM zona where id = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $id);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
            }
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
        case "GETETIQUETASBYISLETAID":
            if ($_GET['tipo'] == 'etiqueta') {
                $id = $_GET['id'];
                $sql = "SELECT * FROM etiqueta where id_isleta = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $id);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
            }
            break;
    }
}
