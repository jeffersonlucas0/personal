const aluno = JSON.parse(localStorage.getItem('alunoSelecionado'));
const lista = document.getElementById('lista-treinos');
document.getElementById('aluno-nome').textContent = `Ficha de ${aluno.nome}`;
document.getElementById('plano-dieta').value = aluno.dieta || '';

function renderTreinos() {
  lista.innerHTML = '';
  (aluno.treino || []).forEach((t, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${t.exercicio} - ${t.series} 
      ${t.video ? `<a href="${t.video}" target="_blank">[Vídeo]</a>` : ''}
      <button onclick="removerTreino(${i})">Remover</button>`;
    lista.appendChild(li);
  });
}

document.getElementById('form-treino').addEventListener('submit', (e) => {
  e.preventDefault();
  const novo = {
    exercicio: document.getElementById('exercicio').value,
    series: document.getElementById('series').value,
    video: document.getElementById('video').value
  };
  aluno.treino = aluno.treino || [];
  aluno.treino.push(novo);
  renderTreinos();
  e.target.reset();
});

function removerTreino(index) {
  aluno.treino.splice(index, 1);
  renderTreinos();
}

document.getElementById('salvar-ficha').addEventListener('click', () => {
  aluno.dieta = document.getElementById('plano-dieta').value;

  let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
  alunos = alunos.map(a => a.email === aluno.email ? aluno : a);
  localStorage.setItem('alunos', JSON.stringify(alunos));
  alert("Ficha salva com sucesso!");
});

renderTreinos();
