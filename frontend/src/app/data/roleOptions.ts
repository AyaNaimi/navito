import type { UserRole } from '../context/AppContext';

export type RoleOption = {
  value: UserRole;
  label: string;
  description: string;
};

export const roleOptions: RoleOption[] = [
  {
    value: 'tourist',
    label: 'Touriste',
    description: 'Explore le pays, les villes, les recommandations et les services de voyage.',
  },
  {
    value: 'guide',
    label: 'Guide',
    description: 'Accede a son espace guide pour gerer ses demandes, disponibilites et messages.',
  },
  {
    value: 'driver',
    label: 'Chauffeur',
    description: 'Accede a son dashboard chauffeur apres inscription et verification.',
  },
  {
    value: 'super_admin',
    label: 'Super admin',
    description: 'Accede au dashboard global pour piloter la plateforme et les CRUD.',
  },
];
