import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import passport from 'passport';
import { registerAuthRoutes, ensureAuth } from './auth.js';
import { registerApiRoutes, getAllData } from './routes/api.js';
import { shell } from './views/shell.js';

const app = express();
const port = 3124;

app.set('trust proxy', 1);

// Body parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Sessions (SQLite-backed)
const SQLiteStore = connectSqlite3(session);
app.use(session({
  store: new SQLiteStore({ db: 'sessions.db', dir: './data' }),
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: 'auto',
    sameSite: 'lax',
  },
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Auth routes (login, google oauth, logout)
registerAuthRoutes(app);

// JSON API routes
registerApiRoutes(app, ensureAuth);

// Static files (icons, manifest, service worker)
app.use(express.static('public', {
  setHeaders(res, filePath) {
    if (filePath.endsWith('sw.js')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// All other GET routes: serve the SPA shell with embedded data
app.get('*', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  const data = getAllData(req.user);
  res.send(shell(data));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
