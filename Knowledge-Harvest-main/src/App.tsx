import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import useGlobalStore from './store';
import { THEME } from './theme';
import { Routers } from './router';
import { Suspense, useEffect } from 'react';
import classNames from 'classnames';

function Routes() {
    return useRoutes(Routers)
}

export default function App() {
    const store = useGlobalStore(({ theme, setUser, init }) => ({ theme, setUser, init }))

    useEffect(() => {
        const userGuid = localStorage.getItem('userGuid')

        if (userGuid) {
            store.setUser({ userGuid })
        }

        store.init()
    }, [])

    return (
        <Suspense>
            <ConfigProvider
                theme={THEME[store.theme]}
            >
                <div className={classNames([
                    'app-container',
                    store.theme
                ])}>
                    <Router basename='/'>
                        <Routes />
                    </Router>
                </div>
            </ConfigProvider>
        </Suspense>
    )
}
