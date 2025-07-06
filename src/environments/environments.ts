export const environment = {
    production: false,
    googleOAuth: {
      clientId: '273991940762-529603f588so95s2l0ka64ss6eofldoi.apps.googleusercontent.com',  // Tu Client ID de Google
      redirectUri: 'http://localhost:4200/callback',  // Ajusta según tu ruta de callback en Angular
      scope: 'openid profile email',
      responseType: 'token id_token',
      issuer: 'https://accounts.google.com',
    },
    apiUrl: 'http://localhost:5000/api',  // La URL de tu API backend
  };
  