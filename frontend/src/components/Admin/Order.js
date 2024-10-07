import { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    IconButton,
    Typography,
    Paper,
    Chip,
} from '@mui/material';
import { Visibility, Edit, LocalShipping } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ShippingModal from './ShippingModal'; // Import the modal
import PaymentModal from './PaymentModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Order() {
    const [orders, setOrders] = useState([]);
    const [openModal, setOpenModal] = useState(false); // Modal open state
    const [openPayModal, setOpenPayModal] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null); // Track which order is being edited

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/all-orders');
                setOrders(response.data);
                console.log(response.data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchOrders();
    }, [orders]);

    const getStatusColor = (status) => {
        const statusColors = {
            pending: '#A9A9A9',            // Dark Gray
            shipped: '#4DD0E1',            // Light Cyan
            delivery_attempted: '#FFB74D', // Light Orange
            delivered: '#66BB6A',          // Light Green
            cancelled: '#EF5350',          // Lighter Red
        };

        return statusColors[status] || '#000000'; // Default to black if status is unknown
    };

    const handleViewDetails = (orderId) => {
        navigate(`/orders/${orderId}`); // Navigate to order details page
    };

    const handleEditPaidStatus = (orderId) => {
        console.log('Edit paid status for order:', orderId);
        // Logic to edit paid status
    };

    const handleEditOrderStatus = (orderId) => {
        setSelectedOrderId(orderId); // Set selected order ID
        setOpenModal(true); // Open modal
    };

    const handleEditPayStatus = (orderId) => {
        setSelectedOrderId(orderId)
        setOpenPayModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false); // Close modal
        setSelectedOrderId(null); // Clear selected order ID
    };

    const handleClosePayModal = () => {
        setOpenPayModal(false)
        setSelectedOrderId(null)
    }

    return (
        <>

        <ToastContainer/>

       
        <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>
                Order Details
            </Typography>

            <TableContainer component={Paper} sx={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">
                                <TableSortLabel>Order Date</TableSortLabel>
                            </TableCell>
                            <TableCell align="center">Order Type</TableCell>
                            <TableCell align="center">Order Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(orders) && orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell align="center">...{order.order_id.slice(-6)}</TableCell>
                                <TableCell align="center">{new Date(order.order_date).toLocaleString()}</TableCell>
                                <TableCell align="center">
                                    <Chip label={order.order_type} />
                                </TableCell>
                                <TableCell align="center">
                                    <Chip label={order.order_status} sx={{ backgroundColor: getStatusColor(order.order_status), color: 'white' }} />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => handleViewDetails(order.order_id)}>
                                        <Visibility />
                                    </IconButton>
                                    <IconButton onClick={() => handleEditPayStatus(order.order_id)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleEditOrderStatus(order.order_id)}>
                                        <LocalShipping />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Shipping Modal */}
            {selectedOrderId && (
                <ShippingModal
                    orderId={selectedOrderId}
                    open={openModal}
                    onClose={handleCloseModal} // Pass modal close handler
                />
            )}

            {selectedOrderId && (
                <PaymentModal
                orderId={selectedOrderId}
                open={openPayModal}
                onClose={handleClosePayModal}
                
                />
            )}
        </Box>
        </>
    );
}

export default Order;
