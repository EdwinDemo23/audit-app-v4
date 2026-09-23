IRI ISM Audit — Updated Prototype Architecture
1. Product Architecture

The application is no longer structured around the old 7-card dashboard.

The new application structure is:

IRI Audit Application
│
├── Persistent Header
│
├── Sidebar Navigation
│
└── Main Content Area
    │
    ├── Dashboard                ← BUILD NOW
    │
    ├── Audit / Inspection / Review Creation
    │   ├── Audit
    │   │   ├── ISM Audit        ← BUILD NOW
    │   │   └── ISPS Audit
    │   │
    │   ├── Inspection
    │   │   └── MLC Inspection
    │   │
    │   ├── Review
    │   │   ├── SSP Review
    │   │   └── DMLC II Review
    │   │
    │   └── Plan Approval
    │       ├── SOPEP
    │       ├── STS
    │       ├── SMPEP
    │       ├── COW
    │       ├── BWS
    │       ├── VOC
    │       └── SDR
    │
    ├── DOC Creation / Search
    │
    ├── IHM Part I Review Creation
    │
    ├── Audit / Inspection / Review Maintenance
    │
    ├── CAR Maintenance / History
    │
    ├── Vessel / Status Statement
    │
    └── Certificate Creation and Search
2. Sidebar Navigation
Dashboard
Dashboard

This is now the actual operational dashboard.

It should contain:

Audit statistics
Vessel statistics
Audit status
Pending actions
Recent activity
Upcoming / scheduled audits
Findings / CAR overview
Other operational data

The old 7-card navigation UI should not be recreated.

Audit / Inspection / Review Creation
▾ Audit / Inspection / Review Creation

   ▾ Audit
      ├── ISM Audit
      └── ISPS Audit

   ▾ Inspection
      └── MLC Inspection

   ▾ Review
      ├── SSP Review
      └── DMLC II Review

   ▾ Plan Approval
      ├── SOPEP
      ├── STS
      ├── SMPEP
      ├── COW
      ├── BWS
      ├── VOC
      └── SDR
Current implementation

Only:

Audit / Inspection / Review Creation
    ↓
Audit
    ↓
ISM Audit

is being built as a complete workflow.

The other items exist as navigation destinations/placeholders only.

3. ISM Audit Architecture

The ISM Audit is the primary detailed workflow being built now.

Entry Flow
Dashboard / Sidebar
        ↓
Audit / Inspection / Review Creation
        ↓
Audit
        ↓
ISM Audit
        ↓
ISM Audit Workspace

The established ISM Audit workflow:

ISM Audit
   ↓
Search Vessel
   ↓
Select Vessel
   ↓
Vessel & Company
   ↓
Audit & Certificate
   ↓
Attachments
   ↓
Audit Summary
   ↓
Narrative Summary
   ↓
Signature
   ↓
Certificate History
4. ISM Audit — Navigation Inside the Workspace

Once the user enters ISM Audit, the audit-specific navigation should remain separate from the global application sidebar.

ISM AUDIT

├── Vessel / Company
├── Audit & Certificate
├── Attachments
├── Audit Summary
├── Narrative Summary
├── Signature
└── Certificate History
Current prototype implementation status
ISM Audit Section	Status
Vessel / Company	Functional
Audit & Certificate	Functional
Attachments	Functional
Audit Summary	Navigation / UI
Narrative Summary	Navigation / UI
Signature	Navigation / UI
Certificate History	Navigation / UI
5. ISM Audit — Initial Vessel Flow

The entry point should be vessel selection rather than immediately showing an empty audit form.

Open ISM Audit
      ↓
Search Vessel
      ↓
Search by:
• Vessel Name
• IMO
• Vessel ID
      ↓
Select Vessel
      ↓
Load Vessel Information

After vessel selection:

Vessel / Company
        ↓
Audit & Certificate
        ↓
Attachments

Relevant vessel/company information is automatically populated where available.

6. ISM Audit — Screen Architecture
A. Vessel / Company

Purpose:

Establish the vessel and company identity for the audit.

Vessel / Company
│
├── Vessel Identity
├── Vessel Details
├── Company Information
└── Related Information

Primary interaction:

Search → Select Vessel → Review Information
B. Audit & Certificate

