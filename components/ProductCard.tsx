"use client"

export type Props = {
  category: string   // 👈 AGREGAR ESTO
  name: string
  capacity: string
  battery: number | null
  color: string
  imei: string
  priceUSD: string
  priceARS: string
  image: string
  video: string
  provider?: string
  location?: string
  roi?: string
  cost?: string
}

// ⭐ Formato precios estilo Apple
function formatPrice(num: string | number) {
  if (!num) return "-"
  const n = Number(num)
  return n.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

// ⭐ Detectar BADGE Apple del modelo
function getModelBadge(name: string): string | null {
  const n = name.toLowerCase()

  if (n.includes("pro max")) return "Pro Max"
  if (n.includes("pro")) return "Pro"
  if (n.includes("plus")) return "Plus"
  if (n.includes("mini")) return "mini"
  if (n.includes("se")) return "SE"

  return null
}

// ⭐ Mapa de colores Apple REAL
const appleColorMap: Record<string, string> = {
  // iPhone color palette
  black: "bg-black",
  midnight: "bg-[#0A0A0A]",
  graphite: "bg-[#5E5E5E]",
  spaceblack: "bg-[#1C1C1E]",
  white: "bg-[#F5F5F7]",
  starlight: "bg-[#EDE6D9]",
  silver: "bg-[#D9D9D9]",
  blue: "bg-[#0A84FF]",
  deepblue: "bg-[#001A66]",
  pink: "bg-[#FFD1DC]",
  red: "bg-[#BF0A30]",
  green: "bg-[#34C759]",
  yellow: "bg-[#FFE55C]",
  purple: "bg-[#B490FF]",
  gold: "bg-[#F6E2B3]",
  natural: "bg-[#C9C1B0]",
  titanium: "bg-[#8A8680]",
}

// Normalizar nombre de color a clave del map
function normalizeAppleColor(raw: string) {
  if (!raw) return "gray"

  const c = raw.toLowerCase().replace(/\s/g, "")

  if (appleColorMap[c]) return c

  // mappings inteligentes
  if (c.includes("titan")) return "titanium"
  if (c.includes("silver")) return "silver"
  if (c.includes("white") || c.includes("blanco")) return "white"
  if (c.includes("black") || c.includes("negro") || c.includes("midnight"))
    return "black"
  if (c.includes("blue") || c.includes("azul")) return "blue"
  if (c.includes("pink") || c.includes("rosa")) return "pink"
  if (c.includes("gold") || c.includes("dorado")) return "gold"
  if (c.includes("red") || c.includes("rojo")) return "red"

  return "gray"
}

export function ProductCard(props: Props) {
  const {
    name,
    capacity,
    battery,
    color,
    imei,
    priceUSD,
    priceARS,
    video,
  } = props

  // Badge Apple (Pro, Pro Max, Plus, Mini, SE)
  const badge = getModelBadge(name)

  // Color Apple real
  const normalized = normalizeAppleColor(color)
  const dot = appleColorMap[normalized] || "bg-gray-400"

  return (
    <div
      className="
        bg-white border border-gray-200 rounded-3xl 
        shadow-sm hover:shadow-xl 
        transition-all duration-300 
        p-6 
        flex flex-col items-center text-center
      "
    >

      {/* NOMBRE */}
      <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
        {name}
      </h3>

      {/* BADGE (Pro, Pro Max, Plus, Mini, SE) */}
      {badge && (
        <span
          className="
            mt-2 px-3 py-1 
            text-xs font-medium 
            bg-black text-white 
            rounded-full
            shadow-sm
          "
        >
          {badge}
        </span>
      )}

      {/* CAPACIDAD + COLOR */}
      <p className="mt-4 text-gray-700 text-lg flex items-center justify-center gap-2">
        {capacity?.toUpperCase()}

        <span className={`h-3 w-3 rounded-full border ${dot}`} />

        <span className="capitalize">{color}</span>
      </p>

      {/* BATERÍA */}
      {battery !== null && (
        <p className="text-gray-500 text-sm mt-1">
          🔋 {battery}%
        </p>
      )}

      {/* IMEI */}
      <p className="text-gray-400 text-xs mt-2">
        IMEI: {imei}
      </p>

      {/* Divider */}
      <div className="w-full border-t mt-4 mb-4" />

      {/* PRECIO USD */}
      <div className="text-2xl font-semibold text-gray-900">
        ${formatPrice(priceUSD)}{" "}
        <span className="text-gray-500 text-sm">USD</span>
      </div>

      {/* PRECIO ARS */}
      {priceARS && (
        <div className="text-gray-700 text-sm mt-1">
          {formatPrice(priceARS)}{" "}
          <span className="text-gray-400 text-xs">pesos</span>
        </div>
      )}

      {/* VIDEO */}
      {video && (
        <a
          href={video}
          target="_blank"
          className="mt-5 text-blue-600 hover:underline text-sm font-medium"
        >
          🎥 Ver video del equipo
        </a>
      )}
    </div>
  )
}








