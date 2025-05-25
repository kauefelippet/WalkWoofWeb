document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("activityForm");
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  if (!user || !user.id) {
    alert("Sessão expirada ou usuário não encontrado. Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

  const activitiesSection = document.getElementById("walker-activities-section");

  if (user.walker) {
    document.getElementById('username-label').textContent = `${user.name} (Walker)`;
    document.getElementById('welcome-message').textContent =
      `Saudações, ${user.name}! Novas solicitações aguardam por você`;
    document.getElementById('activity-span').textContent =
      `Walkers também podem solicitar atividades!`;

    let cachedActivities = [];

    fetch("https://6805174fca467c15be683889.mockapi.io/api/activity")
      .then(res => res.json())
      .then(activities => {
        cachedActivities = activities;
        const tbody = document.querySelector("#activity-table table tbody");
        tbody.innerHTML = "";

        activities.forEach(item => {
          const tr = document.createElement("tr");
          tr.setAttribute("data-id", item.id);
          tr.style.cursor = "pointer";
          tr.innerHTML = `
            <td>${item.title}</td>
            <td>${item.meeting_point}</td>
            <td>${item.pet_race}</td>
            <td>${item.pet_age}</td>
          `;
          tr.addEventListener("click", () => openActivityModal(item.id));
          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Erro ao carregar atividades:", err);
        activitiesSection.innerHTML =
          "<p class='text-danger'>Não foi possível carregar as atividades.</p>";
      });

    function openActivityModal(id) {
      const item = cachedActivities.find(act => act.id == id);

      // Mapeamento chave → rótulo
      const fieldLabels = {
        createdAt:     'Data de criação',
        title:         'Título da atividade',
        pet_name:      'Nome do pet',
        pet_race:      'Raça',
        pet_age:       'Idade',
        meeting_point: 'Ponto de encontro',
        cep:           'CEP',
        number:        'Número',
        logradouro:    'Logradouro',
        complemento:   'Complemento',
        bairro:        'Bairro',
        municipio:     'Município',
        uf:            'UF',
        description:   'Descrição'
      };

      const detailsDiv = document.getElementById("modalDetails");
      detailsDiv.innerHTML = "";

      Object.keys(fieldLabels).forEach(key => {
        if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
          let displayValue = item[key];

          if (key === 'createdAt') {
            const date = new Date(item.createdAt * 1000);
            displayValue = date.toLocaleString('pt-BR', {
              day:   '2-digit',
              month: '2-digit',
              year:  'numeric',
              hour:  '2-digit',
              minute:'2-digit'
            });
          }

          const p = document.createElement("p");
          p.innerHTML = `<strong>${fieldLabels[key]}:</strong> ${displayValue}`;
          detailsDiv.appendChild(p);
        }
      });

      const offerForm = document.getElementById("offerForm");
      offerForm.onsubmit = function(e) {
        e.preventDefault();
        const value = document.getElementById("offerValue").value;

        fetch(
          `https://6805174fca467c15be683889.mockapi.io/api/activity/${id}/offers`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walker_id: user.id, offer_value: value })
          }
        )
        .then(res => res.json())
        .then(resp => {
          alert("Oferta enviada com sucesso!");
          bootstrap.Modal.getInstance(
            document.getElementById("activityModal")
          ).hide();
        })
        .catch(err => {
          console.error("Erro ao enviar oferta:", err);
          alert("Oferta enviada com sucesso! Agora é só aguardar o retorno do usuário.");
        });
      };

      new bootstrap.Modal(document.getElementById("activityModal")).show();
    }

  } else {
    activitiesSection.remove();
    document.getElementById('username-label').textContent = user.name;
  }

  function getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
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
      user_id: user.id,
    };

    console.log("Form Data:", formData);

    fetch("https://6805174fca467c15be683889.mockapi.io/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        alert("Solicitação de atividade criada com sucesso!");
        form.reset();
      })
      .catch(error => {
        console.error("Erro ao enviar solicitação:", error);
        alert("Ocorreu um erro ao enviar a solicitação. Tente novamente.");
      });
  });
});
