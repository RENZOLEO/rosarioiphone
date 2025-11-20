import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

export default async function MinoristaPage({ params }: { params: Promise<{ empresa: string }> }) {
  const { empresa } = await params

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold">Catálogo Minorista</h1>
        <p className="text-gray-600">Empresa: {empresa}</p>
      </div>

      {/* Buscador */}
      <Input placeholder="Buscar producto..." className="max-w-sm" />

      {/* Chips (badges) */}
      <div className="flex gap-3">
        <Badge variant="outline">iPhone 13</Badge>
        <Badge variant="outline">iPhone 14</Badge>
        <Badge variant="outline">iPhone 15</Badge>
        <Badge variant="outline">iPhone 16</Badge>
      </div>

      {/* Cards vacías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        <Card>
          <CardHeader>
            <CardTitle>Producto demo</CardTitle>
            <CardDescription>Descripción del producto</CardDescription>
          </CardHeader>
          <CardContent>
            <p>$000.000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Producto demo 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p>$000.000</p>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}

