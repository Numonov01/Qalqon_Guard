import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  notification: icon('ic-notification'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      { title: 'Zararli fayllar', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: "Edr to'liq loglar", path: paths.dashboard.general.analytics, icon: ICONS.blog },
      { title: 'Edr loglar', path: paths.dashboard.general.file, icon: ICONS.external },
      {
        title: 'Imtiyozni oshirish',
        path: paths.dashboard.general.privilege,
        icon: ICONS.analytics,
      },
      {
        title: 'Stack faoliyatini aniqlash',
        path: paths.dashboard.general.detect,
        icon: ICONS.course,
      },
      {
        title: 'Shubhali skriptlar',
        path: paths.dashboard.general.suspiciousscripts,
        icon: ICONS.chat,
      },
      {
        title: 'Shubhali fayllar',
        path: paths.dashboard.general.suspicious,
        icon: ICONS.file,
      },
      {
        title: 'Drayverni yuklash',
        path: paths.dashboard.general.driver,
        icon: ICONS.order,
      },
      {
        title: 'Xabarnoma',
        path: paths.dashboard.general.notification,
        icon: ICONS.notification,
      },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'YARA qoidasi',
        path: paths.dashboard.user.root,
        icon: ICONS.disabled,
        children: [
          { title: 'Roʻyxat', path: paths.dashboard.user.list },
          { title: 'Yaratish', path: paths.dashboard.user.new },
          // { title: 'Edit', path: paths.dashboard.user.demo.edit },
        ],
      },
      {
        title: 'Signaturalar',
        path: paths.dashboard.signature.root,
        icon: ICONS.booking,
        children: [
          { title: 'Roʻyxat', path: paths.dashboard.signature.list },
          { title: 'Yaratish', path: paths.dashboard.signature.new },
          // { title: 'Edit', path: paths.dashboard.signature.demo.edit },
        ],
      },
    ],
  },
];
