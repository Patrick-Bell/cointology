import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, InputAdornment } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check'; // Import Check icon
import axios from 'axios';

function TrackPackage() {
    const [orderId, setOrderId] = useState('');
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrackPackage = async () => {
        
        setLoading(true);
        setError(null);

        try {
            // Fetch tracking info from the API
            const response = await axios.get(`/api/track-order/${orderId}`);

            // Assuming the first object in the array holds the order data
            if (response.data && response.data.length > 0 && response.data[0].order_status) {
                setTrackingInfo(response.data[0]);  // Access the first order object in the array
                console.log(response.data);
            } else {
                throw new Error('Invalid response from server');  // Handle invalid responses
            }
        } catch (err) {
            console.error("Error tracking order:", err);
            setError('Order not found. Please check the order ID and try again.');
            setTimeout(() => {
                setError('')
            }, 3000);
            setTrackingInfo(null);
        } finally {
            setLoading(false);
        }
    };

    // Placeholder for order status details
    const statusText = {
        pending: {
            icon: '🕒', 
            message: 'Your order is currently pending and awaiting processing. If you need to make any changes, such as updating your shipping address or modifying your order, now is the perfect time to get in touch with our customer support team. Once your order is processed and prepared for shipment, it will move to the next stage: "Shipped." We’ll keep you updated every step of the way. Thank you for your patience!'
        },
        shipped: {
            icon: '✈️', 
            message: 'Great news! Your order has been shipped and is currently on its way to you. You can no longer make changes to your order at this stage, but rest assured it’s moving through our delivery network. If you have any questions or concerns, feel free to contact our support team. We’ll notify you once the delivery is completed. Thank you for choosing us!'
        },
        attempted_delivery: {
            icon: '🚪', 
            message: 'Delivery was attempted but not successful. We tried to deliver your package today. We will attempt to deliver it again tomorrow. If unsuccessful after that, we may ask you for additional information, such as leaving it with a neighbor. If we are unable to deliver after three attempts, your package will be returned to our warehouse, awaiting further instructions to ensure the safety of your package.'
        },
        delivered: {
            icon: '📦', 
            message: 'Your order has been delivered! We hope you enjoy your purchase. You ordered {amount} items. Please take a moment to leave us a review by clicking here!'
        },
        cancelled: {
            icon: '❌', 
            message: 'Your order was cancelled. If this doesn’t sound right, please get in touch with us. Is it a refund you need? Or is there something else we can assist you with?'
        },
    };

    return (
        <Box sx={{width:'100%'}}>
            {/* Input Box for Order ID */}
            {!trackingInfo ? (
                <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Track My Package
                    </Typography>
                    <TextField
                        fullWidth
                        label="Enter Order ID"
                        variant="outlined"
                        value={orderId}
                        onChange={(e) => {
                            if (e.target.value.length <= 36) {
                                setOrderId(e.target.value);
                            }
                        }}
                        sx={{ marginBottom: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {orderId.length === 36 ? (
                                        <CheckIcon color="success" />
                                    ) : (
                                        <Typography>{`${orderId.length}/36`}</Typography>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleTrackPackage}
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Track'}
                    </Button>
                    {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
                </Paper>
            ) : (
                <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Tracking Information
                    </Typography>
                    <Typography variant="body1">
                        <strong>Order ID:</strong> {orderId}
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="h3">{statusText[trackingInfo.order_status]?.icon || '❓'}</Typography>
                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                            {statusText[trackingInfo.order_status]?.message || 'Status not available for this order.'}
                        </Typography>
                    </Box>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        sx={{ marginTop: 4 }}
                        onClick={() => {
                            setTrackingInfo(null); // Reset tracking info
                            setOrderId(''); // Reset order ID input
                        }}
                        fullWidth
                    >
                        Track Another Package
                    </Button>
                </Paper>
            )}
        </Box>
    );
}

export default TrackPackage;
