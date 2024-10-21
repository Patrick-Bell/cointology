import React, { useEffect, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Modal,
  Button,
  Divider,
  Tooltip,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '../context/AuthenticateContext';
import InfoIcon from '@mui/icons-material/Info';
import ScrollInView from '../animation/ScrollInView';
import Footer from '../Home/Footer';

function Product() {
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([])
  const [sortOption, setSortOption] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favourites, setFavourites] = useState([]);


  const { isUserAuthenticated, checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus()
  }, [])

  console.log('authentication', isUserAuthenticated)

  // Fetch Favourites - only if user is authenticated
  const fetchFavs = async () => {
    try {
      const response = await axios.get('/api/favourites', { withCredentials: true });
      setFavourites(response.data || []);  // Make sure to handle empty or undefined data
    } catch (error) {
      console.error('Failed to load favourites:', error);
      setError('Failed to load favourites');
    }
  };


  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setAllProducts(response.data || []); // Fallback to empty array if undefined
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
      setError('Failed to load products');
    }
  };

  // Fetch Data on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchProducts();

        // Fetch favourites only if user is authenticated
        if (isUserAuthenticated) {
           fetchFavs();
        }
      } catch (e) {
        console.error('Fetch error:', e);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isUserAuthenticated]);


  // Loading and Error handling in render
  if (loading) {
    return <Typography variant="h6">Loading products...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }


  const colors = ['bronze', 'silver', 'gold']
  const ratings = [1, 2, 3, 4, 5]
  const categories = [...new Set(allProducts.map((p) => p.category))];
  const tags = [...new Set(allProducts.flatMap((p) => p.tags))];


  const handleColorChange = (e) => {
    const color = e.target.value
    setSelectedColors((prev) => prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color ])
  }

  // Handle filtering and sorting
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleRatingChange = (e) => {
    const rating = Number(e.target.value); // Convert to number
    console.log(rating);
    setSelectedRatings((prev) =>
        prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
};

  const handleTagChange = (e) => {
    const tag = e.target.value;
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };


  // Function to calculate the average rating of a product
const calculateAverageRating = (ratings) => {
  if (!Array.isArray(ratings) || ratings.length === 0) return 0; // Handle empty ratings

  const totalRating = ratings.reduce((acc, item) => acc + item.rating_number, 0);
  return totalRating / ratings.length;
};


  // Filter products based on selected filters
  const filteredProducts = allProducts.filter((product) => {
    const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
    
    const tagMatch =
        selectedTags.length === 0 || selectedTags.some((tag) => product.tags.includes(tag));

    // Check if the product's average rating is equal to or greater than any of the selected ratings
    const ratingMatch = selectedRatings.length === 0 || selectedRatings.some(selectedRating => {
        const averageRating = calculateAverageRating(product.ratings);
        return Math.round(averageRating) === Math.round(selectedRating)
    });

    const colorMatch = selectedColors.length === 0 || selectedColors.some((color) => product.color.includes(color))

    return categoryMatch && tagMatch && ratingMatch && colorMatch; // Include all matches
});



  // Sort products based on selected sorting option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });

  // Check if a product is in the favourites
  const isProductFavourite = (productId) => {
  
    if (isUserAuthenticated && Array.isArray(favourites)) {
      // Directly check if the favourites array contains the productId
      return favourites.includes(productId);
    }
  
    return false;
  };
  



  return (
    <>
    <ToastContainer/>
    
    <Box display="flex" sx={{ fontFamily: 'Arial, sans-serif', height: '100vh' }}>
      <Box
        sx={{
          width: '250px',
          padding: '20px',
          borderRight: '1px solid lightgrey',
          position: 'fixed',
          height: '100%',
          overflowY: 'auto',
          bgcolor: '#f9f9f9',
          marginTop: '50px',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filter Products
        </Typography>

        <ScrollInView direction='left'>
        <Typography variant="subtitle1"><strong>Categories</strong></Typography>
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                value={category}
                onChange={handleCategoryChange}
                checked={selectedCategories.includes(category)}
              />
            }
            label={category}
          />
        ))}
         <Divider/>


        <Typography variant="subtitle1"><strong>Tags</strong></Typography>
        {tags.map((tag) => (
  <FormControlLabel
    key={tag}
    control={
      <Checkbox
        value={tag}
        onChange={handleTagChange}
        checked={selectedTags.includes(tag)}
        sx={{
          '&.Mui-checked': {
            color: 'secondary.main', // Color when checked
          },
        }}
      />
    }
    label={tag}
  />
))}
        <Divider/>



        <Typography sx={{display:'flex', alignItems:'center'}} variant="subtitle1">
          <strong>Ratings</strong>

            <Tooltip title='Ratings are rounded up' placement='right'>
            <InfoIcon fontSize='small'/>
            </Tooltip>
          </Typography>



        {ratings.map((rating) => (
  <FormControlLabel
    key={rating}
    control={
      <Checkbox
        value={rating}
        onChange={handleRatingChange}
        checked={selectedRatings.includes(rating)}
        sx={{
          '&.Mui-checked': {
            color: 'secondary.main', // Color when checked
          },
        }}
      />
    }
    label={rating}
  />
))}
        <Divider/>

        <Typography variant="subtitle1"><strong>Colors</strong></Typography>
        {colors.map((color) => (
          <FormControlLabel
            key={color}
            control={
              <Checkbox
                value={color}
                onChange={handleColorChange}
                checked={selectedColors.includes(color)}
              />
            }
            label={color}
          />
        ))}
         <Divider/>
         </ScrollInView>


      </Box>


      <Box
        sx={{
          flexGrow: 1,
          marginLeft: { xs: 0, sm: '290px' },
          marginTop: '100px',
          overflowY: 'auto',
          height: 'calc(100vh - 64px)',
        }}
      >

        <Box display="flex" justifyContent="space-between" alignItems="center" margin="0 30px" mb={2}>
          <Typography variant="h6">
            Showing <strong>{filteredProducts.length}</strong>{' '}
            {filteredProducts.length === 1 ? 'product' : 'products'}
          </Typography>
          <FormControl variant="outlined" sx={{ width: '150px' }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortOption} onChange={handleSortChange} label="Sort By">
              <MenuItem value="">-- Select --</MenuItem>
              <MenuItem value="price-asc">Price (Low to High)</MenuItem>
              <MenuItem value="price-desc">Price (High to Low)</MenuItem>
              <MenuItem value="name-asc">Name (A-Z)</MenuItem>
              <MenuItem value="name-desc">Name (Z-A)</MenuItem>
            </Select>
          </FormControl>
        </Box>


        

        <Box display="flex" flexWrap="wrap" justifyContent="center" padding="20px">
          {sortedProducts.map((product, i) => {
            // Check if the product is a favourite
            const isFavourite = isProductFavourite(product._id);
            console.log(isFavourite)

            return (
              <ScrollInView direction='top'>
              <Box
                key={i}
                sx={{
                  flex: '1 1 300px',
                  height: 'auto',
                  margin: '10px',
                }}
              >
                <ProductCard product={product} isFavourite={isFavourite} products={allProducts} />
              </Box>
              </ScrollInView>
            );
          })}
        </Box>


      </Box>


      <Box
        sx={{
          position: 'fixed',
          display: { xs: 'flex', sm: 'none' },
          bottom: 16,
          right: 16,
          gap: 1,
          borderRadius: '10px',
          padding: '5px',
          backgroundColor: 'lightgrey',
        }}
      >
        <IconButton color="primary" onClick={() => setIsFilterOpen(true)}>
          <FilterAltIcon />
        </IconButton>
        <IconButton color="primary" onClick={() => setIsSortOpen(true)}>
          <SortIcon />
        </IconButton>
      </Box>

      {/* Filter Modal */}
      <Modal open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <Box
          sx={{
            padding: 4,
            backgroundColor: 'white',
            margin: 'auto',
            top: '20%',
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, -20%)',
            width: '300px',
            boxShadow: 24,
          }}
        >
          <Typography variant="h6">Filters</Typography>
          <Button onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
        </Box>
      </Modal>

      {/* Sort Modal */}
      <Modal open={isSortOpen} onClose={() => setIsSortOpen(false)}>
        <Box
          sx={{
            padding: 4,
            backgroundColor: 'white',
            margin: 'auto',
            top: '20%',
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, -20%)',
            width: '300px',
            boxShadow: 24,
          }}
        >
          <Typography variant="h6">Sort By</Typography>
          <Button onClick={() => setIsSortOpen(false)}>Apply Sort</Button>
        </Box>
      </Modal>
       </Box>

    </>
  );
}

export default Product;
