const qs = require('qs')

export const query = (filters) => {
    return filters && JSON.stringify(filters) !== '{}' ? '?' + qs.stringify(filters) : ''
}

export const request = (type, route, filters = {}) => {
    let params = Object.assign({}, filters) || {}
    for (let key in params) {
        if (!params.hasOwnProperty(key) || route.indexOf(`{${key}}`) === -1) {
            continue
        }
        route = route.replace(`{${key}}`, params[key])
        delete params[key]
    }

    return type === 'get' ? route + query(params) : route
}

// TODO create JS array expansion from this method
export const createForm = (formData, params, key = null) => {
    for (let i in params) {
        if (!params.hasOwnProperty(i)) {
            continue
        }

        let formKey = key ? key + `[${i}]` : i

        if (
          params[i] !== null &&
          (Array.isArray(params[i]) || typeof params[i] === 'object') &&
          !(params[i] instanceof File || params[i] instanceof Date)
        ) {
            formData = createForm(formData, params[i], formKey)
            continue
        }

        // Return null values as empty string, because the back-end will receive a string "null" which is super annoying.
        formData.append(formKey, params[i] === null ? '' : params[i])
    }

    return formData
}

export const form = (params) => {
    let formData = new FormData()
    return createForm(formData, params)
}

