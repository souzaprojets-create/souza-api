import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import Pino from 'pino'
import express from 'express'

const app = express()
app.use(express.json())

app.get('/api/pair', async (req, res) => {
  const number = req.query.number
  if (!number) return res.status(400).json({ error: 'Número não informado. Use /api/pair?number=55DDDNÚMERO' })

  try {
    const { state } = await useMultiFileAuthState('./session')
    const sock = makeWASocket({
      printQRInTerminal: false,
      auth: state,
      logger: Pino({ level: 'silent' })
    })

    const code = await sock.requestPairingCode(number)
    if (!code) return res.status(500).json({ error: 'Erro ao gerar o código de pareamento.' })

    res.json({ code })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3000, () => console.log('✅ API Souza pareamento ativa'))
