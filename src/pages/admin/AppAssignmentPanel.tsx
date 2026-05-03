import {
  Button,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Input,
  makeStyles,
  OverlayDrawer,
  Spinner,
  Tag,
  TagGroup,
  Text,
  tokens,
} from '@fluentui/react-components'
import { AddRegular, DismissRegular } from '@fluentui/react-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { assignGroups } from '../../api/assignments'
import type { AppDto } from '../../api/types'
import { useAppAuth } from '../../hooks/useAppAuth'

const useStyles = makeStyles({
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '16px',
  },
  tagRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  success: {
    color: tokens.colorStatusSuccessForeground1,
  },
  error: {
    color: tokens.colorStatusDangerForeground1,
  },
})

interface AppAssignmentPanelProps {
  app: AppDto
  onClose: () => void
}

export function AppAssignmentPanel({ app, onClose }: AppAssignmentPanelProps) {
  const styles = useStyles()
  const { token } = useAppAuth()
  const queryClient = useQueryClient()

  const [groupIds, setGroupIds] = useState<string[]>([])
  const [userIds, setUserIds] = useState<string[]>([])
  const [newGroup, setNewGroup] = useState('')
  const [newUser, setNewUser] = useState('')

  const mutation = useMutation({
    mutationFn: () =>
      assignGroups(token!, app.id, { appId: app.id, groupIds, userIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'apps'] })
    },
  })

  function addGroup() {
    const t = newGroup.trim()
    if (!t || groupIds.includes(t)) return
    setGroupIds((p) => [...p, t])
    setNewGroup('')
  }

  function addUser() {
    const t = newUser.trim()
    if (!t || userIds.includes(t)) return
    setUserIds((p) => [...p, t])
    setNewUser('')
  }

  return (
    <OverlayDrawer open position="end" onOpenChange={(_, d) => !d.open && onClose()}>
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              icon={<DismissRegular />}
              onClick={onClose}
            />
          }
        >
          Zuweisungen: {app.name}
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <div className={styles.body}>
          <Text>
            Gruppen oder Benutzer eingeben, die Zugriff auf <strong>{app.name}</strong> erhalten
            sollen.
          </Text>

          <Field label="Gruppen-IDs">
            <div className={styles.tagRow}>
              {groupIds.length > 0 && (
                <TagGroup
                  onDismiss={(_, d) =>
                    setGroupIds((p) => p.filter((g) => g !== d.value))
                  }
                >
                  {groupIds.map((g) => (
                    <Tag key={g} value={g} dismissible>
                      {g}
                    </Tag>
                  ))}
                </TagGroup>
              )}
              <Input
                value={newGroup}
                onChange={(_, d) => setNewGroup(d.value)}
                onKeyDown={(e) => e.key === 'Enter' && addGroup()}
                placeholder="Gruppen-ID…"
                size="small"
              />
              <Button icon={<AddRegular />} size="small" onClick={addGroup} />
            </div>
          </Field>

          <Field label="Benutzer-IDs">
            <div className={styles.tagRow}>
              {userIds.length > 0 && (
                <TagGroup
                  onDismiss={(_, d) =>
                    setUserIds((p) => p.filter((u) => u !== d.value))
                  }
                >
                  {userIds.map((u) => (
                    <Tag key={u} value={u} dismissible>
                      {u}
                    </Tag>
                  ))}
                </TagGroup>
              )}
              <Input
                value={newUser}
                onChange={(_, d) => setNewUser(d.value)}
                onKeyDown={(e) => e.key === 'Enter' && addUser()}
                placeholder="Benutzer-ID…"
                size="small"
              />
              <Button icon={<AddRegular />} size="small" onClick={addUser} />
            </div>
          </Field>

          {mutation.isSuccess && (
            <Text className={styles.success}>Zuweisungen wurden gespeichert.</Text>
          )}
          {mutation.isError && (
            <Text className={styles.error}>Fehler beim Speichern der Zuweisungen.</Text>
          )}

          <Button
            appearance="primary"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || (groupIds.length === 0 && userIds.length === 0)}
            icon={mutation.isPending ? <Spinner size="tiny" /> : undefined}
          >
            Zuweisungen speichern
          </Button>
        </div>
      </DrawerBody>
    </OverlayDrawer>
  )
}
