import {
    BrowserRouter,
    Route,
    Routes,
    Navigate,
    Outlet,
} from 'react-router-dom';
import {
    Home,
    Login,
    NotFound,
    PrivacyPolicy,
    Register,
    Settings,
    TermsOfService,
} from './pages';
import { AllauthCallback, ProtectedRoute } from './components';
import { ThemeProvider, CssBaseline } from '@mui/material';
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

                        {/* callbacks server */}
                        <Route
                            path="/auth/google/callback"
                            element={<AllauthCallback provider="google" />}
                        />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </>
    );
}

export default App;
