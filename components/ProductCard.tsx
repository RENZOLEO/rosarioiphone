"use client"

// -----------------------------------------------------------
// IMAGEN GENÉRICA (para todos los modelos)
// -----------------------------------------------------------

// -----------------------------------------------------------
// IMAGEN SEGÚN CATEGORÍA
// -----------------------------------------------------------
import { IMAGE_MAP } from "@/lib/imageMap"

function getImageForProduct(name: string, color: string) {
  const key = `${name.toLowerCase().trim()}_${color.toLowerCase().trim()}`
  return IMAGE_MAP[key] || "/devices/default.png"
}

function colorToHex(color: string) {
  const c = color.toLowerCase()

  if (c.includes("negro") || c.includes("black")) return "#222"
  if (c.includes("azul") || c.includes("blue") || c.includes("celeste")) return "#3b82f6"
  if (c.includes("verde") || c.includes("green")) return "#22c55e"
  if (c.includes("rojo") || c.includes("red")) return "#ef4444"
  if (c.includes("dorado") || c.includes("gold")) return "#eab308"
  if (c.includes("gris") || c.includes("silver")) return "#9ca3af"
  if (c.includes("lila") || c.includes("purple")) return "#a855f7"
  if (c.includes("rosa") || c.includes("pink")) return "#ec4899"
  if (c.includes("blanco") || c.includes("white")) return "#f5f5f7"

  return "#aaa"
}

export type Props = {
  name: string
  capacity: string
  battery: number | null
  color: string
  imei: string
  priceUSD: string
  priceARS: string
  video?: string
  iphoneCondition?: string
  falla?: string
  category?: string   // 🔥 AGREGADO
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
    iphoneCondition,
    falla,
  } = props

  const img = getImageForProduct(name, color)
  const cap = capacity.toUpperCase().includes("GB") ? capacity : capacity + "GB"

  // -----------------------------------------------------------
  // VIDEO — SOLO SI PARECE UN LINK REAL
  // -----------------------------------------------------------
  let cleanVideo: string | null = null

  if (video && video.trim().length > 0) {
    let v = video.trim().replace(/\u00A0/g, " ")

    // si NO parece URL, no mostramos nada (ej: "VER VIDEO")
    const looksLikeUrl =
      v.toLowerCase().includes("http") ||
      v.toLowerCase().includes("drive.google.com") ||
      v.toLowerCase().includes("youtu")

    if (looksLikeUrl) {
      v = v.replace(/\s+/g, "") // sacamos espacios internos en caso de que haya

      if (!/^https?:\/\//i.test(v)) {
        v = "https://" + v
      }

      cleanVideo = v
    }
  }

  return (
    <div
      className="
        border border-gray-200 rounded-2xl p-4 shadow-sm bg-white
        hover:shadow-lg transition-all
        flex flex-col gap-3
      "
    >
      {/* BADGE */}
      {iphoneCondition && (
        <span
          className={`
            self-start px-2 py-1 text-xs rounded-lg font-medium text-white
            ${
              iphoneCondition === "iphone-new"
                ? "bg-green-600"
                : iphoneCondition === "iphone-outlet"
                ? "bg-orange-600"
                : "bg-blue-600"
            }
          `}
        >
          {iphoneCondition === "iphone-new"
            ? "Nuevo"
            : iphoneCondition === "iphone-outlet"
            ? "Outlet"
            : "Usado Premium"}
        </span>
      )}

      <p className="text-sm font-semibold text-emerald-700 -mt-1">
        ¡Págalo hasta en 24 cuotas fijas y en pesos!
      </p>  

      {/* IMAGEN */}
      <div className="w-full h-44 rounded-xl flex items-center justify-center overflow-hidden bg-white">
        <img
          src={img}
          alt={name}
          className="max-h-full object-contain"
        />
      </div>

      {/* NOMBRE */}
      <h3 className="text-lg font-bold text-gray-900">{name}</h3>

      {/* COLOR + PILL */}
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full border border-gray-300"
          style={{ backgroundColor: colorToHex(color) }}
        />
        <p className="text-sm text-gray-600 capitalize">{color}</p>
      </div>

      {/* CAPACIDAD */}
      <p className="text-sm text-gray-600">{cap}</p>

      {/* BATERÍA */}
      {battery !== null && (
        <p className="text-sm text-gray-600">🔋 {battery}%</p>
      )}

      {/* IMEI */}
      <p className="text-xs text-gray-500">IMEI: {imei}</p>

      {/* DETALLE OUTLET */}
      {iphoneCondition === "iphone-outlet" && falla && (
        <div className="mt-2 bg-orange-50 border border-orange-300 text-orange-800 p-3 rounded-lg text-sm">
          <span className="font-semibold">Detalle del Outlet:</span>
          <br />
          {falla}
        </div>
      )}

      {/* PRECIOS */}
      <div className="mt-2">
        <p className="text-lg font-bold text-gray-900">
          ${Number(priceUSD || 0).toLocaleString("es-AR")} dólares
        </p>
        <p className="text-lg font-bold text-gray-700">
          ${Number(priceARS || 0).toLocaleString("es-AR")} pesos
        </p>
      </div>

      {/* VER VIDEO */}
      {cleanVideo && (
        <a
          className="text-sm text-blue-600 underline mt-2"
          href={cleanVideo}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver video
        </a>
      )}
    </div>
  )
}







