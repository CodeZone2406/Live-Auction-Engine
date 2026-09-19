import { z } from "zod";
export const bidSchema = z.object({
    amount: z
        .number({ error: "Bid must be a number" })
        .positive("Bid must be greater than zero"),
});
