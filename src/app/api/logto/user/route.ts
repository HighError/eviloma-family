// app/api/logto/user/route.ts
import { type NextRequest } from 'next/server';

import { logtoClient } from '@/lib/logto';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return logtoClient.handleUser({ fetchUserInfo: true })(request);
}
