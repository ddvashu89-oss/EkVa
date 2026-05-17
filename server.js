import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load local environment variables from .env if present
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support Base64 photos
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware to transform Express request/response into Vercel Serverless Function context
const wrapHandler = (handler) => {
  return async (req, res) => {
    try {
      // Mock Vercel response helper methods
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (body) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
        return res;
      };
      
      // Execute the Vercel handler
      await handler(req, res);
    } catch (err) {
      console.error("Local Server Handler Error:", err);
      res.statusCode = 500;
      res.end(JSON.stringify({ status: 'error', message: err.message }));
    }
  };
};

// Import Vercel serverless handlers
import ordersHandler from './api/orders.js';
import diagnosesHandler from './api/diagnoses.js';
import messagesHandler from './api/messages.js';
import remindersHandler from './api/reminders.js';
import setupHandler from './api/setup.js';

// Route mappings supporting BOTH extensionless and legacy PHP routes for 100% compatibility
app.all('/api/orders', wrapHandler(ordersHandler));
app.all('/api/orders.php', wrapHandler(ordersHandler));

app.all('/api/diagnoses', wrapHandler(diagnosesHandler));
app.all('/api/diagnoses.php', wrapHandler(diagnosesHandler));

app.all('/api/messages', wrapHandler(messagesHandler));
app.all('/api/messages.php', wrapHandler(messagesHandler));

app.all('/api/reminders', wrapHandler(remindersHandler));
app.all('/api/reminders.php', wrapHandler(remindersHandler));

app.all('/api/setup', wrapHandler(setupHandler));
app.all('/api/setup.php', wrapHandler(setupHandler));

// Root confirmation route
app.get('/', (req, res) => {
  res.send('🌿 Ekva Node.js API server running locally on port 8000!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('\n======================================================');
  console.log(`🚀 Node.js Backend Server running on http://localhost:${PORT}`);
  console.log('======================================================\n');
});
