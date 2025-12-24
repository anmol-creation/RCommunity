# R Community - Product Design & Architecture

## 1. Product Overview
**R Community** is a niche social media platform exclusively designed for **Delivery Riders and Gig Workers** (e.g., Zomato, Swiggy, Blinkit, Amazon Flex, etc.).

### Core Philosophy
*   **Rider-First**: Every feature is optimized for the needs and constraints of gig workers.
*   **Safe Space**: A trusted environment free from employer surveillance and public judgment.
*   **Privacy-Centric**: No unnecessary data collection (No Aadhaar/PAN). Pseudonymity is supported.

### Target Audience
1.  **Delivery Riders**: Food delivery, quick commerce, last-mile logistics.
2.  **Gig Workers**: Part-time or full-time platform workers.

### Access Modes
*   **Visitor (Guest)**: Read-only access to public feeds.
*   **Verified Rider**: Full access (Post, Comment, Vote) after proving rider status.

---

## 2. App Architecture (High-Level)
The architecture follows a **Modular Monolith** approach for Phase 1 to ensure development velocity while remaining ready for microservices migration in the future.

### System Components
1.  **Mobile Client (Android First)**: The primary interface. Optimized for low-end devices and battery efficiency (Dark Mode).
2.  **API Gateway / Load Balancer**: Entry point for all client requests. Handles SSL, Rate Limiting, and basic Routing.
3.  **Backend Core**:
    *   **Auth Module**: Handles OTP login and session management.
    *   **Verification Module**: Manages the rider verification workflow (screenshot upload, approval queue).
    *   **Feed Module**: Manages posts, ranking algorithms, and timelines.
    *   **Interaction Module**: Handles likes, comments, and reports.
    *   **User Module**: Manages profiles and privacy settings.
4.  **Data Layer**:
    *   **Primary DB (PostgreSQL)**: Relational data (Users, Posts, Comments, Relationships).
    *   **Blob Storage (S3/MinIO)**: Storing post images and verification screenshots.
    *   **Cache (Redis)**: For session storage and feed caching.

---

## 3. Core Feature List (Phase 1)

### A. Authentication & Onboarding
*   **Mobile OTP Login**: Simple, password-less entry.
*   **Device Binding**: 1 Account = 1 Device (Security measure).

### B. Rider Verification
*   **Screenshot Upload**: User uploads a screenshot of their active gig platform profile (showing name/active status).
*   **Approval Workflow**: Admin/Moderator reviews the screenshot.
*   **Status Indicators**: "Unverified", "Pending", "Verified Rider".

### C. Social Feed
*   **Post Creation**: Text and Image support.
*   **Feed View**:
    *   *Latest*: Chronological order.
    *   *Trending*: Based on engagement (likes/comments).
*   **Interactions**: Like/Reaction, Comment, Internal Share.
*   **Hashtags**: Support for tagging topics (e.g., #PayoutIssue, #TrafficUpdate).

### D. User Profiles
*   **Rider Identity**: Display "Years of Experience", "Vehicle Type" (Bike/Scooter/Cycle), "Main Platforms" (badges).
*   **Privacy**: Option to use a display name different from the legal name.

### E. Community Safety
*   **Reporting System**: Users can flag posts/comments.
*   **Moderation Tools**: Admin dashboard to review flags and ban users.
*   **Guidelines**: Accessible "Community Rules" page.

---

## 4. User Flow: Visitor → Verified Rider

1.  **Download & Open**: User installs the app.
2.  **Guest Mode (Default)**:
    *   User sees the "Public Feed".
    *   Can read posts and comments.
    *   *Constraint*: "Create Post" and "Like" buttons trigger a "Login Required" prompt.
3.  **Sign Up / Login**:
    *   User enters Mobile Number -> Receives OTP -> Verifies.
    *   *State Change*: User is now **Authenticated (Unverified)**.
4.  **Unverified Experience**:
    *   User tries to post -> Prompt: "Verify your Rider Status to join the conversation".
    *   User clicks "Verify Now".
5.  **Verification Step**:
    *   Instruction: "Take a screenshot of your Zomato/Swiggy/Blinkit profile page showing your name and active status."
    *   Action: User uploads image.
    *   *State Change*: User status -> **Pending**.
6.  **Pending State**:
    *   Banner: "Verification in progress. You will be notified soon."
    *   User can still browse as a Guest.
7.  **Verified State**:
    *   Notification: "Welcome to R Community! You are now a Verified Rider."
    *   Full access unlocked.

---

## 5. Basic UI/UX Structure

*   **Design Language**: High contrast, Dark Mode default (easier on eyes at night, saves battery). Large touch targets (gloved usage).
*   **Navigation (Bottom Tab Bar)**:
    1.  **Home**: Main Feed (Tabs: Trending | Latest).
    2.  **Explore**: Search, Hashtags, Topics.
    3.  **Post (+)**: Central floating action button.
    4.  **Alerts**: Notifications (Likes, Replies, Verification status).
    5.  **Profile**: User's stats, posts, and settings.

---

## 6. Suggested Tech Stack

*   **Mobile App**: **React Native** (TypeScript).
    *   *Reasoning*: Cross-platform, fast development, mature ecosystem.
*   **Backend**: **Node.js** (NestJS or Express) with **TypeScript**.
    *   *Reasoning*: Type safety, scalability, vast library support.
*   **Database**: **PostgreSQL**.
    *   *Reasoning*: Reliable, structured data, PostGIS support (future geo-features).
*   **Object Storage**: **AWS S3** (or compatible like DigitalOcean Spaces).
*   **Infrastructure**: **Docker** containers.

---

## 7. Future-Ready Modular Design
(Directory Structure Concept)

```text
/
├── mobile/                 # React Native App
├── backend/                # Node.js API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/       # Login, OTP, Session
│   │   │   ├── user/       # Profile, Privacy
│   │   │   ├── verification/# ID checks, Screenshot analysis
│   │   │   ├── feed/       # Posts, Comments, Reactions
│   │   │   └── notification/# Push notifs, In-app alerts
│   │   ├── shared/         # Common utils, DB connection
│   │   └── main.ts         # App Entry
│   ├── Dockerfile
│   └── package.json
└── README.md
```

**Key Modular Principles:**
*   **Loose Coupling**: Modules interact via defined interfaces or events, not direct database queries into other modules' tables.
*   **Scalability**: Heavy modules (like Feed) can be extracted into separate services later if needed without rewriting the whole app.
