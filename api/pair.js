// api/pair.js
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import Pino from 'pino'
import express from 'express'

const app = express()
app.use(express.json())

app.get('/api/pair', async (req, res) => {
  const number = req.query.number
  if (!number) return res.status(400).json({ error: 'Número não informado!' })

  try {
    const { state } = await useMultiFileAuthState('./session')
    const sock = makeWASocket({
      printQRInTerminal: false,
      auth: state,
      logger: Pino({ level: 'silent' })
    })

    const code = await sock.requestPairingCode(number)
    if (!code) return res.status(500).json({ error: 'Falha ao gerar código' })

    return res.status(200).json({
      status: true,
      number,
      code
    })
  } catch (err) {
    console.error('Erro ao parear:', err)
    return res.status(500).json({
      error: 'Erro interno no servidor',
      details: err.message
    })
  }
})

app.listen(3000, () => console.log('✅ API Souza online na porta 3000'))
export default app
