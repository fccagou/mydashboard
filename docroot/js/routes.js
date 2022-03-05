const routes = [
    {
        path: '/',
        name: 'RemoteAccess',
        component: RemoteAccessComponent,
    },
    {
        path: '/user/preferences',
        name: 'UserPreferences',
        component: UserPreferencesComponent,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFoundComponent,
    }
]