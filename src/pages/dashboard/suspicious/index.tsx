import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import OverviewSuspiciousView from 'src/sections/overview/suspicious/view/overview-suspicious-view';

// ----------------------------------------------------------------------

const metadata = { title: `Suspicious | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewSuspiciousView />
    </>
  );
}
