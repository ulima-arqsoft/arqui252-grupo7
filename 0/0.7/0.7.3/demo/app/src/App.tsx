import { useCallback, useMemo, useRef, useState } from "react";
import {
  AppBar, Toolbar, Typography, Container, Box, Stack, Paper, IconButton, Button,
  LinearProgress, Snackbar, Alert, Chip, Grid, Card, CardActionArea, CardContent,
  CardMedia, Divider, Tooltip
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { BlockBlobClient } from "@azure/storage-blob";

import ErrorBoundary from "./components/error-boundary";

const API = import.meta.env.VITE_API_SERVER ?? "http://localhost:7071";
const CONTAINER = "uploads";

// util
const fmtBytes = (n: number) => {
  if (!n && n !== 0) return "-";
  const k = 1024; const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(n) / Math.log(k));
  return `${(n / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
};

type ListResponse = { list: string[] };
type SasResponse = { url: string };

export default function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#4f46e5" }, // indigo
          secondary: { main: "#06b6d4" }, // cyan
        },
        shape: { borderRadius: 16 },
      }),
    [mode]
  );

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [snack, setSnack] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [items, setItems] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = (f?: File) => {
    if (!f) return;
    setFile(f);
    setProgress(0);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onPick(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onPick(f);
  };

  const requestSAS = async (name: string, perm: "w" | "r", minutes = 5) => {
    const p = new URLSearchParams({
      container: CONTAINER,
      file: name,
      permission: perm,
      timerange: String(minutes),
    });
    const res = await fetch(`${API}/api/sas?${p}`, { method: "POST", headers: { "Content-Type": "application/json" } });
    if (!res.ok) throw new Error(`SAS ${perm} failed: ${res.status} ${res.statusText}`);
    const json: SasResponse = await res.json();
    return json.url;
  };

  const refreshList = useCallback(async () => {
    const res = await fetch(`${API}/api/list?container=${CONTAINER}`);
    const json: ListResponse = await res.json();
    setItems(json.list ?? []);
  }, []);

  const upload = async () => {
    if (!file) return;
    try {
      setBusy(true);
      setProgress(0);

      // 1) SAS de escritura
      const sasUrl = await requestSAS(file.name, "w", 5);

      // 2) Subida con progreso
      const blob = new BlockBlobClient(sasUrl);
      await blob.uploadData(file, {
        onProgress: (ev) => {
          const p = Math.round((ev.loadedBytes / file.size) * 100);
          setProgress(p);
        },
      });

      setSnack({ type: "success", msg: "Upload completo" });
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      await refreshList();
    } catch (e: any) {
      setSnack({ type: "error", msg: e?.message ?? String(e) });
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const openReadOnly = async (blobUrl: string) => {
    try {
      const name = decodeURIComponent(blobUrl.split("/").pop() || "");
      const readUrl = await requestSAS(name, "r", 2);
      window.open(readUrl, "_blank");
    } catch (e: any) {
      setSnack({ type: "error", msg: e?.message ?? String(e) });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <AppBar position="sticky" elevation={0} color="transparent">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CloudDoneIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>Valet Key Upload</Typography>
              <Chip label={`container: ${CONTAINER}`} size="small" variant="outlined" sx={{ ml: 1 }} />
            </Stack>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Refrescar lista">
                <IconButton onClick={refreshList}><RefreshIcon /></IconButton>
              </Tooltip>
              <IconButton onClick={() => setMode(m => (m === "light" ? "dark" : "light"))}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Zona de selección / drag & drop */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderStyle: "dashed",
              borderColor: dragOver ? "secondary.main" : "divider",
              bgcolor: dragOver ? "action.hover" : "background.paper",
              transition: "all .2s",
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <Stack spacing={2} alignItems="center">
              <UploadFileIcon color="primary" sx={{ fontSize: 44 }} />
              <Typography variant="h5" fontWeight={700} textAlign="center">
                Arrastra tu archivo o haz clic para seleccionarlo
              </Typography>

              <input ref={inputRef} hidden type="file" onChange={onFileChange} />
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="contained"
                  onClick={() => inputRef.current?.click()}
                >
                  Elegir archivo
                </Button>
                {file && (
                  <Chip
                    label={`${file.name} · ${fmtBytes(file.size)}`}
                    color="secondary"
                    variant="outlined"
                  />
                )}
              </Stack>

              <Stack spacing={1} sx={{ width: "100%" }}>
                {busy && (
                  <>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      Subiendo… {progress}%
                    </Typography>
                  </>
                )}
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  onClick={upload}
                  disabled={!file || busy}
                  variant="contained"
                  startIcon={<UploadFileIcon />}
                >
                  Upload
                </Button>
                <Button
                  onClick={refreshList}
                  disabled={busy}
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                >
                  Actualizar lista
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Lista de blobs */}
          <Box mt={4}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Typography variant="h6" fontWeight={700}>Archivos en Blob Storage</Typography>
              <Divider sx={{ flex: 1 }} />
            </Stack>

            {items.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">No hay archivos (aún).</Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {items.map((u) => {
                  const isImg = /\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(u);
                  const name = decodeURIComponent(u.split("/").pop() || "");
                  return (
                    <Grid item xs={12} sm={6} md={4} key={u}>
                      <Card sx={{ overflow: "hidden" }}>
                        <CardActionArea onClick={() => openReadOnly(u)}>
                          {isImg ? (
                            <CardMedia component="img" height="160" image={u} alt={name} />
                          ) : (
                            <Box
                              sx={{
                                height: 160, display: "grid", placeItems: "center",
                                bgcolor: "action.hover",
                              }}
                            >
                              <InsertDriveFileIcon sx={{ fontSize: 56, opacity: 0.7 }} />
                            </Box>
                          )}
                        </CardActionArea>
                        <CardContent sx={{ pt: 1.5 }}>
                          <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              {isImg ? <ImageIcon fontSize="small" /> : <InsertDriveFileIcon fontSize="small" />}
                              <Tooltip title={name}><Typography noWrap>{name}</Typography></Tooltip>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => openReadOnly(u)}
                                endIcon={<OpenInNewIcon />}
                              >
                                Open (SAS r)
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </Container>

        {/* Snackbars */}
        <Snackbar
          open={!!snack}
          autoHideDuration={3500}
          onClose={() => setSnack(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnack(null)}
            severity={snack?.type ?? "success"}
            variant="filled"
            iconMapping={{ success: <CloudDoneIcon />, error: <ErrorOutlineIcon /> }}
            sx={{ width: "100%" }}
          >
            {snack?.msg}
          </Alert>
        </Snackbar>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
