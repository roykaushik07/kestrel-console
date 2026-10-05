import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  LEGACY_ROUTER_URL: z.string().url().optional(),
  OKTA_ISSUER: z.string().url(),
  OKTA_CLIENT_ID: z.string().min(1),
  OKTA_CLIENT_SECRET: z.string().min(1),
});

export const env = schema.parse(process.env);
