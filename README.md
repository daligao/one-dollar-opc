# The $1 OPC Experiment

Public homepage and lightweight company dashboard for a one-person internet company.

**OPC** = One-Person Company

> One Person. One Laptop. One Dollar Domain.

---

## Site Structure

| URL | Purpose |
|---|---|
| `/` | Public company dashboard |
| `/manifesto/` | One-Person Internet Company Manifesto |
| `/contact/` | Say Hello |
| `/admin/` | Private founder console — not in public nav |

> Dashboard = what is happening now  
> Manifesto = what I believe  
> Contact = how to reach me  
> OrdinaryManTrying.com = the full story and build logs

---

## Contact

levantuann002@gmail.com

---

## Architecture

```
GitHub (daligao/one-dollar-opc)
↓ push
Cloudflare Pages
↓
one-dollar.ordinarymantrying.com

Public page
↓ GET /api/state
Cloudflare KV (binding: OPC_STATE, key: company_state)
↓ fallback: GET /data/company.json

Private /admin
↓ POST /api/admin/state (requires Cloudflare Access)
Cloudflare KV (binding: OPC_STATE, key: company_state)
```

---

## Files

```
index.html              Public landing page + dashboard
data/company.json       Fallback state (also documents data shape)
admin/index.html        Private founder console
functions/
  api/state.js          GET /api/state  → reads from KV
  api/admin/state.js    POST /api/admin/state → writes to KV
```

---

## GA4

Measurement ID: `G-Z0BP5M4XY6`

Property: `one-dollar.ordinarymantrying.com`

Events tracked: `visit_real_site`, `open_experiment_dashboard`, `read_omt`, `factory_interest`, `github_article_click`

---

## Cloudflare Pages — Build Settings

| Setting | Value |
|---|---|
| Build command | *(leave empty)* |
| Build output directory | `/` |
| Root directory | `/` |

---

## Cloudflare Manual Setup Required

### 1. Create KV Namespace

Cloudflare Dashboard → Workers & Pages → KV → Create namespace

Name it anything (e.g. `opc-state`).

### 2. Bind KV to Pages Project

Pages → `one-dollar-opc` → Settings → Functions → KV namespace bindings

| Variable name | KV namespace |
|---|---|
| `OPC_STATE` | `opc-state` (whichever you created) |

### 3. Configure Cloudflare Access

Dashboard → Zero Trust → Access → Applications → Add application

- Application type: **Self-hosted**
- Application domain: `one-dollar.ordinarymantrying.com`
- Path: `/admin/*`

Add a second rule for the API:

- Path: `/api/admin/*`

Policy: allow only your own email/identity.

> ⚠️ **Do not use the admin endpoint publicly until Cloudflare Access is configured.**
> Without Access, anyone can POST to `/api/admin/state` and overwrite company state.

### 4. Redeploy

After binding KV, trigger a new deployment in Pages to activate the binding.

---

## Updating Company State

1. Go to `one-dollar.ordinarymantrying.com/admin/`
2. Click **Load Current State**
3. Edit fields
4. Click **Save to KV**

Or POST directly:

```bash
curl -X POST https://one-dollar.ordinarymantrying.com/api/admin/state \
  -H "Content-Type: application/json" \
  -d '{"revenue": 1.00, "latest_milestone": "First $1 earned online"}'
```

---

## Links

- Blog: [ordinarymantrying.com](https://ordinarymantrying.com/)
- The $1 website: [chinesefortunetools.online](https://chinesefortunetools.online/)
- Experiment dashboard: [chinesefortunetools.online/dashboard/](https://chinesefortunetools.online/dashboard/)

---

## Important

This repo contains only the public landing page and dashboard.

The private `one-person-site-starter` source is **not** part of this repository.
