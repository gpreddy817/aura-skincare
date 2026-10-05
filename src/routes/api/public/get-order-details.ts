import { createFileRoute } from "@tanstack/react-router";
import { getOrderDetails } from "@/lib/orders";

// Called by the Omnidimension agent's custom API tool (get_order_details).
// Read-only mock data; no PII beyond the demo orders.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function respond(result: ReturnType<typeof getOrderDetails>) {
  return Response.json(result, { status: 200, headers: cors });
}

export const Route = createFileRoute("/api/public/get-order-details")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async ({ request }) => {
        const id = new URL(request.url).searchParams.get("order_id");
        return respond(getOrderDetails(id));
      },
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Record<string, unknown>;
          const id = body["order_id"] ?? (body["args"] as Record<string, unknown> | undefined)?.["order_id"];
          return respond(getOrderDetails(id));
        } catch {
          return Response.json(
            { ok: false, error: { code: "BAD_REQUEST", message: "Invalid JSON body." } },
            { status: 400, headers: cors },
          );
        }
      },
    },
  },
});
