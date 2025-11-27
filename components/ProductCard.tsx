"use client"

import React from "react"

export type Props = {
  name: string
  capacity: string
  color: string
  imei: string
  priceUSD: string
  priceARS: string
  image: string
  video: string

  battery: number | null
  category: "iphone" | "iphone-new" | "ipad" | "airpods" | "ps5" | "no-battery"
}

// ----------------------------------------------------
// FORMATEADOR DE PRECIOS (formato argentino)
// ----------------------------------------------------
function formatPrice(value: string | number) {
  const num = Number(value)
  if (isNaN(num)) return value

  return num.toLocaleString("es-AR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export function ProductCard(props: Props) {
  const {
    name,
    capacity,
    color,
    imei,
    priceUSD,
    priceARS,
    video,
    battery,
    category,
  } = props

  // CAPACIDAD
  const formattedCapacity =
    capacity?.replace("GB", " GB")?.replace("TB", " TB")?.toUpperCase()

  // BADGES PRO / PLUS / MINI / etc
  const getModelBadge = () => {
    const n = name.toLowerCase()
    if (n.includes("pro max")) return "Pro Max"
    if (n.includes("pro")) return "Pro"
    if (n.includes("plus")) return "Plus"
    if (n.includes("mini")) return "Mini"
    return null
  }
  const badge = getModelBadge()

  // DOT DE COLOR
  const colorDot: Record<string, string> = {
    black: "bg-black",
    white: "bg-gray-200",
    silver: "bg-gray-300",
    blue: "bg-blue-500",
    red: "bg-red-500",
    gold: "bg-yellow-400",
    pink: "bg-pink-400",
    titanium: "bg-slate-400",
  }
  const dotClass = colorDot[color] || "bg-gray-400"

  return (
    <div
      className="
        rounded-3xl 
        border border-gray-200 
        p-6 
        shadow-sm 
        bg-white/70 
        backdrop-blur-md 
        hover:shadow-xl 
        hover:-translate-y-1 
        transition-all 
        duration-300
      "
    >
      {/* TÍTULO */}
      <h3 className="text-2xl font-semibold tracking-tight text-center font-[system-ui]">
        {name}
      </h3>

      {/* BADGE PRO / MAX / PLUS */}
      {badge && (
        <div className="mt-2 text-center">
          <span className="px-3 py-1 text-xs rounded-full bg-black text-white">
            {badge}
          </span>
        </div>
      )}

      {/* BADGE CATEGORÍA */}
      <div className="mt-2 text-center">
        {category === "iphone-new" && (
          <span className="px-3 py-1 text-xs rounded-full bg-green-600 text-white">
            Sellado / Nuevo
          </span>
        )}

        {category === "ipad" && (
          <span className="px-3 py-1 text-xs rounded-full bg-purple-600 text-white">
            iPad
          </span>
        )}

        {category === "airpods" && (
          <span className="px-3 py-1 text-xs rounded-full bg-gray-700 text-white">
            AirPods
          </span>
        )}

        {category === "ps5" && (
          <span className="px-3 py-1 text-xs rounded-full bg-indigo-600 text-white">
            PS5 Accesorio
          </span>
        )}

        {category === "no-battery" && (
          <span className="px-3 py-1 text-xs rounded-full bg-red-500 text-white">
            Sin datos de batería
          </span>
        )}
      </div>

      {/* INFO PRINCIPAL */}
      <div className="mt-5 space-y-3 text-center">

        {/* Capacidad + Color */}
        {capacity && (
          <p className="text-gray-800 text-lg flex items-center justify-center gap-2">
            {formattedCapacity}

            <span className={`h-3 w-3 rounded-full border ${dotClass}`}></span>

            <span className="capitalize">{color}</span>
          </p>
        )}

        {/* BATERÍA SIN TEXTO DE CALIDAD */}
        {category === "iphone" && battery !== null && (
          <p className="text-gray-600 text-sm">
            🔋 {battery}%
          </p>
        )}

        {category === "iphone-new" && (
          <p className="text-green-600 text-sm font-semibold">
            🔋 100%
          </p>
        )}

        {/* IMEI */}
        {imei && <p className="text-gray-400 text-xs">IMEI: {imei}</p>}

        <div className="border-t pt-3 mt-4" />

        {/* PRECIO USD */}
        {priceUSD && (
          <div className="text-xl font-semibold">
            <span className="text-black">$ {formatPrice(priceUSD)}</span>{" "}
            <span className="text-gray-500 text-sm">USD</span>
          </div>
        )}

        {/* PRECIO PESOS — sin AR$ adelante */}
        {priceARS && (
          <p className="text-gray-700 text-sm font-medium">
            {formatPrice(priceARS)} pesos
          </p>
        )}

        {/* VIDEO */}
        {video && (
          <a
            href={video}
            target="_blank"
            className="mt-4 inline-block text-black font-medium text-sm hover:underline"
          >
            🎥 Ver video del equipo
          </a>
        )}
      </div>
    </div>
  )
}







