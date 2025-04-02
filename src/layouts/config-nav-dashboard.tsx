import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Apps',
    path: '/apps',
    icon: icon('ic-user'),
  },
  {
    title: 'Deployments',
    path: '/deployments',
    icon: icon('ic-user'),
  },
  {
    title: 'History',
    path: '/history',
    icon: icon('ic-user'),
  },
];
