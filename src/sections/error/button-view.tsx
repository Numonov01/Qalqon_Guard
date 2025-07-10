import { useState } from 'react';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Box, useTheme, useMediaQuery } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';

import { MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export function ButtonView() {
  const [isRed, setIsRed] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleColor = () => {
    setIsRed(!isRed);
  };

  return (
    <SimpleLayout content={{ compact: true }}>
      <Container component={MotionContainer}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: '100%',
            alignItems: 'center',
            padding: isMobile ? 2 : 0,
          }}
        >
          <Button
            variant="contained"
            onClick={toggleColor}
            sx={{
              backgroundColor: isRed ? 'red' : 'green',
              '&:hover': {
                backgroundColor: isRed ? '#c62828' : '#2e7d32',
              },
              fontSize: isMobile ? '16px' : '24px',
              width: isMobile ? '100%' : '1000px',
              height: isMobile ? '200px' : '500px',
              borderRadius: '12px',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: 4,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {isRed ? 'QIZIL' : 'YASHIL'}
          </Button>

          <Button component={RouterLink} href="/" size="large" variant="contained">
            Go to home
          </Button>
        </Box>
      </Container>
    </SimpleLayout>
  );
}
