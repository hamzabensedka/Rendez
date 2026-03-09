# Closed Audit Decisions

Decisions and documentation that close remaining remediation items. Use with `04-engineering-review.md` and `06-remediation-status-report.md`.

---

## P0 — Security and data integrity

### Provider / admin onboarding

- **Decision:** Provider and admin onboarding is **out of scope** for the public registration API.
- **Current behavior:** Public `POST /auth/register` accepts only `email`, `name`, `password` and always creates `UserRole.CLIENT`. No `role` in DTO.
- **If needed later:** Use a privileged flow (e.g. admin-only endpoint, internal tool, or invite flow) to create provider/admin users. Do not add role to public registration.

### Refresh token

- **Current behavior:** Refresh tokens are validated by signature only (JWT verify). No server-side revocation or rotation store.
- **Documented:** Revocation/rotation is **future work**. For now, tokens are short-lived enough that signature-only validation is acceptable for the current product scope. If you add refresh-token revocation or rotation, document the design in `docs/` and add tests.

### Provider / business ownership constraints (schema)

- **Decision:** Schema constraints have been **reviewed** and match current product intent: one User → optional Provider → optional Business; Provider can link to one Business; Business has many Providers.
- **Revisit when:** Scaling to multi-business per provider or more complex ownership rules; add constraints or migrations as needed.

### Secret handling

- **If secrets were exposed:** Rotate the database password and JWT secrets immediately. Generate new values (e.g. `openssl rand -base64 32`), update `apps/api/.env` and deployment config, restart the API. Audit git history and any shared channels for leaked values; revoke and rotate any that were committed or shared.
- **Runbook:** Prefer a short runbook in your ops docs (e.g. SETUP.md or a dedicated SECRETS.md) with the above steps. No code change required for “audit history” unless you add automated secret scanning.

---

## P2 — Tests

### Mobile integration tests

- **Decision:** Marked **deferred / backlog**. Backend tests cover auth, appointments, and availability. Mobile integration tests (login, business→booking, bookings list) are optional and can be added when prioritizing quality or before release.

---

## P3 — Product

### Favorites: account-level

- **Decision:** Favorites are **device-local** (SecureStore). The “if account-level” item is **N/A** for the current product choice. If product later chooses account-level favorites, add backend persistence and sync; no change until then.

### Address / “Around Me”

- **Decision:** Current-location (“Around Me”) **affordance removed** from the address search screen until expo-location is integrated. Address search remains mock-backed; “Around Me” button removed so the UI does not imply working geolocation.
