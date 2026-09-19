import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { AuctionRoom } from "./components/AuctionRoom";
import { store } from "./store/store";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <AuctionRoom />
    </Provider>
);
