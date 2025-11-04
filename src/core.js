/**
 * Напишите функцию, которая проверяет, является ли число целым используя побитовые операторы
 * @param {*} n
 */
function isInteger(n) {
    // Побитовые операторы преобразуют число к 32-битному целому
    return (n | 0) === n;
}

/**
 * Напишите функцию, которая возвращает массив четных чисел от 2 до 20 включительно
 */
function even() {
    const result = [];
    for (let i = 2; i <= 20; i += 2) {
        result.push(i);
    }
    return result;
}

/**
 * Напишите функцию, считающую сумму чисел до заданного используя цикл
 * @param {*} n
 */
function sumTo(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

/**
 * Напишите функцию, считающую сумму чисел до заданного используя рекурсию
 * @param {*} n
 */
function recSumTo(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return n + recSumTo(n - 1);
}

/**
 * Напишите функцию, считающую факториал заданного числа
 * @param {*} n
 */
function factorial(n) {
    if (n < 0) return undefined;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

/**
 * Напишите функцию, которая определяет, является ли число двойкой, возведенной в степень
 * @param {*} n
 */
function isBinary(n) {
    if (n <= 0) return false;
    // Число является степенью двойки, если (n & (n - 1)) === 0
    return (n & (n - 1)) === 0;
}

/**
 * Напишите функцию, которая находит N-е число Фибоначчи
 * @param {*} n
 */
function fibonacci(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

/** Напишите функцию, которая принимает начальное значение и функцию операции
 * и возвращает функцию - выполняющую эту операцию.
 * Если функция операции (operatorFn) не задана - по умолчанию всегда
 * возвращается начальное значение (initialValue)
 */
function getOperationFn(initialValue, operatorFn) {
    let storedValue = initialValue;
    
    return function(newValue) {
        if (!operatorFn) {
            return storedValue;
        }
        storedValue = operatorFn(storedValue, newValue);
        return storedValue;
    };
}

/**
 * Напишите функцию создания генератора арифметической последовательности.
 */
function sequence(start = 0, step = 1) {
    let currentValue = start;
    let callCount = 0;
    
    return function generator() {
        if (callCount === 0) {
            callCount++;
            return currentValue;
        }
        currentValue += step;
        return currentValue;
    };
}

/**
 * Напишите функцию deepEqual, которая принимает два значения
 * и возвращает true только в том случае, если они имеют одинаковое значение
 * или являются объектами с одинаковыми свойствами
 */
function deepEqual(a, b) {
  // Быстрый путь: строгое равенство с учётом NaN и -0 (Object.is)
  if (Object.is(a, b)) return true;

  // Если типы разные или одно из значений не объект — уже не равны
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  // Внутренний рекурсивный сравниватель с защитой от циклов
  const seen = new WeakMap();
  function eq(x, y) {
    if (Object.is(x, y)) return true;
    if (typeof x !== 'object' || x === null || typeof y !== 'object' || y === null) {
      return false;
    }

    // Циклические ссылки: если уже сравнивали эту пару — считаем равными
    let inner = seen.get(x);
    if (inner && inner.has(y)) return true;
    if (!inner) {
      inner = new WeakSet();
      seen.set(x, inner);
    }
    inner.add(y);

    // Массивы/не массивы должны совпадать
    const xIsArr = Array.isArray(x);
    const yIsArr = Array.isArray(y);
    if (xIsArr !== yIsArr) return false;

    const keysX = Object.keys(x);
    const keysY = Object.keys(y);
    if (keysX.length !== keysY.length) return false;

    // Проверяем наличие одинаковых ключей
    for (const k of keysX) {
      if (!keysY.includes(k)) return false;
    }

    // Рекурсивно сравниваем значения по ключам
    for (const k of keysX) {
      if (!eq(x[k], y[k])) return false;
    }
    return true;
  }

  return eq(a, b);
}

// Вспомогательная функция для проверки является ли значение объектом
function isObject(object) {
    return object != null && typeof object === 'object';
}

module.exports = {
    isInteger,
    even,
    sumTo,
    recSumTo,
    factorial,
    isBinary,
    fibonacci,
    getOperationFn,
    sequence,
    deepEqual,
};