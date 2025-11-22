import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const targetUrl = 'https://www.anegocios.com.mx/99/PLAZA_TELCEL'; 
    
    await page.goto(targetUrl, { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });

    const products = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.fly'));
      
      return items.map((item, index) => {
        // 1. Nombre
        const nameElement = item.querySelector('p');
        const name = nameElement?.textContent?.trim() || 'Sin nombre';

        // 2. Precio
        const priceElement = item.querySelector('span');
        const priceText = priceElement?.textContent?.trim() || '0';
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

        // 3. Imagen
        const imgElement = item.querySelector('.imgProd img');
        const image = imgElement?.getAttribute('src') || '';

        // 4. Enlace
        const linkContainer = item.querySelector('.linkDetalleProd');
        const relativeUrl = linkContainer?.getAttribute('data-url');
        const url = relativeUrl ? `https://www.anegocios.com.mx${relativeUrl}` : '#';

        // 5. Lógica de CATEGORIZACIÓN AUTOMÁTICA [MEJORA CLAVE]
        let category = "Otros";
        const n = name.toUpperCase(); // Convertir a mayúsculas para comparar

        if (n.includes("DIS") || n.includes("LCD") || n.includes("PANTALLA") || n.includes("DISPLAY")) {
          category = "Pantallas";
        } else if (n.includes("BAT") || n.includes("PILA") || n.includes("BATERIA")) {
          category = "Baterías";
        } else if (n.includes("TAPA") || n.includes("TRASERA")) {
          category = "Tapas";
        } else if (n.includes("FLEX") || n.includes("CENTRO") || n.includes("CARGA") || n.includes("PUERTO") || n.includes("MICROFONO")) {
          category = "Flexores";
        } else if (n.includes("TOUCH")) {
          category = "Touch";
        } else if (n.includes("LENTE") || n.includes("CRISTAL") || n.includes("CAMARA")) {
          category = "Cámaras";
        } else if (n.includes("SIM") || n.includes("BANDEJA") || n.includes("PORTA")) {
          category = "Bandejas SIM";
        } else if (n.includes("ACCESORIO") || n.includes("CABLE") || n.includes("FUNDA") || n.includes("MICA")) {
          category = "Accesorios";
        }

        return {
          id: index + 1,
          name: name,
          price: isNaN(price) ? 0 : price,
          category: category, // Usamos la categoría detectada
          image: image,
          url: url,
          available: true
        };
      })
      .filter(p => p.name !== 'Sin nombre' && p.name !== '' && p.price > 0);
    });

    await browser.close();

    return NextResponse.json(products);
    
  } catch (error) {
    console.error('Error en scraping:', error);
    return NextResponse.json(
      { error: 'Error obteniendo datos', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}