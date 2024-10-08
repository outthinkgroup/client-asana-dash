import React from "react";
import {Link} from "react-router-dom";
import { AuthContext } from "../auth/Context.jsx";
export default function AllProjectsLink() {
	const { isUserSignedIn } = React.useContext(AuthContext);
	if (!isUserSignedIn) {
		return null;
	}
	return (
		<Link to={`/`}>
			&larr; All Projects
		</Link>
	);
}
