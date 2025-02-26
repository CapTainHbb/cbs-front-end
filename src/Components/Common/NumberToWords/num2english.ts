export default function num2english(num: number): string {
    if (num === 0) return "zero";

    const belowTwenty: string[] = [
        "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
        "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
    ];

    const tens: string[] = [
        "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
    ];

    const thousands: string[] = ["", "thousand", "million", "billion"];

    function helper(n: number): string {
        if (n === 0) return "";
        else if (n < 20) return belowTwenty[n - 1] + " ";
        else if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
        else return belowTwenty[Math.floor(n / 100) - 1] + " hundred " + helper(n % 100);
    }

    let integerPart = Math.floor(num); // Get integer part
    let decimalPart: any = num - integerPart; // Get decimal part

    let word = "";
    let i = 0;

    // Convert integer part
    while (integerPart > 0) {
        if (integerPart % 1000 !== 0) {
            word = helper(integerPart % 1000) + thousands[i] + " " + word;
        }
        integerPart = Math.floor(integerPart / 1000);
        i++;
    }

    // Convert decimal part if it's not zero
    if (decimalPart > 0) {
        word = word.trim() + " point ";
        decimalPart = decimalPart.toFixed(2).split('.')[1]; // Get decimal part up to 2 digits
        for (let digit of decimalPart) {
            word += belowTwenty[parseInt(digit) - 1] + " ";
        }
    }

    return word.trim();
}
