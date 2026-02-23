import { config } from "dotenv";
import { resolve } from "path";
import { readdirSync, readFileSync } from "fs";
import postgres from "postgres";

config({ path: resolve(process.cwd(), ".env") });

const isBaseline = process.argv.includes("--baseline");

async function main() {
  const url = process.env.POSTGRES_URL;
  if (!url) {
    console.error("ERROR: POSTGRES_URL environment variable is not set.");
    process.exit(1);
  }

  const sql = postgres(url, { ssl: "require", max: 1 });

  try {
    // Ensure the migrations tracking table exists
    await sql`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Read migration files sorted by name
    const migrationsDir = resolve(process.cwd(), "migrations");
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("No migration files found.");
      return;
    }

    // Get already-applied migrations
    const applied = await sql<{ filename: string }[]>`
      SELECT filename FROM schema_migrations
    `;
    const appliedSet = new Set(applied.map((r) => r.filename));

    const pending = files.filter((f) => !appliedSet.has(f));

    if (pending.length === 0) {
      console.log("No pending migrations.");
      return;
    }

    if (isBaseline) {
      // Mark all pending migrations as applied without running them
      for (const filename of pending) {
        await sql`
          INSERT INTO schema_migrations (filename) VALUES (${filename})
          ON CONFLICT (filename) DO NOTHING
        `;
        console.log(`[baseline] Marked as applied: ${filename}`);
      }
      console.log("Baseline complete.");
    } else {
      // Apply each pending migration in a transaction
      for (const filename of pending) {
        const filePath = resolve(migrationsDir, filename);
        const sqlContent = readFileSync(filePath, "utf-8");

        console.log(`Applying migration: ${filename}`);
        await sql.begin(async (tx) => {
          await tx.unsafe(sqlContent);
          await tx`
            INSERT INTO schema_migrations (filename) VALUES (${filename})
          `;
        });
        console.log(`Applied: ${filename}`);
      }
      console.log(`Done. ${pending.length} migration(s) applied.`);
    }
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
