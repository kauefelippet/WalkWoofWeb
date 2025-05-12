const API_URL = "https://6805174fca467c15be683889.mockapi.io/api/user";

document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();

  // 1) Captura valores dos inputs
  const emailInput = document.getElementById("email").value.trim();
  const senhaInput = document.getElementById("senha").value;

  try {
    // 2) Busca todos os usuários
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    const usuarios = await response.json();

    // 3) Encontra usuário pelo email e pela senha correta (campo "password")
    const usuario = usuarios.find(u =>
      u.email === emailInput &&
      u.password === senhaInput
    );

    if (usuario) {
      // 4) Sucesso: armazena dados no sessionStorage
      sessionStorage.setItem("user", JSON.stringify(usuario));
      alert("Login realizado com sucesso!");
        
    window.location.href = "home-user.html";


    } else {
      // Usuário não encontrado ou senha inválida
      alert("E-mail ou senha inválidos!");
    }

  } catch (error) {
    console.error("Erro ao tentar logar:", error);
    alert("Erro na conexão com o servidor.");
  }
});
