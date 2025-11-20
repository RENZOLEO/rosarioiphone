import { fetchSheet } from "@/lib/fetchSheet"
import { CatalogClient } from "@/components/CatalogClient"

export default async function MinoristaPage({
  params,
}: {
  params: Promise<{ empresa: string }>
}) {
  const { empresa } = await params

  // 👇 PONÉ ACÁ TU ID REAL DEL SHEET
  const SHEET_ID = "1KiPkhmQLGfhLAmrknRFVEsdTyXcCfKO0NRY9IEvJwVg"

  const rawProducts = await fetchSheet(SHEET_ID)

  console.log("DEBUG RAW PRODUCT 0:", rawProducts[0])

  // Normalizamos tipos (price y stock como números)
  const products = rawProducts.map((p: any) => ({
    name: p.modelo || "",
    capacity: p.capacidad?.replace(/\s+/g, "") || "",
    battery: p.bateria || "",
    color: p.color || "",
    imei: p.imei || "",
    provider: p.proveedor || "",
    location: p.ubicacion || "",
    video: p.video_referencia || "",
    image: "/placeholder.png",
    priceUSD: p.venta_usd || "",
    priceARS: p.venta_ars || "",
    roi: p.rentabilidad || "",
    price: p.venta_ars || p.venta_usd || "",
}))

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Catálogo Minorista</h1>
        <p className="text-gray-600">Empresa: {empresa}</p>
      </div>

      {/* Catálogo con filtros dinámicos */}
      <CatalogClient products={products} />
    </main>
  )
}



