/**
 * @description
 * Заглушка для значения, которое проставят позже. В рантайме это просто
 * `null`, но в типах она выдает себя за `T` — чтобы не тащить `| null` через
 * весь код там, где значение гарантированно появится до первого чтения.
 *
 * Это осознанная ложь системе типов: если значение так и не проставят, до
 * `null` доберется тот, кто будет читать.
 *
 * @template [T=unknown]
 * @returns {T}
 *
 * @example
 *
 * class Service {
 *   client = late();
 *
 *   async start() {
 *     this.client = await connect();
 *   }
 * }
 */
const late = () => null;

module.exports = { late };
