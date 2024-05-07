import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import Typography from '@mui/material/Typography';

const EmptyOrders = ({status}) => {
    const EmptyOrdersVars = {
        "on-hold":{leyenda: 'Sin pedidos para confirmar cancelación', icon: <PriceCheckIcon sx={{fontSize:"3em"}} />},
        "processing":{leyenda: 'Sin pedidos en preparación', icon: <SoupKitchenIcon sx={{fontSize:"3em"}} />}
    };
    return (
    <Box textAlign="center" m={1} sx={{color:'#aaa'}}>
        <Grid container 
			direction="row"
			justifyContent="center"
			alignItems="center"
			columnSpacing={2}
		>
		<Grid item>
		<Typography variant="body">
			{EmptyOrdersVars[status].icon}
        </Typography>
        </Grid>
		<Grid item>
		<Typography variant="body" paragraph>
            {EmptyOrdersVars[status].leyenda}
        </Typography>
		</Grid>
		</Grid>
    </Box>
)};

export default EmptyOrders;