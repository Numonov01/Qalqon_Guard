import type { TFunction } from 'i18next';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

export function navData(t: TFunction<any, any>) {
  return [
    {
      subheader: t('subheader'),
      items: [
        {
          title: t('app'),
          path: paths.dashboard.permission,
          icon: <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/ic-invoice.svg`} />,
        },

        {
          title: t('user'),
          path: 'https://www.google.com/',
          icon: <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/ic-user.svg`} />,
        },
      ],
    },
  ];
}
