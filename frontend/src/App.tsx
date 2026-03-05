import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import {
    Home,
    Login,
    NotFound,
    PrivacyPolicy,
    Register,
    Settings,
    TermsOfService,
} from './pages';
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <NavBar />
                    <Routes>
                        {/* Public routes */}
                        <Route path="/home" element={<Home />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<RegisterAndLogout />} />
                        <Route path="*" element={<NotFound />} />

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
