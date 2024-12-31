import {Suspense} from 'react';
import {Outlet} from 'react-router-dom';
import {Toaster} from 'sonner';
import {UserProvider} from "./ContextAPI/UserProvider.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

function Layout() {
    return (
        <>
            <UserProvider>
                <Suspense fallback={<div className={"loading"}><img src={"/loading.svg"} alt={"loading..."}/></div>}>

                    <main>
                        <Navbar/>
                        <Outlet/>
                    </main>
                    <Footer/>
                    <Toaster position="bottom-right" richColors={true}/>
                </Suspense>
            </UserProvider>
        </>
    )
}

export default Layout
