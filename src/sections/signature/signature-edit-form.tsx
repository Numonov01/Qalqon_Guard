import type { Signature } from 'src/types/signature';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createSignature, updateSignature } from 'src/service/signature';

import { toast } from 'src/components/snackbar';
import { Form, RHFTextField } from 'src/components/hook-form';

export const NewSignatureSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  sha256: zod.string().min(1, { message: 'SHA256 is required!' }),
  md5: zod.string().min(1, { message: 'MD5 is required!' }),
  file_type: zod.string().min(1, { message: 'File type is required!' }),
});

export type NewSignatureSchemaType = zod.infer<typeof NewSignatureSchema>;

type Props = {
  signature?: Signature;
};

export function NewEditForm({ signature }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      title: signature?.title || '',
      sha256: signature?.sha256 || '',
      md5: signature?.md5 || '',
      file_type: signature?.file_type || '',
    }),
    [signature]
  );

  const methods = useForm<NewSignatureSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewSignatureSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (signature?.id) {
        await updateSignature(signature.id, data);
        toast.success('Update success!');
      } else {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('sha256', data.sha256);
        formData.append('md5', data.md5);
        formData.append('file_type', data.file_type);

        await createSignature(formData);
        toast.success('Create success!');
      }

      reset();
      router.push(paths.dashboard.signature.list);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while saving the signature');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Box
            maxWidth="xl"
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <RHFTextField name="title" label="Title" />
            <RHFTextField name="sha256" label="SHA256" />
            <RHFTextField name="md5" label="MD5" />
            <RHFTextField name="file_type" label="File Type" />
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!signature ? 'Create signature' : 'Save changes'}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </Form>
  );
}
