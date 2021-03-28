export const cacheKey = (phone: string, isUser: boolean) => `${isUser ? 'userCode' : 'candidateCode'}:${phone}`;
