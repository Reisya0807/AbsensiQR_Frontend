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
      name: 'Sekretaris',
    };

    // Dummy User
    const userDummy = {
      npm: '87654321',
      password: 'pwuser',
      role: 'user',
      name: 'Mahasiswa',
    };

    let user = null;

    // cek admin
    if (
      npm === adminDummy.npm &&
      password === adminDummy.password
    ) {
      user = adminDummy;
    }

    // cek user
    else if (
      npm === userDummy.npm &&
      password === userDummy.password
    ) {
      user = userDummy;
    }

    // jika login gagal
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'NPM atau Password salah!',
        },
        {
          status: 401,
        }
      );
    }

    // response sukses
    const response = NextResponse.json({
      success: true,
      user: {
        name: user.name,
        role: user.role,
      },
    });

    // simpan cookie login
    response.cookies.set('token', user.role, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 hari
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Server Error',
      },
      {
        status: 500,
      }
    );
  }
}