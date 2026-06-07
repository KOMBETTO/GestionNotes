import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

/**
 * Composant Layout qui wrap les pages avec un header et navigation
 */
const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header/AppBar */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1.5rem',
            }}
            onClick={() => navigate('/dashboard')}
          >
            📚 GestionNotes
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && (
              <>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {user.nom || user.email}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    textTransform: 'capitalize',
                  }}
                >
                  {user.role}
                </Typography>
              </>
            )}
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ ml: 2 }}
            >
              Déconnexion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        {children}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
          borderTop: '1px solid #ddd',
        }}
      >
        <Typography variant="body2" color="textSecondary">
          © 2024 GestionNotes - Gestion des notes scolaires
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
