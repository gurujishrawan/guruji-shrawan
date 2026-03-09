# Guruji Shrawan Website

This is a [Next.js](https://nextjs.org) App Router project.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication and personalization

The app supports both:

- **Admin auth** for `/admin` access.
- **User auth** for personalized user experiences (profile/dashboard flow).

### Required environment variables

Create a `.env.local` file in the project root with the following values:

```bash
# Secret used to sign session cookies. Use a long random value.
AUTH_SECRET="replace_with_a_long_random_secret"

# Public app URL used for callback redirects.
AUTH_URL="http://localhost:3000"

# Admin credentials.
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-me"
```

> In production, set `AUTH_URL` to your deployed domain.

### User auth flow

- New users can register at `/signup`.
- Existing users can sign in at `/signin`.
- Signed-in users can access `/profile` for a personalized experience.

User accounts are stored in `data/users.json` (local file storage in this project setup).

### Session/auth endpoints

- `/api/auth/session` → current session payload (`admin` or `user`).
- `/api/auth/signout` → clears current session.

### Route protection

- `/admin` requires an authenticated **admin** session.
- `/profile` requires any authenticated session (**admin** or **user**).

Unauthenticated users are redirected to `/signin` with a callback URL.

## Learn More

To learn more about Next.js, take a look at:

- [Next.js Documentation](https://nextjs.org/docs)
