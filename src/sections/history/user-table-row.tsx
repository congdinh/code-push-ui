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
import { versions } from 'process';

// ----------------------------------------------------------------------

interface DiffPackage {
  size: number;
  url: string;
}

interface MetricVerion {
  active?: number;
  downloaded?: number;
  installed?: number;
}

export interface DeploymentHistoryProps {
  description: string;
  isDisabled: boolean;
  isMandatory: boolean;
  rollout: number;
  appVersion: string;
  packageHash: string;
  blobUrl: string;
  size: number;
  manifestBlobUrl: string;
  releaseMethod: string;
  uploadTime: number;
  label: string;
  releasedBy: string;
  diffPackageMap?: {
    [hash: string]: DiffPackage;
  };
}

type UserTableRowProps = {
  row: DeploymentHistoryProps;
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

        <TableCell component="th" scope="row">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Label variant="soft" color="primary" sx={{ typography: 'caption' }}>
              {row.label}
            </Label>
          </Box>
        </TableCell>

        <TableCell align="left">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Label variant="soft" color="info" sx={{ typography: 'caption' }}>
                {row.appVersion}
              </Label>
            </Box>
            <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
              {row.releasedBy}
            </Box>
            <Box
              component="span"
              sx={{
                typography: 'caption',
                color: 'text.secondary',
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {new Date(row.uploadTime).toLocaleString()}
            </Box>
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
              App Version: {row.appVersion}
            </Box>
            <Box sx={{ typography: 'caption', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <span>Method: {row.releaseMethod}</span>
              <span>Size: {Math.round(row.size / 1024 / 1024)}MB</span>
              <span>Hash: {row.packageHash.substring(0, 10)}...</span>
              <span>
                BlobUrl:{' '}
                <a href={row.blobUrl} target="_blank" rel="noopener noreferrer">
                  {row.blobUrl.substring(0, 20)}...
                </a>
              </span>
              <span>
                ManifestUrl:{' '}
                <a href={row.manifestBlobUrl} target="_blank" rel="noopener noreferrer">
                  {row.manifestBlobUrl.substring(0, 20)}...
                </a>
              </span>
            </Box>
            {row.diffPackageMap && Object.keys(row.diffPackageMap).length > 0 && (
              <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                Diff packages: {Object.keys(row.diffPackageMap).length}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {Object.entries(row.diffPackageMap)
                    .slice(0, 3)
                    .map(([hash, diff]) => (
                      <Label
                        key={hash}
                        variant="soft"
                        color="default"
                        sx={{ typography: 'caption' }}
                      >
                        {hash.substring(0, 6)}... ({Math.round(diff.size / 1024)}KB)
                      </Label>
                    ))}
                  {Object.keys(row.diffPackageMap).length > 3 && (
                    <Box component="span" sx={{ typography: 'caption' }}>
                      +{Object.keys(row.diffPackageMap).length - 3} more
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </TableCell>

        <TableCell>
          <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
            {(() => {
              try {
                const descObj = JSON.parse(row.description);
                return (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {descObj.vi && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Label
                          variant="soft"
                          color="info"
                          sx={{ typography: 'caption', minWidth: '45px', textAlign: 'center' }}
                        >
                          VI
                        </Label>
                        <Box sx={{ typography: 'caption' }}>{descObj.vi.description}</Box>
                      </Box>
                    )}
                    {descObj.en && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Label
                          variant="soft"
                          color="secondary"
                          sx={{ typography: 'caption', minWidth: '45px', textAlign: 'center' }}
                        >
                          EN
                        </Label>
                        <Box sx={{ typography: 'caption' }}>{descObj.en.description}</Box>
                      </Box>
                    )}
                  </Box>
                );
              } catch (e) {
                return row.description;
              }
            })()}
          </Box>
        </TableCell>

        <TableCell align="left">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="span" sx={{ typography: 'caption' }}>
              <Label
                variant="soft"
                color={row.isMandatory ? 'error' : 'warning'}
                sx={{ typography: 'caption' }}
              >
                {row.isMandatory ? 'Mandatory' : 'Optional'}
              </Label>
              <br />
              Rollout: {row.rollout || 0}%
            </Box>
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.isDisabled ? (
              <Label color="error" variant="soft" sx={{ typography: 'caption' }}>
                Disable
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
