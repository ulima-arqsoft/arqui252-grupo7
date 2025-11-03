import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type ProductSearchProps = {
    onSearch: (id: string) => void;
    loading: boolean;
};

export function ProductSearch({ onSearch, loading }: ProductSearchProps) {
    const [id, setId] = useState<string>("");

    const handleSearch = () => {
        if (id.trim()) {
            onSearch(id.trim());
        }
    };

    return (
        <Card className="border-2 shadow-lg">
            <CardContent className="pt-6">
                <div className="flex gap-3">
                    <Input
                        className="flex-1"
                        placeholder="Ingresa el ID del producto (ej. 1, 2, 3...)"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        disabled={loading}
                    />
                    <Button
                        onClick={handleSearch}
                        disabled={loading || !id.trim()}
                        size="lg"
                        className="min-w-[120px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Buscando
                            </>
                        ) : (
                            <>
                                <Search className="w-4 h-4 mr-2" />
                                Buscar
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
