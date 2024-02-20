import { Card, CardContent, CardHeader } from "@mui/material";
import { Grid, Button, Typography } from "@mui/material";

const Dashboard = () => (

<Grid container direction="row" justifyContent="center">

<Grid container direction="column" justifyContent="center" style={{textAlign:"center"}} sx={{mt:2}}>
		<Grid item><Typography variant="h4" color="gray">DON GULA</Typography></Grid>
		<Grid item><Typography variant="h5" color="gray">Gestión del aplicativo</Typography></Grid>
</Grid>

{/*
<Grid container direction="row" justifyContent="center" alignItems="flex-end" spacing={2} sx={{mt:2}}
>
	<Grid item sx={12} md={4}>
		<Card>
			<CardHeader title="Productos" />
			<CardContent></CardContent>
		</Card>
	</Grid>
	<Grid item sx={12} md={4}>
		<Card>
			<CardHeader title="Categorías" />
			<CardContent></CardContent>
		</Card>
	</Grid>
	<Grid item sx={12} md={4}>
		<Card>
			<CardHeader title="Pedidos" />
			<CardContent></CardContent>
		</Card>
	</Grid>
</Grid>
*/}
</Grid>

);

export default Dashboard;