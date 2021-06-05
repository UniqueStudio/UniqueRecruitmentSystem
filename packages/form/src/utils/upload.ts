export const upload = (
    url: string,
    { method, headers, body }: RequestInit,
    onProgress: XMLHttpRequestEventTarget['onprogress'],
) =>
    new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method || 'get', url);
        headers && Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
        xhr.onload = function () {
            resolve(this.responseText);
        };
        xhr.onerror = reject;
        xhr.upload.onprogress = onProgress;
        xhr.send(body);
    });
