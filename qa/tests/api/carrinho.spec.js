
const { test, expect } = require('@playwright/test');

test('CT-API-04 - Adicionar produto ao carrinho', async ({ request }) => {

 
  const login = await request.post('/rest/user/login', {
    data: {
      email: 'teste.qa01@example.com',
      password: 'QaTeste@2026#123'
    }
  });

  expect(login.status()).toBe(200);

  const loginBody = await login.json();
  const token = loginBody.authentication.token;
  const basketId = loginBody.authentication.bid;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  
  const antes = await request.get(`/rest/basket/${basketId}`, {
    headers
  });

  expect(antes.status()).toBe(200);

  const carrinhoAntes = await antes.json();

  const produtosExistentes = new Set(
    carrinhoAntes.data.Products.map(p => p.id)
  );

 
  const produtoId = [42, 2, 10, 1, 3].find(
    id => !produtosExistentes.has(id)
  );

  expect(produtoId).toBeDefined();

  let itemId;

  try {
   
    const response = await request.post('/api/BasketItems/', {
      headers,
      data: {
        ProductId: produtoId,
        BasketId: String(basketId),
        quantity: 1
      }
    });

    const body = await response.json();

    itemId = body.data?.id;

    expect(response.status()).toBe(200);
    expect(body.status).toBe('success');
    expect(itemId).toBeTruthy();

    
    const consulta = await request.get(
      `/rest/basket/${basketId}`,
      { headers }
    );

    expect(consulta.status()).toBe(200);

    const carrinho = await consulta.json();

    expect(
      carrinho.data.Products.some(
        p => p.BasketItem.id === itemId
      )
    ).toBe(true);

  } finally {

    
    if (itemId != null) {
      const remocao = await request.delete(
        `/api/BasketItems/${itemId}`,
        { headers }
      );

      expect(remocao.status()).toBe(200);
    }
  }

  
  const final = await request.get(
    `/rest/basket/${basketId}`,
    { headers }
  );

  expect(final.status()).toBe(200);

  const carrinhoFinal = await final.json();

  expect(
    carrinhoFinal.data.Products.some(
      p => p.BasketItem.id === itemId
    )
  ).toBe(false);

});



test('CT-API-05 - Alterar quantidade do produto', async ({ request }) => {


  const login = await request.post('/rest/user/login', {
    data: {
      email: 'teste.qa01@example.com',
      password: 'QaTeste@2026#123'
    }
  });

  expect(login.status()).toBe(200);

  const loginBody = await login.json();
  const token = loginBody.authentication.token;
  const basketId = loginBody.authentication.bid;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  
  const antes = await request.get(`/rest/basket/${basketId}`, {
    headers
  });

  expect(antes.status()).toBe(200);

  const carrinhoAntes = await antes.json();

  const existentes = new Set(
    carrinhoAntes.data.Products.map(p => p.id)
  );

 
  const produtoId = [1, 2, 3, 4, 5].find(
    id => !existentes.has(id)
  );

  expect(produtoId).toBeDefined();

  let itemId;

  try {
    
    const adicionar = await request.post('/api/BasketItems/', {
      headers,
      data: {
        ProductId: produtoId,
        BasketId: String(basketId),
        quantity: 1
      }
    });

    expect(adicionar.status()).toBe(200);

    const adicionado = await adicionar.json();
    itemId = adicionado.data.id;

    
    const atualizar = await request.put(
      `/api/BasketItems/${itemId}`,
      {
        headers,
        data: {
          quantity: 2
        }
      }
    );

    expect(atualizar.status()).toBe(200);

    
    const consulta = await request.get(
      `/rest/basket/${basketId}`,
      { headers }
    );

    expect(consulta.status()).toBe(200);

    const carrinho = await consulta.json();

    const produto = carrinho.data.Products.find(
      p => p.BasketItem.id === itemId
    );

    expect(produto).toBeDefined();
    expect(produto.BasketItem.quantity).toBe(2);

  } finally {

   
    if (itemId != null) {
      const remover = await request.delete(
        `/api/BasketItems/${itemId}`,
        { headers }
      );

      expect(remover.status()).toBe(200);
    }
  }

});



test('CT-API-06 - Remover produto do carrinho', async ({ request }) => {

  
  const login = await request.post('/rest/user/login', {
    data: {
      email: 'teste.qa01@example.com',
      password: 'QaTeste@2026#123'
    }
  });

  expect(login.status()).toBe(200);

  const loginBody = await login.json();
  const token = loginBody.authentication.token;
  const basketId = loginBody.authentication.bid;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  
  const antes = await request.get(`/rest/basket/${basketId}`, {
    headers
  });

  expect(antes.status()).toBe(200);

  const carrinhoAntes = await antes.json();

  const existentes = new Set(
    carrinhoAntes.data.Products.map(p => p.id)
  );

  
  const produtoId = [1, 2, 3, 4, 5].find(
    id => !existentes.has(id)
  );

  expect(produtoId).toBeDefined();

  let itemId;

  try {
    
    const adicionar = await request.post('/api/BasketItems/', {
      headers,
      data: {
        ProductId: produtoId,
        BasketId: String(basketId),
        quantity: 1
      }
    });

    expect(adicionar.status()).toBe(200);

    const adicionado = await adicionar.json();
    itemId = adicionado.data.id;

    
    const consulta = await request.get(
      `/rest/basket/${basketId}`,
      { headers }
    );

    expect(consulta.status()).toBe(200);

    const carrinho = await consulta.json();

    expect(
      carrinho.data.Products.some(
        p => p.BasketItem.id === itemId
      )
    ).toBe(true);

    
    const remover = await request.delete(
      `/api/BasketItems/${itemId}`,
      { headers }
    );

    expect(remover.status()).toBe(200);

   
    const verificar = await request.get(
      `/rest/basket/${basketId}`,
      { headers }
    );

    expect(verificar.status()).toBe(200);

    const carrinhoFinal = await verificar.json();

    expect(
      carrinhoFinal.data.Products.some(
        p => p.BasketItem.id === itemId
      )
    ).toBe(false);

  } finally {

    
    if (itemId != null) {
      const consulta = await request.get(
        `/rest/basket/${basketId}`,
        { headers }
      );

      if (consulta.ok()) {
        const dados = await consulta.json();

        const aindaExiste = dados.data.Products.some(
          p => p.BasketItem.id === itemId
        );

        if (aindaExiste) {
          await request.delete(
            `/api/BasketItems/${itemId}`,
            { headers }
          );
        }
      }
    }
  }

});
