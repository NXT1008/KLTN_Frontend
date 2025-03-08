import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'

import { Experimental_CssVarsProvider as CssVarProvider } from '@mui/material/styles'
import theme from './theme.js'
import { ConfirmProvider } from 'material-ui-confirm'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'

// Import TanStack React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Tạo một instance của QueryClient
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename='/'>
      <CssVarProvider theme={theme}>
        <ConfirmProvider defaultOptions={{
          buttonOrder: ['confirm', 'cancel'],
          allowClose: false,
          dialogProps: { maxWidth: 'xs' },
          cancellationButtonProps: { color: 'primary' },
          confirmationButtonProps: { color: 'success', variant: 'outlined' }
        }}>
          {/* Chỉnh sửa style chung cho tất cả thẻ a */}
          <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
          <CssBaseline />
          <App />
          <ToastContainer theme='colored' autoClose={3000}/>
        </ConfirmProvider>
      </CssVarProvider>
    </BrowserRouter>
  </QueryClientProvider>
)
