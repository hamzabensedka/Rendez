/* Planity Admin — zero-dependency SPA over the /v1 API.
   Token storage: localStorage (admin console on trusted machines). */
const API = (localStorage.getItem('apiBase') || 'http://localhost:3000/v1').replace(/\/$/, '');

const state = { token: localStorage.getItem('accessToken') || null, me: null };

// ── HTTP helper ────────────────────────────────────────────────────────
async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(`${API}${path}`, { ...options, headers });

  if (response.status === 401) {
    logout('Session expired. Log in again.');
    throw new Error('401');
  }
  if (response.status === 403) {
    throw new Error('403: admin role required for this action');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = Array.isArray(body.message)
      ? body.message.join(', ')
      : body.message || body.error;
    throw new Error(message || `HTTP ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}

function requireAdmin() {
  if (!state.token || (state.me && state.me.role !== 'admin')) {
    logout(state.token ? '403: admin role required' : null);
    return false;
  }
  return true;
}

// ── Auth ───────────────────────────────────────────────────────────────
function showLogin(message) {
  document.getElementById('app-view').hidden = true;
  document.getElementById('login-view').hidden = false;
  document.getElementById('login-error').textContent = message || '';
}

function showApp() {
  document.getElementById('login-view').hidden = true;
  document.getElementById('app-view').hidden = false;
  route();
}

async function login(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  try {
    const result = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    state.token = result.accessToken;
    state.me = result.user;
    localStorage.setItem('accessToken', state.token);
    if (!requireAdmin()) return;
    showApp();
  } catch (error) {
    document.getElementById('login-error').textContent = String(error.message || error).replace(
      /^Error:\s*/,
      ''
    );
  }
}

function logout(message) {
  state.token = null;
  state.me = null;
  localStorage.removeItem('accessToken');
  showLogin(message);
}

// ── View helpers ───────────────────────────────────────────────────────
const view = () => document.getElementById('view');
function setNav(key) {
  document.querySelectorAll('.nav-item').forEach((el) => {
    el.classList.toggle('active', el.dataset.nav === key);
  });
}
function esc(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}
function pager(meta, onPage) {
  const last = Math.max(1, Math.ceil(meta.total / meta.limit));
  return `<div class="pager">
    <button class="outline small" ${meta.page <= 1 ? 'disabled' : ''} data-page="${meta.page - 1}">Prev</button>
    <span class="muted">page ${meta.page} / ${last} · ${meta.total} total</span>
    <button class="outline small" ${meta.page >= last ? 'disabled' : ''} data-page="${meta.page + 1}">Next</button>
  </div>`;
}
function bindPager(container, onPage) {
  container.querySelectorAll('[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => onPage(Number(btn.dataset.page)));
  });
}
function statusBadge(status) {
  const cls =
    status === 'approved' || status === 'active' || status === 'COMPLETED'
      ? 'success'
      : status === 'rejected' || status === 'CANCELLED' || status === 'suspended'
        ? 'danger'
        : status === 'BOOKED'
          ? 'dark'
          : '';
  return `<span class="badge ${cls}">${esc(String(status).toUpperCase())}</span>`;
}

// ── Reviews moderation ─────────────────────────────────────────────────
async function renderReviews(page = 1) {
  setNav('reviews');
  view().innerHTML =
    '<div class="section-label">MODERATION QUEUE</div><h1 class="headline">Pending reviews</h1><div class="empty">Loading…</div>';
  let payload;
  try {
    payload = await api(`/reviews/pending?page=${page}&limit=20`);
  } catch (error) {
    view().innerHTML += `<div class="error">${esc(error.message)}</div>`;
    return;
  }
  const rows = payload.data
    .map(
      (review) => `<tr>
        <td>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</td>
        <td>${esc(review.comment || '—')}</td>
        <td>${esc(review.clientUser?.name)}</td>
        <td class="muted">${esc(review.businessId)}</td>
        <td>
          <button class="approve small" data-decision="approve" data-id="${review.id}">Approve</button>
          <button class="reject small" data-decision="reject" data-id="${review.id}">Reject</button>
        </td>
      </tr>`
    )
    .join('');
  view().innerHTML += `<div class="card">
    <table><thead><tr><th>Rating</th><th>Comment</th><th>Author</th><th>Business</th><th>Decision</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5" class="empty">Queue is empty.</td></tr>'}</tbody></table>
    ${pager(payload.meta, renderReviews)}
  </div>`;

  view()
    .querySelectorAll('[data-decision]')
    .forEach((btn) => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try {
          await api(`/reviews/${btn.dataset.id}/moderate`, {
            method: 'PATCH',
            body: JSON.stringify({ decision: btn.dataset.decision }),
          });
          renderReviews(page);
        } catch (error) {
          btn.disabled = false;
          alert(error.message);
        }
      });
    });
  bindPager(view(), renderReviews);
}

// ── Users ──────────────────────────────────────────────────────────────
async function renderUsers(page = 1) {
  setNav('users');
  view().innerHTML =
    '<div class="section-label">ACCOUNTS</div><h1 class="headline">Users</h1><div class="empty">Loading…</div>';
  // NOTE: GET /v1/users returns the tuple [rows, total] (transaction batch shape).
  let payload;
  try {
    payload = await api(`/users?page=${page}&limit=20`);
  } catch (error) {
    view().innerHTML += `<div class="error">${esc(error.message)}</div>`;
    return;
  }
  const [rows, total] = payload;
  const meta = { page, limit: 20, total };
  const body = (rows || [])
    .map(
      (user) => `<tr>
        <td>${esc(user.name)}</td><td>${esc(user.email)}</td>
        <td>${statusBadge(user.role)}</td><td>${statusBadge(user.status)}</td>
        <td class="muted">${esc((user.createdAt || '').slice(0, 10))}</td>
      </tr>`
    )
    .join('');
  view().innerHTML += `<div class="card">
    <table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
    <tbody>${body}</tbody></table>
    ${pager(meta, renderUsers)}
  </div>`;
  bindPager(view(), renderUsers);
}

// ── Businesses ─────────────────────────────────────────────────────────
async function renderBusinesses(page = 1) {
  setNav('businesses');
  view().innerHTML =
    '<div class="section-label">SUPPLY SIDE</div><h1 class="headline">Businesses</h1><div class="empty">Loading…</div>';
  let payload;
  try {
    payload = await api(`/admin/businesses?page=${page}&limit=20`);
  } catch (error) {
    view().innerHTML += `<div class="error">${esc(error.message)}</div>`;
    return;
  }
  const body = payload.data
    .map(
      (biz) => `<tr>
        <td>${esc(biz.name)}</td>
        <td class="muted">${esc(biz.slug)}</td>
        <td class="muted">${esc(biz.category)}</td>
        <td>${statusBadge(biz.status)}</td>
        <td>${biz.ratingAvg ? Number(biz.ratingAvg).toFixed(2) : '—'} (${biz.ratingCount})</td>
      </tr>`
    )
    .join('');
  view().innerHTML += `<div class="card">
    <table><thead><tr><th>Name</th><th>Slug</th><th>Category</th><th>Status</th><th>Rating</th></tr></thead>
    <tbody>${body}</tbody></table>
    ${pager(payload.meta, renderBusinesses)}
  </div>`;
  bindPager(view(), renderBusinesses);
}

// ── Appointment search ─────────────────────────────────────────────────
let appointmentFilters = {};
async function renderAppointments() {
  setNav('appointments');
  const f = appointmentFilters;
  const query = new URLSearchParams();
  Object.entries(f).forEach(([key, value]) => value && query.set(key, value));
  query.set('page', String(f.page || 1));
  query.set('limit', '20');

  view().innerHTML = `
    <div class="section-label">OPERATIONS</div><h1 class="headline">Appointment search</h1>
    <form class="toolbar" id="apt-filters">
      <label class="field">Business ID<input name="businessId" value="${esc(f.businessId || '')}" placeholder="(any)" /></label>
      <label class="field">Status<select name="status">
        <option value="">(any)</option>
        ${['BOOKED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map((s) => `<option ${f.status === s ? 'selected' : ''}>${s}</option>`).join('')}
      </select></label>
      <label class="field">From<input type="date" name="from" value="${esc(f.from || '')}" /></label>
      <label class="field">To<input type="date" name="to" value="${esc(f.to || '')}" /></label>
      <button class="primary" type="submit">Search</button>
    </form>
    <div id="apt-results"><div class="empty">Loading…</div></div>`;

  const draw = async () => {
    const params = new URLSearchParams();
    Object.entries(f).forEach(([key, value]) => value && params.set(key, value));
    params.set('page', String(f.page || 1));
    params.set('limit', '20');

    let payload;
    try {
      payload = await api(`/admin/appointments?${params.toString()}`);
    } catch (error) {
      document.getElementById('apt-results').innerHTML =
        `<div class="error">${esc(error.message)}</div>`;
      return;
    }
    const body = payload.data
      .map(
        (apt) => `<tr>
          <td>${esc(apt.business?.name)}</td>
          <td>${esc(apt.clientUser?.name)}<div class="muted">${esc(apt.clientUser?.email)}</div></td>
          <td>${esc((apt.staff || {}).name || '—')}</td>
          <td>${new Date(apt.startAtUtc).toLocaleString()}</td>
          <td>${statusBadge(apt.status)}</td>
        </tr>`
      )
      .join('');
    document.getElementById('apt-results').innerHTML = `<div class="card">
      <table><thead><tr><th>Business</th><th>Client</th><th>Staff</th><th>When (local)</th><th>Status</th></tr></thead>
      <tbody>${body}</tbody></table>
      ${pager(payload.meta, (p) => {
        f.page = p;
        renderAppointments();
      })}
    </div>`;
    bindPager(document.getElementById('apt-results'), (p) => {
      f.page = p;
      renderAppointments();
    });
  };

  document.getElementById('apt-filters').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    appointmentFilters = {
      businessId: (form.get('businessId') || '').trim(),
      status: form.get('status') || '',
      from: form.get('from') ? `${form.get('from')}T00:00:00Z` : '',
      to: form.get('to') ? `${form.get('to')}T23:59:59Z` : '',
      page: 1,
    };
    renderAppointments();
  });

  await draw();
}

// ── Router ─────────────────────────────────────────────────────────────
function route() {
  if (!state.token) return showLogin();
  if (!state.me) {
    // Re-fetch profile so role checks survive page reloads.
    api('/auth/me')
      .then((me) => {
        state.me = me;
        requireAdmin() ? route() : null;
      })
      .catch(() => {});
    return;
  }
  const hash = location.hash.replace('#/', '') || 'reviews';
  if (hash === 'users') renderUsers();
  else if (hash === 'businesses') renderBusinesses();
  else if (hash === 'appointments') renderAppointments();
  else renderReviews();
}

window.addEventListener('hashchange', () => state.token && route());
document.getElementById('login-form').addEventListener('submit', login);
document.getElementById('logout-btn').addEventListener('click', () => logout());

if (state.token) {
  api('/auth/me')
    .then((me) => {
      state.me = me;
      if (requireAdmin()) showApp();
    })
    .catch(() => {});
} else {
  showLogin();
}
