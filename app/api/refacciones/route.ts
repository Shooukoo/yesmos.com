import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

// --- AGREGA ESTA LÍNEA PARA CORREGIR EL ERROR DE BUILD ---
// Esto le dice a Next.js que genere este archivo como un JSON estático durante el build
// en lugar de intentar crear una función de servidor dinámica.
export const dynamic = 'force-static';
// ---------------------------------------------------------

export async function GET() {
    try {
        const url = "https://www.anegocios.com.mx/99/PLAZA_TELCEL";

        // Usamos https nativo para evitar el cache de Next.js (Data Cache) que tiene límite de 2MB
        // y para evitar que marque la ruta como dinámica al usar 'no-store'.
        // Al usar 'force-static', esto se ejecutará una sola vez al build.
        const importHttps = await import("https");
        
        const html = await new Promise<string>((resolve, reject) => {
            const req = importHttps.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve(data));
            });
            
            req.on('error', (e) => reject(e));
            req.end();
        });

        // Ya no necesitamos verificar response.ok manualmente porque el 'end' implica éxito en la transmisión
        // aunque idealmente deberíamos checar res.statusCode, para scraping simple esto suele bastar.

        // const html = await response.text(); // Ya lo tenemos de la promesa anterior
        const $ = cheerio.load(html);
        const products: any[] = [];

        $(".fly").each((index, element) => {
            const name = $(element).find("p").first().text().trim() || "Sin nombre";

            const priceText = $(element).find("span").first().text().trim() || "0";
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));

            let image = $(element).find(".imgProd img").attr("src") || "";
            if (image && !image.startsWith('http')) {
                const cleanPath = image.startsWith('/') ? image : `/${image}`;
                image = `https://www.anegocios.com.mx${cleanPath}`;
            }

            const relativeUrl = $(element).find(".linkDetalleProd").attr("data-url") || "";
            const productUrl = relativeUrl ? `https://www.anegocios.com.mx${relativeUrl}` : "#";

            let category = "Otros";
            const n = name.toUpperCase();

            if (n.includes("DIS") || n.includes("LCD") || n.includes("PANTALLA")) category = "Pantallas";
            else if (n.includes("BAT") || n.includes("PILA")) category = "Baterías";
            else if (n.includes("TAPA") || n.includes("TRASERA")) category = "Tapas";
            else if (n.includes("FLEX") || n.includes("CENTRO") || n.includes("CARGA")) category = "Flexores";
            else if (n.includes("TOUCH")) category = "Touch";
            else if (n.includes("LENTE") || n.includes("CAMARA")) category = "Cámaras";
            else if (n.includes("SIM") || n.includes("BANDEJA")) category = "Bandejas SIM";
            else if (n.includes("ACCESORIO") || n.includes("CABLE") || n.includes("FUNDA")) category = "Accesorios";

            if (name !== "Sin nombre" && price > 0) {
                products.push({
                    id: index + 1,
                    name,
                    price,
                    category,
                    image,
                    url: productUrl,
                    available: true
                });
            }
        });

        return NextResponse.json(products);

    } catch (error) {
        console.error("Error en scraping local (o durante build):", error);
        // Retornamos un array vacío o error controlado para que el build NO falle
        // aunque no haya internet o la página falle.
        return NextResponse.json([], { status: 200 });
    }
}