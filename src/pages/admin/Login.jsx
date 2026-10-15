import { useRef, useState } from "react";
import { api } from "../../lib/api.js";

export default function Login({ notice, onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const errRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) { setError("Enter your email address and password."); return; }
    setBusy(true);
    setError("");
    try {
      const r = await api("/api/v1/admin/session", { method: "POST", body: { email: email.trim(), password } });
      setPassword("");
      onSignedIn(r.user);
    } catch (err) {
      setError(err.message);
      requestAnimationFrame(() => errRef.current && errRef.current.focus());
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card adm__narrow">
      <h1 className="adm__h1">Sign in</h1>
      <p className="muted">For authorised 360 Biz Health staff only. Accounts are created by an administrator; there is no public sign-up.</p>
      {notice && <div className="alert alert--error" role="alert" style={{ marginBottom: "1rem" }}>{notice}</div>}
      <form onSubmit={submit} noValidate className="adm__login">
        <div className="field">
          <label htmlFor="adm-email">Email</label>
          <input id="adm-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="adm-pass">Password</label>
          <input id="adm-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className={"alert" + (error ? " alert--error" : "")} role="alert" tabIndex={-1} ref={errRef}>{error}</div>
        <button className="btn btn--green btn--block" type="submit" disabled={busy} aria-busy={busy ? "true" : "false"}>
          {busy ? <><span className="spinner" aria-hidden="true" /> Signing in…</> : "Sign in"}
        </button>
      </form>
    </div>
  );
}
