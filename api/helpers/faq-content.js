const NUM_QUESTIONS = 11;

// example of faq translation keys format
/*
{
  "faq.question.6": "How do I create content?",
  "faq.answer.6": "Once you are signed in, you can create content by clicking the “quick submit” button from the main menu and choosing the type of article you would like to create.",
}
*/

// create array with 11 items
let faqContent = Array.apply(null, Array(NUM_QUESTIONS));

// map question/answer keys to array items
faqContent = faqContent.map((el, i) => {
  const index = i + 1;
  return {
    questionKey: `faq.question.${index}`,
    answerKey: `faq.answer.${index}`,
  };
});

module.exports = faqContent;
