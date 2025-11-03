import { useState } from "react";
import { Database, Zap } from "lucide-react";
import { toast, Toaster } from "sonner";
import { ProductSearch } from "./components/ProductSearch";
import { ProductCard } from "./components/ProductCard";
import { MetricsPanel } from "./components/MetricsPanel";

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) || "http://localhost:3001";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  updated_at: string;
  image_url?: string; // <-- nuevo
};

type Perf = {
  timestamp: string;
  redisResponseTimeMs: number;
  dbResponseTimeMs: number;
  cache: { hit: number; miss: number; hitRatio: number };
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [source, setSource] = useState<"cache" | "db" | null>(null);
  const [ttl, setTtl] = useState<number | null>(null);

  const [perf, setPerf] = useState<Perf | null>(null);
  const [loadingPerf, setLoadingPerf] = useState(false);

  const [view, setView] = useState<"search" | "list">("search");

  const fetchProduct = async (id: string) => {
    if (!id) {
      toast.error("Ingresa un ID de producto");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`);
      const data = await res.json();
      if (!res.ok || data?.error) throw new Error(data?.error || "Error");
      setProduct(data.data);
      setSource(data.source);
      setTtl(data.ttlSeconds ?? null);
      toast.success(
        data.source === "cache"
          ? "⚡ Cache HIT - Respuesta ultrarrápida desde Redis"
          : "💾 Cache MISS - Datos obtenidos desde la base de datos"
      );
    } catch (e: any) {
      toast.error(e.message || "No se pudo obtener el producto");
      setProduct(null);
      setSource(null);
      setTtl(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerf = async () => {
    setLoadingPerf(true);
    try {
      const res = await fetch(`${API_BASE}/api/performance`);
      const data = await res.json();
      if (!res.ok) throw new Error("Perf error");
      setPerf(data);
      toast.success("Métricas actualizadas");
    } catch {
      toast.error("No se pudieron obtener métricas");
      setPerf(null);
    } finally {
      setLoadingPerf(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster richColors position="top-right" />

      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <Database className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl">Demo: Cache-Aside Pattern</h1>
                <p className="text-muted-foreground text-sm">Redis + SQL Database | Catálogo de Productos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Search Section */}
          <div>
            <div className="mb-3">
              <h2 className="text-lg text-muted-foreground">Buscar Producto</h2>
              <p className="text-sm text-muted-foreground">
                Ingresa un ID para buscar en el catálogo. El primer acceso consulta la BD, los siguientes usan caché.
              </p>
            </div>
            <ProductSearch onSearch={fetchProduct} loading={loading} />
          </div>

          {/* Product Result */}
          {product && source && (
            <div>
              <h2 className="text-lg text-muted-foreground mb-3">Resultado</h2>
              <ProductCard product={product} source={source} ttl={ttl} />
            </div>
          )}

          {/* Metrics */}
          <div>
            <div className="mb-3">
              <h2 className="text-lg text-muted-foreground">Métricas de Rendimiento</h2>
              <p className="text-sm text-muted-foreground">
                Compara los tiempos de respuesta entre Redis y la base de datos SQL
              </p>
            </div>
            <MetricsPanel perf={perf} loading={loadingPerf} onRefresh={fetchPerf} />
          </div>

          {/* Info Footer */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h3 className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-blue-900">¿Cómo funciona Cache-Aside?</span>
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
              <li>La aplicación primero verifica si el dato está en Redis (caché)</li>
              <li>Si existe (HIT), se devuelve inmediatamente desde el caché</li>
              <li>Si no existe (MISS), se consulta la base de datos SQL</li>
              <li>El dato obtenido se almacena en Redis para futuras consultas</li>
              <li>Los datos en caché expiran después del TTL configurado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
