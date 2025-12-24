# Agent Instructions - R Community

This document outlines the core principles and constraints for any agent or developer working on the **R Community** project.

## 1. Core Principles

### **Rider-First Design**
*   **Battery & Data Efficient**: The app is used by riders on the road. Minimize data usage and battery drain.
*   **Simple UI**: Large buttons, high contrast (Dark Mode), and intuitive flows. Assume the user might be wearing gloves or in bright sunlight.
*   **No Fluff**: Avoid "gamification" or "engagement baits" that distract from the core utility of connection and support.

### **Privacy-First & Safety**
*   **No Surveillance**: NEVER build features that allow employers to track riders.
*   **Data Minimization**: Do NOT request sensitive government IDs (Aadhaar, PAN, SSN) for verification. Use platform-specific proofs (app screenshots) instead.
*   **Anonymity**: Allow users to use pseudonyms. Their safety from employer retaliation is paramount.

## 2. Technical Constraints

*   **Mobile-First**: All features must be designed for mobile screens first.
*   **Modular Architecture**: Follow the modular structure defined in `DESIGN.md`. Do not create spaghetti code. Keep domains (Auth, Feed, User) separate.
*   **Performance**: The feed must load fast even on 4G/3G networks.

## 3. Verification Workflow

*   Do NOT over-engineer the verification process initially.
*   Phase 1 relies on manual/semi-automated review of screenshots.
*   Keep the verification logic isolated in the `verification` module so it can be swapped later (e.g., for an OCR solution).
