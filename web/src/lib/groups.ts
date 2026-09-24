import type { CategoryGroup } from '@shared/types';

// Couleur d'accent par grande famille de produits (tuiles, icônes, badges).
export const GROUP_STYLE: Record<CategoryGroup, { tile: string; icon: string; ring: string }> = {
  components: {
    tile: 'from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/15 dark:to-violet-500/10',
    icon: 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/30',
    ring: 'group-hover:ring-indigo-400/40',
  },
  devices: {
    tile: 'from-sky-500/10 to-cyan-500/10 dark:from-sky-500/15 dark:to-cyan-500/10',
    icon: 'bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-sky-500/30',
    ring: 'group-hover:ring-sky-400/40',
  },
  infrastructure: {
    tile: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/15 dark:to-teal-500/10',
    icon: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30',
    ring: 'group-hover:ring-emerald-400/40',
  },
  peripherals: {
    tile: 'from-fuchsia-500/10 to-pink-500/10 dark:from-fuchsia-500/15 dark:to-pink-500/10',
    icon: 'bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white shadow-fuchsia-500/30',
    ring: 'group-hover:ring-fuchsia-400/40',
  },
  accessories: {
    tile: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/15 dark:to-orange-500/10',
    icon: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/30',
    ring: 'group-hover:ring-amber-400/40',
  },
};
