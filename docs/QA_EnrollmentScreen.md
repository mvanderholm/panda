# QA Checklist — EnrollmentScreen

Manual QA steps for member enrollment flow.

## Step 1 — Account

- [ ] Opening the screen logs `SignupStarted` in analytics
- [ ] Tapping Next with empty fields shows inline errors on First name, Last name, Email, Password, Confirm password
- [ ] Entering an invalid email (e.g. `notanemail`) shows "Please enter a valid email address."
- [ ] Password under 8 chars shows "Password must be at least 8 characters."
- [ ] Password 8+ chars but weak (e.g. `password1`) shows "Password is too weak. Add uppercase, numbers, or symbols."
- [ ] Strength indicator shows: Weak (red) / Medium (orange) / Strong (green) as you type
- [ ] Mismatched confirm password shows "Passwords do not match."
- [ ] Valid Step 1 data clears all errors and advances to Step 2
- [ ] `SignupStep` logged with `{ step: 1 }` on valid Next

## Step 2 — Contact

- [ ] Phone field formats digits as `(123) 456-7890` while typing
- [ ] Fewer than 10 digits shows "Please enter a valid 10-digit phone number."
- [ ] Empty phone shows "Phone number is required."
- [ ] Address, city, state, ZIP are optional — Step 2 advances with only phone filled
- [ ] `SignupStep` logged with `{ step: 2 }` on valid Next

## Step 3 — Personal

- [ ] Birth month chips toggle on/off correctly (only one selected at a time)
- [ ] Gender chips are mutually exclusive
- [ ] Both fields are skippable — Create Account works with nothing selected

## Submission

- [ ] Tapping Create Account shows spinner and disables button
- [ ] `SignupSubmitted` logged on tap
- [ ] On success response (`type: 2`): success screen shown, `SignupSuccess` logged with `email` and `CustomerID`
- [ ] On already-registered response (`type: 5`): Alert shows "Already registered … sign in instead", `SignupFailed` logged with `code: "already_registered"`
- [ ] On other server error: Alert shows server `description`, `SignupFailed` logged with `code` and `description`
- [ ] On network exception: Alert shows error message, `SignupFailed` logged with `code: "exception"`

## Payload verification

- [ ] Phone sent to API is digits-only (strip formatting before send)
- [ ] `PlatformType: 2` included in request params

## Navigation

- [ ] "← Back" on Step 2 returns to Step 1 and clears errors
- [ ] "← Back" on Step 3 returns to Step 2 and clears errors
- [ ] "Already have an account? Sign in" navigates to Login from any step
- [ ] Success screen "Go to Sign In" navigates to Login

## Accessibility

- [ ] Step label has `accessibilityRole="header"`
- [ ] All inputs have `accessibilityLabel` set
- [ ] Create Account button reflects disabled state via `accessibilityState`
- [ ] Month chips use `accessibilityRole="checkbox"` with `checked` state
- [ ] Gender chips use `accessibilityRole="radio"` with `selected` state

## Example curl responses for backend testing

```bash
# Success
curl "https://eport9.com/pinpoint/pinpointWSMobile/PinPointWSMobileVmcv.cfc?method=MemberEnrollment&AuthVerify=<TOKEN>&first=Jane&last=Doe&e_mail=jane%40example.com&password=Secret123!&phone=15555551212&PlatformType=2"
# Expected: { "type": 2, "description": "Member created", "CustomerID": 12345, "CARD_NUMBER": "000123456789" }

# Already registered
# Expected: { "type": 5, "description": "Customer already exists" }

# Validation error
# Expected: { "type": 4, "description": "Invalid email format" }
```

## Backend request

Please ensure the success response includes `CustomerID` (and optionally `CARD_NUMBER`) in the response body so the client can immediately display the member card without an extra API call.
