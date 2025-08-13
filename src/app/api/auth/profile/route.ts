import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware';

async function handler(request: NextRequest) {
  try {
    const user = (request as any).user;
    
    // Get fresh user data from database
    const userData = await db.findUserById(user.id);
    
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: userData,
    });

  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
