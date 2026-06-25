const state = {
  view: "dashboard",
  selectedSurveyId: null,
  detailTab: "questions",
  selectedQuestionIndex: 0,
  search: "",
  statusFilter: "all",
  answers: {},
};

const surveys = [
  {
    id: "sv-test-2",
    code: "",
    name: "KHẢO SÁT TEST 2",
    version: 1,
    status: "Khởi tạo",
    department: "Tổng đài",
    channel: "Agent nhập liệu",
    description: "Kịch bản khảo sát test cho agent tổng đài.",
    startDate: "",
    endDate: "",
  },
  {
    id: "sv-25-6",
    code: "KS001",
    name: "Khảo sát 25.6",
    version: 1,
    status: "Khởi tạo",
    department: "CSKH",
    channel: "Agent nhập liệu",
    description: "Bộ câu hỏi ghi nhận trải nghiệm khách hàng.",
    startDate: "",
    endDate: "",
  },
];

const questions = [
  q("q1", "sv-test-2", "Q01", 1, "Chọn một đáp án", "Anh/chị đã sử dụng dịch vụ ECO trong 3 tháng gần đây chưa?", true, ["Có", "Không"]),
  q("q2", "sv-test-2", "Q02", 2, "Văn bản ngắn", "Mã căn hộ hoặc mã khách hàng của anh/chị là gì?", true),
  q("q3", "sv-test-2", "Q03", 3, "Văn bản dài", "Anh/chị cần ECO hỗ trợ thêm nội dung nào?", false),
  q("q4", "sv-test-2", "Q04", 4, "Số", "Anh/chị đánh giá tốc độ phản hồi của tổng đài bao nhiêu điểm?", true),
  q("q5", "sv-test-2", "Q05", 5, "Đánh giá", "Mức độ hài lòng chung của anh/chị?", true, ["1", "2", "3", "4", "5"]),
  q("q6", "sv-test-2", "Q06", 6, "Ngày", "Ngày anh/chị cần được gọi lại là khi nào?", false),
  q("q7", "sv-test-2", "Q07", 7, "Chọn nhiều đáp án", "Anh/chị quan tâm nhóm thông tin nào?", false, ["Phí dịch vụ", "Tiện ích", "Bảo trì", "Sự kiện"]),
  q("q8", "sv-25-6", "Q01", 1, "Chọn một đáp án", "Khách hàng có đồng ý tham gia khảo sát không?", true, ["Có", "Không"]),
  q("q9", "sv-25-6", "Q02", 2, "Đánh giá", "Khách hàng đánh giá thái độ phục vụ của agent?", true, ["1", "2", "3", "4", "5"]),
  q("q10", "sv-25-6", "Q03", 3, "Văn bản dài", "Ghi chú phản hồi nổi bật của khách hàng.", false),
  q("q11", "sv-25-6", "Q04", 4, "Ngày", "Ngày hẹn xử lý tiếp theo.", false),
];

const rules = [
  {
    id: "r1",
    surveyId: "sv-test-2",
    code: "R01",
    name: "Hiển thị Q03 khi Q01 = Không",
    description: "Nếu khách chưa sử dụng dịch vụ thì hỏi lý do và nhu cầu hỗ trợ.",
    source: "Q01",
    operator: "Bằng (=)",
    value: "Không",
    action: "Hiển thị câu hỏi",
    target: "Q03",
    priority: 1,
    active: true,
  },
  {
    id: "r2",
    surveyId: "sv-test-2",
    code: "R02",
    name: "Bắt buộc ghi chú khi điểm hài lòng thấp",
    description: "Khi điểm hài lòng từ 2 trở xuống, agent cần ghi lý do.",
    source: "Q05",
    operator: "Nhỏ hơn hoặc bằng",
    value: "2",
    action: "Bắt buộc trả lời",
    target: "Q03",
    priority: 2,
    active: true,
  },
];

const sessions = [
  { id: "S001", surveyId: "sv-test-2", customer: "Nguyễn Minh", status: "Đang nhập" },
  { id: "S002", surveyId: "sv-test-2", customer: "Trần Mai", status: "Đang nhập" },
  { id: "S003", surveyId: "sv-test-2", customer: "Lê Hà", status: "Đang nhập" },
  { id: "S004", surveyId: "sv-test-2", customer: "Phạm Anh", status: "Đang nhập" },
  { id: "S005", surveyId: "sv-25-6", customer: "Võ Huy", status: "Đang nhập" },
  { id: "S006", surveyId: "sv-25-6", customer: "Hoàng Nam", status: "Đang nhập" },
  { id: "S007", surveyId: "sv-25-6", customer: "Đỗ Ly", status: "Hoàn thành" },
  { id: "S008", surveyId: "sv-25-6", customer: "Bùi Trang", status: "Hoàn thành" },
];

const content = document.querySelector("#content");
const modalRoot = document.querySelector("#modalRoot");
const toast = document.querySelector("#toast");
let pendingConfirm = null;

surveys.splice(0);
questions.splice(0);
rules.splice(0);
sessions.splice(0);

function q(id, surveyId, code, order, type, text, required = false, options = []) {
  return {
    id,
    surveyId,
    code,
    order,
    type,
    text,
    required,
    options,
    agentScript: "",
    guideText: "",
    placeholder: "",
    active: true,
  };
}

function selectedSurvey() {
  return surveys.find((survey) => survey.id === state.selectedSurveyId) || surveys[0] || null;
}

function selectedQuestions() {
  const survey = selectedSurvey();
  if (!survey) return [];
  return questions
    .filter((question) => question.surveyId === survey.id)
    .sort((a, b) => a.order - b.order);
}

