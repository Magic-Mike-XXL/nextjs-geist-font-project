import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateToken, comparePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // For demo purposes, we'll use a simple password check
    // In a real app, you'd compare with the hashed password from the database
    const validPassword = password === 'password123' || 
                         email === 'admin@ecommerce.com' && password === 'admin123' ||
                         email === 'vendor@example.com' && password === 'vendor123' ||
                         email === 'customer@example.com' && password === 'customer123';

    if (!validPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if vendor is approved
    if (user.role === 'vendor') {
      const vendor = user as any;
      if (!vendor.isApproved) {
        return NextResponse.json(
          { success: false, error: 'Vendor account pending approval' },
          { status: 403 }
        );
      }
    }

    // Generate token
    const token = generateToken(user);

    return NextResponse.json({
      success: true,
      data: { user, token },
      message: 'Login successful',
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
