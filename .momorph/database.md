# SAA 2025 — Database Schema

## Overview

The database is hosted on **Supabase** (PostgreSQL 17). Authentication is handled by **Supabase Auth** (`auth.users`). Application data lives in the `public` schema with **Row Level Security (RLS)** enabled on every table.

---

## Files

| File                                                 | Purpose                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| `supabase/migrations/20260310000000_init_schema.sql` | Full schema DDL — tables, triggers, views, indexes, RLS       |
| `supabase/seeds/common/01_master_data.sql`           | Seed data: departments, hashtags, badges, app_config defaults |

---

## Entity Relationship Diagram

```
auth.users (Supabase built-in)
    │  id (UUID)
    │
    ▼ (1:1, trigger auto-creates)
profiles
    │  id → auth.users.id
    │  department_id → departments.id
    │
    ├──────────────────────────────────────────────────────────────┐
    │                                                              │
    ▼ (sender)                 ▼ (recipient)                      │
kudos ◄───────────────────────────────────────────────            │
    │  sender_id    → profiles.id  (nullable when anonymous)      │
    │  recipient_id → profiles.id                                  │
    │                                                              │
    ├──► kudo_hashtags ◄──── hashtags                             │
    ├──► kudo_images                                               │
    └──► kudo_likes ◄──────────────────────── profiles ◄──────────┘
                                                    │
                                                    ▼
                                        user_secret_boxes
                                            │  badge_id → badges.id
                                            │
                                            ▼
                                          badges
```

---

## Table Reference

### `profiles`

Extends `auth.users`; auto-created by trigger on Google OAuth sign-up.

| Column          | Type          | Constraints                | Notes                                    |
| --------------- | ------------- | -------------------------- | ---------------------------------------- |
| `id`            | `uuid`        | PK, FK → `auth.users(id)`  | Matches Supabase auth user ID            |
| `full_name`     | `text`        | —                          | From Google account `full_name` metadata |
| `email`         | `text`        | NOT NULL, UNIQUE           | Supabase auth email                      |
| `avatar_url`    | `text`        | —                          | Google profile picture URL               |
| `department_id` | `uuid`        | FK → `departments(id)`     | Set manually / by admin                  |
| `role`          | `user_role`   | NOT NULL, default `'user'` | `'user'` or `'admin'`                    |
| `created_at`    | `timestamptz` | NOT NULL                   | Auto                                     |
| `updated_at`    | `timestamptz` | NOT NULL                   | Auto via trigger                         |

**RLS:** Public read. Owner can update own row. Admins can update any row.

---

### `departments`

Department / team list. Source: Figma "Dropdown Phòng ban" (50 departments).

| Column       | Type          | Constraints      | Notes                   |
| ------------ | ------------- | ---------------- | ----------------------- |
| `id`         | `uuid`        | PK               |                         |
| `name`       | `text`        | NOT NULL, UNIQUE | Short code e.g. `CEVC2` |
| `created_at` | `timestamptz` | NOT NULL         |                         |

**RLS:** Public read. Admin-only write.

---

### `hashtags`

Predefined hashtag list. Source: Figma "Dropdown list hashtag" (13 tags).

| Column       | Type          | Constraints      | Notes                                |
| ------------ | ------------- | ---------------- | ------------------------------------ |
| `id`         | `uuid`        | PK               |                                      |
| `name`       | `text`        | NOT NULL, UNIQUE | Without `#` prefix, e.g. `Toàn diện` |
| `created_at` | `timestamptz` | NOT NULL         |                                      |

**RLS:** Public read. Admin-only write.

**Seeded values:**
`Toàn diện`, `Giỏi chuyên môn`, `Hiệu suất cao`, `Truyền cảm hứng`, `Cống hiến`,
`Aim High`, `Be Agile`, `Wasshoi`, `Hướng mục tiêu`, `Hướng khách hàng`,
`Chuẩn quy trình`, `Giải pháp sáng tạo`, `Quản lý xuất sắc`

---

### `kudos`

The core entity — appreciation messages sent between employees.

| Column           | Type          | Constraints                         | Notes                                         |
| ---------------- | ------------- | ----------------------------------- | --------------------------------------------- |
| `id`             | `uuid`        | PK                                  |                                               |
| `sender_id`      | `uuid`        | FK → `profiles(id)`, nullable       | `NULL` when `is_anonymous = true`             |
| `recipient_id`   | `uuid`        | FK → `profiles(id)`, NOT NULL       |                                               |
| `content`        | `text`        | NOT NULL, non-empty                 | Rich-text HTML/markdown; supports `@mentions` |
| `is_anonymous`   | `boolean`     | NOT NULL, default `false`           | Hides sender identity from public             |
| `anonymous_name` | `text`        | required when `is_anonymous = true` | Custom name displayed on the card             |
| `created_at`     | `timestamptz` | NOT NULL                            |                                               |
| `updated_at`     | `timestamptz` | NOT NULL                            | Auto via trigger                              |

**Business rules:**

- `is_anonymous = true` → `sender_id` must be `NULL`; `anonymous_name` must be set
- `is_anonymous = false` → `sender_id` must match `auth.uid()`

**RLS:** Public read. Authenticated insert (sender must be self or anonymous). Owner/admin update & delete.

---

### `kudo_hashtags`

Junction table — 1 to 5 hashtags per kudo.

| Column       | Type   | Constraints                  |
| ------------ | ------ | ---------------------------- |
| `kudo_id`    | `uuid` | PK part, FK → `kudos(id)`    |
| `hashtag_id` | `uuid` | PK part, FK → `hashtags(id)` |

> Application layer enforces 1–5 hashtags. Validation: required ≥ 1, max 5.

---

### `kudo_images`

