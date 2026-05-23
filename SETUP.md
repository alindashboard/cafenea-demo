# Brew & Bean — Setup & Deploy

Demo cafenea specialty fictivă din Bistrița. Construit din `alindashboard/site-template`.

---

## Cerințe

- Node.js 18+
- Cont Supabase (gratuit)
- Cont Resend (gratuit pentru 3000 emailuri/lună)
- Vercel CLI (`npm i -g vercel`) sau cont Vercel

---

## 1. Supabase — Setup bază de date

1. Creează un proiect nou pe [supabase.com](https://supabase.com)
2. Rulează **supabase/schema.sql** în SQL Editor (copiază tot conținutul)
3. Rulează **supabase/seed.sql** pentru datele fictive demo
4. Obține din **Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Storage buckets necesare

În Supabase → Storage, creează 2 bucket-uri **publice**:
- `items` — pentru pozele produselor de meniu
- `gallery` — pentru pozele galeriei locației

---

## 2. Resend — Email notificări

1. Creează cont pe [resend.com](https://resend.com)
2. Obține `RESEND_API_KEY`

---

## 3. Variabile de mediu

Creează fișierul `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Email (Resend)
RESEND_API_KEY=re_xxxx
ADMIN_EMAIL=hello@brewandbean.ro

# Admin panel password (schimbă asta!)
ADMIN_PASSWORD=parola-ta-sigura
```

---

## 4. Rulează local

```bash
npm install
npm run dev
```

Accesează [http://localhost:3000](http://localhost:3000)

Admin la: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 5. Deploy pe Vercel

```bash
# Prima dată
vercel

# Adaugă variabilele de mediu
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD

# Deploy producție
vercel --prod
```

URL producție: https://cafenea-demo.vercel.app

---

## 6. După deploy — Ce mai trebuie făcut

### Obligatoriu
- [ ] Înlocuiește pozele placeholder cu fotografii reale ale locației
- [ ] Adaugă poze pentru fiecare produs din meniu (din /admin/menu)
- [ ] Adaugă fotografii în galerie (din /admin/gallery)
- [ ] Actualizează URL-ul Google Maps cu coordonatele exacte
- [ ] Verifică și actualizează programul dacă e diferit
- [ ] Setează domeniul custom în Vercel și actualizează `SITE_CONFIG.url` în `lib/config.ts`
- [ ] Verifică domeniul în Resend pentru emailuri din adresa proprie (nu `onboarding@resend.dev`)

### Opțional
- [ ] Adaugă logo SVG personalizat în `/public/logo.svg`
- [ ] Conectează Google Analytics sau Plausible
- [ ] Creează QR code fizic pentru meniu (link: `https://cafenea-demo.vercel.app/meniu`)

---

## 7. Structura admin

- `/admin/dashboard` — Mesaje contact primite
- `/admin/menu` — Produse meniu (CRUD, poze, is_popular, alergeni, mărimi)
- `/admin/categories` — Categorii meniu (CRUD, reordonare, vizibilitate)
- `/admin/gallery` — Galerie locație (upload, reordonare, ștergere)

---

## 8. TODO — Feature-uri Premium (viitor)

Comentate cu `// TODO: PREMIUM FEATURE` în codebase:

- **Loyalty system** — puncte per comandă, rewards (cafea gratuită)
- **Comandă online + QR** — selectare produse → plată → QR ridicare la bar
- **Rezervare masă online** — sistemul de rezervări există în DB (`reservations` table), dezactivat din config

---

## Stack tehnic

- **Next.js 16** (App Router, Turbopack)
- **Supabase** (PostgreSQL + Storage + Auth)
- **Tailwind CSS 4**
- **shadcn/ui**
- **Resend** (emailuri tranzacționale)
- **Vercel** (hosting)
