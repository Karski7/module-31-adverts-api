# Module 31 - Adverts Backend

Backend part of the Kodilla fullstack workshop.

## What is included

- Mongoose models for users, adverts and sessions.
- Auth endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/user`
  - `DELETE /auth/logout`
- Advert endpoints:
  - `GET /api/ads`
  - `GET /api/ads/:id`
  - `GET /api/ads/search/:searchPhrase`
  - `POST /api/ads`
  - `PATCH /api/ads/:id`
  - `DELETE /api/ads/:id`
- Protected create/edit/delete actions.
- Author-only edit/delete protection.
- Multipart image upload with a 1 MB limit, image header validation and cleanup of invalid files.
- Static serving for `client/build` and `public/uploads`.
- CORS and session setup for local React development.

## Run

```bash
npm install
npm run serve
```

The API starts at `http://localhost:8000`. If `MONGODB_URI` is not provided, the project uses an in-memory MongoDB database for local testing.

Demo user:

```txt
login: demo
password: secret123
```

## Checks

```bash
npm run check
npm run smoke
```
