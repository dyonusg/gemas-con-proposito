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
- Phase-1 prototype state lives in `src/lib/store.ts` (localStorage, single device); move to Lovable Cloud when multi-device sharing (pairs, teacher, campus lead) is needed.
- Lesson content (24 lessons, 6 prayers) lives in the `lecciones`/`oraciones` tables, loaded from the owner's spreadsheet; full Ruhí stories stay linked (`historia_url`), not reproduced, because rights are not cleared.
- Profile, path progress, notes, cards and survey have Cloud tables (owner-scoped RLS; mentor/compañero/responsable read via `profiles.mentor_id`/`companero_id` and `user_roles`); `src/lib/store.ts` stays the source of truth; `src/lib/nube.ts` syncs profile and path to Cloud only when the user optionally signs in at /guardar.
- Path logic (next step, counts) lives in `src/lib/camino.ts` with tests beside it.
- Both roles reuse the lesson-linked reflections editor and store; mentor reflections never update path progress.
- The shared shell exposes logout and listens for auth changes so every screen retains optional account access.
