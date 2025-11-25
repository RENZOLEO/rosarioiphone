import * as Papa from "papaparse"
export async function fetchSheet(sheetId: string, gid: string) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`

  const res = await fetch(url)
  if (!res.ok) throw new Error("Error al leer Google Sheets")

  const csv = await res.text()

  const parsed = Papa.parse(csv, {
    skipEmptyLines: true,
  })

  const rows = parsed.data as string[][]

  const headerRowIndex = rows.findIndex((cols) =>
    cols.some((col) =>
      col.toLowerCase().includes("modelo") ||
      col.toLowerCase().includes("capacidad") ||
      col.toLowerCase().includes("proveedor")
    )
  )

  if (headerRowIndex === -1) {
    throw new Error("No se encontraron encabezados válidos")
  }

  const headers = rows[headerRowIndex].map((h) =>
    h.trim().toLowerCase().replace(/\s+/g, "_")
  )

  const dataRows = rows.slice(headerRowIndex + 1)

  const products = dataRows.map((cols) => {
    const obj: any = {}
    headers.forEach((h, i) => {
      obj[h] = (cols[i] || "").trim()
    })
    return obj
  })

  return products
}



