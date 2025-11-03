import { useEffect, useState } from "react";
import { ArrowLeft, ImageOff } from "lucide-react";
import { Button } from "./ui/button";

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    updated_at: string;
    image_url?: string;
};

type Props = {
    apiBase: string;
    onBack: () => void;
};

export function ProductList({ apiBase, onBack }: Props) {
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const res = await fetch(`${apiBase}/api/products`);
                const data = await res.json();
                if (!res.ok || data?.error) throw new Error(data?.error || "Error");
                if (!ignore) setItems(data.items || []);
            } catch (e) {
                console.error(e);
            } finally {
                if (!ignore) setLoading(false);
            }
        })();
        return () => { ignore = true; };
    }, [apiBase]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg text-muted-foreground">Catálogo completo</h2>
                    <p className="text-sm text-muted-foreground">
                        Lista de productos desde la base (seed). Las búsquedas puntuales se benefician de la caché.
                    </p>
                </div>
                <Button onClick={onBack} variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-56 rounded-xl bg-white/70 border animate-pulse" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center text-gray-500 border rounded-xl p-8 bg-white/70">
                    No hay productos cargados.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((p) => (
                        <div key={p.id} className="rounded-xl border bg-white/80 shadow-sm overflow-hidden">
                            <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                                {p.image_url ? (
                                    <img
                                        src={p.image_url}
                                        alt={p.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <ImageOff className="w-5 h-5" />
                                        <span className="text-sm">Sin imagen</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium text-gray-900 line-clamp-1">{p.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Actualizado: {new Date(p.updated_at).toLocaleString("es-PE")}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="font-semibold">S/ {p.price.toFixed(2)}</span>
                                    {p.stock > 0 ? (
                                        <span className="text-green-600 text-sm">{p.stock} uds</span>
                                    ) : (
                                        <span className="text-red-600 text-sm">Agotado</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
