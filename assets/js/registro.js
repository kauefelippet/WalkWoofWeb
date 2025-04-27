document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registroForm");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;
      const confirmarSenha = document.getElementById("confirmarSenha").value;

      if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
      }

      const formData = {
        createdAt: Math.floor(Date.now() / 1000),
        name: String(nome),
        telefone: "",
        email: String(email),
        cpf: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        municipio: "",
        uf: "",
        password: String(senha),
        walker: false
      };

      try {
        const response = await fetch("https://6805174fca467c15be683889.mockapi.io/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error("Erro na resposta da API");
        }

        alert("Usuário registrado com sucesso!");
        form.reset();
      } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        alert("Ocorreu um erro ao registrar. Tente novamente.");
      }
    });
  }
});
