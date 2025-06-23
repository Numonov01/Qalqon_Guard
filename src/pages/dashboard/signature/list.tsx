import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SignatureListView } from 'src/sections/signature/view/signature-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Signature list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SignatureListView />
    </>
  );
}
