import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

/**
 * Maps react-admin queries to a WooCommerce REST API
 *
 * @see https://woocommerce.github.io/woocommerce-rest-api-docs/
 *
 * @example
 *
 * getList          => GET https://example.com/orders?order=asc&page=1&per_page=10&search=example&status=completed
 * getOne           => GET https://example.com/orders/123
 * getMany          => GET https://example.com/orders?include=123,456,789
 * getManyReference => GET https://example.com/orders/123/notes
 * create           => POST https://example.com/orders
 * update           => PUT https://example.com/orders/123
 * updateMany       => PUT https://example.com/orders/123, PUT http://example.com/orders/456, PUT http://example.com/orders/789
 * delete           => DELETE https://example.com/orders/123
 * deleteMany       => DELETE https://example.com/orders/123, DELETE https://example.com/orders/456, DELETE https://example.com/orders/789
 *
 * @example
 *
 * import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
 * import woocommerceData from 'ra-data-woocommerce';
 * 
 * const dataProvider = woocommerceData({
 *     woocommerceUrl: 'https://example.com',
 *     consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
 *     consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
 * })
 * 
 * const App = () => (
 *     <Admin dataProvider={dataProvider}>
 *         <Resource name="orders" list={ListGuesser} edit={EditGuesser} />
 *         <Resource name="customers" list={ListGuesser} edit={EditGuesser} />
 *     </Admin>
 * );
 * 
 * export default App;
 */
export default ({woocommerceUrl, consumerKey, consumerSecret,
    httpClient = (url, options = {}) => {
        if (!options.headers) {options.headers = new Headers({ Accept: 'application/json' });}
        const token = `${consumerKey}:${consumerSecret}`
        const basic_auth = btoa(unescape(encodeURIComponent(token)))
        options.user = {authenticated: true, token: 'Basic ' + basic_auth};
        return fetchUtils.fetchJson(url, options);
    }
}) => ({
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        let url;
        if (resource === 'categories') {
            url = `${woocommerceUrl}/wp-json/wc/v3/products/${resource}?${stringify({
                order: order.toLowerCase(),
                order_by: field,
                page: page,
                per_page: perPage,
            })}`;
        } else if (resource === 'products') {
            const { search, category, stock_status } = params.filter;
            url = `${woocommerceUrl}/wp-json/wc/v3/${resource}?${stringify({
                order: order.toLowerCase(),
                order_by: field,
                page: page,
                per_page: perPage,
                search: search,
                category: category,
                stock_status: stock_status,
            })}`;
        } else if (resource === 'orders') {
            const { search, status } = params.filter;
            const { page, perPage } = params.pagination;
            url = `${woocommerceUrl}/wp-json/wc/v3/${resource}?${stringify({
                order: order.toLowerCase(),
                page: page,
                per_page: perPage,
                search: search,
                status: status
            })}`;
        } else {
            url = `${woocommerceUrl}/wp-json/wc/v3/${resource}`;
        }
        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('X-WP-Total').split('/').pop(), 10),
        }));
    },
    getOne: (resource, params) => {
        console.log('dataProvider => getOne. resource: ' + resource + ' | params: ' + params);
        console.log(params);
        let url;
        if (resource === 'categories') {
            url = `${woocommerceUrl}/wp-json/wc/v3/products/${resource}/${params.id}`
        } else {
            url = `${woocommerceUrl}/wp-json/wc/v3/${resource}/${params.id}`
        }
        return httpClient(url).then(({ json }) => ({
            data: json,
        }));
    },
    getMany: (resource, params) => {
        console.log("getMany. resource: " +resource + ' | params: ' + params);
        console.log(params);
        let url;
        if (resource === 'categories') {
            url = `${woocommerceUrl}/wp-json/wc/v3/products/${resource}`;
        } else {
            const query = {include: Array(params.ids),};
            url = `${woocommerceUrl}/wp-json/wc/v3/${resource}?${stringify(query)}`;
        }
        return httpClient(url).then(({ json }) => {console.log(json);return ({ data: json })});
    },
    getManyReference: (resource, params) => {
        console.log("getManyReference. resource: "+resource + ' | params: ' + params);
        console.log(params);
        const { field, order } = params.sort;
        let url;
        if (resource === 'products') {
            url = `${woocommerceUrl}/wp-json/wc/v3/${resource}?${stringify({
                order: order.toLowerCase(),
                order_by: field,
                per_page: 99,
                category: params.id})}`
        }
        else if (resource === 'reviews') {
            url = `${woocommerceUrl}/wp-json/wc/v3/products/${resource}/${params.id}`
        }
        else {
            url = `${woocommerceUrl}/wp-json/wc/v3/${resource}/${params.id}/${params.target}`;
        }
        console.log(url);
        return httpClient(url).then(({ headers, json }) => {console.log(json); return ({
            data: json,
            total: parseInt(headers.get('Content-Type')),
        })});
    },
    create: (resource, params) => {
        console.log("create. resource: "+resource + ' | params: ' + params);
        console.log(params);
        let url;
        if (resource === 'categories') {
            url = `${woocommerceUrl}/wp-json/wc/v3/products/${resource}`;
        }
        else {
            url = `${woocommerceUrl}/wp-json/wc/v3/${resource}`;
        }
        return httpClient(url, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        }));
    },
    update: (resource, params) => {
        console.log("update. resource: "+resource + ' | params: ' + params);
        console.log(params);
        if (params.data.category) {
            params.data.categories = [{ id: params.data.category }];
        }
        let url;
        if (resource === 'categories') {
            url = `${woocommerceUrl}/wp-json/wc/v3/products/${resource}/${params.id}`;
        }
        else {
            url = `${woocommerceUrl}/wp-json/wc/v3/${resource}/${params.id}`;
        }
        return httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }))
    },
    updateMany: (resource, params) =>
        Promise.all(
            params.ids.map(id =>
                httpClient(`${woocommerceUrl}/wp-json/wc/v3/${resource}/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(params.data),
                })
            )
        ).then(responses => ({ data: responses.map(({ json }) => json.id) })),
    delete: (resource, params) => {
        let url;
        if (resource === 'categories') { 
            url = `${woocommerceUrl}/wp-json/wc/v3/products/${resource}/${params.id}?force=true`;
        } else {
            url = `${woocommerceUrl}/wp-json/wc/v3/${resource}/${params.id}`;
        }
        return httpClient(url, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json }))
    },
    deleteMany: (resource, params) =>
        Promise.all(
            params.ids.map(id =>
                httpClient(`${woocommerceUrl}/wp-json/wc/v3/${resource}/${id}`, {
                    method: 'DELETE',
                })
            )
        ).then(responses => ({ data: responses.map(({ json }) => json.id) })),
});