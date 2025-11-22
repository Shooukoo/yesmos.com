<?php
// refacciones.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permite que tu sitio lea los datos

// 1. Obtener el HTML de la página
$url = "https://www.anegocios.com.mx/99/PLAZA_TELCEL";
$options = [
    "http" => [
        "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    ]
];
$context = stream_context_create($options);
$html = file_get_contents($url, false, $context);

if ($html === FALSE) {
    echo json_encode(["error" => "No se pudo cargar la página externa"]);
    exit;
}

// 2. Parsear el HTML (Usando DOMDocument)
$dom = new DOMDocument;
libxml_use_internal_errors(true); // Ocultar errores de HTML mal formado
$dom->loadHTML($html);
libxml_clear_errors();

$xpath = new DOMXPath($dom);
$products = [];

// Buscar todos los divs con clase "fly"
$nodes = $xpath->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' fly ')]");

foreach ($nodes as $index => $node) {
    // Nombre (está en una etiqueta <p>)
    $pNodes = $xpath->query(".//p", $node);
    $name = $pNodes->length > 0 ? trim($pNodes->item(0)->nodeValue) : "Sin nombre";

    // Precio (está en una etiqueta <span>)
    $spanNodes = $xpath->query(".//span", $node);
    $priceText = $spanNodes->length > 0 ? trim($spanNodes->item(0)->nodeValue) : "0";
    $price = floatval(preg_replace('/[^0-9.]/', '', $priceText));

    // Imagen (está en .imgProd img)
    $imgNodes = $xpath->query(".//div[contains(@class, 'imgProd')]//img", $node);
    $image = "";
    if ($imgNodes->length > 0) {
        $image = $imgNodes->item(0)->getAttribute('src');
    }

    // URL (data-url en .linkDetalleProd)
    $linkNodes = $xpath->query(".//div[contains(@class, 'linkDetalleProd')]", $node);
    $url = "#";
    if ($linkNodes->length > 0) {
        $relativeUrl = $linkNodes->item(0)->getAttribute('data-url');
        $url = "https://www.anegocios.com.mx" . $relativeUrl;
    }

    // Categorización (Lógica portada de JS a PHP)
    $category = "Otros";
    $n = strtoupper($name);

    if (strpos($n, "DIS") !== false || strpos($n, "LCD") !== false || strpos($n, "PANTALLA") !== false) {
        $category = "Pantallas";
    } elseif (strpos($n, "BAT") !== false || strpos($n, "PILA") !== false) {
        $category = "Baterías";
    } elseif (strpos($n, "TAPA") !== false || strpos($n, "TRASERA") !== false) {
        $category = "Tapas";
    } elseif (strpos($n, "FLEX") !== false || strpos($n, "CENTRO") !== false || strpos($n, "CARGA") !== false) {
        $category = "Flexores";
    } elseif (strpos($n, "TOUCH") !== false) {
        $category = "Touch";
    } elseif (strpos($n, "LENTE") !== false || strpos($n, "CAMARA") !== false) {
        $category = "Cámaras";
    } elseif (strpos($n, "SIM") !== false || strpos($n, "BANDEJA") !== false) {
        $category = "Bandejas SIM";
    } elseif (strpos($n, "ACCESORIO") !== false || strpos($n, "CABLE") !== false || strpos($n, "FUNDA") !== false) {
        $category = "Accesorios";
    }

    if ($name !== "Sin nombre" && $price > 0) {
        $products[] = [
            "id" => $index + 1,
            "name" => $name,
            "price" => $price,
            "category" => $category,
            "image" => $image,
            "url" => $url,
            "available" => true
        ];
    }
}

echo json_encode($products);
?>