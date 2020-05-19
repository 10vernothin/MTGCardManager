/*This function is a custom-made function that parses URL params*/

const readCurrURLParamsAsJSON = () => {
    var params = '';
    var string = (window.location.href).split('?')[1]
    if (string) {
        string.split('&').forEach((item) =>
        {
            var items = item.split('=');
            params = params.concat(',"' + decodeURIComponent(items[0]) + '":"' + decodeURIComponent(items[1]) + '"');
        });
        params = params.toString().substring(1);
        params = '{'+ params + '}';
        return JSON.parse(params);
    } else {
        return {}
    }
}

export default readCurrURLParamsAsJSON;