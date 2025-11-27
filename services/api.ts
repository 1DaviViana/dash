import { UserProfile, BonusData, NavNode } from '../types';
import { Rocket, Users, Smile } from 'lucide-react';

// --- MOCK DATABASE ---

const COMPANIES = ['NTA', 'TOYAMA', 'NORDTECH', 'AQUABRAZIL'];

const USERS_DB: UserProfile[] = [
    // Level 0: Admin
    {
        id: 'admin',
        name: 'Administrador',
        role: 'Administrador',
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=111827&color=fff',
        isAdmin: true,
        hasChildren: true
    },
    // Level 1: Diretoria
    {
        id: 'paulo',
        name: 'Paulo',
        role: 'Diretor',
        avatarUrl: 'https://ui-avatars.com/api/?name=Paulo&background=0f172a&color=fff',
        parentId: 'admin',
        hasChildren: true
    },
    // Level 2/3: Gerência / Gerência Geral (Nordtech)
    {
        id: 'maestri',
        name: 'Maestri',
        role: 'Gerente',
        company: 'NORDTECH',
        avatarUrl: 'https://ui-avatars.com/api/?name=Maestri&background=10B981&color=fff',
        parentId: 'paulo',
        hasChildren: true
    },
    // Level 2/3: Gerência / Gerência Geral (Toyama)
    {
        id: 'nunes',
        name: 'Nunes',
        role: 'Gerente Geral',
        company: 'TOYAMA',
        avatarUrl: 'https://ui-avatars.com/api/?name=Nunes&background=EF4444&color=fff',
        parentId: 'paulo',
        hasChildren: true
    },
    // Level 4: Gestor (Nordtech)
    {
        id: 'moema',
        name: 'Moema',
        role: 'Gestor',
        company: 'NORDTECH',
        avatarUrl: 'https://ui-avatars.com/api/?name=Moema&background=34D399&color=fff',
        parentId: 'maestri',
        hasChildren: true
    },
    // Level 4: Gestor (Toyama)
    {
        id: 'sonia',
        name: 'Sonia',
        role: 'Gerente', // Reports to Nunes (Gerente Geral)
        company: 'TOYAMA',
        avatarUrl: 'https://ui-avatars.com/api/?name=Sonia&background=F87171&color=fff',
        parentId: 'nunes',
        hasChildren: true
    },
    {
        id: 'tadeu',
        name: 'Tadeu',
        role: 'Gestor', // Reports to Sonia
        company: 'TOYAMA',
        avatarUrl: 'https://ui-avatars.com/api/?name=Tadeu&background=FCA5A5&color=fff',
        parentId: 'sonia',
        hasChildren: true
    },
    // Level 5: Televendas (Nordtech)
    {
        id: 'ana',
        name: "Ana Clara",
        role: "Televendas",
        company: 'NORDTECH',
        avatarUrl: "https://ui-avatars.com/api/?name=Ana+Clara&background=6EE7B7&color=fff",
        parentId: 'moema',
        hasChildren: false
    },
    {
        id: 'carlos',
        name: "Carlos",
        role: "Televendas",
        company: 'NORDTECH',
        avatarUrl: "https://ui-avatars.com/api/?name=Carlos&background=6EE7B7&color=fff",
        parentId: 'moema',
        hasChildren: false
    },
    // Level 5: Televendas (Toyama)
    {
        id: 'gabriel',
        name: "Gabriel",
        role: "Televendas",
        company: 'TOYAMA',
        avatarUrl: "https://ui-avatars.com/api/?name=Gabriel&background=FECACA&color=fff",
        parentId: 'tadeu',
        hasChildren: false
    }
];

