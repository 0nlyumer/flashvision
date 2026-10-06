import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import HRDashboard from '../components/hr/HRDashboard';
import HRDirectory from '../components/hr/HRDirectory';
import HROnboarding from '../components/hr/HROnboarding';
import HRAttendance from '../components/hr/HRAttendance';
import HRSettings from '../components/hr/HRSettings';
import HROvertime from '../components/hr/HROvertime';
import HRLeaveRequest from '../components/hr/HRLeaveRequest';
import HRLoanRequest from '../components/hr/HRLoanRequest';
import HRLoanLedger from '../components/hr/HRLoanLedger';
import HRAdvanceRequest from '../components/hr/HRAdvanceRequest';
import HRSalaryGeneration from '../components/hr/HRSalaryGeneration';
import { useSearchParams } from 'react-router-dom';
import { useDialog } from '../context/DialogContext';
import { useApp } from '../context/AppContext';

export default function HRModule() {
  const { appConfirm } = useDialog();
  const { hasPermission } = useApp();
  const isMobile = false;
  const [searchParams, setSearchParams] = useSearchParams();

  const allTabs = useMemo(() => [
    { id: 'dashboard', screenId: 'hrDashboard', label: 'HR Dashboard', icon: 'dashboard' },
    { id: 'directory', screenId: 'hrDirectory', label: 'Employee Directory', icon: 'groups' },
    { id: 'onboarding', screenId: 'hrOnboarding', label: 'Onboarding Wizard', icon: 'person_add' },
    { id: 'attendance', screenId: 'hrAttendance', label: 'Attendance Management', icon: 'pending_actions' },
    { id: 'overtime', screenId: 'hrOvertime', label: 'Overtime Request', icon: 'more_time' },
    { id: 'leave', screenId: 'hrLeave', label: 'Leave Request', icon: 'event_busy' },
    { id: 'loan', screenId: 'hrLoan', label: 'Loan Request', icon: 'payments' },
    { id: 'loanLedger', screenId: 'hrLoanLedger', label: 'Loan Ledger', icon: 'menu_book' },
    { id: 'advance', screenId: 'hrAdvance', label: 'Advance Request', icon: 'account_balance' },
    { id: 'salary', screenId: 'hrSalary', label: 'Salary Generation', icon: 'account_balance_wallet' },
    { id: 'settings', screenId: 'hrSettings', label: 'HR Settings', icon: 'settings' }
  ], []);

  const permittedTabs = useMemo(() => {
    return allTabs.filter(tab => hasPermission ? hasPermission('hr', tab.screenId) : true);
  }, [allTabs, hasPermission]);

  const defaultTab = permittedTabs.length > 0 ? permittedTabs[0].id : 'dashboard';

  const tabInUrl = searchParams.get('tab');
  const validUrlTab = (tabInUrl && permittedTabs.some(t => t.id === tabInUrl)) ? tabInUrl : null;

  const [activeTab, setActiveTab] = useState(() => validUrlTab || defaultTab);

  // Visited tabs cache for instant 0ms tab switching & state preservation
  const [visitedTabs, setVisitedTabs] = useState(() => new Set([validUrlTab || defaultTab]));

  // Sync when browser Back/Forward is clicked
  useEffect(() => {
    if (validUrlTab && validUrlTab !== activeTab) {
      setActiveTab(validUrlTab);
      setVisitedTabs(prev => {
        if (prev.has(validUrlTab)) return prev;
        const next = new Set(prev);
        next.add(validUrlTab);
        return next;
      });
    }
  }, [validUrlTab, activeTab]);

  const handleTabSelect = async (id) => {
    if (id === activeTab) return;

    if (window.hrAttendanceIsDirty) {
      const proceed = await appConfirm(
        `Unsaved Changes Detected\n\nYou have unsaved progress in the Attendance Sheet. If you proceed, all unsaved entries will be discarded.\n\nAre you sure you wish to leave this screen without saving?`,
        "Unsaved Progress",
        "Leave Without Saving",
        "Cancel & Stay"
      );
      if (!proceed) {
        return; // stay on current tab
      }
      window.hrAttendanceIsDirty = false;
      if (window.hrAttendanceResetChanges) window.hrAttendanceResetChanges();
    }

    // Switch on the spot instantly!
    setActiveTab(id);
    setVisitedTabs(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setSearchParams({ tab: id }, { replace: true });
  };

  const subNavConfig = {
    title: "HR Management",
    moduleName: "hr",
    items: permittedTabs,
    activeId: activeTab,
    onSelect: handleTabSelect
  };

  return (
    <Layout subNavConfig={subNavConfig}>
      <div className="w-full max-w-full px-0 mx-0 h-full min-h-[calc(100vh-5rem)] flex flex-col flex-1">
        {visitedTabs.has('dashboard') && (
          <div style={{ display: activeTab === 'dashboard' ? 'flex' : 'none' }} className="flex-col flex-1 w-full animate-in fade-in duration-150">
            <HRDashboard isMobile={isMobile} />
          </div>
        )}
        {visitedTabs.has('directory') && (
          <div style={{ display: activeTab === 'directory' ? 'flex' : 'none' }} className="flex-col flex-1 w-full animate-in fade-in duration-150">
            <HRDirectory isMobile={isMobile} />
          </div>
        )}
        {visitedTabs.has('onboarding') && (
          <div style={{ display: activeTab === 'onboarding' ? 'flex' : 'none' }} className="flex-col flex-1 w-full animate-in fade-in duration-150">
            <HROnboarding isMobile={isMobile} />
          </div>
        )}
        {visitedTabs.has('attendance') && (
          <div style={{ display: activeTab === 'attendance' ? 'flex' : 'none' }} className="flex-col flex-1 w-full animate-in fade-in duration-150">
            <HRAttendance isMobile={isMobile} />
          </div>
        )}
        {visitedTabs.has('overtime') && (
          <div style={{ display: activeTab === 'overtime' ? 'flex' : 'none' }} className="flex-col flex-1 w-full animate-in fade-in duration-150">
            <HROvertime isMobile={isMobile} />
          </div>
        )}
        {visitedTabs.has('leave') && (
          <div style={{ display: activeTab === 'leave' ? 'flex' : 'none' }} className="flex-col flex-1 w-full animate-in fade-in duration-150">
            <HRLeaveRequest isMobile={isMobile} />
          </div>
        )}
        {visitedTabs.has('loan') && (
          <div style={{ display: activeTab === 'loan' ? 'flex' : 'none' }} className="flex-col flex-1 w-full animate-in fade-in duration-150">
            <HRLoanRequest isMobile={isMobile} />
          </div>
        )}
        {visitedTabs.has('loanLedger') && (
          <div style={{ display: activeTab === 'loanLedger' ? 'flex' : 'none' }} className="flex-col flex-1 w-full animate-in fade-in duration-150">
            <HRLoanLedger isMobile={isMobile} />
          </div>
        )}
        {visitedTabs.has('advance') && (
          <div style={{ display: activeTab === 'advance' ? 'flex' : 'none' }} className="flex-col flex-1 w-full animate-in fade-in duration-150">
            <HRAdvanceRequest isMobile={isMobile} />
          </div>
        )}
        {visitedTabs.has('salary') && (
          <div style={{ display: activeTab === 'salary' ? 'flex' : 'none' }} className="flex-col flex-1 w-full animate-in fade-in duration-150">
            <HRSalaryGeneration isMobile={isMobile} />
          </div>
        )}
        {visitedTabs.has('settings') && (
          <div style={{ display: activeTab === 'settings' ? 'flex' : 'none' }} className="flex-col flex-1 w-full animate-in fade-in duration-150">
            <HRSettings isMobile={isMobile} />
          </div>
        )}
      </div>
    </Layout>
  );
}
