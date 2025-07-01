import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import OverviewNotificationView from 'src/sections/overview/notification/view/overview-notification-view';

// ----------------------------------------------------------------------

const metadata = { title: `Notification | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewNotificationView />
    </>
  );
}
