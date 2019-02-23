const clone = require('./index.js')
const { expect } = require('chai')

describe('clone',
  describe('#shallowClone()', function () {
    const shallowClone = clone.shallowClone
    it('should clone symbol keyed property', function () {
      const key = Symbol('key')
      const source = {
        [key]: 'value'
      }
      const target = shallowClone(source)
      expect(target[key]).to.equal(source[key])
    })
    it('should clone enumerable property', function () {
      const key = 'key'
      const source = {}
      Object.defineProperty(source, key, {
        enumerable: false,
        value: 'value',
        writable: true,
        configurable: true
      })
      const target = shallowClone(source)
      expect(target[key]).to.equal(source[key])
    })
    it('should keep the value of property descriptor', function () {
      const key = 'key'
      const source = {}
      const sourcePropertyDescriptor = {
        enumerable: false,
        value: 'value',
        writable: true,
        configurable: true
      }
      Object.defineProperty(source, key, sourcePropertyDescriptor)
      const target = shallowClone(source)
      const targetPropertyDescriptor = Object.getOwnPropertyDescriptor(target, key)
      expect(targetPropertyDescriptor).to.deep.equal(sourcePropertyDescriptor)
    })
    it('should correctly deal with primitive values', function () {
      const sources = [1, 'string', Symbol('symbol'), null, undefined, false]
      sources.forEach(source => {
        const target = shallowClone(source)
        expect(target).to.equal(source)
      })
    })
    it('should correctly deal with array obj', function () {
      const source = [1, 2, 3, 4]
      const target = shallowClone(source)
      target.forEach((val, idx) => {
        expect(val).to.equal(source[idx])
      })
    })
  }),
  describe('#deepClone()', function () {
    const deepClone = clone.deepClone
    it('should clone with right structure', function () {
      const source = {
        a: {
          b: {
            c: 'c',
            d: 'd'
          }
        },
        e: {
          f: 'f'
        }
      }
      const target = deepClone(source)
      expect(target).to.deep.equal(source)
    })
    it('should avoid reference loss', function () {
      const ref = {
        x: 'x'
      }
      const source = {
        a: ref,
        b: ref
      }
      const target = deepClone(source)
      expect(target.a).to.equal(target.b)
    })
    it('should deal with a circular reference', function () {
      const a = {}
      const source = {
        ks: a
      }
      a.ka = source
      const target = deepClone(source)
      expect(target).to.equal(target.ks.ka)
    })
    it('should correctly deal with primitive values', function () {
      const sources = [1, 'string', Symbol('symbol'), null, undefined, false]
      sources.forEach(function (source) {
        const target = deepClone(source)
        expect(target).to.equal(source)
      })
    }),
    it('should correctly deal with array obj', function () {
      const source = [1, { a: 2 }, [3, 4], 4]
      const target = deepClone(source)
      target.forEach((val, idx) => {
        expect(val).to.deep.equal(source[idx])
      })
    })
  })
)