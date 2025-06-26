import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import OverviewDriverLoadView from 'src/sections/overview/driver-load/view/overview-drive-load-view';

// ----------------------------------------------------------------------

const metadata = { title: `Driver load | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewDriverLoadView />
    </>
  );
}
