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
        <h2 className={styles.title}>
          Welcome <br /> Back
        </h2>

        {renderForm()}
        <p>
          <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
  function renderForm() {
    return (
      <form className={styles.form} onSubmit={submitForm}>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className={styles.error_msg}>{error}</p>}
        <div className={styles.login_btn_container}>
          <label className={styles.login_label}>Sign in</label>
          <input
            type="submit"
            value=""
            className={styles.login_input}
            disabled={isSubmitting}
          />
        </div>
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
