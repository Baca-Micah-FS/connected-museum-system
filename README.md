# Nexus Museum Connected Exhibit

Nexus Museum is a multi-device interactive exhibit prototype. It gives visitors a phone controller, provides museum staff and nearby guests with a live tablet display, and gives curators a browser-based administration dashboard. A TypeScript Socket.IO server coordinates all three interfaces as one synchronized system.

This project was created for the Multi-Device Connected Prototype System assignment. Its purpose is to explore how interfaces with different responsibilities can cooperate around one authoritative source of state.

## The experience

The system is intended for a small museum or traveling exhibit:

- A visitor uses the **mobile controller** to begin a session, select an artifact, and rotate its visualization with a touch gesture. Successful actions produce haptic feedback.
- The **tablet display** presents the selected artifact, current rotation, visitor and interaction statistics, client connectivity, and the latest system activity.
- A curator uses the **web admin interface** to change the exhibit mode, open or close individual artifacts, reset statistics, and monitor the complete system.
- The **Socket.IO server** validates every action, owns the shared exhibit state, and broadcasts accepted changes to all connected interfaces.

The main design idea is that the three clients are not copies of the same application. Each has a specific job while contributing to one connected visitor experience.

## Architecture

```text
Mobile Visitor Controller
          │
          │ artifact:selected / artifact:rotate / visitor:entered
          ▼
  TypeScript Socket.IO Server
          │
          │ validates input, updates authoritative state
          │ state:sync / state:updated
          ▼
Tablet Exhibit Monitor  ◀────▶  Web Curator Admin
```

When a client connects, the server immediately sends the current state. This allows a restarted or temporarily disconnected interface to recover without resetting the exhibit.

## Interface responsibilities

### Mobile controller

- Artifact selection
- Horizontal drag-to-rotate gesture
- Haptic feedback for selection, rotation, and session actions
- Immediate active, disabled, connected, and error feedback
- Visitor-session count action

### Tablet display

- Live artifact visualization and rotation
- Visitor, interaction, and connected-device metrics
- Interface connection status
- Latest activity timeline
- Responsive layout for portrait and landscape dimensions

### Web admin

- Full system overview
- Exhibit modes: normal, interactive, and maintenance
- Artifact availability controls
- Administrative statistics reset
- Connected-interface monitoring
- Confirmation and error feedback

## Technology stack

- TypeScript
- React Native 0.86 with Expo SDK 57
- Expo Haptics
- React 19 with Vite 8
- Node.js and Express
- Socket.IO and Socket.IO Client
- React Native Safe Area Context

## Project structure

```text
connected-museum-system/
├── mobile-controller/   # Expo visitor interaction app
├── tablet-display/      # Expo exhibit dashboard
├── web-admin/           # Vite curator interface
├── server/              # Express and Socket.IO coordination server
├── shared-types/        # Shared TypeScript state and event payloads
├── TESTING.md            # Automated and manual test documentation
└── README.md
```

## Shared state

The central state includes:

- Artifact collection and availability
- Active artifact
- Artifact rotation
- Exhibit mode and system status
- Visitor and interaction counts
- Connected clients by interface type
- Latest accepted action and update timestamp

## Socket.IO events

| Event | Direction | Purpose |
|---|---|---|
| `client:register` | Client to server | Registers mobile, tablet, or web client type |
| `state:sync` | Server to client | Sends authoritative state after connection |
| `state:updated` | Server to clients | Broadcasts each accepted state change |
| `artifact:selected` | Mobile to server | Selects an available artifact |
| `artifact:rotate` | Mobile to server | Updates rotation in interactive mode |
| `visitor:entered` | Mobile to server | Records a new visitor session |
| `artifact:enabled` | Web to server | Changes curator-controlled availability |
| `exhibit:mode` | Web to server | Changes the operating mode |
| `exhibit:reset` | Web to server | Resets session statistics and presentation state |

Critical commands use Socket.IO acknowledgments. The server returns either success or a user-readable validation message.

## Prerequisites

- Node.js 20 or later
- npm
- Xcode and iOS Simulator for iOS testing
- Android Studio and an emulator for Android testing, if available
- All devices connected to the same local network when using physical hardware

## Installation

Clone the repository, then install dependencies in each project:

```bash
git clone YOUR_PRIVATE_REPOSITORY_URL
cd connected-museum-system

cd shared-types
npm install
cd ../server
npm install
cd ../mobile-controller
npm install
cd ../tablet-display
npm install
cd ../web-admin
npm install
```

## Network configuration

The iOS Simulator can normally use `http://localhost:4000`. Physical devices must use the computer's local network address.

Copy the example files in both Expo projects:

```bash
cp mobile-controller/.env.example mobile-controller/.env.local
cp tablet-display/.env.example tablet-display/.env.local
```

Replace `YOUR_COMPUTER_IP` with the address of the computer running the server:

```env
EXPO_PUBLIC_SERVER_URL=http://192.168.1.100:4000
```

The local environment files are ignored by Git.

The web interface defaults to `http://localhost:4000`. If needed, copy `web-admin/.env.example` to `web-admin/.env.local` and change `VITE_SERVER_URL`.

## Running the system

Open four terminals from the project root.

Terminal 1 — server:

```bash
npm run server
```

Terminal 2 — mobile controller:

```bash
npm run mobile
```

Terminal 3 — tablet display:

```bash
npm run tablet
```

Terminal 4 — web admin:

```bash
npm run web
```

Use the Expo terminal commands or QR codes to open each React Native project. Open the Vite address shown by the web terminal, normally `http://localhost:5173`.

## Verification

Run all static checks from the root:

```bash
npm run check
```

The manual end-to-end workflow is documented in [TESTING.md](TESTING.md).

## Error handling and recovery

- Clients automatically attempt to reconnect after a connection loss.
- The server sends current state to newly connected clients.
- Invalid client registration is rejected.
- Disabled artifacts cannot be selected.
- Rotation commands are rejected outside interactive mode.
- Rotation input is checked for a finite number and normalized to 0–359 degrees.
- Administrative actions use confirmations or acknowledgments.
- Interfaces show clear offline or reconnecting states.

## Demo video

YouTube unlisted link: **Add final video link before submission.**

The final video should show all three interfaces, a complete mobile-to-server-to-tablet/web interaction, an administrative web action affecting the visitor interfaces, and a short architecture explanation.

## Future improvements

- Add illustrated or 3D artifact assets
- Store exhibit analytics in a database
- Add curator authentication and roles
- Add multiple rooms and tablet stations
- Create historical activity charts from real data
- Add accessibility settings and localization
- Deploy the server and web dashboard for remote demonstrations
- Add automated Socket.IO integration tests to the repository

## Current status

The complete prototype has been compiled and tested with an iPhone Simulator, iPad Simulator, desktop browser, and local Socket.IO integration script. Android and physical-device testing remain manual verification items before final submission.
