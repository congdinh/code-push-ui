import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// ...existing code...
// ----------------------------------------------------------------------

interface Collaborator {
  isCurrentAccount?: boolean;
  permission: string;
}

export interface AppProps {
  name: string;
  collaborators: Record<string, Collaborator>;
  deployments: string[];
}

type UserTableRowProps = {
  row: AppProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>
          <Label color={(row.name === 'banned' && 'error') || 'success'}>{row.name}</Label>
        </TableCell>

        <TableCell>
          <Box sx={{ maxWidth: 300 }}>
            {Object.entries(row.collaborators).map(([email, data], index) => (
              <Box
                key={email}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: index < Object.entries(row.collaborators).length - 1 ? 0.5 : 0,
                }}
              >
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: '0.75rem',
                    mr: 1,
                    bgcolor: data.isCurrentAccount ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {email.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      typography: 'caption',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {email}
                  </Box>
                  <Label
                    variant="soft"
                    color={data.permission === 'Owner' ? 'success' : 'info'}
                    sx={{ typography: 'caption' }}
                  >
                    {data.permission}
                  </Label>
                </Box>
              </Box>
            ))}
          </Box>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {row.deployments.map((deployment) => (
              <Label
                key={deployment}
                variant="soft"
                color={
                  deployment === 'Production'
                    ? 'success'
                    : deployment === 'Staging'
                      ? 'warning'
                      : 'info'
                }
                sx={{ typography: 'caption' }}
              >
                {deployment}
              </Label>
            ))}
          </Box>
        </TableCell>

        <TableCell align="center">
          {row.name ? (
            <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          ) : (
            '-'
          )}
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.name === 'banned' ? (
              <Label color="error" variant="soft" sx={{ typography: 'caption' }}>
                Banned
              </Label>
            ) : (
              <Label color="success" variant="soft" sx={{ typography: 'caption' }}>
                Active
              </Label>
            )}
            </Box>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
