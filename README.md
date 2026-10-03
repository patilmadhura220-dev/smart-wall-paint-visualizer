# Smart Wall Paint Visualizer — Runnable MVP

This is a working MVP of the PRD: register/login, upload a room photo, draw a
polygon around a wall, pick a colour, preview the paint (blended with the
original shading via canvas "multiply" compositing), save it to MongoDB, and
download the result.

Stack used here: **Node.js + Express + MongoDB** (backend, matches the PRD
exactly) and a **single-page HTML5 Canvas** frontend instead of a full Angular
scaffold, so you can run and test it immediately without needing the Angular
CLI toolchain set up. See "Upgrading to Angular" below if you want to migrate
the frontend later — the REST API is identical either way.

## Prerequisites
- Node.js 18+ and npm
- MongoDB running locally (or a free MongoDB Atlas connection string)

## 1. Backend setup

```bash
cd smart-wall-paint-visualizer/backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (local or Atlas) and a real JWT_SECRET
npm run seed      # loads a starter colour palette into MongoDB
npm start          # or: npm run dev (auto-restart with nodemon)
```

You should see:
```
MongoDB connected
Server running on http://localhost:5000
```

Test it's alive:
```bash
curl http://localhost:5000/api/health
```

## 2. Frontend

No build step needed — it's a single static HTML file that calls the API at
`http://localhost:5000/api`.

```bash
cd ../frontend
# any static server works, e.g.:
npx serve .
# or just open index.html directly in your browser
```

Open the URL it gives you (or the file directly), then:
1. Register an account (the modal pops up automatically).
2. Upload a room photo.
3. Click points around a wall to draw a polygon; click near the first point
   (or "Close shape") to finish it.
4. Pick a colour swatch and adjust opacity.
5. Click **Apply paint** to preview, then **Save project** or **Download**.

## API summary

| Method | Endpoint             | Auth  | Purpose                         |
|--------|-----------------------|-------|----------------------------------|
| POST   | /api/auth/register     | no    | Create account                  |
| POST   | /api/auth/login        | no    | Get JWT                         |
| GET    | /api/colors            | no    | List paint palette              |
| POST   | /api/colors            | admin | Add colour                      |
| PUT    | /api/colors/:id        | admin | Edit colour                     |
| DELETE | /api/colors/:id        | admin | Remove colour                   |
| GET    | /api/projects          | user  | List my saved room designs      |
| POST   | /api/projects          | user  | Save a new design                |
| PUT    | /api/projects/:id      | user  | Update a design (new trial)     |
| DELETE | /api/projects/:id      | user  | Delete a design                  |

To make a user an admin, update their document in Mongo directly for now:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## Upgrading to Angular later
The backend is a plain REST API, so nothing here needs to change. To move the
frontend to Angular 15+ as the PRD specifies:
```bash
npm install -g @angular/cli
ng new wall-paint-frontend --routing --style=scss
```
Then re-implement each concern from `index.html` as an Angular piece:
- `AuthService` (register/login, store JWT)
- `ColorService`, `ProjectService` (HttpClient wrappers around the same endpoints)
- A `WallSelectionComponent` wrapping the same `<canvas>` polygon logic
- Route guards (`AuthGuard`) reusing the JWT-check logic from `middleware/auth.js`'s frontend equivalent

## Notes / known simplifications (documented, not hidden)
- Images are stored as base64 strings in MongoDB for simplicity. For
  production, switch to storing files in S3/disk and keep only the URL in
  MongoDB (the `Project.originalImage` field already just expects a URL or
  base64 string, so this is a drop-in change).
- JWT is stored in `localStorage` on the frontend — fine for this MVP/demo,
  but for production prefer an httpOnly cookie.
- The colour palette only supports solid colours in this MVP; dual-tone walls
  and pattern/wallpaper support (`Pattern` model) can be added the same way
  the `Color` model was.
