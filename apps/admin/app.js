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

// Billing plan statuses (TRIAL/ACTIVE/GRACE/SUSPENDED) reuse the badge palette.
function planBadge(planStatus) {
  const cls =
    planStatus === 'ACTIVE'
      ? 'success'
      : planStatus === 'SUSPENDED'
        ? 'danger'
        : planStatus === 'TRIAL'
          ? 'dark'
          : ''; // GRACE -> neutral
  return `<span class="badge ${cls}">${esc(String(planStatus).toUpperCase())}</span>`;
}
function fmtDate(value) {
  return value ? esc(String(value).slice(0, 10)) : '—';
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

// ── Billing / Subscriptions ─────────────────────────────────────────────
let billingFilters = { planStatus: '', page: 1 };
async function renderBilling() {
  setNav('billing');
  const f = billingFilters;
  view().innerHTML = `
    <div class="section-label">B2B SUBSCRIPTIONS</div><h1 class="headline">Salon billing</h1>
    <form class="toolbar" id="billing-filters">
      <label class="field">Plan status<select name="planStatus">
        <option value="">(any)</option>
        ${['TRIAL', 'ACTIVE', 'GRACE', 'SUSPENDED'].map((s) => `<option ${f.planStatus === s ? 'selected' : ''}>${s}</option>`).join('')}
      </select></label>
      <button class="primary" type="submit">Filter</button>
    </form>
    <div id="billing-results"><div class="empty">Loading…</div></div>`;

  document.getElementById('billing-filters').addEventListener('submit', (event) => {
    event.preventDefault();
    billingFilters = {
      planStatus: new FormData(event.target).get('planStatus') || '',
      page: 1,
    };
    renderBilling();
  });

  const params = new URLSearchParams();
  if (f.planStatus) params.set('planStatus', f.planStatus);
  params.set('page', String(f.page || 1));
  params.set('limit', '20');

  let payload;
  try {
    payload = await api(`/admin/subscriptions?${params.toString()}`);
  } catch (error) {
    document.getElementById('billing-results').innerHTML =
      `<div class="error">${esc(error.message)}</div>`;
    return;
  }

  const rows = payload.data
    .map((biz) => {
      const sub = biz.subscription;
      const plan = sub ? sub.planStatus : 'none';
      const planDate = sub
        ? sub.planStatus === 'TRIAL'
          ? sub.trialEndsAt
          : sub.planStatus === 'GRACE'
            ? sub.graceEndsAt
            : sub.currentPeriodEnd
        : null;
      return `<tr>
        <td>${esc(biz.name)}<div class="muted">${esc(biz.slug)}</div></td>
        <td>${sub ? planBadge(plan) : '<span class="muted">no subscription</span>'}</td>
        <td>${sub ? `<div class="muted">${sub.planStatus === 'TRIAL' ? 'trial ends' : sub.planStatus === 'GRACE' ? 'grace ends' : 'period end'} ${fmtDate(planDate)}</div>` : '<span class="muted">—</span>'}</td>
        <td class="muted">${fmtDate(biz.createdAt)}</td>
        <td>
          ${sub ? `<button class="outline small" data-action="transition" data-id="${esc(biz.id)}" data-plan="${esc(plan)}">Plan</button>
          <button class="outline small" data-action="invoice" data-id="${esc(biz.id)}">Invoice</button>
          ${sub.planStatus !== 'ACTIVE' ? `<button class="approve small" data-action="markpaid" data-id="${esc(biz.id)}">Mark paid</button>` : ''}` : ''}
        </td>
      </tr>`;
    })
    .join('');

  document.getElementById('billing-results').innerHTML = `<div class="card">
    <table><thead><tr><th>Salon</th><th>Plan</th><th>Billing date</th><th>Joined</th><th>Actions</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5" class="empty">No salons match.</td></tr>'}</tbody></table>
    ${pager(payload.meta, (p) => {
      billingFilters.page = p;
      renderBilling();
    })}
  </div>`;

  bindPager(document.getElementById('billing-results'), (p) => {
    billingFilters.page = p;
    renderBilling();
  });
  bindBillingActions(document.getElementById('billing-results'));
}

// Wire per-row billing actions to open the corresponding modal. The modal
// submits against the Phase 7a endpoints and reloads the view on success so the
// table reflects authoritative server state.
function bindBillingActions(container) {
  container.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const businessId = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === 'transition') openPlanModal(businessId, btn.dataset.plan);
      else if (action === 'invoice') openInvoiceModal(businessId);
      else if (action === 'markpaid') openMarkPaidModal();
    });
  });
}

// ── Billing action modals ──────────────────────────────────────────────
const BILLING_PLANS = ['TRIAL', 'ACTIVE', 'GRACE', 'SUSPENDED'];
const PAYMENT_METHODS = ['transfer', 'cmi', 'mobile_money', 'cash', 'manual'];

function modalFieldError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message || '';
}

