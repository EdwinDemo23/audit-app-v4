IRI Dashboard — Proposed Data
1. Header / Page Context
Dashboard

Good morning, Chethan

Here’s the current overview of audits, inspections,
reviews and vessel compliance activity.

Last updated: 21 Sep 2026, 10:42 AM

Optional controls:

[ All Fleets ▾ ]   [ Last 30 Days ▾ ]   [ Export ]
2. Primary KPI Cards

These should be the first thing users see.

Total Vessels
248
+12 this month

Active vessels
Active Audits
36
8 due this week

Audits currently in progress
Upcoming Audits
17
5 due in next 7 days

Scheduled audits
Open Findings
84
↓ 9% from last month

Outstanding findings
Open CARs
42
11 overdue

Corrective Action Requests
Certificates
231
7 expiring soon

Active certificates

I'd keep this to 5–6 cards maximum. The dashboard shouldn't become a wall of KPIs.

3. Audit Overview

This should be the primary visualization.

Audit Status
Audit Status

Completed       128
In Progress      36
Scheduled        17
Overdue           8
Draft             5

Visual:

Donut / segmented chart

             128
          Completed
        ┌─────────────┐
       /               \
      |      194        |
       \               /
        └─────────────┘

36 In Progress
17 Scheduled
8 Overdue
5 Draft

This gives the user an immediate answer to:

"What is the current state of our audits?"

4. Audit Activity

Use the structure/density idea from the first reference.

Audit Activity
Audit Activity

40 ┤                    ●
35 ┤             ●      │
30 ┤       ●     │      ●
25 ┤  ●    │     ●      │
20 ┤  │    ●     │      │
15 ┤  │    │     │      │
   └────────────────────────
     May  Jun  Jul  Aug  Sep

Data:

Month	Audits
May	24
Jun	29
Jul	27
Aug	34
Sep	38

Could eventually allow:

[ Audits ] [ Inspections ] [ Reviews ]
5. Upcoming Audits

This is one of the most important operational sections.

Upcoming Audits
Vessel	Audit Type	Auditor	Due Date	Status
MV Ocean Star	ISM Audit	R. Kumar	23 Sep	Scheduled
MT Pacific Dawn	ISM Audit	A. Thomas	24 Sep	Scheduled
MV Horizon	ISPS Audit	S. Joseph	26 Sep	Scheduled
MV Blue Wave	MLC Inspection	P. Singh	28 Sep	Pending
MT Sea Crest	ISM Audit	R. Kumar	30 Sep	Scheduled

Status chips:

Scheduled
Pending
In Progress
Overdue
Completed

This table should probably be one of the largest components on the dashboard.

6. Vessel Compliance

This gives the dashboard a maritime-specific identity.

Vessel Compliance
Compliance Overview

Compliant                 184
Attention Required         43
Non-Compliant              14
Under Review                7

Visual could be:

Horizontal stacked bar / segmented bar

Compliant       █████████████████████████
Attention       ██████
Non-Compliant   ██
Under Review    █

Then:

184 / 248 vessels compliant
74.2%
7. Findings & CAR Overview

This connects the Audit → Findings → CAR workflow.

Findings
Open Findings

Major       8
Moderate   27
Minor      49
CAR Status
Corrective Actions

Open          31
Under Review   7
Overdue        11
Closed        96

You could represent these as two compact cards side-by-side.

8. Certificate Expiry

Very relevant for the maritime context.

Certificate Expiry
Certificate Status

Expired                  3
Expires within 7 days    7
Expires within 30 days  18
Valid                  203

And a small list:

Vessel	Certificate	Expiry	Status
MV Ocean Star	SMC	24 Sep	3 days
MT Pacific Dawn	ISSC	29 Sep	8 days
MV Horizon	DOC	04 Oct	13 days

This creates an actionable dashboard rather than just analytics.

9. Recent Activity

Use the second reference's cleaner card treatment here.

Recent Activity
Recent Activity

● ISM Audit completed
  MV Ocean Star
  12 min ago

