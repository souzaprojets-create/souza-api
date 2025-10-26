// api/index.js

export default async function handler(req, res) {
  try {
    return res.status(200).json({
      status: '🟢 API Souza Online!',
      message: 'Bem-vindo à Souza API!',
      endpoints: {
        pair: '/api/pair',
      },
    });
  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({
      error: 'Erro interno no servidor',
      details: err.message,
    });
  }
}
