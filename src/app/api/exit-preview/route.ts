import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectPath = searchParams.get('redirect') || '/';

  (await draftMode()).disable(); // tắt draft mode

  redirect(redirectPath);
}
