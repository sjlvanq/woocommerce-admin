import { BrowserRouter } from 'react-router-dom';
import { Admin, defaultTheme, Resource } from 'react-admin';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import woocommerceData from 'ra-data-woocommerce';
import woocommerceData from './dataProvider';
import orders from './orders';
import refunds from './refunds';
import products from './products';
import categories from './categories';
import repartidores from './repartidores';
import envios from './envios';

import Dashboard from './Dashboard';
import authProvider from './authProvider';
import LoginPage from './LoginPage.js';
import { MyLayout } from './MyLayout';

const lightTheme = defaultTheme;
const darkTheme = { ...defaultTheme, palette: { mode: 'dark' } };

const dataProvider = woocommerceData({
    woocommerceUrl: process.env.REACT_APP_WOOURL,
    consumerKey: process.env.REACT_APP_API_KEY,
    consumerSecret: process.env.REACT_APP_API_SECRET,
}) //DEV

const App = () => (
    <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
        {/*<LocalizationProvider dateAdapter={AdapterDayjs}>*/}
        <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            loginPage={LoginPage}
            dashboard={Dashboard}
            layout={MyLayout}
            theme={lightTheme}
            darkTheme={darkTheme}
        >
            <Resource name="envios" {...envios} />
            <Resource name="products" {...products} />
            <Resource name="products/categories" {...categories} />
            <Resource name="repartidores" {...repartidores} />
            <Resource name="orders" {...orders} />
            <Resource name="orders/:id/refunds" {...refunds} />
        </Admin>
        {/*</LocalizationProvider>*/}
    </BrowserRouter>
);

export default App;