// src/types/express/index.d.ts
import { User } from '../../users/schemas/user.schema'; // ← 실제 경로로 맞추세요

declare module 'express' {
  interface Request {
    user?: User;  // user의 타입을 명시해줌
  }
}
