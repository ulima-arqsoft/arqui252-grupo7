import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Rating,
  Stack
} from '@mui/material';
import { ShoppingCart, Inventory2 } from '@mui/icons-material';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image_url}
        alt={product.name}
        sx={{ 
          objectFit: 'cover',
          backgroundColor: 'grey.200' // Color de fondo mientras carga
        }}
        onError={(e) => {
          console.error('Error loading image:', product.image_url);
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=' + encodeURIComponent(product.name);
        }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Categoría y Rating */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip
            label={product.category_name}
            color="primary"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          <Box display="flex" alignItems="center" gap={0.5}>
            <Rating value={product.rating} precision={0.1} size="small" readOnly />
            <Typography variant="body2" fontWeight="bold">
              {product.rating}
            </Typography>
          </Box>
        </Stack>

        {/* Nombre del producto */}
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
          }}
        >
          {product.name}
        </Typography>

        {/* Descripción */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {product.description}
        </Typography>

        {/* Precio y Stock */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" color="primary" fontWeight="bold">
            ${product.price}
          </Typography>
          <Chip
            icon={<Inventory2 />}
            label={product.in_stock ? `Stock: ${product.stock}` : 'Sin stock'}
            color={product.in_stock ? 'success' : 'error'}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        </Stack>
      </CardContent>

      <CardActions sx={{ padding: 2, paddingTop: 0 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!product.in_stock}
          startIcon={<ShoppingCart />}
          sx={{
            py: 1.5,
            fontWeight: 'bold',
          }}
        >
          {product.in_stock ? 'Agregar al carrito' : 'No disponible'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;