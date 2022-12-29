export const returnLetter = (number) => {
    switch(parseInt(number)) {
        case 0: return 'A';
        case 1: return 'B';
        case 2: return 'C';
        case 3: return 'D';
        default: return '';
    }
};

export const calculateTime = (seconds, hideMinutes) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds - min * 60;
    if(hideMinutes && min === 0) {
        return addLeadingZero(sec);
    }else{
        return min + ":" + addLeadingZero(sec);
    }
};

export const addLeadingZero = (number) => {
    if(number < 10) return "0" + number; else return number;
};

export const validateJson = (json) => {
    let result = true;
    if(Array.isArray(json)) {
        json.forEach(question => {
            if(typeof question === 'object' && question !== null) {
                if(question.hasOwnProperty('question') && question.hasOwnProperty('correct') && question.hasOwnProperty('answers')) {
                    if(!(Array.isArray(question.answers) && question.answers.length === 4)) result = false;
                }else{
                    result = false;
                }
            }else{
                result = false;
            }
        });
    }else{
        result = false;
    }
    return result;
};