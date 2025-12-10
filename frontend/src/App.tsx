import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HelpCenter from './pages/HelpCenter';
import SupportDashboard from './pages/SupportDashboard';
import TicketDetail from './pages/TicketDetail';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 text-gray-900">
                <Routes>
                    <Route path="/" element={<Navigate to="/help-center" replace />} />
                    <Route path="/help-center" element={<HelpCenter />} />
                    <Route path="/help-center/tickets" element={<SupportDashboard />} />
                    <Route path="/help-center/tickets/:id" element={<TicketDetail />} />
                    <Route path="*" element={<HelpCenter />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
