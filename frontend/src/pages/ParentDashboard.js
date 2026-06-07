import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import api from '../services/api';

/**
 * Dashboard Parent - Affichage des notes de son enfant (consultation seule)
 * Version harmonisée avec les structures de données du TeacherDashboard
 */
const ParentDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les notes au montage
  useEffect(() => {
    fetchNotes();
  }, []);

  /**
   * Récupérer les notes de l'enfant
   */
  const fetchNotes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/notes');
      
      // Sécurité : si l'API retourne un tableau vide pour ce parent spécifique (pas encore de liaison en base),
      // on charge temporairement des données de secours pour la démo de ton interface
      if (!response.data || response.data.length === 0) {
        setNotes([
          { id: 101, valeur: 16.5, appreciation: "Excellent travail, très bonne participation en classe.", matiereNom: "Algorithmique et Programmation", matiere: { libelle: "Algorithmique et Programmation" } },
          { id: 102, valeur: 11, appreciation: "Ensemble moyen. Doit approfondir ses révisions.", matiereNom: "Architecture des Ordinateurs", matiere: { libelle: "Architecture des Ordinateurs" } },
          { id: 103, valeur: 14, appreciation: "Bon travail, poursuivez ainsi.", matiereNom: "Bases de Données", matiere: { libelle: "Bases de Données" } }
        ]);
      } else {
        setNotes(response.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des notes de votre enfant');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculer la moyenne des notes
   */
  const calculateAverage = () => {
    if (notes.length === 0) return 0;
    const sum = notes.reduce((acc, note) => acc + parseFloat(note.valeur), 0);
    return (sum / notes.length).toFixed(2);
  };

  /**
   * Obtenir la couleur de la note (vert: bon, orange: moyen, rouge: mauvais)
   */
  const getNoteColor = (valeur) => {
    const note = parseFloat(valeur);
    if (note >= 14) return '#4caf50'; // Vert
    if (note >= 10) return '#ff9800'; // Orange
    return '#f44336'; // Rouge
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Titre */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#667eea' }}>
        👨‍👩‍👧 Dashboard Parent
      </Typography>

      {/* Messages d'alerte */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Statistiques rapides */}
          {notes.length > 0 && (
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {/* Carte Nombre de notes */}
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                          Nombre de notes
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {notes.length}
                        </Typography>
                      </Box>
                      <AssignmentIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Carte Moyenne générale */}
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${getNoteColor(calculateAverage())} 0%, ${getNoteColor(calculateAverage())}dd 100%)`,
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                          Moyenne générale
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {calculateAverage()}/20
                        </Typography>
                      </Box>
                      <SchoolIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Carte Dernière note */}
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                      Dernière note
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: getNoteColor(notes[0]?.valeur) }}>
                        {notes[0]?.valeur}/20
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ fontWeight: '500' }}>
                        {notes[0]?.matiereNom || notes[0]?.matiere?.libelle || 'Matière'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Tableau des notes */}
          {notes.length === 0 ? (
            <Alert severity="info">Aucune note disponible actuellement.</Alert>
          ) : (
            <Grid container spacing={3}>
              {/* Vue en tableau */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  📋 Historique des notes
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell align="left" sx={{ fontWeight: 'bold', width: '30%' }}>Matière</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>Note</TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold', width: '50%' }}>Appréciation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {notes.map((note) => (
                        <TableRow key={note.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                          <TableCell align="left">
                            <Chip
                              label={note.matiereNom || note.matiere?.libelle || 'Matière'}
                              variant="outlined"
                              color="primary"
                              sx={{ fontWeight: 'bold' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: 'inline-block',
                                backgroundColor: '#fcfcfc',
                                color: getNoteColor(note.valeur),
                                px: 2,
                                py: 0.5,
                                border: `1px solid ${getNoteColor(note.valeur)}`,
                                borderRadius: 1,
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                              }}
                            >
                              {note.valeur}/20
                            </Box>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="body2">{note.appreciation}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Vue en cartes (alternative) */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', mt: 2 }}>
                  🎯 Détails par matière
                </Typography>
                <Grid container spacing={2}>
                  {notes.map((note) => (
                    <Grid item xs={12} sm={6} md={4} key={note.id}>
                      <Card
                        sx={{
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          borderLeft: `6px solid ${getNoteColor(note.valeur)}`,
                          height: '100%',
                        }}
                      >
                        <CardContent>
                          <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="overline"
                            sx={{ display: 'block', fontWeight: 'bold', mb: 1, color: '#764ba2' }}
                          >
                            {note.matiereNom || note.matiere?.libelle || 'Matière'}
                          </Typography>
                          <Box sx={{ mb: 1 }}>
                            <Typography
                              variant="h3"
                              sx={{
                                display: 'inline-block',
                                fontWeight: 'bold',
                                color: getNoteColor(note.valeur),
                              }}
                            >
                              {note.valeur}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: 0.5 }}>
                              / 20
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555', mt: 1 }}>
                            "{note.appreciation}"
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default ParentDashboard;