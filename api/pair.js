// api/pair.js
import makeWASocket from '@whiskeysockets/baileys'
import Pino from 'pino'
import express from 'express'

const app = express()
app.use(express.json())

app.get('/api/pair', async (req, res) => {
  const number = req.query.number
  if (!number) return res.status(400).json({ error: 'Número não informado' })

  try {
    const sock = makeWASocket({
      printQRInTerminal: false,
      auth: { creds: {}, keys: {} }, // tudo em memória
      logger: Pino({ level: 'silent' }),
      browser: ['Souza-BOT', 'Chrome', '10.0']
    })

    const code = await sock.requestPairingCode(number)
    if (!code) return res.status(500).json({ error: 'Falha ao gerar código' })

    res.json({ status: true, code })
  } catch (err) {
    res.status(500).json({
      error: 'Erro interno no servidor',
      details: err.message
    })
  }
})

app.listen(3000, () => console.log('✅ Souza-API rodando sem salvar arquivos'))
