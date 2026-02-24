export function loginPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Split Tracker</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: white;
      color: #111827;
      line-height: 1.5;
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
      background: #22c55e;
      color: white;
      border: none;
      border-radius: 999px;
      padding: 0.875rem 1.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      text-decoration: none !important;
      transition: background 150ms, transform 100ms;
      -webkit-touch-callout: none !important;
      -webkit-user-select: none;
      user-select: none;
      touch-action: manipulation;
    }
    .btn:hover { background: #16a34a; }
    .btn:active { transform: scale(0.97); }
  </style>
</head>
<body>
  <div style="text-align: center; padding: 3rem 1rem;">
    <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">Split Tracker</h1>
    <p style="color: #6b7280; margin-bottom: 2rem;">Track shared expenses with friends</p>
    <a href="/auth/google" class="btn">Sign in with Google</a>
  </div>
  <script>document.addEventListener('touchstart',function(){},false);</script>
</body>
</html>`;
}
