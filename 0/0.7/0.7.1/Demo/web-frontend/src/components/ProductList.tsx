import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Stack
} from '@mui/material';
import { productService } from '../services/productService';
import type { ProductsResponse } from '../types/product';
import ProductCard from './ProductCard';


const ProductList: React.FC = () => {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts();
        setData(response);
        setError(null);
      } catch (err) {
        setError('Error al cargar los productos. Por favor, intenta de nuevo.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="primary">
          Cargando productos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!data || !data.products.length) {
    return (
      <Alert severity="info" sx={{ my: 4 }}>
        No hay productos disponibles
      </Alert>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Metadata */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={1}
        >
          <Typography variant="h6" fontWeight="bold">
            Total de productos: {data.metadata.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.metadata.source}
          </Typography>
        </Stack>
      </Paper>

      {/* Grid de productos - Usando la sintaxis oficial de MUI */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {data.products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;