function boundInstance(instance) {
    const methodNames = Object.getOwnPropertyNames(
        Object.getPrototypeOf(instance)
    ).filter((name) => typeof instance[name] === 'function')

    methodNames.forEach(
        (method) => (instance[method] = instance[method].bind(instance))
    )

    return instance
}

module.exports = { boundInstance }
