# Allstate Company Research

Research notes to inform ClaimPilot's design and interview talking points.

## Company Profile

- **4th largest P&C insurer in the US**
- Brand family: Allstate, Esurance, Encompass, Answer Financial
- ~14,000 claims investigators
- Processes ~50,000 customer messages per day
- CEO: Tom Wilson
- CIO: Zulfi Jeevanjee
- HQ: Northbrook, Illinois

## Technology Strategy

### Cloud-First Transformation
- Began cloud migration in 2019, deployed multicloud blueprint in 2022
- AWS as core infrastructure; Google and Microsoft cloud for specialized AI applications
- Re-engineering and testing every aspect of auto and home insurance applications
- ~7,000 team members organized in small teams of 8-12 people, outcome-based
- Nearly 40% of business processes digitized

### AI Deployments (Current)

**Claims Communications (GenAI)**
- Custom-built generative AI copilot used by all 14,000 claims investigators
- Started with 50 employees, scaled to full organization
- Handles ~50,000 daily customer messages
- AI-generated communications are "more empathetic and less prone to jargon"
- CEO publicly stated: bots write better customer emails than humans
- Uses OpenAI's GPT models for claims-related emails

**Claims Prediction (ML)**
- Homegrown ML models for claims cost prediction
- Total loss determination models (auto accidents)
- These models make recommendations independently

**Visual Damage Assessment**
- Evaluating AI for analyzing images of damaged vehicles (make, model, extent of damage)
- QuickFoto Claim: customers submit photos via mobile app for virtual inspection
- Virtual inspection on 46% of weather-related claims
- Reduced inspection time from 7-10 days to 3-7 days
- Resulted in downsizing 500+ claims adjusters

**AI Agent System (2025)**
- CEO Tom Wilson publicly touting new AI agent system
- Designed to "reason, resolve, and improve customer interactions as well as humans"
- Positioned as cost-cutting initiative
- Reduces demand for new hires

### Filing Time Improvement
- Claims filing time reduced from 4 minutes to 43 seconds
- A concrete metric worth referencing in ClaimPilot's product brief

## Arity (Telematics Subsidiary)

- Founded 2016, owned by Allstate
- Mobility data and analytics company
- Reached 1 trillion miles of driving data
- Collects: trips, miles, acceleration, speeding, phone usage, braking, night driving
- Key products:
  - **ArityIQ**: Driving behavior data at quote time for pricing accuracy
  - **Geosight**: Territorial risk insights using real-time behavioral data
  - **Arity Marketing Platform**: Mobility data for customer acquisition
- Recent push toward consumer transparency (direct-to-consumer driving reports)
- Privacy controversy: PIRG report on Arity selling driver data

## Organizational Structure

- Small, autonomous teams (8-12 people)
- Outcome-based development (not project-based)
- Dedicated teams for specific domains (e.g., one team exclusively for payments)
- Mix of human agents (independent agent network) and direct/digital channels
- CEO wants more independent agents but "not human modems" (i.e., agents should add value, not just relay information)

## Strategic Themes

1. **"Transformative Growth" strategy** - Digital-first initiatives, expanding direct channels
2. **AI as cost reduction** - Explicitly framed around reducing headcount needs and lowering costs
3. **Empathy through AI** - Counterintuitive positioning: AI makes communications MORE empathetic
4. **Telematics as competitive moat** - Arity's data advantage for pricing and risk
5. **Virtual-first claims** - Moving away from physical inspections entirely

## Implications for ClaimPilot

### What to incorporate
- **Frame as cost reduction.** Allstate's leadership is publicly framing AI as a cost-cutting tool. ClaimPilot should include LAE reduction as a primary metric.
- **Empathy angle.** The claim that AI is "nicer than agents" is a real Allstate talking point. ClaimPilot's agent responses should demonstrate clear, jargon-free communication.
- **Triage speed metric.** Reference the 4-minute-to-43-second improvement. ClaimPilot should track and display triage time prominently.
- **Human-in-the-loop.** Allstate uses AI for recommendations but keeps humans in the loop. ClaimPilot's escalation logic aligns with this.
- **They use OpenAI for comms.** Interesting that Allstate uses GPT, not Claude, for customer communications. ClaimPilot using Claude/Anthropic shows familiarity with the alternative the JD specifically mentions.

### Interview talking points
- "I noticed Allstate reduced claims filing from 4 minutes to 43 seconds. ClaimPilot targets the next bottleneck: the triage and assignment step that follows intake."
- "Your AI copilot handles 50K messages daily. ClaimPilot extends that pattern upstream, giving adjusters a pre-triaged claim with coverage verification and fraud screening before they even open it."
- "Tom Wilson said the new AI agent system can 'reason, resolve, and improve.' ClaimPilot demonstrates exactly that architecture with transparent, auditable reasoning."
- "Allstate's approach of small autonomous teams (8-12 people) is how I'd propose building and iterating on this internally."

## Sources

- [Allstate's cloud-first approach to digital transformation pays off (CIO)](https://www.cio.com/article/656205/allstates-cloud-first-approach-to-digital-transformation-pays-off.html)
- [Allstate's CIO leaning on gen AI (Fortune)](https://fortune.com/2025/01/08/how-allstates-cio-is-leaning-on-gen-ai-to-make-insurance-policy-coverage-and-claims-requests-more-effective-and-empathetic/)
- [Allstate CEO Touts New AI Agent System (AM Best)](https://news.ambest.com/newscontent.aspx?refnum=270450&altsrc=23)
- [Allstate CEO Says Bots Write Better Emails (Bloomberg Law)](https://news.bloomberglaw.com/insurance/allstate-ceo-says-bots-write-better-customer-emails-than-humans)
- [Arity reaches a trillion miles of data (Allstate Corporation)](https://www.allstatecorporation.com/stories/arity-collects-trillion-miles-of-data.aspx)
- [Allstate QuickFoto Claim (Claims Journal)](https://www.claimsjournal.com/news/national/2017/08/07/279831.htm)
- [Allstate to move away from physical inspections (Insurance Business)](https://www.insurancebusinessmag.com/us/news/breaking-news/allstate-to-move-away-from-physical-inspections-66880.aspx)
- [AI in Insurance Case Studies 2025 (CDP Center)](https://www.cdp.center/post/artificial-intelligence-in-insurance-major-companies-case-studies-2025)
