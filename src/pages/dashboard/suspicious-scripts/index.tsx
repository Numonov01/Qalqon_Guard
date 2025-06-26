import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import OverviewSuspiciousScriptsView from 'src/sections/overview/suspicious-scripts/view/overview-suspicious-scripts-view';

// ----------------------------------------------------------------------

const metadata = { title: `Suspicious scripts | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewSuspiciousScriptsView />
    </>
  );
}
