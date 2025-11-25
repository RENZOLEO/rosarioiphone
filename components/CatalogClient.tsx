"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/ProductCard"
import type { Props } from "@/components/ProductCard"



// Detectamos generación por nombre
const getGeneration = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes("iphone 17")) return 17
  if (n.includes("iphone 16")) return 16
  if (n.includes("iphone 15")) return 15
  if (n.includes("iphone 14")) return 14
  if (n.includes("iphone 13")) return 13
  if (n.includes("iphone 12")) return 12
  if (n.includes("iphone 11")) return 11
  return 0
}

const MODELOS = [
  "IPHONE 11",
  "IPHONE 12",
  "IPHONE 13",
  "IPHONE 14",
  "IPHONE 15",
  "IPHONE 16",
  "IPHONE 17",
]

export function CatalogClient({ products }: { products: Props[] }) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({
    capacity: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  })

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none")
  const [sortGen, setSortGen] = useState<"new" | "old" | "none">("none")

  // FILTRADO + ORDENAMIENTO
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const modelo = p.name?.toLowerCase() || ""
      const capacidad = p.capacity?.toLowerCase() || ""
      const color = p.color?.toLowerCase() || ""
      const price = Number(p.priceUSD || 0)
      const searchText = search.toLowerCase()

      if (selectedModel && !modelo.includes(selectedModel.toLowerCase()))
        return false

      if (search && !modelo.includes(searchText))
        return false

      if (filters.capacity && !capacidad.includes(filters.capacity.toLowerCase()))
        return false

      if (filters.color && !color.includes(filters.color.toLowerCase()))
        return false

      if (filters.minPrice && price < Number(filters.minPrice))
        return false

      if (filters.maxPrice && price > Number(filters.maxPrice))
        return false

      return true
    })

    // Ordenamiento por precio
    if (sortOrder !== "none") {
      result = [...result].sort((a, b) => {
        const pa = Number(a.priceUSD || 0)
        const pb = Number(b.priceUSD || 0)
        return sortOrder === "asc" ? pa - pb : pb - pa
      })
    }

    // Orden por generación
    if (sortGen !== "none") {
      result = [...result].sort((a, b) => {
        const ga = getGeneration(a.name)
        const gb = getGeneration(b.name)
        return sortGen === "new" ? gb - ga : ga - gb
      })
    }

    return result
  }, [products, selectedModel, search, filters, sortOrder, sortGen])

  // Agrupar productos por modelo
  const grouped = MODELOS.reduce<Record<string, Props[]>>(
  (acc, modelo) => {
    acc[modelo] = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(modelo.toLowerCase())
    )
    return acc
  },
  {} as Record<string, Props[]>
)


  return (
    <div className="space-y-12">

      {/* STICKY FILTER BAR */}
      <div className="
        sticky top-0 z-50 
        bg-white/90 backdrop-blur-md 
        py-4 border-b
        space-y-3
      ">
        {/* Buscador */}
        <Input
          placeholder="🔍 Buscar modelo..."
          className="max-w-md mx-auto rounded-full px-5 py-3 text-lg border-gray-300 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Chips por modelo */}
        <div className="flex gap-2 flex-wrap justify-center">
          {MODELOS.map((modelo) => (
            <Badge
              key={modelo}
              variant={selectedModel === modelo ? "default" : "outline"}
              className="cursor-pointer px-3 py-2 rounded-full"
              onClick={() =>
                setSelectedModel((prev) =>
                  prev === modelo ? null : modelo
                )
              }
            >
              {modelo}
            </Badge>
          ))}
        </div>

        {/* FILTROS AVANZADOS */}
        <div className="flex gap-3 flex-wrap justify-center items-center">

          <select
            value={filters.capacity}
            onChange={(e) =>
              setFilters((f) => ({ ...f, capacity: e.target.value }))
            }
            className="border p-2 rounded-full bg-white shadow-sm"
          >
            <option value="">Capacidad</option>
            <option value="64">64GB</option>
            <option value="128">128GB</option>
            <option value="256">256GB</option>
            <option value="512">512GB</option>
            <option value="1tb">1TB</option>
          </select>

          <select
            value={filters.color}
            onChange={(e) =>
              setFilters((f) => ({ ...f, color: e.target.value }))
            }
            className="border p-2 rounded-full bg-white shadow-sm"
          >
            <option value="">Color</option>
            <option value="negro">Negro</option>
            <option value="blanco">Blanco</option>
            <option value="azul">Azul</option>
            <option value="rojo">Rojo</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </select>

          {/* ORDEN POR PRECIO */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="border p-2 rounded-full bg-white shadow-sm"
          >
            <option value="none">Precio</option>
            <option value="asc">Menor a mayor</option>
            <option value="desc">Mayor a menor</option>
          </select>

          {/* ORDEN POR GENERACIÓN */}
          <select
            value={sortGen}
            onChange={(e) => setSortGen(e.target.value as any)}
            className="border p-2 rounded-full bg-white shadow-sm"
          >
            <option value="none">Generación</option>
            <option value="new">Más nuevo</option>
            <option value="old">Más viejo</option>
          </select>

        </div>
      </div>

      {/* SEPARADORES POR MODELO */}
      {MODELOS.map((modelo) => {
        const items = grouped[modelo]
        if (!items?.length) return null

        return (
          <section key={modelo} className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight border-b pb-2">
              {modelo}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {items.map((p, i) => (
                <ProductCard key={p.imei || i} {...p} />
              ))}
            </div>
          </section>
        )
      })}

    </div>
  )
}

