PR: MemberEnrollment improvements and client integration

Summary
- The mobile client uses a single CFC method `MemberEnrollment` to create new members. I've added a client-side wrapper `enrollMember` and documentation at `docs/MemberEnrollment_CFC_SPEC.md`.
- This PR proposes server-side changes and conventions to make the enrollment flow more robust, observable, and client-friendly.

Why
- Mobile UX improvements (immediate success state, better error messaging, fewer round-trips) require predictable, parseable responses and a few extra fields.
- Security and abuse prevention require rate-limiting and no leaking of secrets.

Requested server changes (high priority)
1. Consistent JSON response envelope
   - Always return JSON with: `status` ("success"/"error"), `code` (machine-friendly), `type` (existing numeric code for backward compatibility), `description` (human message), and `data` (optional payload).
   - Example success:
     {
       "status":"success",
       "code":"created",
       "type":2,
       "description":"Member created",
       "data": { "CustomerID": 12345, "CARD_NUMBER": "000123456789" }
     }

2. On success include `CustomerID` and `CARD_NUMBER` in `data` so the client can show `MyCard` immediately without an extra call.

3. Return a deterministic `code` for common errors
   - `already_registered`, `email_invalid`, `password_too_weak`, `rate_limited`, etc. Client will map these to UX messages and analytics events.

4. Input normalization & validation
   - Normalize phone to digits (E.164 preferred), validate email format, and enforce minimal password strength server-side.

5. Rate-limit enrollment attempts per IP/email to reduce abuse and bot signups.

6. Verification workflow
   - If email verification is required, include an indicator (e.g., `data.verification_required: true`) so client can guide UX.

7. Logging & analytics hooks
   - Emit structured logs for signup success/failure with `code` and anonymized identifiers for side-by-side analysis with client analytics.

8. Backward compatibility
   - Keep `type` numerical codes in responses for existing clients while adding the new envelope.

Acceptance criteria
- New/updated CFC returns JSON envelope as described and includes `CustomerID` + `CARD_NUMBER` on success.
- Returns `already_registered` code when email exists.
- Returns parseable, consumer-friendly errors for validation failures.
- Rate-limiting is in place and returns `rate_limited` code when exceeded.

Client changes (already implemented)
- Mobile client now uses `enrollMember(params)` wrapper and logs analytics events for `SignupStarted`, `SignupStep`, `SignupSubmitted`, `SignupSuccess`, and `SignupFailed`.
- Client displays server `description` as alert text and maps `code` to analytics events.

Suggested rollout
1. Deploy CFC changes behind a feature flag or test endpoint.
2. Smoke test with a staging mobile build that uses `enrollMember`.
3. Deploy to production and monitor signup success/failure rates and logs for the `code` field.

Notes
- Spec is available at `docs/MemberEnrollment_CFC_SPEC.md` for full input/output expectations.
- If you want, I can prepare a small Postman collection or curl examples for QA.

— Mobile engineering
