import type { YaraRule } from 'src/types/yara-rule';

import { useParams } from 'react-router';
import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { fetchYaraRuleById } from 'src/service/yara-rule';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NewEditForm } from '../yara-rule-edit-form';

// ----------------------------------------------------------------------

type Props = {
  rule?: YaraRule;
};

export function UserEditView({ rule: yaraRule }: Props) {
  const { id } = useParams();
  const [rule, setRule] = useState<YaraRule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRule = async () => {
      try {
        const data = await fetchYaraRuleById(Number(id));
        setRule(data);
      } catch (error) {
        console.error('Error fetching rule by id:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadRule();
  }, [id]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: yaraRule?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {!loading && rule && <NewEditForm yaraRule={rule} />}
    </DashboardContent>
  );
}
