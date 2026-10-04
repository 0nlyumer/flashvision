import React, { useState, useEffect } from 'react';
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

  const allTabs = [
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
  ];

  const permittedTabs = allTabs.filter(tab => hasPermission('hr', tab.screenId));
  const defaultTab = permittedTabs.length > 0 ? permittedTabs[0].id : '';

  const currentTabInUrl = searchParams.get('tab');
  const initialActiveTab = (currentTabInUrl && permittedTabs.some(t => t.id === currentTabInUrl))
    ? currentTabInUrl
    : defaultTab;

  const [activeTab, setActiveTab] = useState(initialActiveTab);

  useEffect(() => {
    const targetTab = searchParams.get('tab') || defaultTab;
    if (targetTab && permittedTabs.some(t => t.id === targetTab) && targetTab !== activeTab) {
      if (window.hrAttendanceIsDirty) {
        const handleSearchParamsInterception = async () => {
          const proceed = await appConfirm(
            "Unsaved Changes Detected\n\nYou have unsaved progress in the Attendance Sheet. If you proceed, all unsaved entries will be discarded.\n\nAre you sure you wish to leave this screen without saving?",
            "Unsaved Progress",
            "Leave Without Saving",
            "Cancel & Stay"
          );
          if (proceed) {
            window.hrAttendanceIsDirty = false;
            if (window.hrAttendanceResetChanges) window.hrAttendanceResetChanges();
            setActiveTab(targetTab);
          } else {
            setSearchParams({ tab: activeTab }, { replace: true });
          }
        };
        handleSearchParamsInterception();
      } else {
        setActiveTab(targetTab);
      }
    } else if (!currentTabInUrl && defaultTab && activeTab !== defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [searchParams, defaultTab, permittedTabs]);

  const handleTabSelect = async (id) => {
    if (id === activeTab) return;

    if (window.hrAttendanceIsDirty) {
      const proceed = await appConfirm(
        "Unsaved Changes Detected\n\nYou have unsaved progress in the Attendance Sheet. If you proceed, all unsaved entries will be discarded.\n\nAre you sure you wish to leave this screen without saving?",
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
    setActiveTab(id);
    setSearchParams({ tab: id });
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
      <div key={activeTab} className="w-full max-w-full px-0 mx-0 h-full min-h-[calc(100vh-5rem)] flex flex-col flex-1 animate-in fade-in duration-200">
        {activeTab === 'dashboard' && <HRDashboard isMobile={isMobile} />}
        {activeTab === 'directory' && <HRDirectory isMobile={isMobile} />}
        {activeTab === 'onboarding' && <HROnboarding isMobile={isMobile} />}
        {activeTab === 'attendance' && <HRAttendance isMobile={isMobile} />}
        {activeTab === 'overtime' && <HROvertime isMobile={isMobile} />}
        {activeTab === 'leave' && <HRLeaveRequest isMobile={isMobile} />}
        {activeTab === 'loan' && <HRLoanRequest isMobile={isMobile} />}
        {activeTab === 'loanLedger' && <HRLoanLedger isMobile={isMobile} />}
        {activeTab === 'advance' && <HRAdvanceRequest isMobile={isMobile} />}
        {activeTab === 'salary' && <HRSalaryGeneration isMobile={isMobile} />}
        {activeTab === 'settings' && <HRSettings isMobile={isMobile} />}
      </div>
    </Layout>
  );
}

