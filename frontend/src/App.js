// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductPage from './components/pages/Product'; // Adjust the import path if necessary
import Cart from './components/pages/Cart'; // Adjust the import path if necessary
import Dashboard from './components/Admin/Dashboard'
import Success from './components/pages/Success';
import Cancel from './components/pages/Cancel';
import NotFoundPage from './components/pages/NotFoundPage';
import CashPayment from './components/pages/CashPayment';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import Login from './components/pages/Login';
import { ToastContainer } from 'react-toastify';
import FavouritesPage from './components/UserDashboard/FavouritesPage';
import Order from './components/Admin/Order';
import OrderDetail from './components/Admin/OrderDetail';
import ProductDetail from './components/pages/ProductDetail';

function App() {
    return (
        <Router>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        My Shop
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Products
                    </Button>
                    <Button color="inherit" component={Link} to="/cart">
                        Cart
                    </Button>
                    <Button color="inherit" component={Link} to="/dashboard">
                        Dash
                    </Button>
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/cart" element={<Cart />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path='/' element={<ProductPage />}></Route>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path='/success' element={<Success />}></Route>
                <Route path='/cancel' element={<Cancel />}></Route>
                <Route path='/cash-payment/:sessionId' element={<CashPayment />}></Route>
                <Route path='/login' element={<Login/>}></Route>
                <Route path='/favourites' element={<FavouritesPage/>}></Route>
                <Route path='/orders' element={<Order />}></Route>
                <Route path='/orders/:id' element={<OrderDetail/>}></Route>
                <Route path='/product/:id' element={<ProductDetail />}></Route>


            </Routes>
        </Router>
    );
}

export default App;
