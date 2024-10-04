import { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Paper,
    Tabs,
    Tab,
    AppBar,
    Card,
    CardMedia,
    Chip,
    CircularProgress,
    IconButton,
    Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'
import {ToastContainer, toast} from 'react-toastify'

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [isFavorite, setIsFavorite] = useState(false); // To manage favorites
    const [mainImage, setMainImage] = useState(""); // To manage the main image

    const { addItemToCart } = useCart()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/product-details/${id}`);
                setProduct(response.data);
                setMainImage(response.data.front_image); // Set initial main image to front image
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleThumbnailClick = (image) => {
        setMainImage(image); // Set the main image based on thumbnail clicked
    };

    const handleAddToCart = async () => {
        try{
            addItemToCart({
                id: product._id,
                name: product.name,
                price: product.salePrice || product.price,
                quantity: 1,
                front_image: product.front_image,
                item_total: (product.salePrice || product.price) * 1,
            })

            toast.success('Product Added to Cart!')

        }catch(e) {
            console.log(e)
        }
        
    }

    const checkProductStock = (stock) => {
        if (stock > 5) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'green' }}>
                    <CheckCircleIcon sx={{ marginRight: 1 }} />
                    <Typography variant="body2">In Stock</Typography>
                </Box>
            );
        } else if (stock > 0 && stock <= 5) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'orange' }}>
                    <WarningAmberIcon sx={{ marginRight: 1 }} />
                    <Typography variant="body2">Few quantities left</Typography>
                </Box>
            );
        } else {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'red' }}>
                    <CancelIcon sx={{ marginRight: 1 }} />
                    <Typography variant="body2">Out of Stock</Typography>
                </Box>
            );
        }
    };

    const displayPrice = (product) => {
        if (product.other_price > 0) {
            return (
                <Typography variant="h6" color="text.secondary">
                    <span style={{ textDecoration: 'line-through', marginRight: '10px', color: 'red' }}>
                        £{product.other_price.toFixed(2)}
                    </span>
                    <span>£{product.price.toFixed(2)}</span>
                </Typography>
            );
        } else {
            return (
                <Typography variant="h6" color="text.secondary">
                    £{product.price.toFixed(2)}
                </Typography>
            );
        }
    };
    



    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ padding: 4 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (!product) return null;

    return (
        <Box sx={{ padding: 4, marginTop: '60px', bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Grid container spacing={4} alignItems="flex-start">
                {/* Product Image Section */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ position: 'relative' }}>
                        <CardMedia
                            component="img"
                            alt={product.name}
                            height="350" // Adjusted height for smaller image
                            image={mainImage} // Main image is set here
                            sx={{ objectFit: 'contain' }} // Fill the card while maintaining aspect ratio
                        />
                    </Card>

                    <ToastContainer />

                    {/* Thumbnails for front and back images */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
    <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6}>
            <IconButton 
                onClick={() => handleThumbnailClick(product.front_image)} 
                sx={{ width: '100%', padding: 0 }} // Ensure full width
            >
                <CardMedia
                    component="img"
                    alt="Front Image"
                    height="100"
                    image={product.front_image}
                    sx={{ 
                        objectFit: 'contain', 
                        border: mainImage === product.front_image ? '2px solid blue' : '1px solid lightgrey',
                        width: '100%', // Stretch image to full width
                        background: 'white'
            
                    }}
                />
            </IconButton>
        </Grid>
        <Grid item xs={6}>
            <IconButton 
                onClick={() => handleThumbnailClick(product.back_image)} 
                sx={{ width: '100%', padding: 0 }} // Ensure full width
            >
                <CardMedia
                    component="img"
                    alt="Back Image"
                    height="100"
                    image={product.back_image}
                    sx={{ 
                        objectFit: 'contain', 
                        border: mainImage === product.back_image ? '2px solid blue' : '1px solid lightgrey',
                        width: '100%', // Stretch image to full width
                        background: 'white'
                    }}
                />
            </IconButton>
        </Grid>
    </Grid>
</Box>

                </Grid>

                {/* Product Details Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 3, height: '100%', borderRadius: 2 }}>
                        <Typography variant="h4" gutterBottom>
                            {product.name}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {displayPrice(product)}
                        </Typography>
                        
                        {/* Product Description moved under price */}
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {product.description}
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                            Date Added: {new Date(product.date_added).toLocaleDateString()}
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
Description: Crafted from 99.9% pure silver, this exquisite coin not only serves as a collectible piece but also as an investment in precious metals. The obverse showcases 
the iconic Liberty Bell, symbolizing freedom and independence, while the reverse features a beautifully rendered depiction of eagles soaring high, representing strength and 
resilience.Released in limited quantities, this silver coin is part of a prestigious series that commemorates significant milestones in our nation’s history. With a 
diameter of 40 mm and a weight of 1 ounce, this coin is perfect for both avid collectors and those looking to celebrate special occasions.
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                           Category:
                           <Chip label={product.category} sx={{margin: '0 5px'}}></Chip>
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                         {checkProductStock(product.stock)}
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                            <Button variant="contained" color="primary" sx={{ mr: 2 }}
                            onClick={handleAddToCart}
                            >
                            
                        Add to Cart
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabs for Reviews */}
            <AppBar position="static" sx={{ marginTop: 4 }}>
                <Tabs>
                    <Tab label="Reviews" sx={{ color: 'white' }} />
                </Tabs>
            </AppBar>

            <Box sx={{ padding: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6">Customer Reviews</Typography>
                <Typography variant="body2">No reviews yet.</Typography>
            </Box>
        </Box>
    );
};

export default ProductDetail;
