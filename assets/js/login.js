const API_URL = "https://6805b557ca467c15be69b1ab.mockapi.io/users";

document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  try {
    const response = await fetch(API_URL);
    const usuarios = await response.json();

    const usuario = usuarios.find(user => user.email === email && user.senha === senha);

    if (usuario) {
      alert("Login realizado com sucesso!");
    } else {
      alert("E-mail ou senha inválidos!");
    }
  } catch (error) {
    console.error("Erro ao tentar logar:", error);
    alert("Erro na conexão com o servidor.");
  }
});
