import { useEffect } from 'react';
import { useFavourite } from '../context/FavouriteContext';
import { useCart } from '../context/CartContext';
import { Card, CardMedia, CardContent, Typography, IconButton, Box, Button, Rating, Stack } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function FavouritesPage() {
    const { favourites, removeFromFavourites, fetchUserFavourites } = useFavourite();
    const { addItemToCart } = useCart();

    const userFavourites = favourites.favourites;

    useEffect(() => {
        fetchUserFavourites();
    }, [removeFromFavourites]);

    const handleRemoveFromFavourites = async (productId) => {
        try {
            removeFromFavourites(productId);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
                {Array.isArray(userFavourites) && userFavourites.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            position: 'fixed',
                            top: 0,
                            left: { xs: 0, md: 120 },
                            width: '100vw',
                            zIndex: 1000,
                        }}
                    >
                        <Box sx={{ p: 10, background: '', borderRadius: '10px' }}>
                            <FavoriteIcon fontSize="large" sx={{ fontSize: '100px', color: 'lightgrey', justifyContent:'center', alignItems:'center', display:'flex', margin:'auto auto' }} />
                            <Typography color="textSecondary">You have no favourite items.</Typography>
                            <Button
                            fullWidth
                            sx={{
                                margin: '5px 0 0 0',
                                color: 'black',
                                borderColor: 'black', // Border color for outlined state
                                '&:hover': {
                                    backgroundColor: 'black', // Background color for contained state on hover
                                    color: 'white', // Text color for contained state on hover
                                    borderColor: 'black', // Keep border color same on hover
                                },
                            }}
                            variant="outlined" // Initial variant
                        >
                            Start Shopping!
                        </Button>
                        </Box>
                    </Box>
                ) : (
                    Array.isArray(userFavourites) && userFavourites.map((product) => (
                        <Card
                            key={product._id}
                            sx={{
                                width: 350,
                                boxShadow: 5,
                                borderRadius: 4,
                                overflow: 'hidden',
                                position: 'relative',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="250"
                                image={product.line_items[0]?.item_image || 'fallback-image-url.jpg'}
                                alt={product.line_items[0]?.item_name || 'Product'}
                            />
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    {product.line_items[0]?.item_name || 'Unknown Product'}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    ${product.line_items[0]?.item_price}
                                </Typography>

                                <Box sx={{ display: 'block', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button 
                                    sx={{
                                        backgroundColor: 'red',
                                        '&:hover': {
                                            backgroundColor: 'darkred',
                                        },
                                    }}
                                    variant='contained' color='primary' onClick={() => handleRemoveFromFavourites(product._id)}
                                    fullWidth
                                    startIcon={<FavoriteIcon />}
                                    >
                                    REMOVE FROM FAVOURITES
                                    </Button>
                                    <Button
                                    fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            addItemToCart({
                                                id: product.line_items[0]?.item_id,
                                                name: product.line_items[0]?.item_name,
                                                price: product.line_items[0]?.item_price,
                                                quantity: 1,
                                                front_image: product.line_items[0]?.item_image,
                                                item_total: product.line_items[0]?.item_price * 1,
                                            })
                                        }
                                        startIcon={<ShoppingCartIcon />}
                                        sx={{
                                            backgroundColor: '#3f51b5',
                                            '&:hover': {
                                                backgroundColor: '#32408f',
                                            },
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Box>
    );
}

export default FavouritesPage;
