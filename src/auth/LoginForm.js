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
      <label htmlFor="email">
        <p>Email</p>
        <input
          type="email"
          placeholder="email"
          name="email"
          value={form.email}
          onChange={updateForm}
          id="email"
        />
      </label>
      <label htmlFor="password">
        <p>password</p>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={updateForm}
        />
      </label>
      <div>
        <button>{loading ? "logging in..." : "login"}</button>
      </div>
    </form>
  );
}
