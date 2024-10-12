export interface AccessKey {
  key: string;
  rateLimit: number;
  expirationTime: Date;
  remainingRequests: number;
  isEnabled: boolean;
}
