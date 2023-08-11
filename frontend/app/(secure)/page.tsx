'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useUserService } from '_services';
import { Spinner } from '_components';

export default Home;

function Home() {
    const router = useRouter();
    const userService = useUserService();
    const user = userService.currentUser;

    useEffect(() => {
        userService.getCurrent();
    }, []);

    if (user) {
        router.push("/orders")
        // return (
        //     <>
        //         <h1>Hi {user.firstName}!</h1>
        //         <p>You&apos;re logged Logistics App</p>
        //         <p><Link href="/users">Manage Users</Link></p>
        //         <p><Link href="/orders">Manage Orders</Link></p>
        //         <p><Link href="/chat">Contact Support Chanel</Link></p>
        //     </>
        // );
    } else {
        return <Spinner />;
    }
}
