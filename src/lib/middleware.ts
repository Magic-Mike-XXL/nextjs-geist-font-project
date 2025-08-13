import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export function withAuth(handler: Function, allowedRoles?: string[]) {
  return async (request: NextRequest) => {
    try {
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { success: false, error: 'Authorization token required' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Add user info to request
      (request as any).user = decoded;
      
      return handler(request);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  };
}

export function adminOnly(handler: Function) {
  return withAuth(handler, ['admin']);
}

export function vendorOnly(handler: Function) {
  return withAuth(handler, ['vendor']);
}

export function vendorOrAdmin(handler: Function) {
  return withAuth(handler, ['vendor', 'admin']);
}
