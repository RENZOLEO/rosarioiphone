"use client"

import { useMemo, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/ProductCard"
import type { Props } from "@/components/ProductCard"

// -----------------------------------------------------
// DETECTAR GENERACIÓN
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
// CATEGORÍAS PRINCIPALES
// -----------------------------------------------------
const CATEGORIES = [
  { id: "iphone", label: "iPhone" },
  { id: "ipad", label: "iPad" },
  { id: "airpods", label: "AirPods" },
  { id: "ps5", label: "PS5" },
  { id: "no-battery", label: "Otros" },
]

// -----------------------------------------------------
// MODELOS IPHONE
// -----------------------------------------------------
const MODELOS_IPHONE = [
  "IPHONE 11",
  "IPHONE 12",
  "IPHONE 13",
  "IPHONE 14",
  "IPHONE 15",
  "IPHONE 16",
  "IPHONE 17",
]

// -----------------------------------------------------
// SUBMODELOS IPHONE
// -----------------------------------------------------
const SUBMODELOS_MAP: Record<string, string[]> = {
  "IPHONE 11": ["11", "11 pro", "11 pro max"],
  "IPHONE 12": ["12", "12 mini", "12 pro", "12 pro max"],
  "IPHONE 13": ["13", "13 mini", "13 pro", "13 pro max"],
  "IPHONE 14": ["14", "14 plus", "14 pro", "14 pro max"],
  "IPHONE 15": ["15", "15 plus", "15 pro", "15 pro max"],
  "IPHONE 16": ["16", "16 plus", "16 pro", "16 pro max"],
  "IPHONE 17": ["17", "17 pro", "17 pro max"],
}

// -----------------------------------------------------
// MATCH EXACTO DE SUBMODELO
// -----------------------------------------------------
function matchesExactModel(name: string, selected: string) {
  const n = name.toLowerCase()
  const s = selected.toLowerCase()

  if (s.includes("pro max")) return n.includes("pro max")
  if (s.includes("pro")) return n.includes("pro") && !n.includes("pro max")
  if (s.includes("mini")) return n.includes("mini")
  if (s.includes("plus")) return n.includes("plus")

  const base = s.replace("iphone", "").trim()
  return (
    n.includes(base) &&
    !n.includes("pro") &&
    !n.includes("mini") &&
    !n.includes("max") &&
    !n.includes("plus")
  )
}

// -----------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------
export function CatalogClient({ products }: { products: Props[] }) {

  const [selectedCategory, setSelectedCategory] = useState<string>("iphone")
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

  // AUTO-HIDE TOP BAR
  const [hideBar, setHideBar] = useState(false)
  const [lastScroll, setLastScroll] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY
      if (y > lastScroll && y > 100) setHideBar(true)
      else setHideBar(false)
      setLastScroll(y)
    }
    window.addEventListener("scroll", handle)
    return () => window.removeEventListener("scroll", handle)
  }, [lastScroll])

  // -----------------------------------------------------
  // FILTRADO GLOBAL
  // -----------------------------------------------------
  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      const name = p.name.toLowerCase()
      const model = selectedModel?.toLowerCase()
      const searchText = search.toLowerCase()

      // Filtrar por categoría
      if (p.category !== selectedCategory) return false

      // Modelos iPhone
      if (selectedCategory === "iphone" && selectedModel && !name.includes(model))
        return false

      // Submodelos
      if (selectedSubModel && !matchesExactModel(name, selectedSubModel))
        return false

      // Buscador
      if (search && !name.includes(searchText)) return false

      // Capacidad
      if (
        filters.capacity &&
        !p.capacity.toLowerCase().includes(filters.capacity.toLowerCase())
      )
        return false

      // Color
      if (
        filters.color &&
        !p.color.toLowerCase().includes(filters.color.toLowerCase())
      )
        return false

      // Precio
      const price = Number(p.priceUSD || 0)
      if (filters.minPrice && price < Number(filters.minPrice)) return false
      if (filters.maxPrice && price > Number(filters.maxPrice)) return false

      return true
    })

    // Ordenar por precio
    if (sortOrder !== "none") {
      r = [...r].sort((a, b) =>
        sortOrder === "asc"
          ? Number(a.priceUSD) - Number(b.priceUSD)
          : Number(b.priceUSD) - Number(a.priceUSD)
      )
    }

    // Ordenar generación
    if (selectedCategory === "iphone" && sortGen !== "none") {
      r = [...r].sort((a, b) =>
        sortGen === "new"
          ? getGeneration(b.name) - getGeneration(a.name)
          : getGeneration(a.name) - getGeneration(b.name)
      )
    }

    return r
  }, [
    products,
    selectedCategory,
    selectedModel,
    selectedSubModel,
    search,
    filters,
    sortOrder,
    sortGen,
  ])

  // -----------------------------------------------------
  // AGRUPAR iPHONE POR MODELO
  // -----------------------------------------------------
  const grouped = MODELOS_IPHONE.reduce<Record<string, Props[]>>((acc, model) => {
    if (selectedCategory !== "iphone") return acc
    acc[model] = filtered.filter((p) =>
      p.name.toLowerCase().includes(model.toLowerCase())
    )
    return acc
  }, {})

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <div key={selectedCategory} className="space-y-12">
      {/* STICKY BAR SUPERIOR */}
      <div
        className={`
          sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b
          transition-all duration-300
          ${hideBar ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"}
          sm:py-4 sm:space-y-3 py-2 space-y-2
        `}
      >
        {/* BUSCADOR */}
        <Input
          placeholder="🔍 Buscar modelo..."
          className="max-w-md mx-auto rounded-full px-4 py-2 text-base sm:px-5 sm:py-3 sm:text-lg border-gray-300 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* CATEGORÍAS PRINCIPALES */}
        <div className="flex gap-2 flex-wrap justify-center">
          {CATEGORIES.map((c) => (
            <Badge
              key={c.id}
              variant={selectedCategory === c.id ? "default" : "outline"}
              className="cursor-pointer px-3 py-1.5 rounded-full text-sm sm:text-base"
              onClick={() => {
                setSelectedCategory(c.id)
                setSelectedModel(null)
                setSelectedSubModel(null)
              }}
            >
              {c.label}
            </Badge>
          ))}
        </div>

        {/* MODELOS IPHONE */}
        {selectedCategory === "iphone" && (
          <div className="flex gap-2 flex-wrap justify-center">
            {MODELOS_IPHONE.map((m) => (
              <Badge
                key={m}
                variant={selectedModel === m ? "default" : "outline"}
                className="cursor-pointer px-3 py-1.5 rounded-full text-sm sm:text-base"
                onClick={() => {
                  setSelectedModel(selectedModel === m ? null : m)
                  setSelectedSubModel(null)
                }}
              >
                {m}
              </Badge>
            ))}
          </div>
        )}

        {/* SUBMODELOS */}
        {selectedCategory === "iphone" && selectedModel && (
          <div className="flex gap-2 flex-wrap justify-center">
            {SUBMODELOS_MAP[selectedModel]?.map((sub) => (
              <Badge
                key={sub}
                variant={selectedSubModel === sub ? "default" : "outline"}
                className="cursor-pointer px-3 py-1.5 rounded-full text-sm sm:text-base"
                onClick={() =>
                  setSelectedSubModel(selectedSubModel === sub ? null : sub)
                }
              >
                {sub.toUpperCase()}
              </Badge>
            ))}
          </div>
        )}

        {/* MOBILE: BOTÓN MOSTRAR FILTROS */}
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
            flex gap-3 flex-wrap justify-center items-center
            ${showFilters ? "flex" : "hidden sm:flex"}
          `}
        >
          {/* CAPACIDAD */}
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

          {/* COLOR */}
          <select
            value={filters.color}
            onChange={(e) =>
              setFilters((f) => ({ ...f, color: e.target.value }))
            }
            className="border p-2 rounded-full bg-white shadow-sm text-sm sm:text-base"
          >
            <option value="">Color</option>
            <option value="black">Negro</option>
            <option value="white">Blanco</option>
            <option value="silver">Silver</option>
            <option value="blue">Azul</option>
            <option value="gold">Dorado</option>
            <option value="red">Rojo</option>
            <option value="pink">Rosa</option>
          </select>

          {/* PRECIO */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="border p-2 rounded-full bg-white shadow-sm text-sm sm:text-base"
          >
            <option value="none">Precio</option>
            <option value="asc">Menor a mayor</option>
            <option value="desc">Mayor a menor</option>
          </select>

          {/* GENERACIÓN (solo iPhone) */}
          {selectedCategory === "iphone" && (
            <select
              value={sortGen}
              onChange={(e) => setSortGen(e.target.value as any)}
              className="border p-2 rounded-full bg-white shadow-sm text-sm sm:text-base"
            >
              <option value="none">Generación</option>
              <option value="new">Más nuevo</option>
              <option value="old">Más viejo</option>
            </select>
          )}
        </div>
      </div>

      {/* -----------------------------------------------------
          RESULTADOS PARA IPHONE (AGRUPADO POR MODELO)
      ----------------------------------------------------- */}
      {selectedCategory === "iphone" &&
        MODELOS_IPHONE.map((m) => {
          const items = grouped[m]
          if (!items?.length) return null

          return (
            <section key={m} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight border-b pb-2">
                {m}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {items.map((p, i) => (
                  <ProductCard key={p.imei || i} {...p} />
                ))}
              </div>
            </section>
          )
        })}

      {/* -----------------------------------------------------
          RESULTADOS PARA OTRAS CATEGORÍAS (LISTADO PLANO)
      ----------------------------------------------------- */}
      {selectedCategory !== "iphone" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filtered.map((p, i) => (
            <ProductCard key={p.imei || i} {...p} />
          ))}
        </div>
      )}
    </div>
  )
}
