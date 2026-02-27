/* ======================================================
   EOLAW Consulting — Consultation Form Handler
   No backend required: sends via mailto + WhatsApp
   ====================================================== */

/* !! UPDATE THESE WITH YOUR ACTUAL CONTACT DETAILS !! */
var CONFIG = {
  EMAIL:     'emmanuel.ao@outlook.com',
  PHONE:     '+1 (346) 383-9529',
  WHATSAPP:  '13463839529',
};

/* ======================================================
   MULTI-STEP FORM STATE
   ====================================================== */
var currentStep = 1;
var totalSteps  = 3;

function goToStep(step) {
  // Hide all steps
  document.querySelectorAll('.form-step').forEach(function (el) { el.classList.add('hidden'); });
  var target = document.getElementById('step-' + step);
  if (target) target.classList.remove('hidden');

  // Update step dots
  document.querySelectorAll('.step-dot').forEach(function (dot, i) {
    var n = i + 1;
    dot.classList.remove('active', 'done');
    if (n < step)      { dot.classList.add('done');   dot.innerHTML = '<i data-lucide="check" style="width:1rem;height:1rem;"></i>'; }
    else if (n === step){ dot.classList.add('active'); dot.textContent = n; }
    else                { dot.textContent = n; }
  });

  // Update connecting lines
  document.querySelectorAll('.step-line').forEach(function (line, i) {
    if (i + 1 < step) line.classList.add('done'); else line.classList.remove('done');
  });

  // Update progress bar
  var bar = document.getElementById('form-progress');
  if (bar) bar.style.width = (((step - 1) / (totalSteps - 1)) * 100) + '%';

  // Button visibility
  var prevBtn   = document.getElementById('prev-btn');
  var nextBtn   = document.getElementById('next-btn');
  var submitBtn = document.getElementById('submit-btn');
  if (prevBtn)   prevBtn.classList.toggle('hidden',   step === 1);
  if (nextBtn)   nextBtn.classList.toggle('hidden',   step === totalSteps);
  if (submitBtn) submitBtn.classList.toggle('hidden', step !== totalSteps);

  // Step label
  var labels = ['Select Service', 'Your Details', 'Review & Submit'];
  var stepLabel = document.getElementById('step-label');
  if (stepLabel) stepLabel.textContent = 'Step ' + step + ' of ' + totalSteps + ' — ' + labels[step - 1];

  // If last step, populate review
  if (step === totalSteps) populateReview();

  currentStep = step;
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Scroll form into view
  var formEl = document.getElementById('booking-form');
  if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ======================================================
   VALIDATION
   ====================================================== */
function clearErrors() {
  document.querySelectorAll('.field-error').forEach(function (el) { el.textContent = ''; });
  document.querySelectorAll('.form-input.error').forEach(function (el) { el.classList.remove('error'); });
}

function setError(inputId, errorId, msg) {
  var input = document.getElementById(inputId);
  var errorEl = document.getElementById(errorId);
  if (input) input.classList.add('error');
  if (errorEl) errorEl.textContent = msg;
}

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

function validateStep(step) {
  clearErrors();
  var ok = true;

  if (step === 1) {
    var svc = document.getElementById('service-type');
    var ctype = document.getElementById('consultation-type');
    if (!svc || !svc.value) { setError('service-type', 'service-type-error', 'Please select a service.'); ok = false; }
    if (!ctype || !ctype.value) { setError('consultation-type', 'consultation-type-error', 'Please select a consultation type.'); ok = false; }
  }

  if (step === 2) {
    var name  = document.getElementById('client-name');
    var email = document.getElementById('client-email');
    var msg   = document.getElementById('client-message');
    if (!name || name.value.trim().length < 2) { setError('client-name', 'name-error', 'Please enter your full name.'); ok = false; }
    if (!email || !isValidEmail(email.value))  { setError('client-email', 'email-error', 'Please enter a valid email address.'); ok = false; }
    if (!msg || msg.value.trim().length < 20)  { setError('client-message', 'message-error', 'Please describe your project (at least 20 characters).'); ok = false; }
  }

  return ok;
}

/* ======================================================
   NAVIGATION
   ====================================================== */
function nextStep() {
  if (!validateStep(currentStep)) return;
  if (currentStep < totalSteps) goToStep(currentStep + 1);
}

function prevStep() {
  if (currentStep > 1) goToStep(currentStep - 1);
}

/* ======================================================
   FORM DATA
   ====================================================== */
function getFormData() {
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  return {
    serviceType:       val('service-type'),
    consultationType:  val('consultation-type'),
    preferredDate:     val('preferred-date'),
    budget:            val('budget'),
    name:              val('client-name'),
    email:             val('client-email'),
    phone:             val('client-phone'),
    company:           val('client-company'),
    message:           val('client-message'),
    preferredContact:  val('preferred-contact'),
    howHeard:          val('how-heard'),
    timezone:          val('timezone'),
  };
}

/* ======================================================
   REVIEW PANEL
   ====================================================== */
function populateReview() {
  var d = getFormData();
  var el = document.getElementById('review-content');
  if (!el) return;

  function row(label, value) {
    if (!value) return '';
    return '<div style="display:flex;justify-content:space-between;align-items:start;padding:.875rem 0;border-bottom:1px solid #1f1f1f;">'
      + '<span style="color:#888;font-size:.875rem;flex-shrink:0;margin-right:1rem;">' + label + '</span>'
      + '<span style="color:#fff;font-size:.875rem;font-weight:500;text-align:right;">' + value + '</span></div>';
  }

  el.innerHTML =
    row('Service',          d.serviceType)      +
    row('Consultation',     d.consultationType) +
    row('Preferred Date',   d.preferredDate || 'Flexible') +
    row('Budget Range',     d.budget || 'To discuss') +
    row('Name',             d.name)             +
    row('Email',            d.email)            +
    row('Phone',            d.phone || 'Not provided') +
    row('Company',          d.company || 'N/A') +
    row('Timezone',         d.timezone || 'Not specified') +
    row('How They Heard',   d.howHeard || 'N/A') +
    '<div style="padding:.875rem 0;">' +
    '<span style="color:#888;font-size:.875rem;display:block;margin-bottom:.5rem;">Project Description</span>' +
    '<span style="color:#ddd;font-size:.875rem;line-height:1.6;">' + (d.message || '—') + '</span></div>';
}

/* ======================================================
   SUBMISSION — mailto + WhatsApp
   ====================================================== */
function buildMailtoLink(d) {
  var subject = 'Consultation Request — ' + d.serviceType + ' | ' + d.name;
  var body = [
    'EOLAW CONSULTING — NEW CONSULTATION REQUEST',
    '='.repeat(44),
    '',
    'SERVICE REQUESTED',
    '  Service Type   : ' + d.serviceType,
    '  Consult Type   : ' + d.consultationType,
    '  Preferred Date : ' + (d.preferredDate || 'Flexible'),
    '  Budget Range   : ' + (d.budget || 'To be discussed'),
    '  Timezone       : ' + (d.timezone || 'Not specified'),
    '',
    'CLIENT INFORMATION',
    '  Name           : ' + d.name,
    '  Email          : ' + d.email,
    '  Phone          : ' + (d.phone || 'Not provided'),
    '  Company        : ' + (d.company || 'N/A'),
    '  Preferred Cntct: ' + (d.preferredContact || 'Email'),
    '  How They Heard : ' + (d.howHeard || 'N/A'),
    '',
    'PROJECT DESCRIPTION',
    d.message,
    '',
    '---',
    'Submitted: ' + new Date().toLocaleString(),
    'Source: EOLAW Consulting Website',
  ].join('\n');
  return 'mailto:' + CONFIG.EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

function buildWhatsAppLink(d) {
  var msg = [
    'Hi Emmanuel! I\'d like to book a consultation.',
    '',
    '*Service:* ' + d.serviceType,
    '*Type:* ' + d.consultationType,
    '*Name:* ' + d.name,
    '*Email:* ' + d.email,
    '*Budget:* ' + (d.budget || 'To discuss'),
    '',
    '*Brief:* ' + d.message.slice(0, 200) + (d.message.length > 200 ? '...' : ''),
  ].join('\n');
  return 'https://wa.me/' + CONFIG.WHATSAPP + '?text=' + encodeURIComponent(msg);
}

function submitConsultation() {
  if (!validateStep(currentStep)) return;

  var d = getFormData();

  // Save to localStorage (lightweight "backend" simulation)
  var records = JSON.parse(localStorage.getItem('eolaw_consultations') || '[]');
  records.push(Object.assign({}, d, { submitted_at: new Date().toISOString(), id: Date.now() }));
  localStorage.setItem('eolaw_consultations', JSON.stringify(records));

  // Build links
  var mailtoLink   = buildMailtoLink(d);
  var whatsappLink = buildWhatsAppLink(d);

  // Show success modal with contact options
  showSuccessModal(d.name, mailtoLink, whatsappLink);
}

/* ======================================================
   SUCCESS MODAL
   ====================================================== */
function showSuccessModal(name, mailtoLink, whatsappLink) {
  var modal = document.getElementById('success-modal');
  if (!modal) return;

  var nameEl = document.getElementById('modal-name');
  var emailBtn = document.getElementById('modal-email-btn');
  var waBtn    = document.getElementById('modal-whatsapp-btn');
  var phoneEl  = document.getElementById('modal-phone');

  if (nameEl)   nameEl.textContent = name;
  if (emailBtn) emailBtn.href = mailtoLink;
  if (waBtn)    waBtn.href = whatsappLink;
  if (phoneEl)  phoneEl.textContent = CONFIG.PHONE;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeSuccessModal() {
  var modal = document.getElementById('success-modal');
  if (modal) { modal.classList.add('hidden'); document.body.style.overflow = ''; }
  window.location.href = '/thank-you.html';
}

/* ======================================================
   DIRECT CONTACT HELPERS (for contact cards)
   ====================================================== */
function contactByPhone() { window.location.href = 'tel:' + CONFIG.PHONE.replace(/\D/g, ''); }
function contactByEmail() { window.location.href = 'mailto:' + CONFIG.EMAIL + '?subject=Consultation%20Inquiry'; }
function contactByWhatsApp() {
  var msg = encodeURIComponent("Hi Emmanuel! I'd like to book a consultation.");
  window.open('https://wa.me/' + CONFIG.WHATSAPP + '?text=' + msg, '_blank');
}

/* ======================================================
   INIT
   ====================================================== */
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('step-1')) goToStep(1);

  var nextBtn   = document.getElementById('next-btn');
  var prevBtn   = document.getElementById('prev-btn');
  var submitBtn = document.getElementById('submit-btn');
  if (nextBtn)   nextBtn.addEventListener('click', nextStep);
  if (prevBtn)   prevBtn.addEventListener('click', prevStep);
  if (submitBtn) submitBtn.addEventListener('click', submitConsultation);

  var modal = document.getElementById('success-modal');
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal) closeSuccessModal(); });
  }

  // Expose direct contact buttons
  var phoneBtn = document.getElementById('contact-phone-btn');
  var emailBtn = document.getElementById('contact-email-btn');
  var waBtn    = document.getElementById('contact-wa-btn');
  if (phoneBtn) phoneBtn.addEventListener('click', contactByPhone);
  if (emailBtn) emailBtn.addEventListener('click', contactByEmail);
  if (waBtn)    waBtn.addEventListener('click', contactByWhatsApp);
});

window.goToStep       = goToStep;
window.nextStep       = nextStep;
window.prevStep       = prevStep;
window.submitConsultation = submitConsultation;
window.closeSuccessModal  = closeSuccessModal;
window.contactByPhone     = contactByPhone;
window.contactByEmail     = contactByEmail;
window.contactByWhatsApp  = contactByWhatsApp;
