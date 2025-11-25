"use client"

type Props = {
  name: string
  capacity: string
  battery: string
  color: string
  imei: string
  priceUSD: string
  priceARS: string
  image: string
  video: string
}

export function ProductCard({
  name,
  capacity,
  battery,
  color,
  imei,
  priceUSD,
  priceARS,
  video,
}: Props) {

  // FORMATO APPLE PARA CAPACIDAD
  const formattedCapacity = capacity
    ?.replace("GB", " GB")
    ?.replace("TB", " TB")
    ?.toUpperCase()

  // BADGES AUTOMÁTICOS PRO / PRO MAX / PLUS
  const getModelBadge = () => {
    const n = name.toLowerCase()
    if (n.includes("pro max")) return "Pro Max"
    if (n.includes("pro")) return "Pro"
    if (n.includes("plus")) return "Plus"
    return null
  }

  const badge = getModelBadge()

  // PUNTO DE COLOR APPLE
  const colorDot: Record<string, string> = {
    negro: "bg-black",
    black: "bg-black",
    midnight: "bg-black",
    blanco: "bg-gray-300",
    white: "bg-gray-200",
    silver: "bg-gray-300",
    azul: "bg-blue-500",
    blue: "bg-blue-500",
    rojo: "bg-red-500",
    red: "bg-red-500",
    dorado: "bg-yellow-400",
    gold: "bg-yellow-400",
  }

  const dotClass = colorDot[color.toLowerCase()] || "bg-gray-400"

  // ESTADO DE BATERÍA ESTILO APPLE
  const batteryNum = Number(battery || 0)

  const batteryStatus =
    batteryNum >= 95
      ? "Excelente"
      : batteryNum >= 90
      ? "Muy buena"
      : batteryNum >= 85
      ? "Buena"
      : "A revisar"

  return (
    <div className="
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
    ">

      {/* TÍTULO */}
      <h3 className="text-2xl font-semibold tracking-tight text-center font-[system-ui]">
        {name}
      </h3>

      {/* BADGE PRO / PRO MAX / PLUS */}
      {badge && (
        <div className="mt-2 text-center">
          <span className="px-3 py-1 text-xs rounded-full bg-black text-white">
            {badge}
          </span>
        </div>
      )}

      {/* INFO PRINCIPAL */}
      <div className="mt-5 space-y-3 text-center">

        {/* Capacidad + Color + Punto */}
        <p className="text-gray-800 text-lg flex items-center justify-center gap-2">
          {formattedCapacity}  
          
          {/* puntito de color */}
          <span 
            className={`h-3 w-3 rounded-full border ${dotClass}`} 
          ></span>

          <span className="capitalize">{color}</span>
        </p>

        {/* Estado de batería */}
        {battery && (
          <p className="text-gray-600 text-sm">
            🔋 {battery}% — {batteryStatus}
          </p>
        )}

        {/* IMEI */}
        <p className="text-gray-400 text-xs">IMEI: {imei}</p>

        {/* Divider */}
        <div className="border-t pt-3 mt-4" />

        {/* Precio */}
        <div className="text-xl font-semibold">
          <span className="text-black">${priceUSD}</span>{" "}
          <span className="text-gray-500 text-sm">USD</span>
        </div>

        {priceARS && (
          <p className="text-gray-500 text-sm">AR$ {priceARS}</p>
        )}

        {/* Video */}
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




