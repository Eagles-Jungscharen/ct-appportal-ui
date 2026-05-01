import { useState } from 'react'
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Field,
  Input,
  Tag,
  TagGroup,
  makeStyles,
  tokens,
  Text,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
} from '@fluentui/react-components'
import { AddRegular, CopyRegular } from '@fluentui/react-icons'
import { useClientRegistration } from '../../hooks/useClientRegistration'
import type { ClientRegistrationResultDto } from '../../api/types'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  tagRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  secretBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '8px 12px',
    borderRadius: tokens.borderRadiusMedium,
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
  warning: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorStatusWarningForeground1,
  },
})

interface ClientRegistrationFormProps {
  onClose: () => void
}

export function ClientRegistrationForm({ onClose }: ClientRegistrationFormProps) {
  const styles = useStyles()

  const [appId, setAppId] = useState('')
  const [clientName, setClientName] = useState('')
  const [redirectUris, setRedirectUris] = useState<string[]>([])
  const [newUri, setNewUri] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [result, setResult] = useState<ClientRegistrationResultDto | null>(null)
  const [copied, setCopied] = useState(false)

  const { mutate, isPending } = useClientRegistration()

  function validate() {
    const e: Record<string, string> = {}
    if (!appId.trim()) e.appId = 'App-ID ist erforderlich.'
    if (!clientName.trim()) e.clientName = 'Client-Name ist erforderlich.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function addUri() {
    const t = newUri.trim()
    if (!t) return
    try {
      new URL(t)
      setRedirectUris((p) => [...p, t])
      setNewUri('')
    } catch {
      // ignore
    }
  }

  function handleSubmit() {
    if (!validate()) return
    mutate(
      { appId: appId.trim(), clientName: clientName.trim(), redirectUris },
      { onSuccess: (data) => setResult(data) },
    )
  }

  function copySecret() {
    if (!result) return
    navigator.clipboard.writeText(result.clientSecret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open onOpenChange={(_, d) => !d.open && onClose()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>OAuth2-Client registrieren</DialogTitle>
          <DialogContent>
            {result ? (
              <div className={styles.form}>
                <MessageBar intent="success">
                  <MessageBarBody>
                    <MessageBarTitle>Client erfolgreich registriert</MessageBarTitle>
                  </MessageBarBody>
                </MessageBar>
                <Field label="Client-ID">
                  <Input value={result.clientId} readOnly />
                </Field>
                <Field label="Client-Secret">
                  <div className={styles.secretBox}>
                    <span style={{ flex: 1 }}>{result.clientSecret}</span>
                    <Button
                      icon={<CopyRegular />}
                      size="small"
                      appearance="transparent"
                      onClick={copySecret}
                    >
                      {copied ? 'Kopiert!' : 'Kopieren'}
                    </Button>
                  </div>
                </Field>
                <Text className={styles.warning}>
                  ⚠ Das Client-Secret wird nur einmalig angezeigt. Bitte jetzt sicher speichern.
                </Text>
              </div>
            ) : (
              <div className={styles.form}>
                <Field
                  label="App-ID *"
                  validationMessage={errors.appId}
                  validationState={errors.appId ? 'error' : 'none'}
                >
                  <Input value={appId} onChange={(_, d) => setAppId(d.value)} />
                </Field>
                <Field
                  label="Client-Name *"
                  validationMessage={errors.clientName}
                  validationState={errors.clientName ? 'error' : 'none'}
                >
                  <Input value={clientName} onChange={(_, d) => setClientName(d.value)} />
                </Field>
                <Field label="Redirect-URIs">
                  <div className={styles.tagRow}>
                    {redirectUris.length > 0 && (
                      <TagGroup
                        onDismiss={(_, d) =>
                          setRedirectUris((p) => p.filter((u) => u !== d.value))
                        }
                      >
                        {redirectUris.map((uri) => (
                          <Tag key={uri} value={uri} dismissible>
                            {uri}
                          </Tag>
                        ))}
                      </TagGroup>
                    )}
                    <Input
                      value={newUri}
                      onChange={(_, d) => setNewUri(d.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addUri()}
                      placeholder="https://… Enter"
                      size="small"
                    />
                    <Button icon={<AddRegular />} size="small" onClick={addUri} />
                  </div>
                </Field>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {result ? 'Schliessen' : 'Abbrechen'}
            </Button>
            {!result && (
              <Button
                appearance="primary"
                onClick={handleSubmit}
                disabled={isPending}
                icon={isPending ? <Spinner size="tiny" /> : undefined}
              >
                Registrieren
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
