IRI Audit — ISM Audit UI/UX Layout & Structure Specification

1. Objective

Redesign the IRI Audit / ISM Audit application as a polished, production-grade enterprise maritime SaaS product.

Priorities:

Professional alignment and visual consistency

Clear information hierarchy

Better spacing and density

Consistent typography, forms, buttons, cards and navigation

Professional dashboard KPI structure

Subtle maritime/ocean visual language

Responsive desktop behavior

WCAG 2.2 AA-oriented accessibility

Do not change business workflow, existing data, routing or functionality unless explicitly stated.

2. Visual Direction

Use the supplied modern dashboard reference as visual inspiration only. Do not copy it literally.

Desired visual language:

Clean enterprise SaaS dashboard

White/light cards

Light blue/ocean background

Subtle ocean/wave-inspired gradients

Rounded cards and controls

Soft shadows

Strong but restrained hierarchy

Compact navigation

Clear KPI cards

Very subtle nautical iconography

Primary color: #0057BB

Supporting palette:

Deep navy for sidebar/high-contrast text

Light blue surfaces

Soft blue borders

Green for success/verified/completed

Amber/orange for warnings

Red only for errors/destructive actions

Avoid excessive gradients, decoration and glassmorphism.

3. Application Layout

Maintain:

Global Top Header
        ↓
Vessel / Audit Context Header
        ↓
Sidebar | Audit Sections | Main Content
        ↓
Global Bottom Action Bar

Keep the fixed sidebar, audit-section navigation, main content, top header and bottom action bar.

Critical: the bottom action bar must start after the sidebar and must never overlap the sidebar.

Primary QA viewport: 1920 × 1080.

Also support 125%, 150%, smaller laptops and wider monitors.

Do NOT use:

Browser zoom manipulation

CSS transform: scale()

CSS zoom

Whole-page scaling

Use normal responsive CSS/layout.

4. Global Design System

Use an 8px spacing system:

4px micro

8px tight

12px compact

16px standard

24px section

32px major

Standardize:

Card padding

Input heights

Button heights

Border radius

Gaps

Shadows

Grid columns

Typography

5. Typography

Some audit pages currently use approximately 13px text, but bold text appears visually too large.

For:

Audit Summary

Auditor / Reviewer Signature

Narrative Report / Summary

Certificate History

Keep content compact, but reduce excessive boldness.

Use approximately:

400–500 for body/content

500–600 for labels/headings

700+ only when genuinely necessary

Do not make body copy oversized.

6. Global Top Header

Replace the current search/notification utility group with:

Info

Key / Access

Notification

PDF / Document

Keep user avatar, name, role and profile dropdown.

Use consistent icon size, spacing, hover/focus states and alignment.

7. Sidebar

Keep a compact fixed sidebar.

Existing navigation hierarchy can remain, including:

IRI Audit branding

Dashboard

Audit / Inspection / Review

Audit

ISM Audit

ISPS Audit

Inspection

Review

Plan Approval

Other existing navigation items

The active ISM Audit item must be clearly highlighted.

Use consistent icon/label alignment and subdued styling for inactive/disabled items.

8. ISM Audit — Required Sections

The ISM Audit must contain exactly 7 sections:

Vessel / Company

Audit / Certificate

Attachment to This Report

Audit Summary

Auditor / Reviewer Signature

Narrative Report / Summary

Certificate History

Remove every other Audit Section.

Section counter must use 1/7, 2/7, etc.

Do not add Findings / CAR as a separate Audit Section.

9. Section 1 — Vessel / Company

Use one single card/section only.

Do not split into multiple cards such as Vessel Identity, DOC or Historical Reference.

Required fields only:

Vessel Name

Vessel Type

Official No.

GRT (MT)

Company IMO No.

DOC Type

DOC Issuer

DOC Expiry

Name / Address of Company

Recommended desktop grid:

Vessel Name       Vessel Type       Official No.       GRT (MT)
Company IMO No.   DOC Type          DOC Issuer         DOC Expiry
Name / Address of Company

Company address spans the appropriate width.

10. Section 2 — Audit / Certificate

Use one single card/section.

Required fields:

Auditor Name — Filled: Edwin D

Auditor ID — Filled: 838

Audit Report No.

Audit Sub Type — Dropdown

Scope — Filled: Full Scope; Dropdown

Audit Date — Filled: 22-Sep-2026; Date selector

Audit Place

Audit Status — Dropdown

Certificate No.

Certificate Issued — Dropdown

Issue Date — Date selector

Expiry Date — Date selector

Internal Audit Date — Date selector

Opening Meeting Date — Date selector

Closing Meeting Date — Date selector

Credit Date — Date selector

Recommended 4-column desktop grid:

Auditor Name      Auditor ID        Audit Report No.      Audit Sub Type
Scope             Audit Date        Audit Place           Audit Status
Certificate No.   Certificate Issued Issue Date           Expiry Date
Internal Audit    Opening Meeting   Closing Meeting       Credit Date
Date              Date              Date                  Date

Keep all fields aligned and visually consistent.

11. Section 3 — Attachment to This Report

Use one clean attachment-management table.

Required attachment types:



Audit Plan



Attendance List

Certificate

Crew List

New File Attachment

Attachmentnewdemo

Attachmentdemo2

Attachmentdemo3

* means required.

User must clearly see:

Which document to upload

Required/optional status

Uploaded file name

File size where available

Upload status

Download action

Delete action

Uploaded row: file details + Attached status + Download + Delete.

Empty row: No file attached + Required/Optional + Upload.

Keep the table compact and scannable.

