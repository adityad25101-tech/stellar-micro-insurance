import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve static files from root
app.use(express.static(path.join(__dirname)));

// Handle root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log('📝 To use the app:');
  console.log('   1. Install Freighter wallet from https://www.freighter.app/');
  console.log('   2. Set network to Testnet');
  console.log('   3. Open http://localhost:3000 in your browser');
});
