import { NextResponse, NextRequest } from 'next/server';
import { baseUrl } from './app/api/common';

export async function middleware(request: NextRequest) {
    const userId = request.cookies.get('userId');
    console.log('DATA FOR USER', userId?.value);
    if (!userId) {
        console.error('User ID not found in cookies');
        return NextResponse.next();
    }

    const apiUrl = baseUrl + `users/${userId.value}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data && data.data) {
            console.log('ACCESS', data.data.access);

            // Create a new response to set the cookie
            const newResponse = NextResponse.next();
            newResponse.cookies.set('access', JSON.stringify(data.data.access), {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            console.log('User data fetched and set in cookies');
            return newResponse;
        } else {
            console.error('Invalid response structure', data);
        }
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
