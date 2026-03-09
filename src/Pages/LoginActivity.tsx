import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import '../styles/loginactivity.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '@/API/interceptor';

// const api="http://localhost:8000/" // Unused, keeping it clean

export interface LoginActivity {
  id: number;
  user_id: number;
  email: string;
  ip_address: string;
  user_agent: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  status: "SUCCESS" | "FAILED" | string;
  failure_reason: string | null;
  login_time: string; 
  logout_time: string | null; 
  is_active: boolean;
  session_id: string | null;
}

// Interface for DRF's paginated response
interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LoginActivity[];
}

export default function LoginActivityDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate=useNavigate()
  // 1. Add state to track the current page
  const [page, setPage] = useState(1);

  // 2. Update fetch function to accept the page number
  const fetchLoginActivity = async ({ queryKey }: any):Promise<any>=> {
    // Extract the page from the queryKey array
    const [_key, pageParam] = queryKey; 
    
    // Notice we are appending ?p=pageParam to match your CustomPagination!

    const response = await api.get(`http://localhost:8000/admin/loginactivity/?p=${pageParam}`, {
      
    });
    console.log(response);
     return response.data;
  
  
    
  };

  // 3. Update useQuery to track the page dependency
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    isFetching // Useful for showing a loading spinner while keeping previous data on screen
  } = useQuery({
    queryKey: ['loginActivity', page], // Query refetches when `page` changes
    queryFn: fetchLoginActivity,
    placeholderData: keepPreviousData, // Keeps old data visible while fetching new page
  });

  // 4. Extract the actual array of logs from DRF's `results` property
  const logsArray = data?.results || [];

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const timeStringWithZone = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    const date = new Date(timeStringWithZone);
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  // 5. Filter the current page's logs
  const filteredLogs: LoginActivity[] = logsArray.filter((log: LoginActivity) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const emailMatch = log.email?.toLowerCase().includes(lowerCaseTerm);
    const ipMatch = log.ip_address?.toLowerCase().includes(lowerCaseTerm);
    return emailMatch || ipMatch;
  });

  const handleExportCSV = () => {
    if (!filteredLogs || filteredLogs.length === 0) return;
    const headers = ['ID', 'Email', 'IP Address', 'Client', 'Login Time', 'Logout Time', 'Status', 'Session Active'];
    const csvRows = filteredLogs.map(log => [
      log.id,
      log.email,
      log.ip_address,
      `"${(log.user_agent || '').replace(/"/g, '""')}"`,
      log.login_time || '-',
      log.logout_time || '-',
      log.status,
      log.is_active ? 'Yes' : 'No'
    ]);
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `login_activity_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <span>Loading logs...</span>
      </div>
    );
  }

  if (isError) {

  navigate("/login")
  
  }

  // Calculate total pages for the UI (Assuming page_size=10 in your Django backend)
  const totalPages = data?.count ? Math.ceil(data.count / 10) : 1;

  return (
    <div className="login-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Login Activity Monitor</h1>
        <span className="total-records">
          Showing: {filteredLogs.length} of {data?.count || 0} total records
        </span>
      </div>
      
      <div className="controls-container">
        <div className="controls-wrapper">
          <input 
            type="text" 
            placeholder="Search current page..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={handleExportCSV} 
            className="export-btn"
            disabled={!filteredLogs || filteredLogs.length === 0}
          >
            Export to CSV
          </button>
        </div>
      </div>

      <div className="table-container" style={{ opacity: isFetching ? 0.5 : 1 }}>
        <table className="activity-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>IP Address</th>
              <th>Client</th>
              <th>Login Time</th>
              <th>Logout Time</th>
              <th>Status</th>
              <th>Session</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="cell-bold cell-nowrap">#{log.id}</td>
                <td>{log.email}</td>
                <td className="cell-mono">{log.ip_address}</td>
                <td className="cell-truncate" title={log.user_agent || ""}>
                  {log.user_agent}
                </td>
                <td className="cell-nowrap">{formatDate(log.login_time)}</td>
                <td className="cell-nowrap">{formatDate(log.logout_time || "")}</td>
                <td>
                  <span className={`status-badge ${log.status === 'SUCCESS' ? 'status-success' : 'status-error'}`}>
                    {log.status}
                  </span>
                </td>
                <td className="cell-nowrap">
                  {log.is_active ? (
                    <span className="session-active"><span className="pulse-dot"></span> Active</span>
                  ) : (
                    <span className="session-ended">Ended</span>
                  )}
                </td>
              </tr>
            ))}
            
            {(!filteredLogs || filteredLogs.length === 0) && (
              <tr>
                <td colSpan={8} className="empty-state">
                  {searchTerm 
                    ? `No results found for "${searchTerm}" on this page` 
                    : "No login activity found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 6. Pagination UI Controls */}
      <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button 
          onClick={() => setPage(old => Math.max(old - 1, 1))} 
          disabled={page === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        
        <span style={{ alignSelf: 'center' }}>
          Page {page} of {totalPages}
        </span>
        
        <button 
          onClick={() => {
            if (data?.next) {
              setPage(old => old + 1);
            }
          }} 
          disabled={!data?.next}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}