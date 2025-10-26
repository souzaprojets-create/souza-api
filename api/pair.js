import express from "express";
import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import Pino from "pino";

const app = express();
app.use(express.json());

app.get("/api/pair", async (req, res) => {
  const number = req.query.number;
  if (!number) return res.status(400).json({ error: "Número não informado!" });

  try {
    const { state } = await useMultiFileAuthState("./auth");
    const sock = makeWASocket({
      printQRInTerminal: false,
      auth: state,
      logger: Pino({ level: "silent" }),
    });

    const code = await sock.requestPairingCode(number);
    if (!code) return res.status(500).json({ error: "Falha ao gerar código" });

    res.json({ status: true, code });
  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: "Erro interno no servidor", details: err.message });
  }
});

app.listen(3000, () => console.log("✅ API de pareamento Souza-BOT ativa!"));

export default app;
      
