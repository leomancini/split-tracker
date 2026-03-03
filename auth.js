import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findOrCreateUser, getUserById, acceptPendingInvitesForEmail } from './db.js';
import { loginPage } from './views/login.js';

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
  }, (accessToken, refreshToken, profile, done) => {
    const user = findOrCreateUser({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value || null,
    });
    done(null, user);
  }));
} else {
  console.warn('WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Google OAuth will not work.');
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = getUserById(id);
  done(null, user || false);
});

export function registerAuthRoutes(app) {
  app.get('/login', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');
    res.send(loginPage());
  });

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
  }), (req, res) => {
    // Auto-accept any pending group invites for this user's email
    acceptPendingInvitesForEmail(req.user.email, req.user.id);
    res.redirect('/');
  });

  app.get('/logout', (req, res) => {
    req.logout(() => {
      res.redirect('/login');
    });
  });
}

export function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Not authenticated' });
  res.redirect('/login');
}
