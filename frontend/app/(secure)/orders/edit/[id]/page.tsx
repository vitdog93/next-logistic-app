'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AddEdit } from '_components/orders';
import { Spinner } from '_components';
import { useOrderService, useUserService } from '_services';

export default Edit;

function Edit({ params: { id } }: any) {
    const router = useRouter();
    const orderService = useOrderService();
    const order = orderService.order;
    
    useEffect(() => {
        if (!id) return;

        // fetch user for add/edit form
        orderService.getById(id)
    }, [router]);

    return order
        ? <AddEdit title="Edit User" order={order}/>
        : <Spinner />;
}