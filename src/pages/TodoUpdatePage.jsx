import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { showErrorDialog } from "../utils/tools";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading-bar";

function TodoUpdatePage() {
  const { id } = useParams();
  const [todo, setTodo] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodo = async () => {
      dispatch(showLoading());
      try {
        const fetchedTodo = await api.getDetailTodo(id);
        setTodo(fetchedTodo);
        setLoading(false);
      } catch (error) {
        showErrorDialog(error.message);
      }
      dispatch(hideLoading());
    };
    fetchTodo();
  }, [id, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showLoading());
    try {
      await api.putUpdateTodo({ id, ...todo }); // Menggunakan `putUpdateTodo` yang benar
      navigate(`/todos/${id}`); // Redirect ke halaman detail todo
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodo({
      ...todo,
      [name]: value,
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <h2>Edit Todo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={todo.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={todo.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default TodoUpdatePage;
