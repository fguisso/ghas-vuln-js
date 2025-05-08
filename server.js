const http = require("http");
const https = require("https");
const { exec } = require("child_process");
const _ = require("lodash"); // Dependabot trigger

// 🚨 Simulação de segredo
const GITHUB_PAT = "<meu_token>";

// Função para obter o clone_url do primeiro repositório
function getRepoUrl(user, cb) {
  const opts = {
    hostname: "api.github.com",
    path: `/users/${user}/repos`,
    headers: {
      "User-Agent": "vuln-demo",
      "Authorization": `token ${GITHUB_PAT}`
    }
  };
  https.get(opts, res => {
    let body = "";
    res.on("data", chunk => body += chunk);
    res.on("end", () => {
      try {
        const repos = JSON.parse(body);
        cb(null, repos[0].clone_url);
      } catch (e) {
        cb("Falha na API");
      }
    });
  }).on("error", cb);
}

// Webserver vulnerável
http.createServer((req, res) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const user = searchParams.get("user");

  if (!user) return res.end("Passe ?user=usuario");

  getRepoUrl(user, (err, url) => {
    if (err) return res.end("Erro na API");

    // 🚨 Vulnerabilidade RCE: entrada do usuário pode injetar shell
    const cmd = `git clone ${url}`;
    exec(cmd, (e, out) => {
      if (e) return res.end("Erro ao clonar");
      res.end("Repo clonado:\n" + out);
    });
  });
}).listen(3000, () => {
  console.log("Servidor em http://localhost:3000");
});
