export const ERROR_TOKEN_NOT_FOUND = 'token not found in loaclstorage';

export const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error(ERROR_TOKEN_NOT_FOUND);
  }
  return token;
};

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};
