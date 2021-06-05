export const checkMail = (mail: string) => {
    const re =
        /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return re.test(mail);
};

export const checkPhone = (phone: string) => {
    const re = /^1\d{10}$/i;
    return re.test(phone);
};
