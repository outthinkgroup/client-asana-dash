import React from "react";
import LoginForm from "../auth/LoginForm.js";

export default function Login() {
  const [isShowForm, setIsShowForm] = React.useState(false);
  return (
    <div>
      {isShowForm ? (
        <div style={{ display: `flex` }}>
          <button
            style={{ height: `2em` }}
            onClick={() => setIsShowForm(false)}
          >
            &times;
          </button>
          <LoginForm onSubmitAction={() => setIsShowForm(false)} />
        </div>
      ) : (
        <button type="button" onClick={() => setIsShowForm((s) => !s)}>
          Login
        </button>
      )}
    </div>
  );
}
