import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hola, bienvenido de nuevo 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Ventas semanales"
            percent={2.6}
            total={714000}
            icon={<img alt="Ventas semanales" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Nuevos usuarios"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={<img alt="Nuevos usuarios" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Órdenes de compra"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={<img alt="Órdenes de compra" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Mensajes"
            percent={3.6}
            total={234}
            color="error"
            icon={<img alt="Mensajes" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Visitas actuales"
            chart={{
              series: [
                { label: 'América', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europa', value: 1500 },
                { label: 'África', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Visitas al sitio web"
            subheader="(+43%) que el año pasado"
            chart={{
              categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
              series: [
                { name: 'Equipo A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Equipo B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
