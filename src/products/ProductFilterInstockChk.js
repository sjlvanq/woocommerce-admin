import { useListContext } from 'react-admin';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const ProductFilterInstockChk = () => {
	const listContext = useListContext();
    const { filterValues, setFilters } = listContext;
	//console.log("listContext en ProductFilterInstockChk");
	//console.log(listContext);
	const handleProductFilterInstockChk = (event) => {
        let stock_status;
		if(event.target.checked){
			stock_status="instock";
		} else { stock_status="" }
		setFilters({...filterValues,'stock_status': stock_status}, undefined, false);
	};
	
	return (
			<FormControlLabel control={<Switch onChange={handleProductFilterInstockChk} />} label="Publicados" checked={filterValues.stock_status==="instock"} />
		);
	};

export default ProductFilterInstockChk;