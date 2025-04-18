// script.js

// المتغيرات العامة
let currentLesson = 0;
const totalLessons = 5;
let selectedOptions = { 1: null, 2: null, 3: null, 4: null, 5: null };
let currentSection = "content"; // تتبع القسم الحالي: 'content' (شرح) أو 'quiz' (اختبار)

// دالة لإظهار صفحة معينة وإخفاء الباقي
function showPage(pageId, section = "content") {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  const page = document.getElementById(pageId);
  page.classList.add("active");

  // إظهار/إخفاء أقسام الشرح والاختبار
  currentSection = section;
  const lessonNumber = pageId.includes("lesson-page-")
    ? parseInt(pageId.split("-")[2])
    : 0;
  if (lessonNumber > 0) {
    const contentSection = page.querySelector(".lesson-content");
    const quizSection = page.querySelector(".quiz-section");
    const lessonHeader = page.querySelector(".lesson-header");

    if (section === "content") {
      contentSection.style.display = "block";
      lessonHeader.style.display = "flex";
      quizSection.style.display = "none";
    } else {
      contentSection.style.display = "none";
      lessonHeader.style.display = "none";
      quizSection.style.display = "block";
    }
  }

  // تحديث حالة أزرار التنقل
  updateNavButtons();
}

// دالة لإضافة زر "الانتقال إلى الاختبار" ديناميكيًا
function addQuizButton(lessonNumber) {
  const contentSection = document.querySelector(
    `#lesson-page-${lessonNumber} .lesson-content`
  );
  const description = contentSection.querySelector(".lesson-description");
  let quizButton = contentSection.querySelector(".quiz-btn");

  // إضافة الزر فقط إذا لم يكن موجودًا
  if (!quizButton && description) {
    quizButton = document.createElement("button");
    quizButton.className = "btn btn-block quiz-btn";
    quizButton.textContent = "الانتقال إلى الاختبار";
    quizButton.style.marginTop = "20px"; // لإضافة مسافة بعد الوصف
    quizButton.onclick = () => showPage(`lesson-page-${lessonNumber}`, "quiz");
    description.insertAdjacentElement("afterend", quizButton); // وضع الزر بعد الوصف مباشرة
  }
}

// دالة لفتح درس معين
function openLesson(lessonNumber) {
  if (lessonNumber >= 1 && lessonNumber <= totalLessons) {
    currentLesson = lessonNumber;
    showPage(`lesson-page-${lessonNumber}`, "content");
    addQuizButton(lessonNumber); // إضافة الزر عند فتح الدرس
  }
}

// دالة لتحديد خيار في الاختبار
function selectOption(optionElement, lessonNumber) {
  const options = document.querySelectorAll(
    `#lesson-page-${lessonNumber} .option`
  );
  options.forEach((opt) => opt.classList.remove("selected"));

  optionElement.classList.add("selected");
  selectedOptions[lessonNumber] = optionElement;

  document.getElementById(`check-answer-${lessonNumber}`).style.display =
    "block";
}

// دالة للتحقق من إجابة الاختبار
function checkAnswer(lessonNumber) {
  const selectedOption = selectedOptions[lessonNumber];
  const feedbackElement = document.getElementById(`feedback-${lessonNumber}`);

  if (!selectedOption) {
    feedbackElement.textContent = "يرجى اختيار إجابة أولاً!";
    feedbackElement.className = "feedback error";
    return;
  }

  const isCorrect = selectedOption.getAttribute("data-correct") === "true";

  document.getElementById(`check-answer-${lessonNumber}`).style.display =
    "none";

  if (isCorrect) {
    selectedOption.classList.add("correct");
    feedbackElement.textContent = "إجابة صحيحة! أحسنت!";
    feedbackElement.className = "feedback success";

    if (lessonNumber < totalLessons) {
      document.getElementById("next-btn").style.display = "flex";
    } else {
      setTimeout(() => showPage("completion-page"), 1000);
    }
  } else {
    selectedOption.classList.add("incorrect");
    feedbackElement.textContent = "إجابة خاطئة! حاول مرة أخرى.";
    feedbackElement.className = "feedback error";

    selectedOptions[lessonNumber] = null;
    setTimeout(() => {
      selectedOption.classList.remove("selected", "incorrect");
      feedbackElement.className = "feedback";
      feedbackElement.textContent = "";
      document.getElementById(`check-answer-${lessonNumber}`).style.display =
        "block";
    }, 2000);
  }
}

// دالة للانتقال إلى الدرس السابق
function prevLesson() {
  if (currentLesson > 1) {
    openLesson(currentLesson - 1);
  }
}

// دالة للانتقال إلى الدرس التالي
function nextLesson() {
  if (currentLesson < totalLessons) {
    openLesson(currentLesson + 1);
  } else {
    showPage("completion-page");
  }
}

// دالة للعودة إلى الصفحة الرئيسية
function backToHome() {
  currentLesson = 0;
  showPage("home-page");
}

// دالة لتحديث حالة أزرار التنقل
function updateNavButtons() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  prevBtn.style.display =
    currentLesson === 0 || currentLesson === 1 ? "none" : "flex";

  if (currentLesson === 0 || currentLesson > totalLessons) {
    nextBtn.style.display = "none";
  } else if (
    currentSection === "quiz" &&
    selectedOptions[currentLesson] &&
    selectedOptions[currentLesson].getAttribute("data-correct") === "true"
  ) {
    nextBtn.style.display = "flex";
  } else {
    nextBtn.style.display = "none";
  }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  showPage("home-page");
  // إضافة أزرار "الانتقال إلى الاختبار" لكل الدروس عند التحميل
  for (let i = 1; i <= totalLessons; i++) {
    addQuizButton(i);
  }
});
