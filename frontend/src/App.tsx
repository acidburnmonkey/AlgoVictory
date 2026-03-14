import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import {
    Home,
    Login,
    NotFound,
    PasswordReset,
    PrivacyPolicy,
    Register,
    Settings,
    TermsOfService,
} from './pages';
import Schedule from './components/Schedule';
import { Footer, NavBar, ProtectedRoute } from './components';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './styles/theme';

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
                        <Routes>
                            {/* Public routes */}
                            <Route path="/home" element={<Home />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms-of-service" element={<TermsOfService />} />
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
                        <Footer />
                    </Box>
                </BrowserRouter>
            </ThemeProvider>
        </>
    );
}

export default App;
