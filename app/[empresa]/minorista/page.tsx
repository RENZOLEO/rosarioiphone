import { fetchSheet } from "@/lib/fetchSheet"
import { CatalogClient } from "@/components/CatalogClient"


export default async function MinoristaPage() {
  const SHEET_ID = "1KiPkhmQLGfhLAmrknRFVEsdTyXcCfKO0NRY9IEvJwVg"
  const GID = "0" // poné acá el gid real de la pestaña Catalogo
  const rawProducts = await fetchSheet(SHEET_ID, GID)

  const products = rawProducts.map((p: any) => ({
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
    <main className="min-h-screen bg-white text-black">
      {/* HERO PREMIUM */}
      <section className="w-full py-16 md:py-24 px-6 md:px-12 text-center flex flex-col items-center border-b">

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Rosario <span className="text-gray-700">iPhone</span>
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl">
          Catálogo premium actualizado en tiempo real — todos los modelos, todas las capacidades, todos los colores.
        </p>
      </section>

      {/* CATÁLOGO PREMIUM */}
      <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <CatalogClient products={products as any} />
      </section>

      {/* FOOTER ELEGANTE */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t mt-20">
        © {new Date().getFullYear()} Rosario iPhone — Catálogo actualizado automáticamente.
      </footer>
    </main>
  )
}
