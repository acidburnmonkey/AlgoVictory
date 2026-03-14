import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import { Home, Login, Register, NotFound } from './pages';
import { Footer, NavBar, ProtectedRoute } from './components';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import theme from './styles/theme';

const PasswordReset = lazy(() => import('./pages/PasswordReset'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Settings = lazy(() => import('./pages/Settings'));

//register
function RegisterAndLogout() {
    localStorage.clear();
    return <Register />;
}

//main
function App() {
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100vh',
                        }}
                    >
                        <NavBar />
                        <Suspense
                            fallback={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flex: 1,
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            }
                        >
                            <Routes>
                                {/* Public routes */}
                                <Route path="/home" element={<Home />} />
                                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                <Route
                                    path="/terms-of-service"
                                    element={<TermsOfService />}
                                />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<RegisterAndLogout />} />
                                <Route path="*" element={<NotFound />} />
                                <Route
                                    path="/reset-password"
                                    element={<PasswordReset method="sendMail" />}
                                />
                                <Route
                                    path="/reset-password/:token"
                                    element={<PasswordReset method="setNewPassword" />}
                                />

                                {/* logged in routes */}
                                <Route
                                    element={
                                        <ProtectedRoute>
                                            <Outlet />
                                        </ProtectedRoute>
                                    }
                                >
                                    <Route path="/settings" element={<Settings />} />
                                </Route>
                            </Routes>
                        </Suspense>
                        <Footer />
                    </Box>
                </BrowserRouter>
            </ThemeProvider>
        </>
    );
}

export default App;
