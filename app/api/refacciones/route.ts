import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import https from "https";
import zlib from "zlib";

// force-static: Next.js ejecuta esta ruta UNA VEZ durante el build (output: export)
// y genera un JSON estático. En producción, el PHP (refacciones.php) da datos frescos.
// En dev (npm run dev), la ruta se ejecuta en vivo en cada petición.
export const dynamic = 'force-static';

// ─── HTTP helper (native https, maneja gzip/cookie) ────────────────────────
function httpGet(url: string, cookieJar: Map<string, string>): Promise<string> {
    return new Promise((resolve, reject) => {
        const parsed = new URL(url);
        const req = https.request(
            {
                hostname: parsed.hostname,
                path: parsed.pathname + parsed.search,
                method: "GET",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Encoding": "gzip",
                    "Accept-Language": "es-MX,es;q=0.9",
                    "Cookie": cookieString(cookieJar),
                },
            },
            (res) => {
                // Guardar cookies
                for (const h of (res.headers["set-cookie"] ?? [])) {
                    const main = h.split(";")[0].trim();
                    const eq = main.indexOf("=");
                    if (eq > 0) cookieJar.set(main.substring(0, eq), main.substring(eq + 1));
                }

                // Seguir redirect manuel
                if (res.statusCode === 301 || res.statusCode === 302) {
                    const loc = res.headers["location"] ?? "";
                    const nextUrl = loc.startsWith("http") ? loc : `https://${parsed.hostname}${loc}`;
                    res.resume();
                    resolve(httpGet(nextUrl, cookieJar));
                    return;
                }

                let stream: NodeJS.ReadableStream = res;
                if (res.headers["content-encoding"] === "gzip") {
                    stream = res.pipe(zlib.createGunzip());
                }

                let data = "";
                stream.on("data", (c: Buffer) => (data += c.toString("utf8")));
                stream.on("end", () => resolve(data));
                stream.on("error", reject);
            }
        );
        req.on("error", reject);
        req.setTimeout(25000, () => { req.destroy(new Error("timeout")); });
        req.end();
    });
}

function httpPost(url: string, body: string, cookieJar: Map<string, string>): Promise<string> {
    return new Promise((resolve, reject) => {
        const parsed = new URL(url);
        const postBuf = Buffer.from(body, "utf8");
        const req = https.request(
            {
                hostname: parsed.hostname,
                path: parsed.pathname + parsed.search,
                method: "POST",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Encoding": "gzip",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": postBuf.length,
                    "Referer": "https://anegocios.com/",
                    "Cookie": cookieString(cookieJar),
                },
            },
            (res) => {
                for (const h of (res.headers["set-cookie"] ?? [])) {
                    const main = h.split(";")[0].trim();
                    const eq = main.indexOf("=");
                    if (eq > 0) cookieJar.set(main.substring(0, eq), main.substring(eq + 1));
                }
                // Para el POST de login sólo nos importan las cookies y el redirect — no el cuerpo
                res.resume();
                resolve(res.headers["location"] ?? "");
            }
        );
        req.on("error", reject);
        req.setTimeout(20000, () => { req.destroy(new Error("timeout")); });
        req.write(postBuf);
        req.end();
    });
}

