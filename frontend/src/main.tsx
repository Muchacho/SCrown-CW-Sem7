import ReactDOM from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider
  } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { Paths } from './paths.tsx';
import { RecoilRoot } from 'recoil';

const router = createBrowserRouter(Paths);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <div>
        <RecoilRoot>
            <Provider store={store}>
                <RouterProvider router={router}/>
            </Provider>
        </RecoilRoot>
    </div>
)
