const logado = JSON.parse(localStorage.getItem("alunoSelecionado"));
let todos = JSON.parse(localStorage.getItem("alunos")) || [];
let aluno = todos.find(a => a.email === logado.email);

// Atualiza o cache
localStorage.setItem("alunoSelecionado", JSON.stringify(aluno));



document.getElementById('titulo-aluno').textContent = `Bem-vindo, ${aluno.nome}`;
document.getElementById('idade').textContent = aluno.idade;
document.getElementById('peso').textContent = aluno.peso ?? "não informado";
document.getElementById('altura').textContent = aluno.altura ?? "não informado";
document.getElementById('objetivo').textContent = aluno.objetivo ?? "-";
document.getElementById('plano-alimentar').textContent = aluno.dieta || "-";

// Calcular IMC
if (aluno.peso && aluno.altura) {
  const imc = (aluno.peso / (aluno.altura ** 2)).toFixed(2);
  document.getElementById('imc').textContent = imc;
} else {
  document.getElementById('imc').textContent = "Altura/peso não informados";
}

// Mostrar treino
const lista = document.getElementById('lista-treinos');
(aluno.treino || []).forEach(t => {
  const li = document.createElement('li');
  li.innerHTML = `${t.exercicio} - ${t.series} 
    ${t.video ? `<a href="${t.video}" target="_blank">[Vídeo]</a>` : ''}`;
  lista.appendChild(li);
});

// Chat
const chatBox = document.getElementById('chat-box');
const mensagemInput = document.getElementById('mensagem');

function carregarChat() {
  const msgs = JSON.parse(localStorage.getItem('chat_' + aluno.email)) || [];
  chatBox.innerHTML = '';
  msgs.forEach(m => {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${m.remetente}:</strong> ${m.texto}`;
    chatBox.appendChild(p);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function enviarMensagem() {
  const texto = mensagemInput.value.trim();
  if (!texto) return;
  const msgs = JSON.parse(localStorage.getItem('chat_' + aluno.email)) || [];
  msgs.push({ remetente: aluno.nome, texto });
  localStorage.setItem('chat_' + aluno.email, JSON.stringify(msgs));
  mensagemInput.value = '';
  carregarChat();
}

carregarChat();

function salvarMedidas() {
  const novoPeso = parseFloat(document.getElementById('peso').value);
  const novaAltura = parseFloat(document.getElementById('altura').value);

  if (novoPeso > 0) aluno.peso = novoPeso;
  if (novaAltura > 0) aluno.altura = novaAltura;

  // Salva histórico de peso
  const historico = JSON.parse(localStorage.getItem('historico_' + aluno.email)) || [];
  historico.push({ data: new Date().toLocaleDateString(), peso: aluno.peso });
  localStorage.setItem('historico_' + aluno.email, JSON.stringify(historico));

  // Atualiza aluno no localStorage
  let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
  alunos = alunos.map(a => a.email === aluno.email ? aluno : a);
  localStorage.setItem("alunos", JSON.stringify(alunos));
  localStorage.setItem("alunoSelecionado", JSON.stringify(aluno));

  mostrarDados(); // Atualiza na tela
  carregarGrafico(); // Atualiza gráfico
  alert("Dados atualizados com sucesso!");
}

function carregarGrafico() {
  const historico = JSON.parse(localStorage.getItem('historico_' + aluno.email)) || [];
  const labels = historico.map(h => h.data);
  const dados = historico.map(h => h.peso);

  const ctx = document.getElementById('grafico-evolucao').getContext('2d');
  if (window.graficoPeso) window.graficoPeso.destroy(); // Evita gráfico duplicado

  window.graficoPeso = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Peso (kg)',
        data: dados,
        borderColor: 'blue',
        backgroundColor: 'lightblue',
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

carregarGrafico();

window.addEventListener('storage', function(event) {
  if (event.key === 'alunos') {
    // Quando o 'alunos' mudar, atualizar os dados do aluno na tela
    atualizarAluno();
  }
});

function atualizarAluno() {
  const logado = JSON.parse(localStorage.getItem("alunoSelecionado"));
  const todos = JSON.parse(localStorage.getItem("alunos")) || [];
  const novoAluno = todos.find(a => a.email === logado.email);

  if (novoAluno) {
    localStorage.setItem("alunoSelecionado", JSON.stringify(novoAluno));
    aluno = novoAluno;
    mostrarDados();
    carregarGrafico();
    carregarTreinos();
    carregarChat();
  }
}
const historicoTreinos = aluno.historicoTreinos || [];
const historicoTreinosEl = document.getElementById('historico-treinos');
historicoTreinosEl.innerHTML = '';

historicoTreinos.forEach(registro => {
  const li = document.createElement('li');
  li.innerHTML = `<strong>${registro.data}</strong><ul>` +
    registro.exercicios.map(e => `<li>${e.exercicio} - ${e.series}</li>`).join('') +
    '</ul>';
  historicoTreinosEl.appendChild(li);
});

if (historicoTreinos.length === 0) {
  historicoTreinosEl.innerHTML = "<li>Nenhum treino registrado</li>";
}
