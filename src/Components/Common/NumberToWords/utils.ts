import {num2persian} from "./num2persian";
import num2english from "./num2english";


export default function num2words(num: number, lang: string): string {
    switch (lang) {
        case 'fa':  // Persian language
            return num2persian(num);
        case 'en':  // English language
            return num2english(num);
        // Future cases for new languages can be added here
        default:
            return num2english(num);
    }
}