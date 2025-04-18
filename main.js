// script.js

// المتغيرات العامة
let currentLesson = 0;
const totalLessons = 5;
let selectedOptions = { 1: null, 2: null, 3: null, 4: null, 5: null };

// دالة لإظهار صفحة معينة وإخفاء الباقي
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");

  // تحديث حالة أزرار التنقل
  updateNavButtons();
}

// دالة لفتح درس معين
function openLesson(lessonNumber) {
  if (lessonNumber >= 1 && lessonNumber <= totalLessons) {
    currentLesson = lessonNumber;
    showPage(`lesson-page-${lessonNumber}`);
  }
}

// دالة لتحديد خيار في الاختبار
function selectOption(optionElement, lessonNumber) {
  // إلغاء تحديد الخيارات الأخرى في نفس الدرس
  const options = document.querySelectorAll(
    `#lesson-page-${lessonNumber} .option`
  );
  options.forEach((opt) => opt.classList.remove("selected"));

  // تحديد الخيار المختار
  optionElement.classList.add("selected");
  selectedOptions[lessonNumber] = optionElement;

  // إظهار زر التحقق
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

  // إخفاء زر التحقق بعد النقر
  document.getElementById(`check-answer-${lessonNumber}`).style.display =
    "none";

  if (isCorrect) {
    selectedOption.classList.add("correct");
    feedbackElement.textContent = "إجابة صحيحة! أحسنت!";
    feedbackElement.className = "feedback success";

    // إظهار زر "التالي" في شريط التنقل إذا لم يكن الدرس الأخير
    if (lessonNumber < totalLessons) {
      document.getElementById("next-btn").style.display = "flex";
    } else {
      // إذا كان الدرس الأخير، إظهار صفحة الإكمال
      setTimeout(() => showPage("completion-page"), 1000);
    }
  } else {
    selectedOption.classList.add("incorrect");
    feedbackElement.textContent = "إجابة خاطئة! حاول مرة أخرى.";
    feedbackElement.className = "feedback error";

    // إعادة تعيين الخيار المختار للسماح بمحاولة أخرى
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

  // إخفاء زر "السابق" في الصفحة الرئيسية أو الدرس الأول
  prevBtn.style.display =
    currentLesson === 0 || currentLesson === 1 ? "none" : "flex";

  // إخفاء زر "التالي" إذا لم يتم الإجابة بشكل صحيح أو في الصفحة الرئيسية
  nextBtn.style.display =
    currentLesson === 0 || currentLesson > totalLessons ? "none" : "flex";

  // إذا تمت الإجابة بشكل صحيح، يظهر زر "التالي"
  if (
    currentLesson > 0 &&
    selectedOptions[currentLesson] &&
    selectedOptions[currentLesson].getAttribute("data-correct") === "true"
  ) {
    nextBtn.style.display = "flex";
  } else if (currentLesson > 0) {
    nextBtn.style.display = "none";
  }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  showPage("home-page");
});

