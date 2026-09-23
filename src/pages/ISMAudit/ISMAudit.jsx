import { useState, useEffect, useMemo } from 'react';
import Badge from '../../components/ui/Badge';
import {
  FLEET_REGISTRY,
  STATUTORY_CERTIFICATES,
  getVesselInitialAudit,
  getVesselAuditCertificateRecord,
} from './data/mockAuditData';

// Step Components
import VesselSearchStep from './components/VesselSearchStep';
import VesselCompanyStep from './components/VesselCompanyStep';
import AuditCertificateStep from './components/AuditCertificateStep';
import AttachmentsStep from './components/AttachmentsStep';
import AuditSummaryStep from './components/AuditSummaryStep';
import SignatureStep from './components/SignatureStep';
import NarrativeStep from './components/NarrativeStep';
import CertHistoryStep from './components/CertHistoryStep';

// Drawer & Modal Components
import AddAuditorDrawer from './components/AddAuditorDrawer';
import AddAttachmentModal from './components/AddAttachmentModal';
import NewFindingModal from './components/NewFindingModal';
import AuditSuccessModal from './components/AuditSuccessModal';

import './ISMAudit.css';

/* ============================================================
   ISM Audit Workflow Configuration (7 Steps)
   ============================================================ */
const AUDIT_STEPS = [
  { id: 'vessel-company', label: 'Vessel / Company', subtitle: 'Registry particulars & DOC info' },
  { id: 'audit-certificate', label: 'Audit / Certificate', subtitle: 'Scopes, certificate & auditor' },
  { id: 'attachments', label: 'Attachment to This Report', subtitle: 'Mandatory statutory filings' },
  { id: 'audit-summary', label: 'Audit Summary', subtitle: 'IMO compliance determination' },
  { id: 'signature', label: 'Auditor / Reviewer Signature', subtitle: 'Auditor & reviewer endorsement' },
  { id: 'narrative-summary', label: 'Narrative Report / Summary', subtitle: 'Executive report & meeting notes' },
  { id: 'cert-history', label: 'Certificate History', subtitle: 'Prior certificates & audits' },
];

