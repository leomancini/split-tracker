import { layout } from './layout.js';

export function loginPage() {
  const content = `
    <div style="text-align: center; padding: 3rem 1rem;">
      <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">Split Tracker</h1>
      <p style="color: var(--gray-500); margin-bottom: 2rem;">Track shared expenses with friends</p>
      <a href="/auth/google" class="btn">Sign in with Google</a>
    </div>
  `;
  return layout('Login', content, null);
}
