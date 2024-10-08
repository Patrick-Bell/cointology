import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Box,
    TextField,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import '../styles/Dashboard.css';

function Inventory({ products, handleEdit, handleDelete }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortPriceOrder, setSortPriceOrder] = useState('asc');
    const [sortStockOrder, setSortStockOrder] = useState('asc');
    const [sortedProducts, setSortedProducts] = useState(products); // New state for sorted products

    // Function to determine the color based on stock number
    const getStockColor = (stock) => {
        if (stock === 0) {
            return { color: 'red' }; // Out of stock
        } else if (stock > 0 && stock <= 10) {
            return { color: 'orange' }; // Low stock
        } else if (stock > 10 && stock < 20) {
            return { color: 'green' }; // Medium stock
        } else {
            return { color: 'green' }; // In stock
        }
    };

    // Filter products based on the search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting function for Price
    const handleSortByPrice = () => {
        const newSortOrder = sortPriceOrder === 'asc' ? 'desc' : 'asc'; // Toggle order
        const sorted = [...filteredProducts].sort((a, b) => {
            return newSortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        });
        setSortedProducts(sorted); // Update sorted products state
        setSortPriceOrder(newSortOrder); // Update sort order state
    };

    // Sorting function for Stock
    const handleSortByStock = () => {
        const newSortOrder = sortStockOrder === 'asc' ? 'desc' : 'asc'; // Toggle order
        const sorted = [...filteredProducts].sort((a, b) => {
            return newSortOrder === 'asc' ? a.stock - b.stock : b.stock - a.stock;
        });
        setSortedProducts(sorted); // Update sorted products state
        setSortStockOrder(newSortOrder); // Update sort order state
    };

    // Use sortedProducts for rendering
    return (
        <Box className="inventory-container">
            <TableContainer component={Paper}>
                <Typography variant="h5" sx={{ p: 2 }}>
                    Inventory
                </Typography>

                <Box className="search-bar">
                    <TextField
                        variant="outlined"
                        label="Search Products"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: '98%', m: 1 }} // Full width minus 2px and margin 1 unit
                    />
                </Box>

                <Typography sx={{margin: '0 10px'}}>Number of products: <strong>{filteredProducts.length}</strong></Typography>

                <Table className="table" aria-label="inventory table">
                    <TableHead>
                        <TableRow>
                            <TableCell className='table-id'>ID</TableCell>
                            <TableCell>Picture</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>Stock 
                                <IconButton onClick={handleSortByStock} sx={{ m: '0 5px' }}>
                                    <SwapVertIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell sx={{textAlign: 'center'}}>Price
                                <IconButton onClick={handleSortByPrice} sx={{ m: '0 5px' }}>
                                    <SwapVertIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(searchTerm ? filteredProducts : sortedProducts).map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className='table-id'>...{product.id.slice(-6)}</TableCell>
                                <TableCell>
                                    <img 
                                        src={product.front_image} 
                                        alt={product.name} 
                                        className="product-image" 
                                    />
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}} className="text-center" style={getStockColor(product.stock)}>
                                    {product.stock}
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{`£${product.price.toFixed(2)}`}</TableCell>
                                <TableCell align="center">
                                    <IconButton 
                                        color="primary" 
                                        onClick={() => handleEdit(product.id)}
                                        aria-label="edit"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        color="secondary" 
                                        onClick={() => handleDelete(product.id)}
                                        aria-label="delete"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Inventory;