// Generic modal controller: builds the dialog, wires close/submit, runs the
// provided onSubmit (which returns the request body or null on invalid input).
function openModal({ title, bodyHtml, submitLabel = 'Save', onSubmit }) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="section-label">${esc(title)}</div>
    <form id="modal-form">${bodyHtml}
      <div class="error" id="modal-error"></div>
      <div class="modal-actions">
        <button type="button" class="outline" id="modal-cancel">Cancel</button>
        <button type="submit" class="primary">${esc(submitLabel)}</button>
      </div>
    </form>
  </div>`;
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.body.appendChild(overlay);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    modalFieldError('modal-error', '');
    const submitBtn = overlay.querySelector('button[type="submit"]');
    let body;
    try {
      body = onSubmit(new FormData(event.target));
    } catch (validationError) {
      modalFieldError('modal-error', String(validationError.message || validationError));
      return;
    }
    if (body === null || body === undefined) return; // onSubmit signalled abort
    submitBtn.disabled = true;
    try {
      await body.request;
      closeModal();
      renderBilling();
    } catch (error) {
      submitBtn.disabled = false;
      modalFieldError('modal-error', String(error.message || error).replace(/^Error:\s*/, ''));
    }
  });
  const firstInput = overlay.querySelector('input, select');
  if (firstInput) firstInput.focus();
}

function closeModal() {
  const existing = document.getElementById('modal-overlay');
  if (existing) existing.remove();
}

function openPlanModal(businessId, current) {
  openModal({
    title: 'Transition plan',
    submitLabel: 'Save plan',
    bodyHtml: `
      <label class="field">Plan status<select name="planStatus" id="modal-plan-status">
        ${BILLING_PLANS.map((s) => `<option ${current === s ? 'selected' : ''}>${s}</option>`).join('')}
      </select></label>
      <label class="field" id="modal-period-field" hidden>Period end
        <input type="date" name="currentPeriodEnd" value="${defaultDate(30)}" />
      </label>
      <div class="muted">ACTIVE sets a paid period; other statuses hide/lock the salon per policy.</div>`,
    onSubmit: (form) => {
      const planStatus = form.get('planStatus');
      const body = { planStatus };
      if (planStatus === 'ACTIVE') {
        const periodEnd = form.get('currentPeriodEnd');
        if (!periodEnd) throw new Error('Period end is required for ACTIVE');
        body.currentPeriodEnd = toIsoDate(periodEnd);
      }
      return { request: api(`/admin/subscriptions/${businessId}`, { method: 'PATCH', body: JSON.stringify(body) }) };
    },
  });
  // Toggle the period-end field only for ACTIVE.
  document.getElementById('modal-plan-status').addEventListener('change', (e) => {
    document.getElementById('modal-period-field').hidden = e.target.value !== 'ACTIVE';
  });
  document.getElementById('modal-period-field').hidden =
    document.getElementById('modal-plan-status').value !== 'ACTIVE';
}

function openInvoiceModal(businessId) {
  openModal({
    title: 'Create invoice',
    submitLabel: 'Create',
    bodyHtml: `
      <label class="field">Amount<input name="amount" inputmode="decimal" placeholder="300.00" required /></label>
      <label class="field">Currency<select name="currency">
        <option>MAD</option><option>TND</option>
      </select></label>
      <label class="field">Period start<input type="date" name="periodStart" value="${defaultDate(0)}" required /></label>
      <label class="field">Period end<input type="date" name="periodEnd" value="${defaultDate(30)}" required /></label>`,
    onSubmit: (form) => {
      const amount = parseFloat(form.get('amount'));
      if (!Number.isFinite(amount) || amount < 0) throw new Error('Enter a valid amount');
      const body = {
        amountCents: Math.round(amount * 100),
        currency: String(form.get('currency')).toUpperCase(),
        periodStart: toIsoDate(form.get('periodStart')),
        periodEnd: toIsoDate(form.get('periodEnd')),
      };
      return { request: api(`/admin/subscriptions/${businessId}/invoices`, { method: 'POST', body: JSON.stringify(body) }) };
    },
  });
}

function openMarkPaidModal() {
  openModal({
    title: 'Mark invoice paid',
    submitLabel: 'Mark paid',
    bodyHtml: `
      <label class="field">Invoice ID<input name="invoiceId" placeholder="cuid…" required /></label>
      <label class="field">Method<select name="method">
        ${PAYMENT_METHODS.map((m) => `<option>${m}</option>`).join('')}
      </select></label>
      <label class="field">External reference (optional)<input name="reference" placeholder="transfer ref / txn id" /></label>
      <div class="muted">Marks the invoice paid and reactivates the salon.</div>`,
    onSubmit: (form) => {
      const invoiceId = String(form.get('invoiceId') || '').trim();
      if (!invoiceId) throw new Error('Invoice ID is required');
      const reference = String(form.get('reference') || '').trim();
      const body = { method: String(form.get('method')), ...(reference ? { reference } : {}) };
      return { request: api(`/admin/invoices/${invoiceId}/mark-paid`, { method: 'POST', body: JSON.stringify(body) }) };
    },
  });
}

function defaultDate(addDays) {
  const d = new Date();
  d.setDate(d.getDate() + addDays);
  return d.toISOString().slice(0, 10);
}
function toIsoDate(ymd) {
  return `${String(ymd).trim().slice(0, 10)}T00:00:00.000Z`;
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
  else if (hash === 'billing') renderBilling();
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