● Certificate uploaded
  MT Pacific Dawn
  34 min ago

● CAR submitted for review
  MV Horizon
  1 hr ago

● Audit scheduled
  MV Blue Wave
  2 hrs ago

● MLC Inspection completed
  MV Sea Crest
  3 hrs ago
10. Quick Actions

Rather than making the entire dashboard clickable cards like the old application, use a compact action area.

Quick Actions

[ + Create Audit ]

[ + Create Inspection ]

[ + Create Review ]

[ Search Vessel ]

[ Certificate Search ]

For the prototype, Create Audit → ISM Audit can actually work.

The others can remain placeholders.

11. Dashboard Information Architecture

Putting everything together:

DASHBOARD
│
├── Page Header
│   ├── Dashboard
│   ├── Welcome / Context
│   ├── Date Range
│   └── Fleet Filter
│
├── KPI Row
│   ├── Total Vessels
│   ├── Active Audits
│   ├── Upcoming Audits
│   ├── Open Findings
│   ├── Open CARs
│   └── Certificates
│
├── Operational Overview
│   ├── Audit Status
│   └── Audit Activity
│
├── Actionable Data
│   ├── Upcoming Audits
│   └── Certificate Expiry
│
├── Compliance
│   ├── Vessel Compliance
│   ├── Findings
│   └── CAR Status
│
└── Activity
    ├── Recent Activity
    └── Quick Actions
Recommended Desktop Layout

Following Image 1's structure but Image 2's visual language, I'd structure the page approximately like this:

┌───────────────────────────────────────────────────────────────┐
│ Sidebar │ Dashboard                         Filters   Profile │
├─────────┼─────────────────────────────────────────────────────┤
│         │                                                     │
│         │  KPI      KPI       KPI       KPI       KPI        │
│         │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│         │ │ 248  │ │ 36   │ │ 17   │ │ 84   │ │ 42   │     │
│         │ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘     │
│         │                                                     │
│         │ ┌──────────────────────┐ ┌──────────────────────┐ │
│         │ │ Audit Status          │ │ Audit Activity       │ │
│         │ │                      │ │                      │ │
│         │ │       DONUT          │ │      LINE CHART      │ │
│         │ │                      │ │                      │ │
│         │ └──────────────────────┘ └──────────────────────┘ │
│         │                                                     │
│         │ ┌────────────────────────────────────────────────┐ │
│         │ │ Upcoming Audits                                │ │
│         │ │                                                │ │
│         │ │ Vessel | Type | Auditor | Date | Status        │ │
│         │ │ ────────────────────────────────────────────── │ │
│         │ │                                                │ │
│         │ └────────────────────────────────────────────────┘ │
│         │                                                     │
│         │ ┌────────────────────┐ ┌────────────────────────┐ │
│         │ │ Vessel Compliance │ │ Certificate Expiry     │ │
│         │ │                    │ │                        │ │
│         │ └────────────────────┘ └────────────────────────┘ │
│         │                                                     │
└─────────┴─────────────────────────────────────────────────────┘
Visual Direction

For the look & feel, I would combine the references like this:

From Image 1
Dense enterprise information architecture
Strong data hierarchy
Large operational table
Filters
Status indicators
Multiple information modules
Dashboard designed for frequent professional use
From Image 2
Soft/light background
Large rounded cards
Generous whitespace
Clean typography
Minimal borders
Subtle shadows
Status chips
Small colorful accents
More approachable visual language
IRI-specific layer

Use your existing Marshall Islands identity rather than copying either reference:

Primary:
#0057BB

Dark text:
#1F2937

Background:
#F5F7FA

Success:
Green

Warning:
Amber

Critical:
Red

Neutral:
Gray

The colors should primarily communicate status, not decoration.

One important design decision

I would not make the dashboard overly chart-heavy.

For this application, the user needs to answer operational questions quickly:

What needs my attention?

So the priority should be:

KPIs → Upcoming/Overdue work → Audit status → Vessel compliance → Findings/CAR → Certificates → Activity

rather than:

Chart → Chart → Chart → Chart.