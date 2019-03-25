// ref: https://umijs.org/config/
export default {
    treeShaking: true,
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: true,
            dynamicImport: { webpackChunkName: true },
            title: 'react-admin',
            dll: true,

            routes: {
                exclude: [
                    /models\//,
                    /services\//,
                    /model\.(t|j)sx?$/,
                    /service\.(t|j)sx?$/,
                    /components\//,
                ],
            },
        }],
    ],
    routes: [
        {
            path: 'user',
            routes: [
                {
                    path: 'login',
                    component: './user/login'
                }
            ]
        },
        {
            path: '/',
            component: '../layouts/index',
            Routes: ['src/pages/Authorized'],
            routes: [
                {
                    path: '/',
                    redirect: './user/login'
                },
                {
                    path: 'home',
                    component: './home/index'
                }
            ]
        }
    ]
}
