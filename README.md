Last Updated: 2024-05-23

# R Community

R Community is a mobile-first social media platform designed exclusively for delivery riders and gig workers. It enables users to connect, share updates, and interact in a verified, rider-focused environment.

## Current Status
**Active Development / Partial Implementation**
The core infrastructure for both backend and mobile is established. Basic flows for authentication, feed interaction, and profile management are implemented.

## Project Structure
The repository is a monorepo containing:
- `backend/`: Node.js/Express API server.
- `mobile/`: React Native mobile application.

## Backend (`backend/`)
Built with Node.js, Express, and TypeScript. Uses Prisma ORM with PostgreSQL.

### Implemented Modules (`src/modules/`)
- **Auth**: Handles user registration, login, and JWT issuance. Supports visitor and verified access modes.
- **Feed**: Manages posts, retrieval (latest/trending), hashtags, likes, and comments.
- **User**: User profile management, including vehicle details and platform associations.
- **Verification**: Logic for rider verification (handling verification requests and reviews).
- **Report**: Reporting system for flagging inappropriate content.

### Key Infrastructure
- **Middleware**: Authentication (JWT), File Uploads (Multer), Logging.
- **Database**: PostgreSQL schema managed via Prisma.

## Mobile (`mobile/`)
Built with React Native (0.71.4) and TypeScript.

### Implemented Features
- **Navigation**: `RootNavigator` managing Auth stacks, Tab navigation, and independent screens.
- **Authentication**: Login and Registration screens with token management via `AsyncStorage`.
- **Feed**:
    - `FeedScreen` with 'Latest' and 'Trending' tabs.
    - Post creation (`CreatePost`) and interaction (Likes, Comments).
    - Hashtag filtering.
- **Profile**:
    - `ProfileScreen` displaying user stats, vehicle info, and posts.
    - `EditProfile` for updating personal and rider details.
- **Verification**: `VerificationScreen` for submitting rider credentials (simulated flow available).
- **Guidelines**: `GuidelinesScreen` displaying community rules.

## Setup & Build

### Backend
1. Navigate to `backend/`.
2. Install dependencies: `npm install`.
3. Configure environment variables (DB connection).
4. Run server: `npm run dev`.

### Mobile
1. Navigate to `mobile/`.
2. Install dependencies: `npm install`.
3. Android Build:
   - `npm run android` or `./gradlew assembleDebug` in `android/`.
   - Note: Requires local `local.properties` with SDK path.
4. iOS Build: `npm run ios` (requires macOS/Xcode).

## Documentation
- `DESIGN.md`: Original product vision and architecture.
- `BUILD_INSTRUCTIONS.md`: Specific build notes (if available).
- `AGENTS.md`: Context for AI assistants.
