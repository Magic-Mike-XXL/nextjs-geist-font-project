import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth, vendorOrAdmin } from '@/lib/middleware';

// GET /api/products - List products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const vendorId = searchParams.get('vendorId') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const { products, total } = await db.findProducts({
      category,
      vendorId,
      search,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });

  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product (vendors only)
async function createProduct(request: NextRequest) {
  try {
    const user = (request as any).user;
    const body = await request.json();

    const {
      name,
      description,
      price,
      comparePrice,
      images,
      category,
      subcategory,
      tags,
      stock,
    } = body;

    // Validate required fields
    if (!name || !description || !price || !category || stock === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Get vendor data
    const vendor = await db.findUserById(user.id);
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const productData = {
      name,
      slug,
      description,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
      images: images || [],
      category,
      subcategory,
      tags: tags || [],
      vendorId: user.id,
      vendor: vendor as any,
      stock: parseInt(stock),
      isActive: true,
      rating: 0,
      reviewCount: 0,
    };

    const product = await db.createProduct(productData);

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });

  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = vendorOrAdmin(createProduct);
