const axios = require('axios');

async function testUpdate() {
    try {
        // 1. Login
        const loginRes = await axios.post('http://localhost:3333/auth/login', {
            email: 'admin@loja.com',
            password: 'loja1234'
        });
        const token = loginRes.data.token;
        console.log('Login successful');

        // 2. Try update
        const productId = 'cf7d3125-673e-41a5-8a6a-0cdd3e0edcac';
        const payload = {
            name: 'Base Líquida Matte (Test)',
            description: 'Cobertura alta, acabamento natural e longa duração.',
            price: 89.9,
            comparePrice: null,
            imageUrl: 'https://i.pinimg.com/736x/12/1b/17/121b17b70746d8474e2a8c3d8e87484d.jpg',
            active: true,
            colors: [
                { hex: '#f3e5dc', name: 'Claro 1' },
                { hex: '#d4a89a', name: 'Médio 2' }
            ],
            badges: ['Lançamento', 'Frete Grátis']
        };

        const updateRes = await axios.put(`http://localhost:3333/products/${productId}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Update successful:', updateRes.data);
    } catch (error) {
        if (error.response) {
            console.error('Update failed with status:', error.response.status);
            console.error('Response data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testUpdate();
