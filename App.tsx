import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SettingsPanel } from './components/SettingsPanel';
import { LoginPage } from './components/LoginPage';
import { Menu, X, LogOut, ChevronRight, ChevronLeft, Building2, User, Users } from 'lucide-react';
import { UserProfile, BonusData, NavNode } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bonusData, setBonusData] = useState<BonusData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  
  // Hierarchy Navigation State
  // Stack of selected nodes (e.g. [Paulo, Nordtech, Maestri])
  const [navStack, setNavStack] = useState<NavNode[]>([]);
  // Options available for the NEXT dropdown based on the last item in stack
  const [nextOptions, setNextOptions] = useState<NavNode[]>([]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // -- INIT EFFECT --
  useEffect(() => {
    if (user) {
        initializeView(user);
    }
  }, [user]);

  // Initialize the view based on who logged in
  const initializeView = async (loggedInUser: UserProfile) => {
      // If Admin, start with empty stack (Admin sees nothing until selection)
      // If Normal User, stack is just themselves
      
      const initialNode: NavNode = { 
          type: 'user', 
          id: loggedInUser.id, 
          name: loggedInUser.name, 
          data: loggedInUser 
      };

      if (loggedInUser.isAdmin) {
          setNavStack([]); // Admin starts blank
          loadOptionsForNode(null, null, loggedInUser);
          setBonusData(null);
      } else {
          setNavStack([initialNode]);
          loadDataForUser(loggedInUser.id);
          // Load options for the logged in user (in case they have subordinates)
          loadOptionsForNode(initialNode, null, loggedInUser);
      }
  };

  const loadDataForUser = async (userId: string) => {
    setLoadingData(true);
    try {
        const data = await api.getBonusData(userId);
        setBonusData(data);
    } catch (e) {
        console.error("Failed to load bonus data", e);
    } finally {
        setLoadingData(false);
    }
  };

  const loadOptionsForNode = async (currentNode: NavNode | null, prevNode: NavNode | null, rootUser: UserProfile) => {
      try {
          const options = await api.getNextLevelOptions(currentNode, prevNode, rootUser);
          setNextOptions(options);
      } catch (e) {
          console.error("Failed to load hierarchy options", e);
      }
  };

  // -- NAVIGATION HANDLERS --

  const handleNextLevelSelect = (nodeId: string) => {
      const selectedOption = nextOptions.find(n => n.id === nodeId);
      if (!selectedOption) return;

      const newStack = [...navStack, selectedOption];
      setNavStack(newStack);

      // If it's a USER, load their data. If COMPANY, keep showing previous user data
      if (selectedOption.type === 'user') {
          loadDataForUser(selectedOption.id);
      }

      // Load next options (drill down)
      // We pass the new node as Current, and the one before it as Previous
      const prev = newStack.length > 1 ? newStack[newStack.length - 2] : null;
      if (user) {
          loadOptionsForNode(selectedOption, prev, user);
      }
  };

  const handleBack = () => {
      if (navStack.length <= 1 && !user?.isAdmin) return; // Can't go back past self if not admin
      if (navStack.length === 0) return;

      const newStack = [...navStack];
      newStack.pop(); // Remove current
      setNavStack(newStack);

      const previousNode = newStack[newStack.length - 1]; // This is the node we are going BACK TO
      const nodeBeforePrevious = newStack.length > 1 ? newStack[newStack.length - 2] : null;

      // Logic to restore data and options
      if (previousNode) {
          if (previousNode.type === 'user') {
              loadDataForUser(previousNode.id);
          }
          if (user) loadOptionsForNode(previousNode, nodeBeforePrevious || null, user);
      } else if (user?.isAdmin) {
          // Admin went back to root
          setBonusData(null);
          loadOptionsForNode(null, null, user);
      }
  };

  const handleLogout = () => {
    setUser(null);
    setBonusData(null);
    setNavStack([]);
    setIsMobileMenuOpen(false);
    setIsSettingsOpen(false);
  };

  // If not logged in, show Login Page
  if (!user) {
      return <LoginPage onLogin={setUser} />;
  }

  // Determine label for the "Next" dropdown based on context
  const getDropdownLabel = () => {
      const lastNode = navStack[navStack.length - 1];
      
      if (!lastNode) return "Selecione a Diretoria"; // Admin root
      
      if (lastNode.type === 'user') {
          if (lastNode.data?.role === 'Diretor') return "Selecione a Empresa";
          if (lastNode.data?.role === 'Gerente') return "Selecione a Gestão";
          if (lastNode.data?.role === 'Gerente Geral') return "Selecione a Gestão"; // Nunes case
          if (lastNode.data?.role === 'Gestor') return "Selecione o Vendedor";
      }
      if (lastNode.type === 'company') return "Selecione a Gerência";

      return "Selecione...";
  };

  // Can show back button?
  const canGoBack = user.isAdmin ? navStack.length > 0 : navStack.length > 1;

  // Render the current view context for the top bar
  const renderBreadcrumb = () => {
      if (navStack.length === 0) return <span className="text-emerald-900 font-medium">Visão Geral</span>;
      
      const current = navStack[navStack.length - 1];
      const prev = navStack.length > 1 ? navStack[navStack.length - 2] : null;

      return (
          <div className="flex flex-col justify-center">
              {prev && (
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1">
                      {prev.type === 'company' ? <Building2 size={10} /> : <User size={10} />}
                      {prev.name}
                  </span>
              )}
              <div className="flex items-center gap-2">
                 <span className={`text-sm font-bold ${current.type === 'company' ? 'text-emerald-700' : 'text-emerald-950'}`}>
                    {current.name}
                 </span>
                 {current.type === 'user' && (
                     <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] rounded font-bold uppercase">
                         {current.data?.role}
                     </span>
                 )}
              </div>
          </div>
      );
  };

  return (
    <div className="flex min-h-screen bg-background-light text-text-primary font-sans overflow-x-hidden relative">
      
      {/* HIERARCHY NAVIGATION BAR */}
      {(user.hasChildren || user.isAdmin) && (
          <div className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-emerald-50 z-30 flex items-center justify-between px-4 md:px-6 border-b border-emerald-100 shadow-sm transition-all duration-300">
              
              <div className="flex items-center gap-3 md:gap-4 flex-1">
                  {/* Back Button */}
                  <button 
                    onClick={handleBack}
                    disabled={!canGoBack}
                    className={`p-2 rounded-lg border shadow-sm transition-all ${
                        canGoBack 
                        ? 'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer' 
                        : 'bg-emerald-50/50 border-transparent text-emerald-300 cursor-default'
                    }`}
                  >
                      <ChevronLeft size={18} />
                  </button>

                  {/* Context Info */}
                  <div className="flex items-center gap-3 pl-2 border-l border-emerald-200/50">
                      {renderBreadcrumb()}
                  </div>
              </div>
              
              {/* Drill Down Selector */}
              {nextOptions.length > 0 && (
                  <div className="flex items-center gap-3 bg-white p-1.5 pl-4 rounded-xl border border-emerald-200 shadow-sm transition-colors hover:border-emerald-300">
                      <span className="text-[10px] md:text-xs text-emerald-600 font-bold uppercase tracking-wider hidden md:block">
                          {getDropdownLabel()}:
                      </span>
                      <div className="relative group">
                        <select 
                            value=""
                            onChange={(e) => handleNextLevelSelect(e.target.value)}
                            className="appearance-none bg-transparent text-sm font-bold text-emerald-900 pr-8 pl-1 focus:outline-none cursor-pointer w-32 md:w-auto"
                        >
                            <option value="" disabled>Navegar...</option>
                            {nextOptions.map(opt => (
                                <option key={opt.id} value={opt.id} className="text-slate-700">
                                    {opt.type === 'company' ? '🏢 ' : '👤 '}{opt.name}
                                </option>
                            ))}
                        </select>
                        <ChevronRight size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar 
        user={user}
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onLogout={handleLogout}
      />

      {/* Settings Panel Overlay */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Mobile Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-40 flex items-center justify-between px-4 border-b border-slate-100 transition-all duration-300 ${(user.hasChildren || user.isAdmin) ? 'mt-16' : ''}`}>
          <div className="font-bold text-lg text-text-primary pl-2">Bonus Dashboard</div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-text-secondary hover:bg-slate-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
           <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-200">
               <div className="flex justify-end p-4">
                   <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-text-secondary">
                       <X />
                   </button>
               </div>
               <div className="h-full overflow-y-auto pb-20">
                 <div className="px-6 pb-6">
                     <div className="flex items-center gap-3 mb-8">
                        <img 
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <div className="font-bold">{user.name}</div>
                            <div className="text-xs text-text-secondary">{user.role}</div>
                        </div>
                     </div>
                     <nav className="space-y-2">
                        {['Dashboard', 'Meu Extrato', 'Metas', 'Simulador'].map((item, idx) => (
                            <a key={idx} href="#" className={`block px-4 py-3 rounded-xl font-medium ${item === 'Dashboard' ? 'bg-primary-light text-primary' : 'text-text-secondary'}`}>
                                {item}
                            </a>
                        ))}
                        <button 
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsSettingsOpen(true);
                            }}
                            className="w-full text-left block px-4 py-3 rounded-xl font-medium text-text-secondary hover:bg-slate-50"
                        >
                            Configurações
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50"
                        >
                            <LogOut size={16} />
                            Sair
                        </button>
                     </nav>
                 </div>
               </div>
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col relative transition-all duration-300 ${
            (user.hasChildren || user.isAdmin)
                ? 'pt-32 md:pt-16' // Adjusted for header height
                : 'pt-16 md:pt-0'
        }`}>
        {loadingData ? (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        ) : bonusData ? (
            <Dashboard data={bonusData} />
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-secondary p-8 text-center">
                <div className="bg-emerald-50 p-6 rounded-full mb-4">
                    <Users size={48} className="text-emerald-200" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-2">Selecione um nível para visualizar</h3>
                <p className="max-w-md mx-auto">Utilize a barra de navegação superior para filtrar por Diretoria, Empresa e Gerência.</p>
            </div>
        )}
      </div>
      
    </div>
  );
};

export default App;