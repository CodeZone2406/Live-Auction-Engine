import { useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import { bidSchema } from "../../../shared/contracts";
import { useAuctionSocket } from "../hooks/useAuctionSocket.js";
import type { RootState } from "../store/store.js";

const USER_ID = `user_${Math.floor(Math.random() * 10000)}`;
const WS_URL =
  import.meta.env.VITE_WS_URL ?? `ws://${window.location.hostname}:4000`;

export const AuctionRoom = () => {
  const [bidInput, setBidInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { isConnected, highestBid, bidHistory } = useSelector(
    (state: RootState) => state.auction,
  );
  const { sendBid } = useAuctionSocket(WS_URL);

  const handlePlaceBid = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const validationResult = bidSchema.safeParse({
      amount: Number(bidInput),
    });

    if (!validationResult.success) {
      setError(validationResult.error.issues[0]?.message ?? "Invalid bid");
      return;
    }

    const { amount } = validationResult.data;

    if (amount <= highestBid) {
      setError("Your bid must be higher than the current highest bid.");
      return;
    }

    sendBid(amount, USER_ID);
    setBidInput("");
  };

  return (
    <main>
      <header className="auction-header">
        <div>
          <p className="eyebrow">Live room / Lot 001</p>
          <h1>Live Art Auction</h1>
        </div>
        <span className={`connection-status ${isConnected ? "connected" : ""}`}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </header>

      <section className="bid-panel">
        <p className="bid-label">Current highest bid</p>
        <p className="current-bid">${highestBid.toFixed(2)}</p>

        <form onSubmit={handlePlaceBid} className="bid-form">
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={bidInput}
            onChange={(event) => setBidInput(event.target.value)}
            placeholder="Enter amount"
            aria-label="Bid amount"
          />
          <button type="submit" disabled={!isConnected}>
            Place bid
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </section>

      <section className="activity-panel">
        <h2>Live activity</h2>
        <ul className="bid-history">
          {bidHistory.map((bid) => (
            <li key={`${bid.userId}-${bid.timestamp}`}>
              <span>{bid.userId}</span>
              <span>${bid.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        {bidHistory.length === 0 && (
          <p className="empty-state">No bids yet. The room is waiting.</p>
        )}
      </section>
    </main>
  );
};