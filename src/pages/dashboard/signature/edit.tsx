import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SignatureEditView } from 'src/sections/signature/view/signature-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Signature edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SignatureEditView />
    </>
  );
}
