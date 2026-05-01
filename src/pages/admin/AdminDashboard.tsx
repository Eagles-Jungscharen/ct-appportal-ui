import { useState } from 'react'
import {
  Tab,
  TabList,
  makeStyles,
  tokens,
  Text,
  Button,
} from '@fluentui/react-components'
import { AppsRegular, KeyRegular } from '@fluentui/react-icons'
import { AppList } from './AppList'
import { ClientRegistrationForm } from './ClientRegistrationForm'

const useStyles = makeStyles({
  root: {
    padding: '24px',
  },
  header: {
    marginBottom: '8px',
  },
  title: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
  },
  subtitle: {
    color: tokens.colorNeutralForeground2,
    marginBottom: '24px',
    display: 'block',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px',
  },
})

export function AdminDashboard() {
  const styles = useStyles()
  const [tab, setTab] = useState<string>('apps')
  const [clientFormOpen, setClientFormOpen] = useState(false)

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text as="h1" className={styles.title}>
          Admin
        </Text>
        <Text className={styles.subtitle}>
          Applikationen registrieren und OAuth2-Clients beim Churchtool IDP verwalten.
        </Text>
      </div>

      <div className={styles.actions}>
        {tab === 'clients' && (
          <Button
            appearance="primary"
            icon={<KeyRegular />}
            onClick={() => setClientFormOpen(true)}
          >
            Client registrieren
          </Button>
        )}
      </div>

      <TabList
        selectedValue={tab}
        onTabSelect={(_, d) => setTab(d.value as string)}
      >
        <Tab value="apps" icon={<AppsRegular />}>
          Applikationen
        </Tab>
        <Tab value="clients" icon={<KeyRegular />}>
          OAuth2-Clients
        </Tab>
      </TabList>

      {tab === 'apps' && <AppList />}
      {tab === 'clients' && (
        <div style={{ padding: '24px 0' }}>
          <Text>
            Registriere einen neuen OAuth2-Client beim Churchtool IDP für eine bestehende
            Applikation.
          </Text>
        </div>
      )}

      {clientFormOpen && (
        <ClientRegistrationForm onClose={() => setClientFormOpen(false)} />
      )}
    </div>
  )
}
