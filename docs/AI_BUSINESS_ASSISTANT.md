# InsightSerenity AI Business Assistant

## Existing FAB Audit

The previous floating action button was duplicated across the main public HTML pages. Each page used:

- `.fab-container` fixed at the bottom-right corner.
- `.fab-actions` as a hidden vertical stack of shortcut links.
- `.fab-action` links for Word of God, Book Call, and Email.
- `.fab-btn` as the circular gold button.
- `initFab()` in `assets/js/main.js` to toggle `.open` on the button and shortcut stack.
- FAB styling in `assets/css/main.css`, with z-index `500`, gold/black visual language, circular dimensions, hover shadow, and mobile-safe fixed positioning.

The old behavior opened shortcut links only. Word of God linked to `/scripture/`. Book Call linked to `/consultation.html`. The implementation was not centralized as HTML, but shared CSS and JavaScript controlled the duplicated markup.

## Architecture

The frontend keeps the existing FAB markup and upgrades it at runtime:

Browser -> `/api/chat` -> AI provider or future Lumen AI backend

The browser does not call an AI provider directly and does not contain provider credentials.

Current files:

- `assets/js/main.js`: assistant panel, session conversation state, quick actions, `/api/chat` request, graceful fallback.
- `assets/css/main.css`: native InsightSerenity assistant panel styling built around the existing FAB.
- `assets/data/business-knowledge.json`: maintainable approved business knowledge.
- `api/chat.js`: provider-agnostic serverless API boundary with request limits and timeout handling.

## Provider Integration

`api/chat.js` expects a server/serverless runtime that can execute Node-style functions. It forwards sanitized messages to a configured InsightSerenity-owned provider endpoint.

Required environment variables:

- `INSIGHTSERENITY_AI_PROVIDER_URL`
- `INSIGHTSERENITY_AI_API_KEY`

No secret values should be placed in frontend JavaScript or committed to the repository.

## Security Model

- No AI provider API key is exposed in browser code.
- Requests go through `/api/chat`.
- The API limits message count and message length.
- The API includes a basic in-memory per-IP rate limit.
- The API has timeout handling.
- The server-side system instruction tells the assistant not to reveal secrets, system prompts, credentials, private configuration, or private client information.

The in-memory rate limiter is suitable only as a baseline. Production deployments should use platform or edge rate limiting where available.

## Business Knowledge

The assistant uses `assets/data/business-knowledge.json` for approved claims about:

- Company positioning.
- Services.
- Engagement process.
- Discovery Call scope and exclusions.
- Pricing starting points.
- Founder information and verified education.
- Public policies.
- Guardrails.
- Important routes.

Future updates should be made in this JSON file rather than scattering business facts through JavaScript.

## General Knowledge

The assistant may answer general technical questions, but it must distinguish general guidance from InsightSerenity-specific claims. It must not convert general technical knowledge into fabricated InsightSerenity experience.

## Conversation Memory

The frontend stores the active conversation in `sessionStorage` only. This preserves context during the current browser session without permanent browser persistence.

The `Clear` control resets the session conversation.

## Privacy

The UI reminds visitors not to share passwords, credentials, or sensitive information. The frontend does not permanently store conversations.

If the backend provider logs requests, the privacy policy should be reviewed before production launch.

## Error Handling

If `/api/chat` is unavailable or not configured, the frontend falls back to a limited local knowledge response and keeps the chat usable. The assistant also provides Contact and Discovery Call paths.

## Updating Business Knowledge

Edit `assets/data/business-knowledge.json`.

Useful sections:

- `company`
- `services`
- `process`
- `discovery`
- `pricing`
- `founder`
- `policies`
- `routes`
- `guardrails`

Avoid adding unverified claims, testimonials, client names, project counts, revenue, savings, outcome percentages, or certifications.

## Future Lumen AI Path

The frontend already calls `/api/chat`, not a third-party provider. To switch to Lumen AI later, update the backend provider behind `/api/chat` or point `INSIGHTSERENITY_AI_PROVIDER_URL` to the Lumen API boundary.

The frontend should not need to change if the response contract remains:

```json
{ "reply": "Assistant response text" }
```

## Production Setup

1. Deploy the site on a host that supports serverless or backend API routes.
2. Deploy `api/chat.js` or adapt it to the selected hosting platform.
3. Configure `INSIGHTSERENITY_AI_PROVIDER_URL`.
4. Configure `INSIGHTSERENITY_AI_API_KEY`.
5. Add platform-level rate limiting if available.
6. Verify the privacy policy covers any server-side AI logs.
7. Test the assistant on desktop, tablet, and mobile.

## Known Limitations

- On static-only hosting, `/api/chat` will not execute. The frontend fallback will still answer basic approved business questions, but production AI requires a backend/serverless runtime.
- The included rate limiter is in-memory and resets when the serverless instance resets.
- Streaming is not implemented in the first version. The request/response flow is non-streaming for reliability.
