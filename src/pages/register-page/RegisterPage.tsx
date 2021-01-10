import React, { useState } from "react";
import styles from "./RegisterPage.module.css";
import { useAuth } from "../../contexts/AuthContext";

import { Link, useHistory, Redirect } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { signUp, currentUser } = useAuth();
  const history = useHistory();

  if (currentUser) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="box-wide">
      <div className={styles.container}>
        <h2>Register</h2>
        {error && <p>{error}</p>}
        {renderForm()}

        <p>
          Already have an account? <Link to="/">Login In</Link>
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
        <div>
          <label htmlFor="re-password">Password Confirmation</label>
          <input
            type="password"
            name="re-password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </div>
        <div>
          <p>Choose your role:</p>
          <label>
            <input
              type="radio"
              value="candidate"
              checked={role === "candidate"}
              onChange={(e) => setRole(e.target.value)}
            />
            Canditate
          </label>
          <label>
            <input
              type="radio"
              value="client"
              checked={role === "client"}
              onChange={(e) => setRole(e.target.value)}
            />
            Client
          </label>
        </div>
        <br />
        <button disabled={isSubmitting}>Sign Up</button>
      </form>
    );
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (password !== rePassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setIsSubmitting(true);
      await signUp(email, password, role);
      history.push("/dashbaord");
    } catch {
      setError("Failed to create an account");
    }
    setIsSubmitting(false);
  }
}
