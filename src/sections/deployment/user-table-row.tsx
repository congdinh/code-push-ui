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

// Types for metrics data
interface MetricVerion {
  active?: number;
  downloaded?: number;
  failed?: number;
  installed?: number;
}

export interface Metrics {
  metrics?: {
    [version: string]: MetricVerion;
  };
}

interface DiffPackage {
  size: number;
  url: string;
}

interface Package {
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

export interface DeploymentProps {
  id: string;
  key: string;
  name: string;
  package: Package | null;
}

type UserTableRowProps = {
  row: DeploymentProps;
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
              {row.id}
            </Label>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(row.id);
              }}
            >
              <Iconify icon="mdi:content-copy" width={16} />
            </IconButton>
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar
              alt={row.name}
              src="/static/mock-images/avatars/avatar_default.jpg"
              sx={{
                bgcolor:
                  row.name === 'Production'
                    ? 'success.light'
                    : row.name === 'Staging'
                      ? 'warning.light'
                      : row.name === 'Test'
                        ? 'info.light'
                        : 'default',
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box
                component="span"
                sx={{
                  fontWeight: 'bold',
                  color:
                    row.name === 'Production'
                      ? 'success.main'
                      : row.name === 'Staging'
                        ? 'warning.main'
                        : row.name === 'Test'
                          ? 'info.main'
                          : 'primary.main',
                }}
              >
                {row.name}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  component="span"
                  sx={{
                    maxWidth: 100,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    typography: 'caption',
                    color: 'text.secondary',
                  }}
                >
                  {row.key}
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(row.key);
                  }}
                >
                  <Iconify icon="mdi:content-copy" width={14} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          {row.package ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                Description: {row.package.description}
              </Box>
              <Box sx={{ typography: 'caption', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <span>Method: {row.package.releaseMethod}</span>
                <span>Size: {Math.round(row.package.size / 1024 / 1024)}MB</span>
                <span>Hash: {row.package.packageHash.substring(0, 10)}...</span>
                <span>
                  BlobUrl:{' '}
                  <a href={row.package.blobUrl} target="_blank" rel="noopener noreferrer">
                    {row.package.blobUrl.substring(0, 20)}...
                  </a>
                </span>
                <span>
                  ManifestUrl:{' '}
                  <a href={row.package.manifestBlobUrl} target="_blank" rel="noopener noreferrer">
                    {row.package.manifestBlobUrl.substring(0, 20)}...
                  </a>
                </span>
              </Box>
              {row.package.diffPackageMap && Object.keys(row.package.diffPackageMap).length > 0 && (
                <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                  Diff packages: {Object.keys(row.package.diffPackageMap).length}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {Object.entries(row.package.diffPackageMap)
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
                    {Object.keys(row.package.diffPackageMap).length > 3 && (
                      <Box component="span" sx={{ typography: 'caption' }}>
                        +{Object.keys(row.package.diffPackageMap).length - 3} more
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ typography: 'body2', color: 'text.secondary' }}>No package available</Box>
          )}
        </TableCell>

        <TableCell align="left">
          {row.package ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Label variant="soft" color="info" sx={{ typography: 'caption' }}>
                  {row.package.label}
                </Label>
                <Box component="span" sx={{ typography: 'body2' }}>
                  {row.package.appVersion}
                </Box>
              </Box>
              <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                {row.package.releasedBy.substring(0, 20)}...
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
                {new Date(row.package.uploadTime).toLocaleString()}
              </Box>
            </Box>
          ) : (
            <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
              No package deployed
            </Box>
          )}
        </TableCell>

        <TableCell align="left">
          {row.package ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ typography: 'caption' }}>
                <Label
                  variant="soft"
                  color={row.package.isMandatory ? 'error' : 'warning'}
                  sx={{ typography: 'caption' }}
                >
                  {row.package.isMandatory ? 'Mandatory' : 'Optional'}
                </Label>
                Rollout: {row.package.rollout}%
              </Box>
            </Box>
          ) : (
            '-'
          )}
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.package?.isDisabled ? (
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

        <TableCell>
          {(row as any).versions?.metrics ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {Object.entries((row as any).versions.metrics)
                .filter(([version, data]) => (data as MetricVerion).active !== undefined)
                // .slice(0, 3)
                .map(([version, data]) => (
                  <Box
                    key={version}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Label
                      variant="soft"
                      color={/^v\d+$/.test(version) ? 'info' : 'secondary'}
                      sx={{ typography: 'caption', minWidth: '45px', textAlign: 'center' }}
                    >
                      {version}
                    </Label>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1.5,
                        typography: 'caption',
                        bgcolor: 'background.neutral',
                        borderRadius: 0.75,
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      {(data as MetricVerion).active !== undefined && (
                        <span>
                          Active: <b>{(data as MetricVerion).active}</b>
                        </span>
                      )}
                      {(data as MetricVerion).downloaded !== undefined && (
                        <span>
                          Download: <b>{(data as MetricVerion).downloaded}</b>
                        </span>
                      )}
                      {(data as MetricVerion).installed !== undefined && (
                        <span>
                          Install: <b>{(data as MetricVerion).installed}</b>
                        </span>
                      )}
                    </Box>
                  </Box>
                ))}
              {/* {Object.keys((row as any).versions?.metrics).filter(
                (version) => (row as any).versions.metrics[version].active !== undefined
              ).length > 3 && (
                <Box
                  component="span"
                  sx={{
                    typography: 'caption',
                    color: 'text.secondary',
                    pl: 1,
                  }}
                >
                  +
                  {Object.keys((row as any).versions?.metrics).filter(
                    (version) => (row as any).versions.metrics[version].active !== undefined
                  ).length - 3}{' '}
                  more versions
                </Box>
              )} */}
            </Box>
          ) : (
            <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
              No metrics available
            </Box>
          )}
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
