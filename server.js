const { exec } = require("child_process");
const http = require("http");

const AWS_SECRET = "AKIA1234567890FAKEKEYEXRMPLA";

// Servidor simples que executa comandos enviados via query (?cmd=ls)
http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const cmd = url.searchParams.get("cmd");

  // 🚨 Vulnerabilidade de execução de comandos (RCE)
  exec(cmd, (err, output) => {
    if (err) return res.end(`Erro: ${err.message}`);
    res.end(`Resultado:\n${output}`);
  });
}).listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
