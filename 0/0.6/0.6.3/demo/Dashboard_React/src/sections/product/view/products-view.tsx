import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _products } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { ProductItem } from '../product-item';

export function ProductsView() {
  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Productos
      </Typography>
      <Grid container spacing={3}>
        {_products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ProductItem product={product} />
          </Grid>
        ))}
      </Grid>
    </DashboardContent>
  );
}
