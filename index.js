function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function isArray (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

function isFunction (obj) {
  return Object.prototype.toString.call(obj) === '[object Function]'
}

function isPrimitive (obj) {
  if (typeof obj === 'object' && obj !== null && typeof obj !== 'function') return false
  return true
}

/*
 * shallow clone a value
 * only object, primitives and array are taken into consideration
 * function / set / weakmap and so on are not taken into consideration
 */
function shallowClone (source) {
  if (isPrimitive(source)) return source
  return Object.create(
    Object.getPrototypeOf(source),
    Object.getOwnPropertyDescriptors(source)
  )
}

/*
 * deep clone a value
 * only object, primitives and array are taken into consideration
 * function / set / weakmap and so on are not taken into consideration
 * property with symbol keys and inenumerable keys will not be cloned
 */
function deepClone (source) {
  if (isPrimitive(source)) return source
  const uniqueData = new Map()
  const stack = []
  let target = {};
  if (isArray(source)) target = []
  uniqueData.set(source, target)
  stack.push({
    src: source,
    tgt: target
  })
  while (stack.length) {
    const top = stack.pop()
    for (let key of Object.getOwnPropertyNames(top.src)) {
      if (!isObject(top.src[key]) && !isArray(top.src[key])) {
        top.tgt[key] = top.src[key]
      } else if (isObject(top.src[key])) {
        top.tgt[key] = {}
        if (uniqueData.has(top.src[key])) {
          top.tgt[key] = uniqueData.get(top.src[key])
        } else {
          uniqueData.set(top.src[key], top.tgt[key])
          stack.push({
            src: top.src[key],
            tgt: top.tgt[key]
          })
        }
      } else if (isArray(top.src[key])) {
        top.tgt[key] = []
        if (uniqueData.has(top.src[key])) {
          top.tgt[key] = uniqueData.get(top.src[key])
        } else {
          uniqueData.set(top.src[key], top.tgt[key])
          for (const val of top.src[key]) {
            top.tgt[key].push(deepClone(val))
          }
        }
      }
    }
  }
  return target
}

module.exports = {
  shallowClone,
  deepClone
}