function selectedRules() {
  const survey = selectedSurvey();
  if (!survey) return [];
  return rules
    .filter((rule) => rule.surveyId === survey.id)
    .sort((a, b) => a.priority - b.priority);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function icon(name) {
  const icons = {
    clipboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5h6M9 12h6M9 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1Z" stroke="currentColor" stroke-width="2"/></svg>',
    trend: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 16 6-6 4 4 6-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 6h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    file: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" stroke-width="2"/><path d="M14 3v5h4M9 13h6M9 17h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    route: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18V6m0 12a2 2 0 1 0 0 .1M18 6a2 2 0 1 0 0 .1M18 8c0 5-8 3-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/><path d="M12 8v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/><path d="m8.5 12.5 2.2 2.2 4.8-5.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    save: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h12l2 2v14H5V4Z" stroke="currentColor" stroke-width="2"/><path d="M8 4v6h8V4M8 20v-6h8v6" stroke="currentColor" stroke-width="2"/></svg>',
    plus: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    arrowLeft: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6 9 12l6 6M10 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    eye: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="1.8"/></svg>',
    edit: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19h4l10-10a2.1 2.1 0 0 0-3-3L6 16l-1 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m14.5 7.5 2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    trash: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M10 11v5M14 11v5M9 7l1-2h4l1 2M7 7l1 12h8l1-12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    copy: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 8h10v10H8V8Z" stroke="currentColor" stroke-width="1.8"/><path d="M6 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    branch: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 6v5a4 4 0 0 0 4 4h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 18v-7a4 4 0 0 1 4-4h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="m15 4 3 3-3 3M15 12l3 3-3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  return icons[name] || "";
}

function badge(text, active = false) {
  return `<span class="status ${active ? "active" : ""}">${escapeHtml(text)}</span>`;
}

function actionButton(action, id, iconName, label, tone = "") {
  return `<button class="icon-action ${tone}" type="button" data-action="${action}" data-id="${id}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">${icon(iconName)}</button>`;
}

function formatDate(value) {
  if (!value) return "Chưa thiết lập";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
}

function answerCount(question) {
  return Array.isArray(question.options) ? question.options.length : 0;
}

function questionSupportsOptions(type) {
  return ["Chọn một đáp án", "Chọn nhiều đáp án", "Đánh giá"].includes(type);
}

function defaultOptionsForType(type) {
  if (type === "Đánh giá") return ["1", "2", "3", "4", "5"];
  if (type === "Chọn một đáp án" || type === "Chọn nhiều đáp án") return ["Có", "Không"];
  return [];
}

function renderSurveyInfoBlock(survey, questionCount, ruleCount) {
  return `
    <section class="info-block survey-info-block">
      <div class="block-heading">
        <div>
          <p class="block-eyebrow">Thông tin khảo sát</p>
          <h2 class="block-title">${escapeHtml(survey.name)}</h2>
        </div>
        ${badge(survey.status)}
      </div>
      <div class="info-grid">
        <div><span>Mã khảo sát</span><strong>${escapeHtml(survey.code || "—")}</strong></div>
        <div><span>Phiên bản</span><strong>v${survey.version}</strong></div>
        <div><span>Kênh</span><strong>${escapeHtml(survey.channel)}</strong></div>
        <div><span>Phòng ban</span><strong>${escapeHtml(survey.department)}</strong></div>
        <div><span>Ngày bắt đầu</span><strong>${formatDate(survey.startDate)}</strong></div>
        <div><span>Ngày kết thúc</span><strong>${formatDate(survey.endDate)}</strong></div>
        <div><span>Câu hỏi</span><strong>${questionCount}</strong></div>
        <div><span>Rẽ nhánh</span><strong>${ruleCount}</strong></div>
      </div>
      ${survey.description ? `<p class="info-description">${escapeHtml(survey.description)}</p>` : ""}
    </section>
  `;
}

function renderHeader(title, subtitle, action = "") {
  return `
    <header class="page-head">
      <div>
        <h1 class="page-title">${escapeHtml(title)}</h1>
        ${subtitle ? `<p class="page-subtitle">${escapeHtml(subtitle)}</p>` : ""}
      </div>
      <div>${action}</div>
    </header>
  `;
}

function render() {
  syncNav();
  const view = state.view;
  if (view === "dashboard") renderDashboard();
  if (view === "surveys") renderSurveys();
  if (view === "createSurvey") renderCreateSurvey();
  if (view === "surveyDetail") renderSurveyDetail();
  if (view === "branching") renderBranching();
  if (view === "entry") renderEntry();
}

function syncNav() {
  const viewForNav = state.view === "createSurvey" || state.view === "surveyDetail" ? "surveys" : state.view;
  document.querySelectorAll(".nav-item").forEach((button) => {
    const active = button.dataset.view === viewForNav;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function renderDashboard() {
  const action = `<button class="btn primary" data-action="create-survey" data-testid="create-survey">${icon("plus")} Tạo khảo sát mới</button>`;
  const metrics = [
    { value: surveys.length, label: "Tổng khảo sát", iconName: "clipboard", tone: "tone-blue" },
    { value: surveys.filter((survey) => survey.status === "Đang hoạt động").length, label: "Đang hoạt động", iconName: "trend", tone: "tone-green" },
    { value: questions.length, label: "Tổng câu hỏi", iconName: "file", tone: "tone-violet" },
    { value: rules.length, label: "Điều kiện rẽ nhánh", iconName: "route", tone: "tone-orange" },
    { value: sessions.length, label: "Phiên nhập liệu", iconName: "clock", tone: "tone-cyan" },
    { value: sessions.filter((session) => session.status === "Hoàn thành").length, label: "Hoàn thành", iconName: "check", tone: "tone-green" },
  ];

  content.innerHTML = `
    ${renderHeader("Tổng quan", "Hệ thống quản lý khảo sát Tổng Đài ECOSURVEY", action)}
    <section class="metric-grid" aria-label="Chỉ số tổng quan">
      ${metrics
        .map(
          (metric) => `
          <article class="metric-card">
            <div class="metric-icon ${metric.tone}">${icon(metric.iconName)}</div>
            <strong>${metric.value}</strong>
            <span>${escapeHtml(metric.label)}</span>
          </article>
        `,
        )
        .join("")}
    </section>
    <section class="panel">
      <div class="panel-header">
        <h2 class="panel-title">Khảo sát gần đây</h2>
        <button class="btn ghost" data-action="view-surveys" type="button">Xem tất cả</button>
      </div>
      ${surveys
        .map(
          (survey) => `
          <div class="survey-row">
            <button type="button" data-action="open-survey" data-id="${survey.id}">
              <h3 class="item-title">${escapeHtml(survey.name)}</h3>
              <div class="item-meta">${escapeHtml(survey.code || "—")} · v${survey.version}</div>
            </button>
            ${badge(survey.status)}
          </div>
        `,
        )
        .join("") || `<div class="empty-state">Chưa có khảo sát nào. Hãy tạo khảo sát đầu tiên để bắt đầu.</div>`}
    </section>
  `;
}

function renderSurveys() {
  const filtered = surveys.filter((survey) => {
    const value = `${survey.name} ${survey.code} ${survey.department}`.toLowerCase();
    const statusMatched = state.statusFilter === "all" || survey.status === state.statusFilter;
    return value.includes(state.search.toLowerCase()) && statusMatched;
  });
  const statuses = ["all", ...new Set(surveys.map((survey) => survey.status))];

  content.innerHTML = `
    ${renderHeader(
      "Quản lý Khảo sát",
      "Tạo, cập nhật và theo dõi phiên bản khảo sát.",
      `<button class="btn primary" data-action="create-survey" type="button">${icon("plus")} Tạo khảo sát mới</button>`,
    )}
    <div class="toolbar">
      <div class="toolbar-left">
        <input class="search" id="surveySearch" value="${escapeHtml(state.search)}" placeholder="Tìm theo tên, mã, phòng ban..." />
      </div>
      <select class="select compact-select" id="statusFilter" aria-label="Lọc trạng thái khảo sát">
        ${statuses
          .map((status) => `<option value="${status}" ${status === state.statusFilter ? "selected" : ""}>${status === "all" ? "Tất cả trạng thái" : escapeHtml(status)}</option>`)
          .join("")}
      </select>
    </div>
    <section class="panel table-panel">
      <div class="panel-header">
        <h2 class="panel-title">Danh sách khảo sát</h2>
        <span class="item-meta">${filtered.length} bản ghi</span>
      </div>
      <div class="survey-table-head" aria-hidden="true">
        <span>Mã / Tên khảo sát</span>
        <span>Phiên bản</span>
        <span>Kênh</span>
        <span>Trạng thái</span>
        <span>Thao tác</span>
      </div>
      ${
        filtered.length
          ? filtered
              .map(
                (survey) => `
                <div class="survey-row survey-table-row">
                  <button type="button" data-action="open-survey" data-id="${survey.id}">
                    <span class="item-title">${escapeHtml(survey.name)}</span>
                    <span class="item-meta">${escapeHtml(survey.code || "—")}</span>
                  </button>
                  <span class="table-cell">v${survey.version}</span>
                  <span class="table-cell">${escapeHtml(survey.channel.replace(" nhập liệu", ""))}</span>
                  ${badge(survey.status)}
                  <div class="row-actions">
                    ${actionButton("open-survey", survey.id, "eye", "Xem khảo sát")}
                    ${actionButton("edit-survey", survey.id, "edit", "Sửa khảo sát")}
                    ${actionButton("duplicate-survey", survey.id, "copy", "Nhân bản khảo sát")}
                    ${actionButton("delete-survey", survey.id, "trash", "Xóa khảo sát", "danger")}
                  </div>
                </div>
              `,
              )
              .join("")
          : `<div class="empty-state">Không tìm thấy khảo sát phù hợp.</div>`
      }
    </section>
  `;

  document.querySelector("#surveySearch").addEventListener("input", (event) => {
    state.search = event.target.value;
    renderSurveys();
  });
  document.querySelector("#statusFilter").addEventListener("change", (event) => {
    state.statusFilter = event.target.value;
    renderSurveys();
  });
}

function renderCreateSurvey() {
  content.innerHTML = `
    <button class="back-link" type="button" data-action="back-dashboard">${icon("arrowLeft")} Quay lại</button>
    <h1 class="page-title">Tạo khảo sát mới</h1>
    <form class="form-card" id="surveyForm" style="margin-top: 22px">
      <div class="form-grid">
        <div class="field">
          <label for="surveyCode">Mã khảo sát</label>
          <input class="input" id="surveyCode" name="code" placeholder="VD: SV001" />
        </div>
        <div class="field">
          <label for="surveyName">Tên khảo sát <span class="required">*</span></label>
          <input class="input" id="surveyName" name="name" required placeholder="Nhập tên khảo sát" />
        </div>
        <div class="field full">
          <label for="surveyDescription">Mô tả</label>
          <textarea class="textarea" id="surveyDescription" name="description" placeholder="Mô tả mục đích khảo sát..."></textarea>
        </div>
        <div class="field">
          <label for="surveyDepartment">Phòng ban</label>
          <input class="input" id="surveyDepartment" name="department" placeholder="Phòng ban sở hữu" />
        </div>
        <div class="field">
          <label for="surveyChannel">Kênh trả lời</label>
          <select class="select" id="surveyChannel" name="channel">
            <option>Agent nhập liệu</option>
            <option>Khách hàng tự trả lời</option>
            <option>Cả hai kênh</option>
          </select>
        </div>
      </div>
      <div class="form-grid three" style="margin-top: 18px">
        <div class="field">
          <label for="surveyStatus">Trạng thái</label>
          <select class="select" id="surveyStatus" name="status">
            <option>Khởi tạo</option>
            <option>Đang hoạt động</option>
            <option>Tạm dừng</option>
          </select>
        </div>
        <div class="field">
          <label for="surveyStart">Ngày bắt đầu</label>
          <input class="input" id="surveyStart" name="startDate" type="date" />
        </div>
        <div class="field">
          <label for="surveyEnd">Ngày kết thúc</label>
          <input class="input" id="surveyEnd" name="endDate" type="date" />
        </div>
      </div>
      <div class="form-footer">
        <button class="btn secondary" type="button" data-action="cancel-create">Hủy</button>
        <button class="btn primary" type="submit">${icon("save")} Lưu</button>
      </div>
    </form>
  `;

  document.querySelector("#surveyForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const survey = {
      id: `sv-${Date.now()}`,
      code: data.code.trim(),
      name: data.name.trim(),
      version: 1,
      status: data.status,
      department: data.department.trim() || "Chưa phân công",
      channel: data.channel,
      description: data.description.trim(),
      startDate: data.startDate,
      endDate: data.endDate,
    };
    surveys.unshift(survey);
    state.selectedSurveyId = survey.id;
    state.detailTab = "questions";
    state.view = "surveyDetail";
    showToast("Đã lưu khảo sát mới.");
    render();
  });
}

function openSurveyEditModal(surveyId) {
  const survey = surveys.find((item) => item.id === surveyId);
  if (!survey) return;
  openModal(`
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="surveyEditTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="surveyEditTitle">Sửa khảo sát</h2>
        <button class="modal-close" type="button" data-action="close-modal" aria-label="Đóng">×</button>
      </div>
      <form class="modal-body" id="surveyEditForm">
        <div class="form-grid">
          <div class="field">
            <label for="editSurveyCode">Mã khảo sát</label>
            <input class="input" id="editSurveyCode" name="code" value="${escapeHtml(survey.code)}" />
          </div>
          <div class="field">
            <label for="editSurveyName">Tên khảo sát <span class="required">*</span></label>
            <input class="input" id="editSurveyName" name="name" required value="${escapeHtml(survey.name)}" />
          </div>
          <div class="field full">
            <label for="editSurveyDescription">Mô tả</label>
            <textarea class="textarea" id="editSurveyDescription" name="description">${escapeHtml(survey.description || "")}</textarea>
          </div>
          <div class="field">
            <label for="editSurveyDepartment">Phòng ban</label>
            <input class="input" id="editSurveyDepartment" name="department" value="${escapeHtml(survey.department)}" />
          </div>
          <div class="field">
            <label for="editSurveyChannel">Kênh trả lời</label>
            <select class="select" id="editSurveyChannel" name="channel">
              ${["Agent nhập liệu", "Khách hàng tự trả lời", "Cả hai kênh"].map((channel) => `<option ${channel === survey.channel ? "selected" : ""}>${channel}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="editSurveyStatus">Trạng thái</label>
            <select class="select" id="editSurveyStatus" name="status">
              ${["Khởi tạo", "Đang hoạt động", "Tạm dừng"].map((status) => `<option ${status === survey.status ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="editSurveyStart">Ngày bắt đầu</label>
            <input class="input" id="editSurveyStart" name="startDate" type="date" value="${escapeHtml(survey.startDate || "")}" />
          </div>
          <div class="field">
            <label for="editSurveyEnd">Ngày kết thúc</label>
            <input class="input" id="editSurveyEnd" name="endDate" type="date" value="${escapeHtml(survey.endDate || "")}" />
          </div>
        </div>
        <div class="form-footer">
          <button class="btn secondary" type="button" data-action="close-modal">Hủy</button>
          <button class="btn primary" type="submit">${icon("save")} Lưu</button>
        </div>
      </form>
    </div>
  `);

  document.querySelector("#surveyEditForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    Object.assign(survey, {
      code: data.code.trim(),
      name: data.name.trim(),
      description: data.description.trim(),
      department: data.department.trim() || "Chưa phân công",
      channel: data.channel,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
    });
    closeModal();
    showToast("Đã cập nhật khảo sát.");
    render();
  });
}

function duplicateSurvey(surveyId) {
  const survey = surveys.find((item) => item.id === surveyId);
  if (!survey) return;
  const copyId = `sv-${Date.now()}`;
  surveys.unshift({
    ...survey,
    id: copyId,
    code: survey.code ? `${survey.code}-COPY` : "",
    name: `${survey.name} (bản sao)`,
    version: 1,
    status: "Khởi tạo",
  });
  const sourceQuestions = questions.filter((question) => question.surveyId === surveyId);
  sourceQuestions.forEach((question, index) => {
    questions.push({ ...question, id: `q-${Date.now()}-${index}`, surveyId: copyId, options: [...(question.options || [])] });
  });
  const sourceRules = rules.filter((rule) => rule.surveyId === surveyId);
  sourceRules.forEach((rule, index) => {
    rules.push({ ...rule, id: `r-${Date.now()}-${index}`, surveyId: copyId });
  });
  showToast("Đã nhân bản khảo sát.");
  render();
}

function deleteSurvey(surveyId) {
  if (false && surveys.length <= 1) {
    showToast("Cần giữ lại ít nhất một khảo sát.");
    return;
  }
  const index = surveys.findIndex((survey) => survey.id === surveyId);
  if (index === -1) return;
  surveys.splice(index, 1);
  for (let i = questions.length - 1; i >= 0; i -= 1) {
    if (questions[i].surveyId === surveyId) questions.splice(i, 1);
  }
  for (let i = rules.length - 1; i >= 0; i -= 1) {
    if (rules[i].surveyId === surveyId) rules.splice(i, 1);
  }
  for (let i = sessions.length - 1; i >= 0; i -= 1) {
    if (sessions[i].surveyId === surveyId) sessions.splice(i, 1);
  }
  if (state.selectedSurveyId === surveyId) state.selectedSurveyId = surveys[0]?.id || null;
  if (!surveys.length && state.view === "surveyDetail") state.view = "surveys";
  showToast("Đã xóa khảo sát trong prototype.");
  render();
}

function renderSurveyDetail() {
  const survey = selectedSurvey();
  if (!survey) {
    content.innerHTML = `
      ${renderHeader(
        "Quản lý Khảo sát",
        "Chưa có khảo sát nào trong prototype. Anh tạo khảo sát mới rồi cấu hình câu hỏi và điều kiện ở cùng màn hình.",
        `<button class="btn primary" data-action="create-survey" type="button">${icon("plus")} Tạo khảo sát mới</button>`,
      )}
      <section class="panel">
        <div class="empty-state">Danh sách đang trống. Chưa có dữ liệu để hiển thị.</div>
      </section>
    `;
    return;
  }
  const surveyQs = selectedQuestions();
  const surveyRs = selectedRules();
  const tabContent = {
    questions: renderQuestionsTab(surveyQs),
    branching: renderBranchingTab(surveyRs),
    entry: renderEntryTab(surveyQs),
  }[state.detailTab || "questions"];

  content.innerHTML = `
    <button class="back-link" type="button" data-action="view-surveys">${icon("arrowLeft")} Quay lại danh sách</button>
    ${renderSurveyInfoBlock(survey, surveyQs.length, surveyRs.length)}

    <div class="tabs" role="tablist">
      <button class="tab-button ${state.detailTab === "questions" ? "active" : ""}" type="button" data-action="detail-tab" data-tab="questions">Câu hỏi</button>
      <button class="tab-button ${state.detailTab === "branching" ? "active" : ""}" type="button" data-action="detail-tab" data-tab="branching">Điều kiện rẽ nhánh</button>
      <button class="tab-button ${state.detailTab === "entry" ? "active" : ""}" type="button" data-action="detail-tab" data-tab="entry">Nhập liệu</button>
    </div>

    ${tabContent}
  `;
}

function renderQuestionsTab(surveyQs) {
  return `
    <section class="panel block-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Danh sách câu hỏi</h2>
          <p class="page-subtitle">${surveyQs.length} câu hỏi trong khảo sát này</p>
        </div>
        <div class="toolbar-left">
          <button class="btn secondary" type="button" data-action="add-rule">${icon("plus")} Thêm điều kiện</button>
          <button class="btn primary" type="button" data-action="add-question" data-testid="add-question">${icon("plus")} Thêm câu hỏi</button>
        </div>
      </div>
      <div class="question-list">
        ${
          surveyQs.length
            ? surveyQs
                .map(
                  (question) => `
                  <article class="question-card ${question.active ? "" : "is-inactive"}">
                    <div class="question-card-main">
                      <div class="question-card-meta">
                        <span class="code-pill">${escapeHtml(question.code)}</span>
                        <span class="type-pill">${escapeHtml(question.type)}</span>
                        ${question.required ? `<span class="type-pill danger-soft">Bắt buộc</span>` : ""}
                        ${questionSupportsOptions(question.type) ? `<span class="type-pill">${answerCount(question)} đáp án</span>` : ""}
                      </div>
                      <h3 class="question-title">${escapeHtml(question.text)}</h3>
                      <div class="item-meta">Thứ tự ${question.order}${question.options?.length ? ` · ${question.options.map(escapeHtml).join(", ")}` : ""}</div>
                    </div>
                    <div class="question-actions">
                      <button class="switch ${question.active ? "on" : ""}" type="button" data-action="toggle-question" data-id="${question.id}" aria-label="${question.active ? "Tắt câu hỏi" : "Bật câu hỏi"}"><span></span></button>
                      ${actionButton("add-rule", question.id, "branch", "Thêm điều kiện từ câu hỏi")}
                      ${actionButton("edit-question", question.id, "edit", "Sửa câu hỏi")}
                      ${actionButton("delete-question", question.id, "trash", "Xóa câu hỏi", "danger")}
                    </div>
                  </article>
                `,
                )
                .join("")
            : `<div class="empty-state">Chưa có câu hỏi. Hãy thêm câu hỏi đầu tiên.</div>`
        }
      </div>
    </section>
  `;
}

function renderBranchingTab(surveyRs) {
  return `
    <section class="panel block-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Điều kiện rẽ nhánh</h2>
          <p class="page-subtitle">${surveyRs.length} điều kiện đang áp dụng trong khảo sát này</p>
        </div>
        <div class="toolbar-left">
          <button class="btn secondary" type="button" data-action="check-rule-loop">${icon("branch")} Kiểm tra vòng lặp</button>
          <button class="btn primary" type="button" data-action="add-rule" data-testid="add-rule">${icon("plus")} Thêm điều kiện</button>
        </div>
      </div>
      <div class="rule-list">
        ${
          surveyRs.length
            ? surveyRs
                .map(
                  (rule) => `
                  <article class="rule-card ${rule.active ? "" : "is-inactive"}">
                    <div class="rule-card-main">
                      <div class="question-card-meta">
                        <span class="code-pill">${escapeHtml(rule.code)}</span>
                        <span class="type-pill">Ưu tiên ${rule.priority}</span>
                        <span class="type-pill">${escapeHtml(rule.operator)}</span>
                      </div>
                      <h3 class="question-title">${escapeHtml(rule.name)}</h3>
                      <div class="rule-flow">
                        <span>${escapeHtml(rule.source || "—")}</span>
                        <span>${escapeHtml(rule.operator)}</span>
                        <span>${escapeHtml(rule.value || "—")}</span>
                        <span>→</span>
                        <span>${escapeHtml(rule.action)}</span>
                        <span>${escapeHtml(rule.target || "—")}</span>
                      </div>
                      ${rule.description ? `<p class="item-meta">${escapeHtml(rule.description)}</p>` : ""}
                    </div>
                    <div class="question-actions">
                      ${actionButton("view-rule", rule.id, "eye", "Xem điều kiện")}
                      <button class="switch ${rule.active ? "on" : ""}" type="button" data-action="toggle-rule" data-id="${rule.id}" aria-label="${rule.active ? "Tắt điều kiện" : "Bật điều kiện"}"><span></span></button>
                      ${actionButton("edit-rule", rule.id, "edit", "Sửa điều kiện")}
                      ${actionButton("delete-rule", rule.id, "trash", "Xóa điều kiện", "danger")}
                    </div>
                  </article>
                `,
                )
                .join("")
            : `<div class="empty-state">Chưa có điều kiện rẽ nhánh. Hãy thêm điều kiện đầu tiên.</div>`
        }
      </div>
    </section>
  `;
}

function renderEntryTab(surveyQs) {
  const survey = selectedSurvey();
  const surveySessions = survey ? sessions.filter((session) => session.surveyId === survey.id) : [];
  const current = surveyQs[state.selectedQuestionIndex] || surveyQs[0];

  return `
    <section class="panel block-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Phiên nhập liệu</h2>
          <p class="page-subtitle">${surveySessions.length} phiên nhập liệu của khảo sát này</p>
        </div>
        <button class="btn primary" type="button" data-action="complete-session">Hoàn thành phiên mẫu</button>
      </div>
      <section class="entry-layout embedded-entry">
        <aside class="entry-list" aria-label="Danh sách câu hỏi">
          ${surveyQs
            .map(
              (question, index) => `
              <button class="entry-card ${index === state.selectedQuestionIndex ? "active" : ""}" type="button" data-action="select-question" data-index="${index}">
                <h3 class="item-title">${escapeHtml(question.code)}</h3>
                <div class="item-meta">${escapeHtml(question.text)}</div>
              </button>
            `,
            )
            .join("")}
        </aside>
        <article class="entry-answer-panel">
          ${
            current
              ? `
              <div class="panel-header">
                <h2 class="panel-title">${escapeHtml(current.code)} · ${escapeHtml(current.type)}</h2>
                ${badge(current.required ? "Bắt buộc" : "Tùy chọn", current.required)}
              </div>
              <div style="padding: 20px">
                <h3 class="question-title">${escapeHtml(current.text)}</h3>
                ${renderAnswerControl(current)}
                <div class="form-footer">
                  <button class="btn secondary" type="button" data-action="prev-question">Trước</button>
                  <button class="btn primary" type="button" data-action="next-question">Tiếp</button>
                </div>
              </div>
            `
              : `<div class="empty-state">Khảo sát này chưa có câu hỏi.</div>`
          }
        </article>
      </section>
      <div class="session-strip">
        ${surveySessions.length ? surveySessions.map((session) => `<span class="type-pill">${escapeHtml(session.id)} · ${escapeHtml(session.customer)} · ${escapeHtml(session.status)}</span>`).join("") : `<span class="item-meta">Chưa có phiên nhập liệu.</span>`}
      </div>
    </section>
  `;
}

function renderBranching() {
  const survey = selectedSurvey();
  if (!survey) {
    content.innerHTML = `
      ${renderHeader(
        "Điều kiện Rẽ nhánh",
        "Chưa có khảo sát để cấu hình điều kiện rẽ nhánh.",
        `<button class="btn primary" data-action="create-survey" type="button">${icon("plus")} Tạo khảo sát mới</button>`,
      )}
      <section class="panel">
        <div class="empty-state">Tạo khảo sát trước, sau đó thêm câu hỏi và điều kiện rẽ nhánh.</div>
      </section>
    `;
    return;
  }
  const surveyRs = selectedRules();

  content.innerHTML = `
    ${renderHeader(
      "Điều kiện Rẽ nhánh",
      `Quản lý logic hiển thị, bỏ qua hoặc bắt buộc câu hỏi cho ${survey.name}.`,
      `<button class="btn primary" type="button" data-action="add-rule" data-testid="add-rule">${icon("plus")} Thêm điều kiện</button>`,
    )}
    <div class="toolbar">
      <div class="toolbar-left">
        <select class="select" id="branchSurvey" style="width: 280px">
          ${surveys.map((item) => `<option value="${item.id}" ${item.id === survey.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
        </select>
      </div>
    </div>
    <section class="panel">
      <div class="panel-header">
        <h2 class="panel-title">Danh sách điều kiện</h2>
        <span class="item-meta">${surveyRs.length} bản ghi</span>
      </div>
      ${
        surveyRs.length
          ? surveyRs
              .map(
                (rule) => `
                <div class="rule-row">
                  <span class="code-pill">${escapeHtml(rule.code)}</span>
                  <div>
                    <h3 class="item-title">${escapeHtml(rule.name)}</h3>
                    <div class="item-meta">Nếu ${escapeHtml(rule.source)} ${escapeHtml(rule.operator)} ${escapeHtml(rule.value)} thì ${escapeHtml(rule.action)} ${escapeHtml(rule.target)}</div>
                  </div>
                  <span class="type-pill">Ưu tiên ${rule.priority}</span>
                  ${badge(rule.active ? "Kích hoạt" : "Tắt", rule.active)}
                </div>
              `,
              )
              .join("")
          : `<div class="empty-state">Chưa có điều kiện cho khảo sát này.</div>`
      }
    </section>
  `;

  document.querySelector("#branchSurvey").addEventListener("change", (event) => {
    state.selectedSurveyId = event.target.value;
    renderBranching();
  });
}

function renderEntry() {
  const survey = selectedSurvey();
  if (!survey) {
    content.innerHTML = `
      ${renderHeader(
        "Nhập liệu Khảo sát",
        "Chưa có khảo sát để nhập dữ liệu mẫu.",
        `<button class="btn primary" data-action="create-survey" type="button">${icon("plus")} Tạo khảo sát mới</button>`,
      )}
      <section class="panel">
        <div class="empty-state">Tạo khảo sát và câu hỏi trước khi nhập dữ liệu.</div>
      </section>
    `;
    return;
  }
  const surveyQs = selectedQuestions();
  const current = surveyQs[state.selectedQuestionIndex] || surveyQs[0];

  content.innerHTML = `
    ${renderHeader("Nhập liệu Khảo sát", "Màn hình agent nhập câu trả lời mẫu cho một phiên khảo sát.")}
    <div class="toolbar">
      <div class="toolbar-left">
        <select class="select" id="entrySurvey" style="width: 280px">
          ${surveys.map((item) => `<option value="${item.id}" ${item.id === survey.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
        </select>
      </div>
      <button class="btn primary" type="button" data-action="complete-session">Hoàn thành phiên</button>
    </div>
    <section class="entry-layout">
      <aside class="entry-list" aria-label="Danh sách câu hỏi">
        ${surveyQs
          .map(
            (question, index) => `
            <button class="entry-card ${index === state.selectedQuestionIndex ? "active" : ""}" type="button" data-action="select-question" data-index="${index}">
              <h3 class="item-title">${escapeHtml(question.code)}</h3>
              <div class="item-meta">${escapeHtml(question.text)}</div>
            </button>
          `,
          )
          .join("")}
      </aside>
      <article class="panel">
        ${
          current
            ? `
            <div class="panel-header">
              <h2 class="panel-title">${escapeHtml(current.code)} · ${escapeHtml(current.type)}</h2>
              ${badge(current.required ? "Bắt buộc" : "Tùy chọn", current.required)}
            </div>
            <div style="padding: 20px">
              <h3 class="item-title" style="font-size: 18px">${escapeHtml(current.text)}</h3>
              ${renderAnswerControl(current)}
              <div class="form-footer">
                <button class="btn secondary" type="button" data-action="prev-question">Trước</button>
                <button class="btn primary" type="button" data-action="next-question">Tiếp</button>
              </div>
            </div>
          `
            : `<div class="empty-state">Khảo sát này chưa có câu hỏi.</div>`
        }
      </article>
    </section>
  `;

  document.querySelector("#entrySurvey").addEventListener("change", (event) => {
    state.selectedSurveyId = event.target.value;
    state.selectedQuestionIndex = 0;
    renderEntry();
  });
}

function renderAnswerControl(question) {
  const value = state.answers[question.code] || "";
  if (question.type === "Chọn một đáp án" || question.type === "Đánh giá") {
    return `
      <div class="answer-stack">
        ${(question.options || [])
          .map(
            (option) => `
            <label class="answer-option">
              <input type="radio" name="answer-${question.code}" value="${escapeHtml(option)}" ${value === option ? "checked" : ""} data-answer="${question.code}" />
              <span>${escapeHtml(option)}</span>
            </label>
          `,
          )
          .join("")}
      </div>
    `;
  }

  if (question.type === "Chọn nhiều đáp án") {
    const values = Array.isArray(value) ? value : [];
    return `
      <div class="answer-stack">
        ${(question.options || [])
          .map(
            (option) => `
            <label class="answer-option">
              <input type="checkbox" value="${escapeHtml(option)}" ${values.includes(option) ? "checked" : ""} data-multi-answer="${question.code}" />
              <span>${escapeHtml(option)}</span>
            </label>
          `,
          )
          .join("")}
      </div>
    `;
  }

  if (question.type === "Văn bản dài") {
    return `<textarea class="textarea" style="margin-top: 16px; min-height: 130px" data-answer-text="${question.code}" placeholder="${escapeHtml(question.placeholder || "Nhập nội dung trả lời...")}">${escapeHtml(value)}</textarea>`;
  }

  const type = question.type === "Số" ? "number" : question.type === "Ngày" ? "date" : "text";
  return `<input class="input" style="margin-top: 16px" type="${type}" data-answer-text="${question.code}" value="${escapeHtml(value)}" placeholder="${escapeHtml(question.placeholder || "Nhập câu trả lời...")}" />`;
}

function renderAnswerOptionRows(options) {
  return options
    .map(
      (option, index) => `
        <div class="answer-option-row">
          <input class="input" name="optionValue" value="${escapeHtml(option)}" placeholder="Đáp án ${index + 1}" />
          <button class="icon-action danger" type="button" data-action="remove-answer-option" aria-label="Xóa đáp án">${icon("trash")}</button>
        </div>
      `,
    )
    .join("");
}

function updateAnswerOptionsVisibility() {
  const form = document.querySelector("#questionForm");
  if (!form) return;
  const panel = form.querySelector("#answerOptionsPanel");
  const type = form.elements.type.value;
  panel.hidden = !questionSupportsOptions(type);
  if (questionSupportsOptions(type) && !panel.querySelector("[name='optionValue']")) {
    panel.querySelector(".answer-option-list").innerHTML = renderAnswerOptionRows(defaultOptionsForType(type));
  }
}

function openQuestionModal(questionId = null) {
  const surveyQs = selectedQuestions();
  const editingQuestion = questionId ? questions.find((question) => question.id === questionId) : null;
  const isEditing = Boolean(editingQuestion);
  const nextOrder = surveyQs.length + 1;
  const nextCode = `Q${String(nextOrder).padStart(2, "0")}`;
  const selectedType = editingQuestion?.type || "Chọn một đáp án";
  const optionValues = editingQuestion?.options?.length ? editingQuestion.options : defaultOptionsForType(selectedType);
  openModal(`
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="questionModalTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="questionModalTitle">${isEditing ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}</h2>
        <button class="modal-close" type="button" data-action="close-modal" aria-label="Đóng">×</button>
      </div>
      <form class="modal-body" id="questionForm">
        <div class="form-grid three">
          <div class="field">
            <label for="questionCode">Mã câu hỏi</label>
            <input class="input" id="questionCode" name="code" value="${escapeHtml(editingQuestion?.code || nextCode)}" placeholder="Q01" />
          </div>
          <div class="field">
            <label for="questionOrder">Thứ tự</label>
            <input class="input" id="questionOrder" name="order" type="number" min="1" value="${editingQuestion?.order || nextOrder}" />
          </div>
          <div class="field">
            <label for="questionType">Loại câu hỏi</label>
            <select class="select" id="questionType" name="type">
              ${["Chọn một đáp án", "Chọn nhiều đáp án", "Văn bản ngắn", "Văn bản dài", "Số", "Đánh giá", "Ngày"]
                .map((type) => `<option ${type === selectedType ? "selected" : ""}>${type}</option>`)
                .join("")}
            </select>
          </div>
          <div class="field full">
            <label for="questionText">Nội dung câu hỏi <span class="required">*</span></label>
            <textarea class="textarea" id="questionText" name="text" required placeholder="Nhập nội dung câu hỏi...">${escapeHtml(editingQuestion?.text || "")}</textarea>
          </div>
          <div class="field full">
            <label for="questionScript">Kịch bản Agent (gợi ý đọc)</label>
            <textarea class="textarea" id="questionScript" name="agentScript" placeholder="Lời dẫn dắt cho agent khi hỏi...">${escapeHtml(editingQuestion?.agentScript || "")}</textarea>
          </div>
          <div class="field">
            <label for="questionGuide">Văn bản hướng dẫn</label>
            <input class="input" id="questionGuide" name="guideText" value="${escapeHtml(editingQuestion?.guideText || "")}" placeholder="Ghi chú hỗ trợ" />
          </div>
          <div class="field">
            <label for="questionPlaceholder">Placeholder</label>
            <input class="input" id="questionPlaceholder" name="placeholder" value="${escapeHtml(editingQuestion?.placeholder || "")}" />
          </div>
        </div>
        <section class="answer-options-panel" id="answerOptionsPanel" ${questionSupportsOptions(selectedType) ? "" : "hidden"}>
          <div class="block-heading compact">
            <div>
              <p class="block-eyebrow">Đáp án</p>
              <h3 class="block-title">Danh sách lựa chọn</h3>
            </div>
            <button class="btn secondary" type="button" data-action="add-answer-option">${icon("plus")} Thêm đáp án</button>
          </div>
          <div class="answer-option-list">
            ${renderAnswerOptionRows(optionValues)}
          </div>
        </section>
        <div class="check-row">
          <label><input type="checkbox" name="required" ${editingQuestion?.required ? "checked" : ""} /> Bắt buộc trả lời</label>
          <label><input type="checkbox" name="active" ${editingQuestion?.active === false ? "" : "checked"} /> Hoạt động</label>
        </div>
        <div class="form-footer">
          <button class="btn secondary" type="button" data-action="close-modal">Hủy</button>
          <button class="btn primary" type="submit">${icon("save")} Lưu</button>
        </div>
      </form>
    </div>
  `);

  document.querySelector("#questionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const type = data.type;
    const optionFields = [...form.querySelectorAll("[name='optionValue']")].map((input) => input.value.trim()).filter(Boolean);
    const options = questionSupportsOptions(type) ? optionFields : [];
    const payload = {
      surveyId: selectedSurvey().id,
      code: data.code.trim() || nextCode,
      order: Number(data.order) || nextOrder,
      type,
      text: data.text.trim(),
      required: form.elements.required.checked,
      options: questionSupportsOptions(type) ? options : [],
      agentScript: data.agentScript.trim(),
      guideText: data.guideText.trim(),
      placeholder: data.placeholder.trim(),
      active: form.elements.active.checked,
    };
    if (isEditing) Object.assign(editingQuestion, payload);
    else questions.push({ id: `q-${Date.now()}`, ...payload });
    closeModal();
    showToast(isEditing ? "Đã cập nhật câu hỏi." : "Đã thêm câu hỏi mới.");
    render();
  });

  document.querySelector("#questionType").addEventListener("change", (event) => {
    const list = document.querySelector(".answer-option-list");
    if (questionSupportsOptions(event.target.value)) {
      list.innerHTML = renderAnswerOptionRows(defaultOptionsForType(event.target.value));
    }
    updateAnswerOptionsVisibility();
  });
  updateAnswerOptionsVisibility();
}

function comparisonValueOptions(question, selectedValue = "") {
  const values = question?.options?.length ? question.options : defaultOptionsForType(question?.type);
  if (!values.length) return `<option value="">-- Câu hỏi này chưa có danh sách giá trị --</option>`;
  return `
    <option value="">-- Chọn giá trị --</option>
    ${values.map((value) => `<option value="${escapeHtml(value)}" ${value === selectedValue ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}
  `;
}

function updateRuleValueOptions(selectedValue = "") {
  const form = document.querySelector("#ruleForm");
  if (!form) return;
  const sourceCode = form.elements.source.value;
  const sourceQuestion = selectedQuestions().find((question) => question.code === sourceCode);
  const valueSelect = form.querySelector("#ruleValue");
  valueSelect.innerHTML = comparisonValueOptions(sourceQuestion, selectedValue);
}

function openRuleModal(ruleId = null, sourceQuestionId = null) {
  const surveyQs = selectedQuestions();
  const editingRule = ruleId ? rules.find((rule) => rule.id === ruleId) : null;
  const preselectedQuestion = sourceQuestionId ? surveyQs.find((question) => question.id === sourceQuestionId) : null;
  const isEditing = Boolean(editingRule);
  const nextOrder = selectedRules().length + 1;
  const selectedSourceCode = editingRule?.source || preselectedQuestion?.code || surveyQs[0]?.code || "";
  const selectedSourceQuestion = surveyQs.find((question) => question.code === selectedSourceCode);
  const optionList = (selectedCode = "") =>
    surveyQs.length
      ? surveyQs.map((question) => `<option value="${question.code}" ${question.code === selectedCode ? "selected" : ""}>${question.code} - ${escapeHtml(question.text)}</option>`).join("")
      : `<option value="">-- Chọn câu hỏi --</option>`;

  openModal(`
    <div class="modal wide" role="dialog" aria-modal="true" aria-labelledby="ruleModalTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="ruleModalTitle">${isEditing ? "Sửa điều kiện rẽ nhánh" : "Thêm điều kiện rẽ nhánh"}</h2>
        <button class="modal-close" type="button" data-action="close-modal" aria-label="Đóng">×</button>
      </div>
      <form class="modal-body" id="ruleForm">
        <div class="form-grid">
          <div class="field">
            <label for="ruleCode">Mã điều kiện</label>
            <input class="input" id="ruleCode" name="code" value="${escapeHtml(editingRule?.code || `R${String(nextOrder).padStart(2, "0")}`)}" placeholder="R01" />
          </div>
          <div class="field">
            <label for="ruleName">Tên điều kiện <span class="required">*</span></label>
            <input class="input" id="ruleName" name="name" required value="${escapeHtml(editingRule?.name || "")}" placeholder="VD: Hiển thị Q3 khi Q1 = Có" />
          </div>
          <div class="field full">
            <label for="ruleDescription">Mô tả</label>
            <input class="input" id="ruleDescription" name="description" value="${escapeHtml(editingRule?.description || "")}" placeholder="Mô tả mục đích điều kiện" />
          </div>
        </div>

        <section class="condition-box">
          <h3 class="section-label">NẾU (ĐIỀU KIỆN)</h3>
          <div class="form-grid">
            <div class="field full">
              <label for="ruleSource">Câu hỏi nguồn <span class="required">*</span></label>
              <select class="select" id="ruleSource" name="source" required>
                ${optionList(selectedSourceCode)}
              </select>
            </div>
            <div class="field">
              <label for="ruleOperator">Toán tử so sánh</label>
              <select class="select" id="ruleOperator" name="operator">
                ${["Bằng (=)", "Khác (!=)", "Lớn hơn", "Nhỏ hơn", "Nhỏ hơn hoặc bằng", "Có chứa"].map((operator) => `<option ${operator === editingRule?.operator ? "selected" : ""}>${operator}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label for="ruleValue">Giá trị so sánh</label>
              <select class="select" id="ruleValue" name="value" required>
                ${comparisonValueOptions(selectedSourceQuestion, editingRule?.value || "")}
              </select>
            </div>
          </div>
        </section>

        <section class="action-box">
          <h3 class="section-label blue">THÌ (HÀNH ĐỘNG)</h3>
          <div class="form-grid">
            <div class="field">
              <label for="ruleAction">Loại hành động</label>
              <select class="select" id="ruleAction" name="action">
                ${["Hiển thị câu hỏi", "Ẩn câu hỏi", "Bỏ qua câu hỏi", "Bắt buộc trả lời"].map((action) => `<option ${action === editingRule?.action ? "selected" : ""}>${action}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label for="ruleTarget">Câu hỏi đích</label>
              <select class="select" id="ruleTarget" name="target">
                <option value="">-- Chọn câu hỏi --</option>
                ${optionList(editingRule?.target)}
              </select>
            </div>
          </div>
        </section>

        <div class="field" style="margin-top: 16px; max-width: 125px">
          <label for="rulePriority">Độ ưu tiên</label>
          <input class="input" id="rulePriority" name="priority" type="number" min="1" value="${editingRule?.priority || nextOrder}" />
        </div>
        <div class="check-row">
          <label><input type="checkbox" name="active" ${editingRule?.active === false ? "" : "checked"} /> Kích hoạt điều kiện</label>
        </div>
        <div class="form-footer">
          <button class="btn secondary" type="button" data-action="close-modal">Hủy</button>
          <button class="btn primary" type="submit">${icon("save")} Lưu</button>
        </div>
      </form>
    </div>
  `);

  document.querySelector("#ruleForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = {
      surveyId: selectedSurvey().id,
      code: data.code.trim() || `R${String(nextOrder).padStart(2, "0")}`,
      name: data.name.trim(),
      description: data.description.trim(),
      source: data.source,
      operator: data.operator,
      value: data.value.trim(),
      action: data.action,
      target: data.target,
      priority: Number(data.priority) || nextOrder,
      active: form.elements.active.checked,
    };
    if (isEditing) Object.assign(editingRule, payload);
    else rules.push({ id: `r-${Date.now()}`, ...payload });
    closeModal();
    showToast(isEditing ? "Đã cập nhật điều kiện rẽ nhánh." : "Đã thêm điều kiện rẽ nhánh.");
    render();
  });

  document.querySelector("#ruleSource").addEventListener("change", () => updateRuleValueOptions());
}

function openModal(html) {
  modalRoot.innerHTML = `<div class="modal-backdrop" data-action="backdrop">${html}</div>`;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalRoot.innerHTML = "";
  document.body.style.overflow = "";
  pendingConfirm = null;
}

function openConfirmModal({ title, message, confirmText = "Xóa", onConfirm }) {
  pendingConfirm = onConfirm;
  openModal(`
    <div class="modal confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="confirmModalTitle">${escapeHtml(title)}</h2>
        <button class="modal-close" type="button" data-action="close-modal" aria-label="Đóng">×</button>
      </div>
      <div class="modal-body">
        <p class="confirm-copy">${escapeHtml(message)}</p>
        <div class="form-footer">
          <button class="btn secondary" type="button" data-action="close-modal">Hủy</button>
          <button class="btn danger" type="button" data-action="confirm-delete">${escapeHtml(confirmText)}</button>
        </div>
      </div>
    </div>
  `);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    state.search = "";
    if (state.view === "entry") state.selectedQuestionIndex = 0;
    render();
  });
});

document.addEventListener("click", (event) => {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;

  if (action === "confirm-delete") {
    const callback = pendingConfirm;
    pendingConfirm = null;
    closeModal();
    if (callback) callback();
    return;
  }

  if (action === "delete-question") {
    const question = questions.find((item) => item.id === actionTarget.dataset.id);
    openConfirmModal({
      title: "Xóa câu hỏi?",
      message: `Câu hỏi "${question?.code || "đã chọn"}" sẽ bị xóa khỏi khảo sát hiện tại.`,
      confirmText: "Xóa câu hỏi",
      onConfirm: () => {
        const index = questions.findIndex((item) => item.id === actionTarget.dataset.id);
        if (index >= 0) {
          questions.splice(index, 1);
          showToast("Đã xóa câu hỏi trong prototype.");
          render();
        }
      },
    });
    return;
  }

  if (action === "delete-rule") {
    const rule = rules.find((item) => item.id === actionTarget.dataset.id);
    openConfirmModal({
      title: "Xóa điều kiện?",
      message: `Điều kiện "${rule?.code || "đã chọn"}" sẽ bị xóa khỏi khảo sát hiện tại.`,
      confirmText: "Xóa điều kiện",
      onConfirm: () => {
        const index = rules.findIndex((item) => item.id === actionTarget.dataset.id);
        if (index >= 0) {
          rules.splice(index, 1);
          showToast("Đã xóa điều kiện rẽ nhánh.");
          render();
        }
      },
    });
    return;
  }

  if (action === "create-survey") {
    state.view = "createSurvey";
    render();
  }
  if (action === "cancel-create" || action === "back-dashboard") {
    state.view = "dashboard";
    render();
  }
  if (action === "view-surveys") {
    state.view = "surveys";
    render();
  }
  if (action === "open-survey") {
    state.selectedSurveyId = actionTarget.dataset.id;
    state.detailTab = "questions";
    state.view = "surveyDetail";
    render();
  }
  if (action === "edit-survey") openSurveyEditModal(actionTarget.dataset.id);
  if (action === "duplicate-survey") duplicateSurvey(actionTarget.dataset.id);
  if (action === "delete-survey") {
    const survey = surveys.find((item) => item.id === actionTarget.dataset.id);
    openConfirmModal({
      title: "Xóa khảo sát?",
      message: `Khảo sát "${survey?.name || "đã chọn"}" cùng câu hỏi, điều kiện và phiên nhập liệu liên quan sẽ bị xóa khỏi prototype.`,
      confirmText: "Xóa khảo sát",
      onConfirm: () => deleteSurvey(actionTarget.dataset.id),
    });
  }
  if (action === "add-question") openQuestionModal();
  if (action === "edit-question") openQuestionModal(actionTarget.dataset.id);
  if (action === "toggle-question") {
    const question = questions.find((item) => item.id === actionTarget.dataset.id);
    if (question) {
      question.active = !question.active;
      showToast(question.active ? "Đã bật câu hỏi." : "Đã tắt câu hỏi.");
      render();
    }
  }
  if (action === "delete-question") {
    const index = questions.findIndex((item) => item.id === actionTarget.dataset.id);
    if (index >= 0) {
      questions.splice(index, 1);
      showToast("Đã xóa câu hỏi trong prototype.");
      render();
    }
  }
  if (action === "add-answer-option") {
    const list = document.querySelector(".answer-option-list");
    if (list) list.insertAdjacentHTML("beforeend", renderAnswerOptionRows([""]));
  }
  if (action === "remove-answer-option") {
    const row = actionTarget.closest(".answer-option-row");
    const list = actionTarget.closest(".answer-option-list");
    if (row && list && list.querySelectorAll(".answer-option-row").length > 1) row.remove();
    else showToast("Cần giữ lại ít nhất một đáp án.");
  }
  if (action === "add-rule") openRuleModal(null, actionTarget.dataset.id);
  if (action === "view-rule") {
    const rule = rules.find((item) => item.id === actionTarget.dataset.id);
    if (rule) showToast(`${rule.code}: nếu ${rule.source} ${rule.operator} ${rule.value} thì ${rule.action} ${rule.target}`);
  }
  if (action === "edit-rule") openRuleModal(actionTarget.dataset.id);
  if (action === "toggle-rule") {
    const rule = rules.find((item) => item.id === actionTarget.dataset.id);
    if (rule) {
      rule.active = !rule.active;
      showToast(rule.active ? "Đã bật điều kiện." : "Đã tắt điều kiện.");
      render();
    }
  }
  if (action === "delete-rule") {
    const index = rules.findIndex((item) => item.id === actionTarget.dataset.id);
    if (index >= 0) {
      rules.splice(index, 1);
      showToast("Đã xóa điều kiện rẽ nhánh.");
      render();
    }
  }
  if (action === "check-rule-loop") {
    showToast("Prototype: chưa phát hiện vòng lặp trong điều kiện hiện tại.");
  }
  if (action === "close-modal") closeModal();
  if (action === "backdrop" && event.target === actionTarget) return;
  if (action === "detail-tab") {
    state.detailTab = actionTarget.dataset.tab;
    if (state.detailTab === "entry") state.selectedQuestionIndex = 0;
    renderSurveyDetail();
  }
  if (action === "goto-branching") {
    state.detailTab = "branching";
    renderSurveyDetail();
  }
  if (action === "goto-entry") {
    state.detailTab = "entry";
    state.selectedQuestionIndex = 0;
    renderSurveyDetail();
  }
  if (action === "select-question") {
    state.selectedQuestionIndex = Number(actionTarget.dataset.index);
    if (state.view === "surveyDetail") renderSurveyDetail();
    else renderEntry();
  }
  if (action === "next-question") {
    state.selectedQuestionIndex = Math.min(state.selectedQuestionIndex + 1, Math.max(selectedQuestions().length - 1, 0));
    if (state.view === "surveyDetail") renderSurveyDetail();
    else renderEntry();
  }
  if (action === "prev-question") {
    state.selectedQuestionIndex = Math.max(state.selectedQuestionIndex - 1, 0);
    if (state.view === "surveyDetail") renderSurveyDetail();
    else renderEntry();
  }
  if (action === "complete-session") showToast("Phiên nhập liệu mẫu đã được đánh dấu hoàn thành.");
});

document.addEventListener("change", (event) => {
  const answerCode = event.target.dataset.answer;
  if (answerCode) state.answers[answerCode] = event.target.value;

  const multiCode = event.target.dataset.multiAnswer;
  if (multiCode) {
    const values = new Set(Array.isArray(state.answers[multiCode]) ? state.answers[multiCode] : []);
    if (event.target.checked) values.add(event.target.value);
    else values.delete(event.target.value);
    state.answers[multiCode] = [...values];
  }
});

document.addEventListener("input", (event) => {
  const answerCode = event.target.dataset.answerText;
  if (answerCode) state.answers[answerCode] = event.target.value;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalRoot.innerHTML) closeModal();
});

render();
