<?php
// refacciones.php — Scraping autenticado de anegocios.com
// Usa cURL para login, sesión y parseo de inventario
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// ── 1. Inicializar cURL con cookie jar en memoria ─────────────────────────
$cookieFile = tempnam(sys_get_temp_dir(), 'ane_cookie_');

function makeRequest($url, $method = 'GET', $postData = null, $cookieFile = null, $referer = null) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,   // Manejamos redirects manualmente
        CURLOPT_ENCODING       => '',      // Acepta gzip automáticamente
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER     => [
            'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language: es-MX,es;q=0.9',
        ],
        CURLOPT_COOKIEFILE     => $cookieFile,
        CURLOPT_COOKIEJAR      => $cookieFile,
        CURLOPT_HEADER         => true,    // Incluir headers en respuesta para leer Location
    ]);

    if ($referer) {
        curl_setopt($ch, CURLOPT_REFERER, $referer);
    }

    if ($method === 'POST' && $postData !== null) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    }

    $response  = curl_exec($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);

    $headers = substr($response, 0, $headerSize);
    $body    = substr($response, $headerSize);

    // Extraer Location si hay redirect
    $location = null;
    if (preg_match('/^Location:\s*(.+)$/im', $headers, $m)) {
        $location = trim($m[1]);
    }

    return ['code' => $httpCode, 'body' => $body, 'location' => $location];
}

// Sigue redirecciones hasta conseguir un 200
function followRedirects($url, $cookieFile, $referer = null, $depth = 0) {
    if ($depth > 5) return ['code' => 0, 'body' => '', 'location' => null];
    $r = makeRequest($url, 'GET', null, $cookieFile, $referer);
    if ($r['code'] === 301 || $r['code'] === 302) {
        $next = $r['location'];
        if ($next && !str_starts_with($next, 'http')) {
            $base = parse_url($url);
            $next = $base['scheme'] . '://' . $base['host'] . $next;
        }
        return followRedirects($next, $cookieFile, $url, $depth + 1);
    }
    return $r;
}

// ── 2. GET página de login → CSRF token ───────────────────────────────────
$r1 = followRedirects('https://anegocios.com/', $cookieFile);
if ($r1['code'] !== 200) {
    echo json_encode(['error' => 'No se pudo cargar la página de login', 'code' => $r1['code']]);
    unlink($cookieFile);
    exit;
}

preg_match('/name="_csrf_token"\s+value="([^"]+)"/', $r1['body'], $csrfMatch);
$csrf = $csrfMatch[1] ?? '';
if (!$csrf) {
    echo json_encode(['error' => 'CSRF token no encontrado']);
    unlink($cookieFile);
    exit;
}

// ── 3. POST login ──────────────────────────────────────────────────────────
$loginData = http_build_query([
    '_username'     => 'SantiN1mx',
    '_password'     => 'Anegocios',
    '_csrf_token'   => $csrf,
    '_target_path'  => 'Muro',
    '_failure_path' => 'Home',
]);

$r2 = makeRequest('https://anegocios.com/login_check', 'POST', $loginData, $cookieFile, 'https://anegocios.com/');
if ($r2['code'] !== 302 || strpos($r2['location'], 'Muro') === false) {
    echo json_encode(['error' => 'Login fallido', 'code' => $r2['code'], 'location' => $r2['location']]);
    unlink($cookieFile);
    exit;
}

// ── 4. GET Muro → consolidar sesión ────────────────────────────────────────
followRedirects('https://anegocios.com/sis/Muro-del-Usuario', $cookieFile, 'https://anegocios.com/login_check');

// ── 5. GET Lista Productos ─────────────────────────────────────────────────
$r4 = followRedirects('https://anegocios.com/sis/inventario/Lista_Productos', $cookieFile, 'https://anegocios.com/sis/Muro-del-Usuario');

if ($r4['code'] !== 200) {
    echo json_encode(['error' => 'No se pudo cargar inventario', 'code' => $r4['code']]);
    unlink($cookieFile);
    exit;
}

$html = $r4['body'];

// Verificar autenticación
if (strpos($html, '_csrf_token') !== false && strpos($html, 'DataTable') === false) {
    echo json_encode(['error' => 'Sesión inválida — redirigido a login']);
    unlink($cookieFile);
    exit;
}

// ── 6. Parsear tabla con DOMDocument ──────────────────────────────────────
$dom = new DOMDocument();
libxml_use_internal_errors(true);
$dom->loadHTML('<?xml encoding="UTF-8">' . $html);
libxml_clear_errors();
$xpath = new DOMXPath($dom);

// Buscar las filas del tbody de la tabla de inventario
$rows = $xpath->query('//table[contains(@id,"DataTables_Table_1") or contains(@class,"MyDataTable")]//tbody/tr');
if (!$rows || $rows->length === 0) {
    // Fallback: cualquier tbody/tr
    $rows = $xpath->query('//tbody/tr');
}

$products = [];
$index = 0;

