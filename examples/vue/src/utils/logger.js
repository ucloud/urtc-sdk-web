function log(...args) {
  console.log((new Date()).toLocaleString(), ...args)
}

log.warn = function(...args) {
  console.warn((new Date()).toLocaleString(), ...args)
}

log.error = function(...args) {
  console.error((new Date()).toLocaleString(), ...args)
}

export { log }
