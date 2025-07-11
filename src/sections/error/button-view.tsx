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
              backgroundColor: isRed ? '#ff1744' : '#00e676',
              '&:hover': {
                backgroundColor: isRed ? '#c4001d' : '#00c853',
              },
              fontSize: isMobile ? '34px' : '80px',
              width: isMobile ? 'calc(100vw - 50px)' : '500px',
              height: isMobile ? 'calc(100vw - 50px)' : '500px',
              borderRadius: '50%',
              fontWeight: 900,
              textTransform: 'none',
              boxShadow: 4,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {isRed ? 'ACTIVATED' : 'DISABLED'}
          </Button>

          <Button component={RouterLink} href="/" size="large" variant="contained">
            Go to home
          </Button>
        </Box>
      </Container>
    </SimpleLayout>
  );
}
