import { Package, DollarSign, Hash, Calendar, Database, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    updated_at: string;
};

type ProductCardProps = {
    product: Product;
    source: "cache" | "db";
    ttl: number | null;
};

export function ProductCard({ product, source, ttl }: ProductCardProps) {
    const isCache = source === "cache";

    return (
        <Card className="border-2 shadow-lg animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        Producto Encontrado
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {isCache ? (
                            <Badge className="bg-green-500 hover:bg-green-600 gap-1">
                                <Zap className="w-3 h-3" />
                                CACHE HIT
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200 gap-1">
                                <Database className="w-3 h-3" />
                                DATABASE
                            </Badge>
                        )}
                        {ttl !== null && (
                            <Badge variant="outline" className="gap-1">
                                TTL: {ttl}s
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Hash className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-muted-foreground text-sm">ID</p>
                            <p className="font-mono">{product.id}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-muted-foreground text-sm">Nombre</p>
                            <p>{product.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-muted-foreground text-sm">Precio</p>
                            <p className="font-mono">S/ {product.price.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-muted-foreground text-sm">Stock</p>
                            <p>
                                {product.stock > 0 ? (
                                    <span className="text-green-600">{product.stock} unidades</span>
                                ) : (
                                    <span className="text-red-600">Agotado</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Actualizado: {new Date(product.updated_at).toLocaleString("es-PE")}</span>
                </div>
            </CardContent>
        </Card>
    );
}
