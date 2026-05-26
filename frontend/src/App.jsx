import React, { useState, useEffect } from 'react';
import { BiTask, BiSupport, BiTrendingUp } from 'react-icons/bi';
import ticketService from './services/ticketService';
import StatsStrip from './components/StatsStrip';
import FilterBar from './components/FilterBar';
import CreateTicketForm from './components/CreateTicketForm';
import Board from './components/Board';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    breached: 0,
  });
  const [filters, setFilters] = useState({
    priority: '',
    breached: false,
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tickets based on current filters
  const fetchTickets = async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketService.getTickets(currentFilters);
      setTickets(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  // Fetch global ticket statistics
  const fetchStats = async () => {
    try {
      const data = await ticketService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  // Load everything on initial mount and when filters change
  useEffect(() => {
    fetchTickets(filters);
  }, [filters]);

  // Load stats once on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Handle manual refresh
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ticketsData, statsData] = await Promise.all([
        ticketService.getTickets(filters),
        ticketService.getStats(),
      ]);
      setTickets(ticketsData);
      setStats(statsData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new ticket
  const handleCreateTicket = async (ticketData) => {
    setActionLoading(true);
    setError(null);
    try {
      await ticketService.createTicket(ticketData);
      // Refresh tickets and stats
      const [ticketsData, statsData] = await Promise.all([
        ticketService.getTickets(filters),
        ticketService.getStats(),
      ]);
      setTickets(ticketsData);
      setStats(statsData);
      return true; // Form fields will reset upon success
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create ticket');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Handle ticket status transitions
  const handleMoveStatus = async (id, newStatus) => {
    setActionLoading(true);
    setError(null);
    try {
      await ticketService.updateTicket(id, { status: newStatus });
      // Refresh tickets and stats
      const [ticketsData, statsData] = await Promise.all([
        ticketService.getTickets(filters),
        ticketService.getStats(),
      ]);
      setTickets(ticketsData);
      setStats(statsData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update ticket status');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle ticket deletion
  const handleDeleteTicket = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    setActionLoading(true);
    setError(null);
    try {
      await ticketService.deleteTicket(id);
      // Refresh tickets and stats
      const [ticketsData, statsData] = await Promise.all([
        ticketService.getTickets(filters),
        ticketService.getStats(),
      ]);
      setTickets(ticketsData);
      setStats(statsData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete ticket');
    } finally {
      setActionLoading(false);
    }
  };

  // Total active tickets (Open + In Progress)
  const totalActive = (stats.open || 0) + (stats.in_progress || stats.inProgress || 0);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-700 font-sans">
      {/* Premium Header/Navigation */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-xl text-white shadow-md shadow-indigo-500/20">
              <BiSupport className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent m-0 leading-none">
                DeskFlow
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                Service Desk Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Active Count Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5">
              <BiTask className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">Active Queue</span>
              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalActive}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Form Section */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <CreateTicketForm onSubmit={handleCreateTicket} loading={actionLoading} />
            
            {/* Context Stats / Info box */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <BiTrendingUp className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-sm tracking-wide uppercase">Operational Overview</h3>
              </div>
              <p className="text-xs text-indigo-200 leading-relaxed mb-4">
                Monitor status flows, prioritize urgent support cases, and resolve issues before breaching SLAs.
              </p>
              <div className="grid grid-cols-2 gap-3 border-t border-indigo-800/50 pt-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-indigo-300">Active Queue</span>
                  <span className="text-lg font-extrabold">{totalActive}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-indigo-300">Resolved Rate</span>
                  <span className="text-lg font-extrabold">
                    {stats.open + stats.in_progress + stats.resolved + stats.closed > 0
                      ? Math.round(
                          ((stats.resolved + stats.closed) /
                            (stats.open + stats.in_progress + stats.resolved + stats.closed)) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stats, Filters, and Kanban Board */}
          <div className="lg:col-span-3 space-y-6">
            {/* Overall stats strip */}
            <StatsStrip stats={stats} loading={loading} />

            {/* Filter controls */}
            <FilterBar filters={filters} onFilterChange={setFilters} onRefresh={handleRefresh} />

            {/* Error notifications */}
            {error && (
              <ErrorMessage message={error} onClose={() => setError(null)} />
            )}

            {/* Ticket representation */}
            {loading && tickets.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12">
                <Loader message="Loading tickets..." />
              </div>
            ) : (
              <Board
                tickets={tickets}
                onMoveStatus={handleMoveStatus}
                onDelete={handleDeleteTicket}
                loading={actionLoading}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} DeskFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
            <span>Desktop Optimized</span>
            <span className="h-3 w-px bg-gray-200"></span>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
