import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Typography,
  Container,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

/**
 * Page de Connexion et d'Inscription
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [tab, setTab] = useState(0); // 0: Login, 1: Register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // État pour le formulaire de connexion
  const [loginForm, setLoginForm] = useState({
    email: '',
    mot_de_passe: '',
  });

  // État pour le formulaire d'inscription
  const [registerForm, setRegisterForm] = useState({
    nom: '',
    email: '',
    mot_de_passe: '',
    role: 'parent',
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Soumettre le formulaire de connexion
   */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/connexion', loginForm);
      
      // CORRECTION : Extraction de 'utilisateur' ou fallback 'user'
      const token = response.data?.token;
      const user = response.data?.utilisateur || response.data?.user || response.data;

      if (!token) {
        throw new Error("Le serveur n'a pas renvoyé de token d'authentification.");
      }

      login(user, token);
      setSuccess('Connexion réussie !');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Soumettre le formulaire d'inscription
   */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/inscription', registerForm);
      
      // CORRECTION : Même extraction ici pour l'inscription
      const token = response.data?.token;
      const user = response.data?.utilisateur || response.data?.user || response.data;

      login(user, token); // Utilise login ou register selon ton AuthContext
      setSuccess('Inscription réussie ! Redirection...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            {/* Titre */}
            <Typography
              variant="h4"
              align="center"
              sx={{ mb: 3, fontWeight: 'bold', color: '#667eea' }}
            >
              📚 GestionNotes
            </Typography>

            {/* Messages d'alerte */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {/* Tabs */}
            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              <Tab label="Connexion" />
              <Tab label="Inscription" />
            </Tabs>

            {/* ===== TAB 0: CONNEXION ===== */}
            {tab === 0 && (
              <form onSubmit={handleLoginSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  margin="normal"
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Mot de passe"
                  name="mot_de_passe"
                  type="password"
                  value={loginForm.mot_de_passe}
                  onChange={handleLoginChange}
                  margin="normal"
                  required
                  variant="outlined"
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
                </Button>
              </form>
            )}

            {/* ===== TAB 1: INSCRIPTION ===== */}
            {tab === 1 && (
              <form onSubmit={handleRegisterSubmit}>
                <TextField
                  fullWidth
                  label="Nom complet"
                  name="nom"
                  value={registerForm.nom}
                  onChange={handleRegisterChange}
                  margin="normal"
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  margin="normal"
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Mot de passe"
                  name="mot_de_passe"
                  type="password"
                  value={registerForm.mot_de_passe}
                  onChange={handleRegisterChange}
                  margin="normal"
                  required
                  variant="outlined"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Rôle</InputLabel>
                  <Select
                    name="role"
                    value={registerForm.role}
                    onChange={handleRegisterChange}
                    label="Rôle"
                  >
                    <MenuItem value="parent">Parent</MenuItem>
                    <MenuItem value="enseignant">Enseignant</MenuItem>
                    <MenuItem value="admin">Administrateur</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "S'inscrire"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;