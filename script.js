const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
}

const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
menuBtn?.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  document.body.classList.toggle('menu-open');
});
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const patientTabButtons = [...document.querySelectorAll('#patientTabs .tab-btn')];
function activatePatientTab(tabName) {
  patientTabButtons.forEach(button => {
    const active = button.dataset.tab === tabName;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('#patientPortal .tab-panel').forEach(panel => panel.classList.remove('active'));
  const target = document.getElementById('tab-' + tabName);
  if (target) target.classList.add('active');
}
patientTabButtons.forEach(btn => btn.addEventListener('click', () => activatePatientTab(btn.dataset.tab)));

document.getElementById('goMedicinesBtn')?.addEventListener('click', () => activatePatientTab('medicines'));
document.getElementById('sidebarSupportBtn')?.addEventListener('click', () => activatePatientTab('support'));
document.getElementById('overviewSupportBtn')?.addEventListener('click', () => activatePatientTab('support'));
document.getElementById('overviewOrderBtn')?.addEventListener('click', () => activatePatientTab('medicines'));

const medChecks = [...document.querySelectorAll('.med-check')];
function updateMedicineProgress() {
  const total = medChecks.length;
  const done = medChecks.filter(i => i.checked).length;
  const percent = Math.round((done / total) * 100);
  document.getElementById('medPercent').textContent = percent + '%';
  document.getElementById('medBar').style.width = percent + '%';
  document.getElementById('overviewCompletion').textContent = percent + '%';
  document.getElementById('heroAdherence').textContent = percent + '%';
  medChecks.forEach(check => {
    const badge = check.closest('.check-item').querySelector('.badge');
    badge.textContent = check.checked ? 'Taken' : 'Pending';
    badge.className = 'badge ' + (check.checked ? 'green' : 'blue');
  });
}
medChecks.forEach(check => check.addEventListener('change', updateMedicineProgress));
updateMedicineProgress();

document.getElementById('orderMedicineBtn')?.addEventListener('click', (event) => {
  event.currentTarget.textContent = 'Request sent';
  event.currentTarget.disabled = true;
  showToast('Medicine delivery request sent to the clinic.');
});

document.getElementById('appointmentForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Appointment request submitted.');
  e.target.reset();
});

function calculateEMI() {
  const cost = Number(document.getElementById('costInput').value || 0);
  const months = Number(document.getElementById('monthsInput').value || 12);
  const simpleFeeRate = 0.06; // 6% illustrative
  const total = cost * (1 + simpleFeeRate);
  const emi = Math.round(total / months);
  document.getElementById('emiResult').textContent = '₹' + emi.toLocaleString('en-IN');
}
document.getElementById('emiForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  calculateEMI();
  showToast('EMI estimate updated.');
});
document.getElementById('costInput')?.addEventListener('input', calculateEMI);
document.getElementById('monthsInput')?.addEventListener('change', calculateEMI);
calculateEMI();

document.getElementById('supportForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Support callback request submitted.');
  e.target.reset();
});

const regCountEl = document.getElementById('campaignRegistrations');
document.querySelectorAll('.register-campaign').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.registered === 'true') {
      showToast('You are already registered for ' + btn.dataset.campaign + '.');
      return;
    }
    const current = Number(regCountEl?.textContent || 0);
    if (regCountEl) regCountEl.textContent = String(current + 1);
    btn.dataset.registered = 'true';
    btn.textContent = 'Registered';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-light');
    showToast('Registered for ' + btn.dataset.campaign + '.');
  });
});

document.querySelectorAll('#dashboardFilters .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#dashboardFilters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.patient-row').forEach(row => {
      const kinds = row.dataset.kind.split(' ');
      row.classList.toggle('hide', !(filter === 'all' || kinds.includes(filter)));
    });
  });
});
