const addBtn = document.getElementById("addButton");
const backdropModal = document.getElementById("backDrop");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

const addBtnsubmit = document.getElementById("btnSubmit");
const inputTaskName = document.getElementById("inputTaskname");
const statusSelect = document.getElementById("selectBoxStatus");
const boxSelectPriority = document.getElementById("selectBoxPriority");
const inputDeadline = document.getElementById("inputDeadline");

const loading = document.getElementById("loading");

let tasks = [];

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  tasks = JSON.parse(storedTasks);

  renderTable();
}

function saveTasksToLocalStorage() {
  userJson = JSON.stringify(tasks);
  localStorage.setItem("tasks", userJson);
}

function renderTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  tasks.forEach((task) => {
    let statusClass = "";
    if (task.status === "Todo") statusClass = "status-todo";
    if (task.status === "Doing") statusClass = "status-doing";
    if (task.status === "Done") statusClass = "status-done";

    let pripityClass = "";
    if (task.priprity === "Low") pripityClass = "prioprity-low";
    if (task.priprity === "Medium") pripityClass = "prioprity-medium";
    if (task.priprity === "High") pripityClass = "prioprty-high";

let deadlineClass="deadline";

    const tr = `  <tr>
            <td>${task.taskname}</td>
            <td><span class="${pripityClass}">${task.priprity}</span></td>
            <td><span class="${statusClass}">${task.status}</span></td>
            <td class="table-date-cell"><span class="${deadlineClass}">${task.deadline}</span></td>
            <td class="flex gap-2 justify-center">
              <button onclick='deletTask(${task.id})' class="bg-red-600 p-2 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-trash-fill text-white"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"
                  />
                </svg>
              </button>
              <button onclick='editTask(${task.id})' class="bg-blue-600 rounded p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen-fill text-white"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"
                  />
                </svg>
              </button>
              <button onclick='viewTask(${task.id})' class="bg-gray-500 p-2 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-eye-fill text-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                  <path
                    d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"
                  />
                </svg>
              </button>
            </td>
          </tr>`;

    tableBody.innerHTML += tr;
  });
}

function deletTask(id) {
  tasks = tasks.filter((tasks) => tasks.id !== id);
  saveTasksToLocalStorage();
  renderTable();
}

addBtnsubmit.addEventListener("click", function (e) {
  e.preventDefault();
  const taskname = inputTaskName.value.trim();
  const status = statusSelect.value.trim();
  const priprity = boxSelectPriority.value.trim();
  const deadline = inputDeadline.value.trim();

  if (taskname && status && deadline) {
    loading.classList.remove("hidden");

    setTimeout(() => {
      if (editingTaskId) {
        const taskIndex = tasks.findIndex((task) => task.id === editingTaskId);
        tasks[taskIndex] = {
          id: editingTaskId,
          taskname,
          status,
          priprity,
          deadline,
        };
        editingTaskId = null;
      } else {
        const taskId = Date.now();
        tasks.push({ id: taskId, taskname, status, priprity, deadline });
      }

      saveTasksToLocalStorage();
      inputTaskName.value = "";
      statusSelect.value = "Todo";
      boxSelectPriority.value = "Low";
      inputDeadline.value = "";

      hideModal();
      renderTable();
      saveTasksToLocalStorage();
      loading.classList.add("hidden");
    }, 3000);
  } else {
    alert("لطفاً مقادیر زیر را وارد کنید!");
  }
});

function viewTask(id) {
  const viewModal = document.getElementById("viewModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalDetails = document.getElementById("modalDetails");
  const modalDate = document.getElementById("modalDate");

  const task = tasks.find((task) => task.id === id);

  modalTitle.textContent = `${task.taskname}`;
  modalDescription.textContent = `Priprity: ${task.priprity}`;
  modalDetails.textContent = `Status: ${task.status}`;
  modalDate.textContent = `Deadline: ${task.deadline}`;

  viewModal.classList.remove("hidden");
}

document
  .getElementById("closeViewModal")
  .addEventListener("click", function () {
    document.getElementById("viewModal").classList.add("hidden");
  });

let editingTaskId = null;

function editTask(id) {
  const task = tasks.find((task) => task.id === id);

  inputTaskName.value = task.taskname;
  statusSelect.value = task.status;
  boxSelectPriority.value = task.priprity;
  inputDeadline.value = task.deadline;

  editingTaskId = id;

  showModal();
}

saveTasksToLocalStorage();

new Pikaday({
  field: inputDeadline,
  format: 'YYYY/MM/DD',
  calendarType: 'Persian',
  observer: true, 
});

function showModal() {
  backdropModal.classList.remove("hidden");
  modal.classList.remove("hidden");
}

function hideModal() {
  backdropModal.classList.add("hidden");
  modal.classList.add("hidden");
}

addBtn.addEventListener("click", showModal);
backdropModal.addEventListener("click", hideModal);
closeModal.addEventListener("click", hideModal);
