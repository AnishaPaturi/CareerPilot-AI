import { useState, useEffect } from 'react';
import { drivesAPI, applicationsAPI, studentsAPI } from '../services/api';
import { Briefcase, Users, CheckCircle, FileText, Plus, Search, Calendar, ChevronRight, User, AlertCircle, RefreshCw, Star } from 'lucide-react';

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('drives');
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  
  // Search and filters
  const [driveSearch, setDriveSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  
  // Post drive form state
  const [newDrive, setNewDrive] = useState({
    companyName: '',
    role: '',
    packageLpa: '',
    minCgpa: '',
    allowedBranches: '',
    driveDate: ''
  });
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [drivesData, appsData, studentsData] = await Promise.all([
        drivesAPI.getAll(),
        applicationsAPI.getAll(),
        studentsAPI.getAll()
      ]);
      setDrives(drivesData);
      setApplications(appsData);
      setStudents(studentsData);
    } catch (err) {
      console.error("Failed to fetch recruiter portal data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostDrive = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });
    try {
      await drivesAPI.create(newDrive);
      setFormMsg({ type: 'success', text: 'Placement drive posted successfully!' });
      setNewDrive({ companyName: '', role: '', packageLpa: '', minCgpa: '', allowedBranches: '', driveDate: '' });
      fetchData();
    } catch (err) {
      setFormMsg({ type: 'error', text: err.message || 'Failed to post drive.' });
    }
  };

  const handleRunShortlisting = async (driveId) => {
    setActionLoading(`shortlist-${driveId}`);
    try {
      const shortlisted = await drivesAPI.shortlist(driveId);
      alert(`Shortlisting complete! ${shortlisted.length} candidate(s) met the criteria and were shortlisted.`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to run shortlisting: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationsAPI.updateStatus(appId, newStatus);
      setApplications(prev =>
        prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
      );
    } catch (err) {
      alert('Failed to update application status: ' + err.message);
    }
  };

  // Filtered drives
  const filteredDrives = drives.filter(d => 
    d.companyName?.toLowerCase().includes(driveSearch.toLowerCase()) ||
    d.role?.toLowerCase().includes(driveSearch.toLowerCase())
  );

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const term = appSearch.toLowerCase();
    const matchTerm = 
      app.studentName?.toLowerCase().includes(term) ||
      app.companyName?.toLowerCase().includes(term) ||
      app.role?.toLowerCase().includes(term) ||
      app.status?.toLowerCase().includes(term);
    return matchTerm;
  });

  // Filtered students
  const filteredStudents = students.filter(s => {
    const term = studentSearch.toLowerCase();
    const matchTerm = s.name?.toLowerCase().includes(term) || s.email?.toLowerCase().includes(term) || s.skills?.toLowerCase().includes(term);
    const matchBranch = branchFilter ? s.branch === branchFilter : true;
    return matchTerm && matchBranch;
  });

  // Extract unique branches for dropdown filter
  const branches = [...new Set(students.map(s => s.branch).filter(Boolean))];

  // Statistics calculations
  const totalDrives = drives.length;
  const totalApplicants = students.length;
  const totalApplications = applications.length;
  const totalSelected = applications.filter(a => a.status === 'SELECTED').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <RefreshCw className="animate-spin text-purple-500" size={24} />
        <span>Loading Recruiter Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Drives</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <Briefcase size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{totalDrives}</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Candidates</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
              <Users size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{totalApplicants}</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Job Applications</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
              <FileText size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{totalApplications}</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Offers Placed</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{totalSelected}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/[0.08] gap-4">
        {[
          { id: 'drives', label: 'Placement Drives', count: drives.length },
          { id: 'applications', label: 'Review Applicants', count: applications.length },
          { id: 'students', label: 'Student Directory', count: students.length },
          { id: 'post-drive', label: 'Post New Job/Drive' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-all relative ${
              activeTab === tab.id ? 'text-purple-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-bold">
                  {tab.count}
                </span>
              )}
            </span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {/* Drives Tab */}
        {activeTab === 'drives' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 max-w-md bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2">
              <Search size={16} className="text-slate-500" />
              <input
                type="text"
                placeholder="Search active drives..."
                value={driveSearch}
                onChange={e => setDriveSearch(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm text-white w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDrives.map(drive => (
                <div key={drive.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.04] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{drive.role}</h3>
                        <p className="text-purple-400 text-sm">{drive.companyName}</p>
                      </div>
                      <span className="bg-purple-500/10 text-purple-400 text-xs px-2.5 py-1 rounded-full font-bold border border-purple-500/20">
                        {drive.packageLpa} LPA
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-500" />
                        <span>Date: {new Date(drive.driveDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star size={13} className="text-slate-500" />
                        <span>Min CGPA: {drive.minCgpa || 'N/A'}</span>
                      </div>
                      <div className="col-span-2 mt-1">
                        <span className="text-slate-500">Eligibility:</span>{' '}
                        <span className="text-slate-300 font-mono">
                          {typeof drive.allowedBranches === 'string'
                            ? drive.allowedBranches
                            : JSON.stringify(drive.allowedBranches || 'CSE, IT')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      ID: #{drive.id}
                    </span>
                    <button
                      onClick={() => handleRunShortlisting(drive.id)}
                      disabled={actionLoading === `shortlist-${drive.id}`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      {actionLoading === `shortlist-${drive.id}` ? (
                        <>
                          <RefreshCw className="animate-spin" size={12} />
                          Shortlisting...
                        </>
                      ) : (
                        'AI Filter & Shortlist'
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {filteredDrives.length === 0 && (
                <div className="col-span-2 text-center py-12 text-slate-500">No drives found matching your criteria.</div>
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 max-w-md bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2">
              <Search size={16} className="text-slate-500" />
              <input
                type="text"
                placeholder="Search candidates, companies, status..."
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm text-white w-full"
              />
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-white/[0.03] border-b border-white/[0.07] text-xs uppercase font-semibold text-slate-300">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Applied On</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filteredApps.map(app => (
                    <tr key={app.id} className="hover:bg-white/[0.01] transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-purple-400">
                            {app.studentName ? app.studentName[0] : 'C'}
                          </div>
                          <div>
                            <span className="text-white font-medium block">{app.studentName || 'Student'}</span>
                            <span className="text-xs text-slate-500">ID: #{app.studentId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">{app.companyName}</td>
                      <td className="px-6 py-4">{app.role}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {app.appliedOn ? new Date(app.appliedOn).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={e => handleStatusChange(app.id, e.target.value)}
                          className={`bg-slate-900 border border-white/10 rounded-lg text-xs px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer ${
                            app.status === 'SELECTED' ? 'text-emerald-400' :
                            app.status === 'SHORTLISTED' ? 'text-purple-400' :
                            app.status === 'INTERVIEW' ? 'text-blue-400' :
                            app.status === 'REJECTED' ? 'text-red-400' :
                            'text-slate-400'
                          }`}
                        >
                          <option value="APPLIED">APPLIED</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="TEST">TEST</option>
                          <option value="INTERVIEW">INTERVIEW</option>
                          <option value="SELECTED">SELECTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[10px] text-slate-600 block">Status updates auto-notify candidate</span>
                      </td>
                    </tr>
                  ))}
                  {filteredApps.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                        No applications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student Directory Tab */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2.5 flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2">
                <Search size={16} className="text-slate-500" />
                <input
                  type="text"
                  placeholder="Search students, skills..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-sm text-white w-full"
                />
              </div>

              <select
                value={branchFilter}
                onChange={e => setBranchFilter(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl text-sm px-4 py-2 text-white focus:outline-none cursor-pointer"
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map(s => (
                <div key={s.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400">
                        {s.name ? s.name[0] : 'S'}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{s.name}</h4>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/[0.02] px-3 py-2 rounded-xl border border-white/[0.04]">
                        <span className="text-slate-500 block">Branch</span>
                        <span className="text-white font-medium mt-0.5 block">{s.branch || 'General'}</span>
                      </div>
                      <div className="bg-white/[0.02] px-3 py-2 rounded-xl border border-white/[0.04]">
                        <span className="text-slate-500 block">CGPA</span>
                        <span className="text-emerald-400 font-bold mt-0.5 block">{s.cgpa ? s.cgpa.toFixed(2) : '—'}</span>
                      </div>
                    </div>

                    {s.skills && (
                      <div className="mt-4">
                        <span className="text-xs text-slate-500 block mb-1">Key Skills</span>
                        <div className="flex flex-wrap gap-1">
                          {s.skills.split(',').map((skill, index) => (
                            <span key={index} className="text-[10px] bg-slate-800 border border-white/[0.05] text-slate-300 px-2 py-0.5 rounded-md">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-xs text-slate-500">Backlogs: {s.activeBacklogs || 0}</span>
                    {s.resumeUrl && (
                      <a
                        href={s.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs font-semibold"
                      >
                        <FileText size={13} />
                        View Resume
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {filteredStudents.length === 0 && (
                <div className="col-span-2 text-center py-12 text-slate-500">No students found.</div>
              )}
            </div>
          </div>
        )}

        {/* Post Drive Tab */}
        {activeTab === 'post-drive' && (
          <div className="max-w-2xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Plus size={18} className="text-purple-500" />
              Post a Placement Drive
            </h3>

            {formMsg.text && (
              <div className={`p-4 rounded-xl mb-4 text-sm flex items-start gap-2.5 border ${
                formMsg.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{formMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePostDrive} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs uppercase font-semibold mb-1.5">Company Name</label>
                  <input
                    required
                    value={newDrive.companyName}
                    onChange={e => setNewDrive({...newDrive, companyName: e.target.value})}
                    placeholder="e.g. Google India"
                    className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase font-semibold mb-1.5">Job Role</label>
                  <input
                    required
                    value={newDrive.role}
                    onChange={e => setNewDrive({...newDrive, role: e.target.value})}
                    placeholder="e.g. Software Development Engineer"
                    className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase font-semibold mb-1.5">Package (LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newDrive.packageLpa}
                    onChange={e => setNewDrive({...newDrive, packageLpa: e.target.value})}
                    placeholder="e.g. 18.5"
                    className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase font-semibold mb-1.5">Minimum CGPA Criteria</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newDrive.minCgpa}
                    onChange={e => setNewDrive({...newDrive, minCgpa: e.target.value})}
                    placeholder="e.g. 7.5"
                    className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-400 text-xs uppercase font-semibold mb-1.5">Eligible Branches</label>
                  <input
                    required
                    value={newDrive.allowedBranches}
                    onChange={e => setNewDrive({...newDrive, allowedBranches: e.target.value})}
                    placeholder="e.g. CSE, ECE, IT"
                    className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-400 text-xs uppercase font-semibold mb-1.5">Drive Date</label>
                  <input
                    type="date"
                    required
                    value={newDrive.driveDate}
                    onChange={e => setNewDrive({...newDrive, driveDate: e.target.value})}
                    className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl w-full transition-all"
              >
                Create Job Drive
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
