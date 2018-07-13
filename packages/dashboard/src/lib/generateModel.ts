export default (accepted: boolean, name: string, title: string, group: string, step: string) => {
    return accepted ?
        `[联创团队]${name}你好，你通过了${title}${group}组${step}审核`
        : `[联创团队]${name}你好，你没有通过${title}${group}组${step}审核`
}