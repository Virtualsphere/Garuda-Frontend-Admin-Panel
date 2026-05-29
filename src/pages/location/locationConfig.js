/**
 * ============================================================
 * LOCATION CONFIG — Static configuration for the Location page
 * ============================================================
 *
 * This file contains all constants, tab definitions, form configurations,
 * and infrastructure types used across the Location page components.
 *
 * WHY SEPARATE?
 *   Keeping config separate from logic means you can add a new tab or
 *   change a label without touching any component code.
 */

import { Globe, Landmark, Building2, Target, MapPin, Route } from 'lucide-react';

// ─── NAVIGATION TABS ──────────────────────────────────────────
// Each tab in the horizontal pill navigation bar.
// `id` is used as the routing key; `icon` renders next to the label.
export const TABS = [
  { id: 'states',      label: 'States',        icon: Globe    },
  { id: 'districts',   label: 'Districts',     icon: Landmark },
  { id: 'towns',       label: 'Towns',         icon: Building2 },
  { id: 'mandals',     label: 'Mandals',       icon: Landmark },
  { id: 'sectors',     label: 'Sectors',       icon: Target   },
  { id: 'villages',    label: 'Villages',      icon: MapPin   },
  { id: 'roads-paths', label: 'Roads & paths', icon: Route    },
];

// ─── HEADER CONFIGURATION ─────────────────────────────────────
// Title, subtitle, and icon shown in the page header per tab.
export const TAB_CONFIG = {
  states:       { title: 'REGISTRY: STATES',              subtitle: 'ADMINISTRATIVE PERIMETERS AND STATE-LEVEL OVERSIGHT',     icon: Globe     },
  districts:    { title: 'REGISTRY: DISTRICTS',            subtitle: 'ADMINISTRATIVE DISTRICTS AND TERRITORIAL BOUNDARIES',    icon: Landmark  },
  towns:        { title: 'REGISTRY: TOWNS',                subtitle: 'URBAN ADMINISTRATIVE CENTERS AND MUNICIPALITIES',        icon: Building2 },
  mandals:      { title: 'REGISTRY: MANDALS',              subtitle: 'ADMINISTRATIVE MANDALS AND TERRITORIAL CLUSTERING',      icon: Globe     },
  sectors:      { title: 'REGISTRY: SECTORS',              subtitle: 'CLUSTERING AND TERRITORIAL INTELLIGENCE',                icon: Target    },
  villages:     { title: 'REGISTRY: VILLAGES',             subtitle: 'VILLAGE DRAFTING AND TERRITORIAL CLUSTERING',            icon: Globe     },
  'roads-paths': { title: 'INFRASTRUCTURE: ROADS & PATHS', subtitle: 'CONNECTIVITY AND ACCESSIBILITY MANAGEMENT',             icon: Route     },
};

// ─── INLINE ADD-FORM CONFIGURATION ────────────────────────────
// Per-tab configuration for the inline "Add Entity" form.
// `codeLabel: null` means no code field is shown (e.g. Villages).
export const FORM_CONFIG = {
  states:    { label: 'NEW STATE NAME',    placeholder: 'e.g. Maharashtra',      codeLabel: '2-CHAR CODE', codePlaceholder: 'MH',  codeMax: 2, btnLabel: 'ADD STATE',    btnColor: 'orange' },
  districts: { label: 'NEW DISTRICT NAME', placeholder: 'e.g. Rangareddy',       codeLabel: '3-CHAR ID',   codePlaceholder: 'RRD', codeMax: 3, btnLabel: 'ADD DISTRICT', btnColor: 'orange' },
  towns:     { label: 'NEW TOWN NAME',     placeholder: 'e.g. Shamshabad Town',  codeLabel: '3-CHAR ID',   codePlaceholder: 'SBT', codeMax: 3, btnLabel: 'ADD TOWN',     btnColor: 'orange' },
  mandals:   { label: 'NEW MANDAL NAME',   placeholder: 'e.g. Shankarpally',     codeLabel: '3-CHAR ID',   codePlaceholder: 'SKP', codeMax: 3, btnLabel: 'ADD MANDAL',   btnColor: 'orange' },
  sectors:   { label: 'NEW SECTOR NAME',   placeholder: 'e.g. North Zone',       codeLabel: '3-CHAR ID',   codePlaceholder: 'SKP', codeMax: 3, btnLabel: 'ADD SECTOR',   btnColor: 'green'  },
  villages:  { label: 'NEW VILLAGE REGISTRY', placeholder: 'Enter village name...', codeLabel: null,        codePlaceholder: null,  codeMax: 0, btnLabel: 'ADD VILLAGE',  btnColor: 'orange' },
};

// ─── INFRASTRUCTURE CONSTANTS (Roads & Paths) ─────────────────
export const INFRA_CATEGORIES = ['Road', 'Path'];

export const ROAD_TYPES = ['HIGHWAY', 'DOUBLE ROAD', 'SINGLE ROAD', 'INTERNAL ROAD'];

export const PATH_TYPES = ['TRACTOR', 'CAR', 'BIKE', 'ON FOOT', 'MAIL LOAD'];

// ─── INITIAL FORM STATE ───────────────────────────────────────
// Shared default for the entity add/edit form.
export const INITIAL_FORM_DATA = {
  name: '',
  code: '',
  state_id: '',
  district_id: '',
  mandal_id: '',
};

// ─── INITIAL INFRASTRUCTURE FORM STATE ────────────────────────
export const INITIAL_INFRA_FORM = {
  routeName: '',
  category: 'Road',
  specificType: '',
};
