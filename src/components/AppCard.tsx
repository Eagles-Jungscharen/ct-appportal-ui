import {
  Card,
  CardHeader,
  CardPreview,
  Text,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { OpenRegular } from '@fluentui/react-icons'
import type { AppDto } from '../api/types'

const useStyles = makeStyles({
  card: {
    width: '280px',
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
  },
  preview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80px',
    backgroundColor: tokens.colorBrandBackground2,
  },
  icon: {
    width: '48px',
    height: '48px',
    objectFit: 'contain',
  },
  iconFallback: {
    fontSize: '32px',
  },
  description: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
})

interface AppCardProps {
  app: AppDto
}

export function AppCard({ app }: AppCardProps) {
  const styles = useStyles()

  return (
    <Card className={styles.card}>
      <CardPreview className={styles.preview}>
        {app.iconUrl ? (
          <img src={app.iconUrl} alt={app.name} className={styles.icon} />
        ) : (
          <span className={styles.iconFallback}>📦</span>
        )}
      </CardPreview>
      <CardHeader
        header={<Text weight="semibold">{app.name}</Text>}
        description={
          app.description ? (
            <Text className={styles.description}>{app.description}</Text>
          ) : undefined
        }
        action={
          <Button
            as="a"
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            icon={<OpenRegular />}
            appearance="transparent"
            aria-label={`${app.name} öffnen`}
          />
        }
      />
    </Card>
  )
}
