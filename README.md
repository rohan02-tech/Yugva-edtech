# Yugva EdTech — React + Vite prototype

A responsive, multi-page-feeling EdTech website prototype using React, Vite and Lucide icons, styled in plum, cream and gold.

## Requirements
- Node.js 18+ (Node.js 20 LTS recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Build for production
```bash
npm run build
npm run preview
```

## Included pages and interactions
- Homepage with course cards, approach, sample learner-story placeholders, journey overview and FAQs
- Course catalogue with search and category filters
- Course detail pages with syllabus, outcomes, price, demo request and transparent support terms
- Free demo / counselling lead form with basic validation
- Eight-stage learner journey
- Demo enrolment and checkout flow (no payment is processed)
- Student portal with overview, lesson checklist, sample live-class area, assignments, resources and certificate preview
- Career support information and non-guarantee wording
- FAQ, about and learner policy pages
- Local browser storage for demo leads, enrolments, lesson completion and assignment submissions

## Important prototype notes
- This is a frontend prototype, not a production learning management system.
- Lead requests and learner progress are stored in the current browser via `localStorage`; no data is sent to a server.
- Checkout is simulated. No payment gateway or real payment processing is connected.
- Lesson player, class schedule and resource links are placeholders.
- Testimonials, ratings, pricing, course details and any future partner logos must be verified and replaced with approved real information before launch.
- No job or placement is guaranteed. Career-support wording is intentionally qualified.
- Before production, add a backend/API, secure authentication and role-based access control, database, payment gateway, email/SMS service, privacy policy, terms, refund policy, consent and data-retention controls, accessibility testing, logging, backups and security review.

## Suggested next architecture step
Use a backend such as Django REST Framework or Node.js, PostgreSQL for user/course/enrolment data, object storage/CDN for course assets, a trusted payment provider, and a managed video/meeting service. Keep admin, learner and public website permissions separated.
