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
import '../styles/Dashboard.css'

function Inventory({ products, handleEdit, handleDelete }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Function to determine the color based on stock number
    const getStockColor = (stock) => {
        if (stock === 0) {
            return 'out-of-stock'; // Class name for out of stock
        } else if (stock > 0 && stock <= 10) {
            return 'low-stock'; // Class name for low stock
        } else if (stock > 10 && stock < 20) {
            return 'medium-stock'; // Class name for medium stock
        } else {
            return 'in-stock'; // Class name for in stock
        }
    };

    // Filter products based on the search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box className="inventory-container">
            <Box className="search-bar">
                <TextField
                    variant="outlined"
                    label="Search Products"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </Box>
            <TableContainer 
                component={Paper} 
                className="table-container" // Use CSS class for container
            >
                <Table className="table" aria-label="inventory table">
                    <TableHead>
                        <TableRow>
                            <TableCell className='table-id'>ID</TableCell>  {/* Show ID column on all devices */}
                            <TableCell>Picture</TableCell>
                            <TableCell className="text-center">Stock</TableCell>
                            <TableCell className="text-center">Price</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className='table-id'>{product.id}</TableCell>
                                <TableCell>
                                    <img 
                                        src={product.front_image} 
                                        alt={product.name} 
                                        className="product-image" 
                                    />
                                </TableCell>
                                <TableCell className={`text-center ${getStockColor(product.stock)}`}>
                                    {product.stock}
                                </TableCell>
                                <TableCell className="text-center">{`£${product.price}`}</TableCell>
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
