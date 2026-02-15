import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import type { Navigation } from 'react-router-dom';
import { Home, Login, NotFound, Register } from './pages';
import { AuthProvider, ProtectedRoute } from './components';

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
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/auth/google/callback"
                        element={<AuthProvider provider="google" />}
                    />
                    <Route path="/register" element={<RegisterAndLogout />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
