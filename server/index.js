require('dotenv').config();

const dns = require('dns');
// Utiliser les DNS publics pour résoudre le SRV d'Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

console.log('MONGO_URI utilisée :', process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API en ligne' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Serveur démarré sur le port ' + PORT);
});