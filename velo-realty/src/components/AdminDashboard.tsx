import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  LayoutDashboard, HardHat, Globe, TrendingUp, Users, 
  Search, Plus, Trash2, Edit3, 
  Mail, Download, Power, Zap, X, Bell, Settings, ArrowUpRight, MessageSquare
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, CartesianGrid,
  AreaChart, Area, LineChart, Line, Legend
} from 'recharts';
import * as XLSX from 'xlsx';
import API_BASE_URL from '../config';
import './AdminDashboard.css';
import { ImageUpload } from './ImageUpload';
import { MultiImageUpload } from './MultiImageUpload';

type AdminDashboardProps = {
  token: string;
  onLogout: () => void;
  theme: 'light' | 'dark';
};

type TabType = 'dashboard' | 'developers' | 'projects' | 'rates' | 'team' | 'corridors' | 'leads' | 'testimonials';


export function AdminDashboard({ token, onLogout, theme }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSaving] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const [locationFilter, setLocationFilter] = useState('All');
  const [developerFilter, setDeveloperFilter] = useState('All');
  const [corridorFilter, setCorridorFilter] = useState('All');
  const [statusFilter] = useState('All');

  const [formData, setFormData] = useState<any>({});
  const [imageLinks, setImageLinks] = useState<string[]>(['']);

  // --- Queries ---
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/admin/dashboard-stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    enabled: activeTab === 'dashboard'
  });

  const { data: data = [], isLoading: isLoadingData } = useQuery({
    queryKey: ['admin-data', activeTab],
    queryFn: async () => {
      let endpoint = '';
      switch(activeTab) {
        case 'developers': endpoint = 'api/developers'; break;
        case 'projects': endpoint = 'api/projects'; break;
        case 'rates': endpoint = 'api/area-rates'; break;
        case 'team': endpoint = 'api/team'; break;
        case 'corridors': endpoint = 'api/corridors'; break;
        case 'testimonials': endpoint = 'api/testimonials'; break;
        case 'leads': endpoint = 'api/admin/user-leads'; break;
      }
      const headers: any = {};
      if (activeTab === 'leads' || activeTab === 'corridors') headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`${API_BASE_URL}/${endpoint}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();
      return Array.isArray(json) ? json : [];
    },
    enabled: activeTab !== 'dashboard'
  });

  const { data: allDevs = [] } = useQuery({
    queryKey: ['all-devs-simple'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/developers`);
      return res.json();
    }
  });

  const { data: allCorrs = [] } = useQuery({
    queryKey: ['all-corrs-simple'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/corridors`);
      return res.json();
    }
  });

  const loading = activeTab === 'dashboard' ? isLoadingStats : isLoadingData;

  // --- Mutations ---
  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: TabType, id: number }) => {
      const apiTab = type === 'leads' ? 'contact-requests' : (type === 'rates' ? 'area-rates' : type);
      const res = await fetch(`${API_BASE_URL}/api/admin/${apiTab}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-data'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      showNotification(`${variables.type.slice(0, -1).toUpperCase()} deleted successfully`);
    },
    onError: (error: any) => {
      showNotification(error.message || 'Deletion failed', 'error');
    }
  });

  const deleteAllMutation = useMutation({
    mutationFn: async (type: TabType) => {
      const res = await fetch(`${API_BASE_URL}/api/admin/${type}/all/bulk`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Bulk delete failed');
    },
    onSuccess: (_, type) => {
      queryClient.invalidateQueries({ queryKey: ['admin-data'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      showNotification(`ALL ${type.toUpperCase()} deleted successfully`);
    },
    onError: (error: any) => {
      showNotification(error.message || 'Bulk delete failed', 'error');
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const method = editingItem ? 'PUT' : 'POST';
      const apiTab = activeTab === 'leads' ? 'contact-requests' : (activeTab === 'rates' ? 'area-rates' : activeTab);
      const url = editingItem 
        ? `${API_BASE_URL}/api/admin/${apiTab}/${editingItem.id}`
        : `${API_BASE_URL}/api/admin/${apiTab}`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Save failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-data'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setShowForm(false);
      setEditingItem(null);
      showNotification(`${activeTab.slice(0, -1).toUpperCase()} saved successfully`);
    },
    onError: (error: any) => {
      showNotification(error.message || 'Save failed', 'error');
    }
  });

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = (item.title || item.name || item.area || item.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === 'developers') {
        return matchesSearch;
      }
      if (activeTab === 'corridors') {
        const matchesLocation = locationFilter === 'All' || item.location === locationFilter;
        return matchesSearch && matchesLocation;
      }
      
      const matchesLocation = locationFilter === 'All' || item.location === locationFilter;
      const matchesDeveloper = developerFilter === 'All' || item.developer === developerFilter || (item.developer_id?.toString() === developerFilter);
      const matchesCorridor = corridorFilter === 'All' || (item.corridor_id?.toString() === corridorFilter);
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesLocation && matchesStatus && matchesDeveloper && matchesCorridor;
    });
  }, [data, activeTab, searchTerm, locationFilter, developerFilter, corridorFilter, statusFilter]);

  const handleDelete = (type: TabType, id: number) => {
    if (!window.confirm(`Delete this ${type.slice(0, -1)}?`)) return;
    deleteMutation.mutate({ type, id });
  };

  const handleDeleteAll = (type: TabType) => {
    const confirm1 = window.confirm(`⚠️ CRITICAL WARNING: You are about to delete ALL ${type}. This action cannot be undone. Are you absolutely sure?`);
    if (!confirm1) return;
    
    const confirm2 = window.prompt(`To confirm, please type "DELETE ALL ${type.toUpperCase()}" below:`);
    if (confirm2 === `DELETE ALL ${type.toUpperCase()}`) {
      deleteAllMutation.mutate(type);
    } else {
      showNotification('Confirmation failed. No data was deleted.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    
    delete payload.id;
    delete payload.project_list;
    delete payload.projects;
    delete payload.corridor;
    delete payload.developer;

    if (activeTab === 'projects') {
      payload.developer_id = parseInt(payload.developer_id) || 0;
      payload.corridor_id = payload.corridor_id ? parseInt(payload.corridor_id) : null;
      payload.images = imageLinks.filter(l => l.trim() !== '');
    }

    if (activeTab === 'developers') {
      payload.project_count = parseInt(payload.project_count) || 0;
      payload.founded_year = payload.founded_year ? parseInt(payload.founded_year) : null;
    }

    saveMutation.mutate(payload);
  };

  const openAddForm = () => {
    setEditingItem(null);
    setImageLinks(['']);
    const defaults: any = {
      properties: { title: '', location: '', community: '', developer: '', developer_id: null, corridor_id: null, type: 'Apartment', listingType: 'Pre-Launch', price: '', priceValue: 0, beds: 0, baths: 0, area: 0, handover: '', status: 'New Launch', image: '', description: '' },
      developers: { name: '', slug: '', about: '', founded_year: 2000, headquarters: '', project_count: 0, logo_url: '' },
      projects: { 
        developer_id: null, corridor_id: null, name: '', slug: '', location: '', sub_location: '',
        project_type: 'Luxury', land_area: '', structure: '', total_units: '', configurations: '',
        size_range: '', price_range: '', price_start: 0, open_space: '', possession: '', 
        status: 'Under Construction', clubhouse_size: '', amenities: '', description: '', 
        highlights: '', connectivity: '' 
      },
      rates: { area: '', price: '', cagr: '' },
      team: { name: '', role: '', image: '', bio: '' },
      corridors: { name: '', slug: '', location: '', description: '', image: '' },
      testimonials: { name: '', role: '', content: '', image_url: '', rating: 5 }
    };
    setFormData(defaults[activeTab]);
    setShowForm(true);
  };

  const openEditForm = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    if (activeTab === 'projects' && item.images) setImageLinks(item.images.map((i: any) => i.image_url));
    else setImageLinks(['']);
    setShowForm(true);
  };

  return (
    <div className={`admin-root-layout ${isSidebarCollapsed ? 'collapsed' : ''}`} data-theme={theme}>
      <aside className="admin-sidebar-v2">
        <div className="sidebar-header">
          <div className="logo-sq"><img src="/Velo Logo Single.png" alt="Velo" width={24} height={24} /></div>
          {!isSidebarCollapsed && (
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span style={{fontWeight: 800, fontSize: 13, color: '#fff'}}>VELO</span>
              <span style={{fontSize: 8, fontWeight: 800, color: 'var(--accent-orange)', letterSpacing: 1, marginTop: -2}}>INTELLIGENCE</span>
            </div>
          )}
        </div>

        <nav style={{display: 'flex', flexDirection: 'column', gap: '2px', flex: 1}}>
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={14} /> {!isSidebarCollapsed && 'Dashboard'}
          </button>
          
          <div className="nav-group-label">{!isSidebarCollapsed && 'Portfolio'}</div>
          <button className={`nav-link ${activeTab === 'developers' ? 'active' : ''}`} onClick={() => setActiveTab('developers')}>
            <HardHat size={14} /> {!isSidebarCollapsed && 'Developers'}
          </button>
          <button className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
            <Zap size={14} /> {!isSidebarCollapsed && 'Projects'}
          </button>
          <button className={`nav-link ${activeTab === 'corridors' ? 'active' : ''}`} onClick={() => setActiveTab('corridors')}>
            <Globe size={14} /> {!isSidebarCollapsed && 'Corridors'}
          </button>
          
          <div className="nav-group-label">{!isSidebarCollapsed && 'Management'}</div>
          <button className={`nav-link ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>
            <Mail size={14} /> {!isSidebarCollapsed && 'Leads'}
          </button>
          <button className={`nav-link ${activeTab === 'rates' ? 'active' : ''}`} onClick={() => setActiveTab('rates')}>
            <TrendingUp size={14} /> {!isSidebarCollapsed && 'Area Rates'}
          </button>
          <button className={`nav-link ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')}>
            <MessageSquare size={14} /> {!isSidebarCollapsed && 'Testimonials'}
          </button>
          <button className={`nav-link ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
            <Users size={14} /> {!isSidebarCollapsed && 'Team'}
          </button>
        </nav>

        <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', padding: '1rem 0', borderTop: '1px solid var(--border-subtle)'}}>
           <button className="nav-link" onClick={() => {}}>
              <Settings size={14} /> {!isSidebarCollapsed && 'Settings'}
           </button>
           <button className="nav-link" onClick={onLogout} style={{color: '#ef4444'}}>
              <Power size={14} /> {!isSidebarCollapsed && 'Logout'}
           </button>
        </div>
      </aside>

      {notification && (
        <div className={`admin-notification ${notification.type}`}>
          <div className="notif-content">
            {notification.type === 'success' ? <Zap size={14} /> : <X size={14} />}
            <span>{notification.message}</span>
          </div>
          <div className="notif-progress"></div>
        </div>
      )}

      <main className="admin-main-v2">
        <header className="dashboard-header-v2">
          <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
             <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="btn-action-v3">
                <Zap size={14} />
             </button>
             <h2 style={{fontSize: 16, fontWeight: 800, margin: 0, color: '#fff'}}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          </div>

          <div className="top-search">
             <Search size={14} style={{color: 'var(--text-muted)'}} />
             <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
             <button className="btn-action-v3">
                <Bell size={14} />
             </button>
              <div className="user-pill">
                 <span style={{fontWeight: 700, fontSize: 11, color: '#fff'}}>Admin</span>
                 <img src="/Velo Logo Single.png" alt="Admin" className="user-avatar" style={{ objectFit: 'contain', background: 'rgba(255, 255, 255, 0.05)', padding: '4px' }} />
              </div>
          </div>
        </header>
        {loading ? (
          <div className="admin-loading-container">
            <div className="admin-spinner"></div>
            <p>Gathering Intelligence...</p>
          </div>
        ) : (
          <div style={{width: '100%', overflowY: 'auto', paddingBottom: '2rem'}}>
            {activeTab === 'dashboard' && stats && (
              <>
                <div className="stats-grid-v3">
                  <div className="stat-box-v3">
                    <span className="label">Listings</span>
                    <div style={{display: 'flex', alignItems: 'baseline'}}>
                      <span className="value">{stats.properties}</span>
                      <span className="trend"><ArrowUpRight size={10}/> 12%</span>
                    </div>
                  </div>
                  <div className="stat-box-v3">
                    <span className="label">Leads</span>
                    <div style={{display: 'flex', alignItems: 'baseline'}}>
                      <span className="value">{stats.leads}</span>
                      <span className="trend">5%</span>
                    </div>
                  </div>
                  <div className="stat-box-v3">
                    <span className="label">Projects</span>
                    <span className="value" style={{display: 'block'}}>{stats.projects}</span>
                  </div>
                  <div className="stat-box-v3">
                    <span className="label">Corridors</span>
                    <span className="value" style={{display: 'block'}}>{stats.corridors}</span>
                  </div>
                </div>

                <div className="charts-grid-v3">
                   <div className="chart-card-v3">
                      <h3 style={{fontSize: 12, fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-dim)'}}>PORTFOLIO COMPOSITION</h3>
                      <ResponsiveContainer width="100%" height={270}>
                        <PieChart>
                          <Pie data={stats.type_chart} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                            {stats.type_chart.map((_:any, i:number) => <Cell key={i} fill={['#f97316', '#3b82f6', '#8b5cf6', '#10b981'][i % 4]} stroke="none" />)}
                          </Pie>
                          <Tooltip contentStyle={{background: '#111', border: '1px solid #222', borderRadius: 4, fontSize: 10}} />
                          <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{fontSize: 9, marginTop: 10}} />
                        </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="chart-card-v3">
                      <h3 style={{fontSize: 12, fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-dim)'}}>PROJECT PIPELINE (STATUS)</h3>
                      <ResponsiveContainer width="100%" height={270}>
                        <PieChart>
                          <Pie data={stats.status_chart || []} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                            {(stats.status_chart || []).map((_:any, i:number) => <Cell key={i} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6366f1'][i % 5]} stroke="none" />)}
                          </Pie>
                          <Tooltip contentStyle={{background: '#111', border: '1px solid #222', borderRadius: 4, fontSize: 10}} />
                          <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{fontSize: 9, marginTop: 10}} />
                        </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="chart-card-v3">
                      <h3 style={{fontSize: 12, fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-dim)'}}>PROJECT TYPES DISTRIBUTION</h3>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={stats.proj_chart}>
                          <XAxis dataKey="name" tick={{fontSize: 9, fill: '#555'}} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{background: '#111', border: '1px solid #222', borderRadius: 4, fontSize: 10}} />
                          <Bar dataKey="value" fill="var(--accent-orange)" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                      </ResponsiveContainer>
                   </div>

                   <div className="chart-card-v3" style={{gridColumn: 'span 2'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                        <h3 style={{fontSize: 12, fontWeight: 800, margin: 0, color: 'var(--text-dim)'}}>WEBSITE TRAFFIC & REACH</h3>
                        <div style={{fontSize: 10, color: '#22c55e', fontWeight: 800}}>+24% REACH GROWTH</div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={stats.traffic_chart}>
                          <defs>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" tick={{fontSize: 9, fill: '#555'}} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{background: '#111', border: '1px solid #222', borderRadius: 4, fontSize: 10}} />
                          <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>

                   <div className="chart-card-v3" style={{gridColumn: 'span 2'}}>
                      <h3 style={{fontSize: 12, fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-dim)'}}>DAILY LEAD GENERATION</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={stats.leads_chart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                          <XAxis dataKey="date" tick={{fontSize: 9, fill: '#555'}} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{background: '#111', border: '1px solid #222', borderRadius: 4, fontSize: 10}} />
                          <Line type="stepAfter" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2}} activeDot={{r: 6}} />
                        </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>
              </>
            )}

            {activeTab !== 'dashboard' && (
              <div className="data-view-v3">
                <div className="toolbar-v3">
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <select className="filter-select" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} 
                      style={{background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: 4, fontSize: 11}}>
                      <option value="All">All Locations</option>
                      {[...new Set(data.map((i:any) => i.location))].filter(Boolean).map((l:any) => <option key={l} value={l}>{l}</option>)}
                    </select>

                    {activeTab === 'projects' && (
                      <>
                        <select className="filter-select" value={developerFilter} onChange={e => setDeveloperFilter(e.target.value)} 
                          style={{background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: 4, fontSize: 11}}>
                          <option value="All">All Developers</option>
                          {allDevs.map((d: any) => <option key={d.id} value={d.id.toString()}>{d.name}</option>)}
                        </select>

                        <select className="filter-select" value={corridorFilter} onChange={e => setCorridorFilter(e.target.value)} 
                          style={{background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: 4, fontSize: 11}}>
                          <option value="All">All Corridors</option>
                          {allCorrs.map((c: any) => <option key={c.id} value={c.id.toString()}>{c.name}</option>)}
                        </select>
                      </>
                    )}

                    <button className="btn-v3 secondary" onClick={() => {
                      const ws = XLSX.utils.json_to_sheet(data);
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, activeTab);
                      XLSX.writeFile(wb, `${activeTab}.xlsx`);
                    }}><Download size={14} /> Export</button>
                  </div>
                  
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    {activeTab === 'projects' && (
                      <button className="btn-v3 secondary" onClick={() => handleDeleteAll(activeTab)} style={{color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)'}}>
                        <Trash2 size={14} /> Delete All
                      </button>
                    )}
                    {activeTab !== 'leads' && <button className="btn-v3 primary" onClick={openAddForm}><Plus size={14} /> Create New</button>}
                  </div>
                </div>

                <div className="data-container-v3">
                  <table className="table-v3">
                    <thead>
                      <tr>
                        <th>Entity</th>
                        <th>Details</th>
                        <th>Status</th>
                        <th style={{textAlign: 'right'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item: any) => (
                        <tr key={item.id}>
                          <td>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <span style={{fontWeight: 700, color: '#fff'}}>{item.title || item.name || item.area}</span>
                                {(activeTab === 'developers' || activeTab === 'corridors') && (
                                  <span style={{fontSize: 8, background: 'rgba(255,255,255,0.05)', padding: '1px 4px', borderRadius: 2, color: 'var(--accent-orange)'}}>#{item.id}</span>
                                )}
                              </div>
                              <span style={{fontSize: 10, color: 'var(--text-dim)'}}>
                                {activeTab === 'projects' ? (
                                  <span style={{display: 'flex', gap: '8px'}}>
                                    <span>Dev ID: {item.developer_id}</span>
                                    <span>Corr ID: {item.corridor_id}</span>
                                  </span>
                                ) : activeTab === 'developers' ? (
                                  <span>HQ: {item.headquarters || 'N/A'}</span>
                                ) : activeTab === 'corridors' ? (
                                  <span>Location: {item.location || 'N/A'}</span>
                                ) : (item.email || item.location)}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                              <span style={{fontWeight: 600, fontSize: 11}}>
                                {activeTab === 'leads' ? (
                                  `${item.saved_count || 0} Saved`
                                ) : activeTab === 'developers' ? (
                                  `Founded: ${item.founded_year || 'N/A'}`
                                ) : (item.role || item.price || item.slug)}
                              </span>
                              <span style={{fontSize: 10, color: 'var(--text-muted)'}}>
                                {activeTab === 'projects' ? (
                                  <span style={{display: 'flex', gap: '8px'}}>
                                    <span>Dev ID: {item.developer_id}</span>
                                    <span>Corr ID: {item.corridor_id}</span>
                                  </span>
                                ) : activeTab === 'developers' ? (
                                  <span>Projects: {item.project_count || 0}</span>
                                ) : activeTab === 'corridors' ? (
                                  <span>Slug: {item.slug}</span>
                                ) : (item.phone || item.possession)}
                              </span>
                            </div>
                          </td>
                          <td><span className="tag-v3">{activeTab === 'leads' ? 'User' : (item.status || 'Active')}</span></td>
                          <td>
                            <div style={{display: 'flex', gap: '0.4rem', justifyContent: 'flex-end'}}>
                              {activeTab !== 'leads' && <button className="btn-action-v3" onClick={() => openEditForm(item)}><Edit3 size={12}/></button>}
                              <button className="btn-action-v3" onClick={() => handleDelete(activeTab, item.id)}><Trash2 size={12}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showForm && (
        <div className="modal-overlay-v3">
          <div className="modal-card-v3">
            <div className="modal-header-v3">
               <h3 style={{margin: 0, fontSize: 14}}>{editingItem ? 'Edit' : 'New'} {activeTab.slice(0, -1)}</h3>
               <button onClick={() => setShowForm(false)} className="btn-action-v3" style={{borderRadius: '50%'}}><X size={14}/></button>
            </div>
            <div className="modal-body-v3">
               <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  {activeTab !== 'testimonials' && Object.keys(formData).filter(k => {
                    if (['id', 'gallery', 'images', 'project_list', 'projects', 'project_items', 'corridor'].includes(k)) return false;
                    if (activeTab === 'developers' && k === 'image') return false;
                    return true;
                  }).map(key => {
                    const isImage = ['image', 'logo_url'].includes(key);
                    const isFullWidth = ['description', 'bio', 'about'].includes(key);
                    
                    return (
                      <div className="form-group-v3" key={key} style={{gridColumn: (isFullWidth || isImage) ? 'span 2' : 'span 1', marginBottom: '1rem'}}>
                        <label style={{fontSize: 10, color: 'var(--text-dim)', display: 'block', marginBottom: 4}}>{key.replace('_', ' ')}</label>
                        
                        {isImage ? (
                          <ImageUpload token={token} currentImage={formData[key]} folder={`/${activeTab}`} onSuccess={(url) => setFormData({...formData, [key]: url})} />
                        ) : (activeTab === 'projects') && key === 'developer_id' ? (
                          <select style={{background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', width: '100%', padding: '0.4rem'}} value={formData[key] || ''} onChange={e => setFormData({...formData, [key]: e.target.value})}>
                            <option value="">Select Developer</option>
                            {allDevs.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                          </select>
                        ) : (activeTab === 'projects') && key === 'corridor_id' ? (
                          <select style={{background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', width: '100%', padding: '0.4rem'}} value={formData[key] || ''} onChange={e => setFormData({...formData, [key]: e.target.value})}>
                            <option value="">Select Corridor</option>
                            {allCorrs.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        ) : isFullWidth ? (
                          <textarea rows={3} style={{background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', width: '100%', padding: '0.5rem'}} value={formData[key] || ''} onChange={e => setFormData({...formData, [key]: e.target.value})} />
                        ) : (
                          <input style={{background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', width: '100%', padding: '0.4rem 0.6rem'}} value={formData[key] || ''} onChange={e => setFormData({...formData, [key]: e.target.value})} />
                        )}
                      </div>
                    );
                  })}
                  
                  {(activeTab === 'projects') && (
                    <div style={{gridColumn: 'span 2'}}>
                      <label style={{fontSize: 10, color: 'var(--text-dim)'}}>Gallery Assets</label>
                      <MultiImageUpload token={token} currentImages={imageLinks} folder={`/${activeTab}/gallery`} onSuccess={(urls) => setImageLinks(urls)} />
                    </div>
                  )}

                  {(activeTab === 'testimonials') && (
                    <>
                      <div className="form-group-v3">
                        <label style={{fontSize: 10, color: 'var(--text-dim)', display: 'block', marginBottom: 4}}>Client Name</label>
                        <input style={{background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', width: '100%', padding: '0.4rem 0.6rem'}} type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
                      </div>
                      <div className="form-group-v3">
                        <label style={{fontSize: 10, color: 'var(--text-dim)', display: 'block', marginBottom: 4}}>Role / Designation</label>
                        <input style={{background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', width: '100%', padding: '0.4rem 0.6rem'}} type="text" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. Homeowner or CEO" />
                      </div>
                      <div className="form-group-v3" style={{gridColumn: 'span 2'}}>
                        <label style={{fontSize: 10, color: 'var(--text-dim)', display: 'block', marginBottom: 4}}>Feedback Content</label>
                        <textarea rows={3} style={{background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', width: '100%', padding: '0.5rem'}} value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="What did they say about Velo Realty?" />
                      </div>
                      <div className="form-group-v3" style={{gridColumn: 'span 2', marginBottom: '0.5rem'}}>
                        <label style={{fontSize: 10, color: 'var(--text-dim)', display: 'block', marginBottom: 4}}>Client Profile Image</label>
                        <ImageUpload token={token} currentImage={formData.image_url} folder={`/${activeTab}`} onSuccess={(url) => setFormData({...formData, image_url: url})} />
                      </div>
                      <div className="form-group-v3">
                        <label style={{fontSize: 10, color: 'var(--text-dim)', display: 'block', marginBottom: 4}}>Rating (1-5)</label>
                        <input style={{background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', width: '100%', padding: '0.4rem 0.6rem'}} type="number" min="1" max="5" value={formData.rating || 5} onChange={e => setFormData({...formData, rating: parseInt(e.target.value) || 5})} />
                      </div>
                    </>
                  )}

                  {(activeTab === 'developers' || activeTab === 'corridors') && editingItem && (
                    <div style={{gridColumn: 'span 2', marginTop: '1rem', borderTop: '1px solid #222', paddingTop: '1rem'}}>
                      <h4 style={{fontSize: 11, marginBottom: '1rem', color: 'var(--text-dim)'}}>Portfolio Projects ({editingItem.project_count || 0})</h4>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        {Array.isArray(editingItem.project_items) && editingItem.project_items.map((p: any) => (
                          <div key={`proj-${p.id}`} style={{display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(249, 115, 22, 0.05)', border: '1px solid rgba(249, 115, 22, 0.1)', padding: '0.5rem', borderRadius: 4}}>
                            <img src={p.primary_image || null} alt="" style={{width: 32, height: 32, borderRadius: 2, objectFit: 'cover'}} />
                            <div style={{flex: 1}}>
                              <div style={{fontSize: 11, fontWeight: 700, color: 'var(--accent-orange)'}}>{p.name} <span style={{fontSize: 8, color: 'var(--text-muted)'}}>(Portfolio Project)</span></div>
                              <div style={{fontSize: 9, color: 'var(--text-muted)'}}>{p.location} • {p.status}</div>
                            </div>
                            <button className="btn-action-v3" onClick={() => { setActiveTab('projects'); openEditForm(p); }}><Edit3 size={10}/></button>
                          </div>
                        ))}

                        {!editingItem.project_items?.length && (
                          <div style={{fontSize: 10, color: 'var(--text-dim)', textAlign: 'center', padding: '1rem', border: '1px dashed #222'}}>
                            No linked projects found. Add projects and link them via Developer ID.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
               </div>
            </div>
            <div className="modal-footer-v3">
              <button className="btn-v3 secondary" onClick={() => setShowForm(false)} disabled={isSaving}>Discard</button>
              <button className="btn-v3 primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
