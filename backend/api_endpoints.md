# API Endpoints (Conceptual)

The Constellation backend is simple, calm, and conversational.

---

# Users
POST /users              → create user  
GET /users/:id           → fetch profile  
PATCH /users/:id         → update insights  

Narrative: Users change. The system listens.

---

# Groups
POST /groups             → create constellation  
GET /groups/:id          → fetch group info  
POST /groups/:id/invite  → invite member  
POST /groups/:id/join    → join constellation  

Narrative: Groups form gently, through invitation.

---

# Prompts
GET /groups/:id/prompts/:userId → fetch the 4 assigned questions  

Narrative: Prompts arrive like letters, not tasks.

---

# Responses
POST /responses          → submit reflection  
GET /responses/user/:id  → view personal archive  
GET /responses/group/:id → view group reflections  

Narrative: Every answer becomes part of a personal and communal story.

---

# Wrapped
GET /wrapped/:groupId/:month → retrieve monthly wrapped  

Narrative: The archive breathes through its stories.