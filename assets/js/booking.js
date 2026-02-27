// booking.js - front‑end "backend" behaviour for the consultation form

(function () {
  const form = document.getElementById('consultation-form');
  if (!form) return; // nothing to do on other pages

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const phone = this.phone.value.trim();
    const message = this.message.value.trim();

    if (!name || !email) {
      alert('Please provide your name and email address.');
      return;
    }

    // save to localStorage to simulate a backend
    const record = { name, email, phone, message, ts: new Date().toISOString() };
    localStorage.setItem('lastRequest', JSON.stringify(record));

    // build a mailto URL so the user's own mail client will open
    const subject = encodeURIComponent('Consultation request from ' + name);
    let body = `Name: ${name}\nEmail: ${email}`;
    if (phone) body += `\nPhone: ${phone}`;
    if (message) body += `\n\nMessage:\n${message}`;

    const mailto = `mailto:youremail@example.com?subject=${subject}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    // after a moment redirect to thank-you page
    setTimeout(() => {
      window.location.href = 'thank-you.html';
    }, 200);
  });
})();