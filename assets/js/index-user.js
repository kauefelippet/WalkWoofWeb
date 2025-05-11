document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("activityForm");

    // Função para formatar a data de criação
    function getCurrentTimestamp() {
        return Math.floor(Date.now() / 1000); // retorna o timestamp em segundos
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        // Capturando os dados do formulário
        const formData = {
            createdAt: getCurrentTimestamp(),
            title: document.getElementById("title").value,
            pet_name: document.getElementById("pet_name").value,
            pet_race: document.getElementById("pet_race").value,
            pet_age: document.getElementById("pet_age").value,
            meeting_point: document.getElementById("meeting_point").value,
            cep: document.getElementById("cep").value,
            number: document.getElementById("numero").value,
            logradouro: document.getElementById("logradouro").value,
            complemento: document.getElementById("complemento").value,
            bairro: document.getElementById("bairro").value,
            municipio: document.getElementById("municipio").value,
            uf: document.getElementById("uf").value,
            description: document.getElementById("description").value,
        };

        // Exibindo o formulário (opcional para depuração)
        console.log("Form Data: ", formData);

        // Enviando os dados via POST para a API
        fetch("https://6805174fca467c15be683889.mockapi.io/api/activity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Resposta da API:", data);
                alert("Solicitação de atividade criada com sucesso!");
                form.reset(); // Reseta o formulário após envio
            })
            .catch((error) => {
                console.error("Erro ao enviar solicitação:", error);
                alert("Ocorreu um erro ao enviar a solicitação. Tente novamente.");
            });
    });
});