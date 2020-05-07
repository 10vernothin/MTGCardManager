/**
 * @param {string} uri - The API uri
 * @param {any} options - the options given to fetch API, most likely form data
 * @param {(data,err) =>{}} dataHandlerFunction - Callback function
 */
export default async function callAPI (uri, dataHandlerFunction, opts = undefined) {
    const response = await fetch(uri, opts)
    const { data, status } = {
        data: await response.json(),
        status: response.status
    }
    // error? 
    // no error
    if (dataHandlerFunction) {
        return dataHandlerFunction(data, (status !== 200? true: null))
    } else {
        return ({
            data,
            error: null,
            loaded: true,
            fetching: false,
        })
    }
    
}