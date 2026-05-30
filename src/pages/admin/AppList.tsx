import { useState, useRef } from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridCell,
  type TableColumnDefinition,
  createTableColumn,
  Button,
  Spinner,
  Text,
  makeStyles,
  tokens,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Tooltip,
} from '@fluentui/react-components';
import {
  AddRegular,
  EditRegular,
  DeleteRegular,
  PeopleRegular,
  ImageRegular,
} from '@fluentui/react-icons';
import { useAdminApps, useDeleteApp, useUploadAppIcon } from '../../hooks/useAdminApps';
import { AppRegistrationForm } from './AppRegistrationForm';
import { AppAssignmentPanel } from './AppAssignmentPanel';
import type { AppDto } from '../../api/types';

const useStyles = makeStyles({
  root: { padding: '24px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  actions: { display: 'flex', gap: '8px' },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
});

const columns: TableColumnDefinition<AppDto>[] = [
  createTableColumn<AppDto>({
    columnId: 'name',
    renderHeaderCell: () => 'Name',
    renderCell: (item) => item.name,
  }),
  createTableColumn<AppDto>({
    columnId: 'url',
    renderHeaderCell: () => 'URL',
    renderCell: (item) => (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {item.url}
      </a>
    ),
  }),
  createTableColumn<AppDto>({
    columnId: 'roles',
    renderHeaderCell: () => 'Rollen',
    renderCell: (item) => item.roles.map((r) => r.name).join(', ') || '—',
  }),
];

export const AppList: React.FunctionComponent = () => {
  const styles = useStyles();
  const { data: apps, isLoading, isError } = useAdminApps();
  const deleteApp = useDeleteApp();
  const uploadIcon = useUploadAppIcon();

  const [editApp, setEditApp] = useState<AppDto | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [assignApp, setAssignApp] = useState<AppDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppDto | null>(null);
  const [iconUploadApp, setIconUploadApp] = useState<AppDto | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return (
      <div className={styles.center}>
        <Spinner label="Applikationen werden geladen…" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.center}>
        <Text>Fehler beim Laden der Applikationen.</Text>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text as="h1" className={styles.title}>
          Applikationen verwalten
        </Text>
        <Button
          appearance="primary"
          icon={<AddRegular />}
          onClick={() => setCreateOpen(true)}
        >
          Neue Applikation
        </Button>
      </div>

      <DataGrid items={apps ?? []} columns={columns} getRowId={(item) => item.id}>
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<AppDto>>
          {({ item, rowId }) => (
            <DataGridRow<AppDto> key={rowId}>
              {({ renderCell, columnId }) => (
                <DataGridCell>
                  {columnId === 'name' ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {renderCell(item)}
                      <div className={styles.actions}>
                        <Tooltip content="Bearbeiten" relationship="label">
                          <Button
                            icon={<EditRegular />}
                            appearance="transparent"
                            size="small"
                            onClick={() => setEditApp(item)}
                          />
                        </Tooltip>
                        <Tooltip content="Benutzer/Gruppen zuweisen" relationship="label">
                          <Button
                            icon={<PeopleRegular />}
                            appearance="transparent"
                            size="small"
                            onClick={() => setAssignApp(item)}
                          />
                        </Tooltip>
                        <Tooltip content="Icon hochladen" relationship="label">
                          <Button
                            icon={<ImageRegular />}
                            appearance="transparent"
                            size="small"
                            onClick={() => { setIconUploadApp(item); setIconFile(null); }}
                          />
                        </Tooltip>
                        <Tooltip content="Löschen" relationship="label">
                          <Button
                            icon={<DeleteRegular />}
                            appearance="transparent"
                            size="small"
                            onClick={() => setDeleteTarget(item)}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ) : (
                    renderCell(item)
                  )}
                </DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>

      {/* Create / Edit Form */}
      {(createOpen || editApp) && (
        <AppRegistrationForm
          app={editApp ?? undefined}
          onClose={() => {
            setCreateOpen(false);
            setEditApp(null);
          }}
        />
      )}

      {/* Assignment Panel */}
      {assignApp && (
        <AppAssignmentPanel app={assignApp} onClose={() => setAssignApp(null)} />
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(_, d) => !d.open && setDeleteTarget(null)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Applikation löschen</DialogTitle>
            <DialogContent>
              Soll «{deleteTarget?.name}» wirklich gelöscht werden? Diese Aktion kann nicht
              rückgängig gemacht werden.
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Abbrechen</Button>
              </DialogTrigger>
              <Button
                appearance="primary"
                onClick={() => {
                  if (deleteTarget) {
                    deleteApp.mutate(deleteTarget.id, {
                      onSettled: () => setDeleteTarget(null),
                    });
                  }
                }}
                disabled={deleteApp.isPending}
              >
                Löschen
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Icon Upload Dialog */}
      <Dialog
        open={!!iconUploadApp}
        onOpenChange={(_, d) => { if (!d.open) { setIconUploadApp(null); setIconFile(null); } }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Icon hochladen für «{iconUploadApp?.name}»</DialogTitle>
            <DialogContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
                <Text size={200}>Erlaubte Formate: PNG, JPEG, SVG, WebP — max. 512 KB</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button
                    appearance="secondary"
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Datei auswählen
                  </Button>
                  {iconFile && <Text size={200}>{iconFile.name}</Text>}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => setIconFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                appearance="secondary"
                onClick={() => { setIconUploadApp(null); setIconFile(null); }}
                disabled={uploadIcon.isPending}
              >
                Abbrechen
              </Button>
              <Button
                appearance="primary"
                disabled={!iconFile || uploadIcon.isPending}
                onClick={() => {
                  if (iconUploadApp && iconFile) {
                    uploadIcon.mutate(
                      { appId: iconUploadApp.id, file: iconFile },
                      { onSuccess: () => { setIconUploadApp(null); setIconFile(null); } }
                    );
                  }
                }}
              >
                Hochladen
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};
