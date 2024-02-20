import { BrowserRouter } from 'react-router-dom';
import { Admin, Resource, ListGuesser } from 'react-admin';
//import woocommerceData from 'ra-data-woocommerce';
import woocommerceData from './dataProvider';
import orders from './orders';
import refunds from './refunds';
import products from './products';
import categories from './categories';

import Dashboard from './Dashboard';
import authProvider from './authProvider';
import LoginPage from './LoginPage.js';

const dataProvider = woocommerceData({
    woocommerceUrl: process.env.REACT_APP_WOOURL,
    consumerKey: process.env.REACT_APP_API_KEY,
    consumerSecret: process.env.REACT_APP_API_SECRET,
}) //DEV

const App = () => (
    <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
        <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            loginPage={LoginPage}
            dashboard={Dashboard}
        >
            <Resource name="products" {...products} />
            <Resource name="categories" {...categories} />
            <Resource name="orders" {...orders} />
            <Resource name="orders/:id/refunds" {...refunds} />
        </Admin>
    </BrowserRouter>
);

export default App;