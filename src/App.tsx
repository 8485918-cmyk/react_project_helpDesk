import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './App.css'
import Auth from './components/register-login/auth'
import PrivateRoute from './components/privateRoute'
import Dashboard from './components/dashboard'
import NewTicket from './components/tickets/newTicket'
import TicketsList from './components/tickets/ticketsList'
import NotFound from './components/notFound'
import { AuthProvider } from './context/authContext'
import NotAuthorized from './components/notAuthorized'
import Users from './components/user/users'
import NewUser from './components/user/newUser'
import Guard from './components/guard/guard'
import theme from './theme/theme'

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
        <Routes>

          <Route path="/" element={<Auth />} />
          <Route path="/login" element={<Auth />} />

          <Route path="/dashboard"
            element={
              <Guard>
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              </Guard>
            } >

            <Route index element={<TicketsList />} />

            <Route path='tickets' element={<TicketsList />} />

            <Route path='tickets/new'
              element={
                <PrivateRoute roles={["customer"]}>
                  <NewTicket />
                </PrivateRoute>
              } />

            <Route path='users' element={
              <PrivateRoute roles={["admin"]}>
                <Users />
              </PrivateRoute>
            } />

            <Route path='users/new' element={
              <PrivateRoute roles={["admin"]}>
                <NewUser />
              </PrivateRoute>
            } />

          </Route>


          <Route path="/notAuthorized" element={<NotAuthorized />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
