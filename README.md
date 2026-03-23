# Wikigraph3D

<p align="center">
    <a href="https://github.com/marsponce/wikigraph3D/" target="_blank">
        <img src="./public/wikigraph3d.svg" alt="Wikigraph3D Logo" width="120" />
    </a>
</p>
<p align="center">
    A 3D graph connecting Wikipedia articles by their hyperlinks.
</p>
<div align="center">


<!-- https://github.com/user-attachments/assets/8540bbf1-09ff-4e24-b5a0-f0f165160b62 -->
![wikigraph3d](https://github.com/user-attachments/assets/2ebcd44c-5e00-4ff1-921c-42d6c9dd6bca)



[![Netlify Status](https://api.netlify.com/api/v1/badges/c6c521be-c5c7-41f6-bfd4-b52ecfcebcfd/deploy-status)](https://app.netlify.com/projects/wikigraph3d/deploys)
[![.github/workflows/release-please.yml](https://github.com/marsponce/wikigraph3D/actions/workflows/release-please.yml/badge.svg)](https://github.com/marsponce/wikigraph3D/actions/workflows/release-please.yml)

</div>




## Tech Stack

- [Next.js](https://nextjs.org) — Framework
- [THREE.js](https://threejs.org), [react-force-graph](https://github.com/vasturiano/react-force-graph) — 3D Graph Rendering
- [Supabase](https://supabase.com) — Database
- [Wikimedia API](https://api.wikimedia.org/wiki/Main_Page) — Wikipedia Article Fetching

---


## Project Status

See the [project board](https://github.com/users/marsponce/projects/12) for active development tickets.

<details>
<summary><h2>Development</h2></summary>

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Prerequisites

A [Supabase](https://supabase.com) database is required with the following schema:

#### `nodes` Table

| Column       | Type                       | Constraints                   | Default                    |
| ------------ | -------------------------- | ----------------------------- | -------------------------- |
| `id`         | `bigint`                   | PRIMARY KEY, UNIQUE, NOT NULL | -                          |
| `name`       | `text`                     | NOT NULL                      | -                          |
| `created_at` | `timestamp with time zone` | NOT NULL                      | `now() AT TIME ZONE 'utc'` |
| `thumbnail`  | `json`                     | NULL                          | -                          |
| `content`    | `json`                     | NULL                          | -                          |

#### `links` Table

| Column       | Type                       | Constraints                                                         | Default                    |
| ------------ | -------------------------- | ------------------------------------------------------------------- | -------------------------- |
| `id`         | `bigint`                   | PRIMARY KEY, NOT NULL, IDENTITY                                     | Generated                  |
| `source`     | `bigint`                   | NULL, FOREIGN KEY → `nodes(id)` ON UPDATE CASCADE ON DELETE CASCADE | -                          |
| `target`     | `bigint`                   | NULL, FOREIGN KEY → `nodes(id)` ON UPDATE CASCADE ON DELETE CASCADE | -                          |
| `created_at` | `timestamp with time zone` | NOT NULL                                                            | `now() AT TIME ZONE 'utc'` |

See `.env.example` for the required environment variables.

### Run Locally

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open [http://localhost:3000](http://localhost:3000) in your browser
</details>

---

<p align="center">
    built by: Mars Ponce
</p>
