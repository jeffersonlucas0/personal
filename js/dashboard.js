document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-aluno');
  const lista = document.getElementById('alunos-lista');

  function salvarAluno(aluno) {
    const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    alunos.push(aluno);
    localStorage.setItem('alunos', JSON.stringify(alunos));
  }

  function carregarAlunos() {
  const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
  lista.innerHTML = '';

  alunos.forEach((aluno, index) => {
    const template = document.getElementById('template-aluno').content.cloneNode(true);
    template.querySelector('.aluno-nome').textContent = `${aluno.nome} - ${aluno.objetivo}`;
    
    // Acessar ficha
    template.querySelector('.btn-ficha').onclick = () => {
      localStorage.setItem('alunoSelecionado', JSON.stringify(aluno));
      window.location.href = 'aluno.html';
    };

    // Editar
    template.querySelector('.btn-editar').onclick = () => {
      const nome = prompt("Nome:", aluno.nome);
      const idade = prompt("Idade:", aluno.idade);
      const objetivo = prompt("Objetivo:", aluno.objetivo);
      if (nome && idade && objetivo) {
        aluno.nome = nome;
        aluno.idade = idade;
        aluno.objetivo = objetivo;
        alunos[index] = aluno;
        localStorage.setItem('alunos', JSON.stringify(alunos));
        carregarAlunos();
      }
    };

    // Remover
    template.querySelector('.btn-remover').onclick = () => {
      if (confirm("Tem certeza que deseja remover este aluno?")) {
        alunos.splice(index, 1);
        localStorage.setItem('alunos', JSON.stringify(alunos));
        carregarAlunos();
      }
    };

    lista.appendChild(template);
  });
}


  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const aluno = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('emailAluno').value,
      idade: document.getElementById('idade').value,
      objetivo: document.getElementById('objetivo').value
    };
    salvarAluno(aluno);
    form.reset();
    carregarAlunos();
  });

  carregarAlunos();
});
