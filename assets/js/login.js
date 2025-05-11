const API_URL = "https://6805174fca467c15be683889.mockapi.io/api/user";

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
