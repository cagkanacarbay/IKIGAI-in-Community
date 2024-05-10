"use client"
import { useRouter } from 'next/navigation';
import { UserSettings } from '@/components/userSettings';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import prisma from '@/prisma/client';



export default function Page() {
    const router = useRouter();

    useEffect(() => {
        router.push('/user');
    }, []);

    const { data: session, status } = useSession();
    console.log(session)


    return UserSettings();
};