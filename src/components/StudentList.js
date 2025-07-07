import React, { useEffect, useState, useRef } from "react";
import { buscarAlunos, criarAluno, atualizarAluno, deletarAluno } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

const initialForm = { nome: "", email: "", telefone: "", matricula: "" };

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const modalRef = useRef();
  const deleteModalRef = useRef();

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await buscarAlunos();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError("Erro ao buscar alunos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await atualizarAluno(form.matricula, form);
      } else {
        await criarAluno(form);
      }
      setForm(initialForm);
      setEditing(false);
      setShowModal(false);
      loadStudents();
    } catch (err) {
      setError("Erro ao salvar aluno");
    }
  };

  const handleEdit = (student) => {
    setForm(student);
    setEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        await deletarAluno(studentToDelete.matricula);
        setShowDeleteModal(false);
        setStudentToDelete(null);
        loadStudents();
      } catch (err) {
        setError("Erro ao deletar aluno");
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditing(false);
    setShowModal(false);
  };

  // Para fechar modal ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
        setEditing(false);
        setForm(initialForm);
      }
    }
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  // Fechar modal de delete ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target)) {
        setShowDeleteModal(false);
        setStudentToDelete(null);
      }
    }
    if (showDeleteModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDeleteModal]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Lista de Alunos</h4>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowModal(true);
            setForm(initialForm);
            setEditing(false);
          }}
        >
          Novo Aluno
        </button>
      </div>
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog">
            <div className="modal-content" ref={modalRef}>
              <div className="modal-header">
                <h5 className="modal-title">{editing ? "Editar Aluno" : "Cadastrar Aluno"}</h5>
                <button type="button" className="btn-close" aria-label="Fechar" onClick={handleCancel}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input className="form-control" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      type="email"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Telefone</label>
                    <input className="form-control" name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Matrícula</label>
                    <input
                      className="form-control"
                      name="matricula"
                      placeholder="Matrícula"
                      value={form.matricula}
                      onChange={handleChange}
                      required
                      disabled // campo sempre bloqueado
                    />
                  </div>
                </div>
                <div className="modal-footer d-flex flex-wrap gap-2 p-0">
                  <button className="btn btn-danger flex-fill" type="button" onClick={handleCancel}>
                    Cancelar
                  </button>
                  <button className="btn btn-success flex-fill" type="submit">
                    {editing ? "Salvar" : "Adicionar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog">
            <div className="modal-content" ref={deleteModalRef}>
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Exclusão</h5>
                <button type="button" className="btn-close" aria-label="Fechar" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>
                  Tem certeza que deseja deletar o aluno <strong>{studentToDelete?.nome}</strong>?
                </p>
              </div>
              <div className="modal-footer d-flex flex-wrap gap-2 p-0">
                <button className="btn btn-danger flex-fill" onClick={confirmDelete}>
                  Deletar
                </button>
                <button className="btn btn-secondary flex-fill" onClick={cancelDelete}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <div>Carregando...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-primary">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Matrícula</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.matricula}>
                  <td>{student.nome}</td>
                  <td>{student.email}</td>
                  <td>{student.telefone}</td>
                  <td>{student.matricula}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(student)} title="Editar">
                      {/* Ícone de editar - Flaticon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M17.013 3.427a2.5 2.5 0 0 1 3.536 3.536l-1.086 1.086-3.536-3.536 1.086-1.086Zm-2.121 2.121-10.185 10.185a2 2 0 0 0-.512.878l-1.16 3.482a.5.5 0 0 0 .633.633l3.482-1.16a2 2 0 0 0 .878-.512l10.185-10.185-3.321-3.321Z"
                          fill="#fff"
                        />
                      </svg>
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(student)} title="Deletar">
                      {/* Ícone de deletar - Flaticon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 10.586l4.95-4.95a1 1 0 1 1 1.414 1.415L13.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 0 1-1.414-1.414L10.586 12l-4.95-4.95A1 1 0 1 1 7.05 5.636L12 10.586z"
                          fill="#fff"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    Nenhum aluno cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
