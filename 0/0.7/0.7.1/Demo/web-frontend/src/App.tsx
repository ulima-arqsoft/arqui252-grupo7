import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import ProductList from './components/ProductList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <ShoppingBag sx={{ mr: 2, fontSize: 32 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                E-Commerce Web
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Powered by BFF Web - Optimizado para escritorio
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          <ProductList />
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            backgroundColor: 'grey.100',
            textAlign: 'center',
          }}
        >
          <Container>
            <Typography variant="body2" color="text.secondary">
              © 2025 E-Commerce Platform - Arquitectura BFF Pattern
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;