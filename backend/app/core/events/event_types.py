"""Domain event type catalog (Event Engine CE-1)."""

from __future__ import annotations

from enum import StrEnum


class EventType(StrEnum):
    ResourceCreated = "ResourceCreated"
    ResourceUpdated = "ResourceUpdated"
    ResourceArchived = "ResourceArchived"
    OperationalCodeGenerated = "OperationalCodeGenerated"


EVENT_ACTION_MAP: dict[EventType, str] = {
    EventType.ResourceCreated: "create",
    EventType.ResourceUpdated: "update",
    EventType.ResourceArchived: "archive",
    EventType.OperationalCodeGenerated: "code_generated",
}
