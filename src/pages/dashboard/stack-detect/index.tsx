import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import OverviewStackDetectView from 'src/sections/overview/stack-detect/view/overview-stack-detect-view';

// ----------------------------------------------------------------------

const metadata = { title: `Stack detect | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewStackDetectView />
    </>
  );
}
