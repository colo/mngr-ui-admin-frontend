
import Typography from '@skins/flatlogic/lightblue/pages/Typography/Typography'
import Tables from '@skins/flatlogic/lightblue/pages/Tables/Tables'
import Notifications from '@skins/flatlogic/lightblue/pages/Notifications/Notifications'
import Icons from '@skins/flatlogic/lightblue/pages/Icons/Icons'
import Maps from '@skins/flatlogic/lightblue/pages/Maps/Maps'
import Charts from '@skins/flatlogic/lightblue/pages/Charts/Charts'
// import Dashboard from '@skins/flatlogic/lightblue/pages/Dashboard/Dashboard'

const routes = [
  {
    path: '/',
    component: () => import('layouts/App'),
    meta: {
      breadcrumb: { label: 'Home', icon: 'home' }
    },
    children: [
      {
        path: '',
        // path: '',
        component: () => import('@apps/root/index'),
        meta: {
          breadcrumb: { label: 'Index', icon: 'widgets', app: 'root' }
        }

        // children: [
        //   {
        //     path: ':table',
        //     name: 'Table',
        //     component: () => import('@apps/root/table'),
        //     meta: {
        //       breadcrumb: { label: 'Table', icon: 'widgets' }
        //     }
        //   }
        //   // {
        //   //   path: 'profile',
        //   //   component: () => import('pages/user-profile')
        //   // }
        // ]
      },
      {
        path: '/munin',
        // path: '',
        component: () => import('@apps/munin/index'),
        meta: {
          breadcrumb: { label: 'Munin', icon: 'widgets', app: 'munin' }
        },

        children: [
          {
            path: ':host',
            name: 'Host',
            component: () => import('@apps/munin/components/host'),
            meta: {
              breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
            }
          }
          // {
          //   path: 'profile',
          //   component: () => import('pages/user-profile')
          // }
        ]
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography
      },
      {
        path: 'tables',
        name: 'Tables',
        component: Tables
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      },
      {
        path: 'components/icons',
        name: 'Icons',
        component: Icons
      },
      {
        path: 'components/maps',
        name: 'Maps',
        component: Maps
      },
      {
        path: 'components/charts',
        name: 'Charts',
        component: Charts
      }
    ]
    // children: [
    //   {
    //     path: '',
    //     // path: '',
    //     component: () => import('@apps/root/test.queries'),
    //     meta: {
    //       breadcrumb: { label: 'Index', icon: 'widgets', app: 'root' }
    //     }
    //
    //     // children: [
    //     //   {
    //     //     path: ':table',
    //     //     name: 'Table',
    //     //     component: () => import('@apps/root/table'),
    //     //     meta: {
    //     //       breadcrumb: { label: 'Table', icon: 'widgets' }
    //     //     }
    //     //   }
    //     //   // {
    //     //   //   path: 'profile',
    //     //   //   component: () => import('pages/user-profile')
    //     //   // }
    //     // ]
    //   },
    //
    //   // {
    //   //   path: 'hosts',
    //   //   name: 'hosts',
    //   //   component: () => import('pages/dashboards/hosts'),
    //   //   meta: {
    //   //     breadcrumb: { label: 'Hosts', icon: 'fas fa-tachometer-alt' }
    //   //   },
    //   //
    //   //   // Now we define the sub-routes.
    //   //   // These are getting injected into
    //   //   // layout (from above) automatically
    //   //   // by using <router-view> placeholder
    //   //   // (need to specify it in layout)
    //   //   children: [
    //   //     {
    //   //       path: ':host',
    //   //       name: 'host',
    //   //       component: () => import('pages/dashboards/host'),
    //   //       meta: {
    //   //         breadcrumb: { label: 'Host', icon: 'widgets' }
    //   //       }
    //   //     }
    //   //     // {
    //   //     //   path: 'profile',
    //   //     //   component: () => import('pages/user-profile')
    //   //     // }
    //   //   ]
    //   // },
    //   {
    //     path: 'logs',
    //     name: 'logs',
    //     component: () => import('@apps/logs/index'),
    //     meta: {
    //       breadcrumb: { label: 'Logs', icon: 'fas fa-tachometer-alt' }
    //     },
    //
    //     // Now we define the sub-routes.
    //     // These are getting injected into
    //     // layout (from above) automatically
    //     // by using <router-view> placeholder
    //     // (need to specify it in layout)
    //     children: [
    //       {
    //         path: 'web',
    //         name: 'host',
    //         component: () => import('@apps/logs/web/index'),
    //         meta: {
    //           breadcrumb: { label: 'Web', icon: 'fas fa-tachometer-alt' }
    //         }
    //       }
    //       // {
    //       //   path: 'profile',
    //       //   component: () => import('pages/user-profile')
    //       // }
    //     ]
    //   }
    // ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
