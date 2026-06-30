"""Smoke test for Identity + Event + Audit engines (CE-1).

Run from backend/ after migration 003 and seed 004:

    .\\.venv\\Scripts\\python.exe -m scripts.identity_smoke_test
"""

from __future__ import annotations

from datetime import date

from app.core.audit import AuditEngine
from app.core.events import EventEngine
from app.core.identity import IdentityEngine
from app.db.session import SessionLocal


def main() -> None:
    identity = IdentityEngine()
    events = EventEngine(AuditEngine())

    with SessionLocal() as session:
        with session.begin():
            master_code = identity.assign_master_code(session, "resource")
            operation_code = identity.assign_operation_code(
                session,
                prefix="DIS",
                operation_date=date(2026, 7, 1),
            )

            events.emit_operational_code_generated(
                session,
                entity_type="resource",
                internal_code=master_code,
                prefix="BREW-RES",
                format_type="master",
            )

        print(f"Master code:     {master_code}")
        print(f"Operation code:  {operation_code}")


if __name__ == "__main__":
    main()
