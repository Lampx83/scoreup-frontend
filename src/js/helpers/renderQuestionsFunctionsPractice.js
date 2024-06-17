import config from "../config";
import { initLogQuestion, commitLogQuestion, commitResult } from "./genLog";

export const initPaletteHTML = (sectionTitle, sectionQuestions, count = 0, multi) => {
  //! tạo palette chứa các câu hỏi
  const questionPaletteList = document.querySelector('.question-palette__list')

  const sectionQuestionsFlat = [];
  sectionQuestions.forEach((setQuestions) => {
    if (typeof setQuestions === "object" && setQuestions.questions)
      sectionQuestionsFlat.push(...setQuestions.questions);
    else sectionQuestionsFlat.push(setQuestions);
  });
  sectionQuestionsFlat.flat();
  sectionQuestionsFlat.forEach((question, index) => {
    const questionPaletteItem = document.createElement('div')
    questionPaletteItem.classList.add("question-palette__item", "btn-select-question", "question-palette__item--empty")
    questionPaletteItem.setAttribute('btn-data-question-id', question._id);
    questionPaletteItem.innerHTML = index + 1 + count;
    questionPaletteList.appendChild(questionPaletteItem);

    questionPaletteItem.addEventListener('click', () => {
      const questionId = questionPaletteItem.getAttribute('btn-data-question-id');
      const questionContainer = document.querySelector(`.question-main[data-question-id="${questionId}"]`);
      if (questionContainer) {
        questionContainer.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    });
  });
  //! end tạo palette chứa các câu hỏi
}

const renderComment = (e) => {
  const html = `
    <div class="comment-form">
      <div class="comment-avatar">
        <img src="https://avatar.iran.liara.run/public" />
      </div>
      <div class="comment-form__body">
        <div class="messageBox">
          <input
            required=""
            placeholder="Message..."
            type="text"
            id="messageInput"
          />
          <div class="fileUploadWrapper">
            <label for="file">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 337 337"
              >
                <circle
                  stroke-width="20"
                  stroke="#6c6c6c"
                  fill="none"
                  r="158.5"
                  cy="168.5"
                  cx="168.5"
                ></circle>
                <path
                  stroke-linecap="round"
                  stroke-width="25"
                  stroke="#6c6c6c"
                  d="M167.759 79V259"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-width="25"
                  stroke="#6c6c6c"
                  d="M79 167.138H259"
                ></path>
              </svg>
              <span class="tooltip">Add an image</span>
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
            />
          </div>
          <button id="sendButton">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 664 663"
            >
              <path
                fill="none"
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
              ></path>
              <path
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="33.67"
                stroke="#6c6c6c"
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <ul class="list" depth="0" style="--depth: 0">
        <li class="" style="--nested: true">
          <div class="comment">
            <div class="comment-avatar">
              <img src="https://avatar.iran.liara.run/public" />
            </div>
            <div class="">
              <!-- body -->
              <div class="comment__body">
                <p><strong>Ahmad Shadeed</strong></p>
                <p>
                  I like that, looks so cool and steady. This is the
                  way to build such a high performant element in
                  Javascript. I will keep doing it.
                </p>
              </div>
              <!-- actions -->
              <div class="comment__actions">
                <a href="#">Like</a>
                <a href="#">Reply</a>
              </div>
            </div>
          </div>
          <ul class="list" depth="1" style="--depth: 1">
            <li style="">
              <div class="comment">
                <div class="comment-avatar">
                  <img src="https://avatar.iran.liara.run/public" />
                </div>
                <div class="">
                  <!-- body -->
                  <div class="comment__body">
                    <p><strong>Ahmad Shadeed</strong></p>
                    <p>
                      I like that, looks so cool and steady. This is
                      the way to build such a high performant
                      element in Javascript. I will keep doing it.
                    </p>
                  </div>
                  <!-- actions -->
                  <div class="comment__actions">
                    <a href="#">Like</a>
                    <a href="#">Reply</a>
                    <a>2h</a>
                  </div>
                </div>
              </div>
            </li>
            <li style="--nested: true">
              <div class="comment">
                <div class="comment-avatar">
                  <img src="https://avatar.iran.liara.run/public" />
                </div>
                <div class="">
                  <!-- body -->
                  <div class="comment__body">
                    <p><strong>Ahmad Shadeed</strong></p>
                    <p>I like that, loo I will keep doing it.</p>
                  </div>
                  <!-- actions -->
                  <div class="comment__actions">
                    <a href="#">Like</a>
                    <a href="#">Reply</a>
                  </div>
                </div>
              </div>
              <ul class="list" depth="2" style="--depth: 2">
                <li style="">
                  <div class="comment">
                    <div class="comment-avatar">
                      <img
                        src="https://avatar.iran.liara.run/public"
                      />
                    </div>
                    <div class="">
                      <!-- body -->
                      <div class="comment__body">
                        <p><strong>Ahmad Shadeed</strong></p>
                        <p>
                          I like that, looks so cool and steady.
                          This is the way to build such a high
                          performant element in Javascript. I will
                          keep doing it.
                        </p>
                      </div>
                      <!-- actions -->
                      <div class="comment__actions">
                        <a href="#">Like</a>
                        <a href="#">Reply</a>
                      </div>
                    </div>
                  </div>
                </li>
                <li style="--nested: true">
                  <div class="comment">
                    <div class="comment-avatar">
                      <img
                        src="https://avatar.iran.liara.run/public"
                      />
                    </div>
                    <div class="">
                      <!-- body -->
                      <div class="comment__body">
                        <p><strong>Ahmad Shadeed</strong></p>
                        <p>
                          I like that, looks so cool and steady.
                          This is the way to build such a high
                          performant element in Javascript. I will
                          keep doing it.
                        </p>
                      </div>
                      <!-- actions -->
                      <div class="comment__actions">
                        <a href="#">Like</a>
                        <a href="#">Reply</a>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
            <li style="--nested: true">
              <div class="comment">
                <div class="comment-avatar">
                  <img src="https://avatar.iran.liara.run/public" />
                </div>
                <div class="">
                  <!-- body -->
                  <div class="comment__body">
                    <p><strong>Ahmad Shadeed</strong></p>
                    <p>
                      I like that, looks so cool and steady. This is
                      the way to build such a high performant
                      element in Javascript. I will keep doing it.
                    </p>
                  </div>
                  <!-- actions -->
                  <div class="comment__actions">
                    <a href="#">Like</a>
                    <a href="#">Reply</a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div class="comment">
            <div class="comment-avatar">
              <img src="https://avatar.iran.liara.run/public" />
            </div>
            <div class="">
              <!-- body -->
              <div class="comment__body">
                <p><strong>Ahmad Shadeed</strong></p>
                <p>
                  I like that, looks so cool and steady. This is the
                  way to build such a high performant element in
                  Javascript. I will keep doing it.
                </p>
              </div>
              <!-- actions -->
              <div class="comment__actions">
                <a href="#">Like</a>
                <a href="#">Reply</a>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="comment">
            <div class="comment-avatar">
              <img src="https://avatar.iran.liara.run/public" />
            </div>
            <div class="">
              <!-- body -->
              <div class="comment__body">
                <p><strong>Ahmad Shadeed</strong></p>
                <p>
                  I like that, looks so cool and steady. This is the
                  way to build such a high performant element in
                  Javascript. I will keep doing it.
                </p>
              </div>
              <!-- actions -->
              <div class="comment__actions">
                <a href="#">Like</a>
                <a href="#">Reply</a>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `
  let target = e.target
  if (target.getAttribute('data-question-id') === null) {
    target = target.closest('.btn-comment')
  }
  const commentsDiv = document.querySelector(`.question-main__comments[data-question-id="${target.getAttribute('data-question-id')}"]`)

  if (commentsDiv.classList.contains('active')) {
    commentsDiv.classList.remove('active')
    return
  }

  commentsDiv.classList.add('active')
  commentsDiv.innerHTML = html
}

const renderSingleQuestion = (index, question, mode) => {
  const questionContainer = document.createElement('div')
  questionContainer.classList.add('question-container', 'mb-4')
  questionContainer.setAttribute('data-question-id', question._id)

  //! tạo div audio
  if (question.properties.audio.rich_text[0]?.plain_text) {
    const questionContainerAudio = document.createElement('div')
    questionContainerAudio.classList.add('question-container__audio')
    questionContainerAudio.innerHTML = `
      <audio controls>
        <source src="${config.mediaUrl + question.properties.audio.rich_text[0]?.plain_text}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    `
    questionContainer.appendChild(questionContainerAudio)
  }
  //!end tạo div audio
  
  const questionMain = document.createElement('div')
  questionMain.classList.add('question-main')
  questionMain.setAttribute('data-question-id', question._id)
  questionMain.setAttribute('data-question-index', index)
  if (question.properties.hint.rich_text?.length > 0 && question.properties.hint.rich_text[0].plain_text.length > 0 && question.properties.hint.rich_text[0].plain_text.split(' ').join('') !== '') {
    questionMain.setAttribute('data-question-hint', question.properties.hint.rich_text[0].plain_text)
  } else {
    questionMain.setAttribute('data-question-hint', 'Sorry, no explain for this question')
  }

  //! tạo button hint
  const questionHint = document.createElement('div')
  questionHint.classList.add('question-hint', 'btn', 'btn-primary', 'btn-hint', 'd-none')
  if (!(mode === "practice")) {
    questionHint.classList.add('d-none');
  }
  questionHint.setAttribute('data-bs-toggle', 'modal')
  questionHint.setAttribute('data-bs-target', '#hint-modal')
  questionHint.innerHTML = `<i class="fa-solid fa-lightbulb"></i> Key`
  questionHint.addEventListener('click', handleHintClick)
  questionMain.appendChild(questionHint)
  //! end tạo button hint

  //! tạo div content
  const questionMainContent = document.createElement('div')
  questionMainContent.classList.add('question-main__content')
  questionMainContent.innerHTML = `
    <h6 class="question-main__title editor">
      <strong>Question ${index}:</strong> ${question.properties.question.rich_text[0].plain_text}
    </h6>
    <div class="question-main__img text-center">
      <img src="${config.mediaUrl + question.properties.img.rich_text[0]?.plain_text}" alt="">
    </div>
  `
  questionMain.appendChild(questionMainContent)
  //! end tạo div content

  //! tạo div options
  const questionMainOptions = document.createElement('div')
  questionMainOptions.classList.add('question-main__options', 'editor')
  questionMainOptions.setAttribute('data-question-id', question._id)
  questionMainOptions.setAttribute('data-correct-option', question.properties.correct.rich_text[0].plain_text)
  let optionsHtml = [];
  for (const key in question.properties) {
    if (/^[a-zA-Z]$/.test(key) && question.properties[key].rich_text?.length > 0) {
      optionsHtml.push(`
      <div class="question-main__option" data-option-id="${key}">
        <label for="${question._id + '_' + key}">
          <input type="radio" name="${question._id}" id="${question._id + '_' + key}" value="${key}">
          ${question.properties[key].rich_text[0].plain_text}
        </label>
      </div>
      `)
    }
  }
  optionsHtml.sort();
  questionMainOptions.innerHTML = optionsHtml.join('')
  handleSelectOption(questionMainOptions, question._id, question.properties.correct.rich_text[0].plain_text)
  questionMain.appendChild(questionMainOptions)

  //! tao div actions
  const questionMainActions = document.createElement('div')
  questionMainActions.classList.add('question-main__actions', 'row')
  questionMainActions.innerHTML = `
    <div class="col-6">
      <button
        class="btn-comment"
        type="button"
        data-question-id="${question._id}"
      >
        <span class="IconContainer">
          <svg fill="white" viewBox="0 0 512 512" height="1em">
            <path
              d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"
            ></path>
          </svg>
        </span>
        <p class="text m-0">
          Comments
          <span class="btn-comment__count">(5)</span>
        </p>
      </button>
    </div>
    <div class="col-6 text-end">
      <button class="btn btn-mastered">Mastered</button>
      <button class="btn btn-not-sure">Not sure</button>
    </div>
  `

  const commentBtn = questionMainActions.querySelector('.btn-comment')
  commentBtn.addEventListener('click', renderComment)

  const notSureBtn = questionMainActions.querySelector('.btn-not-sure')
  notSureBtn.addEventListener('click', () => {
    const questionPaletteItem = document.querySelector(`.question-palette__item[btn-data-question-id='${question._id}']`)
    questionPaletteItem.classList.toggle('question-palette__item--flagged')
  })

  questionMain.appendChild(questionMainActions)

  const questionMainComments = document.createElement('div')
  questionMainComments.classList.add('question-main__comments')
  questionMainComments.setAttribute('data-question-id', question._id)
  questionMain.appendChild(questionMainComments)
  //! end tao div actions

  questionContainer.appendChild(questionMain)
  //! end tạo div options

  return questionContainer
}

const renderMultiQuestions = (count = 0, questions, mode) => {
  const questionContainer = document.createElement('div')
  questionContainer.classList.add('question-container', 'mb-4')
  let questionIds = [];
  let questionIndex = [];
  //! tạo div audio
  if (questions[0].properties.audio.rich_text[0]?.plain_text) {
    const questionContainerAudio = document.createElement('div')
    questionContainerAudio.classList.add('question-container__audio')
    questionContainerAudio.innerHTML = `
      <audio controls>
        <source src="${config.mediaUrl + questions[0].properties.audio.rich_text[0]?.plain_text}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    `
    questionContainer.appendChild(questionContainerAudio)
  }
  //!end tạo div audio

  //! tạo div question context
  if (questions[0].properties.context.rich_text?.length > 0) {
    // console.log(questions[0].properties.context.rich_text[0].plain_text)
    // questions[0].properties.context.rich_text[0].plain_text = questions[0].properties.context.rich_text[0].plain_text.replaceAll("src='", "src='" + config.mediaUrl)
    const context = questions[0].properties.context.rich_text[0].plain_text.replaceAll("src='", "src='" + config.mediaUrl)
    const questionContainerContext = document.createElement('div')
    questionContainerContext.classList.add('question-container__context')
    questionContainerContext.innerHTML = `
      <div class="question-container__context-content editor">
        ${context}
      </div>
    `
    questionContainer.appendChild(questionContainerContext)
  }
  //! end tạo div question context

  const questionMainContainer = document.createElement('div')
  questionMainContainer.classList.add('question-main-container')
  questions.forEach((question) => {
    count += 1;
    const questionMain = document.createElement('div')
    questionMain.classList.add('question-main', 'mb-4')
    questionMain.setAttribute('data-question-id', question._id)
    questionMain.setAttribute('data-question-index', count)
    questionIndex.push(count);
    questionIds.push(question._id);

    if (question.properties.hint.rich_text?.length > 0 && question.properties.hint.rich_text[0].plain_text.length > 0 && question.properties.hint.rich_text[0].plain_text.split(' ').join('') !== '') {
      questionMain.setAttribute('data-question-hint', question.properties.hint.rich_text[0].plain_text)
    } else {
      questionMain.setAttribute('data-question-hint', 'Sorry, no explain for this question')
    }

    //! tạo button hint
    const questionHint = document.createElement('div')
    questionHint.classList.add('question-hint', 'btn', 'btn-primary', 'btn-hint', 'd-none')
    if (!(mode === "practice")) {
      questionHint.classList.add('d-none');
    };
    questionHint.setAttribute('data-bs-toggle', 'modal')
    questionHint.setAttribute('data-bs-target', '#hint-modal')
    questionHint.innerHTML = `<i class="fa-solid fa-lightbulb"></i> Key`
    questionHint.addEventListener('click', handleHintClick)
    questionMain.appendChild(questionHint)
    //! end tạo button hint
  
    //! tạo div content
    const questionMainContent = document.createElement('div')
    questionMainContent.classList.add('question-main__content')
    questionMainContent.innerHTML = `
      <h6 class="question-main__title editor">
        <strong>Question ${count}:</strong> ${question.properties.question.rich_text[0].plain_text}
      </h6>
      <div class="question-main__img text-center">
        <img src="${config.mediaUrl + question.properties.img.rich_text[0]?.plain_text}" alt="">
      </div>
    `
    questionMain.appendChild(questionMainContent)
    //! end tạo div content
  
    //! tạo div options
    const questionMainOptions = document.createElement('div')
    questionMainOptions.classList.add('question-main__options', 'editor');
    questionMainOptions.setAttribute('data-question-id', question._id)
    questionMainOptions.setAttribute('data-correct-option', question.properties.correct.rich_text[0].plain_text)
    let optionsHtml = [];
    for (const key in question.properties) {
      if (/^[a-zA-Z]$/.test(key) && question.properties[key].rich_text?.length > 0) {
        optionsHtml.push(`
        <div class="question-main__option" data-option-id="${key}">
          <label for="${question._id + '_' + key}">
            <input type="radio" name="${question._id}" id="${question._id + '_' + key}" value="${key}">
            ${question.properties[key].rich_text[0].plain_text}
          </label>
        </div>
        `)
      }
    }
    optionsHtml.sort();
    questionMainOptions.innerHTML = optionsHtml.join('')
    handleSelectOption(questionMainOptions, question._id, question.properties.correct.rich_text[0].plain_text)
    questionMain.appendChild(questionMainOptions)

    //! tao div actions
    const questionMainActions = document.createElement('div')
    questionMainActions.classList.add('question-main__actions', 'row')
    questionMainActions.innerHTML = `
      <div class="col-6">
        <button
          class="btn-comment"
          type="button"
          data-question-id="${question._id}"
        >
          <span class="IconContainer">
            <svg fill="white" viewBox="0 0 512 512" height="1em">
              <path
                d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"
              ></path>
            </svg>
          </span>
          <p class="text m-0">
            Comments
            <span class="btn-comment__count">(5)</span>
          </p>
        </button>
      </div>
      <div class="col-6 text-end">
        <button class="btn btn-mastered">Mastered</button>
        <button class="btn btn-not-sure">Not sure</button>
      </div>
     `

    const commentBtn = questionMainActions.querySelector('.btn-comment')
    commentBtn.addEventListener('click', renderComment)

    const notSureBtn = questionMainActions.querySelector('.btn-not-sure')
    notSureBtn.addEventListener('click', () => {
      const questionPaletteItem = document.querySelector(`.question-palette__item[btn-data-question-id='${question._id}']`)
      questionPaletteItem.classList.toggle('question-palette__item--flagged')
    })

    questionMain.appendChild(questionMainActions)

    const questionMainComments = document.createElement('div')
    questionMainComments.classList.add('question-main__comments')
    questionMainComments.setAttribute('data-question-id', question._id)
    questionMain.appendChild(questionMainComments)

    questionMainContainer.appendChild(questionMain)
    //! end tạo div options
  });

  //! chú thích các câu hỏi có trong set
  const questionContainerNote = document.createElement('div')
  questionContainerNote.classList.add('question-container__note')
  if (questionIndex.length > 1) {
    questionContainerNote.innerHTML = `
      <p>Questions ${questionIndex[0] + " to " + questionIndex[questionIndex.length - 1]}</p>
    `
  }
  questionContainer.appendChild(questionContainerNote)
  //! end chú thích các câu hỏi có trong set

  questionContainer.appendChild(questionMainContainer)
  questionContainer.setAttribute('data-question-id', questionIds.join(','))

  return questionContainer
}

//! show hint
export const handleHintClick = (e) => {
  const hint = e.target.closest('.question-main').getAttribute('data-question-hint')
  const hintModalContent = document.querySelector('.content-hint')
  hintModalContent.innerHTML = hint
}
//! end show hint

export const initQuestionHTML = (sectionTitle, sectionQuestions, count = 0, mode, multi) => {
  const questionsDiv = document.querySelector('.questions')
  const questionsNavigation = document.querySelector('.questions__navigation')

  //! render câu hỏi
  if (multi) {
    sectionQuestions.forEach((setQuestions) => {
      questionsDiv.insertBefore(renderMultiQuestions(count, setQuestions.questions, mode), questionsNavigation)
      count += setQuestions.questions.length;
    });
  } else {
    sectionQuestions.forEach((question, index) => {
      count += 1;
      questionsDiv.insertBefore(renderSingleQuestion(count, question, mode), questionsNavigation)
    });
  }
  //!end render câu hỏi
}

const handleSelectOption = (container, questionId, correctOption) => {
  const inputs = container.querySelectorAll('input');
  inputs.forEach((input) => {
    input.addEventListener('change', (e) => {
      inputs.forEach((input) => {
        input.disabled = true;
      });

      const selectedOption = input.closest('.question-main__option');
      const selectedValue = selectedOption.getAttribute('data-option-id');
      const questionPaletteItem = document.querySelector(`.question-palette__item[btn-data-question-id='${questionId}']`);
      if (selectedValue === correctOption) {
        selectedOption.classList.add('question-main__option--correct');
        questionPaletteItem.classList.add('question-palette__item--correct');
      } else {
        selectedOption.classList.add('question-main__option--incorrect');
        questionPaletteItem.classList.add('question-palette__item--incorrect');

        const correctOptionElement = container.querySelector(`.question-main__option[data-option-id="${correctOption}"]`);
        correctOptionElement.classList.add('question-main__option--correct');
      }

      // show hint
      const keyBtn = container.closest('.question-main').querySelector('.btn-hint');
      keyBtn.classList.remove('d-none');
    });
  });
}