# MemberEnrollment CFC — API Specification

Purpose
- Server-side ColdFusion method that handles the full new-member signup/enrollment flow for the PinPoint platform.

Endpoint
- Method: `MemberEnrollment`
- Base URL: `https://eport9.com/pinpoint/pinpointWSMobile/PinPointWSMobileVmcv.cfc`
- Required query params: `method=MemberEnrollment`, `AuthVerify=<TOKEN>` plus payload params (below).

Request parameters (client -> CFC)
- `first` (string) — required. First name.
- `last` (string) — required. Last name.
- `e_mail` (string) — required. Email address.
- `password` (string) — required. Plain password (server must hash).
- `phone` (string) — required. Phone number (sanitized digits accepted).
- `address` (string) — optional.
- `address2` (string) — optional.
- `city` (string) — optional.
- `state` (string) — optional (2-letter preferred).
- `zip` (string) — optional.
- `country` (string) — optional, defaults to `US`.
- `BD1_Month` (number) — optional, birth month for birthday rewards.
- `gender` (number) — optional (0/1/2 mapping used in client).
- `market_id` (number) — optional or server-assigned market identifier.
- `PlatformType` (number) — client platform identifier (e.g., 2 for mobile).

Server-side responsibilities
- Validate required fields and email format.
- Enforce password strength policy and return clear error messages when validation fails.
- Normalize and store phone numbers in E.164 where possible.
- Check for existing account (by email and/or phone). If existing, return a deterministic code/message.
- Create member record, hash password securely (bcrypt/argon2), and generate `CustomerId`/`CardNumber`.
- Send verification email (if required) and/or return token for client-side verification flow.
- Log signup event for analytics and monitoring.

Expected responses
- Success (new account created):
  - JSON shape example (server currently returns type codes):
    {
      "type": 2,
      "description": "Member created",
      "CustomerID": 12345,
      "CARD_NUMBER": "000123456789"
    }

- Already registered (email exists):
  - Example:
    { "type": 5, "description": "Customer already exists" }

- Validation / error:
  - Example:
    { "type": 4, "description": "Invalid email format" }

Notes & suggestions (client + server)
- Prefer consistent JSON responses with an explicit `status` field (`success`/`error`) and machine-friendly `code` string (e.g., `already_registered`) in addition to `type`.
- Avoid returning plain-text secrets or tokens in responses.
- Ensure the CFC supports `returnformat=json` and returns parseable JSON for the mobile client.
- Rate-limit enrollment attempts per IP/email to limit abuse.
- Provide helpful error messages for the client to display (e.g., `password_too_weak`, `email_invalid`, `already_registered`).
- Consider returning `CustomerID` and `CARD_NUMBER` on success so client can immediately display `MyCard` without extra calls.

Example client call (URL-encoded query):
```
GET /PinPointWSMobileVmcv.cfc?method=MemberEnrollment&AuthVerify=<token>&first=Jane&last=Doe&e_mail=jane%40example.com&password=Secret123!&phone=15555551212&PlatformType=2
```

Acceptance criteria for server validation
- Returns JSON with `type` and `code` for success/error.
- Creates a member record and returns `CustomerID` on success.
- Handles duplicate registration and returns `already_registered` code.
- Sanitizes inputs and enforces minimal password/security policy.

Integration notes for client
- Use a central `enrollMember` wrapper (already added) to call the method.
- Surface server `description` and `code` to analytics when enrollment fails for monitoring.
- On success, persist `CustomerID` and optionally `CARD_NUMBER`, then navigate to sign-in or logged-in flow depending on verification setup.
