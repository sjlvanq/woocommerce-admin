import { useUpdateMany, useListContext } from 'react-admin'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const ProductSetAllOutofstockBtn = () => {
    const listContext = useListContext();
	const [updateMany, { isLoading, error }] = useUpdateMany();
    const { filterValues } = listContext;

	const SetAllOutofstock = async () => {
		//console.log(listContext)
		const ids = listContext.data.map(producto => producto.id);
		await updateMany('products', {ids:ids, data: {stock_status: "outofstock"}});
	}
    return ( 
		<>
		{filterValues.stock_status && filterValues.stock_status === 'instock' && (
		<Button
		  sx={{ mt: .8 }}
		  variant="text" 
		  onClick={SetAllOutofstock}
		>
		  Retirar todos
		</Button>
		)}
		</>
	);
};

export default ProductSetAllOutofstockBtn;