"use client"

import { useMemo, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/ProductCard"
import type { Props } from "@/components/ProductCard"

// -----------------------------------------------------
// DETECCIÓN DE GENERACIÓN
// -----------------------------------------------------
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

// -----------------------------------------------------
// MODELOS PRINCIPALES
// -----------------------------------------------------
const MODELOS = [
  "IPHONE 11",
  "IPHONE 12",
  "IPHONE 13",
  "IPHONE 14",
  "IPHONE 15",
  "IPHONE 16",
  "IPHONE 17",
]

// -----------------------------------------------------
// SUBMODELOS FLEXIBLES
// -----------------------------------------------------
const SUBMODELOS_MAP: Record<string, string[]> = {
  "IPHONE 11": ["11"],
  "IPHONE 12": ["12", "12 mini"],
  "IPHONE 13": ["13", "13 mini", "13 pro", "13 pro max"],
  "IPHONE 14": ["14", "14 plus", "14 pro", "14 pro max"],
  "IPHONE 15": ["15", "15 plus", "15 pro", "15 pro max"],
  "IPHONE 16": ["16", "16 plus", "16 pro", "16 pro max"],
  "IPHONE 17": ["17"],
}

// -----------------------------------------------------
// MATCH INTELIGENTE DE SUBMODELOS
// -----------------------------------------------------
function matchesSubModel(modelo: string, sub: string): boolean {
  const m = modelo.toLowerCase()
  const s = sub.toLowerCase()

  if (s.includes("pro max")) return m.includes("pro max") || m.includes("pm")
  if (s.includes("pro")) return m.includes("pro")
  if (s.includes("mini")) return m.includes("mini")
  if (s.includes("plus")) return m.includes("plus")
  if (/^\d+$/.test(s)) return m.includes(s)

  return m.includes(s)
}

// -----------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------
export function CatalogClient({ products }: { products: Props[] }) {

  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [selectedSubModel, setSelectedSubModel] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({
    capacity: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  })

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none")
  const [sortGen, setSortGen] = useState<"new" | "old" | "none">("none")

  // -----------------------------
  // AUTO-HIDE EN SCROLL
  // -----------------------------
  const [hideBar, setHideBar] = useState(false)
  const [lastScroll, setLastScroll] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    function handleScroll() {
      const current = window.scrollY

      if (current > lastScroll && current > 100) {
        setHideBar(true)
      } else {
        setHideBar(false)
      }

      setLastScroll(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScroll])

  // -----------------------------------------------------
  // FILTROS COMPLETOS
  // -----------------------------------------------------
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const modelo = p.name?.toLowerCase() || ""
      const capacidad = p.capacity?.toLowerCase() || ""
      const color = p.color?.toLowerCase() || ""
      const price = Number(p.priceUSD || 0)
      const searchText = search.toLowerCase()

      if (selectedModel && !modelo.includes(selectedModel.toLowerCase()))
        return false

      if (selectedSubModel && !matchesSubModel(modelo, selectedSubModel))
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

    if (sortOrder !== "none") {
      result = [...result].sort((a, b) =>
        sortOrder === "asc"
          ? Number(a.priceUSD || 0) - Number(b.priceUSD || 0)
          : Number(b.priceUSD || 0) - Number(a.priceUSD || 0)
      )
    }

    if (sortGen !== "none") {
      result = [...result].sort((a, b) => {
        const ga = getGeneration(a.name)
        const gb = getGeneration(b.name)
        return sortGen === "new" ? gb - ga : ga - gb
      })
    }

    return result
  }, [products, selectedModel, selectedSubModel, search, filters, sortOrder, sortGen])

  // -----------------------------------------------------
  // AGRUPAR POR MODELO
  // -----------------------------------------------------
  const grouped = MODELOS.reduce<Record<string, Props[]>>(
    (acc, modelo) => {
      acc[modelo] = filteredProducts.filter((p) =>
        p.name.toLowerCase().includes(modelo.toLowerCase())
      )
      return acc
    },
    {} as Record<string, Props[]>
  )

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  return (
    <div className="space-y-12">

      {/* STICKY FILTER BAR */}
      <div
        className={`
          sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b
          transition-all duration-300

          ${hideBar ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"}

          sm:py-4 sm:space-y-3
          py-2 space-y-2
        `}
      >

        {/* BUSCADOR */}
        <Input
          placeholder="🔍 Buscar modelo..."
          className="
            max-w-md mx-auto rounded-full px-4 py-2 text-base
            sm:px-5 sm:py-3 sm:text-lg
            border-gray-300 shadow-sm
          "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* MODELOS */}
        <div className="flex gap-2 flex-wrap justify-center">
          {MODELOS.map((modelo) => (
            <Badge
              key={modelo}
              variant={selectedModel === modelo ? "default" : "outline"}
              className="cursor-pointer px-3 py-1.5 rounded-full text-sm sm:text-base"
              onClick={() => {
                setSelectedModel(modelo === selectedModel ? null : modelo)
                setSelectedSubModel(null)
                setShowFilters(false)
              }}
            >
              {modelo}
            </Badge>
          ))}
        </div>

        {/* SUBMODELOS */}
        {selectedModel && (
          <div className="flex gap-2 flex-wrap justify-center mt-1">
            {SUBMODELOS_MAP[selectedModel]?.map((sub) => (
              <Badge
                key={sub}
                variant={selectedSubModel === sub ? "default" : "outline"}
                className="cursor-pointer px-3 py-1.5 rounded-full text-sm sm:text-base"
                onClick={() =>
                  setSelectedSubModel(sub === selectedSubModel ? null : sub)
                }
              >
                {sub.toUpperCase()}
              </Badge>
            ))}
          </div>
        )}

        {/* BOTÓN MOBILE PARA EXPANDIR FILTROS */}
        <div className="sm:hidden flex justify-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-gray-600 underline"
          >
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
        </div>

        {/* FILTROS AVANZADOS */}
        <div
          className={`
            flex gap-3 flex-wrap justify-center items-center mt-1
            ${showFilters ? "flex" : "hidden sm:flex"}
          `}
        >
          <select
            value={filters.capacity}
            onChange={(e) =>
              setFilters((f) => ({ ...f, capacity: e.target.value }))
            }
            className="border p-2 rounded-full bg-white shadow-sm text-sm sm:text-base"
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
            className="border p-2 rounded-full bg-white shadow-sm text-sm sm:text-base"
          >
            <option value="">Color</option>
            <option value="negro">Negro</option>
            <option value="blanco">Blanco</option>
            <option value="azul">Azul</option>
            <option value="rojo">Rojo</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="border p-2 rounded-full bg-white shadow-sm text-sm sm:text-base"
          >
            <option value="none">Precio</option>
            <option value="asc">Menor a mayor</option>
            <option value="desc">Mayor a menor</option>
          </select>

          <select
            value={sortGen}
            onChange={(e) => setSortGen(e.target.value as any)}
            className="border p-2 rounded-full bg-white shadow-sm text-sm sm:text-base"
          >
            <option value="none">Generación</option>
            <option value="new">Más nuevo</option>
            <option value="old">Más viejo</option>
          </select>
        </div>

      </div>

      {/* LISTADO POR MODELO */}
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

