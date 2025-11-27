import { LucideIcon } from 'lucide-react';

export interface UserProfile {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    isAdmin?: boolean; // Global admin
    company?: 'NTA' | 'TOYAMA' | 'NORDTECH' | 'AQUABRAZIL';
    parentId?: string; // ID of the manager
    hasChildren?: boolean; // If true, can be drilled down
}

// Used for the navigation stack (breadcrumbs)
export interface NavNode {
    type: 'user' | 'company';
    id: string;
    name: string;
    data?: UserProfile; // If type is user
}

export interface BonusComponent {
    id: string;
    title: string;
    subtitle: string;
    value: number;
    percentage: number;
    icon: LucideIcon;
    color: string;
    tableAccessor?: string;
}

export interface Adjustment {
    id: string;
    label: string;
    value: number;
}

export interface BonusTableColumn {
    header: string;
    accessor: string; // key to access data in row
    type: 'text' | 'percentage' | 'currency';
}

export interface BonusTableRow {
    id: number;
    threshold: number; // Added specific type for threshold logic
    [key: string]: string | number; // Dynamic access based on columns
}

export interface BonusTableData {
    title: string;
    columns: BonusTableColumn[];
    rows: BonusTableRow[];
}

export interface BonusData {
    month: string;
    year: number;
    totalValue: number;
    isPaid: boolean;
    components: BonusComponent[];
    adjustments: Adjustment[];
    grossTotal: number;
    totalAdjustments: number;
    netTotal: number;
    bonusTable: BonusTableData;
}

export type DataSourceType = 'excel' | 'sql';

export interface DataSourceConfig {
    id: string; // matches component id
    name: string;
    sourceType: DataSourceType;
    lastUpdated: string;
    status: 'connected' | 'pending' | 'error';
    details: string; // filename or connection string summary
}