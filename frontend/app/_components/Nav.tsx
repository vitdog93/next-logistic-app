'use client';

import { useState } from 'react';
import Image from 'next/image'

import { NavLink } from '_components';
import { useUserService } from '_services';

export { Nav };

function Nav() {
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const userService = useUserService();

    async function logout() {
        setLoggingOut(true);
        await userService.logout();
    }

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
            <div className="navbar-nav">
                <Image className='me-3' src="/images/icon.png" alt="Picture of the logo" width={32} height={32}/>
                <NavLink href="/orders" className="nav-item nav-link">Orders</NavLink>
                <NavLink href="/users" className="nav-item nav-link">Users</NavLink>
                <NavLink href="/chat" className="nav-item nav-link">Support Chanel</NavLink>
                <button onClick={logout} className="nav-item nav-link" style={{ width: '67px' }} disabled={loggingOut}>
                    {loggingOut
                        ? <span className="spinner-border spinner-border-sm"></span>
                        : <span>Logout</span>
                    }
                </button>
            </div>
        </nav>
    );
}