export const checkMail = (mail: string) => {
  // refer: https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/email
  // eslint-disable-next-line no-useless-escape
  const re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(mail);
};

export const checkPhone = (phone: string) => {
  const re = /^1\d{10}$/i;
  return re.test(phone);
};
