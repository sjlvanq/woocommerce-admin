import { useState, useCallback, useEffect } from 'react';
import { useGetList, useListContext } from 'react-admin';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const ProductFilterCategoriesSel = () => {
    const { filterValues, setFilters } = useListContext();
	const [cat, setCat] = useState(filterValues.category || "");

	const handleProductFilterCategoriesSelChange = (event) => {
		setCat(event.target.value);
        setFilters({...filterValues,'category': event.target.value},undefined,false);
	};

    const { data, ids, status, error } = useGetList(
        'products/categories',
        { field: 'menu_order', order: 'ASC' }
    );
	
	if (error) { return <p>ERROR</p>; }
    else if (status=="loading") { return <p>...</p>; }
	else if (status=="success") {
		return (
			<FormControl fullWidth>
			<InputLabel id="productfiltercategoriessel-label">Categoría</InputLabel>
			<Select
			  id="productfiltercategoriessel"
			  labelId="productfiltercategoriessel-label"
			  label="Seleccione una categoría"
			  value={cat}			  
			  onChange={handleProductFilterCategoriesSelChange}>
			  {data.map(c => 
				<MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
			</Select>
			</FormControl>
		);
	};
};
export default ProductFilterCategoriesSel;