import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../lib/api.js";
import { useAdmin, useCrumbs } from "./AdminApp.jsx";
import { fmtDateTime, Loading, ErrorCard, Msg } from "./ui.jsx";
import Icon from "./Icon.jsx";

/* Native accessible dialog modal */
function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dlg"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="adm__h2" style={{ margin: 0 }}>{title}</h2>
        <button
          type="button"
          className="iconbtn"
          style={{ width: "28px", height: "28px", border: "none" }}
          onClick={onClose}
          aria-label="Close dialog"
        >
          <Icon name="close" size={16} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export default function Users() {
  const { user, onAuthError } = useAdmin();
  useCrumbs([["Dashboard", "/admin"], ["Users & Access"]]);

  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState({ kind: "", text: "" });

  // Create User Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ email: "", password: "", role: "staff" });
  const [createErr, setCreateErr] = useState("");
  const [createBusy, setCreateBusy] = useState(false);

  // Password Reset Modal state
  const [pwTarget, setPwTarget] = useState(null);
  const [pwVal, setPwVal] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  // Confirm Action state (suspend, reactivate, change role, delete)
  const [confirm, setConfirm] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const load = useCallback(() => {
    setError("");
    api("/api/v1/admin/users")
      .then((r) => setUsers(r.users))
      .catch((err) => {
        onAuthError(err);
        setError(err.message);
      });
  }, [onAuthError]);

  useEffect(() => {
    if (user.role === "admin") load();
  }, [load, user.role]);

  if (user.role !== "admin") {
    return <ErrorCard title="Administrators only" error="Your account does not have access to user management." />;
  }

  const activeAdminsCount = (users || []).filter((u) => u.role === "admin" && u.active).length;

  // 1. Create User
  const submitCreate = async (e) => {
    e.preventDefault();
    setCreateErr("");
    if (!createForm.email.trim() || !createForm.password) {
      setCreateErr("Email and password are required.");
      return;
    }
    if (createForm.password.length < 8) {
      setCreateErr("Password must be at least 8 characters long.");
      return;
    }
    setCreateBusy(true);
    try {
      await api("/api/v1/admin/users", {
        method: "POST",
        body: {
          email: createForm.email.trim(),
          password: createForm.password,
          role: createForm.role,
        },
      });
      setCreateOpen(false);
      setCreateForm({ email: "", password: "", role: "staff" });
      setMsg({ kind: "ok", text: `User ${createForm.email.trim()} created successfully.` });
      load();
    } catch (err) {
      setCreateErr(err.message);
    } finally {
      setCreateBusy(false);
    }
  };

  // 2. Reset Password
  const submitResetPw = async (e) => {
    e.preventDefault();
    setPwErr("");
    if (!pwVal || pwVal.length < 8) {
      setPwErr("Password must be at least 8 characters long.");
      return;
    }
    setPwBusy(true);
    try {
      await api(`/api/v1/admin/users/${pwTarget.user_id}`, {
        method: "PATCH",
        body: { password: pwVal },
      });
      setPwTarget(null);
      setPwVal("");
      setMsg({ kind: "ok", text: `Password updated successfully for ${pwTarget.email}.` });
    } catch (err) {
      setPwErr(err.message);
    } finally {
      setPwBusy(false);
    }
  };

  // 3. Confirm Dialog Execution
  const executeConfirm = async () => {
    if (!confirm) return;
    setConfirmBusy(true);
    try {
      if (confirm.type === "suspend" || confirm.type === "reactivate") {
        await api(`/api/v1/admin/users/${confirm.user.user_id}`, {
          method: "PATCH",
          body: { active: confirm.type === "reactivate" },
        });
        setMsg({
          kind: "ok",
          text: confirm.type === "reactivate"
            ? `Account ${confirm.user.email} reactivated.`
            : `Account ${confirm.user.email} suspended.`,
        });
      } else if (confirm.type === "role") {
        const nextRole = confirm.user.role === "admin" ? "staff" : "admin";
        await api(`/api/v1/admin/users/${confirm.user.user_id}`, {
          method: "PATCH",
          body: { role: nextRole },
        });
        setMsg({ kind: "ok", text: `Role updated to ${nextRole} for ${confirm.user.email}.` });
      } else if (confirm.type === "delete") {
        await api(`/api/v1/admin/users/${confirm.user.user_id}`, {
          method: "DELETE",
        });
        setMsg({ kind: "ok", text: `Account ${confirm.user.email} deleted.` });
      }
      setConfirm(null);
      load();
    } catch (err) {
      setMsg({ kind: "error", text: err.message });
      setConfirm(null);
    } finally {
      setConfirmBusy(false);
    }
  };

  return (
    <>
      <div className="pagehead">
        <div>
          <h1 className="adm__h1">Users &amp; Access</h1>
          <p className="muted">Manage administrators and staff accounts who can access this CRM dashboard.</p>
        </div>
        <div className="pagehead__actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => {
              setCreateForm({ email: "", password: "", role: "staff" });
              setCreateErr("");
              setCreateOpen(true);
            }}
          >
            <Icon name="plus" size={16} /> Add new user
          </button>
        </div>
      </div>

      {msg.text && (
        <div style={{ marginBottom: "1rem" }}>
          <Msg msg={msg} />
        </div>
      )}

      {error && <ErrorCard title="Users could not be loaded" error={error} onRetry={load} />}
      {!users && !error && <Loading label="Loading users…" />}

      {users && (
        <div className="ltable-wrap">
          <table className="ltable">
            <caption className="sr-only">Dashboard accounts</caption>
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Last sign-in</th>
                <th scope="col">Added</th>
                <th scope="col" style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.email === user.email || u.user_id === user.id;
                const isOnlyAdmin = u.role === "admin" && activeAdminsCount <= 1;

                return (
                  <tr key={u.user_id || u.email}>
                    <td data-label="Email" className="wrap-any">
                      <strong>{u.email}</strong>
                      {isSelf && <span className="muted small"> (you)</span>}
                    </td>
                    <td data-label="Role">
                      <span className={"pill " + (u.role === "admin" ? "pill--contacted" : "pill--draft")}>
                        {u.role === "admin" ? "Administrator" : "Staff"}
                      </span>
                    </td>
                    <td data-label="Status">
                      <span className={"pill " + (u.active ? "pill--published" : "pill--suspended")}>
                        {u.active ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td data-label="Last sign-in">{u.last_sign_in ? fmtDateTime(u.last_sign_in) : "Never"}</td>
                    <td data-label="Added">{fmtDateTime(u.created_at)}</td>
                    <td data-label="Actions">
                      <div className="rowactions">
                        {/* Suspend / Reactivate */}
                        {u.active ? (
                          <button
                            type="button"
                            className="btn btn--ghost btn--xs"
                            disabled={isSelf || isOnlyAdmin}
                            title={isSelf ? "You cannot suspend yourself" : isOnlyAdmin ? "Cannot suspend the only active admin" : "Suspend account"}
                            onClick={() =>
                              setConfirm({
                                type: "suspend",
                                user: u,
                                title: "Suspend account?",
                                body: `Are you sure you want to suspend ${u.email}? They will not be able to sign in until reactivated.`,
                                confirmLabel: "Suspend account",
                                danger: true,
                              })
                            }
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn--green btn--xs"
                            title="Reactivate account"
                            onClick={() =>
                              setConfirm({
                                type: "reactivate",
                                user: u,
                                title: "Reactivate account?",
                                body: `Reactivate ${u.email}? They will be able to sign in to the dashboard again.`,
                                confirmLabel: "Reactivate",
                                danger: false,
                              })
                            }
                          >
                            Reactivate
                          </button>
                        )}

                        {/* Change Role */}
                        <button
                          type="button"
                          className="btn btn--ghost btn--xs"
                          disabled={isSelf && isOnlyAdmin}
                          title={`Change role to ${u.role === "admin" ? "Staff" : "Administrator"}`}
                          onClick={() =>
                            setConfirm({
                              type: "role",
                              user: u,
                              title: `Change role to ${u.role === "admin" ? "Staff" : "Administrator"}?`,
                              body: `Change ${u.email}'s role from ${u.role === "admin" ? "Administrator" : "Staff"} to ${u.role === "admin" ? "Staff" : "Administrator"}?`,
                              confirmLabel: "Change role",
                              danger: false,
                            })
                          }
                        >
                          {u.role === "admin" ? "Make Staff" : "Make Admin"}
                        </button>

                        {/* Reset Password */}
                        <button
                          type="button"
                          className="btn btn--ghost btn--xs"
                          title="Reset password"
                          onClick={() => {
                            setPwTarget(u);
                            setPwVal("");
                            setPwErr("");
                          }}
                        >
                          Password
                        </button>

                        {/* Delete User */}
                        <button
                          type="button"
                          className="iconbtn iconbtn--danger"
                          disabled={isSelf || isOnlyAdmin}
                          title={isSelf ? "You cannot delete yourself" : isOnlyAdmin ? "Cannot delete the only active admin" : "Delete account"}
                          onClick={() =>
                            setConfirm({
                              type: "delete",
                              user: u,
                              title: "Delete account permanently?",
                              body: `Are you sure you want to permanently delete ${u.email}? Their authentication and access will be completely removed. This cannot be undone.`,
                              confirmLabel: "Delete account",
                              danger: true,
                            })
                          }
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Role explanation */}
      <section className="panel-card" style={{ marginTop: "1.4rem" }} aria-labelledby="roles-h">
        <h2 className="adm__h2" id="roles-h">What each role can do</h2>
        <dl className="dl">
          <dt>Administrator</dt>
          <dd>Full access: User management (add/suspend/delete admins), CSV export, publishing/unpublishing blogs, deleting posts, email-alert retries.</dd>
          <dt>Staff</dt>
          <dd>Day-to-day operations: View and update leads, add notes, write and edit blog drafts, upload media images.</dd>
        </dl>
      </section>

      {/* -------------------- MODAL: CREATE NEW USER -------------------- */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add new user">
        <p className="muted small" style={{ margin: "0.2rem 0 0.8rem" }}>
          Create an account with email and password. The user can sign in immediately.
        </p>
        {createErr && <div className="alert alert--error" role="alert" style={{ marginBottom: "0.8rem" }}>{createErr}</div>}
        <form onSubmit={submitCreate}>
          <div className="field">
            <label htmlFor="nu-email">Email address</label>
            <input
              id="nu-email"
              type="email"
              required
              autoComplete="off"
              placeholder="colleague@360bizhealth.com"
              value={createForm.email}
              onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="field">
            <label htmlFor="nu-pass">Password</label>
            <input
              id="nu-pass"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              minLength={8}
              value={createForm.password}
              onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <div className="field">
            <label htmlFor="nu-role">Role</label>
            <select
              id="nu-role"
              value={createForm.role}
              onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))}
            >
              <option value="staff">Staff (Leads &amp; blog drafts)</option>
              <option value="admin">Administrator (Full dashboard access &amp; user management)</option>
            </select>
          </div>
          <div className="dlg__actions">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setCreateOpen(false)}
              disabled={createBusy}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--green btn--sm"
              disabled={createBusy}
            >
              {createBusy ? "Creating…" : "Create user"}
            </button>
          </div>
        </form>
      </Modal>

      {/* -------------------- MODAL: RESET PASSWORD -------------------- */}
      <Modal open={Boolean(pwTarget)} onClose={() => setPwTarget(null)} title="Reset Password">
        {pwTarget && (
          <>
            <p className="muted small" style={{ margin: "0.2rem 0 0.8rem" }}>
              Set a new password for <strong>{pwTarget.email}</strong>.
            </p>
            {pwErr && <div className="alert alert--error" role="alert" style={{ marginBottom: "0.8rem" }}>{pwErr}</div>}
            <form onSubmit={submitResetPw}>
              <div className="field">
                <label htmlFor="rp-pass">New password</label>
                <input
                  id="rp-pass"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  value={pwVal}
                  onChange={(e) => setPwVal(e.target.value)}
                />
              </div>
              <div className="dlg__actions">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => setPwTarget(null)}
                  disabled={pwBusy}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--green btn--sm"
                  disabled={pwBusy}
                >
                  {pwBusy ? "Updating…" : "Update password"}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>

      {/* -------------------- MODAL: CONFIRM ACTION -------------------- */}
      <Modal open={Boolean(confirm)} onClose={() => setConfirm(null)} title={confirm ? confirm.title : ""}>
        {confirm && (
          <>
            <p style={{ margin: "0.8rem 0 1.2rem", color: "var(--text)" }}>{confirm.body}</p>
            <div className="dlg__actions">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setConfirm(null)}
                disabled={confirmBusy}
              >
                Cancel
              </button>
              <button
                type="button"
                className={"btn btn--sm " + (confirm.danger ? "btn--danger" : "btn--green")}
                onClick={executeConfirm}
                disabled={confirmBusy}
              >
                {confirmBusy ? "Working…" : confirm.confirmLabel}
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
