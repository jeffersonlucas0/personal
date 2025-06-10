document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const tipoUsuario = document.getElementById('tipoUsuario').value;
  const erroMsg = document.getElementById('erro-msg');

  // Simulação de base de usuários
  const usuarios = {
    "jairoguilherme21@gmail.com": { senha: "jairo@14", tipo: "personal" },
    "juliagurgel@gmail.com": { senha: "123456", tipo: "aluno" },
    "talya@gmail.com": { senha: "talya123", tipo: "aluno" },
  };

  // Verifica se o usuário existe e a senha confere
  if (usuarios[email] && usuarios[email].senha === senha && usuarios[email].tipo === tipoUsuario) {
    // Salva dados no localStorage (caso queira usar depois)
    localStorage.setItem('usuarioLogado', JSON.stringify({
      email: email,
      tipo: tipoUsuario
    }));

    // Redireciona de forma confiável
    if (tipoUsuario === "personal") {
      window.location.replace("dashboard.html");
    } else {
      window.location.replace("painel-aluno.html");
    }
  } else {
    erroMsg.textContent = "Email, senha ou tipo de usuário inválido.";
  }
});
