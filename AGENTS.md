<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- All lesson virtue pickers reuse `SelectorVirtud` and its short editorial purposes, so selection stays consistent across the path, gems, cards and mentor lessons.
- `/` is the public purpose-led home; account actions link to `/auth` or `/perfil` without automatic redirects, keeping the welcome accessible while private screens remain gated.
- `src/lib/store.ts` is an in-memory session view; `estados_usuario` persists owner-scoped state and legacy unscoped device state is never imported into accounts.
- Lesson content (24 lessons, 6 prayers) lives in the `lecciones`/`oraciones` tables, loaded from the owner's spreadsheet; full Ruhí stories stay linked (`historia_url`), not reproduced, because rights are not cleared.
- `src/lib/nube.ts` hydrates only the authenticated owner's Cloud state and serializes saves; linked mentors/companions read only authorized progress and shared notes, never the private snapshot.
- Path logic (next step, counts) lives in `src/lib/camino.ts` with tests beside it.
- Both roles reuse the lesson-linked reflections editor and store; mentor reflections never update path progress.
- Personal reflections and child observations share CRUD helpers in `src/lib/reflexiones.ts`; new entries require a virtue and ISO creation date, edits preserve creation dates, and child observations stay owner-private in the Cloud snapshot.
- `Acceso` owns the global auth subscription and logout teardown; the `_authenticated` layout validates the user and profile before rendering private screens.
- Email access uses the Cloud Auth OTP helpers in `src/lib/acceso-otp.ts` for both new and existing accounts; only verified sessions unlock access, avoiding custom credentials or OTP storage.
- Unique normalized aliases are enforced by a database index and trigger; duplicate legacy aliases must be reclaimed through the profile form.
- Mentor role requires a one-use code from codigos_mentor reserved for one email and redeemed via canjear_codigo_mentor (matches the JWT email); elegir_tipo refuses mentor otherwise; the responsable role is the admin who generates codes.
- Donations are anonymous Stripe embedded checkouts (one-time or monthly) built with price_data in EUR from src/utils/payments.functions.ts; the signed webhook at /api/public/payments/webhook records paid one-time sessions and every paid monthly invoice in donaciones (admin-only read). Purpose and amount rules live in src/lib/donacion.ts with tests.
