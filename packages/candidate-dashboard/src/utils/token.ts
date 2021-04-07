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

export const checkToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (token === null) {
      return false;
    }
    if (token === '' || JSON.parse(token.split('.')[1]).exp > Date.now() / 1000) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};
