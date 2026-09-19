import { z } from "zod";

export const bidSchema = z.object({
  amount: z
    .number({ error: "Bid must be a number" })
    .positive("Bid must be greater than zero"),
});

export type BidInput = z.infer<typeof bidSchema>;

export interface Bid extends BidInput {
  userId: string;
  timestamp: number;
}

export type ClientMessage = {
  type: "PLACE_BID";
  payload: BidInput & { userId: string };
};

export type ServerMessage =
  | { type: "CONNECTED" }
  | { type: "NEW_BID"; payload: Bid }
  | { type: "BID_REJECTED"; message: string }
  | { type: "ERROR"; message: string };
