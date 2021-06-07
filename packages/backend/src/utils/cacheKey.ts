export const cacheKey = (phone: string, isMember: boolean) => `${isMember ? 'memberCode' : 'candidateCode'}:${phone}`;
