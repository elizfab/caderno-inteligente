export type SidebarItemKey = 'dashboard' | 'estudos-labs' | 'projetos' | 'vida-criativa' | 'painel-financeiro' | 'culinaria';

export interface SidebarItem {
  key: SidebarItemKey;
  label: string;
  href: string;
  iconClass: string;
}
