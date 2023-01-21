import { TEN } from "./constants";

//----------------------------------------------------------------------------------------------------------------------
// A sample quiz
//----------------------------------------------------------------------------------------------------------------------

export const SAMPLE_QUIZ = {
    "title": "Sample quiz",
    "questions": [
        {
            "question": "Which continent has only one country?",
            "correct": 2,
            "answers": [
                "Africa",
                "Asia",
                "Australia",
                "South America"
            ]
        },
        {
            "question": "Which vegetable gives Popeye his strength?",
            "correct": 3,
            "answers": [
                "Asparagus",
                "Broccoli",
                "Lentils",
                "Spinach"
            ]
        },
        {
            "question": "The head of which country resides at number 10 Downing Street?",
            "correct": 3,
            "answers": [
                "Brazil",
                "Canada",
                "Nigeria",
                "United Kingdom"
            ]
        }
    ]
};

//----------------------------------------------------------------------------------------------------------------------
// Uplift a quiz to the latest format and validate that it's correct
//----------------------------------------------------------------------------------------------------------------------

export function upliftAndValidate(quiz, filename) {
    if (quiz && "object" === typeof quiz) {
        const upliftedQuiz = upliftQuiz(quiz, (filename || "Quiz").replace(/\.json$/i, ""));
        validateQuiz(upliftedQuiz);
        return upliftedQuiz;
    } else {
        return fail();
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Uplift the quiz to the latest format
//----------------------------------------------------------------------------------------------------------------------

export function upliftQuiz(quiz, filename) {
    if (Array.isArray(quiz)) {
        quiz = { title: filename, questions: quiz };
    }
    quiz.title = quiz.title.trim();
    quiz.title ||= filename;
    quiz.questions ||= [];
    return quiz;
}

//----------------------------------------------------------------------------------------------------------------------
// Validate a quiz
//----------------------------------------------------------------------------------------------------------------------

export function validateQuiz(quiz) {
    validateTitle(quiz);
    validateQuestions(quiz);
};

//----------------------------------------------------------------------------------------------------------------------
// Validate the quiz title
//----------------------------------------------------------------------------------------------------------------------

function validateTitle(quiz) {
    if (!Object.prototype.hasOwnProperty.call(quiz, "title")) {
        fail("The quiz has no title");
    }
    if ("string" !== typeof quiz.title) {
        fail(`The title has a wrong data type (${typeof quiz.title} instead of string)`);
    }
    if (!quiz.title.trim()) {
        fail("The title is empty");
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Validate the questions array
//----------------------------------------------------------------------------------------------------------------------

function validateQuestions(quiz) {
    if (!Object.prototype.hasOwnProperty.call(quiz, "questions")) {
        fail("The quiz has no questions");
    }
    if (!Array.isArray(quiz.questions)) {
        fail("The questions are not an array");
    }
    if (!quiz.questions.length) {
        fail("The quiz does not contain any questions");
    }
    quiz.questions.forEach(validateQuestion);
}

//----------------------------------------------------------------------------------------------------------------------
// Validate a single question
//----------------------------------------------------------------------------------------------------------------------

function validateQuestion(question, index) {
    const questionNumber = toOrdinal(index);

    if (!question || "object" !== typeof question || Array.isArray(question)) {
        fail(`The ${questionNumber} question has an invalid format (it's not an object)`);
    }
    const questionReference = "string" === typeof question.question && question.question.trim()
        ? `question "${question.question.trim()}"`
        : `the ${questionNumber} question`;
    if ("string" !== typeof question.question || !question.question.trim()) {
        fail(`${capitalize(questionReference)} has no question text`);
    }
    validateAnswers(questionReference, question.answers);
    validateCorrect(questionReference, question);
}

//----------------------------------------------------------------------------------------------------------------------
// Validate answers
//----------------------------------------------------------------------------------------------------------------------

function validateAnswers(questionReference, answers) {
    if (!answers || (Array.isArray(answers) && !answers.length)) {
        fail(`${capitalize(questionReference)} has no answers`);
    }
    if (!Array.isArray(answers)) {
        fail(`The answers for ${questionReference} have an invalid type (${typeof answers} instead of array)`);
    }
    answers.forEach((answer, index) => {
        const answerReference = "string" === typeof answer && answer.trim()
            ? `Answer "${answer.trim()}" answer for ${questionReference}`
            : `The ${toOrdinal(index)} answer for ${questionReference}`;
        if ("string" !== typeof answer) {
            fail(`${answerReference} has an invalid type (${typeof answer} instead of string)`);
        }
        if (!answer.trim()) {
            fail(`${answerReference} is empty`);
        }
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Validate the correct answer pointer
//----------------------------------------------------------------------------------------------------------------------

function validateCorrect(questionReference, question) {
    if (!Object.prototype.hasOwnProperty.call(question, "correct")) {
        fail(`${capitalize(questionReference)} lacks the "correct" property`);
    }
    if ("number" !== typeof question.correct) {
        fail([
            `The "correct" property of ${questionReference} has an invalid type`,
            `(${typeof question.correct} instead of number)`
        ].join(" "));
    }
    if (question.correct < 0) {
        fail(`The "correct" property of ${questionReference} is less than zero (value: ${question.correct})`);
    }
    if (question.answers.length < question.correct) {
        fail([
            `${capitalize(questionReference)} has only ${question.answers.length} answers`,
            ` but marks the ${toOrdinal(question.correct)} as the correct one`
        ].join(" "));
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Throw an exception with the given message
//----------------------------------------------------------------------------------------------------------------------

function fail(message) {
    throw new Error(message);
}

//----------------------------------------------------------------------------------------------------------------------
// Format an ordinal number
//----------------------------------------------------------------------------------------------------------------------

function toOrdinal(index) {
    const number = index + 1;
    const suffix = ["th", "st", "nd", "rd"][number % TEN] || "th";
    return `${number}${suffix}`;
}

//----------------------------------------------------------------------------------------------------------------------
// Capitalize the first letter
//----------------------------------------------------------------------------------------------------------------------

function capitalize(text) {
    return text.trim().length ? text.trim().substr(0, 1).toUpperCase() + text.trim().substr(1) : text;
}
