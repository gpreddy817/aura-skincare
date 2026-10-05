- Voice calls use Omnidimension: server fn creates a session (key server-side), browser uses @omnidim-ai/client WebSession. Why: keeps the secret off the client.
- Order lookup lives in src/lib/orders.ts and is exposed at /api/public/get-order-details for the agent's custom tool. Why: one source of verified order data.

