"""Database engine and sessions. SQLite to start, with column types kept generic
so it can move to PostgreSQL later.
"""

from __future__ import annotations

from collections.abc import Iterator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from . import config


class Base(DeclarativeBase):
    pass


engine = create_engine(
    f"sqlite:///{config.DB_PATH}",
    # FastAPI's thread pool reuses connections across threads
    connect_args={"check_same_thread": False},
    pool_pre_ping=True,
)


@event.listens_for(engine, "connect")
def _sqlite_pragmas(dbapi_connection, _record) -> None:
    """WAL + busy_timeout, so several volunteers uploading at once don't hit
    "database is locked".
    """
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA busy_timeout=15000")
    finally:
        cursor.close()


SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_db() -> Iterator[Session]:
    """FastAPI dependency: one session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Columns added after the first release. SQLite's ALTER TABLE ADD COLUMN is fast
# and doesn't lock the table, which is enough here; move to Alembic once we need
# to change types or add indexes.
_ADDED_COLUMNS: dict[str, dict[str, str]] = {
    "checkpoints": {
        "length_m": "FLOAT",
        "width_m": "FLOAT",
        "room_height_m": "FLOAT",
    },
}


def init_db() -> None:
    from . import models  # noqa: F401  imported to register the metadata

    config.ensure_dirs()
    Base.metadata.create_all(bind=engine)
    _add_missing_columns()


def _add_missing_columns() -> None:
    from sqlalchemy import text

    with engine.begin() as conn:
        for table, columns in _ADDED_COLUMNS.items():
            rows = conn.execute(text(f"PRAGMA table_info({table})")).fetchall()
            if not rows:
                continue  # table doesn't exist yet; create_all already added them
            existing = {row[1] for row in rows}
            for name, ddl in columns.items():
                if name in existing:
                    continue
                try:
                    # Another worker may have added it already when running with
                    # multiple processes; a savepoint keeps that from aborting
                    # the whole transaction.
                    with conn.begin_nested():
                        conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))
                except Exception:
                    continue
