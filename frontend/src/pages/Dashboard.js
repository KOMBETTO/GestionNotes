import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import TeacherDashboard from './TeacherDashboard';
import ParentDashboard from './ParentDashboard';

/**
 * Page Dashboard - Router central basé sur le rôle de l'utilisateur (casse-insensible)
 * Sécurisé pour éviter les redirections par défaut erronées vers le Parent Dashboard
 */
const Dashboard = () => {
  const { user, logout } = useAuth(); // Récupère le logout au cas où

  // Nettoyage complet de la chaîne pour éviter les pièges de casse
  const userRole = user?.role ? user.role.toLowerCase().trim() : '';

  // 1. Redirection vers l'espace de gestion/enseignant si admin ou enseignant
  if (
    userRole === 'enseignant' || 
    userRole === 'admin' || 
    userRole === 'administrateur' || 
    userRole === 'administrator'
  ) {
    return <TeacherDashboard />;
  }

  // 2. Redirection stricte vers le tableau des parents uniquement si le rôle est 'parent'
  if (userRole === 'parent') {
    return <ParentDashboard />;
  }

  // 3. Fallback de sécurité : Si le rôle n'est pas explicitement reconnu
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" color="error" sx={{ fontWeight: 'bold', mb: 2 }}>
          ⚠️ Rôle utilisateur non reconnu ou en attente
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          L'inscription a réussi, mais la valeur du rôle lue dans votre session : 
          <Box component="span" sx={{ color: '#764ba2', fontWeight: 'bold', ml: 1 }}>
            "{user?.role || 'Aucune'}"
          </Box>
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
          Veuillez contacter l'administrateur système pour valider vos droits d'accès ou ajuster la configuration du backend.
        </Typography>
        {logout && (
          <Button 
            variant="contained" 
            onClick={logout}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Retourner à la connexion
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;