Up to 5 attached images per kudo stored in Supabase Storage.

| Column        | Type          | Constraints                | Notes                       |
| ------------- | ------------- | -------------------------- | --------------------------- |
| `id`          | `uuid`        | PK                         |                             |
| `kudo_id`     | `uuid`        | FK → `kudos(id)`, NOT NULL |                             |
| `url`         | `text`        | NOT NULL                   | Supabase Storage public URL |
| `order_index` | `smallint`    | NOT NULL, ≥ 0              | Display order               |
| `created_at`  | `timestamptz` | NOT NULL                   |                             |

**Trigger:** `enforce_kudo_image_limit` — raises exception if `count ≥ 5` before insert.

---

### `kudo_likes`

Heart/like reactions — one like per user per kudo (toggle via insert/delete).

| Column       | Type          | Constraints                  |
| ------------ | ------------- | ---------------------------- |
| `kudo_id`    | `uuid`        | PK part, FK → `kudos(id)`    |
| `user_id`    | `uuid`        | PK part, FK → `profiles(id)` |
| `created_at` | `timestamptz` | NOT NULL                     |

**RLS:** Public read. Authenticated users manage their own likes only.

---

### `badges`

Collectible badges obtainable from Secret Boxes.

| Column        | Type           | Constraints      | Notes                                  |
| ------------- | -------------- | ---------------- | -------------------------------------- |
| `id`          | `uuid`         | PK               |                                        |
| `name`        | `text`         | NOT NULL, UNIQUE |                                        |
| `description` | `text`         | —                |                                        |
| `image_url`   | `text`         | —                |                                        |
| `drop_rate`   | `numeric(5,4)` | 0 < rate ≤ 1     | Probability; all rates must sum to 1.0 |
| `created_at`  | `timestamptz`  | NOT NULL         |                                        |

**Seeded values and drop rates:**

| Badge               | Drop Rate |
| ------------------- | --------- |
| Stay Gold           | 30%       |
| Touch of Light      | 20%       |
| Flow to Horizon     | 25%       |
| Revival             | 10%       |
| Beyond the Boundary | 10%       |
| Root Further        | 5%        |

---

### `user_secret_boxes`

Secret boxes awarded to users; each grants one random badge when opened.

| Column       | Type          | Constraints                   | Notes                                  |
| ------------ | ------------- | ----------------------------- | -------------------------------------- |
| `id`         | `uuid`        | PK                            |                                        |
| `user_id`    | `uuid`        | FK → `profiles(id)`, NOT NULL |                                        |
| `is_opened`  | `boolean`     | NOT NULL, default `false`     |                                        |
| `opened_at`  | `timestamptz` | nullable                      | Set when opened                        |
| `badge_id`   | `uuid`        | FK → `badges(id)`, nullable   | Set to randomly selected badge on open |
| `created_at` | `timestamptz` | NOT NULL                      |                                        |

**Consistency constraint:** Either all of `is_opened=false`, `opened_at=NULL`, `badge_id=NULL` — or all of `is_opened=true`, `opened_at≠NULL`, `badge_id≠NULL`.

**RLS:** Users can read and update their own boxes. Admins have full access.

---

### `app_config`

Key-value table for runtime configuration. Admin-managed.

| Column       | Type          | Constraints | Notes                          |
| ------------ | ------------- | ----------- | ------------------------------ |
| `key`        | `text`        | PK          |                                |
| `value`      | `text`        | NOT NULL    | String; ISO-8601 for datetimes |
| `note`       | `text`        | —           | Human description              |
| `updated_at` | `timestamptz` | NOT NULL    |                                |

**Seeded keys:**

| Key                    | Default Value                 | Usage                              |
| ---------------------- | ----------------------------- | ---------------------------------- |
| `event_start_datetime` | `2025-12-01T18:30:00+07:00`   | Countdown target; ISO-8601         |
| `event_venue`          | `Nhà hát nghệ thuật quân đội` | Displayed on home hero             |
| `event_time_display`   | `18h30`                       | Human-readable time on hero        |
| `kudos_enabled`        | `true`                        | Master switch for kudo submissions |

---

## Views

### `kudos_with_stats`

Kudos joined with aggregated like counts. Use for the feed, highlight carousel, and sorting.

```sql
select * from kudos_with_stats
order by like_count desc
limit 5;  -- top 5 for HIGHLIGHT KUDOS carousel
```

### `user_stats`

Per-user aggregated statistics needed by the sidebar.

```sql
select * from user_stats where user_id = auth.uid();
-- Returns: kudos_sent, kudos_received, likes_received, secret_boxes_pending
```

---

## Supabase Auth Integration

| Mechanism     | Detail                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------- |
| Provider      | Google OAuth 2.0 via Supabase                                                            |
| Trigger       | `on_auth_user_created` → auto-inserts into `public.profiles`                             |
| Metadata used | `raw_user_meta_data.full_name`, `raw_user_meta_data.avatar_url`, `email`                 |
| Session       | Managed by `@supabase/ssr` cookies (`HttpOnly`, `Secure`, `SameSite=Lax`)                |
| Auth client   | `src/libs/supabase/server.ts` for server-side; `src/libs/supabase/client.ts` for browser |

---

## Security Notes

- **RLS is enabled on every table.** Never disable it.
- Never `select('*')` — always specify required columns to limit data exposure.
- `sender_id` is `NULL` for anonymous kudos so the author's identity is never stored publicly in the kudos row. The server-side RLS insert policy still validates `auth.uid()` to prevent unauthenticated submissions.
- `profiles.role` is enforced server-side via RLS policies. Never trust a client-supplied role value.
- Secret box opening logic (random badge selection based on `drop_rate`) must be implemented as a Postgres function or a server-side Route Handler — never in client-side code.
