# Constellation — Project Journey & Build Sequence
A chronological log of decisions, phases, and architecture that shaped the Constellation platform.

---

## PHASE 0 — Concept Formation & Intent
Constellation began as a question:  
“How do we create a ritual that helps people understand who they are becoming, and help them grow alongside a trusted group?”

Core insights that defined the project:
- Reflection is valuable only when structured.
- Small groups create deeper connection than large networks.
- A monthly cycle is sustainable and meaningful.
- Prompts must be high-signal, emotional, and non-performative.
- The experience must feel like a mirror, not a feed.

Outputs of this phase:
- The dual-mode 40-question deck  
- Emotional tone & aesthetic  
- Group size constraints (7–25)  
- Monthly cadence model  
- Wrapped narrative output concept  

---

## PHASE 1 — Product Definition & Architecture
We established Constellation’s primary systems:

### The Four Core Engines
1. **Cadence Engine** — assigns weekly reflection windows.
2. **Reflection Engine** — serves questions and captures responses.
3. **Wrapped Engine** — converts a month of reflections into a story.
4. **Community Layer** — archives, insights, gatherings, galleries.

Supporting systems:
- Sentiment analysis  
- Theme clustering  
- Emotional timeline tracking  
- Media storage  

Outputs of this phase:
- Full system architecture  
- Wireframes (web + mobile)  
- User flows  
- Database schemas  
- API endpoint spec  
- Brand tone guidelines  

---

## PHASE 2 — Platform Vision & Documentation
Created all foundational documents:
- README  
- Vision & product overview  
- Wireframes (narrative + structural)  
- Onboarding email series  
- Wrapped narrative template  
- User flows (Mermaid diagrams)  
- Data models (`users`, `groups`, `responses`, `wraps`, etc.)
- Backend API outlines  
- Landing page copy  
- Cadence + Wrapped pseudocode  

This phase set the emotional, architectural, and functional blueprint.

---

## PHASE 3 — Shift from “MVP via external tools” → “Build the Real Platform”
A key strategic decision:
> We will not rely on no-code tools or stitched-together MVP systems.  
> We will build the Constellation platform natively, as a real product.

This requires:
- Next.js frontend  
- Supabase backend (auth, DB, storage)  
- Postgres relational schemas  
- Full-stack deployment (Vercel + Supabase)  
- AI service integration for wrapping + sentiment  
- Native UI for reflection, insights, groups, Wrapped  

This shift enables:
- Scalable foundation  
- Superior UX  
- Ownership of core rituals  
- Integrated AI engine  
- Long-term extensibility  

---

## PHASE 4 — Build Sequence (Engineering Roadmap)
This is the exact order of technical implementation.

1. **Initialize codebase**: Next.js + Tailwind + Supabase SDK  
2. **Configure Supabase project**  
3. **Migrate database schema**  
4. **Implement Auth (email signup + magic links)**  
5. **Create first UI screens:**
   - Sign up  
   - Create profile  
   - Join/Create Group  
6. **Build Group backend logic**  
7. **Implement Cadence Engine (assign reflection week)**  
8. **Serve 4 questions dynamically**  
9. **Build Reflection Input UI**  
10. **Store text, photos, music links, mood slider**  
11. **Develop the Wrapped Engine (manual → automated)**  
12. **Build Wrapped UI (scroll narrative)**  
13. **Implement Personal Insights dashboard**  
14. **Implement Group Home**  
15. **Media storage + optimization**  
16. **End-to-end testing with a real group**  

---

## PHASE 5 — First Live Constellation
At the completion of these steps, the platform can host its first real constellation:
- Members join  
- Receive prompts  
- Submit reflections  
- Wrapped is generated  
- Group convenes  

This marks the transition from prototype → living product.

---