foreach ($rows as $row) {
    $cells = $xpath->query('.//td', $row);
    if ($cells->length < 9) continue;

    $barcode = trim($cells->item(2)->textContent);
    $name    = trim($cells->item(3)->textContent);
    $price   = floatval(preg_replace('/[^0-9.]/', '', $cells->item(6)->textContent));
    $stock   = intval(trim($cells->item(8)->textContent));

    if (empty($name) || $name === '-') continue;

    // Categorización
    $n = strtoupper($name);
    if     (strpos($n,'DIS')!==false || strpos($n,'LCD')!==false || strpos($n,'PANTALLA')!==false) $cat = 'Pantallas';
    elseif (strpos($n,'BAT')!==false || strpos($n,'PILA')!==false)                                 $cat = 'Baterías';
    elseif (strpos($n,'TAPA')!==false || strpos($n,'TRASERA')!==false)                             $cat = 'Tapas';
    elseif (strpos($n,'FLEX')!==false || strpos($n,'CENTRO')!==false || strpos($n,'CARGA')!==false) $cat = 'Flexores';
    elseif (strpos($n,'TOUCH')!==false)                                                             $cat = 'Touch';
    elseif (strpos($n,'LENTE')!==false || strpos($n,'CAMARA')!==false)                             $cat = 'Cámaras';
    elseif (strpos($n,'SIM')!==false || strpos($n,'BANDEJA')!==false)                              $cat = 'Bandejas SIM';
    elseif (strpos($n,'ACCESORIO')!==false || strpos($n,'CABLE')!==false || strpos($n,'FUNDA')!==false) $cat = 'Accesorios';
    else                                                                                            $cat = 'Otros';

    $products[] = [
        'id'        => ++$index,
        'barcode'   => $barcode,
        'name'      => $name,
        'price'     => $price,
        'category'  => $cat,
        'image'     => '',    // se rellena abajo
        'url'       => '#',
        'available' => $stock > 0,
        'stock'     => $stock,
    ];
}

// ── 7. Imágenes del catálogo público ─────────────────────────────────────
$imgCh = curl_init();
curl_setopt_array($imgCh, [
    CURLOPT_URL            => 'https://anegocios.com/99/YESMOS_REFACCIONES',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING       => '',
    CURLOPT_TIMEOUT        => 20,
    CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    CURLOPT_SSL_VERIFYPEER => true,
]);
$imgHtml = curl_exec($imgCh);
curl_close($imgCh);

$catalogMap = []; // ['NAME' => ['src' => '...', 'url' => '...']]
if ($imgHtml) {
    $imgDom = new DOMDocument();
    libxml_use_internal_errors(true);
    $imgDom->loadHTML('<?xml encoding="UTF-8">' . $imgHtml);
    libxml_clear_errors();
    $imgXpath = new DOMXPath($imgDom);

    // Iterar elementos con data-url (los <prod> del catálogo)
    $prodNodes = $imgXpath->query('//*[@data-url]');
    foreach ($prodNodes as $prodEl) {
        // Nombre del producto
        $pNodes = $imgXpath->query('.//p', $prodEl);
        $flyName = '';
        foreach ($pNodes as $pNode) {
            $text = trim($pNode->textContent);
            if (!empty($text)) { $flyName = strtoupper($text); break; }
        }

        // Imagen
        $imgNodes = $imgXpath->query(".//*[contains(@class,'imgProd')]//img", $prodEl);
        $src = '';
        if ($imgNodes->length > 0) {
            $src = $imgNodes->item(0)->getAttribute('src');
            if ($src && strpos($src, 'http') !== 0) {
                $src = 'https://anegocios.com' . (strpos($src, '/') === 0 ? '' : '/') . $src;
            }
        }

        // URL del producto (atributo data-url del elemento actual)
        $href = '';
        $rawUrl = $prodEl->getAttribute('data-url');
        if ($rawUrl) {
            // Puede venir doble-encoded (%2520 => %20 => espacio)
            $decoded = html_entity_decode(urldecode($rawUrl));
            $href = (strpos($decoded, 'http') === 0)
                ? $decoded
                : 'https://anegocios.com' . (strpos($decoded, '/') === 0 ? '' : '/') . $decoded;
        }

        if (!empty($flyName) && ($src || $href)) {
            $catalogMap[$flyName] = ['src' => $src, 'url' => $href];
        }
    }
}

// Cross-reference imágenes y URLs por nombre
foreach ($products as &$p) {
    $nameUp = strtoupper($p['name']);
    if (isset($catalogMap[$nameUp])) {
        $entry = $catalogMap[$nameUp];
        if ($entry['src']) $p['image'] = $entry['src'];
        if ($entry['url']) $p['url']   = $entry['url'];
    } else {
        // Match parcial
        foreach ($catalogMap as $key => $entry) {
            if (strpos($key, $nameUp) !== false || (strlen($nameUp) > 10 && strpos($key, substr($nameUp, 0, 10)) === 0)) {
                if ($entry['src']) $p['image'] = $entry['src'];
                if ($entry['url']) $p['url']   = $entry['url'];
                break;
            }
        }
    }
}
unset($p);

// ── 8. Limpiar y responder ────────────────────────────────────────────────
unlink($cookieFile);
echo json_encode($products, JSON_UNESCAPED_UNICODE);
?>