const axios = require('axios');

async function testAuth() {
  try {
    console.log('🔐 Testando login...');
    
    // 1. Fazer login
    const loginResponse = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'gabriel.ghvn@gmail.com',
      password: 'poutherq5258'
    });
    
    console.log('✅ Login realizado com sucesso!');
    const token = loginResponse.data.access_token;
    console.log('🎫 Token obtido:', token.substring(0, 50) + '...');
    
    // 2. Testar GET /prompts
    console.log('\n📝 Testando GET /prompts...');
    
    const promptsResponse = await axios.get('http://localhost:4000/api/prompts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ GET /prompts funcionou!');
    console.log('📋 Prompts encontrados:', promptsResponse.data.length);
    console.log('📋 Dados:', JSON.stringify(promptsResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('🚫 Erro de autenticação - Token inválido ou expirado');
    }
  }
}

testAuth();