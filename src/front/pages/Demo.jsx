// Import necessary components from react-router-dom and other parts of the application.
import React, { useEffect } from "react";  // Import React and useEffect for side effects.
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Custom hook for accessing the global state.
import { Signup } from "./Signup";  // Import the Signup component for user registration.

export const Demo = () => {
  // Access the global state and dispatch function using the useGlobalReducer hook.
  const { store, dispatch } = useGlobalReducer()
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Load todos from the backend when the component mounts.
  const loadTodos = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    try {
    const resp = await fetch(`${backendUrl}/api/private/demo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.token}`,
      },
    });
    const data = await resp.json();
    if (resp.status === 200) {
      dispatch({ type: "add_todos", payload: data.tasks });
    }
    if (resp.status === 401) {
      dispatch({ type: "reset_store" })
    }
    if (data.message) {
      console.log(data.message);
    } else {
      console.error("Error al cargar tareas:", data);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

  useEffect(() => {
    if (store.token) {
      loadTodos();
    } else {
      navigate("/Signup");
    }
  }, [store.token, navigate]);

  return (
    <div className="container">
      <ul className="list-group">
        {/* Map over the 'todos' array from the store and render each item as a list element */}
        {Array.isArray(store.todos) && store.todos.length > 0 ? store.todos.map(todo => (
            <li
              key={todo.id}  // React key for list items.
              className="list-group-item d-flex justify-content-between"
              style={{ background: todo.background }}> 
              
              {/* Link to the detail page of this todo. */}
              <Link to={"/single/" + todo.id}>Link to: {todo.title} </Link>
              
              <p>Open file ./store.js to see the global store that contains and updates the list of colors</p>
              
              <button className="btn btn-success" 
                onClick={() => dispatch({
                  type: "add_task", 
                  payload: { id: todo.id, color: '#ffa500' }
                })}>
                Change Color
              </button>
            </li> )):(null)}
      </ul>

    </div>
  );
};
