
const { test, expect } = require('@playwright/test');

test('CT-API-01 - Login válido', async ({ request }) => {
  const response = await request.post('/rest/user/login', {
    data: {
      email: 'teste.qa01@example.com',
      password: 'QaTeste@2026#123'
    }
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.authentication.token).toBeTruthy();
});



test('CT-API-02 - Login inválido', async ({ request }) => {
  const response = await request.post('/rest/user/login', {
    data: {
      email: 'usuario.inexistente@example.com',
      password: 'senha_errada_123'
    }
  });

  expect(response.status()).toBe(401);
});
