"use strict";

const sampleRecords = [
  {
    number: "SOW-20261110-001",
    title: "Office Network Upgrade",
    owner: "Sample Applicant A",
    date: "2026-11-10",
    status: "In Review",
    stage: "Manager Review",
    mine: true,
    assigned: false
  },
  {
    number: "SOW-20261106-002",
    title: "Facility Preventive Maintenance",
    owner: "Sample Applicant A",
    date: "2026-11-06",
    status: "Approved",
    stage: "Review Complete",
    mine: true,
    assigned: false
  },
  {
    number: "SOW-20261109-003",
    title: "Warehouse Lighting Replacement",
    owner: "Sample Applicant B",
    date: "2026-11-09",
    status: "Pending Review",
    stage: "Procurement Review",
    mine: false,
    assigned: true
  }
];

const byId = (id) => document.getElementById(id);
const navigation = [...document.querySelectorAll("[data-panel]")];
const queryView = byId("query-view");
const formView = byId("new-form");
const formFrame = byId("project-sow");
const queryLink = byId("show-query");
const createLink = byId("show-create");
const dialog = byId("record-dialog");
const searchForm = byId("search-form");
const searchInput = byId("sow-number");
const feedback = byId("search-feedback");
const searchResults = byId("search-results");

function showView() {
  const requestedPanel = location.hash.slice(1);
  const creating = requestedPanel === formView.id;
  queryView.hidden = creating;
  formView.hidden = !creating;

  if (creating) {
    document.body.dataset.view = "create";
    queryLink.removeAttribute("aria-current");
    createLink.setAttribute("aria-current", "page");
    if (!formFrame.hasAttribute("src")) {
      formFrame.src = formFrame.dataset.src;
    }
    return;
  }

  delete document.body.dataset.view;
  createLink.removeAttribute("aria-current");
  queryLink.setAttribute("aria-current", "page");
  const activePanel = navigation.some((link) => link.dataset.panel === requestedPanel)
    ? requestedPanel
    : "lookup";
  queryLink.hash = activePanel;

  for (const link of navigation) {
    const selected = link.dataset.panel === activePanel;
    byId(link.dataset.panel).hidden = !selected;
    if (selected) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

function showDetails(record) {
  byId("detail-number").textContent = record.number;
  byId("detail-title").textContent = record.title;
  byId("detail-status").textContent = record.status;
  byId("detail-owner").textContent = record.owner;
  byId("detail-date").textContent = record.date;
  byId("detail-stage").textContent = record.stage;
  dialog.showModal();
}

function recordRow(record) {
  const row = document.createElement("button");
  row.type = "button";
  row.className = "record";
  row.innerHTML = '<span><strong></strong><small></small></span><span class="record-status"></span><svg class="icon" aria-hidden="true"><use href="#arrow"/></svg>';
  row.querySelector("strong").textContent = record.title;
  row.querySelector("small").textContent = record.number;
  const status = row.querySelector(".record-status");
  status.textContent = record.status;
  status.classList.toggle("approved", record.status === "Approved");
  row.addEventListener("click", () => showDetails(record));
  return row;
}

function clearSearch() {
  feedback.textContent = "";
  searchResults.replaceChildren();
  searchResults.hidden = true;
}

searchInput.addEventListener("input", () => {
  searchInput.setCustomValidity("");
  clearSearch();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearSearch();
  const number = searchInput.value.trim().toUpperCase();
  if (!number) {
    searchInput.setCustomValidity("Enter a SOW number.");
    searchInput.reportValidity();
    return;
  }

  const record = sampleRecords.find((item) => item.number === number);
  if (!record) {
    feedback.textContent = "No sample form matches that SOW number. Check the number or try the example above.";
    return;
  }

  feedback.textContent = "1 sample form found.";
  searchResults.replaceChildren(recordRow(record));
  searchResults.hidden = false;
});

byId("sample-search").addEventListener("click", () => {
  searchInput.setCustomValidity("");
  searchInput.value = sampleRecords[0].number;
  searchForm.requestSubmit();
});

byId("my-records").replaceChildren(...sampleRecords.filter((record) => record.mine).map(recordRow));
byId("approval-records").replaceChildren(...sampleRecords.filter((record) => record.assigned).map(recordRow));
window.addEventListener("hashchange", showView);
showView();
