import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface JwtPayload {
    sub : string,
    role: string
  }
  
export const auth = {
    isAuthenticated,
    verifyToken
}

function isAuthenticated() {
    try {
        verifyToken();
        return true;
    } catch {
        return false;
    }
}

function verifyToken() {
    const token = cookies().get('authorization')?.value ?? '';
    const {sub , role} = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return {id: sub, role};
}
