import { makeStyles } from '@fluentui/react-components'
import { AppCard } from './AppCard'
import type { AppDto } from '../api/types'

const useStyles = makeStyles({
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '16px 0',
  },
})

interface AppGridProps {
  apps: AppDto[]
}

export function AppGrid({ apps }: AppGridProps) {
  const styles = useStyles()

  return (
    <div className={styles.grid}>
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  )
}
