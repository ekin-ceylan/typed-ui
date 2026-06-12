import LightComponentBase from '../base/light-component-base.js';

/**
 * LightComponentBase class constructor type.
 * Static members such as `properties` are preserved through this type.
 * @typedef {typeof LightComponentBase} LightComponentBaseConstructor
 */

/**
 * A generic type that represents any class constructor.
 * @template T
 * @typedef {new (...args: any[]) => T} Constructor
 */

/**
 * @template {object} TAdded
 * @typedef {(Base: LightComponentBaseConstructor) => LightComponentBaseConstructor & Constructor<TAdded>} LightMixin
 */

/**
 * @template {object} M1
 * @overload
 * @param {LightMixin<M1>} m1
 * @returns {LightComponentBaseConstructor & Constructor<M1>}
 */

/**
 * @template {object} M1
 * @template {object} M2
 * @overload
 * @param {LightMixin<M1>} m1
 * @param {LightMixin<M2>} m2
 * @returns {LightComponentBaseConstructor & Constructor<M1 & M2>}
 */

/**
 * @template {object} M1
 * @template {object} M2
 * @template {object} M3
 * @overload
 * @param {LightMixin<M1>} m1
 * @param {LightMixin<M2>} m2
 * @param {LightMixin<M3>} m3
 * @returns {LightComponentBaseConstructor & Constructor<M1 & M2 & M3>}
 */

/**
 * Applies one or more mixins to the `LightComponentBase` class. This function allows you to create a new class that combines the functionality of multiple mixins in a clean and composable way, while ensuring that the resulting class is compatible with the `LightComponentBase` class.
 * @param {...LightMixin<object>} mixins
 * @returns {LightComponentBaseConstructor & Constructor<LightComponentBase & object>}
 */
export function lightMixins(...mixins) {
    return mixins.reduce((Base, mixin) => mixin(Base), LightComponentBase);
}

/**
 * Generic mixin type.
 *
 * `TBase` static tarafı taşır.
 * `TAdded` mixin'in instance tarafına eklediği API'yi temsil eder.
 *
 * @template {Constructor<any>} TBase
 * @template {object} TAdded
 * @typedef {(Base: TBase) => TBase & Constructor<InstanceType<TBase> & TAdded>} ClassMixin
 */

/**
 * @template {Constructor<any>} TBase
 * @template {object} M1
 * @overload
 * @param {TBase} BaseClass
 * @param {ClassMixin<TBase, M1>} m1
 * @returns {TBase & Constructor<InstanceType<TBase> & M1>}
 */

/**
 * @template {Constructor<any>} TBase
 * @template {object} M1
 * @template {object} M2
 * @overload
 * @param {TBase} BaseClass
 * @param {ClassMixin<TBase, M1>} m1
 * @param {ClassMixin<TBase, M2>} m2
 * @returns {TBase & Constructor<InstanceType<TBase> & M2 & M1>}
 */

/**
 * @template {Constructor<any>} TBase
 * @template {object} M1
 * @template {object} M2
 * @template {object} M3
 * @overload
 * @param {TBase} BaseClass
 * @param {ClassMixin<TBase, M1>} m1
 * @param {ClassMixin<TBase, M2>} m2
 * @param {ClassMixin<TBase, M3>} m3
 * @returns {TBase & Constructor<InstanceType<TBase> & M3 & M2 & M1>}
 */

/**
 * Applies one or more mixins to the given base class.
 * @param {Constructor<any>} BaseClass
 * @param {...ClassMixin<Constructor<any>, object>} mixins
 * @returns {Constructor<any>}
 */
export function mixins(BaseClass, ...mixins) {
    return mixins.reduceRight((Base, mixin) => mixin(Base), BaseClass);
}
