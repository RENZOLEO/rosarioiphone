import { fetchSheet } from "@/lib/fetchSheet"
import { CatalogClient, Product } from "@/components/CatalogClient"

export default async function MinoristaPage({
  params,
}: {
  params: Promise<{ empresa: string }>
}) {
  const { empresa } = await params

  const SHEET_ID = "1KiPkhmQLGfhLAmrknRFVEsdTyXcCfKO0NRY9IEvJwVg" // tu ID

  const rawProducts = await fetchSheet(SHEET_ID)

  const products: Product[] = rawProducts.map((p: any) => ({
    name: p.modelo || "",
    capacity: p.capacidad || "",
    battery: p.bateria || "",
    color: p.color || "",
    imei: p.imei || "",
    provider: p.proveedor || "",
    location: p.ubicacion || "",
    video: p.video_referencia || "",
    image: "/placeholder.png",
    priceUSD: p.venta_usd || "",
    priceARS: p.venta_ars || "",
    cost: p.costo || "",
    roi: p.rentabilidad || "",
    
  }))

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Catálogo Minorista</h1>
        <p className="text-gray-600">Empresa: {empresa}</p>
      </div>

      <CatalogClient products={products} />
    </main>
  )
}




