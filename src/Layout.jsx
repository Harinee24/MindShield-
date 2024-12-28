import {lazy, Suspense} from 'react';
import {Outlet} from 'react-router-dom';
import {Toaster} from 'sonner';

const Navbar = lazy(() => import("./components/Navbar.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));

function Layout() {
    return (
        <>
            <Suspense fallback={<div className={"loading"}><img src={"/loading.svg"} alt={"loading..."}/></div>}>
                <main>
                    <Navbar/>
                    <Outlet/>
                </main>
                <Footer/>
                <Toaster position="bottom-right" richColors={true}/>
            </Suspense>
        </>
    )
}

export default Layout
