import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateToken, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, storeName, storeDescription } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user data
    const userData = {
      name,
      email,
      role,
      avatar: undefined,
    };

    // If vendor, add store information
    if (role === 'vendor') {
      if (!storeName) {
        return NextResponse.json(
          { success: false, error: 'Store name is required for vendors' },
          { status: 400 }
        );
      }

      const vendorData = {
        ...userData,
        storeName,
        storeDescription: storeDescription || '',
        storeSlug: storeName.toLowerCase().replace(/\s+/g, '-'),
        isApproved: false, // Vendors need admin approval
        commissionRate: 0.15,
        totalSales: 0,
        rating: 0,
        reviewCount: 0,
      };

      const user = await db.createUser(vendorData);
      const token = generateToken(user);

      return NextResponse.json({
        success: true,
        data: { user, token },
        message: 'Vendor registration successful. Awaiting admin approval.',
      });
    }

    // Create regular user
    const user = await db.createUser(userData);
    const token = generateToken(user);

    return NextResponse.json({
      success: true,
      data: { user, token },
      message: 'Registration successful',
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
