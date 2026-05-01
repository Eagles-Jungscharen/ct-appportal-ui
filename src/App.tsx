import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { router } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
})

export function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </FluentProvider>
  )
}

