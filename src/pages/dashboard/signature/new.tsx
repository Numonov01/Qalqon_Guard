import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SignatureCreateView } from 'src/sections/signature/view/signature-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new signature | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SignatureCreateView />
    </>
  );
}
