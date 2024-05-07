import { AppBar, TitlePortal, useGetList, useRedirect, useStore } from 'react-admin';

import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const NotifyButton = () => {
	const [lastOrderId] = useStore('orders.lastOrderId', 0);
	const [newOrdersNotification, setNewOrdersNotification] = useStore('orders.newOrdersNotification', false);
	const redirect = useRedirect();
	useGetList(
        'orders', {},
		{
		onSuccess: (orders) => {
		  if(orders.data){
			const currentLastOrderId = orders.data.reduce((max, obj) => obj.id > max ? obj.id : max, 0);
			if(lastOrderId < currentLastOrderId) {setNewOrdersNotification(true);}
		  }
		},
		}
    );
	return ( 
		<IconButton color="inherit" sx={{backgroundColor:"transparent"}} onClick={()=>{redirect('/')}}>
			{newOrdersNotification ? <Badge color="error" variant="dot"><NotificationsActiveIcon /></Badge> : <NotificationsIcon /> }
		</IconButton>
	)
};

export const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <NotifyButton />
    </AppBar>
);