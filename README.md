```markdown
# Live Auction Engine

A real-time auction platform built with TypeScript, Node.js, WebSockets, Redis, and React.

The engine supports live bid submission, Redis-backed highest-bid coordination, real-time updates, multiple server instances, and WebSocket load testing with Artillery.

## Features

- Real-time bidding over WebSockets
- Redis-based atomic highest-bid validation
- Shared auction state across multiple server instances
- Live bid updates for connected clients
- Bid validation with Zod
- React frontend
- Artillery load tests for ports `4000` and `4001`
- Docker Compose configuration for Redis

## Technology Stack

- Node.js
- TypeScript
- Express
- WebSocket (`ws`)
- Redis
- React
- Vite
- Zod
- Artillery
- Docker Compose

## Prerequisites

Install the following:

- Node.js
- Docker Desktop
- Git

## Installation

```bash
npm install
```

Start Redis:

```bash
docker compose up -d redis
```

## Running the Application

Start the backend on port `4000`:

```powershell
$env:PORT=4000; npm run dev
```

To run another backend instance on port `4001`, open a second terminal:

```powershell
$env:PORT=4001; npm run dev
```

Start the frontend in another terminal:

```bash
npm run dev:frontend
```

The frontend is available at:

```text
http://localhost:5173
```

## Building the Project

Build the backend:

```bash
npm run build
```

Start the compiled backend:

```bash
npm start
```

Build the frontend:

```bash
npm run build:frontend
```
## WebSocket Messages

### Place a Bid

```json
{
  "type": "PLACE_BID",
  "payload": {
    "amount": 600,
    "userId": "user-4001"
  }
}
```

### New Bid Event

```json
{
  "type": "NEW_BID",
  "payload": {
    "amount": 600,
    "userId": "user-4001",
    "timestamp": 1710000000000
  }
}
```

### Rejected Bid

```json
{
  "type": "BID_REJECTED",
  "message": "Your bid must be higher than the current highest bid"
}
```

## Load Testing

The repository includes separate Artillery configurations for testing each server instance:

```bash
npx artillery run `load-test-4000.yaml`
```

```bash
npx artillery run `load-test-4001.yaml`
```

Each configuration creates one virtual user, sends a bid, waits one second, and completes the scenario.

To record a test in Artillery Cloud:

```bash
npx artillery run --record --key "YOUR_ARTILLERY_API_KEY" load-test-4000.yaml
```

Run the equivalent command with `load-test-4001.yaml` to test port `4001`.

## Resetting the Highest Bid

The highest bid is stored in Redis under:

```text
auction:highest-bid
```

Reset it with:

```bash
docker compose exec redis redis-cli DEL auction:highest-bid
```

A response of `(integer) 1` means the key was deleted successfully.

## Project Structure

```text
.
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       └── store/
├── shared/
│   ├── contracts.ts
│   └── contracts.js
├── src/
│   ├── config/
│   ├── schemas/
│   └── index.ts
├── docker-compose.yaml
├── load-test-4000.yaml
├── load-test-4001.yaml
├── package.json
└── tsconfig.json
```

## Health Check

Once the backend is running, verify it with:

```text
http://localhost:4000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## License

This project is available under the ISC license.