12. Section 4 — Audit Summary

Keep the statutory text/data exactly unchanged.

Intro:
The undersigned has carried out the above audit according to the ISM Code and found the vessel:

Options:

Is in compliance with the requirements of the ISM Code (auditSubType)

Is in compliance with the requirements of the ISM Code (auditSubType), Non-Conformity issued and corrective action plan shall be submitted by DD/MMM/YYYY

Is in compliance with the requirements of the ISM Code (auditSubType), Non-Conformity issued and corrective action plan shall be submitted by DD/MMM/YYYY and Additional audit to be completed by DD/MMM/YYYY

Is in compliance with the provisions of Section 14.0, Part B of the ISM Code (for Interim Audit)

Not approved, the audit was temporarily suspended due to the reasons stated in the Narrative report

Do not rewrite the statutory wording.

Improve only presentation using:

Clear radio selection

Strong hierarchy

Selected-state background/border

Appropriate status colors

Clear spacing

Supporting descriptions where already present

The visual treatment should help users understand the outcome category quickly without changing its meaning.

13. Section 5 — Auditor / Reviewer Signature

Keep existing data and functionality.

Improve:

Signature hierarchy

Auditor/reviewer identity

Signature status

Date/time where applicable

Approval/endorsement presentation

Typography

Avoid oversized bold text.

14. Section 6 — Narrative Report / Summary

Keep existing content and functionality.

Improve:

Text hierarchy

Reading width

Text area structure

Labels

Supporting metadata

Spacing

Do not make body copy unnecessarily bold or large.

15. Section 7 — Certificate History

Keep existing history/data.

Use a professional table or timeline-style structure where appropriate.

Prioritize:

Certificate number

Certificate type

Issue date

Expiry date

Status

Audit/reference information

Keep typography consistent with the rest of ISM Audit.

16. Vessel / Audit Context Header

Keep a compact vessel context card displaying:

Vessel name

IMO number

Official number

Flag

Vessel type

GRT

DOC holder/company

Report number

Lead auditor

Change Vessel

Lock/edit state

Do not allow this header to become excessively tall.

Use a clean alignment grid.

17. Audit Section Navigation

Visually distinguish:

Completed

Current

Upcoming

Use:

Numbered circles

Checkmarks for completed

Primary blue for current

Neutral styling for upcoming

Active section must be immediately identifiable.

Avoid unnecessary truncation of section titles.

18. Previous / Next Section

Use a consistent navigation card:

Previous Section       Section X of 7 · Section Name       Next Section

Align vertically and use consistent button sizing.

19. Global Bottom Action Bar

Required actions:

Back

Previous Finding

New Finding

Print Report

Certificate

Save

Keep it fixed/sticky and compact.

Critical: it must never cover the sidebar. It starts at the right edge of the sidebar and spans only the main application content.

Recommended styling:

Dark navy background

Compact height

Consistent buttons

Primary blue Save button

Clear secondary/primary hierarchy

20. Dashboard KPI Direction

Use the reference dashboard's KPI philosophy.

Prefer up to 5 KPI cards. Do not force five if only four meaningful metrics exist.

Possible audit KPIs, only when real data exists:

Active Audits

Audits Completed

Pending Audits

Non-Conformities

Certificates Expiring

Cards should have:

Clear label

Prominent value

Supporting context

Restrained visual indicator

Consistent height

Clean grid alignment

Do not invent metrics.

21. Dashboard Visual Language

Use:

White/light cards

Light blue surfaces

#0057BB accents

Subtle gradients

Rounded corners

Soft shadows

Compact charts

Strong KPI hierarchy

Prioritize readability over decoration.

Avoid excessive colors, gradients, illustrations, huge cards or excessive glassmorphism.

22. Alignment & Professional Polish

This is a high-priority requirement.

Review every screen for:

Left/right alignment

Shared column alignment

Consistent card widths

Appropriate card heights

Label/input alignment

Button alignment

Icon alignment

Vertical rhythm

Equal gutters

Consistent section spacing

Consistent radius

Consistent shadows

Consistent typography

All grids should share the same alignment system.

Avoid small visual shifts between cards/screens.

23. Accessibility

Target WCAG 2.2 AA.

Ensure:

Adequate contrast

Visible keyboard focus

Proper form labels

Accessible icon buttons

Tooltips for ambiguous icon-only controls

Radio buttons remain understandable

Color is never the only status indicator

Sufficient interaction targets

Logical tab order

Clear error states

24. Responsive Behavior

Desktop is primary.

At smaller widths:

Reduce columns progressively

Stack fields logically

Keep navigation usable

Prevent horizontal overflow

Keep actions accessible

Do not shrink text to unusable sizes

Do not scale the entire application.

25. Implementation Rules

Before editing:

Inspect the existing ISM Audit components/CSS.

Identify reusable components/styles.

Avoid duplicate CSS/components.

Preserve business logic.

Preserve data.

Preserve routing.

Preserve existing functionality.

Make systematic layout changes rather than isolated hacks.

Prefer reusable design tokens/classes.

Do not modify unrelated modules.

26. Definition of Done

The final result should feel like a deliberate, production-ready enterprise maritime product.

Required qualities:

Consistent 8px spacing

Strong alignment

Clear hierarchy

Compact/readable forms

Professional typography

Consistent cards/buttons

Clear audit navigation

Clean attachment management

Visually understandable audit outcomes

Professional KPI structure

Subtle maritime visual language

WCAG 2.2 AA-oriented accessibility

No unnecessary UI

No overlapping fixed elements

No horizontal overflow at normal desktop sizes