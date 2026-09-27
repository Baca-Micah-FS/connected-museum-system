# Nexus Museum Connected Exhibit

Nexus Museum is an interactive museum exhibit that works across a phone, tablet, and web browser. Visitors use the phone to explore artifacts, the tablet shows what is happening at the exhibit, and museum staff use the website to manage everything. A Socket.IO server keeps the three screens updated in real time.

I built this project for the Multi-Device Connected Prototype System assignment. I wanted each screen to have its own purpose while still feeling like one exhibit instead of three separate apps.

## The experience

The system is intended for a small museum or traveling exhibit:

- A visitor uses the **mobile controller** to begin a session, select an artifact, and rotate its visualization with a touch gesture. Successful actions produce haptic feedback.
- The **tablet display** presents the selected artifact, current rotation, visitor and interaction statistics, client connectivity, and the latest system activity.
- A curator uses the **web admin interface** to change the exhibit mode, open or close individual artifacts, reset statistics, and monitor the complete system.
- The **Socket.IO server** validates every action, owns the shared exhibit state, and broadcasts accepted changes to all connected interfaces.

The main design idea is that the three clients are not copies of the same application. Each has a specific job while contributing to one connected visitor experience.

## How it works

The phone and web dashboard send actions to the server. The server checks those actions, updates the exhibit, and sends the new information to every connected screen. For example, selecting an artifact on the phone immediately changes the tablet display and the system overview on the website.

When an interface reconnects, the server sends it the latest exhibit information. A device can therefore reconnect without resetting everyone else's session.

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

## Project folders

The project is split into five main folders. `mobile-controller` and `tablet-display` contain the two Expo apps. `web-admin` contains the browser interface, while `server` runs the shared Socket.IO connection. I also created `shared-types` so all four applications use the same definitions for exhibit data.

Testing notes and the manual test checklist are available in [TESTING.md](TESTING.md).

## Information shared between devices

The central state includes:

- Artifact collection and availability
- Active artifact
- Artifact rotation
- Exhibit mode and system status
- Visitor and interaction counts
- Connected clients by interface type
- Latest accepted action and update timestamp

## Real-time communication

The apps communicate through a small set of Socket.IO events. The phone sends changes when a visitor selects or rotates an artifact or begins a new session. The web dashboard sends curator changes, such as changing the exhibit mode or making an artifact unavailable. After the server checks an action, it updates the shared state and sends the result to every connected screen.

The server also sends the full current state whenever a device connects again. This keeps the phone, tablet, and web dashboard matched even if one of them was temporarily closed or disconnected.

## Prerequisites

- Node.js 20 or later
- npm
- Xcode and iOS Simulator for iOS testing
- Android Studio and an emulator for Android testing, if available
- All devices connected to the same local network when using physical hardware

## Installation

Download or clone the project from [GitHub](https://github.com/Baca-Micah-FS/connected-museum-system), open the project folder in VS Code, and run the following commands from its main terminal:

```bash
npm install --prefix shared-types
npm install --prefix server
npm install --prefix mobile-controller
npm install --prefix tablet-display
npm install --prefix web-admin
```

Each command installs what that part of the system needs. The scripts in the root `package.json` can then be used to start each interface.

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

## Connection and error handling

- Clients automatically attempt to reconnect after a connection loss.
- The server sends current state to newly connected clients.
- Invalid client registration is rejected.
- Disabled artifacts cannot be selected.
- Rotation commands are rejected outside interactive mode.
- Rotation input is checked for a finite number and normalized to 0–359 degrees.
- Administrative actions use confirmations or acknowledgments.
- Interfaces show clear offline or reconnecting states.

## Demo video

The demonstration video is submitted separately through the course assignment page. It shows all three interfaces, mobile interactions updating the tablet and web dashboard, curator controls affecting the other devices, and a short explanation of the project structure.

## Ideas I would like to add later

- Illustrated or 3D artifact models
- A database for long-term visitor statistics
- Staff accounts for the curator dashboard
- Support for multiple museum rooms
- Charts showing exhibit activity over time
- More accessibility and language options
- An online deployment for remote demonstrations

## Current status

The complete prototype has been compiled and tested with an iPhone Simulator, iPad Simulator, desktop browser, and local Socket.IO integration script. A clean copy made from the Git repository was also installed and built successfully. Android and physical-device testing remain optional manual verification items.
