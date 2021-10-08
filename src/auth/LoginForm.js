import React from "react";

import { login } from "./utils.js";
import { AuthContext } from "./Context.js";

export default function LoginForm({ onSubmitAction }) {
  const { setIsUserSignedIn } = React.useContext(AuthContext);
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  function updateForm(e) {
    setForm((form) => {
      return { ...form, [e.target.name]: e.target.value };
    });
  }
  async function loginUser(e) {
    e.preventDefault();
    setLoading(true);
    const user = await login(form.email, form.password);
    setLoading(false);
    setIsUserSignedIn(Boolean(user.user_metadata.full_name));
    onSubmitAction();
  }
  return (
    <form onSubmit={loginUser}>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={updateForm}
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={updateForm}
      />
      <button>{loading ? "logging in..." : "login"}</button>
    </form>
  );
}
