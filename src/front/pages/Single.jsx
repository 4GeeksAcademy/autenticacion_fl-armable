// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useParams, useNavigate } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import PropTypes from "prop-types";  // To define prop types for this component
import rigoImageUrl from "../assets/img/rigo-baby.jpg"  // Import an image asset
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useState, useEffect } from "react";
import { Signup } from "./Signup";  // Import the Signup component for user registration
import {Demo} from "./Demo";

// Define and export the Single component which displays individual item details.
export const Single = props => {
  // Access the global state using the custom hook.
  const { store, dispatch } = useGlobalReducer()
  const [todo, setTodo] = useState(null);  // State to hold the single todo item
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Retrieve the 'theId' URL parameter using useParams hook.
  const { theId } = useParams()
  let id = parseInt(theId);  // Convert the 'theId' to an integer
  const singleTodo = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;  // Get the backend URL from environment variables
    try {
      // Fetch the todo item from the backend using the id.
      const resp = await fetch(`${backendUrl}/api/private/single/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,  // Include the token for authorization
        },
      });
      const data = await resp.json();  // Parse the response data
      if (resp.status === 200) {
        setTodo(data.task);  // Set the todo state with the fetched data
      }
      if (resp.status === 401) {
        // If unauthorized, reset the store
        dispatch({ type: "reset_store" })
      }
      if (data.message) {
        console.log(data.message);  // Log any message from the response
      } else {
        console.error("Error al cargar tarea:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  useEffect(() => {
    if (store.user) {
      singleTodo();
    } else {
      navigate("/signup");
    }
  }, [store.user, navigate]);

  return (
    <div className="container text-center">
      {/* Display the title of the todo element dynamically retrieved from the store using theId. */}
      <h1 className="display-4">Todo: {todo?.title}</h1>
      <hr className="my-4" />  {/* A horizontal rule for visual separation. */}

      {/* A Link component acts as an anchor tag but is used for client-side routing to prevent page reloads. */}
      <Link to="/demo">
        <span className="btn btn-primary btn-lg" href="#" role="button">
          Go back
        </span>
      </Link>
    </div>
  );
};

// Use PropTypes to validate the props passed to this component, ensuring reliable behavior.
Single.propTypes = {
  // Although 'match' prop is defined here, it is not used in the component.
  // Consider removing or using it as needed.
  match: PropTypes.object
};