// Reusable Table Structure
const BASE_TABLE = {
    title: "Régua de Bonificação",
    columns: [
        { header: "Acima de", accessor: "threshold", type: "percentage" },
        { header: "Objetivo atingido", accessor: "range", type: "text" },
        { header: "Venda Empresa", accessor: "val1", type: "currency" },
        { header: "Venda Específico", accessor: "val2", type: "currency" },
        { header: "Margem", accessor: "val3", type: "currency" },
    ] as any[],
    rows: [
        { id: 1, threshold: 0, range: "até 49,9%", val1: 0, val2: 0, val3: 0 },
        { id: 2, threshold: 50, range: "50 a 59,9%", val1: 148.15, val2: 493.83, val3: 63.49 },
        { id: 3, threshold: 60, range: "60 a 69,9%", val1: 200.00, val2: 666.67, val3: 85.71 },
        { id: 4, threshold: 70, range: "70 a 79,9%", val1: 270.00, val2: 900.00, val3: 115.71 },
        { id: 5, threshold: 80, range: "80 a 84,9%", val1: 313.20, val2: 1044.00, val3: 134.23 },
        { id: 9, threshold: 100, range: "100 a 104,9%", val1: 684.85, val2: 2282.82, val3: 293.51 },
        { id: 11, threshold: 110, range: "110 a 114,9%", val1: 937.49, val2: 3124.95, val3: 401.78 },
        { id: 13, threshold: 125, range: "acima de 125%", val1: 1283.32, val2: 4277.75, val3: 550.00 },
    ]
};

// --- DATA DEFINITIONS PER USER ---

interface MetricData {
    pct: number;
    val: number;
}

interface UserPerformanceConfig {
    empresa: MetricData;
    especifico: MetricData;
    margem: MetricData;
    adjustments: { label: string; value: number }[];
}

// Manually defined data for each user to ensure separation and realism
const USER_PERFORMANCE_DATA: Record<string, UserPerformanceConfig> = {
    // PAULO (Diretor): Good overall, consistent
    paulo: {
        empresa: { pct: 105, val: 684.85 },
        especifico: { pct: 101, val: 2282.82 },
        margem: { pct: 112, val: 401.78 },
        adjustments: [
            { label: "Adiantamento", value: -1200.00 },
            { label: "Impostos Retidos", value: -450.00 }
        ]
    },
    // MAESTRI (Nordtech): Excellent specific sales, lower margin
    maestri: {
        empresa: { pct: 105, val: 684.85 },
        especifico: { pct: 115, val: 3124.95 },
        margem: { pct: 82, val: 134.23 },
        adjustments: [
            { label: "Vale Combustível", value: -200.00 }
        ]
    },
    // NUNES (Toyama): Struggling with specific goals
    nunes: {
        empresa: { pct: 105, val: 684.85 },
        especifico: { pct: 75, val: 900.00 },
        margem: { pct: 95, val: 293.51 },
        adjustments: []
    },
    // MOEMA (Gestor Nordtech): Star performer
    moema: {
        empresa: { pct: 102, val: 684.85 },
        especifico: { pct: 128, val: 4277.75 },
        margem: { pct: 115, val: 401.78 },
        adjustments: [
            { label: "Adiantamento Quinzenal", value: -800.00 }
        ]
    },
    // SONIA (Gerente Toyama): Average
    sonia: {
        empresa: { pct: 98, val: 313.20 },
        especifico: { pct: 88, val: 1044.00 },
        margem: { pct: 100, val: 293.51 },
        adjustments: []
    },
    // TADEU (Gestor Toyama): Low performance
    tadeu: {
        empresa: { pct: 98, val: 313.20 },
        especifico: { pct: 65, val: 666.67 },
        margem: { pct: 70, val: 115.71 },
        adjustments: []
    },
    // ANA (Televendas Nordtech): Top seller individual
    ana: {
        empresa: { pct: 102, val: 684.85 },
        especifico: { pct: 140, val: 4277.75 },
        margem: { pct: 120, val: 401.78 },
        adjustments: [
            { label: "Plano de Saúde", value: -150.00 }
        ]
    },
    // CARLOS (Televendas Nordtech): Did not hit margin
    carlos: {
        empresa: { pct: 102, val: 684.85 },
        especifico: { pct: 95, val: 1044.00 },
        margem: { pct: 45, val: 0.00 },
        adjustments: []
    },
    // GABRIEL (Televendas Toyama): Consistent middle
    gabriel: {
        empresa: { pct: 98, val: 313.20 },
        especifico: { pct: 82, val: 1044.00 },
        margem: { pct: 85, val: 134.23 },
        adjustments: []
    }
};

