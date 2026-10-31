# Changelog

## 3.1.0

### Добавлено

- `sha1`.
- `prefixedId`: id вида `usr_1...` с префиксом, временем создания и опциональным владельцем. Сортируется по секунде создания.

### Изменено

- `Queue` и `Deque` хранят элементы в растущем кольцевом буфере вместо связного списка: в 2-5 раз быстрее, без объекта на каждый элемент. Память после пика не освобождается до `clear()`. Если извлекать элементы во время обхода `for...of`, обход пропускает элементы, как у массива.

## 3.0.0

### Удалено

- `Time` разбит на функции: `Time.unixtime` -> `unixtime()`, `Time.toUnixtime` -> `toUnixtime`, `Time.makeTimer` -> `makeTimer`. Вместо `Time.milliseconds` и `Time.date` используйте `Date.now()` и `new Date()`.
- `shieldingSymbols`.

### Исправлено

- `OkResult#unwrapOr` возвращал значение по умолчанию вместо своего.
- Именованный импорт из ESM (`import { chunk } from "@pawka/js-utils"`) падал с `SyntaxError`.

### Добавлено

- `firstValue`, `toUpper`, `capitalize`, `hasOwn`, `md5`, `sha256`, `late`.
- `delay`, `timeout`, `timeoutify`, `throttle`, `debounce`. Таймауты реджектят `Error` с `code: "ETIMEOUT"`.
- `LinkedList`, `ListNode`, `Queue`, `Stack`, `Deque`, `CircularBuffer`.
- `Result.from`, `Result.fromAsync` и методы `unwrapOrElse`, `map`, `mapErr`, `flatMap`, `mapAsync`, `flatMapAsync`, `match`, `tap`, `tapErr`.
