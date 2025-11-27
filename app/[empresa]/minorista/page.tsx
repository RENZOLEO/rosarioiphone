import { fetchSheet } from "@/lib/fetchSheet"
import { CatalogClient } from "@/components/CatalogClient"

// -------------------------------------------------------------
// NORMALIZADORES (VERSION CORREGIDA)
// -------------------------------------------------------------

// 👉 Normaliza precio desde formato AR a número
function normalizePrice(value: string) {
  if (!value) return ""

  // limpia caracteres no numéricos salvo . ,
  let cleaned = value.toString().trim().replace(/[^\d.,-]/g, "")

  // Caso: 394.200,00 (punto miles + coma decimal)
  if (cleaned.includes(".") && cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "") // remove thousands
    cleaned = cleaned.replace(",", ".") // decimal
    return cleaned
  }

  // Caso: 270,00 (solo coma)
  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "") // any thousands just in case
    cleaned = cleaned.replace(",", ".")
    return cleaned
  }

  // Caso: solo números o números con punto decimal (US)
  return cleaned
}

function normalizeColor(raw: string) {
  const c = raw?.toLowerCase() || ""

  if (c.includes("silver") || c.includes("plata") || c.includes("plateado"))
    return "silver"

  if (c.includes("black") || c.includes("negro") || c.includes("midnight"))
    return "black"

  if (c.includes("white") || c.includes("blanco") || c.includes("starlight"))
    return "white"

  if (c.includes("blue") || c.includes("azul"))
    return "blue"

  if (c.includes("titanium"))
    return "titanium"

  if (c.includes("pink") || c.includes("rosa"))
    return "pink"

  if (c.includes("red") || c.includes("rojo"))
    return "red"

  if (c.includes("gold") || c.includes("dorado"))
    return "gold"

  return c
}

function normalizeBattery(b: string) {
  if (!b) return null
  const match = b.match(/\d+/)
  return match ? Number(match[0]) : null
}

function detectCategory(name: string, battery: any, estado: string) {
  const n = name.toLowerCase()

  if (n.includes("ipad")) return "ipad"
  if (n.includes("airpod")) return "airpods"
  if (n.includes("ps5") || n.includes("playstation") || n.includes("dualsense"))
    return "ps5"

  if (estado?.toLowerCase().includes("nuevo") || estado?.toLowerCase().includes("sellado"))
    return "iphone-new"

  if (!battery) return "no-battery"

  return "iphone"
}

// -------------------------------------------------------------
// NORMALIZACIÓN FINAL DEL PRODUCTO
// -------------------------------------------------------------
function normalizeData(p: any) {
  let batteryNum = normalizeBattery(p.bateria)

  // Sellado = 100%
  if (p.estado?.toLowerCase().includes("sellado") || p.estado?.toLowerCase().includes("nuevo")) {
    batteryNum = 100
  }

  return {
    ...p,
    color: normalizeColor(p.color),
    battery: batteryNum,
    category: detectCategory(p.name, batteryNum, p.estado),

    // Precios *NORMALIZADOS* (corregido 2025)
    priceUSD: normalizePrice(p.priceUSD),
    priceARS: normalizePrice(p.priceARS),
  }
}

// -------------------------------------------------------------
// PAGE
// -------------------------------------------------------------
export default async function MinoristaPage() {
  const SHEET_ID = "1KiPkhmQLGfhLAmrknRFVEsdTyXcCfKO0NRY9IEvJwVg"
  const GID = "0"

  const rawProducts = await fetchSheet(SHEET_ID, GID)

  const products = rawProducts.map((p: any) =>
    normalizeData({
      name: p.modelo || "",
      capacity: p.capacidad || "",
      bateria: p.bateria || "",
      estado: p.estado || "",
      color: p.color || "",
      imei: p.imei || "",
      provider: p.proveedor || "",
      location: p.ubicacion || "",
      video: p.video_referencia || "",
      image: "/placeholder.png",

      // acá entran los precios originales del sheet
      priceUSD: p.venta_usd || "",
      priceARS: p.venta_ars || "",

      cost: p.costo || "",
      roi: p.rentabilidad || "",
    })
  )

  return (
    <main className="min-h-screen bg-white text-black">

      {/* HERO */}
      <section className="w-full py-14 md:py-20 px-6 md:px-12 text-center flex flex-col items-center border-b bg-white">
        <h1
          className="
            text-4xl md:text-6xl font-extrabold tracking-tight 
            bg-gradient-to-r from-blue-500 to-blue-700 
            bg-clip-text text-transparent
          "
        >
          Rosario iPhone
        </h1>

        <p className="mt-3 text-sm md:text-lg text-gray-600 max-w-2xl">
          Catálogo premium actualizado en tiempo real — todos los modelos, capacidades y colores.
        </p>
      </section>

      {/* CATÁLOGO */}
      <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <CatalogClient products={products as any} />
      </section>

      <footer className="py-8 text-center text-gray-500 text-sm border-t mt-20">
        © {new Date().getFullYear()} Rosario iPhone
      </footer>
    </main>
  )
}

