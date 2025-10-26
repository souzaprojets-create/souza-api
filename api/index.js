// index.js
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from "@whiskeysockets/baileys"
import pino from "pino"
import fs from "fs-extra"

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true, // Mostra o QR se for o primeiro login
    auth: state,
    browser: ['SouzaBot', 'Chrome', '10.0']
  })

  // Evento de pareamento automático (gera código de 6 dígitos)
  if (!sock.authState.creds.registered) {
    const numero = "55SEUNUMEROAQUI" // Substitua pelo seu número
    const code = await sock.requestPairingCode(numero)
    console.log(`\n✅ Seu código de pareamento é: ${code}\n`)
  }

  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') console.log('🤖 Bot conectado com sucesso!')
    else if (connection === 'close') startBot()
  })
}

startBot()
