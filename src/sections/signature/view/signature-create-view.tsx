import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NewEditForm } from '../signature-edit-form';

export function SignatureCreateView() {
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Create a new signature"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Signatures', href: paths.dashboard.signature.root },
          { name: 'New Signature' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <NewEditForm />
    </DashboardContent>
  );
}
