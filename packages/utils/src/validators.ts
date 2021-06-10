export const validateJWT = (jwt: unknown): jwt is string => {
    if (typeof jwt !== 'string') {
        return false;
    }
    const payload = jwt.split('.')[1];
    if (!payload) {
        return false;
    }
    const { exp } = JSON.parse(atob(payload)) as { exp: number };
    return exp * 1000 > Date.now();
};

export const validateMail = (mail: unknown): mail is string => {
    if (typeof mail !== 'string') {
        return false;
    }
    return /^\S+@\S+$/.test(mail);
};

export const validatePhone = (phone: unknown): phone is string => {
    if (typeof phone !== 'string') {
        return false;
    }
    return /^1\d{10}$/.test(phone);
};

export const validateCode = (code: unknown): code is string => {
    if (typeof code !== 'string') {
        return false;
    }
    return /^[0-9a-f]{4}$/.test(code);
};
