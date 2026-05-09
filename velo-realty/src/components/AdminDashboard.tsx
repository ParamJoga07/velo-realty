import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Building2, HardHat, Globe, TrendingUp, Users, 
  ChevronLeft, Search, Plus, Trash2, Edit3, 
  Mail, Download, Power, Zap, X
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid
} from 'recharts';
import * as XLSX from 'xlsx';
import API_BASE_URL from '../config';
import './AdminDashboard.css';
import { ImageUpload } from './ImageUpload';

type AdminDashboardProps = {
  token: string;
  onLogout: () => void;
};

type TabType = 'dashboard' | 'properties' | 'developers' | 'projects' | 'rates' | 'team' | 'corridors' | 'leads';

const EXECUTIVE_COLORS = ['#007AFF', '#34C759', '#FF9500', '#BF5AF2', '#FFD60A', '#FF3B30', '#64D2FF'];

export function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter] = useState('All');

  const [formData, setFormData] = useState<any>({});
  const [imageLinks, setImageLinks] = useState<string[]>(['']);

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    else fetchData();
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/dashboard-stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setStats(json);
    } catch (err) {
      setStats({ properties: 0, developers: 0, projects: 0, corridors: 0, team: 0, leads: 0, type_chart: [], proj_chart: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      switch(activeTab) {
        case 'properties': endpoint = 'api/properties'; break;
        case 'developers': endpoint = 'api/developers'; break;
        case 'projects': endpoint = 'api/projects'; break;
        case 'rates': endpoint = 'api/area-rates'; break;
        case 'team': endpoint = 'api/team'; break;
        case 'corridors': endpoint = 'api/corridors'; break;
        case 'leads': endpoint = 'api/admin/contact-requests'; break;
      }
      const headers: any = {};
      if (activeTab === 'leads' || activeTab === 'corridors') headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`${API_BASE_URL}/${endpoint}`, { headers });
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = (item.title || item.name || item.area || item.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === 'All' || item.location === locationFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [data, searchTerm, locationFilter, statusFilter]);

  const handleDelete = async (type: TabType, id: number) => {
    if (!window.confirm(`Delete this ${type.slice(0, -1)}?`)) return;
    try {
      const endpoint = type === 'leads' ? 'contact-requests' : type;
      const res = await fetch(`${API_BASE_URL}/api/admin/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      alert('Failed');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem 
        ? `${API_BASE_URL}/api/admin/${activeTab}/${editingItem.id}`
        : `${API_BASE_URL}/api/admin/${activeTab}`;
      
      const payload = { ...formData };
      if (activeTab === 'properties' || activeTab === 'projects') {
        const key = activeTab === 'properties' ? 'gallery' : 'images';
        payload[key] = imageLinks.filter(l => l.trim() !== '');
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowForm(false);
        setEditingItem(null);
        fetchData();
      }
    } catch (err) {
      alert('Error');
    }
  };

  const openAddForm = () => {
    setEditingItem(null);
    setImageLinks(['']);
    const defaults: any = {
      properties: { title: '', location: '', community: '', developer: '', type: 'Apartment', listingType: 'Pre-Launch', price: '', priceValue: 0, beds: 0, baths: 0, area: 0, handover: '', status: 'New Launch', image: '', description: '' },
      developers: { name: '', slug: '', about: '', total_projects: 0, image: '' },
      projects: { developer_id: 0, corridor_id: null, name: '', slug: '', location: '', project_type: 'Luxury', description: '' },
      rates: { area: '', price: '', cagr: '' },
      team: { name: '', role: '', image: '', bio: '' },
      corridors: { name: '', slug: '', location: '', description: '', image: '' }
    };
    setFormData(defaults[activeTab]);
    setShowForm(true);
  };

  const openEditForm = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    if (activeTab === 'properties' && item.gallery) setImageLinks(item.gallery.map((g: any) => g.image_url));
    else if (activeTab === 'projects' && item.images) setImageLinks(item.images.map((i: any) => i.image_url));
    else setImageLinks(['']);
    setShowForm(true);
  };

  return (
    <div className={`admin-root-layout ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <aside className="admin-sidebar-v2">
        <div className="sidebar-header">
          <div className="logo-sq"><img src="/Velo Logo Single.png" alt="Velo" /></div>
          {!isSidebarCollapsed && <span style={{fontWeight: 800, fontSize: 14}}>VELO ADMIN</span>}
        </div>

        <nav style={{display: 'flex', flexDirection: 'column', gap: '4px', flex: 1}}>
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={16} /> {!isSidebarCollapsed && 'Dashboard'}
          </button>
          
          <div className="nav-group-label">{!isSidebarCollapsed && 'Portfolio'}</div>
          <button className={`nav-link ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
            <Building2 size={16} /> {!isSidebarCollapsed && 'Properties'}
          </button>
          <button className={`nav-link ${activeTab === 'developers' ? 'active' : ''}`} onClick={() => setActiveTab('developers')}>
            <HardHat size={16} /> {!isSidebarCollapsed && 'Developers'}
          </button>
          <button className={`nav-link ${activeTab === 'corridors' ? 'active' : ''}`} onClick={() => setActiveTab('corridors')}>
            <Globe size={16} /> {!isSidebarCollapsed && 'Corridors'}
          </button>
          
          <div className="nav-group-label">{!isSidebarCollapsed && 'Operations'}</div>
          <button className={`nav-link ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>
            <Mail size={16} /> {!isSidebarCollapsed && 'Leads'}
          </button>
          <button className={`nav-link ${activeTab === 'rates' ? 'active' : ''}`} onClick={() => setActiveTab('rates')}>
            <TrendingUp size={16} /> {!isSidebarCollapsed && 'Market'}
          </button>
          <button className={`nav-link ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
            <Users size={16} /> {!isSidebarCollapsed && 'Team'}
          </button>
        </nav>

        <button className="nav-link" onClick={onLogout} style={{marginTop: 'auto', color: '#ff453a'}}>
          <Power size={16} /> {!isSidebarCollapsed && 'Logout'}
        </button>
      </aside>

      <main className="admin-main-v2">
        <header className="dashboard-header-v2">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
             <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="btn-action-v3">
                {isSidebarCollapsed ? <Zap size={14}/> : <ChevronLeft size={14}/>}
             </button>
             <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          </div>
        </header>

        {loading && <div className="global-loader"><div className="spinner"></div><p>Loading...</p></div>}

        {!loading && activeTab === 'dashboard' && stats && (
          <div className="animate-v3" style={{width: '100%'}}>
            <div className="stats-grid-v3">
              <div className="stat-box-v3"><span className="label">Listings</span><span className="value">{stats.properties}</span></div>
              <div className="stat-box-v3"><span className="label">Leads</span><span className="value">{stats.leads}</span></div>
              <div className="stat-box-v3"><span className="label">Projects</span><span className="value">{stats.projects}</span></div>
              <div className="stat-box-v3"><span className="label">Corridors</span><span className="value">{stats.corridors}</span></div>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
              <div className="stat-box-v3" style={{height: 400}}>
                <span className="label">Inventory Mix</span>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={stats.type_chart} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {stats.type_chart.map((_:any, i:number) => <Cell key={i} fill={EXECUTIVE_COLORS[i % EXECUTIVE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{background: '#111', border: 'none', fontSize: 12}} />
                    <Legend iconType="circle" wrapperStyle={{fontSize: 10}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="stat-box-v3" style={{height: 400}}>
                <span className="label">Segment Analysis</span>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={stats.proj_chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{background: '#111', border: 'none'}} />
                    <Bar dataKey="value" fill="#007AFF" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab !== 'dashboard' && (
          <div className="animate-v3" style={{display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden'}}>
            <div className="toolbar-v3">
              <div className="toolbar-left">
                <div className="search-v3">
                  <Search className="search-icon" size={14} />
                  <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="filter-select" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
                  <option value="All">All Locations</option>
                  {[...new Set(data.map(i => i.location))].filter(Boolean).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="toolbar-right">
                <button className="btn-v3 secondary" onClick={() => {
                  const ws = XLSX.utils.json_to_sheet(data);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, activeTab);
                  XLSX.writeFile(wb, `${activeTab}_Report.xlsx`);
                }}><Download size={14} /> Export</button>
                {activeTab !== 'leads' && <button className="btn-v3 primary" onClick={openAddForm}><Plus size={14} /> Add New</button>}
              </div>
            </div>

            <div className="data-container-v3">
              <table className="table-v3">
                <thead>
                  <tr>
                    <th>Identity</th>
                    <th>Detail</th>
                    <th>Status</th>
                    <th style={{textAlign: 'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td><div className="cell-main"><span className="cell-title">{item.title || item.name || item.area}</span><span className="cell-sub">{item.email || item.location}</span></div></td>
                      <td><span className="cell-sub">{item.role || item.phone || item.slug}</span></td>
                      <td><span className="tag-v3">{item.status || 'Active'}</span></td>
                      <td>
                        <div className="actions-v3">
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
      </main>

      {showForm && (
        <div className="modal-overlay-v3">
          <div className="modal-card-v3 animate-v3">
            <div className="modal-header-v3"><h2>{editingItem ? 'Edit' : 'New'} {activeTab.slice(0, -1)}</h2><button onClick={() => setShowForm(false)} style={{background: 'none', border: 'none', color: '#fff'}}><X size={18}/></button></div>
            <div className="modal-body-v3">
               <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  {Object.keys(formData).filter(k => !['id', 'gallery', 'images', 'project_list', 'projects', 'corridor'].includes(k)).map(key => {
                    const isImage = ['image', 'logo_url'].includes(key);
                    const isFullWidth = ['description', 'bio', 'about'].includes(key);
                    
                    return (
                      <div className="form-group-v3" key={key} style={{gridColumn: (isFullWidth || isImage) ? 'span 2' : 'span 1'}}>
                        <label>{key.replace('_', ' ')}</label>
                        {isImage ? (
                          <ImageUpload 
                            token={token} 
                            currentImage={formData[key]} 
                            folder={`/${activeTab}`}
                            onSuccess={(url) => setFormData({...formData, [key]: url})}
                          />
                        ) : isFullWidth ? (
                          <textarea rows={4} value={formData[key] || ''} onChange={e => setFormData({...formData, [key]: e.target.value})} />
                        ) : (
                          <input value={formData[key] || ''} onChange={e => setFormData({...formData, [key]: e.target.value})} />
                        )}
                      </div>
                    );
                  })}

                  {(activeTab === 'properties' || activeTab === 'projects') && (
                    <div style={{gridColumn: 'span 2', marginTop: '1.5rem'}}>
                      <label className="upload-label">Tactical Gallery (Multiple 4K Assets)</label>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem'}}>
                        {imageLinks.map((link, idx) => (
                          <ImageUpload 
                            key={idx}
                            token={token}
                            currentImage={link}
                            folder={`/${activeTab}/gallery`}
                            onSuccess={(url) => {
                              const newLinks = [...imageLinks];
                              if (url === '') {
                                newLinks.splice(idx, 1);
                              } else {
                                newLinks[idx] = url;
                              }
                              setImageLinks(newLinks);
                            }}
                          />
                        ))}
                        <button className="btn-v3 secondary" style={{height: 120, borderStyle: 'dashed'}} onClick={() => setImageLinks([...imageLinks, ''])}>
                          <Plus size={20} /> Add Another
                        </button>
                      </div>
                    </div>
                  )}
               </div>
            </div>
            <div className="modal-footer-v3"><button className="btn-v3 secondary" onClick={() => setShowForm(false)}>Cancel</button><button className="btn-v3 primary" onClick={handleSave}>Save Changes</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
