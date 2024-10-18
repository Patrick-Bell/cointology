// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, matchPath } from 'react-router-dom';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import ProductPage from '../pages/Product';
import Cart from '../pages/Cart';
import Dashboard from '../Admin/Dashboard';
import UserOrders from '../UserDashboard/UserOrders'
import ProtectedRoute from './ProtectedRoute';
import { AppBar, Toolbar, Button, Typography, Grid, Badge, Box } from '@mui/material';
import { useAuth } from '../context/AuthenticateContext';
import  Login  from '../pages/Login';
import NotFoundPage from '../pages/NotFoundPage'
import OrderDetail from '../Admin/OrderDetail'
import CashPayment from '../pages/CashPayment'
import Success from '../pages/Success'
import Cancel from '../pages/Cancel'
import UserDetail from '../Admin/UserDetail';
import ProductDetail from '../pages/ProductDetail'
import ReportDeail from '../Admin/ReportDetail';
import ProductReview from '../UserDashboard/ProductReview';
import HomePage from '../pages/HomePage';
import PublicNavbar from '../Navbars/PublicNavbar';
import UserNavbar from '../Navbars/UserNavbar';
import TrackPackage from '../UserDashboard/TrackPackage';
import UserDashboard from '../UserDashboard/UserDashboard';
import AdminNavbar from '../Navbars/AdminNavbar';
import Register from '../pages/Register';
import ResetPassword from '../pages/ResetPassword';
import ConfirmPassword from '../pages/ConfirmPassword';
import Shipping from '../pages/Shipping';
import Faq from '../pages/Faq';




function AppContent() {
    const { isUserAuthenticated, isAdminAuthenticated, user, checkAuthStatus } = useAuth();

    const location = useLocation(); // Hook to get the current path


    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Determine the user role based on the authentication state
    const userRole = user?.role;

    let AppBarComponent;
    if (isAdminAuthenticated) {
        AppBarComponent = <AdminNavbar />;
    } else if (isUserAuthenticated) {
        AppBarComponent = <UserNavbar />;
    } else {
        AppBarComponent = <PublicNavbar />;
    }



    const noNavbarRoutes = ['/confirm-password/:token']; // Add your new route here

    const shouldShowNavbar = !noNavbarRoutes.some(route => matchPath(route, location.pathname));


    // Conditionally render AppBarComponent based on current path

    return (
        <>
            {shouldShowNavbar && AppBarComponent}

            <Routes>
                <Route path='/login' element={<Login/>}></Route>
                <Route path="/" element={<ProductPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path='/cash-payment/:id' element={<CashPayment />}></Route>
                <Route path='/success' element={<Success/>}></Route>
                <Route path='/product/:id' element={<ProductDetail />}></Route>
                <Route path='/home' element={<HomePage/>}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/cancel' element={<Cancel />}></Route>
                <Route path='/reset-password/' element={<ResetPassword />}></Route>
                <Route path='/confirm-password/:token' element={<ConfirmPassword />}></Route>
                <Route path='/shipping' element={<Shipping />}></Route>
                <Route path='/faq' element={<Faq />}></Route>


                 {/* User-Only Routes (Protected) */}
                 <Route
                    path="/my-dashboard"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isUserAuthenticated}
                            requiredRole="user"
                            userRole={userRole}
                        >
                            <UserDashboard />
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

                    <Route
                    path="/reports/:id"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAdminAuthenticated}
                            requiredRole="admin"
                            userRole={userRole}
                        >
                            <ReportDeail />
                        </ProtectedRoute>
                    }
                />

                <Route path="/not-authorized" element={<NotFoundPage />} />

                {/* Catch all invalid routes */}
                <Route path="*" element={<NotFoundPage />} />


            </Routes>
            </>
    );
}

export default AppContent;
