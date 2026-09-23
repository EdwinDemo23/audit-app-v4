import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard/Dashboard';
import ISMAudit from './pages/ISMAudit/ISMAudit';
import PlaceholderPage from './pages/PlaceholderPage';
import './App.css';

/* Route-to-title mapping */
const PAGE_TITLES = {
  '/':              'Dashboard',
  '/audit/ism':     'ISM Audit',
  '/audit/isps':    'ISPS Audit',
  '/inspection/mlc':'MLC Inspection',
  '/review/ssp':    'SSP Review',
  '/review/dmlc':   'DMLC II Review',
  '/doc':           'DOC Creation / Search',
  '/ihm':           'IHM Part I Review',
  '/maintenance':   'Audit / Review Maintenance',
  '/car':           'CAR Maintenance / History',
  '/vessel':        'Vessel / Status Statement',
  '/certificate':   'Certificate Creation & Search',
};

function AppLayout() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'IRI Audit';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Header title={title} />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/audit/ism" element={<ISMAudit />} />
            <Route path="/audit/isps" element={<PlaceholderPage title="ISPS Audit" description="ISPS Audit module is scheduled for the next development phase." />} />
            <Route path="/inspection/mlc" element={<PlaceholderPage title="MLC Inspection" description="MLC Inspection module is under development." />} />
            <Route path="/review/ssp" element={<PlaceholderPage title="SSP Review" description="SSP Review module is under development." />} />
            <Route path="/review/dmlc" element={<PlaceholderPage title="DMLC II Review" description="DMLC II Review module is under development." />} />
            <Route path="/plan/*" element={<PlaceholderPage title="Plan Approval" description="Plan Approval modules are under development." />} />
            <Route path="/doc" element={<PlaceholderPage title="DOC Creation / Search" description="DOC module is under development." />} />
            <Route path="/ihm" element={<PlaceholderPage title="IHM Part I Review" description="IHM Part I Review is under development." />} />
            <Route path="/maintenance" element={<PlaceholderPage title="Audit / Review Maintenance" description="Maintenance module is under development." />} />
            <Route path="/car" element={<PlaceholderPage title="CAR Maintenance / History" description="CAR module is under development." />} />
            <Route path="/vessel" element={<PlaceholderPage title="Vessel / Status Statement" description="Vessel module is under development." />} />
            <Route path="/certificate" element={<PlaceholderPage title="Certificate Creation & Search" description="Certificate module is under development." />} />
            <Route path="*" element={<PlaceholderPage title="Page Not Found" description="The requested page could not be found." />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
