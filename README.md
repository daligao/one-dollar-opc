# The $1 OPC Experiment

A tiny public landing page documenting what happened after buying a ~$1 domain.

**OPC** = One-Person Company

> One Person. One Laptop. One Dollar Domain.

## What is this?

One page. One story. Everything points back to [Ordinary Man Trying](https://ordinarymantrying.com/).

## Architecture

```
index.html
```

No framework. No npm. No build step. No database.

## Hosting

**Cloudflare Pages** — connected directly to this repository.

## Custom Domain

`one-dollar.ordinarymantrying.com`

DNS is configured manually in Cloudflare dashboard after connecting the repo to Cloudflare Pages.

## Cloudflare Pages Build Settings

| Setting | Value |
|---|---|
| Build command | *(leave empty)* |
| Build output directory | `/` |
| Root directory | `/` |

## Links

- Main blog: [ordinarymantrying.com](https://ordinarymantrying.com/)
- The $1 website: [chinesefortunetools.online](https://chinesefortunetools.online/)
- Experiment dashboard: [chinesefortunetools.online/dashboard/](https://chinesefortunetools.online/dashboard/)

## Important

This repository contains **only** the public landing page.

The private `one-person-site-starter` source is **not** part of this repository
and is not referenced here.
