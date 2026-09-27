# Testing Documentation

## Automated verification completed

- Server TypeScript check: passed
- Mobile TypeScript check: passed
- Tablet TypeScript check: passed
- Web TypeScript and Vite production build: passed
- Expo SDK 57 dependency compatibility check for mobile: passed
- Expo SDK 57 dependency compatibility check for tablet: passed
- Source scan for final `console.log`, `console.warn`, `console.error`, and `console.debug`: passed
- Clean Git archive extraction, dependency installation, and complete build: passed

## Socket.IO integration test completed

The local integration test verified:

1. A newly connected client receives the current exhibit state.
2. An available artifact can be selected.
3. Rotation commands are accepted and normalized.
4. Visitor sessions update the shared visitor count.
5. Maintenance mode rejects visitor rotation.
6. The web administrator can disable and re-enable artifacts.
7. The web administrator can change the exhibit mode.
8. The administrative reset restores session statistics and presentation state.

## Visual runtime verification completed

- Mobile controller launched in iPhone Simulator.
- Tablet monitor launched in iPad Simulator.
- Web admin connected in a desktop browser.
- All three client types appeared in the tablet connection panel.
- Mobile and tablet displayed the same active artifact and rotation.
- Tablet landscape layout rendered without clipping.

## Final manual test procedure

### Mobile to tablet and web

1. Confirm all interfaces show connected or online status.
2. Press **Start visit** on the phone.
3. Confirm visitor count increases on tablet and web.
4. Select each enabled artifact on the phone.
5. Confirm the title, era, color, summary, and active state update on tablet and web.
6. Drag the phone visualization left and right.
7. Confirm rotation updates immediately on tablet and web.
8. Confirm haptic feedback occurs on the physical phone or supported simulator.

### Web to mobile and tablet

1. Change mode from interactive to normal.
2. Attempt to rotate from mobile and verify the server rejects the action with visible feedback.
3. Change back to interactive and verify rotation works.
4. Disable an artifact from web.
5. Confirm it becomes unavailable on mobile and the enabled count changes.
6. Activate maintenance mode.
7. Confirm tablet status changes and mobile actions are limited.
8. Reset the exhibit and verify visitor and interaction counts return to zero.

### Recovery and edge cases

1. Stop the server and confirm all clients display an offline or reconnecting state.
2. Restart the server and confirm all clients reconnect.
3. Change state, close one client, reopen it, and confirm it receives the current state.
4. Perform rapid artifact selections and rotations and confirm all clients settle on the same final state.
5. Verify the final interface works in both tablet portrait and landscape orientations.
6. Run the mobile and tablet apps on Android if an emulator or device is available.

## Manual verification still required

- Physical-device haptic feedback
- Android mobile and tablet runtime
- Full disconnect/reconnect demonstration

## Submission video

- Final multi-device demonstration recorded as `Connected_Devices_Prototype.mp4`
- Video will be uploaded separately through the course assignment page
