import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ButtonView } from 'src/sections/error/button-view';

// ----------------------------------------------------------------------

const metadata = { title: `Button! | Error - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ButtonView />
    </>
  );
}
