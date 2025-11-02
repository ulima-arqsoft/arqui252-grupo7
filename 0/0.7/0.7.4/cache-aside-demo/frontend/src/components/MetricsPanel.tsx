import { BarChart3, Loader2, Clock, Database, Zap, TrendingUp, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

type Perf = {
    timestamp: string;
    redisResponseTimeMs: number;
    dbResponseTimeMs: number;
    cache: { hit: number; miss: number; hitRatio: number };
};

type MetricsPanelProps = {
    perf: Perf | null;
    loading: boolean;
    onRefresh: () => void;
};

export function MetricsPanel({ perf, loading, onRefresh }: MetricsPanelProps) {
    const speedup =
        perf && perf.dbResponseTimeMs > 0 && perf.redisResponseTimeMs > 0
            ? (perf.dbResponseTimeMs / perf.redisResponseTimeMs).toFixed(1)
            : null;

    const hitRatioPercent = perf ? perf.cache.hitRatio * 100 : 0;

    return (
        <Card className="border-2 shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Métricas de Rendimiento
                    </CardTitle>
                    <Button onClick={onRefresh} disabled={loading} variant="outline" size="sm">
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Actualizar"
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {!perf ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Haz clic en "Actualizar" para ver las métricas</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Response Times */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-5 h-5 text-green-600" />
                                    <span className="text-sm text-green-700">Redis (Cache)</span>
                                </div>
                                <p className="font-mono text-2xl text-green-700">
                                    {typeof perf.redisResponseTimeMs === "number"
                                        ? perf.redisResponseTimeMs.toFixed(2)
                                        : "—"}
                                    <span className="text-sm ml-1">ms</span>
                                </p>
                            </div>

                            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Database className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm text-blue-700">Base de Datos SQL</span>
                                </div>
                                <p className="font-mono text-2xl text-blue-700">
                                    {typeof perf.dbResponseTimeMs === "number"
                                        ? perf.dbResponseTimeMs.toFixed(2)
                                        : "—"}
                                    <span className="text-sm ml-1">ms</span>
                                </p>
                            </div>
                        </div>

                        {/* Speedup Badge */}
                        {speedup && (
                            <div className="flex justify-center">
                                <Badge className="py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-base gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Cache {speedup}x más rápido
                                </Badge>
                            </div>
                        )}

                        {/* Cache Statistics */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Hit Ratio</span>
                                <Badge variant="outline">
                                    {hitRatioPercent.toFixed(1)}%
                                </Badge>
                            </div>
                            <Progress value={hitRatioPercent} className="h-3" />

                            <div className="grid grid-cols-3 gap-3 pt-2">
                                <div className="text-center p-3 bg-muted/50 rounded-lg">
                                    <Target className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">Total</p>
                                    <p className="font-mono">{perf.cache.hit + perf.cache.miss}</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <Zap className="w-4 h-4 mx-auto mb-1 text-green-600" />
                                    <p className="text-xs text-green-700">Hits</p>
                                    <p className="font-mono text-green-700">{perf.cache.hit}</p>
                                </div>
                                <div className="text-center p-3 bg-orange-50 rounded-lg">
                                    <Database className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                                    <p className="text-xs text-orange-700">Misses</p>
                                    <p className="font-mono text-orange-700">{perf.cache.miss}</p>
                                </div>
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                            <Clock className="w-4 h-4" />
                            <span>Actualizado: {new Date(perf.timestamp).toLocaleString("es-PE")}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
