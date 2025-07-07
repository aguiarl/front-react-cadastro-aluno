import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/alunos/";

// Busca todos os alunos
export const buscarAlunos = async () => {
  try {
    const resposta = await axios.get(API_URL);
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao buscar alunos:", erro);
    throw erro;
  }
};

// Cria um novo aluno
export const criarAluno = async (dadosAluno) => {
  try {
    const resposta = await axios.post(API_URL, dadosAluno);
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao criar aluno:", erro);
    throw erro;
  }
};

// Atualiza um aluno existente
export const atualizarAluno = async (matriculaAluno, dadosAluno) => {
  try {
    const resposta = await axios.put(`${API_URL}${matriculaAluno}/`, dadosAluno);
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao atualizar aluno:", erro);
    throw erro;
  }
};

// Deleta um aluno
export const deletarAluno = async (matriculaAluno) => {
  try {
    await axios.delete(`${API_URL}${matriculaAluno}/`);
  } catch (erro) {
    console.error("Erro ao deletar aluno:", erro);
    throw erro;
  }
};
