var readCurrURLParamsAsJSON = () => {
    var params = '';
    (window.location.href).split('?')[1].split('&').forEach((item) =>
    {
        var items = item.split('=');
        params = params.concat(',"' + decodeURIComponent(items[0]) + '":"' + decodeURIComponent(items[1]) + '"');
    });
    params = params.toString().substring(1);
    params = '{'+ params + '}';
    return JSON.parse(params);
}

export default readCurrURLParamsAsJSON;