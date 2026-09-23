Add Auditor Flow — ISM Audit
1. Create ISM Audit

User starts:

Create → Audit → ISM Audit

Search vessel by:
IMO Number
Vessel Name
Select the vessel.
Vessel / Company information populates.
Audit / Certificate information populates based on the selected audit subtype.

At this point, all Audit / Certificate fields are populated except:

Audit Place
Date fields that require user input
2. Default Auditor is automatically assigned

When the audit is created:

Edwin D — Auditor — Lead

is automatically added.

Name: Edwin D
ID: 838
Role: Auditor
Lead: Yes
This user is the logged-in user.
The Lead designation is locked.
Edwin D cannot be removed.

The user should not have to manually add themselves.

3. User chooses “Add Auditor”

Instead of opening the old large modal, the user enters a simple participant-management interaction.

Conceptually:

Audit Team

Edwin D · 838
Auditor · Lead

+ Add team member

The interface should make it obvious that this is about building the Audit Team, not filling another form.

4. Add team member

User clicks + Add team member.

A new participant entry appears.

User selects:

Role

Auditor
Observer
Reviewer

Then searches:

Name

Click → searchable dropdown opens
OR type the first few letters
Matching people are displayed from the database

Example:

Type: Pu

→

Punith Kumar
ID: 654

User selects the person.

5. ID automatically populates

After selecting the person:

Name: Punith Kumar
ID: 654

The ID is read-only.

The user never manually enters an ID.

This prevents incorrect auditor IDs.

6. One person = one role

The system validates that:

A person cannot be added twice.
A person cannot have multiple roles within the same audit.
The same person cannot simultaneously be Auditor + Observer + Reviewer.

Example:

If Punith Kumar is already an Observer, searching for Punith Kumar again should indicate that they are already part of the audit team.

7. Multiple team members

The user can continue adding members.

Example:

Audit Team

Edwin D — 838 — Auditor — Lead
BSOL Delete — 3456 — Auditor
Punith Kumar — 654 — Observer
Chibi SKM — 956 — Reviewer

Only Edwin D has the Lead designation.

8. Remove team member

For additional participants:

Remove

→ user clicks the remove control
→ participant is immediately removed.

No need for a complicated secondary screen.

Edwin D's remove control should either be unavailable or disabled because the Lead Auditor is mandatory.

9. Save team

Once the team is correct:

Save / Done

The team-management interaction closes/finishes.

The main ISM Audit screen now reflects the selected audit team.

10. Continue the audit

User returns to the ISM Audit creation flow.

The system now has:

Vessel
→ selected

Audit / Certificate
→ populated

Lead Auditor
→ Edwin D

Additional Audit Team
→ optional

Audit Place
→ user input

Required dates
→ user input

Then the user can proceed with:

Save / Create Audit

Important UX decision

I would structure the experience around this mental model:

CREATE ISM AUDIT
       ↓
SELECT VESSEL
       ↓
AUDIT / CERTIFICATE DETAILS
       ↓
AUDIT TEAM
   ├── Edwin D
   │   └── Lead Auditor
   │
   ├── + Add team member
   │       ↓
   │   Select Role
   │       ↓
   │   Search Person
   │       ↓
   │   ID Auto-populated
   │       ↓
   │   Add
   │
   └── Remove additional members
       ↓
AUDIT PLACE + REQUIRED DATES
       ↓
CREATE AUDIT
What I would avoid
❌ Large old-style popup
❌ Separate giant table with excessive columns
❌ Manually entering Auditor ID
❌ Radio button for Lead on every person
❌ Allowing users to choose another Lead
❌ Multiple screens just to add one person
❌ Confirmation popup every time someone is removed

The Lead Auditor should be implicit from the logged-in user, while everyone else is simply an additional audit-team member.