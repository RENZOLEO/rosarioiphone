import * as Papa from "papaparse"

export async function fetchSheet(sheetId: string, gid: string) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`

  const res = await fetch(url, {
    cache: "no-store", // 🔥 CLAVE ABSOLUTA
  })
  if (!res.ok) throw new Error("Error al leer Google Sheets")

  const csv = await res.text()

  const parsed = Papa.parse(csv, {
    skipEmptyLines: true,
  })

  const rows = parsed.data as string[][]

  // 🧠 Header asumido en fila 1
  const headerRow = rows[0]

  // ✅ Validación mínima
  const hasModelo = headerRow.some((h) =>
    String(h).toLowerCase().includes("modelo")
  )

  if (!hasModelo) {
    throw new Error(
      "El encabezado no está en la fila 1 (no se encontró la columna 'Modelo')"
    )
  }

  // 🧠 Normalización + mapeo fuerte de headers
  const headers = headerRow.map((h) => {
    const key = String(h)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w]/g, "")

    if (key.startsWith("estado")) return "estado"
    if (key.startsWith("modelo")) return "modelo"
    if (key.startsWith("capacidad")) return "capacidad"
    if (key.startsWith("bateria")) return "bateria"
    if (key.startsWith("color")) return "color"
    if (key.startsWith("imei")) return "imei"
    if (key.startsWith("falla")) return "falla"
    if (key.includes("video")) return "video_referencia"
    if (key.includes("venta_usd")) return "venta_usd"
    if (key.includes("venta_ars")) return "venta_ars"

    return key
  })

  const dataRows = rows.slice(1)

  const products = dataRows
    .filter((row) => row.some((c) => String(c).trim() !== ""))
    .map((cols) => {
      const obj: any = {}
      headers.forEach((h, i) => {
        obj[h] = String(cols[i] ?? "").trim()
      })
      return obj
    })

  return products
}
