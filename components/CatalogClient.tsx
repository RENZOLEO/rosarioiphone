"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { ProductCard, Props as ProductProps } from "@/components/ProductCard"

const CATEGORY_ORDER = [
  "all",
  "iphone-new",
  "iphone-premium",
  "iphone-outlet",
  "iphone",
  "ipad",
  "airpods",
  "ps5",
  "macbook",
]

const CATEGORY_LABELS: Record<string, string> = {
  all: "Todos",
  iphone: "iPhone (Todos)",
  "iphone-new": "iPhone Nuevos",
  "iphone-premium": "Usados Premium",
  "iphone-outlet": "iPhone Outlet",
  ipad: "iPad",
  airpods: "AirPods",
  ps5: "PS5",
  macbook: "MacBook",
}

const MODELOS = ["11", "12", "13", "14", "15", "16", "17"]
const SUBMODELOS = ["pro max", "pro", "air", "plus", "mini", "se"]
const ITEMS_PER_PAGE = 20

function normalizeName(v: string) {
  return v.toLowerCase().replace(/\s+/g, " ").trim()
}

export function CatalogClient({ products }: { products: ProductProps[] }) {
  const [category, setCategory] = useState("all")
  const [search, setSearch] = useState("")

  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<string | null>(null)

  const [capacityFilter, setCapacityFilter] = useState("")
  const [colorFilter, setColorFilter] = useState("")

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const [sortOrder, setSortOrder] = useState("none")
  const [sortGen, setSortGen] = useState("none")

  const [page, setPage] = useState(1)
 
  const resetFilters = () => {
    setSelectedModel(null)
    setSelectedSub(null)
    setCapacityFilter("")
    setColorFilter("")
    setMinPrice("")
    setMaxPrice("")
    setSortOrder("none")
    setSortGen("none")
    setSearch("")
  }

  // 🔥🔥 FIX PRINCIPAL: LIMPIAR filtros al montar
  useEffect(() => {
    setPage(1)
    }, [
      category,
      search,
      selectedModel,
      selectedSub,
      capacityFilter,
      colorFilter,
      minPrice,
      maxPrice,
      sortOrder,
      sortGen,
    ])
  
  
  // FILTRO POR CATEGORÍA
  const base = useMemo(() => {
    return products.filter((p) => {
      if (category === "all") return true
      if (category === "iphone") return p.category === "iphone"
      if (category === "iphone-new") return p.iphoneCondition === "iphone-new"
      if (category === "iphone-premium") return p.iphoneCondition === "iphone-premium"
      if (category === "iphone-outlet") return p.iphoneCondition === "iphone-outlet"
      return p.category === category
    })
  }, [products, category])

  // FILTROS SECUNDARIOS
  const filtered = useMemo(() => {
    return base.filter((p) => {
      const name = normalizeName(p.name)
      const color = normalizeName(p.color || "")
      const capacity = normalizeName(p.capacity || "")
  
      const searchText = search.toLowerCase()
  
      // 🔍 SEARCH global (nombre + color + capacidad)
      if (
        search &&
        !(
          name.includes(searchText) ||
          color.includes(searchText) ||
          capacity.includes(searchText)
        )
      ) {
        return false
      }
  
      // 📱 Modelo (11,12,13...)
      if (selectedModel && !name.includes("iphone " + selectedModel)) {
        return false
      }
  
      // 🧩 Submodelo (pro, air, etc)
      if (selectedSub && !name.includes(selectedSub.toLowerCase())) {
        return false
      }
  
      // 💾 Capacidad (128, 256, etc)
      if (capacityFilter && !capacity.includes(capacityFilter.toLowerCase())) {
        return false
      }
  
      // 🎨 Color
      if (colorFilter && !color.includes(colorFilter.toLowerCase())) {
        return false
      }
  
      // 💲 Precio
      const price = Number(p.priceUSD || 0)
      if (minPrice && price < Number(minPrice)) return false
      if (maxPrice && price > Number(maxPrice)) return false
  
      return true
    })
  }, [
    base,
    search,
    selectedModel,
    selectedSub,
    capacityFilter,
    colorFilter,
    minPrice,
    maxPrice,
  ])
  

  // ORDENAMIENTOS
  const ordered = useMemo(() => {
    let r = [...filtered]

    if (sortOrder !== "none") {
      r.sort((a, b) =>
        sortOrder === "asc"
          ? Number(a.priceUSD) - Number(b.priceUSD)
          : Number(b.priceUSD) - Number(a.priceUSD)
      )
    }

    const getGen = (name: string) => {
      const m = normalizeName(name).match(/iphone (\d+)/)
      return m ? Number(m[1]) : 0
    }

    if (sortGen !== "none") {
      r.sort((a, b) =>
        sortGen === "new" ? getGen(b.name) - getGen(a.name) : getGen(a.name) - getGen(b.name)
      )
    }

    return r
  }, [filtered, sortOrder, sortGen])

  // PAGINADO
  const totalPages = Math.ceil(ordered.length / ITEMS_PER_PAGE) || 1
  const paginated = ordered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="space-y-10">

      {/* CATEGORÍAS */}
      <div className="flex gap-2 flex-wrap justify-center">
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat)
              resetFilters()
            }}
            className={`
              px-4 py-2 rounded-full border text-sm font-medium
              ${category === cat ? "bg-black text-white" : "bg-gray-100 text-gray-700"}
            `}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* FILTROS */}
      <div className="sticky top-0 z-20 bg-white py-3 shadow-sm flex flex-wrap gap-2 justify-center">

        <Input
          placeholder="Buscar…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-40 text-sm"
        />

        {MODELOS.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedModel(selectedModel === m ? null : m)}
            className={`
              px-3 py-1 text-xs rounded-full border
              ${selectedModel === m ? "bg-black text-white" : "bg-white"}
            `}
          >
            {m}
          </button>
        ))}

        {SUBMODELOS.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSub(selectedSub === s ? null : s)}
            className={`
              px-3 py-1 text-xs rounded-full border
              ${selectedSub === s ? "bg-black text-white" : "bg-white"}
            `}
          >
            {s.toUpperCase()}
          </button>
        ))}

        <select
          className="px-2 py-1 border rounded-full text-xs"
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value)}
        >
          <option value="">Color</option>
          <option value="NEGRO">Negro</option>
          <option value="BLANCO">Blanco</option>
          <option value="AZUL">Azul</option>
          <option value="DORADO">Dorado</option>
          <option value="ROJO">Rojo</option>
          <option value="ROSA">Rosa</option>
          <option value="CELESTE">Celeste</option>
          <option value="NATURAL">Natural</option>
          <option value="PLATA">Plata</option>
          <option value="NARANJA">Naranja</option> 
          <option value="VERDE">Verde</option>
          <option value="AMARILLO">Amarillo</option>
          <option value="LILA">Lila</option>
        </select>

        <select
          className="px-2 py-1 border rounded-full text-xs"
          value={capacityFilter}
          onChange={(e) => setCapacityFilter(e.target.value)}
        >
          <option value="">Capacidad</option>
          <option value="64">64 GB</option>
          <option value="128">128 GB</option>
          <option value="256">256 GB</option>
          <option value="512">512 GB</option>
          <option value="1TB">1 TB</option>
        </select>
      </div>

      {/* PRODUCTOS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {paginated.map((p, idx) => (
          <ProductCard key={p.imei + "-" + idx} {...p} />
        ))}
      </div>

      {/* PAGINADO */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 py-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40"
          >
            ←
          </button>

          <span className="text-gray-700">
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}








