import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"; // Custom hook for accessing the global state

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer(); // Access the global state using the custom hook
	const user = store.user; // Extract the user from the global state

	const handleLogout = async () => {
    sessionStorage.removeItem("token"); // Borra el token del almacenamiento
    dispatch({ type: "reset_store" }); // Limpia el store global
};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<>
						{user == null? (
							<Link to="/signup">
								<button className="btn btn-primary">Sign up</button>
							</Link>
						) : (
							<button
								type="button"
								className="btn btn-danger"
								onClick={handleLogout}
							>
								Log out
							</button>)}
					</>
				</div>
			</div>
		</nav>
	);
};