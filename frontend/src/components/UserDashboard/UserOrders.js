import axios from "axios";
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PaidIcon from '@mui/icons-material/Paid';
import MessageIcon from '@mui/icons-material/Message';
import UserSideBar from "./UserSideBar";

function UserOrders() {
    const [orders, setOrders] = useState([]); // State to store user orders
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error
    const [images, setImages] = useState({}); // State to store fetched images

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await axios.get('/api/user-orders', { withCredentials: true });
                console.log('orders', response.data);
                setOrders(response.data);
                await fetchImages(response.data); // Fetch images after setting orders
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('Failed to fetch orders.');
            } finally {
                setLoading(false); // Set loading to false once the fetch is complete
            }
        };

        const fetchImages = async (orders) => {
            const lineItemNames = orders.flatMap(order => order.line_items.map(item => item.name));
            const uniqueNames = [...new Set(lineItemNames)]; // Remove duplicates
            
            const imagePromises = uniqueNames.map(async (name) => {
                const imageUrl = await findImage(name);
                return { name, imageUrl };
            });

            const resolvedImages = await Promise.all(imagePromises);
            const imageMap = resolvedImages.reduce((acc, { name, imageUrl }) => {
                acc[name] = imageUrl || null; // Map names to images
                return acc;
            }, {});

            setImages(imageMap);
        };

        fetchUserOrders();
    }, []); // Empty dependency array means this runs once on mount

    const findImage = async (name) => {
        try {
            const response = await axios.get(`/api/get-image/${name}`);
            return response.data; // Return the image URL
        } catch (e) {
            console.log(`Error fetching image for ${name}:`, e);
            return null; // Return null if there's an error
        }
    };

    if (loading) {
        return <Typography variant="h6">Loading orders...</Typography>; // Show loading message
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>; // Show error message
    }

    return (
        <>
        <UserSideBar/>

        <Box sx={{ padding: 3, marginLeft: { md: 30 } }}>
        <Typography variant="h4" gutterBottom>User Orders</Typography>
            {orders.map(order => (
                <Accordion key={order._id} sx={{ marginBottom: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${order._id}-content`}
                        id={`panel-${order._id}-header`}
                        sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Typography variant="h6">
                            Order Date: {new Date(order.order_date).toLocaleDateString('en-GB')} - Total: £{order.total_price.toFixed(2)}
                        </Typography>
                        <Chip label={order.order_status} />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1">
                                        <PersonIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} /> User Details
                                    </Typography>
                                    <Typography><PersonIcon /> Name: {order.name}</Typography>
                                    <Typography><EmailIcon /> Email: {order.email}</Typography>
                                    <Typography><PhoneIcon /> Phone: {order.phone}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1">
                                        <LocalShippingIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} /> Shipping Information
                                    </Typography>
                                    <Typography><LocalShippingIcon /> Method: {order.shipping_method}</Typography>
                                    <Typography><HomeIcon /> Address: {order.shipping_address.address_line_1}, {order.shipping_address.city}, {order.shipping_address.postal_code}, {order.shipping_address.country}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        <ReceiptIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} /> Order Summary
                                    </Typography>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Image</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Quantity</TableCell>
                                                    <TableCell>Price</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {order.line_items.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            <img
                                                                src={images[item.name]} // Use fetched image
                                                                alt={item.name}
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '5px'
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>{item.quantity}</TableCell>
                                                        <TableCell>£{(item.unit_price * item.quantity).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        <CreditCardIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} /> Additional Information
                                    </Typography>
                                    <Typography><ReceiptIcon /> Invoice: {order.invoice}</Typography>
                                    <Typography><LocalShippingIcon /> Shipping Cost: £{order.shipping.toFixed(2)}</Typography>
                                    <Typography><LocalOfferIcon /> Discount: £{order.discount.toFixed(2)}</Typography>
                                    <Typography><CreditCardIcon /> Order Type: {order.order_type}</Typography>
                                    <Typography><PaidIcon /> Payment Status: {order.paid}</Typography>
                                    <Typography><MessageIcon /> Order Message: {order.order_message || 'N/A'}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
        </>

    );
}

export default UserOrders;
