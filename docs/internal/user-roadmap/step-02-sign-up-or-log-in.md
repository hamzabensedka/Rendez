# Step 02 — Sign up or log in

## What you’ll do
Sign in (or create an account) **only when you’re ready to book** and to access account-only areas (like **Bookings** and **Profile**). You can browse **Explore** without an account.

## Where you are in the app
Authentication screens (`Login` / `Register`)

## Step-by-step
1. Browse as a guest:
   1. Open the **Explore** tab and browse businesses and services.
   2. When you decide you want to book, start the booking flow by selecting a service (Step 06).
2. When the app asks you to authenticate (to book / view **Bookings** / open **Profile**):
   1. On **Welcome Back**, enter your **Email** and **Password**.
   2. Tap **Sign In**.
3. If you don’t have an account yet:
   1. Tap **Sign Up**.
   2. Enter **Full Name**, **Email**, and **Password**.
   3. Tap **Sign Up**.
4. After a successful sign-in/sign-up, continue your booking (or open **Bookings** / **Profile**).

## What to expect
- Successful sign-in routes you into the app and shows the bottom tabs.
- If your credentials are wrong, you’ll see a **Login Failed** alert.
- If registration fails (for example, email already used), you’ll see a **Registration Failed** alert.
- You can browse **Explore** without an account, but you’ll be asked to sign in when you want to **book** or view **Bookings/Profile**.

## Common variations
- **Build behavior**: If you’re redirected to sign-in before you can browse, that build does not support guest browsing yet.
- **Local/demo setups**: If you’re running the project locally with seeded data, `SETUP.md` includes test accounts (for example, `client@planity.com` / `client123`).
- **Password rules**: Registration requires at least 8 characters in the current UI.

## Troubleshooting
- **“Invalid credentials”**: Re-check email/password and try again.
- **“Please fill in all fields”**: Ensure both email and password are entered before tapping **Sign In**.
- **Registration password too short**: Password must be at least 8 characters in the current UI.
- **You signed in but don’t see the tabs**: Close and reopen the app; if it persists, sign out and sign in again.


