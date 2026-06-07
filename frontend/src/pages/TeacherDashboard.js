import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';

/**
 * Dashboard Enseignant - Gestion complète des notes (CRUD)
 * Version améliorée : Sélection par listes déroulantes des Élèves et des Matières
 */
const TeacherDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [eleves, setEleves] = useState([]);      // Liste des élèves pour le Select
  const [matieres, setMatieres] = useState([]);  // Liste des matières pour le Select
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    valeur: '',
    appreciation: '',
    eleveId: '',
    matiereId: '',
  });

  // Charger les données au montage du composant
  useEffect(() => {
    fetchNotes();
    fetchElevesEtMatieres();
  }, []);

  /**
   * Récupérer toutes les notes
   */
  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupérer les listes d'élèves et de matières pour alimenter le formulaire
   */
  const fetchElevesEtMatieres = async () => {
    try {
      // Ajuste les endpoints si tes routes API portent des noms différents
      const [resEleves, resMatieres] = await Promise.all([
        api.get('/eleves').catch(() => ({ data: [] })), 
        api.get('/matieres').catch(() => ({ data: [] }))
      ]);
      
      // Fallback robuste avec données statiques de secours si l'API est vide ou non implémentée
      setEleves(resEleves.data.length ? resEleves.data : [
        { id: 1, nom: 'KOMBETTO Junior' },
        { id: 2, nom: 'KOMBETTO Landry' },
        { id: 3, nom: 'Amina Ousmane' }
      ]);

      setMatieres(resMatieres.data.length ? resMatieres.data : [
        { id: 1, nom: 'Algorithmique et Programmation' },
        { id: 2, nom: 'Architecture des Ordinateurs' },
        { id: 3, nom: 'Bases de Données' }
      ]);
    } catch (err) {
      console.error("Erreur lors de la récupération des listes de sélection", err);
    }
  };

  /**
   * Ouvrir la dialog pour ajouter/modifier une note
   */
  const handleOpenDialog = (note = null) => {
    if (note) {
      setEditingNoteId(note.id);
      setFormData({
        valeur: note.valeur,
        appreciation: note.appreciation,
        eleveId: note.eleveId || '',
        matiereId: note.matiereId || '',
      });
    } else {
      setEditingNoteId(null);
      setFormData({
        valeur: '',
        appreciation: '',
        eleveId: '',
        matiereId: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNoteId(null);
    setFormData({
      valeur: '',
      appreciation: '',
      eleveId: '',
      matiereId: '',
    });
  };

  /**
   * Gérer les changements du formulaire
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Soumettre le formulaire (créer ou modifier)
   */
  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!formData.valeur || !formData.appreciation || !formData.eleveId || !formData.matiereId) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    try {
      if (editingNoteId) {
        await api.put(`/notes/${editingNoteId}`, formData);
        setSuccess('Note modifiée avec succès');
      } else {
        await api.post('/notes', formData);
        setSuccess('Note ajoutée avec succès');
      }
      fetchNotes();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'opération');
      console.error(err);
    }
  };

  /**
   * Supprimer une note
   */
  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await api.delete(`/notes/${noteId}`);
        setSuccess('Note supprimée avec succès');
        fetchNotes();
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Titre */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#667eea' }}>
        📊 Dashboard Enseignant
      </Typography>

      {/* Messages d'alerte */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Bouton pour ajouter une note */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 1,
            px: 3,
            fontWeight: 'bold',
          }}
        >
          Ajouter une note
        </Button>
      </Box>

      {/* Tableau des notes */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Élève</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Matière</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Note</TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Appréciation</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">Aucune note disponible</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                notes.map((note) => (
                  <TableRow key={note.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell align="center">{note.eleveNom || 'Élève'}</TableCell>
                    <TableCell align="center">{note.matiereNom || 'Matière'}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'inline-block',
                          backgroundColor: '#e8f5e9',
                          color: '#2e7d32',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                        }}
                      >
                        {note.valeur}/20
                      </Box>
                    </TableCell>
                    <TableCell align="left">{note.appreciation}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(note)}
                        title="Modifier"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteNote(note.id)}
                        title="Supprimer"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog pour ajouter/modifier une note */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
          {editingNoteId ? '✏️ Modifier la note' : '➕ Ajouter une note'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          
          {/* Sélection de l'Élève */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="select-eleve-label">Nom de l'élève</InputLabel>
            <Select
              labelId="select-eleve-label"
              name="eleveId"
              value={formData.eleveId}
              onChange={handleFormChange}
              label="Nom de l'élève"
            >
              {eleves.map((eleve) => (
                <MenuItem key={eleve.id} value={eleve.id}>
                  {eleve.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sélection de la Matière */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="select-matiere-label">Nom de la matière</InputLabel>
            <Select
              labelId="select-matiere-label"
              name="matiereId"
              value={formData.matiereId}
              onChange={handleFormChange}
              label="Nom de la matière"
            >
              {matieres.map((matiere) => (
                <MenuItem key={matiere.id} value={matiere.id}>
                  {matiere.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Saisie de la Note */}
          <TextField
            fullWidth
            label="Note (sur 20)"
            name="valeur"
            type="number"
            inputProps={{ min: 0, max: 20, step: 0.5 }}
            value={formData.valeur}
            onChange={handleFormChange}
            margin="normal"
            required
          />

          {/* Saisie de l'Appréciation */}
          <TextField
            fullWidth
            label="Appréciation"
            name="appreciation"
            value={formData.appreciation}
            onChange={handleFormChange}
            margin="normal"
            multiline
            rows={3}
            placeholder="Ex: Très bon travail, à continuer !"
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            {editingNoteId ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherDashboard;