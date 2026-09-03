# CLAUDE.md

@AGENTS.md

Todo lo vinculante — qué es el repo, su relación con la app móvil, skills a
usar (`supabase`, `supabase-postgres-best-practices`, `superpowers`,
`ponytail`), reglas de base de datos, convenciones de commit y de
`docs/CHANGELOG.md` — está en `AGENTS.md`, importado arriba. David Álvarez y
Sebastián Cortez corren los mismos skills en OpenCode y Antigravity, así que
`AGENTS.md` es el único lugar donde eso se escribe. Lo que sigue es lo
genuinamente específico de Claude Code.

## Verificar UI

Para un cambio de UI, antes de darlo por terminado: `pnpm dev` (si ya hay un
servidor en el 3000, usarlo — no levantar otro) y recorrer el flujo con las
tools `claude-in-chrome` (`navigate`, `computer` screenshot, `resize_window`
a ~400px para móvil, `read_console_messages` con `onlyErrors`). Cerrar la
pestaña al terminar.

## Supabase por MCP

- Explorar el esquema real con `mcp__supabase__list_tables` /
  `mcp__supabase__execute_sql` (solo lectura) antes de asumir columnas —
  `~/Sites/app-rurales/supabase/schema.sql` es la referencia escrita, pero
  la base viva manda.
- Aplicar migraciones con `mcp__supabase__apply_migration`, nunca pegando
  SQL en el dashboard. Después, actualizar a mano `schema.sql`,
  `DATA-MODEL.md` y `CHANGELOG.md` **en el repo de la app móvil**, como
  dice `AGENTS.md`.
- Los tipos TypeScript del esquema se generan con
  `mcp__supabase__generate_typescript_types` cuando el dashboard los
  necesite — no escribirlos a mano.

## Repo hermano

La app móvil está en `~/Sites/app-rurales`. Se puede leer y copiar assets
desde ahí (íconos, ilustraciones, tokens), pero un cambio que afecte a la
app se hace en ese repo, en su propia sesión — no desde aquí.
