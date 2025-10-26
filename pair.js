
// api/pair.js
export default async function handler(req, res) {
  const number = req.query.number
  if (!number) return res.status(400).json({ error: 'Número não informado' })

  // Simula a geração de código de pareamento
  const code = Math.floor(100000 + Math.random() * 900000)
  res.status(200).json({
    status: true,
    code: `${code}`,
    number
  })
}
