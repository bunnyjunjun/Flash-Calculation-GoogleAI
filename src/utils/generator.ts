import { CalculationConfig, CaseNumber, DigitsCount } from '../types';

export function getDigitRange(digits: DigitsCount): { min: number; max: number } {
  if (digits === 1) return { min: 1, max: 9 };
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return { min, max };
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateCalculationSequence(config: CalculationConfig): CaseNumber[] {
  const { digits, casesCount, operationMode } = config;
  const { min, max } = getDigitRange(digits);

  const sequence: CaseNumber[] = [];
  let currentTotal = 0;

  for (let i = 0; i < casesCount; i++) {
    const isFirst = i === 0;
    let isNegative = false;

    if (!isFirst && operationMode === 'addition_subtraction') {
      // In mental arithmetic / Flash Anzan, running total must remain >= 0
      // We can only subtract if currentTotal > min
      if (currentTotal > min) {
        // Decide if this should be a subtraction (approx 40% chance, or higher if runningTotal has built up a lot)
        const subtractChance = currentTotal > max * 2 ? 0.55 : 0.4;
        if (Math.random() < subtractChance) {
          isNegative = true;
        }
      }
    }

    let absoluteValue: number;

    if (isNegative) {
      // Must not subtract more than (currentTotal - 1) so total stays positive,
      // and must stay within [min, max] range.
      const allowedMax = Math.min(max, currentTotal - 1);
      if (allowedMax >= min) {
        absoluteValue = getRandomInt(min, allowedMax);
      } else {
        // Fallback to addition if not possible to generate valid negative
        isNegative = false;
        absoluteValue = getRandomInt(min, max);
      }
    } else {
      absoluteValue = getRandomInt(min, max);
    }

    const value = isNegative ? -absoluteValue : absoluteValue;
    currentTotal += value;

    sequence.push({
      index: i,
      value,
      isNegative,
      absoluteValue,
      displayString: isNegative ? `-${absoluteValue}` : `${absoluteValue}`,
      runningTotal: currentTotal,
    });
  }

  return sequence;
}

export function formatInterval(sec: number): string {
  return `${sec.toFixed(1)}s`;
}

export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString();
}
