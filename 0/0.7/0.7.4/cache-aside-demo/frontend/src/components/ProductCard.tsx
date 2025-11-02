import {
    Package,
    DollarSign,
    Hash,
    Calendar,
    Database,
    Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    updated_at: string;
    image_url?: string | null; // 👈 nuevo
};

type ProductCardProps = {
    product: Product;
    source: "cache" | "db";
    ttl: number | null;
};

const FALLBACK_IMG =
    "https://images.unsplash.com/photo-1520975922284-8b456906c813?w=960&q=80&auto=format&fit=crop";

export function ProductCard({ product, source, ttl }: ProductCardProps) {
    const isCache = source === "cache";
    const img = product.image_url || FALLBACK_IMG;

    return (
        <Card className="border-2 shadow-lg overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {/* Imagen + badge de origen */}
            <div className="relative">
                <img
                    src={img}
                    alt={product.name}
                    className="w-full h-56 sm:h-64 object-cover"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                    }}
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                    {isCache ? (
                        <Badge className="bg-green-500 hover:bg-green-600 gap-1 shadow-md">
                            <Zap className="w-3 h-3" />
                            CACHE HIT
                        </Badge>
                    ) : (
                        <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-700 hover:bg-purple-200 gap-1 shadow-md"
                        >
                            <Database className="w-3 h-3" />
                            DATABASE
                        </Badge>
                    )}
                    {ttl !== null && (
                        <Badge variant="outline" className="bg-white/90 backdrop-blur gap-1">
                            TTL: {ttl}s
                        </Badge>
                    )}
                </div>
            </div>

            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    {product.name}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Grid de atributos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Hash className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-muted-foreground text-sm">ID</p>
                            <p className="font-mono">{product.id}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-muted-foreground text-sm">Precio</p>
                            <p className="font-mono">S/ {product.price.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg sm:col-span-2">
                        <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-muted-foreground text-sm">Stock</p>
                            {product.stock > 0 ? (
                                <span className="text-green-600">{product.stock} unidades</span>
                            ) : (
                                <span className="text-red-600">Agotado</span>
                            )}
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                        Actualizado: {new Date(product.updated_at).toLocaleString("es-PE")}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
