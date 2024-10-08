import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { PieChart } from '@mui/x-charts/PieChart';

function MainDash() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [pieChart, setPieChart] = useState({
        pending: 0,
        shipped: 0,
        delivered: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get('/api/all-users');
                const ordersResponse = await axios.get('/api/all-orders');
                const productsResponse = await axios.get('/api/products');

                setTotalUsers(usersResponse.data.length); // Assuming it returns an array of users
                setTotalOrders(ordersResponse.data.length); // Assuming it returns an array of orders
                setTotalProducts(productsResponse.data.length); // Assuming it returns an array of products

                // Update pieChart state with counts of each status
                setPieChart({
                    pending: ordersResponse.data.filter(order => order.order_status === 'pending').length,
                    shipped: ordersResponse.data.filter(order => order.order_status === 'shipped').length,
                    delivered: ordersResponse.data.filter(order => order.order_status === 'delivered').length,
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Prepare data for the Pie Chart based on the pieChart state
    const pieChartData = [
        { id: 0, value: pieChart.pending, label: 'Pending' },
        { id: 1, value: pieChart.shipped, label: 'Shipped' },
        { id: 2, value: pieChart.delivered, label: 'Delivered' },
    ];

    return (
        <Box sx={{ p: 3 }}>
         

            <Grid container spacing={3}>
                {/* Total Users with Circular Progress */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center',}}>
                        <Typography variant="h6">Total Users</Typography>
                        <Box sx={{ position: 'relative', display: 'inline-flex', bgcolor: 'grey.300', borderRadius: '50%'}}>
                            <CircularProgress
                                variant="determinate"
                                value={(totalUsers / 100) * 100} // Adjust as necessary
                                size={100}
                                thickness={4}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="h5">{totalUsers}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Total Orders with Circular Progress */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Total Orders</Typography>
                        <Box sx={{ position: 'relative', display: 'inline-flex', bgcolor: 'grey.300', borderRadius: '50%'}}>
                            <CircularProgress
                                variant='determinate'
                                value={(totalOrders)} // Adjust as necessary
                                size={100}
                                thickness={6}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="h5">{totalOrders}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Total Products with Circular Progress */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Total Products</Typography>
                        <Box sx={{ position: 'relative', display: 'inline-flex', bgcolor: 'grey.300', borderRadius: '50%'}}>
                            <CircularProgress
                                variant="determinate"
                                value={(totalProducts / 100) * 100} // Adjust as necessary
                                size={100}
                                thickness={4}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="h5">{totalProducts}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

        </Box>
        
    );
}

export default MainDash;
