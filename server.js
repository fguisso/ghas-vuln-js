const { exec } = require("child_process");
const _ = require("lodash");

const AWS_SECRET_ACCESS_KEY = "AKIA1234567890FAKEKEYEXAMPLE";

const userInput = process.argv[2] || "ls";

exec(userInput, (err, stdout, stderr) => {
  if (err) {
    console.error(`Erro: ${err}`);
    return;
  }
  console.log(`Resultado:\n${stdout}`);
});

const arr = [1, 2, 3, 4, 5];
console.log(_.chunk(arr, 2));
