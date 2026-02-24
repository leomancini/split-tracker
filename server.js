import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import passport from 'passport';
import { registerAuthRoutes, ensureAuth } from './auth.js';
import { registerGroupRoutes } from './routes/groups.js';
import { getUserGroups, getPendingInvitesForUser } from './db.js';
import { dashboardPage } from './views/dashboard.js';

const app = express();
const port = 3124;

// Trust reverse proxy (for secure cookies behind HTTPS)
app.set('trust proxy', 1);

// Body parsing
app.use(express.urlencoded({ extended: false }));

// Sessions (SQLite-backed)
const SQLiteStore = connectSqlite3(session);
app.use(session({
  store: new SQLiteStore({ db: 'sessions.db', dir: './data' }),
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: 'auto',
    sameSite: 'lax',
  },
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Auth routes
registerAuthRoutes(app);

// Group routes
registerGroupRoutes(app, ensureAuth);

// Dashboard
app.get('/', ensureAuth, (req, res) => {
  const groups = getUserGroups(req.user.id);
  const pendingInvites = getPendingInvitesForUser(req.user.email);
  res.send(dashboardPage(req.user, groups, pendingInvites, req.query));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