const getBonusDataForUser = (user: UserProfile): BonusData => {
    // Fallback for unknown users (shouldn't happen in demo)
    const config = USER_PERFORMANCE_DATA[user.id] || {
        empresa: { pct: 0, val: 0 },
        especifico: { pct: 0, val: 0 },
        margem: { pct: 0, val: 0 },
        adjustments: []
    };

    const grossTotal = config.empresa.val + config.especifico.val + config.margem.val;
    const totalAdjustments = config.adjustments.reduce((acc, curr) => acc + curr.value, 0);
    const netTotal = grossTotal + totalAdjustments;

    return {
        month: "Maio",
        year: 2024,
        totalValue: netTotal,
        isPaid: true,
        grossTotal: grossTotal,
        totalAdjustments: Math.abs(totalAdjustments),
        netTotal: netTotal,
        components: [
            {
                id: 'venda_empresa',
                title: user.company ? `Venda ${user.company}` : "Venda Global",
                subtitle: "Meta Estratégica",
                value: config.empresa.val,
                percentage: config.empresa.pct,
                icon: Rocket,
                color: config.empresa.pct >= 100 ? "text-primary" : "text-yellow-500",
                tableAccessor: 'val1'
            },
            {
                id: 'venda_especifico',
                title: "Venda Equipe/Carteira",
                subtitle: "Meta Tática",
                value: config.especifico.val,
                percentage: config.especifico.pct,
                icon: Users,
                color: config.especifico.pct >= 100 ? "text-primary" : config.especifico.pct >= 70 ? "text-blue-500" : "text-red-500",
                tableAccessor: 'val2'
            },
            {
                id: 'margem',
                title: "Margem Contribuição",
                subtitle: "Meta de 20%",
                value: config.margem.val,
                percentage: config.margem.pct,
                icon: Smile,
                color: config.margem.pct >= 100 ? "text-primary" : config.margem.pct >= 80 ? "text-blue-500" : "text-red-500",
                tableAccessor: 'val3'
            }
        ],
        adjustments: config.adjustments.map((adj, idx) => ({
            id: `adj-${user.id}-${idx}`,
            ...adj
        })),
        bonusTable: BASE_TABLE
    };
};

const BONUS_DB: Record<string, BonusData> = {};
// Populate all users with specific data
USERS_DB.forEach(u => {
    if (u.id !== 'admin') {
        BONUS_DB[u.id] = getBonusDataForUser(u);
    }
});

// --- SERVICE API ---

export const api = {
    login: async (username: string): Promise<UserProfile> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        const user = USERS_DB.find(u => u.name.toLowerCase().includes(username.toLowerCase()) || u.id === username.toLowerCase());
        
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        return user;
    },

    getBonusData: async (userId: string): Promise<BonusData | null> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (userId === 'admin') return null;
        return BONUS_DB[userId] || null;
    },

    /**
     * Determines the next available options in the hierarchy based on the current context.
     */
    getNextLevelOptions: async (currentNode: NavNode | null, previousNode: NavNode | null, rootUser: UserProfile): Promise<NavNode[]> => {
        // Delay for realism
        // await new Promise(resolve => setTimeout(resolve, 100));

        // Scenario 0: Start for Admin
        if (rootUser.isAdmin && !currentNode) {
             const directors = USERS_DB.filter(u => u.parentId === 'admin');
             return directors.map(d => ({ type: 'user', id: d.id, name: d.name, data: d }));
        }

        if (!currentNode) return [];

        // Scenario 2: Director selected (Paulo) -> Show Companies
        if (currentNode.type === 'user' && currentNode.data?.role === 'Diretor') {
            return COMPANIES.map(c => ({ type: 'company', id: c, name: c }));
        }

        // Scenario 3: Company selected -> Show Managers of that company
        // We find users in this company whose parent is the PREVIOUS NODE (The Director)
        if (currentNode.type === 'company' && previousNode?.type === 'user') {
            const directorId = previousNode.id;
            const managers = USERS_DB.filter(u => 
                u.company === currentNode.id && 
                u.parentId === directorId
            );
            return managers.map(m => ({ type: 'user', id: m.id, name: m.name, data: m }));
        }

        // Scenario 4: Manager/Gestor selected -> Show direct reports
        if (currentNode.type === 'user') {
            const reports = USERS_DB.filter(u => u.parentId === currentNode.id);
            return reports.map(r => ({ type: 'user', id: r.id, name: r.name, data: r }));
        }

        return [];
    }
};