function cookieString(jar: Map<string, string>): string {
    return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

function categorize(name: string): string {
    const n = name.toUpperCase();
    if (n.includes("DIS") || n.includes("LCD") || n.includes("PANTALLA")) return "Pantallas";
    if (n.includes("BAT") || n.includes("PILA")) return "Baterías";
    if (n.includes("TAPA") || n.includes("TRASERA")) return "Tapas";
    if (n.includes("FLEX") || n.includes("CENTRO") || n.includes("CARGA")) return "Flexores";
    if (n.includes("TOUCH")) return "Touch";
    if (n.includes("LENTE") || n.includes("CAMARA")) return "Cámaras";
    if (n.includes("SIM") || n.includes("BANDEJA")) return "Bandejas SIM";
    if (n.includes("ACCESORIO") || n.includes("CABLE") || n.includes("FUNDA")) return "Accesorios";
    return "Otros";
}

// ─── Handler principal ──────────────────────────────────────────────────────
export async function GET() {
    const jar = new Map<string, string>();

    try {
        // 1. GET / → CSRF token
        const loginPageHtml = await httpGet("https://anegocios.com/", jar);
        const csrf = loginPageHtml.match(/name="_csrf_token"\s+value="([^"]+)"/)?.[1] ?? "";
        if (!csrf) {
            console.error("[Auth] CSRF no encontrado");
            return NextResponse.json([], { status: 200 });
        }

        // 2. POST login
        const postBody = new URLSearchParams({
            "_username": "SantiN1mx",
            "_password": "Anegocios",
            "_csrf_token": csrf,
            "_target_path": "Muro",
            "_failure_path": "Home",
        }).toString();
        await httpPost("https://anegocios.com/login_check", postBody, jar);

        // 3. GET Muro → consolidar sesión
        await httpGet("https://anegocios.com/sis/Muro-del-Usuario", jar);

        // 4. GET Lista Productos (sigue redirects automáticamente)
        const productsHtml = await httpGet("https://anegocios.com/sis/inventario/Lista_Productos", jar);

        if (productsHtml.includes("_csrf_token") && !productsHtml.includes("DataTable")) {
            console.error("[Auth] Sesión inválida");
            return NextResponse.json([], { status: 200 });
        }

        // 5. Parsear tabla
        const $inv = cheerio.load(productsHtml);
        const products: any[] = [];

        $inv("#DataTables_Table_1 tbody tr, .MyDataTable tbody tr").each((index, row) => {
            const cells = $inv(row).find("td");
            if (cells.length < 9) return;

            const barcode = cells.eq(2).text().trim();
            const name    = cells.eq(3).text().trim();
            const price   = parseFloat(cells.eq(6).text().replace(/[^0-9.]/g, "")) || 0;
            const stock   = parseInt(cells.eq(8).text().trim(), 10) || 0;

            if (!name || name === "-") return;

            products.push({
                id: index + 1,
                barcode,
                name,
                price,
                category: categorize(name),
                image: "",
                url: "#",
                available: stock > 0,
                stock,
            });
        });

        console.log(`[Inventario] ${products.length} productos parseados`);

        // 6. Imágenes del catálogo público (nueva sesión, sin cookie)
        try {
            const imgJar = new Map<string, string>();
            const imgHtml = await httpGet("https://anegocios.com/99/YESMOS_REFACCIONES", imgJar);
            const $cat = cheerio.load(imgHtml);
            const imageMap = new Map<string, string>();

            $cat(".fly").each((_, el) => {
                const catName = $cat(el).find("p").first().text().trim().toUpperCase();
                let src = $cat(el).find("[class*='imgProd'] img").attr("src") ?? "";
                if (src && !src.startsWith("http")) {
                    src = `https://anegocios.com${src.startsWith("/") ? "" : "/"}${src}`;
                }
                if (catName && src) imageMap.set(catName, src);
            });

            console.log(`[Imágenes] ${imageMap.size} entradas en el mapa`);

            products.forEach(p => {
                const up = p.name.toUpperCase();
                if (imageMap.has(up)) { p.image = imageMap.get(up)!; return; }
                for (const [key, url] of imageMap) {
                    if (key.includes(up) || (up.length > 10 && key.startsWith(up.substring(0, 10)))) {
                        p.image = url; return;
                    }
                }
            });
        } catch (imgErr) {
            console.warn("[Imágenes] Falló:", imgErr);
        }

        return NextResponse.json(products);

    } catch (err) {
        console.error("[Scraping] Error general:", err);
        return NextResponse.json([], { status: 200 });
    }
}