export default function ISMAudit() {
  // Navigation State
  const [currentStep, setCurrentStep] = useState(0); // 0 = search, 1 = audit workspace
  const [auditStep, setAuditStep] = useState(0); // 0 to 6
  const [selectedVessel, setSelectedVessel] = useState(null);

  // Core Audit Parameters — Initialized empty; auto-populated in 2-step cascade
  const [auditData, setAuditData] = useState({
    auditReportNo: '',
    vesselImo: '',
    auditSubType: '', // Primary selector for certificate details
    scope: '',
    auditDate: '',
    auditPlace: '',
    auditStatus: 'COMMENCED',
    internalAuditDate: '', // Strictly Manual
    openingMeetingDate: '', // Strictly Manual
    closingMeetingDate: '', // Strictly Manual
    creditDate: '', // Strictly Manual
    auditorName: '',
    auditorId: '',
    certificateNo: '',
    certificateIssued: '',
    issueDate: '',
    expiryDate: '',
  });

  // Team Auditors - initialized with active inspector template
  const [auditors, setAuditors] = useState([
    {
      id: '838',
      name: 'Edwin D',
      email: 'edwin.d@bsolsystems.com',
      role: 'Lead Auditor',
      isLead: true,
      authorization: 'RMI-AUD-SR-0838',
      station: 'Singapore / SE Asia',
      signed: false,
      signedDate: null,
      delegated: false,
    },
  ]);

  // Attachments State (Includes mandatory documents)
  const [attachments, setAttachments] = useState([
    {
      id: 'ATT-001',
      name: 'ISM_Audit_Plan_Majuro.pdf',
      type: 'AUDIT PLAN',
      comments: 'Initial itinerary agreed with Master',
      size: '1.8 MB',
      uploadedDate: '25-Aug-2026',
      status: 'uploaded',
      required: true,
    },
    {
      id: 'ATT-002',
      name: 'Opening_Closing_Attendance.pdf',
      type: 'ATTENDANCE LIST',
      comments: 'Signed by Ship Command & Department Heads',
      size: '1.2 MB',
      uploadedDate: '25-Aug-2026',
      status: 'uploaded',
      required: true,
    },
  ]);

  // Findings State
  const [findings, setFindings] = useState([
    {
      id: 'FIND-001',
      type: 'Non-Conformity (NC)',
      elementCode: '6.0',
      elementTitle: 'Resources and Personnel',
      statement: 'Two newly joined engineering ratings did not possess signed documentation of shipboard SMS familiarization within 24 hours of joining, contrary to SMS Procedure 6.2.',
      correctiveAction: 'Master shall conduct immediate SMS familiarization, verify records in SMS logbook, and submit revised onboarding checklist.',
      capDueDate: '2026-09-24',
      targetClosureDate: '2026-11-23',
      status: 'Open',
      createdDate: '25-Aug-2026',
    },
  ]);

  // Audit Summary & Narrative State
  const [auditSummaryOption, setAuditSummaryOption] = useState(2); // Option 2 (NC issued, CAP required)
  const [additionalAuditDate, setAdditionalAuditDate] = useState('2026-11-25');
  const [narrativeText, setNarrativeText] = useState(
    `1. EXECUTIVE AUDIT SUMMARY:\nAn onboard International Safety Management (ISM) Code verification was executed on vessel CLEAR STARS (IMO 9868778) by Lead Auditor Edwin D. The audit verified shipboard implementation of the company Safety Management System (SMS) in compliance with IMO Resolution A.1071(28). All statutory documents, records, safety policies, and equipment maintenance protocols were systematically sampled.\n\n2. OPENING & CLOSING MEETINGS:\nThe Opening Meeting was convened in the ship's conference room with the Master, Chief Engineer, and key department heads. The audit scope and sampling criteria were confirmed. The Closing Meeting briefed the command on findings and agreed CAP timelines.\n\n3. AUDITOR RECOMMENDATION:\nVessel is found to be in substantial compliance with the requirements of the ISM Code. One minor Non-Conformity was raised regarding crew familiarization records. Certificate renewal is recommended upon acceptance of Corrective Action Plan.`
  );
  const [leadSignatureDate, setLeadSignatureDate] = useState('2026-09-22');
  const [operationalNotes, setOperationalNotes] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [vesselSwitchOn, setVesselSwitchOn] = useState(false);

  // Modals & UI Feedback State
  const [isAddAuditorOpen, setIsAddAuditorOpen] = useState(false);
  const [isAddAttachmentOpen, setIsAddAttachmentOpen] = useState(false);
  const [isNewFindingOpen, setIsNewFindingOpen] = useState(false);
  const [activeFindingIndex, setActiveFindingIndex] = useState(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handlePreviousFinding = () => {
    if (!findings || findings.length === 0) {
      setToastMessage('No recorded findings to review.');
      return;
    }
    const prevIndex = (activeFindingIndex - 1 + findings.length) % findings.length;
    setActiveFindingIndex(prevIndex);
    const f = findings[prevIndex];
    setToastMessage(`Viewing Finding ${prevIndex + 1} of ${findings.length}: [${f.id}] ${f.type}`);
  };

  // ── Dynamic Statutory Certificate Resolution ──
  // Resolves Certificate automatically when Vessel and Audit Sub Type are both selected
  const certificateData = useMemo(() => {
    if (!selectedVessel || !auditData.auditSubType) return null;
    return getVesselAuditCertificateRecord(selectedVessel, auditData.auditSubType);
  }, [selectedVessel, auditData.auditSubType]);

  // Sync Vessel IMO into Audit Data
  useEffect(() => {
    if (selectedVessel) {
      setAuditData(prev => ({
        ...prev,
        vesselImo: selectedVessel.imo || '',
      }));
    }
  }, [selectedVessel]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // ── 1. Vessel Selection Handler (Cascade Step 1) ──
  // Primary dependency: selectedVessel -> vesselDetails -> initialAudit (Auditor Name, ID, Audit Date)
  // Certificate-specific fields remain empty until Audit Sub Type is selected.
  // Manual fields retain their values.
  const handleVesselSelect = (vessel) => {
    setSelectedVessel(vessel);
    const initialAudit = getVesselInitialAudit(vessel);

    setAuditData(prev => {
      // If auditSubType was already selected, refresh certificate record; otherwise keep empty
      const certRecord = prev.auditSubType
        ? getVesselAuditCertificateRecord(vessel, prev.auditSubType)
        : null;

      return {
        ...prev,
        vesselImo: vessel.imo || '',
        // Initial auto-populated fields (Logged-in user Edwin D is default Lead Auditor):
        auditorName: 'Edwin D',
        auditorId: '838',
        auditDate: initialAudit?.auditDate || new Date().toISOString().split('T')[0],
        auditPlace: prev.auditPlace || initialAudit?.auditPlace || 'Port of Singapore, SGP',
        // Certificate-dependent fields: only populated if Audit Sub Type is already selected
        auditReportNo: certRecord ? certRecord.auditReportNo : '',
        scope: certRecord ? certRecord.scope : '',
        certificateNo: certRecord ? certRecord.certificateNo : '',
        certificateIssued: certRecord ? certRecord.certificateIssued : '',
        issueDate: certRecord ? certRecord.issueDate : '',
        expiryDate: certRecord ? certRecord.expiryDate : '',
        // Manual fields retain existing values
      };
    });

    // Default Lead Auditor is always the logged in user Edwin D (838)
    setAuditors(prev => {
      const otherMembers = prev.filter(a => a.id !== '838' && !a.isLead);
      return [
        {
          id: '838',
          name: 'Edwin D',
          email: 'edwin.d@bsolsystems.com',
          role: 'Lead Auditor',
          isLead: true,
          authorization: 'RMI-AUD-SR-0838',
          station: 'Singapore / SE Asia',
          signed: false,
          signedDate: null,
          delegated: false,
        },
        ...otherMembers,
      ];
    });

    setCurrentStep(1);
    setAuditStep(0);
    setToastMessage(`Vessel ${vessel.name} selected · Vessel particulars & initial auditor details loaded`);
  };

  // ── Vessel Reset Handler (Clear/recalculate all dependent auto-populated values) ──
  const handleResetVessel = () => {
    if (isLocked) {
      alert('This audit record is locked. Cannot change vessel while locked.');
      return;
    }
    setSelectedVessel(null);
    setAuditData({
      auditReportNo: '',
      vesselImo: '',
      auditSubType: '',
      scope: '',
      auditDate: '',
      auditPlace: '',
      auditStatus: 'COMMENCED',
      internalAuditDate: '',
      openingMeetingDate: '',
      closingMeetingDate: '',
      creditDate: '',
      auditorName: '',
      auditorId: '',
      certificateNo: '',
      certificateIssued: '',
      issueDate: '',
      expiryDate: '',
    });
    setCurrentStep(0);
    setAuditStep(0);
    setValidationErrors({});
    setToastMessage('Vessel unselected · Form reset');
  };

  // ── 2. Audit Data Change Handler (Cascade Step 2 & Manual Input) ──
  // Secondary dependency: selectedAuditSubType -> selectedAuditRecord (Report No, Scope, Cert No, Dates)
  // On changing Audit Sub Type: refresh ONLY fields dependent on Audit Sub Type.
  // Manual fields and initial auditor fields are strictly preserved.
  const handleAuditDataChange = (field, value) => {
    if (field === 'auditSubType') {
      if (value) {
        const certRecord = getVesselAuditCertificateRecord(selectedVessel, value);
        if (certRecord) {
          setAuditData(prev => ({
            ...prev,
            auditSubType: value,
            auditReportNo: certRecord.auditReportNo || '',
            scope: certRecord.scope || '',
            certificateNo: certRecord.certificateNo || '',
            certificateIssued: certRecord.certificateIssued || '',
            issueDate: certRecord.issueDate || '',
            expiryDate: certRecord.expiryDate || '',
          }));
          setToastMessage(`Audit Sub Type set to ${value} · Statutory certificate particulars updated`);
        } else {
          // If no matching record exists, keep these fields empty and allow manual behavior
          setAuditData(prev => ({
            ...prev,
            auditSubType: value,
            auditReportNo: '',
            scope: '',
            certificateNo: '',
            certificateIssued: '',
            issueDate: '',
            expiryDate: '',
          }));
          setToastMessage(`Audit Sub Type set to ${value} · No registered certificate record found; enter manually`);
        }
      } else {
        // Audit Sub Type cleared
        setAuditData(prev => ({
          ...prev,
          auditSubType: '',
          auditReportNo: '',
          scope: '',
          certificateNo: '',
          certificateIssued: '',
          issueDate: '',
          expiryDate: '',
        }));
      }
    } else {
      // Direct manual edits (internalAuditDate, openingMeetingDate, closingMeetingDate, creditDate, scope, cert particulars, etc.)
      setAuditData(prev => ({ ...prev, [field]: value }));
    }
    setValidationErrors(prev => ({ ...prev, [field]: null }));
  };

  // ── Auditor Handlers ──
  const handleAddAuditor = (newAuditorOrAuditors) => {
    const newItems = Array.isArray(newAuditorOrAuditors)
      ? newAuditorOrAuditors
      : [newAuditorOrAuditors];

    setAuditors(prev => {
      const updated = [...prev];
      newItems.forEach(newItem => {
        const idx = updated.findIndex(a => String(a.id) === String(newItem.id));
        if (idx >= 0) {
          // If not lead auditor (838), update member data
          if (!updated[idx].isLead && String(updated[idx].id) !== '838') {
            updated[idx] = { ...updated[idx], ...newItem };
          }
        } else {
          updated.push(newItem);
        }
      });
      return updated;
    });

    // Automatically bind the first auditor to active audit particulars if available
    const auditorItem = newItems.find(item => item.type === 'Auditor' || item.role === 'Auditor');
    if (auditorItem) {
      setAuditData(prev => ({
        ...prev,
        auditorName: auditorItem.name,
        auditorId: auditorItem.id,
        auditDate: auditorItem.auditDate || prev.auditDate,
        auditPlace: auditorItem.auditPlace || prev.auditPlace,
      }));
    }

    // Close the drawer and ensure state is on Audit / Certificate (Section index 1)
    setIsAddAuditorOpen(false);
    setCurrentStep(1);
    setAuditStep(1);

    setTimeout(() => {
      const certCard = document.querySelector('.ism-audit-cert-card');
      if (certCard) {
        certCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);

    setToastMessage(`${newItems.length} team member(s) saved successfully · Viewing Audit / Certificate`);
  };

  const handleRemoveAuditor = (id) => {
    if (String(id) === '838') {
      setToastMessage('Lead Auditor Edwin D cannot be removed');
      return;
    }
    setAuditors(prev => prev.filter(a => String(a.id) !== String(id)));
    setAuditData(prev => {
      if (String(prev.auditorId) === String(id)) {
        return {
          ...prev,
          auditorName: 'Edwin D',
          auditorId: '838',
        };
      }
      return prev;
    });
    setToastMessage('Team member removed from audit');
  };

  // ── Attachments Handlers ──
  const handleAttachFile = (attachmentType, file) => {
    const sizeStr =
      file.size < 1024 * 1024
        ? `${Math.max(1, Math.round(file.size / 1024))} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    const newDoc = {
      id: `ATT-${Date.now()}`,
      name: file.name,
      type: attachmentType,
      size: sizeStr,
      uploadedDate: '22-Sep-2026',
      status: 'uploaded',
      required: attachmentType === 'Audit Plan' || attachmentType === 'Attendance List',
    };

    setAttachments(prev => {
      const filtered = prev.filter(
        a => a.type?.toUpperCase().trim() !== attachmentType.toUpperCase().trim()
      );
      return [...filtered, newDoc];
    });
  };

  const handleAddAttachments = (newFiles) => {
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
    setToastMessage('Document removed from audit report');
  };

  // ── Findings Handlers ──
  const handleSaveFinding = (newFinding) => {
    setFindings(prev => [...prev, newFinding]);
    setAuditSummaryOption(2); // Automatically set to option 2 (NC issued, CAP required)
    setToastMessage(`Finding ${newFinding.id} recorded successfully`);
  };

  const handleRemoveFinding = (id) => {
    setFindings(prev => prev.filter(f => f.id !== id));
    setToastMessage('Finding deleted');
  };

  // ── Signature Handlers ──
  const handleAttachSignature = (auditorId) => {
    setAuditors(prev =>
      prev.map(a => {
        if (a.id === auditorId) {
          return {
            ...a,
            signed: true,
            signedDate: leadSignatureDate || '2026-08-25',
            delegated: false,
          };
        }
        return a;
      })
    );
    setToastMessage('Digital cryptographic signature attached');
  };

  const handleDelegateSignature = (auditorId) => {
    setAuditors(prev =>
      prev.map(a => (a.id === auditorId ? { ...a, delegated: true, signed: false } : a))
    );
    setToastMessage('Signing authority delegated to Lead Auditor');
  };

  const handleRemoveSignature = (auditorId) => {
    setAuditors(prev =>
      prev.map(a => (a.id === auditorId ? { ...a, signed: false, delegated: false } : a))
    );
    setToastMessage('Digital signature cleared');
  };

  // ── Multi-Point Validation Engine (V-01 to V-09) ──
  const runValidation = (isSubmitting = false) => {
    const errors = {};

    if (!selectedVessel) {
      errors.vessel = 'A registered vessel must be selected.';
    }

    if (!auditData.auditSubType) {
      errors.auditSubType = 'Audit Sub Type is mandatory.';
    }

    if (!auditData.auditDate) {
      errors.auditDate = 'Audit Date is required.';
    }

    if (!auditData.auditPlace || !auditData.auditPlace.trim()) {
      errors.auditPlace = 'Audit Place (Port/City) is required.';
    }

    // Meeting dates chronological verification (allow same-day meeting conferences)
    if (auditData.openingMeetingDate && auditData.closingMeetingDate) {
      const openTime = new Date(auditData.openingMeetingDate).getTime();
      const closeTime = new Date(auditData.closingMeetingDate).getTime();
      if (closeTime < openTime) {
        errors.meetingDates = 'Closing meeting date cannot take place before opening meeting date.';
      }
    }

    // Mandatory attachments check
    const hasAuditPlan = attachments.some(a => a.type === 'AUDIT PLAN');
    const hasAttendance = attachments.some(a => a.type === 'ATTENDANCE LIST');
    if (!hasAuditPlan || !hasAttendance) {
      errors.attachments = 'Mandatory documents missing: Both AUDIT PLAN and ATTENDANCE LIST must be uploaded.';
    }

    // Narrative content check
    if (!narrativeText || narrativeText.trim().length < 20) {
      errors.narrative = 'Narrative summary must be filled with executive audit notes.';
    }

    // Findings vs Summary check
    if (findings.length > 0 && auditSummaryOption === 1) {
      errors.summary = 'Audit Summary contradicts findings: Non-conformities are logged, so clean compliance cannot be selected.';
    }

    // Signature check on submit
    if (isSubmitting) {
      const leadAuditor = auditors.find(a => a.isLead || a.role === 'Lead Auditor' || a.id === '838');
      if (!leadAuditor || !leadAuditor.signed) {
        errors.signature = 'Lead Auditor signature must be attached before final submission.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Standalone Validate Action (Supports Validate -> Save flow) ──
  const handleValidate = () => {
    const isValid = runValidation(false);
    if (isValid) {
      setToastMessage('Validation Passed: All mandatory fields and audit criteria satisfied.');
    } else {
      setToastMessage('Validation Notice: Please check the highlighted fields.');
    }
    return isValid;
  };

  // ── Save Draft Action ──
  const handleSaveDraft = () => {
    const isValid = runValidation(false);
    if (!isValid) {
      setToastMessage('Please review the highlighted validation notices.');
      return;
    }
    setToastMessage('Audit Draft saved successfully (State: COMMENCED)');
  };

  // ── Submit Audit Action ──
  const handleSubmitAudit = () => {
    const isValid = runValidation(true);
    if (!isValid) {
      setToastMessage('Validation failed: Complete all mandatory items and signature before submitting.');
      // Auto-focus user on the first failing step
      if (validationErrors.attachments) {
        setAuditStep(2);
      } else if (validationErrors.narrative) {
        setAuditStep(5);
      } else if (validationErrors.signature) {
        setAuditStep(4);
      } else if (validationErrors.auditDate || validationErrors.auditPlace) {
        setAuditStep(1);
      }
      return;
    }

    // Successful Submission
    setIsLocked(true);
    setVesselSwitchOn(true);
    setAuditData(prev => ({ ...prev, auditStatus: 'COMPLETED' }));
    setIsSuccessModalOpen(true);
    setToastMessage('Lock Applied Successfully · ISM Audit Formally Submitted');
  };

  // ── Reset for New Audit ──
  const handleResetForNewAudit = () => {
    setIsSuccessModalOpen(false);
    setIsLocked(false);
    setVesselSwitchOn(false);
    setSelectedVessel(null);
    setCurrentStep(0);
    setAuditStep(0);
    setFindings([]);
    setAuditors([
      {
        id: '838',
        name: 'Edwin D',
        email: 'edwin.d@bsolsystems.com',
        role: 'Lead Auditor',
        isLead: true,
        authorization: 'RMI-AUD-SR-0838',
        station: 'Singapore / SE Asia',
        signed: false,
        signedDate: null,
        delegated: false,
      },
    ]);
    setAuditData(prev => ({
      ...prev,
      auditorName: 'Edwin D',
      auditorId: '838',
    }));
    setValidationErrors({});
    setToastMessage('Ready to create new ISM audit');
  };

  // ── Render Content based on Current Step & Audit Step ──
  const renderStepContent = () => {
    if (currentStep === 0) {
      return <VesselSearchStep onSelect={handleVesselSelect} />;
    }

    switch (auditStep) {
      case 0:
        return <VesselCompanyStep vessel={selectedVessel} />;
      case 1:
        return (
          <AuditCertificateStep
            auditData={auditData}
            onAuditDataChange={handleAuditDataChange}
            certificateData={certificateData}
            auditors={auditors}
            onOpenAddAuditor={() => setIsAddAuditorOpen(true)}
            onRemoveAuditor={handleRemoveAuditor}
            validationErrors={validationErrors}
            isLocked={isLocked}
          />
        );
      case 2:
        return (
          <AttachmentsStep
            attachments={attachments}
            onAttachFile={handleAttachFile}
            onRemoveAttachment={handleRemoveAttachment}
            isLocked={isLocked}
          />
        );
      case 3:
        return (
          <AuditSummaryStep
            auditSummaryOption={auditSummaryOption}
            onOptionChange={setAuditSummaryOption}
            auditSubType={auditData.auditSubType}
            findings={findings}
            additionalAuditDate={additionalAuditDate}
            onAdditionalAuditDateChange={setAdditionalAuditDate}
            isLocked={isLocked}
          />
        );
      case 4:
        return (
          <SignatureStep
            auditors={auditors}
            onAttachSignature={handleAttachSignature}
            onDelegateSignature={handleDelegateSignature}
            onRemoveSignature={handleRemoveSignature}
            leadSignatureDate={leadSignatureDate}
            onDateChange={setLeadSignatureDate}
            isLocked={isLocked}
          />
        );
      case 5:
        return (
          <NarrativeStep
            narrativeText={narrativeText}
            onNarrativeChange={setNarrativeText}
            vessel={selectedVessel}
            auditReportNo={auditData.auditReportNo}
            validationError={validationErrors.narrative}
            isLocked={isLocked}
          />
        );
      case 6:
        return <CertHistoryStep vessel={selectedVessel} />;
      default:
        return null;
    }
  };

  return (
    <div className="ent-ism-page">


      {/* ── System Feedback Toast matching Screenshot 115544 ── */}
      {toastMessage && (
        <div className="ism-toast-notification">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
          <button type="button" className="ism-toast-close" onClick={() => setToastMessage('')}>
            ✕
          </button>
        </div>
      )}


      {/* ── Active Vessel Context Bar (Sticky Strip) matching Screenshot 110453 ── */}
      {selectedVessel && (
        <div className="ism-vessel-bar">
          <div className="ism-vessel-bar__left">
            <div className="ism-vessel-bar__flag-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>
            <div className="ism-vessel-bar__details">
              <div className="ism-vessel-bar__name-row">
                <span className="ism-vessel-bar__name">{selectedVessel.name}</span>
                <span className="ism-mono-tag">IMO {selectedVessel.imo}</span>
                <span className="ism-mono-tag">Official: {selectedVessel.officialNo}</span>
                <Badge variant="success" size="sm">
                  {selectedVessel.flag}
                </Badge>
              </div>
              <div className="ism-vessel-bar__meta-row">
                <span>{selectedVessel.type}</span>
                <span className="ent-dot-sep">·</span>
                <span>GRT: {selectedVessel.gt} MT</span>
                <span className="ent-dot-sep">·</span>
                <span>DOC Holder: {selectedVessel.company.name}</span>
                <span className="ent-dot-sep">·</span>
                <span>Port: {selectedVessel.port}</span>
              </div>
            </div>
          </div>

          <div className="ism-vessel-bar__right">
            <div className="ism-vessel-bar__audit-badge">
              <span className="ism-vessel-bar__audit-num">Report No: {auditData.auditReportNo || 'Pending Sub Type'}</span>
              <span className="ism-vessel-bar__lead-auditor">Lead Auditor: {auditData.auditorName || 'Unassigned'} ({auditData.auditorId || '—'})</span>
            </div>

            {/* Divider separating audit badge from switch */}
            <div className="ism-vessel-bar__divider" />

            {/* Status Switch (ON: Red, OFF: Green) */}
            <div className="ism-vessel-switch-group">
              <button
                type="button"
                role="switch"
                aria-checked={vesselSwitchOn}
                onClick={() => {
                  const nextVal = !vesselSwitchOn;
                  setVesselSwitchOn(nextVal);
                  setIsLocked(nextVal);
                }}
                className={`ism-vessel-toggle-switch ${vesselSwitchOn ? 'is-on' : 'is-off'}`}
                title={`Vessel Status Switch: ${vesselSwitchOn ? 'ON (Red)' : 'OFF (Green)'} — Click to toggle`}
              >
                <span className="ism-vessel-toggle-track">
                  <span className="ism-vessel-toggle-thumb" />
                </span>
                <span className="ism-vessel-toggle-label">{vesselSwitchOn ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Divider separating switch from actions */}
            {/* {!isLocked && (
              <>
                <div className="ism-vessel-bar__divider" />
                <button
                  type="button"
                  className="ent-btn ent-btn--secondary ent-btn--sm"
                  onClick={handleResetVessel}
                  title="Select another vessel from registry"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  <span>Change Vessel</span>
                </button>
              </>
            )} */}
          </div>
        </div>
      )}

      {/* ── Main Workflow Body ── */}
      <div className={`ism-workspace ${currentStep === 0 ? 'ism-workspace--full' : ''}`}>
        {/* Left Step Navigation Rail (Only when vessel is selected) */}
        {currentStep > 0 && (
          <aside className="ism-rail" aria-label="ISM Audit Workflow Sections">
            <div className="ism-rail__header">
              <span className="ism-rail__title">Audit Sections</span>
              <span className="ism-rail__count">
                {auditStep + 1}/7
              </span>
            </div>

            <div className="ism-rail__steps">
              {AUDIT_STEPS.map((step, idx) => {
                const isCompleted = idx < auditStep;
                const isCurrent = idx === auditStep;
                const statusClass = isCompleted ? 'done' : isCurrent ? 'current' : 'upcoming';

                return (
                  <button
                    key={step.id}
                    type="button"
                    className={`ism-rail__step ism-rail__step--${statusClass}`}
                    onClick={() => setAuditStep(idx)}
                    id={`ism-step-${idx}`}
                  >
                    <div className={`ism-rail__bullet ism-rail__bullet--${statusClass}`}>
                      {isCompleted ? (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div className="ism-rail__text">
                      <div className="ism-rail__step-label">{step.label}</div>
                      <div className="ism-rail__step-sub">{step.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Center / Right Form Content Area */}
        <main className="ism-stage">
          {renderStepContent()}

          {/* Stepper Navigation Footer */}
          {currentStep > 0 && (
            <div className="ism-stepper-footer">
              <button
                type="button"
                className="ent-btn ent-btn--secondary"
                disabled={auditStep === 0}
                onClick={() => setAuditStep(Math.max(0, auditStep - 1))}
                id="ism-prev"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>Previous Section</span>
              </button>

              <div className="ism-stepper-indicator">
                <span>Section {auditStep + 1} of 7</span>
                <span className="ent-dot-sep">·</span>
                <span className="ism-stepper-indicator__title">{AUDIT_STEPS[auditStep].label}</span>
              </div>

              <button
                type="button"
                className="ent-btn ent-btn--primary"
                disabled={auditStep === AUDIT_STEPS.length - 1}
                onClick={() => setAuditStep(Math.min(AUDIT_STEPS.length - 1, auditStep + 1))}
                id="ism-next"
              >
                <span>Next Section</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── Persistent Bottom Action Bar matching Screenshot 110301 ── */}
      {currentStep > 0 && (
        <footer className="ism-legacy-action-bar">
          <div className="ism-legacy-action-bar__content">
            <button
              type="button"
              className="ism-action-bar-btn"
              onClick={handleResetVessel}
              id="ism-bottom-back"
            >
              Back
            </button>

            <button
              type="button"
              className="ism-action-bar-btn"
              onClick={handlePreviousFinding}
              id="ism-bottom-prev-finding"
            >
              Previous Finding
            </button>

            <button
              type="button"
              className="ism-action-bar-btn"
              onClick={() => setIsNewFindingOpen(true)}
              id="ism-bottom-new-finding"
            >
              New Finding
            </button>

            <button
              type="button"
              className="ism-action-bar-btn"
              onClick={() => {
                window.print();
              }}
              id="ism-bottom-print"
            >
              Print Report
            </button>

            <button
              type="button"
              className="ism-action-bar-btn"
              onClick={() => {
                setAuditStep(6);
                setToastMessage('Navigated to Statutory Certificate Records');
              }}
              id="ism-bottom-certificate"
            >
              Certificate
            </button>

            <button
              type="button"
              className="ism-action-bar-btn ism-action-bar-btn--save"
              onClick={handleSubmitAudit}
              id="ism-bottom-save"
            >
              Save
            </button>
          </div>
        </footer>
      )}

      {/* ── Drawers & Modals ── */}
      <AddAuditorDrawer
        isOpen={isAddAuditorOpen}
        onClose={() => setIsAddAuditorOpen(false)}
        onSaveAuditor={handleAddAuditor}
        onSaveAuditors={handleAddAuditor}
        currentAuditors={auditors}
        onRemoveAuditor={handleRemoveAuditor}
        defaultAuditDate={auditData.auditDate}
        defaultAuditPlace={auditData.auditPlace}
      />

      <AddAttachmentModal
        isOpen={isAddAttachmentOpen}
        onClose={() => setIsAddAttachmentOpen(false)}
        onAddAttachments={handleAddAttachments}
      />

      <NewFindingModal
        isOpen={isNewFindingOpen}
        onClose={() => setIsNewFindingOpen(false)}
        onSaveFinding={handleSaveFinding}
        vessel={selectedVessel}
        auditReportNo={auditData.auditReportNo}
      />

      <AuditSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        auditData={auditData}
        vessel={selectedVessel}
        findings={findings}
        onResetForNewAudit={handleResetForNewAudit}
      />
    </div>
  );
}
