import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Home, Login, NotFound, Register, Settings } from './pages';
import { AllauthCallback, ProtectedRoute } from './components';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './styles/theme';

//logout
function Logout() {
    localStorage.clear();
    return <Navigate to="/login/" />;
}

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
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route
                            path="/auth/google/callback"
                            element={<AllauthCallback provider="google" />}
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<RegisterAndLogout />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </>
    );
}

export default App;
