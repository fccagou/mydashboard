const routes = [
    {
        path: '/',
        name: 'RemoteAccess',
        component: RemoteAccessComponent,
    },
    {
        path: '/customization',
        name: 'UserCustomization',
        component: CustomizationComponent,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFoundComponent,
    }
]