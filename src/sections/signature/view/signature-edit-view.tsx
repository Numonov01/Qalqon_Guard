import type { Signature } from 'src/types/signature';

import { useParams } from 'react-router';
import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { fetchSignatureById } from 'src/service/signature';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NewEditForm } from '../signature-edit-form';

export function SignatureEditView() {
  const { id } = useParams();
  const [currentSignature, setCurrentSignature] = useState<Signature | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSignature = async () => {
      try {
        if (id) {
          const data = await fetchSignatureById(Number(id));
          setCurrentSignature(data);
        }
      } catch (error) {
        console.error('Error fetching signature:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSignature();
  }, [id]);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Edit Signature"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Signatures', href: paths.dashboard.signature.root },
          { name: currentSignature?.title || 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {!loading && currentSignature && <NewEditForm signature={currentSignature} />}
    </DashboardContent>
  );
}
