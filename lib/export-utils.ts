import type { Product } from "@/lib/products-cache"

// xlsx y jspdf son librerías pesadas — se importan dinámicamente para que
// no formen parte del bundle inicial de la página, solo se cargan al exportar.

function dateSuffix() {
    return new Date().toISOString().slice(0, 10)
}

export async function exportToExcel(products: Product[], filename = "planeacion-stock-bajo") {
    const XLSX = await import("xlsx")

    const rows = products.map((p) => ({
        Producto: p.name,
        Categoría: p.category,
        Stock: p.stock ?? "",
        "Precio compra": p.costPrice ?? "",
        "Código de barras": p.barcode ?? "",
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)
    worksheet["!cols"] = [{ wch: 40 }, { wch: 18 }, { wch: 8 }, { wch: 10 }, { wch: 16 }]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock bajo")
    XLSX.writeFile(workbook, `${filename}-${dateSuffix()}.xlsx`)
}

export async function exportToPdf(products: Product[], filename = "planeacion-stock-bajo") {
    const { default: jsPDF } = await import("jspdf")
    const { default: autoTable } = await import("jspdf-autotable")

    const doc = new jsPDF({ orientation: "landscape" })

    doc.setFontSize(14)
    doc.text("Yesmos Celulares - Planeación de inventario (stock bajo)", 14, 15)
    doc.setFontSize(9)
    doc.text(`Generado: ${new Date().toLocaleString("es-MX")}`, 14, 21)

    autoTable(doc, {
        startY: 26,
        head: [["Producto", "Categoría", "Stock", "Precio compra"]],
        body: products.map((p) => [p.name, p.category, String(p.stock ?? ""), `$${(p.costPrice ?? 0).toFixed(2)}`]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
    })

    doc.save(`${filename}-${dateSuffix()}.pdf`)
}
