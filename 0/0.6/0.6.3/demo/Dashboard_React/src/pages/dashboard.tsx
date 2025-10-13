import { CONFIG } from 'src/config-global';

import { OverviewAnalyticsView as DashboardView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Panel - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Resumen principal con métricas claves del panel de control."
      />
      <meta
        name="keywords"
        content="react,material,kit,aplicación,tablero,administración,plantilla"
      />

      <DashboardView />
    </>
  );
}
