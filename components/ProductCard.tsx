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

        {/* CONTACTAR — MINIMAL WHATSAPP BUTTON */}
          <a
            href={`https://wa.me/5493413020969?text=${encodeURIComponent(
              `Hola! Estoy interesado en el ${name} ${capacity} ${color}. IMEI: ${imei}. ¿Está disponible?`
            )}`}
            target="_blank"
            className="
              mt-3 inline-flex items-center gap-2
              px-3 py-2
              bg-green-500/10
              text-green-600
              rounded-full
              border border-green-400/30
              hover:bg-green-500/20
              transition-all active:scale-95
              text-sm font-medium
              self-start
            "
          >
            {/* Ícono WhatsApp SVG */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 24 24'
              className='w-4 h-4'
            >
              <path d='M20.52 3.48A11.78 11.78 0 0 0 12 0C5.37 0 .02 5.35.02 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.22-1.63a11.9 11.9 0 0 0 5.78 1.47h.01c6.63 0 12-5.35 12-11.97 0-3.19-1.24-6.22-3.49-8.39zM12 21.48h-.01A9.46 9.46 0 0 1 7.2 20l-.37-.22-3.69.97 1-3.59-.24-.37A9.43 9.43 0 0 1 2.57 12c0-5.2 4.24-9.43 9.45-9.43 2.53 0 4.92.99 6.71 2.78A9.35 9.35 0 0 1 21.48 12c0 5.2-4.24 9.48-9.48 9.48zm5.27-7.12c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.15-.19.29-.74.93-.91 1.12-.17.19-.34.21-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.45.13-.6.14-.14.29-.37.44-.55.15-.19.19-.29.29-.48.1-.19.05-.36-.02-.51-.08-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.51.07-.77.36-.26.29-1.01.98-1.01 2.39 0 1.41 1.03 2.77 1.17 2.96.14.19 2.04 3.1 5.04 4.35.7.3 1.25.48 1.68.62.7.23 1.33.2 1.83.12.56-.08 1.7-.69 1.94-1.36.24-.67.24-1.25.17-1.36-.07-.11-.26-.18-.55-.33z'/>
            </svg>

            Contactar
          </a>

    </div>
  )
}







