import { useEffect, useState } from "react";
import {
  Link as LinkIcon,
  BarChart3,
  Copy,
  Check,
  Loader2,
  History,
  Trash2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

interface ShortenedUrlItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  code: string;
  createdAt: string | null;
  clicks?: number;
  ttlSeconds?: number;
}

export default function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isShortening, setIsShortening] = useState(false);
  const [copied, setCopied] = useState(false);

  const [statsCode, setStatsCode] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const [urlHistory, setUrlHistory] = useState<ShortenedUrlItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [perfData, setPerfData] = useState<any>(null);
  const [isLoadingPerf, setIsLoadingPerf] = useState(false);

  // === Cargar historial desde Redis al montar ===
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/list`);
        const data = await res.json();
        if (!res.ok || data?.error)
          throw new Error(data?.error || "No se pudo cargar historial");
        const items: ShortenedUrlItem[] = (data.items || []).map((it: any) => ({
          id: it.code,
          originalUrl: it.originalUrl,
          shortUrl: it.shortUrl,
          code: it.code,
          createdAt: it.createdAt || null,
          clicks: it.clicks,
          ttlSeconds: it.ttlSeconds,
        }));
        setUrlHistory(items);
        try {
          localStorage.setItem("urlHistory", JSON.stringify(items));
        } catch { }
      } catch (e: any) {
        console.warn("No se pudo cargar historial:", e?.message || e);
      }
    })();
  }, []);

  // === Función para refrescar historial manualmente ===
  const refreshHistory = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`${API_BASE}/api/list`);
      const data = await res.json();
      if (!res.ok || data?.error)
        throw new Error(data?.error || "Error al actualizar historial");
      const items: ShortenedUrlItem[] = (data.items || []).map((it: any) => ({
        id: it.code,
        originalUrl: it.originalUrl,
        shortUrl: it.shortUrl,
        code: it.code,
        createdAt: it.createdAt || null,
        clicks: it.clicks,
        ttlSeconds: it.ttlSeconds,
      }));
      setUrlHistory(items);
      toast.success("Historial actualizado");
    } catch (e: any) {
      toast.error(e.message || "Error al actualizar historial");
    } finally {
      setIsRefreshing(false);
    }
  };

  // === Acortar URL ===
  const handleShorten = async () => {
    if (!longUrl) {
      toast.error("Por favor ingresa una URL");
      return;
    }
    setIsShortening(true);
    try {
      const res = await fetch(`${API_BASE}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: longUrl }),
      });
      const data = await res.json();
      if (!res.ok || data?.error)
        throw new Error(data?.error || "Error al acortar");

      const shortUrl = data.shortUrl;
      const code = data.code;
      setShortenedUrl(shortUrl);

      const newItem: ShortenedUrlItem = {
        id: `${Date.now()}`,
        originalUrl: longUrl,
        shortUrl,
        code,
        createdAt: new Date().toISOString(),
      };
      setUrlHistory((prev) => [newItem, ...prev]);

      toast.success("¡URL acortada exitosamente!");
      setLongUrl("");
    } catch (e: any) {
      toast.error(e.message || "Error al acortar la URL");
    } finally {
      setIsShortening(false);
    }
  };

  // === Copiar URL ===
  const handleCopy = () => {
    if (!shortenedUrl) return;
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    toast.success("¡Copiado al portapapeles!");
    setTimeout(() => setCopied(false), 2000);
  };

  // === Obtener estadísticas ===
  const handleGetStats = async () => {
    if (!statsCode) {
      toast.error("Por favor ingresa un código");
      return;
    }

    setIsLoadingStats(true);
    try {
      const res = await fetch(`${API_BASE}/api/stats/${statsCode}`);
      const data = await res.json();
      if (!res.ok || data?.error)
        throw new Error(data?.error || "No se pudo obtener estadísticas");

      setStats({
        code: data.code,
        originalUrl: data.originalUrl,
        clicks: data.clicks,
        ttl: data.ttlSeconds,
        createdAt: data.meta?.created_at || new Date().toISOString(),
      });
    } catch (e: any) {
      toast.error(e.message || "Error al obtener estadísticas");
      setStats(null);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // === Acciones en historial ===
  const handleCopyFromHistory = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("¡Copiado al portapapeles!");
  };

  const handleDeleteFromHistory = async (id: string, code: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE}/api/url/${code}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || data?.error) throw new Error(data?.error || "No se pudo eliminar");
      setUrlHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("Eliminado en Redis");
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  const fetchPerformance = async () => {
    setIsLoadingPerf(true);
    try {
      const res = await fetch(`${API_BASE}/api/performance`);
      const data = await res.json();
      setPerfData(data);
      toast.success('Métricas actualizadas');
    } catch (err) {
      toast.error('Error al obtener métricas');
    } finally {
      setIsLoadingPerf(false);
    }
  };

  // === UI ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <LinkIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Redis URL Shortener
          </h1>
          <p className="text-gray-600">
            Front web separado que consume la API de Redis
          </p>
        </div>

        <div className="space-y-6">
          {/* === Acortar URL === */}
          <Card className="border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-blue-600" />
                Acortar una URL
              </CardTitle>
              <CardDescription>
                Ingresa una URL larga para obtener un enlace corto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="https://ulima.edu.pe"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                  className="flex-1"
                />
                <Button
                  onClick={handleShorten}
                  disabled={isShortening}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isShortening ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Acortando...
                    </>
                  ) : (
                    "Acortar"
                  )}
                </Button>
              </div>

              {shortenedUrl && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-700 mb-2">URL acortada:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white px-3 py-2 rounded border border-gray-200 text-blue-600 break-all">
                      {shortenedUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="shrink-0"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}
              <p className="text-gray-500">
                La API asigna TTL y cuenta clics con{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                  INCR
                </code>
              </p>
            </CardContent>
          </Card>

          {/* === Ver estadísticas === */}
          <Card className="border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Ver estadísticas
              </CardTitle>
              <CardDescription>
                Consulta las estadísticas de un enlace acortado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Ingresa el código (ej: abc1234)"
                  value={statsCode}
                  onChange={(e) => setStatsCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGetStats()}
                  className="flex-1"
                />
                <Button
                  onClick={handleGetStats}
                  disabled={isLoadingStats}
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50"
                >
                  {isLoadingStats ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    "Ver stats"
                  )}
                </Button>
              </div>

              {stats && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                  <div className="space-y-3">
                    <p className="text-gray-600">Código: {stats.code}</p>
                    <p className="text-gray-600 break-all">
                      URL original: {stats.originalUrl}
                    </p>
                    <p className="text-gray-600">
                      Clics: <span className="text-purple-600">{stats.clicks}</span>
                    </p>
                    <p className="text-gray-600">
                      TTL restante: {stats.ttl}s
                    </p>
                    <p className="text-gray-600">
                      Creado:{" "}
                      {new Date(stats.createdAt).toLocaleString("es-ES")}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* === Historial de URLs === */}
          <Card className="border-gray-200 shadow-lg">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-green-600" />
                  Historial de URLs
                </CardTitle>
                <CardDescription>
                  Todas las URLs acortadas (desde Redis)
                </CardDescription>
              </div>
              <Button variant="outline" onClick={refreshHistory} disabled={isRefreshing}>
                {isRefreshing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Actualizando
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1" /> Refrescar
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {urlHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No hay URLs en el historial</p>
                  <p className="text-sm">Acorta tu primera URL para empezar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {urlHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-600 mb-1">URL original:</p>
                            <p className="text-gray-800 break-all">{item.originalUrl}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(item.originalUrl, "_blank")}
                              className="hover:bg-white/50"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyFromHistory(item.shortUrl)}
                              className="hover:bg-white/50"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteFromHistory(item.id, item.code)}
                              className="hover:bg-red-100 hover:text-red-600"
                              title="Eliminar del historial"
                              disabled={deletingId === item.id}
                            >
                              {deletingId === item.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <code className="bg-white px-3 py-1 rounded border border-gray-200 text-green-600 break-all">
                            {item.shortUrl}
                          </code>
                          <p className="text-gray-500 text-sm">
                            {new Date(item.createdAt || "").toLocaleString("es-ES")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics Section */}
          <Card className="border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Métricas de rendimiento
              </CardTitle>
              <CardDescription>
                Monitorea los tiempos de respuesta del backend y Redis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={fetchPerformance}
                disabled={isLoadingPerf}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isLoadingPerf ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  "Actualizar métricas"
                )}
              </Button>

              {perfData && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                  <p className="text-gray-700">
                    <strong>Backend:</strong> {perfData.backendResponseTime.toFixed(2)} ms
                  </p>
                  <p className="text-gray-700">
                    <strong>Redis:</strong> {perfData.redisResponseTime} ms
                  </p>
                  <p className="text-gray-500 text-sm">
                    Última actualización: {new Date(perfData.timestamp).toLocaleString("es-ES")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-gray-500">
          <p>Powered by Redis & React</p>
        </div>
      </div>
    </div>
  );
}
