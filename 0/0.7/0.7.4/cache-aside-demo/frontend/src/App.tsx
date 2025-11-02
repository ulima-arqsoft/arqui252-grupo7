import { useState } from "react";
import { Search, BarChart3, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  updated_at: string;
};

export default function App() {

  type Perf = {
    timestamp: string;
    redisResponseTimeMs: number;
    dbResponseTimeMs: number; // 👈 nuevo
    cache: { hit: number; miss: number; hitRatio: number };
  };

  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [source, setSource] = useState<"cache" | "db" | null>(null);
  const [ttl, setTtl] = useState<number | null>(null);

  const [perf, setPerf] = useState<Perf | null>(null);
  const [loadingPerf, setLoadingPerf] = useState(false);

  const fetchProduct = async () => {
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
      toast.success(data.source === "cache" ? "Cache HIT" : "Cache MISS");
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
    } catch {
      toast.error("No se pudieron obtener métricas");
      setPerf(null);
    } finally {
      setLoadingPerf(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster richColors position="top-right" />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Demo Cache-Aside</h1>
          <p className="text-gray-600">E-commerce (productos) con Redis</p>
        </header>

        {/* Buscar producto */}
        <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex gap-3">
            <input
              className="flex-1 border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ID de producto (ej. 1)"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchProduct()}
            />
            <button
              onClick={fetchProduct}
              disabled={loading}
              className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
            </button>
          </div>

          {product && (
            <div className="mt-5 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">
                Origen:{" "}
                <span className={source === "cache" ? "text-green-600" : "text-purple-600"}>
                  {source?.toUpperCase()}
                </span>{" "}
                {ttl !== null && <span className="text-gray-500">| TTL: {ttl}s</span>}
              </p>
              <div className="grid grid-cols-2 gap-4 text-gray-800">
                <div><b>ID:</b> {product.id}</div>
                <div><b>Nombre:</b> {product.name}</div>
                <div><b>Precio:</b> S/ {product.price.toFixed(2)}</div>
                <div><b>Stock:</b> {product.stock}</div>
                <div className="col-span-2">
                  <b>Actualizado:</b> {new Date(product.updated_at).toLocaleString("es-PE")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Métricas */}
        <div className="mt-6 bg-white/70 backdrop-blur border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold">Métricas</h2>
            </div>
            <button
              onClick={fetchPerf}
              disabled={loadingPerf}
              className="px-3 py-2 rounded-md border hover:bg-gray-50 disabled:opacity-50"
            >
              {loadingPerf ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar"}
            </button>
          </div>

          {perf && (
            <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 text-gray-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <p>
                  <b>Redis RTT:</b>{" "}
                  {typeof perf.redisResponseTimeMs === "number"
                    ? perf.redisResponseTimeMs.toFixed(2)
                    : "—"}{" "}
                  ms
                </p>
                <p>
                  <b>DB RTT:</b>{" "}
                  {typeof perf.dbResponseTimeMs === "number"
                    ? perf.dbResponseTimeMs.toFixed(2)
                    : "—"}{" "}
                  ms
                </p>
                <p>
                  <b>Cache hits:</b> {perf.cache.hit} &nbsp;|&nbsp; <b>miss:</b>{" "}
                  {perf.cache.miss}
                </p>
                <p>
                  <b>Hit ratio:</b>{" "}
                  {typeof perf.cache.hitRatio === "number"
                    ? (perf.cache.hitRatio * 100).toFixed(1)
                    : "—"}
                  %
                </p>
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Actualizado: {new Date(perf.timestamp).toLocaleString("es-PE")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
