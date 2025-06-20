import type { YaraRule } from 'src/types/yara-rule';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form'; // 🔁 Import create & update
import { createRule, updateRule } from 'src/service/yara-rule';

// ----------------------------------------------------------------------

export const NewAthleteSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  file: zod
    .instanceof(File)
    .refine(
      (file) =>
        file.name.toLowerCase().endsWith('.yar') || file.name.toLowerCase().endsWith('.yara'),
      { message: 'Only .yar or .yara files are allowed' }
    ),
});

export type NewAthleteSchemaType = zod.infer<typeof NewAthleteSchema>;

type Props = {
  yaraRule?: YaraRule;
};

export function NewEditForm({ yaraRule }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: yaraRule?.name || '',
      file: undefined as File | undefined,
    }),
    [yaraRule]
  );

  const methods = useForm<NewAthleteSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewAthleteSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (yaraRule) {
      reset({
        name: yaraRule.name,
        file: undefined,
      });
    }
  }, [yaraRule, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.file) formData.append('file', data.file);

      if (yaraRule) {
        await updateRule(yaraRule.id, { name: data.name });
        toast.success('Update success!');
      } else {
        await createRule(formData);
        toast.success('Create success!');
      }

      reset();
      router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while saving the YARA rule');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <Field.Upload
                name="file"
                maxSize={5242880}
                accept={{ 'application/x-yara': ['.yar', '.yara'] }}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.yar, *.yara
                    <br /> max size of {fData(5242880)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="name" label="Yara rule name" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!yaraRule ? 'Create yara rule' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
