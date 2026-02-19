import { db } from "."

export function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS shares (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      token       TEXT    NOT NULL UNIQUE,
      label       TEXT    NOT NULL,
      expires_at  TEXT    NOT NULL,
      revoked     INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS logs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      share_id    INTEGER NOT NULL REFERENCES shares(id),
      action      TEXT    NOT NULL,
      path        TEXT    NOT NULL
    );
  `)

  console.log('Migrations: OK')
}