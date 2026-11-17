import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

const API = "http://localhost:8080";
const REFRESH_KEY = "refreshToken";

let accessToken = null; // kept in memory only
let refreshing = null;  // makes sure only ONE refresh runs at a time

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}

function saveSession(data) {
  accessToken = data.accessToken;
  localStorage.setItem(REFRESH_KEY, data.refreshToken);
  return data;
}

function clearSession() {
  accessToken = null;
  localStorage.removeItem(REFRESH_KEY);
}

// Google popup -> Firebase proof -> your backend -> your tokens
export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const idToken = await cred.user.getIdToken();
  return saveSession(await post("/api/auth/firebase", { idToken }));
}

// Refresh tokens work only once, so never run two refreshes together
function refreshOnce() {
  if (!refreshing) {
    refreshing = (async () => {
      const refreshToken = localStorage.getItem(REFRESH_KEY);
      if (!refreshToken) throw new Error("Not logged in");
      try {
        return saveSession(await post("/api/auth/refresh", { refreshToken }));
      } catch (e) {
        clearSession();
        throw e;
      }
    })().finally(() => { refreshing = null; });
  }
  return refreshing;
}

// Call on page load so a reload keeps the user logged in
export async function restoreSession() {
  if (!localStorage.getItem(REFRESH_KEY)) return null;
  try { return await refreshOnce(); } catch { return null; }
}

function send(path, options) {
  return fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
}

// Use this for EVERY call to your backend
export async function apiFetch(path, options = {}) {
  let res = await send(path, options);
  if (res.status === 401 && localStorage.getItem(REFRESH_KEY)) {
    await refreshOnce();
    res = await send(path, options);
  }
  return res;
}

export async function logout() {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (refreshToken) {
    try { await post("/api/auth/logout", { refreshToken }); } catch { /* ignore */ }
  }
  clearSession();
  await signOut(auth);
}