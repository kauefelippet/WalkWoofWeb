// Aplica máscara ao CPF e CEP conforme o usuário digita
function aplicarMascara(input, tipo) {
  let valor = input.value.replace(/\D/g, '');

  if (tipo === 'cpf') {
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  if (tipo === 'cep') {
    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
  }

  input.value = valor;
}

// Validação de CPF (mesmo algoritmo anterior)
function validaCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

// Mostra erro
function showErrorMessage(message) {
  const errorEl = document.getElementById('error-message');
  errorEl.innerText = message;
  errorEl.style.visibility = 'visible';
}

// Oculta erro
function hideErrorMessage() {
  const errorEl = document.getElementById('error-message');
  errorEl.style.visibility = 'hidden';
}

// Preenche o endereço com base no CEP
document.getElementById('cep').addEventListener('blur', async function () {
  const cep = this.value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) throw new Error("CEP não encontrado");

    document.getElementById('logradouro').value = data.logradouro || '';
    document.getElementById('bairro').value = data.bairro || '';
    document.getElementById('municipio').value = data.localidade || '';
    document.getElementById('uf').value = data.uf || '';
  } catch (error) {
    showErrorMessage("Erro ao buscar CEP.");
  }
});

// Aplica máscaras ao digitar
document.getElementById('cpf').addEventListener('input', function () {
  aplicarMascara(this, 'cpf');
});

document.getElementById('cep').addEventListener('input', function () {
  aplicarMascara(this, 'cep');
});

// Validação de CPF ao sair do campo
document.getElementById('cpf').addEventListener('blur', function () {
  const cpf = this.value;
  if (!validaCPF(cpf)) {
    showErrorMessage("CPF inválido. Verifique o número digitado.");
    this.focus();
  }
});

// Formatação e validação do telefone
document.getElementById('telefone').addEventListener('blur', function () {
  const telefoneInput = this;
  let numero = telefoneInput.value.replace(/\D/g, '');

  if (numero.length === 10) {
    telefoneInput.value = numero.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (numero.length === 11) {
    telefoneInput.value = numero.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else {
    showErrorMessage("Número de telefone deve conter 10 ou 11 dígitos.");
    telefoneInput.focus();
  }
});

// Submissão do formulário
document.getElementById('sign-in').addEventListener('submit', async function (e) {
  e.preventDefault();
  hideErrorMessage();

  // Coleta de dados
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const numero = document.getElementById('numero').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const password = document.getElementById('password').value;
  const passwordConfirmation = document.getElementById('password-confirmation').value;
  const telefoneBruto = document.getElementById('telefone').value.replace(/\D/g, '');

    // Validacoes
  if (telefoneBruto.length !== 10 && telefoneBruto.length !== 11) {
    showErrorMessage("Número de telefone inválido.");
    return;
  }

  if (name.length < 3) {
    showErrorMessage("Nome deve ter ao menos 3 caracteres.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showErrorMessage("E-mail inválido.");
    return;
  }

  if (!/^\d+$/.test(numero) || parseInt(numero) <= 0) {
    showErrorMessage("O campo Número deve conter apenas números positivos.");
    return;
  }

  if (!validaCPF(cpf)) {
    showErrorMessage("CPF inválido.");
    return;
  }

  if (password !== passwordConfirmation) {
    showErrorMessage("As senhas não coincidem.");
    return;
  }

  // Dados a serem enviados (tudo como string)
  const formData = {
    createdAt: Math.floor(Date.now() / 1000), // timestamp em segundos
    name: String(name),
    telefone: String(telefoneBruto),
    email: String(email),
    cpf: String(cpf),
    cep: String(document.getElementById('cep').value),
    logradouro: String(document.getElementById('logradouro').value),
    numero: String(numero),
    complemento: String(document.getElementById('complemento').value),
    bairro: String(document.getElementById('bairro').value),
    municipio: String(document.getElementById('municipio').value),
    uf: String(document.getElementById('uf').value),
    password: String(password),
    walker: true
  };

  try {
    const response = await fetch('https://6805174fca467c15be683889.mockapi.io/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error('Erro ao enviar formulário.');

    alert("Cadastro realizado com sucesso!");
    document.getElementById('sign-in').reset();
  } catch (error) {
    showErrorMessage("Erro ao enviar os dados. Tente novamente.");
    console.error(error);
  }
});