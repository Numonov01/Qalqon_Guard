import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import OverviewPrivilegeView from 'src/sections/overview/privilege/view/overview-privilege-view';

// ----------------------------------------------------------------------

const metadata = { title: `Privilege | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewPrivilegeView />
    </>
  );
}
