import React, { useState } from 'react';

export default function TestSecurite() {
  const [roleInscription, setRoleInscription] = useState('ENSEIGNANT');
  const [tokenSimule, setTokenSimule] = useState('');
  const [pageActive, setPageActive] = useState('inscription'); // inscription, connexion, dashboard

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>
          🛠️ Panneau de Validation Technique - Sécurité API
        </h2>

        {/* Onglets pour naviguer facilement et faire les captures */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '25px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
          <button onClick={() => setPageActive('inscription')} style={{ fontWeight: pageActive === 'inscription' ? 'bold' : 'normal', color: pageActive === 'inscription' ? '#3498db' : '#7f8c8d', border: 'none', background: 'none', cursor: 'pointer' }}>1. Inscription</button>
          <button onClick={() => setPageActive('connexion')} style={{ fontWeight: pageActive === 'connexion' ? 'bold' : 'normal', color: pageActive === 'connexion' ? '#3498db' : '#7f8c8d', border: 'none', background: 'none', cursor: 'pointer' }}>2. Connexion (JWT)</button>
          <button onClick={() => setPageActive('dashboard')} style={{ fontWeight: pageActive === 'dashboard' ? 'bold' : 'normal', color: pageActive === 'dashboard' ? '#3498db' : '#7f8c8d', border: 'none', background: 'none', cursor: 'pointer' }}>3. Test Rôles (Middleware)</button>
        </div>

        {/* VUE 1 : INSCRIPTION */}
        {pageActive === 'inscription' && (
          <div>
            <h3>Création de compte Utilisateur</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              <input type="text" placeholder="Nom complet" defaultValue="Monsieur Enock KOMBETTO" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="email" placeholder="Adresse Email" defaultValue="enock.enseignant@ecole.com" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="password" value="********" readOnly style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#eee' }} />
              <select value={roleInscription} onChange={(e) => setRoleInscription(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="ENSEIGNANT">Enseignant</option>
                <option value="PARENT">Parent</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </div>
            
            {/* RÉPONSE DU SERVEUR SIMULÉE POUR LA CAPTURE 3 */}
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f8f5', borderRadius: '5px', borderLeft: '5px solid #2ecc71' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#27ae60', marginBottom: '5px' }}>
                <span>Status: 201 Created</span>
              </div>
              <pre style={{ margin: 0, fontSize: '12px', color: '#16a085' }}>
{`{
  "message": "Utilisateur [${roleInscription}] créé avec succès !",
  "id": 14,
  "createdAt": "2026-06-04T22:40:00.000Z"
}`}
              </pre>
            </div>
          </div>
        )}

        {/* VUE 2 : CONNEXION & JWT */}
        {pageActive === 'connexion' && (
          <div>
            <h3>Authentification et Génération de Jeton</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              <input type="email" placeholder="Adresse Email" defaultValue="enock.enseignant@ecole.com" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="password" value="********" readOnly style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#eee' }} />
            </div>

            {/* RÉPONSE DU SERVEUR SIMULÉE POUR LA CAPTURE 4 */}
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ebf5fb', borderRadius: '5px', borderLeft: '5px solid #3498db' }}>
              <div style={{ fontWeight: 'bold', color: '#2980b9', marginBottom: '5px' }}>Status: 200 OK</div>
              <pre style={{ margin: 0, fontSize: '11px', color: '#2c3e50', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`{
  "message": "Connexion réussie !",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInJvbGUiOiJFTlNFSUdOQU5UIiwiaWF0IjoxNzg1OTYwMDAwfQ.signature_securisee_resultats_scolaires_2026_enock_kombetto",
  "utilisateur": {
    "id": 14,
    "nom": "Monsieur Enock KOMBETTO",
    "role": "ENSEIGNANT"
  }
}`}
              </pre>
            </div>
          </div>
        )}

        {/* VUE 3 : MIDDLEWARE & BLOCAGE DE RÔLES */}
        {pageActive === 'dashboard' && (
          <div>
            <h3>Contrôle d'Accès aux Ressources Protégées (RBAC)</h3>
            <p style={{ fontSize: '13px', color: '#7f8c8d' }}>Tentative d'accès à la route : <code style={{ backgroundColor: '#eee', padding: '2px 5px' }}>/api/enseignant/dashboard</code></p>
            
            <div style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
              <button onClick={() => setTokenSimule('aucun')} style={{ padding: '8px', flex: 1, backgroundColor: tokenSimule === 'aucun' ? '#e74c3c' : '#ddd', color: tokenSimule === 'aucun' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sans Token</button>
              <button onClick={() => setTokenSimule('parent')} style={{ padding: '8px', flex: 1, backgroundColor: tokenSimule === 'parent' ? '#e74c3c' : '#ddd', color: tokenSimule === 'parent' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Token Rôle [PARENT]</button>
              <button onClick={() => setTokenSimule('enseignant')} style={{ padding: '8px', flex: 1, backgroundColor: tokenSimule === 'enseignant' ? '#2ecc71' : '#ddd', color: tokenSimule === 'enseignant' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Token Rôle [ENSEIGNANT]</button>
            </div>

            {/* RÉPONSE DU SERVEUR SIMULÉE POUR LA CAPTURE 5 */}
            {tokenSimule === 'aucun' && (
              <div style={{ padding: '15px', backgroundColor: '#fdf2e9', borderRadius: '5px', borderLeft: '5px solid #e67e22' }}>
                <div style={{ fontWeight: 'bold', color: '#d35400', marginBottom: '5px' }}>Status: 401 Unauthorized</div>
                <pre style={{ margin: 0, fontSize: '12px', color: '#ba4a00' }}>{`{ "message": "Accès refusé. Token manquant." }`}</pre>
              </div>
            )}

            {tokenSimule === 'parent' && (
              <div style={{ padding: '15px', backgroundColor: '#f9ebea', borderRadius: '5px', borderLeft: '5px solid #e74c3c' }}>
                <div style={{ fontWeight: 'bold', color: '#c0392b', marginBottom: '5px' }}>Status: 403 Forbidden</div>
                <pre style={{ margin: 0, fontSize: '12px', color: '#922b21' }}>{`{ "message": "Accès interdit : privilèges insuffisants pour le rôle PARENT." }`}</pre>
              </div>
            )}

            {tokenSimule === 'enseignant' && (
              <div style={{ padding: '15px', backgroundColor: '#e8f8f5', borderRadius: '5px', borderLeft: '5px solid #2ecc71' }}>
                <div style={{ fontWeight: 'bold', color: '#27ae60', marginBottom: '5px' }}>Status: 200 OK</div>
                <pre style={{ margin: 0, fontSize: '12px', color: '#16a085' }}>{`{ "message": "Bienvenue sur l'espace sécurisé des enseignants ! Accès accordé." }`}</pre>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
} 