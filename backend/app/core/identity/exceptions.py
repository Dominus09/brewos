"""Identity Engine exceptions."""


class IdentityEngineError(Exception):
    """Base error for operational identity."""


class PrefixNotFoundError(IdentityEngineError):
    """No active prefix matches the lookup."""


class InactivePrefixError(IdentityEngineError):
    """Prefix exists but is not active."""


class UnsupportedFormatError(IdentityEngineError):
    """Prefix format_type is not supported by the generator."""
