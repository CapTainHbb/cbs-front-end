const delimiter: string = ' و ';
const zero: string = 'صفر';
const negative: string = 'منفی ';

const letters: string[][] = [
    ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'],
    ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده', 'بیست'],
    ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'],
    ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'],
    ['', ' هزار', ' میلیون', ' میلیارد', ' بیلیون', ' بیلیارد', ' تریلیون', ' تریلیارد', ' کوآدریلیون', ' کادریلیارد', ' کوینتیلیون', ' کوانتینیارد', ' سکستیلیون', ' سکستیلیارد', ' سپتیلیون', ' سپتیلیارد', ' اکتیلیون', ' اکتیلیارد', ' نانیلیون', ' نانیلیارد', ' دسیلیون', ' دسیلیارد']
];

const decimalSuffixes: string[] = [
    '', 'دهم', 'صدم', 'هزارم', 'ده‌هزارم', 'صد‌هزارم', 'میلیونوم', 'ده‌میلیونوم', 'صدمیلیونوم', 'میلیاردم', 'ده‌میلیاردم', 'صد‌‌میلیاردم'
];

const prepareNumber = (num: string | number): string[] => {
    let out = num.toString();

    if (out.length % 3 === 1) {
        out = `00${out}`;
    } else if (out.length % 3 === 2) {
        out = `0${out}`;
    }

    return out.replace(/\d{3}(?=\d)/g, '$&*').split('*');
};

const tinyNumToWord = (num: string): string => {
    const parsedInt = parseInt(num, 10);

    if (parsedInt === 0) return '';

    if (parsedInt < 10) return letters[0][parsedInt];
    if (parsedInt <= 20) return letters[1][parsedInt - 10];

    if (parsedInt < 100) {
        const one = parsedInt % 10;
        const ten = (parsedInt - one) / 10;

        return one > 0 ? `${letters[2][ten]}${delimiter}${letters[0][one]}` : letters[2][ten];
    }

    const one = parsedInt % 10;
    const hundreds = Math.floor(parsedInt / 100);
    const ten = Math.floor((parsedInt % 100) / 10);
    const out = [letters[3][hundreds]];
    const secondPart = ten * 10 + one;

    if (secondPart === 0) return out.join(delimiter);

    if (secondPart < 10) out.push(letters[0][secondPart]);
    else if (secondPart <= 20) out.push(letters[1][secondPart - 10]);
    else {
        out.push(letters[2][ten]);
        if (one > 0) out.push(letters[0][one]);
    }

    return out.join(delimiter);
};

const convertDecimalPart = (decimalPart: string): string => {
    decimalPart = decimalPart.replace(/0*$/, '');

    if (decimalPart === '') return '';

    if (decimalPart.length > 11) decimalPart = decimalPart.substr(0, 11);

    return ` ممیز ${num2persian(decimalPart)} ${decimalSuffixes[decimalPart.length]}`;
};

export const num2persian = (input: string | number | undefined): string => {
    if(input === undefined) {
        return zero;
    }

    let inputStr = input.toString().replace(/[^0-9.-]/g, '');
    let isNegative = false;
    const floatParse = parseFloat(inputStr);

    if (isNaN(floatParse)) return zero;

    if (floatParse === 0) return zero;

    if (floatParse < 0) {
        isNegative = true;
        inputStr = inputStr.replace(/-/g, '');
    }

    let decimalPart = '';
    let integerPart = inputStr;
    const pointIndex = inputStr.indexOf('.');

    if (pointIndex > -1) {
        integerPart = inputStr.substring(0, pointIndex);
        decimalPart = inputStr.substring(pointIndex + 1);
    }

    if (integerPart.length > 66) return 'خارج از محدوده';

    const slicedNumber = prepareNumber(integerPart);
    const out: string[] = [];

    for (let i = 0; i < slicedNumber.length; i++) {
        const converted = tinyNumToWord(slicedNumber[i]);
        if (converted !== '') {
            out.push(converted + letters[4][slicedNumber.length - (i + 1)]);
        }
    }

    if (decimalPart.length > 0) {
        decimalPart = convertDecimalPart(decimalPart);
    }

    return `${isNegative ? negative : ''}${out.join(delimiter)}${decimalPart}`;
};

// @ts-ignore
declare global {
    interface String {
        toPersianLetter(): string;
        num2persian(): string;
    }

    interface Number {
        toPersianLetter(): string;
        num2persian(): string;
    }
}

// @ts-ignore
// eslint-disable-next-line no-extend-native
String.prototype.toPersianLetter = function (): string {
    // @ts-ignore
    return num2persian(this);
};

// @ts-ignore
// eslint-disable-next-line no-extend-native
Number.prototype.toPersianLetter = function (): string {
    return num2persian(this.toString());
};

// @ts-ignore
// eslint-disable-next-line no-extend-native
String.prototype.num2persian = function (): string {
    // @ts-ignore
    return num2persian(this);
};

// @ts-ignore
// eslint-disable-next-line no-extend-native
Number.prototype.num2persian = function (): string {
    return num2persian(this.toString());
};