Purpose:

Capture the audit and certificate-related information.

Audit & Certificate
│
├── Audit Information
├── Audit Type
├── Audit Dates
├── Auditor Information
├── Certificate Information
└── Related Audit Details

The existing audit/certificate architecture should be preserved.

C. Attachments

Purpose:

Manage supporting audit evidence/documents.

Attachments
│
├── Required Documents
├── Uploaded Documents
├── Document Status
└── Evidence

This acts as the evidence/document command center.

D. Audit Summary
Audit Summary

Provides the consolidated audit information.

Current prototype:

UI/navigation representation only.

E. Narrative Summary
Narrative Summary

For the audit narrative/report summary.

Current prototype:

UI/navigation representation only.

F. Signature
Signature

For audit/signatory information.

Current prototype:

UI/navigation representation only.

G. Certificate History
Certificate History

For historical certificate information.

Current prototype:

UI/navigation representation only.

7. Global Navigation vs ISM Audit Navigation

This distinction is important.

Global application navigation

Controls which application/module the user is working in.

Dashboard
Audit / Inspection / Review Creation
DOC Creation / Search
IHM Part I Review Creation
Audit / Inspection / Review Maintenance
CAR Maintenance / History
Vessel / Status Statement
Certificate Creation and Search
ISM Audit navigation

Controls which part of the current ISM Audit the user is working on.

Vessel / Company
Audit & Certificate
Attachments
Audit Summary
Narrative Summary
Signature
Certificate History

They should not be mixed into one navigation level.

8. Complete Application Navigation Map
IRI AUDIT APPLICATION
│
├── Dashboard                              [BUILD NOW]
│
├── Audit / Inspection / Review Creation
│   │
│   ├── Audit
│   │   ├── ISM Audit                      [BUILD NOW]
│   │   └── ISPS Audit                     [NAV ONLY]
│   │
│   ├── Inspection
│   │   └── MLC Inspection                 [NAV ONLY]
│   │
│   ├── Review
│   │   ├── SSP Review                     [NAV ONLY]
│   │   └── DMLC II Review                 [NAV ONLY]
│   │
│   └── Plan Approval
│       ├── SOPEP                          [NAV ONLY]
│       ├── STS                            [NAV ONLY]
│       ├── SMPEP                          [NAV ONLY]
│       ├── COW                            [NAV ONLY]
│       ├── BWS                            [NAV ONLY]
│       ├── VOC                            [NAV ONLY]
│       └── SDR                            [NAV ONLY]
│
├── DOC Creation / Search                  [NAV ONLY]
│
├── IHM Part I Review Creation             [NAV ONLY]
│
├── Audit / Inspection / Review Maintenance [NAV ONLY]
│
├── CAR Maintenance / History              [NAV ONLY]
│
├── Vessel / Status Statement              [NAV ONLY]
│
└── Certificate Creation and Search        [NAV ONLY]
9. Prototype Scope — Now

For this development phase, there are only two actual screens/modules to build:

01 — Dashboard
Sidebar
   ↓
Dashboard
   ↓
Operational data / charts / metrics
02 — ISM Audit
Sidebar
   ↓
Audit / Inspection / Review Creation
   ↓
Audit
   ↓
ISM Audit
   ↓
ISM Audit Workflow

Everything else is navigation architecture only.

10. Current Development Boundary
                    IRI AUDIT APPLICATION
                            │
             ┌──────────────┴──────────────┐
             │                             │
        DASHBOARD                       SIDEBAR
        BUILD NOW                    FULL NAVIGATION
             │                             │
      Charts / Metrics          ┌──────────┴──────────┐
      Audit Data                │                     │
      Status                    │                     │
      Activity             ISM AUDIT             OTHER MODULES
                            BUILD NOW              NAV ONLY
                               │
                    ┌──────────┴──────────┐
                    │                     │
              Vessel / Company     Audit & Certificate
                    │                     │
                    └──────────┬──────────┘
                               │
                         Attachments
                               │
                    ┌──────────┴──────────┐
                    │                     │
             Audit Summary       Narrative Summary
                    │                     │
                Signature        Certificate History
Core rule for this phase

Build the Dashboard + complete ISM Audit workflow.