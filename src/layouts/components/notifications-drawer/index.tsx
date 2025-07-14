import { m } from 'framer-motion';

import { Box, Badge, Stack, Drawer, SvgIcon, Tooltip, IconButton, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { Scrollbar } from 'src/components/scrollbar';

import { NewMessageToast } from './new-message-toast';
import { NotificationItem } from './notification-item';
import { updateNotification, useWebSocketNotifications } from './ws';

export function NotificationsDrawer() {
  const drawer = useBoolean();
  const { notifications, setNotifications, newNotification, setNewNotification } =
    useWebSocketNotifications();

  const handleAllow = async (id: number) => {
    try {
      await updateNotification(id, 'APPROVE');
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to allow notification:', error);
    }
  };

  const handleBlock = async (id: number) => {
    try {
      await updateNotification(id, 'REJECT');
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to block notification:', error);
    }
  };

  const handleBlockAll = async () => {
    try {
      await Promise.all(notifications.map((n) => updateNotification(n.id, 'REJECT')));
      setNotifications([]);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={notifications.length} color="error">
          <SvgIcon>
            <path
              fill="currentColor"
              d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.794 25.794 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.393 4.393 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
              opacity="0.5"
            />
            <path
              fill="currentColor"
              d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
            />
          </SvgIcon>
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        PaperProps={{ sx: { width: 1, maxWidth: 720 } }}
      >
        <Stack direction="row" alignItems="center" sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bildirishnomalar
          </Typography>

          <Tooltip title="Mark all as blocked">
            <IconButton color="primary" onClick={handleBlockAll}>
              <Iconify icon="eva:done-all-fill" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Scrollbar>
          <Box component="ul" sx={{ p: 2 }}>
            {Array.isArray(notifications) &&
              notifications.map((notification) => (
                <Box component="li" key={notification.id} sx={{ mb: 2 }}>
                  <NotificationItem
                    notification={notification}
                    onAllow={handleAllow}
                    onBlock={handleBlock}
                  />
                </Box>
              ))}
          </Box>
        </Scrollbar>
      </Drawer>

      <NewMessageToast open={newNotification} onClose={() => setNewNotification(false)} />
    </>
  );
}
