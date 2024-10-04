import { useEffect } from 'react';
import { useFavourite } from '../context/FavouriteContext';
import { useCart } from '../context/CartContext';
import { Card, CardMedia, CardContent, Typography, IconButton, Box, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function FavouritesPage() {
    const { favourites, removeFromFavourites, fetchUserFavourites } = useFavourite(); // Assuming user data is provided here
    const { addItemToCart } = useCart();

    const userFavourites = favourites.favourites


    useEffect(() => {
        fetchUserFavourites();
    }, []);

    const handleRemoveFromFavouries = async (productId) => {
        try {
            removeFromFavourites(productId)
            window.location.reload()
        }catch(e) {
            console.log(e)
        }
    }

    



    return (
        <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                My Favourites
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                {favourites.length === 0 ? (
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>
                        You have no favourite items.
                    </Typography>
                ) : (
                    Array.isArray(userFavourites) && userFavourites.map((product) => (
                        <Card
                            key={product._id}
                            sx={{
                                maxWidth: 300,
                                boxShadow: 3,
                                borderRadius: 3,
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.line_items[0]?.item_image || 'fallback-image-url.jpg'}
                                alt={product.line_items[0]?.item_name || 'Product'}
                            />
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    {product.line_items[0]?.item_name || 'Unknown Product'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ${product.line_items[0]?.item_price}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                                    <IconButton
                                        onClick={() => handleRemoveFromFavouries(product._id)}
                                        color="error"
                                    >
                                        <FavoriteIcon />
                                    </IconButton>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            addItemToCart({
                                                id: product.line_items[0]?.item_id,
                                                name: product.line_items[0]?.item_name,
                                                price: product.line_items[0]?.item_price,
                                                quantity: 1,
                                                front_image: product.line_items[0]?.item_image,
                                                item_total: (product.line_items[0]?.item_price) * 1,
                                            })
                                        }
                                        startIcon={<ShoppingCartIcon />}
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
