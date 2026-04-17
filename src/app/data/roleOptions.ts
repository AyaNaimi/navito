import type { UserRole } from '../context/AppContext';

type RegistrationRole = Exclude<UserRole, 'super_admin'>;

export type RoleOption = {
  value: RegistrationRole;
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
];
