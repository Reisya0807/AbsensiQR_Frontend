import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { npm, password } = body;

    // Dummy Admin
    const adminDummy = {
      npm: '12345678',
      password: 'pwsekre',
      role: 'admin',
      name: 'Super Admin'
    };

    // Dummy User
    const userDummy = {
      npm: '87654321',
      password: 'pwuser',
      role: 'user',
      name: 'Mahasiswa Testing'
    };

    if (npm === adminDummy.npm && password === adminDummy.password) {
      return NextResponse.json({
        success: true,
        user: { name: adminDummy.name, role: adminDummy.role }
      });
    } 
    
    if (npm === userDummy.npm && password === userDummy.password) {
      return NextResponse.json({
        success: true,
        user: { name: userDummy.name, role: userDummy.role }
      });
    }

    return NextResponse.json(
      { success: false, message: 'NPM atau Password salah!' },
      { status: 401 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server Error' },
      { status: 500 }
    );
  }
}