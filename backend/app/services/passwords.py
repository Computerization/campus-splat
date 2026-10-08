"""Password hashing for the fixed administrator accounts.

Standard library only (the project ships no crypto dependency). Stored format:

    pbkdf2_sha256$<iterations>$<salt hex>$<hash hex>

Volunteer accounts still keep their password in plain text because the admin
console shows it back to whoever registered the account — see docs/deployment.md.
"""

from __future__ import annotations

import hashlib
import hmac
import secrets

ALGORITHM = "pbkdf2_sha256"
# ~60 ms per check on the target i5-12400F: enough to make guessing the three
# well-known default passwords pointless without slowing the login page down.
ITERATIONS = 200_000


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, ITERATIONS)
    return f"{ALGORITHM}${ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str | None) -> bool:
    if not stored:
        return False
    parts = stored.split("$")
    if len(parts) != 4 or parts[0] != ALGORITHM:
        return False
    try:
        iterations = int(parts[1])
        salt = bytes.fromhex(parts[2])
        expected = bytes.fromhex(parts[3])
    except ValueError:
        return False
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, iterations)
    return hmac.compare_digest(digest, expected)
