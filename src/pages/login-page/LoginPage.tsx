import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import { Link, useHistory, Redirect } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { login, currentUser } = useAuth();

  const history = useHistory();

  if (currentUser) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="box-wide">
      <div className={styles.container}>
        <h2>Login</h2>
        {error && <p>{error}</p>}
        {renderForm()}
        <p>
          Do not have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
  function renderForm() {
    return (
      <form onSubmit={submitForm}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button disabled={isSubmitting}>Login</button>
      </form>
    );
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);
      await login(email, password);
      history.push("/dashboard");
    } catch {
      setError("Failed to login");
    }
    setIsSubmitting(false);
  }
}
