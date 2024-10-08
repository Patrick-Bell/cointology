// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductPage from './components/pages/Product';
import Cart from './components/pages/Cart';
import Dashboard from './components/Admin/Dashboard';
import UserOrders from './components/UserDashboard/UserOrders';
import ProtectedRoute from './components/Authenticate/ProtectedRoute';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useAuth } from './components/context/AuthenticateContext';
import  Login  from './components/pages/Login';
import NotFoundPage from './components/pages/NotFoundPage'
import OrderDetail from './components/Admin/OrderDetail'
import CashPayment from './components/pages/CashPayment'
import Success from './components/pages/Success'
import UserDetail from './components/Admin/UserDetail';
// AppBar components for different roles
const PublicAppBar = () => (
    <AppBar position="fixed">
        <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                My Shop
            </Typography>
            <Button color="inherit" component={Link} to="/">Products</Button>
            <Button color="inherit" component={Link} to="/cart">Cart</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
        </Toolbar>
    </AppBar>
);

const UserAppBar = () => (
    <AppBar position="fixed">
        <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                User Dashboard
            </Typography>
            <Button color="inherit" component={Link} to="/">Products</Button>
            <Button color="inherit" component={Link} to="/cart">Cart</Button>
            <Button color="inherit" component={Link} to="/my-orders">Dashboard</Button>
            <Button color="inherit" component={Link} to="/login">Logout</Button>
        </Toolbar>
    </AppBar>
);

const AdminAppBar = () => (
    <AppBar position="fixed">
        <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Admin Dashboard
            </Typography>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
        </Toolbar>
    </AppBar>
);

function App() {
    const { isUserAuthenticated, isAdminAuthenticated, user, checkAuthStatus } = useAuth();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Determine the user role based on the authentication state
    const userRole = user?.role;

    let AppBarComponent;
    if (isAdminAuthenticated) {
        AppBarComponent = <AdminAppBar />;
    } else if (isUserAuthenticated) {
        AppBarComponent = <UserAppBar />;
    } else {
        AppBarComponent = <PublicAppBar />;
    }

    return (
        <Router>
            {AppBarComponent}

            <Routes>
                <Route path='/login' element={<Login/>}></Route>
                <Route path="/" element={<ProductPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path='/cash-payment/:id' element={<CashPayment />}></Route>
                <Route path='/success' element={<Success/>}></Route>


                {/* User-Only Routes (Protected) */}
                <Route
                    path="/my-orders"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isUserAuthenticated}
                            requiredRole="user"
                            userRole={userRole}
                        >
                            <UserOrders />
                        </ProtectedRoute>
                    }
                />
                {/* Admin-Only Routes (Protected) */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAdminAuthenticated}
                            requiredRole="admin"
                            userRole={userRole}
                        >
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                    <Route
                    path="/orders/:id"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAdminAuthenticated}
                            requiredRole="admin"
                            userRole={userRole}
                        >
                            <OrderDetail />
                        </ProtectedRoute>
                    }
                />

                    <Route
                    path="/users/:id"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAdminAuthenticated}
                            requiredRole="admin"
                            userRole={userRole}
                        >
                            <UserDetail />
                        </ProtectedRoute>
                    }
                />

                <Route path="/not-authorized" element={<NotFoundPage />} />

                {/* Catch all invalid routes */}
                <Route path="*" element={<NotFoundPage />} />


            </Routes>
        </Router>
    );
}

export default App;
