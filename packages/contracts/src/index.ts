import { z } from "zod";

export const sessionResponseSchema = z.object({
  userId: z.string().min(1),
  expiresAt: z.string().datetime(),
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;
