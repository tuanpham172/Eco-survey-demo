const state = {
  view: "dashboard",
  selectedSurveyId: null,
  selectedCustomerId: null,
  detailTab: "questions",
  selectedQuestionIndex: 0,
  entryHistory: [],
  search: "",
  searchDraft: "",
  statusFilter: "all",
  customerSearch: "",
  customerSearchDraft: "",
  reportSurveyFilter: "all",
  reportSurveyDraft: "",
  reportCustomerFilter: "",
  reportCustomerDraft: "",
  reportFrom: "",
  reportTo: "",
  currentRole: "SYSTEM_ADMIN",
  answers: {},
};

const currentUser = {
  username: "survey.admin@eco.local",
  displayName: "Survey Admin",
};

const SURVEY_STATUSES = ["Khởi tạo", "Chờ duyệt", "Hoạt động", "Ngưng hoạt động", "Hết hạn", "Kết thúc", "Đang hoạt động", "Tạm dừng"];
const MATRIX_QUESTIONS_ENABLED = true;
const RANKING_TYPE = "Sắp xếp thứ tự ưu tiên";
const RANKING_POSITION_OPERATOR = "Lựa chọn đứng vị trí bằng N";
const TOP_N_TYPE = "Chọn Top N";
const MATRIX_MULTI_TYPE = "Ma trận nhiều lựa chọn";
const MATRIX_RATING_TYPE = "Đánh giá ma trận";

const roleCatalog = [
  { code: "SYSTEM_ADMIN", name: "Quản trị hệ thống", permissions: ["SURVEY_CREATE", "SURVEY_EDIT", "SURVEY_PUBLISH", "QUESTION_EDIT", "RULE_EDIT", "SESSION_START", "SESSION_SUBMIT", "RESPONSE_VIEW_LIST", "RAW_DATA_EXPORT", "AUDIT_VIEW"] },
  { code: "SURVEY_CONFIGURATOR", name: "Người cấu hình khảo sát", permissions: ["SURVEY_CREATE", "SURVEY_EDIT", "QUESTION_EDIT", "RULE_EDIT", "SURVEY_PREVIEW"] },
  { code: "SURVEY_APPROVER", name: "Người duyệt khảo sát", permissions: ["SURVEY_VIEW", "SURVEY_PREVIEW", "SURVEY_PUBLISH", "SURVEY_ARCHIVE"] },
  { code: "DATA_BI", name: "Người xem/xuất báo cáo", permissions: ["RESPONSE_VIEW_LIST", "RAW_DATA_EXPORT"] },
  { code: "AGENT_VIA_SALESFORCE", name: "Nhân viên tổng đài từ Salesforce", permissions: ["SESSION_START", "SESSION_SUBMIT"] },
];

const permissionCatalog = [
  { code: "SURVEY_CREATE", label: "Tạo khảo sát", group: "Cấu hình khảo sát", description: "Tạo khảo sát ở trạng thái khởi tạo" },
  { code: "SURVEY_EDIT", label: "Sửa khảo sát", group: "Cấu hình khảo sát", description: "Sửa thông tin khảo sát khi còn được phép" },
  { code: "SURVEY_PUBLISH", label: "Duyệt/kích hoạt khảo sát", group: "Cấu hình khảo sát", description: "Đưa khảo sát sang trạng thái hoạt động sau khi kiểm tra" },
  { code: "SURVEY_ARCHIVE", label: "Ngưng khảo sát", group: "Cấu hình khảo sát", description: "Ngưng hoạt động khảo sát nhưng giữ lịch sử" },
  { code: "QUESTION_EDIT", label: "Cấu hình câu hỏi", group: "Câu hỏi", description: "Tạo, sửa, bật/tắt câu hỏi" },
  { code: "RULE_EDIT", label: "Cấu hình rẽ nhánh", group: "Điều kiện rẽ nhánh", description: "Tạo, sửa, bật/tắt điều kiện rẽ nhánh" },
  { code: "SESSION_START", label: "Bắt đầu khảo sát", group: "Nhập liệu", description: "Bắt đầu phiên khảo sát cho khách hàng" },
  { code: "SESSION_SUBMIT", label: "Hoàn thành khảo sát", group: "Nhập liệu", description: "Gửi kết quả và hoàn thành phiên khảo sát" },
  { code: "RESPONSE_VIEW_LIST", label: "Xem báo cáo", group: "Báo cáo", description: "Xem danh sách kết quả khảo sát" },
  { code: "RAW_DATA_EXPORT", label: "Xuất dữ liệu thô", group: "Báo cáo", description: "Xuất file CSV dữ liệu khảo sát" },
  { code: "AUDIT_VIEW", label: "Xem lịch sử thao tác", group: "Nhật ký", description: "Xem lịch sử xuất dữ liệu và thao tác quan trọng" },
];

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
  q("q2", "sv-test-2", "Q02", 2, "Văn bản", "Mã căn hộ hoặc mã khách hàng của anh/chị là gì?", true),
  q("q3", "sv-test-2", "Q03", 3, "Văn bản", "Anh/chị cần ECO hỗ trợ thêm nội dung nào?", false),
  q("q4", "sv-test-2", "Q04", 4, "Số", "Anh/chị đánh giá tốc độ phản hồi của tổng đài bao nhiêu điểm?", true),
  q("q5", "sv-test-2", "Q05", 5, "Đánh giá", "Mức độ hài lòng chung của anh/chị?", true, ["1", "2", "3", "4", "5"]),
  q("q6", "sv-test-2", "Q06", 6, "Ngày", "Ngày anh/chị cần được gọi lại là khi nào?", false),
  q("q7", "sv-test-2", "Q07", 7, "Chọn nhiều đáp án", "Anh/chị quan tâm nhóm thông tin nào?", false, ["Phí dịch vụ", "Tiện ích", "Bảo trì", "Sự kiện"]),
  q("q8", "sv-25-6", "Q01", 1, "Chọn một đáp án", "Khách hàng có đồng ý tham gia khảo sát không?", true, ["Có", "Không"]),
  q("q9", "sv-25-6", "Q02", 2, "Đánh giá", "Khách hàng đánh giá thái độ phục vụ của agent?", true, ["1", "2", "3", "4", "5"]),
  q("q10", "sv-25-6", "Q03", 3, "Văn bản", "Ghi chú phản hồi nổi bật của khách hàng.", false),
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

const reports = [];
const exportAudits = [];

const users = [
  { id: "user-admin", username: "survey.admin@eco.local", displayName: "Survey Admin", roleCode: "SYSTEM_ADMIN", status: "Hoạt động", allowAgentEntry: true, allowPermissionConfig: true },
  { id: "user-agent-1", username: "agent.nguyen@salesforce.local", displayName: "Agent Nguyễn", roleCode: "AGENT_VIA_SALESFORCE", status: "Hoạt động", allowAgentEntry: true, allowPermissionConfig: false },
  { id: "user-agent-2", username: "agent.tran@salesforce.local", displayName: "Agent Trần", roleCode: "AGENT_VIA_SALESFORCE", status: "Không hoạt động", allowAgentEntry: false, allowPermissionConfig: false },
  { id: "user-data", username: "data.bi@eco.local", displayName: "Data BI", roleCode: "DATA_BI", status: "Hoạt động", allowAgentEntry: false, allowPermissionConfig: false },
];

const customers = [
  { id: "cus-1", code: "KH001", name: "Nguyễn Minh", phone: "0901 234 567", apartment: "A-1201", status: "Hoạt động" },
  { id: "cus-2", code: "KH002", name: "Trần Mai", phone: "0902 345 678", apartment: "B-0808", status: "Hoạt động" },
  { id: "cus-3", code: "KH003", name: "Lê Hà", phone: "0903 456 789", apartment: "C-1502", status: "Hoạt động" },
  { id: "cus-4", code: "KH004", name: "Phạm Anh", phone: "0904 567 890", apartment: "D-0905", status: "Không hoạt động" },
];

const content = document.querySelector("#content");
const modalRoot = document.querySelector("#modalRoot");
const toast = document.querySelector("#toast");
let pendingConfirm = null;
let draggedQuestionId = null;
let draggedRanking = null;
const STORAGE_KEY = "ecosurvey-portal-prototype-v1";
const SUPABASE_STATE_TABLE = "ecosurvey_app_state";
const SUPABASE_STATE_ID = "main";
const END_SURVEY_TARGET = "__END_SURVEY__";
const OTHER_OPTION_LABEL = "Khác";
const supabaseSettings = window.ECOSURVEY_SUPABASE || {};
const supabaseClient =
  window.supabase && supabaseSettings.url && supabaseSettings.anonKey
    ? window.supabase.createClient(supabaseSettings.url, supabaseSettings.anonKey)
    : null;
let supabaseSaveTimer = null;
let lastSupabaseSaveError = "";

function replaceArray(target, value) {
  target.splice(0, target.length, ...(Array.isArray(value) ? value : []));
}

function prototypeSnapshot() {
  return {
    surveys,
    questions,
    rules,
    sessions,
    reports,
    exportAudits,
    users,
    customers,
    answers: state.answers,
    selectedSurveyId: state.selectedSurveyId,
    selectedCustomerId: state.selectedCustomerId,
  };
}

function applyPrototypeSnapshot(data) {
  if (!data || typeof data !== "object") return;
  replaceArray(surveys, data.surveys);
  replaceArray(questions, data.questions);
  replaceArray(rules, data.rules);
  replaceArray(sessions, data.sessions);
  replaceArray(reports, data.reports);
  replaceArray(exportAudits, data.exportAudits);
  replaceArray(users, data.users);
  replaceArray(customers, data.customers);
  state.answers = data.answers && typeof data.answers === "object" ? data.answers : {};
  state.selectedSurveyId = surveys.some((survey) => survey.id === data.selectedSurveyId) ? data.selectedSurveyId : surveys[0]?.id || null;
  state.selectedCustomerId = customers.some((customer) => customer.id === data.selectedCustomerId) ? data.selectedCustomerId : null;
}

function loadPrototypeData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    applyPrototypeSnapshot(JSON.parse(raw));
  } catch (error) {
    console.warn("Không thể nạp dữ liệu prototype đã lưu.", error);
  }
}

function persistPrototypeData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prototypeSnapshot()));
    queueSupabaseSave();
  } catch (error) {
    console.warn("Không thể lưu dữ liệu prototype.", error);
  }
}

function saveLocalPrototypeDataOnly() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prototypeSnapshot()));
  } catch (error) {
    console.warn("Khong the cap nhat cache local.", error);
  }
}

function queueSupabaseSave() {
  if (!supabaseClient) return;
  window.clearTimeout(supabaseSaveTimer);
  supabaseSaveTimer = window.setTimeout(() => {
    savePrototypeDataToSupabase();
  }, 350);
}

async function savePrototypeDataToSupabase() {
  if (!supabaseClient) return false;
  const { error } = await supabaseClient
    .from(SUPABASE_STATE_TABLE)
    .upsert(
      {
        id: SUPABASE_STATE_ID,
        data: prototypeSnapshot(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  if (error) {
    const message = error.message || "Khong the luu Supabase.";
    if (message !== lastSupabaseSaveError) {
      console.warn("Khong the luu du lieu len Supabase.", error);
      showToast("Chua luu duoc len Supabase. App van giu cache local.");
      lastSupabaseSaveError = message;
    }
    return false;
  }
  lastSupabaseSaveError = "";
  return true;
}

async function loadPrototypeDataFromSupabase() {
  if (!supabaseClient) return false;
  const { data, error } = await supabaseClient
    .from(SUPABASE_STATE_TABLE)
    .select("data")
    .eq("id", SUPABASE_STATE_ID)
    .maybeSingle();
  if (error) {
    console.warn("Khong the nap du lieu tu Supabase.", error);
    showToast("Chua ket noi duoc Supabase. Dang dung du lieu local.");
    return false;
  }
  if (!data?.data) {
    await savePrototypeDataToSupabase();
    return false;
  }
  applyPrototypeSnapshot(data.data);
  ensureDefaultUsers();
  ensureDefaultCustomers();
  saveLocalPrototypeDataOnly();
  return true;
}

function ensureDefaultCustomers() {
  if (customers.length) return;
  customers.push(
    { id: "cus-1", code: "KH001", name: "Nguyễn Minh", phone: "0901 234 567", apartment: "A-1201", status: "Hoạt động" },
    { id: "cus-2", code: "KH002", name: "Trần Mai", phone: "0902 345 678", apartment: "B-0808", status: "Hoạt động" },
    { id: "cus-3", code: "KH003", name: "Lê Hà", phone: "0903 456 789", apartment: "C-1502", status: "Hoạt động" },
    { id: "cus-4", code: "KH004", name: "Phạm Anh", phone: "0904 567 890", apartment: "D-0905", status: "Không hoạt động" },
  );
}

function ensureDefaultUsers() {
  if (users.length) return;
  users.push(
    { id: "user-admin", username: "survey.admin@eco.local", displayName: "Survey Admin", roleCode: "SYSTEM_ADMIN", status: "Hoạt động", allowAgentEntry: true, allowPermissionConfig: true },
    { id: "user-agent-1", username: "agent.nguyen@salesforce.local", displayName: "Agent Nguyễn", roleCode: "AGENT_VIA_SALESFORCE", status: "Hoạt động", allowAgentEntry: true, allowPermissionConfig: false },
    { id: "user-data", username: "data.bi@eco.local", displayName: "Data BI", roleCode: "DATA_BI", status: "Hoạt động", allowAgentEntry: false, allowPermissionConfig: false },
  );
}

surveys.splice(0);
questions.splice(0);
rules.splice(0);
sessions.splice(0);
reports.splice(0);
exportAudits.splice(0);
users.splice(0);
customers.splice(0);
loadPrototypeData();
ensureDefaultUsers();
ensureDefaultCustomers();

function q(id, surveyId, code, order, type, text, required = false, options = []) {
  return {
    id,
    surveyId,
    code,
    order,
    type,
    text,
    required,
    options: normalizeOptions(options),
    agentScript: "",
    guideText: "",
    placeholder: "",
    active: true,
  };
}

function selectedSurvey() {
  return surveys.find((survey) => survey.id === state.selectedSurveyId) || surveys[0] || null;
}

function selectedCustomer() {
  return customers.find((customer) => customer.id === state.selectedCustomerId) || null;
}

function currentEntrySession() {
  const customer = selectedCustomer();
  if (!customer) return null;
  return sessions.find((session) => session.customerId === customer.id && session.surveyId === state.selectedSurveyId && session.status !== "Hoàn thành") || null;
}

function isQuestionActive(question) {
  return question?.active !== false;
}

function isRuleActive(rule) {
  return rule?.active !== false;
}

function activeStatusLabel(isActive) {
  return isActive ? "Hoạt động" : "Không hoạt động";
}

function activeSurveys() {
  syncExpiredSurveys();
  return surveys.filter((survey) => !isSurveyExpiredStatus(survey.status) && !isSurveyEndedStatus(survey.status) && (survey.active === true || isSurveyStatusActive(survey.status)));
}

function permissionsForRole(roleCode) {
  return roleCatalog.find((item) => item.code === roleCode)?.permissions || [];
}

function permissionsForUser(user) {
  if (!user) return permissionsForRole(state.currentRole);
  if (Array.isArray(user.permissions)) return user.permissions;
  return permissionsForRole(user.roleCode || state.currentRole);
}

function hasPermission(permissionCode, user = null) {
  const activeUser = user || currentUserRecord();
  const simulatedCurrentRole = activeUser?.username === currentUser.username && state.currentRole !== activeUser.roleCode;
  const permissions = simulatedCurrentRole ? permissionsForRole(state.currentRole) : permissionsForUser(activeUser);
  return permissions.includes(permissionCode);
}

function isSurveyStatusActive(status) {
  const key = normalizedText(status);
  if (!key) return false;
  if (key.includes("khong") || key.includes("ngung") || key.includes("tam dung") || key.includes("luu nhap") || key.includes("khoi tao")) return false;
  return ["hoat dong", "dang hoat dong", "active", "published", "da phat hanh", "phat hanh"].includes(key);
}

function isSurveyEndedStatus(status) {
  return normalizedText(status) === "ket thuc";
}

function isSurveyExpiredStatus(status) {
  return normalizedText(status) === "het han";
}

function isSurveyPausedStatus(status) {
  return normalizedText(status).includes("ngung");
}

function isSurveyInactiveStatus(status) {
  const key = normalizedText(status);
  return key.includes("khong hoat dong") || key.includes("ngung") || key.includes("tam dung");
}

function isSurveyDraftStatus(status) {
  const key = normalizedText(status);
  return key === "khoi tao" || key === "cho duyet";
}

function isSurveyConfigEditable(survey) {
  return normalizedText(survey?.status) === "khoi tao";
}

function isSurveyBasicEditable(survey) {
  return isSurveyConfigEditable(survey) || isSurveyPausedStatus(survey?.status);
}

function isSelectedSurveyConfigEditable() {
  return isSurveyConfigEditable(selectedSurvey());
}

function surveyForQuestion(question) {
  return surveys.find((survey) => survey.id === question?.surveyId) || null;
}

function surveyForRule(rule) {
  return surveys.find((survey) => survey.id === rule?.surveyId) || null;
}

function isPastSurveyEndDate(survey) {
  if (!survey?.endDate) return false;
  const end = new Date(survey.endDate);
  end.setHours(23, 59, 59, 999);
  return !Number.isNaN(end.getTime()) && end < new Date();
}

function syncExpiredSurveys() {
  let changed = false;
  surveys.forEach((survey) => {
    if (!isSurveyEndedStatus(survey.status) && isPastSurveyEndDate(survey) && !isSurveyExpiredStatus(survey.status)) {
      survey.status = "Hết hạn";
      survey.updatedBy = survey.updatedBy || "Hệ thống";
      survey.updatedAt = survey.updatedAt || new Date().toISOString();
      changed = true;
    }
  });
  if (changed) persistPrototypeData();
}

function isSurveyActive(survey) {
  if (!isSurveyStatusActive(survey.status)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (survey.startDate) {
    const start = new Date(survey.startDate);
    if (!Number.isNaN(start.getTime()) && start > today) return false;
  }
  if (survey.endDate) {
    const end = new Date(survey.endDate);
    end.setHours(23, 59, 59, 999);
    if (!Number.isNaN(end.getTime()) && end < new Date()) return false;
  }
  return true;
}

function isCustomerActive(customer) {
  const key = normalizedText(customer?.status);
  return key === "hoat dong" || key === "dang o" || key === "active";
}

function isUserActive(user) {
  return normalizedText(user?.status) === "hoat dong";
}

function currentUserRecord() {
  return users.find((user) => user.username === currentUser.username) || users.find((user) => user.roleCode === "SYSTEM_ADMIN") || null;
}

function canCurrentUserStartSession() {
  const user = currentUserRecord();
  return hasPermission("SESSION_START") && Boolean(user?.allowAgentEntry) && isUserActive(user);
}

function validateSurveyConfig(surveyId) {
  const survey = surveys.find((item) => item.id === surveyId);
  const surveyQuestions = questionsForSurvey(surveyId);
  const surveyRules = rules.filter((rule) => rule.surveyId === surveyId && rule.active !== false);
  const errors = [];
  if (!survey) return ["Không tìm thấy khảo sát."];
  if (!survey.name?.trim()) errors.push("Thiếu tên khảo sát.");
  if (!survey.code?.trim()) errors.push("Thiếu mã khảo sát.");
    if (!survey.channel?.trim()) errors.push("Thiếu kênh trả lời.");
  if (!survey.startDate) errors.push("Thiếu ngày bắt đầu hiệu lực.");
  if (survey.startDate && survey.endDate && new Date(survey.startDate) > new Date(survey.endDate)) errors.push("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
  if (!surveyQuestions.length) errors.push("Khảo sát chưa có câu hỏi.");
  surveyQuestions.forEach((question) => {
    if (!question.code?.trim()) errors.push(`Câu hỏi ${question.order} thiếu mã câu hỏi.`);
    if (!question.text?.trim()) errors.push(`${question.code || "Câu hỏi"} thiếu nội dung.`);
    if (questionSupportsOptions(question.type) && !question.options?.length) errors.push(`${question.code} là câu hỏi lựa chọn nhưng chưa có đáp án.`);
    const duplicatedCode = questionSupportsOptions(question.type) ? duplicatedOptionCodeForQuestion(question) : "";
    if (duplicatedCode) errors.push(`${question.code} có mã đáp án "${duplicatedCode}" bị trùng.`);
    const duplicatedRowCode = isMatrixQuestionType(question.type) ? duplicatedMatrixCode(question.matrixRows, "R") : "";
    if (duplicatedRowCode) errors.push(`${question.code} có mã dòng ma trận "${duplicatedRowCode}" bị trùng.`);
    const duplicatedColumnCode = isMatrixQuestionType(question.type) ? duplicatedMatrixCode(question.matrixColumns, "C") : "";
    if (duplicatedColumnCode) errors.push(`${question.code} có mã cột ma trận "${duplicatedColumnCode}" bị trùng.`);
    if (isMatrixQuestionType(question.type) && (!matrixRowsForQuestion(question).length || !matrixColumnsForQuestion(question).length)) errors.push(`${question.code} là câu hỏi ma trận nhưng thiếu dòng/cột.`);
  });
  const activeCodes = new Set(surveyQuestions.filter((question) => question.active !== false).map((question) => question.code));
  surveyRules.forEach((rule) => {
    if (!activeCodes.has(rule.source)) errors.push(`${rule.code} tham chiếu câu hỏi nguồn không Hoạt động/không tồn tại.`);
    ruleGroups(rule).forEach((group, index) => {
      const groupLabel = `${rule.code} / Nhóm ${index + 1}`;
      if (!group.value?.toString().trim()) errors.push(`${groupLabel} thiếu giá trị so sánh.`);
      if (group.action !== "Kết thúc khảo sát" && !group.target) errors.push(`${groupLabel} thiếu câu hỏi đích.`);
      if (group.target && !activeCodes.has(group.target)) errors.push(`${groupLabel} tham chiếu câu hỏi đích không Hoạt động/không tồn tại.`);
      if (rule.source && group.target && rule.source === group.target) errors.push(`${groupLabel} không được tự trỏ cùng một câu hỏi.`);
    });
  });
  return errors;
}

function validateSurveyConfig(surveyId) {
  const survey = surveys.find((item) => item.id === surveyId);
  const surveyQuestions = questionsForSurvey(surveyId);
  const surveyRules = rules.filter((rule) => rule.surveyId === surveyId && rule.active !== false);
  const errors = [];
  if (!survey) return ["Không tìm thấy khảo sát."];
  if (!survey.name?.trim()) errors.push("Thiếu tên khảo sát.");
  if (!survey.code?.trim()) errors.push("Thiếu mã khảo sát.");
  if (!survey.channel?.trim()) errors.push("Thiếu kênh trả lời.");
  if (!survey.startDate) errors.push("Thiếu ngày bắt đầu hiệu lực.");
  if (survey.startDate && survey.endDate && new Date(survey.startDate) > new Date(survey.endDate)) errors.push("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
  if (!surveyQuestions.length) errors.push("Khảo sát chưa có câu hỏi.");
  surveyQuestions.forEach((question) => {
    if (!question.code?.trim()) errors.push(`Câu hỏi ${question.order} thiếu mã câu hỏi.`);
    if (!question.text?.trim()) errors.push(`${question.code || "Câu hỏi"} thiếu nội dung.`);
    if (questionSupportsOptions(question.type) && !question.options?.length) errors.push(`${question.code} là câu hỏi lựa chọn nhưng chưa có đáp án.`);
    const duplicatedCode = questionSupportsOptions(question.type) ? duplicatedOptionCodeForQuestion(question) : "";
    if (duplicatedCode) errors.push(`${question.code} có mã đáp án "${duplicatedCode}" bị trùng.`);
    const duplicatedRowCode = isMatrixQuestionType(question.type) ? duplicatedMatrixCode(question.matrixRows, "R") : "";
    if (duplicatedRowCode) errors.push(`${question.code} có mã dòng ma trận "${duplicatedRowCode}" bị trùng.`);
    const duplicatedColumnCode = isMatrixQuestionType(question.type) ? duplicatedMatrixCode(question.matrixColumns, "C") : "";
    if (duplicatedColumnCode) errors.push(`${question.code} có mã cột ma trận "${duplicatedColumnCode}" bị trùng.`);
    if (isMatrixQuestionType(question.type) && (!matrixRowsForQuestion(question).length || !matrixColumnsForQuestion(question).length)) errors.push(`${question.code} là câu hỏi ma trận nhưng thiếu dòng/cột.`);
  });
  const activeCodes = new Set(surveyQuestions.filter((question) => question.active !== false).map((question) => question.code));
  surveyRules.forEach((rule) => {
    if (!activeCodes.has(rule.source)) errors.push(`${rule.code} tham chiếu câu hỏi nguồn không Hoạt động/không tồn tại.`);
    ruleGroups(rule).forEach((group, index) => {
      const groupLabel = `${rule.code} / Nhóm ${index + 1}`;
      const isEndAction = normalizedText(group.action) === normalizedText("Kết thúc khảo sát");
      if (!isEndAction && !group.value?.toString().trim()) errors.push(`${groupLabel} thiếu giá trị so sánh.`);
      if (!isEndAction && !group.target) errors.push(`${groupLabel} thiếu câu hỏi đích.`);
      if (group.target && !activeCodes.has(group.target)) errors.push(`${groupLabel} tham chiếu câu hỏi đích không Hoạt động/không tồn tại.`);
      if (rule.source && group.target && rule.source === group.target) errors.push(`${groupLabel} không được tự trỏ cùng một câu hỏi.`);
    });
  });
  return errors;
}

function questionsForSurvey(surveyId) {
  return questions
    .filter((question) => question.surveyId === surveyId)
    .sort((a, b) => a.order - b.order);
}

function reorderSurveyQuestions(surveyId, draggedId, targetId) {
  if (!surveyId || !draggedId || !targetId || draggedId === targetId) return false;
  const orderedQuestions = questionsForSurvey(surveyId);
  const fromIndex = orderedQuestions.findIndex((question) => question.id === draggedId);
  const toIndex = orderedQuestions.findIndex((question) => question.id === targetId);
  if (fromIndex < 0 || toIndex < 0) return false;
  const [movedQuestion] = orderedQuestions.splice(fromIndex, 1);
  orderedQuestions.splice(toIndex, 0, movedQuestion);
  orderedQuestions.forEach((question, index) => {
    question.order = index + 1;
  });
  state.selectedQuestionIndex = Math.min(state.selectedQuestionIndex, Math.max(orderedQuestions.length - 1, 0));
  return true;
}

function selectedQuestions() {
  const survey = selectedSurvey();
  if (!survey) return [];
  return questionsForSurvey(survey.id);
}

function selectedRules() {
  const survey = selectedSurvey();
  if (!survey) return [];
  return rules
    .filter((rule) => rule.surveyId === survey.id)
    .sort((a, b) => a.priority - b.priority);
}

function entryQuestions() {
  const survey = selectedSurvey();
  if (!survey) return [];
  const session = currentEntrySession();
  if (session?.questionIds?.length) {
    return session.questionIds
      .map((id) => questions.find((question) => question.id === id))
      .filter(Boolean)
      .sort((a, b) => a.order - b.order);
  }
  if (state.view === "surveyDetail" && state.detailTab === "entry" && !session) return questionsForSurvey(survey.id).filter(isQuestionActive);
  if (!isSurveyStatusActive(survey.status)) return [];
  return questionsForSurvey(survey.id).filter(isQuestionActive);
}

function previewQuestions() {
  const survey = selectedSurvey();
  if (!survey) return [];
  return questionsForSurvey(survey.id).filter(isQuestionActive);
}

function entryRules() {
  const survey = selectedSurvey();
  if (!survey) return [];
  const session = currentEntrySession();
  if (session?.ruleIds?.length) {
    return session.ruleIds
      .map((id) => rules.find((rule) => rule.id === id))
      .filter(Boolean)
      .sort((a, b) => a.priority - b.priority);
  }
  if (state.view === "surveyDetail" && state.detailTab === "entry" && !session) return rules.filter((rule) => rule.surveyId === survey.id && isRuleActive(rule)).sort((a, b) => a.priority - b.priority);
  if (!isSurveyStatusActive(survey.status)) return [];
  return rules.filter((rule) => rule.surveyId === survey.id && isRuleActive(rule)).sort((a, b) => a.priority - b.priority);
}

function ruleGroups(rule) {
  const groups = Array.isArray(rule?.groups) ? rule.groups : [];
  if (groups.length) {
    return groups.map((group, index) => ({
      id: group.id || `group-${index + 1}`,
      operator: group.operator || rule.operator || "Bằng (=)",
      matrixRow: group.matrixRow || "",
      matrixScope: group.matrixScope || "row",
      value: group.value ?? "",
      action: group.action || rule.action || "Hiển thị câu hỏi",
      target: group.target || "",
    }));
  }
  return [
    {
      id: "group-1",
      operator: rule?.operator || "Bằng (=)",
      matrixRow: rule?.matrixRow || "",
      matrixScope: rule?.matrixScope || "row",
      value: rule?.value ?? "",
      action: rule?.action || "Hiển thị câu hỏi",
      target: rule?.target || "",
    },
  ];
}

function primaryRuleGroup(rule) {
  return ruleGroups(rule)[0] || {};
}

function describeRuleGroup(group) {
  return `${group.operator || "Bằng (=)"} ${group.value || "—"} → ${group.action || "Hiển thị câu hỏi"} ${group.target || "—"}`;
}

function displayUserName(username) {
  if (!username) return currentUser.displayName || "Survey Admin";
  const user = users.find((item) => item.username === username);
  return user?.displayName || username;
}

function displayDateTime(value) {
  return value ? formatDateTime(value) : "Chưa có dữ liệu";
}

function normalizedText(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function answerMatchesRule(answer, rule) {
  if (rule.action === "Kết thúc khảo sát" && !String(rule.value ?? "").trim()) return true;
  if (Array.isArray(answer) && normalizedText(rule.operator) === normalizedText(RANKING_POSITION_OPERATOR)) {
    const [expectedValue = "", expectedPosition = ""] = String(rule.value || "").split("@").map((item) => item.trim());
    const rankIndex = Number(expectedPosition) - 1;
    return rankIndex >= 0 && normalizedText(answer[rankIndex]) === normalizedText(expectedValue);
  }
  if (Array.isArray(answer)) {
    if (normalizedText(rule.operator).includes("khong chua")) {
      return !answer.some((item) => normalizedText(item).includes(normalizedText(rule.value)));
    }
    return answer.some((item) => answerMatchesRule(item, rule));
  }
  const left = String(answer ?? "").trim();
  const right = String(rule.value ?? "").trim();
  const operator = normalizedText(rule.operator);
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  const hasNumbers = !Number.isNaN(leftNumber) && !Number.isNaN(rightNumber);

  if (operator.includes("khac")) return left !== right;
  if (operator.includes("lon hon hoac bang")) return hasNumbers ? leftNumber >= rightNumber : left >= right;
  if (operator.includes("lon hon")) return hasNumbers ? leftNumber > rightNumber : left > right;
  if (operator.includes("nho hon hoac bang")) return hasNumbers ? leftNumber <= rightNumber : left <= right;
  if (operator.includes("nho hon")) return hasNumbers ? leftNumber < rightNumber : left < right;
  if (operator.includes("khong chua")) return !normalizedText(left).includes(normalizedText(right));
  if (operator.includes("co chua")) return normalizedText(left).includes(normalizedText(right));
  return left === right;
}

function matrixRatingAnswerMatchesRule(answer, group) {
  const matrixAnswer = answer && typeof answer === "object" && !Array.isArray(answer) ? answer : {};
  const values = Object.values(matrixAnswer).filter((value) => value !== undefined && value !== null && value !== "");
  const scope = group.matrixScope || "row";
  if (scope === "any") return values.some((value) => answerMatchesRule(value, group));
  if (scope === "all") return values.length > 0 && values.every((value) => answerMatchesRule(value, group));
  return group.matrixRow ? answerMatchesRule(matrixAnswer[group.matrixRow], group) : false;
}

function matchedRuleForQuestion(question) {
  if (!question) return null;
  const answer = state.answers[question.code];
  const matches = [];
  for (const rule of entryRules()) {
    if (!rule.active || rule.source !== question.code) continue;
    for (const group of ruleGroups(rule)) {
      if (group.action === "Kết thúc khảo sát" && !String(group.value ?? "").trim()) {
        matches.push({ ...rule, ...group, matchedGroup: group, parentRule: rule });
        continue;
      }
      if (isMatrixRatingType(question.type)) {
        if (matrixRatingAnswerMatchesRule(answer, group)) matches.push({ ...rule, ...group, matchedGroup: group, parentRule: rule });
        continue;
      }
      const comparableAnswer = isMatrixQuestionType(question.type) ? answer?.[group.matrixRow] : answer;
      if (comparableAnswer === undefined || comparableAnswer === "" || (Array.isArray(comparableAnswer) && !comparableAnswer.length)) continue;
      if (answerMatchesRule(comparableAnswer, group)) matches.push({ ...rule, ...group, matchedGroup: group, parentRule: rule });
    }
  }
  return matches.find((match) => match.action === "Kết thúc khảo sát") || matches[0] || null;
}

function questionIndexByCode(code, surveyQs = entryQuestions()) {
  return surveyQs.findIndex((question) => question.code === code);
}

function nextEntryQuestionIndex() {
  const surveyQs = entryQuestions();
  const current = surveyQs[state.selectedQuestionIndex] || surveyQs[0];
  const matchedRule = matchedRuleForQuestion(current);
  if (matchedRule?.action === "Kết thúc khảo sát") return -1;
  const targetIndex = matchedRule ? questionIndexByCode(matchedRule.target, surveyQs) : -1;
  if (targetIndex >= 0 && ["Hiển thị câu hỏi", "Bỏ qua câu hỏi"].includes(matchedRule.action)) return targetIndex;
  if (state.selectedQuestionIndex >= surveyQs.length - 1) return -1;
  return Math.min(state.selectedQuestionIndex + 1, Math.max(surveyQs.length - 1, 0));
}

function goToEntryQuestion(nextIndex) {
  if (nextIndex === state.selectedQuestionIndex) return;
  state.entryHistory.push(state.selectedQuestionIndex);
  state.selectedQuestionIndex = nextIndex;
  const question = entryQuestions()[nextIndex];
  const session = currentEntrySession();
  if (question && session) {
    session.visitedCodes = [...new Set([...(session.visitedCodes || []), question.code])];
  }
}

function finishCurrentEntrySession(successMessage = "Đã hoàn thành khảo sát và ghi nhận báo cáo.") {
  const customer = selectedCustomer();
  const survey = selectedSurvey();
  const session = currentEntrySession();
  if (finishSurveySession(session, customer, survey)) {
    showToast(successMessage);
    renderReports();
    return true;
  }
  return false;
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
    user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    search: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    save: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h12l2 2v14H5V4Z" stroke="currentColor" stroke-width="2"/><path d="M8 4v6h8V4M8 20v-6h8v6" stroke="currentColor" stroke-width="2"/></svg>',
    plus: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    arrowLeft: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6 9 12l6 6M10 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    eye: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="1.8"/></svg>',
    edit: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19h4l10-10a2.1 2.1 0 0 0-3-3L6 16l-1 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m14.5 7.5 2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    trash: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M10 11v5M14 11v5M9 7l1-2h4l1 2M7 7l1 12h8l1-12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    copy: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 8h10v10H8V8Z" stroke="currentColor" stroke-width="1.8"/><path d="M6 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    branch: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 6v5a4 4 0 0 0 4 4h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 18v-7a4 4 0 0 1 4-4h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="m15 4 3 3-3 3M15 12l3 3-3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "chevron-up": '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 14 5-5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "chevron-down": '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

function cloneAnswer(value) {
  if (Array.isArray(value)) return [...value];
  if (value && typeof value === "object") return JSON.parse(JSON.stringify(value));
  return value ?? "";
}

function otherAnswerKey(questionCode) {
  return `${questionCode}__otherText`;
}

function defaultOptionCode(index = 0) {
  return `A${index + 1}`;
}

function normalizeOption(option, index = 0) {
  if (option && typeof option === "object" && !Array.isArray(option)) {
    const text = String(option.text ?? option.value ?? option.label ?? "").trim();
    return {
      code: String(option.code || defaultOptionCode(index)).trim() || defaultOptionCode(index),
      text,
      active: option.active !== false,
    };
  }
  return {
    code: defaultOptionCode(index),
    text: String(option ?? "").trim(),
    active: true,
  };
}

function normalizeOptions(options = []) {
  return (Array.isArray(options) ? options : [])
    .map((option, index) => normalizeOption(option, index))
    .filter((option) => option.text);
}

function optionText(option) {
  return normalizeOption(option).text;
}

function optionCode(option, index = 0) {
  return normalizeOption(option, index).code;
}

function isOptionActive(option) {
  return normalizeOption(option).active !== false;
}

function allQuestionOptions(question = {}) {
  return normalizeOptions(question.options?.length ? question.options : defaultOptionsForType(question.type));
}

function activeQuestionOptions(question = {}) {
  return allQuestionOptions(question).filter(isOptionActive);
}

function activeOptionTexts(question = {}) {
  return activeQuestionOptions(question).map((option) => option.text);
}

function allOptionTexts(question = {}) {
  return allQuestionOptions(question).map((option) => option.text);
}

function nextOptionCodeFromOptions(options = []) {
  const used = new Set(normalizeOptions(options).map((option) => normalizedText(option.code)));
  let index = 1;
  while (used.has(normalizedText(`A${index}`))) index += 1;
  return `A${index}`;
}

function readOptionRowsFromList(list) {
  return [...(list?.querySelectorAll(".answer-option-row") || [])]
    .map((row, index) => ({
      code: (row.querySelector("[name='optionCode']")?.value || defaultOptionCode(index)).trim(),
      text: (row.querySelector("[name='optionValue']")?.value || "").trim(),
      active: row.querySelector("[name='optionActive']")?.checked !== false,
    }))
    .filter((option) => option.text);
}

function duplicatedOptionCodeForQuestion(question = {}) {
  const options = allQuestionOptions(question);
  return options.find((option, index) => options.findIndex((item) => normalizedText(item.code) === normalizedText(option.code)) !== index)?.code || "";
}

function defaultMatrixItemCode(prefix, index = 0) {
  return `${prefix}${index + 1}`;
}

function normalizeMatrixItem(item, index = 0, prefix = "R") {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    const text = String(item.text ?? item.value ?? item.label ?? "").trim();
    return {
      code: String(item.code || defaultMatrixItemCode(prefix, index)).trim() || defaultMatrixItemCode(prefix, index),
      text,
    };
  }
  return {
    code: defaultMatrixItemCode(prefix, index),
    text: String(item ?? "").trim(),
  };
}

function normalizeMatrixItems(items = [], prefix = "R") {
  return (Array.isArray(items) ? items : [])
    .map((item, index) => normalizeMatrixItem(item, index, prefix))
    .filter((item) => item.text);
}

function matrixItemTexts(items = [], prefix = "R") {
  return normalizeMatrixItems(items, prefix).map((item) => item.text);
}

function matrixRowsConfigForQuestion(question = {}) {
  return normalizeMatrixItems(Array.isArray(question.matrixRows) && question.matrixRows.length ? question.matrixRows : isMatrixRatingType(question.type) ? defaultMatrixRatingRows() : defaultMatrixRows(), "R");
}

function matrixColumnsConfigForQuestion(question = {}) {
  return normalizeMatrixItems(Array.isArray(question.matrixColumns) && question.matrixColumns.length ? question.matrixColumns : defaultMatrixColumns(question.type), "C");
}

function readMatrixConfigRowsFromList(list, prefix = "R") {
  return [...(list?.querySelectorAll(".answer-option-row") || [])]
    .map((row, index) => ({
      code: (row.querySelector("[name='matrixItemCode']")?.value || defaultMatrixItemCode(prefix, index)).trim(),
      text: (row.querySelector("[data-matrix-item-text]")?.value || "").trim(),
    }))
    .filter((item) => item.text);
}

function nextMatrixItemCodeFromList(list, prefix = "R") {
  const used = new Set(readMatrixConfigRowsFromList(list, prefix).map((item) => normalizedText(item.code)));
  let index = 1;
  while (used.has(normalizedText(`${prefix}${index}`))) index += 1;
  return `${prefix}${index}`;
}

function duplicatedMatrixCode(items = [], prefix = "R") {
  const normalizedItems = normalizeMatrixItems(items, prefix);
  return normalizedItems.find((item, index) => normalizedItems.findIndex((other) => normalizedText(other.code) === normalizedText(item.code)) !== index)?.code || "";
}

function isSurveyApprovedOrBeyond(survey = selectedSurvey()) {
  if (!survey) return false;
  return !isSurveyDraftStatus(survey.status);
}

function isOtherOption(option) {
  return normalizedText(optionText(option)) === normalizedText(OTHER_OPTION_LABEL);
}

function otherAnswerText(question) {
  return String(state.answers[otherAnswerKey(question.code)] || "").trim().slice(0, 255);
}

function answerHasOther(question, value = state.answers[question.code]) {
  if (!allQuestionOptions(question).some(isOtherOption)) return false;
  if (Array.isArray(value)) return value.some(isOtherOption);
  return isOtherOption(value);
}

function answerForReport(question) {
  const value = cloneAnswer(state.answers[question.code]);
  if (!answerHasOther(question, value)) return value;
  const otherText = otherAnswerText(question);
  const formattedOther = otherText ? `${OTHER_OPTION_LABEL} - ${otherText}` : OTHER_OPTION_LABEL;
  if (Array.isArray(value)) return value.map((item) => (isOtherOption(item) ? formattedOther : item));
  return isOtherOption(value) ? formattedOther : value;
}

function formatAnswerValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Chưa trả lời";
  if (value && typeof value === "object") {
    const rows = Object.entries(value).map(([row, rowValue]) => `${row}: ${formatAnswerValue(rowValue)}`);
    return rows.length ? rows.join(" | ") : "Chưa trả lời";
  }
  return value === undefined || value === null || value === "" ? "Chưa trả lời" : String(value);
}

function answerForReport(question) {
  if (normalizedQuestionType(question.type) === RANKING_TYPE) return rankingAnswerForQuestion(question);
  const value = cloneAnswer(state.answers[question.code]);
  if (!answerHasOther(question, value)) return value;
  const otherText = otherAnswerText(question);
  const formattedOther = otherText ? `${OTHER_OPTION_LABEL} - ${otherText}` : OTHER_OPTION_LABEL;
  if (Array.isArray(value)) return value.map((item) => (isOtherOption(item) ? formattedOther : item));
  return isOtherOption(value) ? formattedOther : value;
}

function formatAnswerValue(value) {
  if (Array.isArray(value)) return formatRankingAnswer(value);
  if (value && typeof value === "object") {
    const rows = Object.entries(value).map(([row, rowValue]) => `${row}: ${formatAnswerValue(rowValue)}`);
    return rows.length ? rows.join(" | ") : "Chưa trả lời";
  }
  return value === undefined || value === null || value === "" ? "Chưa trả lời" : String(value);
}

function buildSurveyResult(session, customer, survey) {
  const surveyQuestions = session?.questionIds?.length
    ? session.questionIds.map((id) => questions.find((question) => question.id === id)).filter(Boolean).sort((a, b) => a.order - b.order)
    : questionsForSurvey(survey.id).filter(isQuestionActive);
  const visitedCodes = new Set(session.visitedCodes || []);
  return {
    id: `RP${Date.now()}`,
    sessionId: session.id,
    surveyId: survey.id,
    surveyCode: survey.code || "",
    surveyName: survey.name,
    surveyVersion: survey.version,
    customerId: customer?.id || "",
    customerCode: customer?.code || "",
    customerName: customer?.name || session.customer || "Khách hàng chưa xác định",
    customerPhone: customer?.phone || "",
    customerApartment: customer?.apartment || "",
    salesforceContactId: customer?.salesforceContactId || customer?.code || customer?.id || "",
    sourceSystem: customer?.sourceSystem || "Salesforce",
    answeredByUsername: session.answeredByUsername || currentUser.username,
    startedAt: session.startedAt || "",
    completedAt: session.completedAt || new Date().toISOString(),
    status: session.status,
    answers: surveyQuestions.map((question) => ({
      questionId: question.id,
      code: question.code,
      order: question.order,
      type: question.type,
      text: question.text,
      required: Boolean(question.required),
      options: allQuestionOptions(question),
      matrixRows: isMatrixQuestionType(question.type) ? matrixRowsForQuestion(question) : [],
      matrixColumns: isMatrixQuestionType(question.type) ? matrixColumnsForQuestion(question) : [],
      answer: answerForReport(question),
      status: answerStatus(state.answers[question.code]) === "answered" ? "answered" : visitedCodes.has(question.code) ? "not_answered" : "skipped_by_rule",
    })),
  };
}

function upsertReport(report) {
  const existingIndex = reports.findIndex((item) => item.sessionId === report.sessionId);
  if (existingIndex >= 0) reports.splice(existingIndex, 1, report);
  else reports.unshift(report);
}

function finishSurveySession(session, customer, survey) {
  if (!session || !customer || !survey) return false;
  session.status = "Hoàn thành";
  session.completedAt = new Date().toISOString();
  upsertReport(buildSurveyResult(session, customer, survey));
  state.view = "reports";
  state.detailTab = "questions";
  state.selectedQuestionIndex = 0;
  state.entryHistory = [];
  state.reportSurveyFilter = survey.code || survey.name || survey.id;
  state.reportSurveyDraft = state.reportSurveyFilter;
  state.reportCustomerFilter = "";
  persistPrototypeData();
  return true;
}

function resetDraftAnswersForSurvey(surveyId) {
  questionsForSurvey(surveyId).forEach((question) => {
    delete state.answers[question.code];
    delete state.answers[otherAnswerKey(question.code)];
  });
}

function scalarAnswerValue(value) {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value) || typeof value === "object") return "";
  return String(value);
}

function filteredReports() {
  return reports.filter((report) => {
    const surveyKeyword = normalizedText(state.reportSurveyFilter === "all" ? "" : state.reportSurveyFilter);
    const surveyMatched =
      !surveyKeyword ||
      normalizedText(report.surveyCode || "") === surveyKeyword;
    const customerKeyword = normalizedText(state.reportCustomerFilter);
    const customerMatched =
      !customerKeyword ||
      normalizedText(`${report.customerName} ${report.customerCode} ${report.customerPhone} ${report.customerId}`).includes(customerKeyword);
    const completedTime = report.completedAt ? new Date(report.completedAt).getTime() : 0;
    const fromMatched = !state.reportFrom || completedTime >= new Date(state.reportFrom).getTime();
    const toMatched = !state.reportTo || completedTime <= new Date(`${state.reportTo}T23:59:59`).getTime();
    return surveyMatched && customerMatched && fromMatched && toMatched;
  });
}

function hasRequiredReportSurveyFilter() {
  return Boolean(String(state.reportSurveyFilter || "").trim()) && state.reportSurveyFilter !== "all";
}

function filteredReportsForScreen() {
  return hasRequiredReportSurveyFilter() ? filteredReports() : [];
}

function answerStatus(value) {
  if (Array.isArray(value)) return value.length ? "answered" : "not_answered";
  if (value && typeof value === "object") return Object.keys(value).length ? "answered" : "not_answered";
  return value === undefined || value === null || value === "" ? "not_answered" : "answered";
}

function matrixColumnSelections(question, answer = {}) {
  const rows = matrixRowsForQuestion(question);
  const columns = matrixColumnsForQuestion(question);
  return columns.map((column) => ({
    column,
    rows: rows.filter((row) => Array.isArray(answer?.[row]) && answer[row].includes(column)),
  }));
}

function validateQuestionAnswer(question) {
  const answer = state.answers[question.code];
  if (isMatrixQuestionType(question.type)) {
    const matrixAnswer = answer && typeof answer === "object" && !Array.isArray(answer) ? answer : {};
    if (isMatrixRatingType(question.type)) {
      if (question.required) {
        const missingRow = matrixRowsForQuestion(question).find((row) => !matrixAnswer[row]);
        if (missingRow) return `Vui lòng đánh giá tiêu chí "${missingRow}".`;
      }
      return "";
    }
    const requiredMode = question.matrixRequiredMode || "each_column_min_one";
    if (question.required && requiredMode === "each_column_min_one") {
      const missingColumn = matrixColumnSelections(question, matrixAnswer).find((item) => item.rows.length < Number(question.minColumnSelections || 1));
      if (missingColumn) return `Vui lòng chọn ít nhất ${question.minColumnSelections || 1} dòng cho cột "${missingColumn.column}".`;
    }
    if (question.required && answerStatus(matrixAnswer) !== "answered") return `Vui lòng trả lời câu ${question.code}.`;
    return "";
  }
  if (normalizedQuestionType(question.type) === RANKING_TYPE && !Array.isArray(answer)) {
    state.answers[question.code] = rankingAnswerForQuestion(question);
    persistPrototypeData();
  }
  if (isTopNQuestion(question.type)) {
    const values = Array.isArray(state.answers[question.code]) ? state.answers[question.code] : [];
    const limit = topNLimit(question);
    if (topNMode(question) === "exact" && values.length !== limit) return `Vui lòng chọn đúng ${limit} đáp án cho câu ${question.code}.`;
    if (topNMode(question) === "max" && values.length > limit) return `Câu ${question.code} chỉ được chọn tối đa ${limit} đáp án.`;
  }
  if (isTopNQuestion(question.type)) {
    const values = Array.isArray(state.answers[question.code]) ? state.answers[question.code] : [];
    const limit = topNLimit(question);
    if (topNMode(question) === "exact" && values.length !== limit) return `Vui lòng chọn đúng ${limit} đáp án cho câu ${question.code}.`;
    if (topNMode(question) === "max" && values.length > limit) return `Câu ${question.code} chỉ được chọn tối đa ${limit} đáp án.`;
  }
  if (question.required && answerStatus(state.answers[question.code]) !== "answered") return `Vui lòng trả lời câu ${question.code}.`;
  return "";
}

function validateQuestionAnswer(question) {
  const answer = state.answers[question.code];
  if (isMatrixQuestionType(question.type)) {
    const matrixAnswer = answer && typeof answer === "object" && !Array.isArray(answer) ? answer : {};
    if (isMatrixRatingType(question.type)) {
      if (question.required) {
        const missingRow = matrixRowsForQuestion(question).find((row) => !matrixAnswer[row]);
        if (missingRow) return `Vui lòng đánh giá tiêu chí "${missingRow}".`;
      }
      return "";
    }
    const requiredMode = question.matrixRequiredMode || "each_column_min_one";
    if (question.required && requiredMode === "each_column_min_one") {
      const missingColumn = matrixColumnSelections(question, matrixAnswer).find((item) => item.rows.length < Number(question.minColumnSelections || 1));
      if (missingColumn) return `Vui lòng chọn ít nhất ${question.minColumnSelections || 1} dòng cho cột "${missingColumn.column}".`;
    }
    if (question.required && answerStatus(matrixAnswer) !== "answered") return `Vui lòng trả lời câu ${question.code}.`;
    return "";
  }
  if (normalizedQuestionType(question.type) === RANKING_TYPE && !Array.isArray(answer)) {
    state.answers[question.code] = rankingAnswerForQuestion(question);
    persistPrototypeData();
  }
  if (question.required && answerStatus(state.answers[question.code]) !== "answered") return `Vui lòng trả lời câu ${question.code}.`;
  if (isTopNQuestion(question.type)) {
    const values = Array.isArray(state.answers[question.code]) ? state.answers[question.code] : [];
    const limit = topNLimit(question);
    if (topNMode(question) === "exact" && values.length !== limit) return `Vui lòng chọn đúng ${limit} đáp án cho câu ${question.code}.`;
    if (topNMode(question) === "max" && values.length > limit) return `Câu ${question.code} chỉ được chọn tối đa ${limit} đáp án.`;
  }
  if (answerHasOther(question, answer) && !otherAnswerText(question)) return `Vui lòng nhập nội dung Khác cho câu ${question.code}.`;
  return "";
}

function validateCurrentQuestionBeforeMove() {
  const question = entryQuestions()[state.selectedQuestionIndex];
  const error = validateQuestionAnswer(question);
  if (error) {
    showToast(error);
    return false;
  }
  return true;
}

function formatAnswerValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Chưa trả lời";
  if (value && typeof value === "object") {
    const rows = Object.entries(value).map(([row, rowValue]) => `${row}: ${formatAnswerValue(rowValue)}`);
    return rows.length ? rows.join(" | ") : "Chưa trả lời";
  }
  return value === undefined || value === null || value === "" ? "Chưa trả lời" : String(value);
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function exportAnswerRows(report, answer) {
  if (!isMatrixQuestionType(answer.type)) {
    return [
      {
        questionId: answer.questionId,
        questionCode: answer.code,
        questionOrder: answer.order,
        questionType: answer.type,
        questionText: answer.text,
        matrixRow: "",
        matrixColumn: "",
        answerStatus: answer.status || answerStatus(answer.answer),
        answerValue: answer.type === RANKING_TYPE ? formatRankingAnswer(answer.answer) : formatAnswerValue(answer.answer),
      },
    ];
  }
  const question = questions.find((item) => item.id === answer.questionId) || answer;
  const matrixAnswer = answer.answer && typeof answer.answer === "object" && !Array.isArray(answer.answer) ? answer.answer : {};
  if (isMatrixRatingType(answer.type)) {
    return matrixRowsForQuestion(question).map((row) => ({
      questionId: answer.questionId,
      questionCode: `${answer.code}_${row}`,
      questionOrder: answer.order,
      questionType: answer.type,
      questionText: answer.text,
      matrixRow: row,
      matrixColumn: "",
      answerStatus: matrixAnswer[row] ? "answered" : "not_answered",
      answerValue: matrixAnswer[row] || "",
    }));
  }
  return matrixRowsForQuestion(question).flatMap((row) =>
    matrixColumnsForQuestion(question).map((column) => {
      const selected = Array.isArray(matrixAnswer[row]) && matrixAnswer[row].includes(column);
      return {
        questionId: answer.questionId,
        questionCode: `${answer.code}_${column}_${row}`,
        questionOrder: answer.order,
        questionType: answer.type,
        questionText: answer.text,
        matrixRow: row,
        matrixColumn: column,
        answerStatus: selected ? "answered" : "not_selected",
        answerValue: selected ? 1 : 0,
      };
    }),
  );
}

function exportReportsCsv() {
  if (!hasPermission("RAW_DATA_EXPORT")) {
    showToast("User hiện tại không có quyền export raw data.");
    return;
  }
  const rows = filteredReports().flatMap((report) =>
    report.answers.flatMap((answer) => exportAnswerRows(report, answer).map((answerRow) => ({
      surveyId: report.surveyId,
      surveyCode: report.surveyCode,
      surveyName: report.surveyName,
      versionNo: report.surveyVersion,
      sessionId: report.sessionId,
      salesforceContactId: report.salesforceContactId || report.customerId,
      customerCode: report.customerCode,
      customerName: report.customerName,
      answeredByUsername: report.answeredByUsername || currentUser.username,
      startedAt: report.startedAt,
      completedAt: report.completedAt,
      questionId: answerRow.questionId,
      questionCode: answerRow.questionCode,
      questionOrder: answerRow.questionOrder,
      questionType: answerRow.questionType,
      questionText: answerRow.questionText,
      matrixRow: answerRow.matrixRow,
      matrixColumn: answerRow.matrixColumn,
      answerStatus: answerRow.answerStatus,
      answerValue: answerRow.answerValue,
    }))),
  );
  const header = ["surveyId", "surveyCode", "surveyName", "versionNo", "sessionId", "salesforceContactId", "customerCode", "customerName", "answeredByUsername", "startedAt", "completedAt", "questionId", "questionCode", "questionOrder", "questionType", "questionText", "matrixRow", "matrixColumn", "answerStatus", "answerValue"];
  const headerLabels = ["ID khảo sát", "Mã khảo sát", "Tên khảo sát", "Phiên bản", "Mã phiên khảo sát", "Salesforce Contact ID", "Mã khách hàng", "Tên khách hàng", "User thực hiện", "Thời gian bắt đầu", "Thời gian hoàn thành", "ID câu hỏi", "Mã câu hỏi", "Thứ tự câu hỏi", "Loại câu hỏi", "Nội dung câu hỏi", "Dòng ma trận/Tiêu chí", "Cột ma trận", "Trạng thái trả lời", "Giá trị trả lời"];
  const csv = [headerLabels.map(csvCell).join(","), header.join(","), ...rows.map((row) => header.map((key) => csvCell(row[key])).join(","))].join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `ecosurvey-raw-data-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  exportAudits.unshift({
    id: `EX${Date.now()}`,
    requestedBy: currentUser.username,
    requestedAt: new Date().toISOString(),
    format: "csv",
    rowCount: rows.length,
    filters: {
      surveyId: state.reportSurveyFilter,
      customer: state.reportCustomerFilter,
      completedFrom: state.reportFrom,
      completedTo: state.reportTo,
    },
  });
  showToast(`Đã export ${rows.length} dòng raw data.`);
  renderReports();
}

function exportReportsCsv() {
  if (!hasPermission("RAW_DATA_EXPORT")) {
    showToast("User hiện tại không có quyền export báo cáo.");
    return;
  }
  const rows = filteredReports().map((report) => ({
    customerCode: report.customerCode || "",
    customerName: report.customerName || "",
    surveyCode: report.surveyCode || "",
    surveyName: report.surveyName || "",
    answeredByUsername: displayUserName(report.answeredByUsername),
    startedAt: formatDateTime(report.startedAt),
    completedAt: formatDateTime(report.completedAt),
  }));
  const header = ["customerCode", "customerName", "surveyCode", "surveyName", "answeredByUsername", "startedAt", "completedAt"];
  const headerLabels = ["Mã khách", "Tên khách hàng", "Mã khảo sát", "Tên khảo sát", "Agent", "Bắt đầu", "Hoàn thành"];
  const exportedAt = new Date().toISOString().slice(0, 10);
  let exportFormat = "xlsx";
  if (window.XLSX) {
    const worksheetRows = [headerLabels, header, ...rows.map((row) => header.map((key) => row[key] ?? ""))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bao cao");
    XLSX.writeFile(workbook, `ecosurvey-filtered-results-${exportedAt}.xlsx`);
  } else {
    exportFormat = "csv";
    const csv = [headerLabels.map(csvCell).join(","), header.join(","), ...rows.map((row) => header.map((key) => csvCell(row[key])).join(","))].join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ecosurvey-filtered-results-${exportedAt}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  exportAudits.unshift({
    id: `EX${Date.now()}`,
    requestedBy: currentUser.username,
    requestedAt: new Date().toISOString(),
    format: exportFormat,
    rowCount: rows.length,
    filters: {
      surveyId: state.reportSurveyFilter,
      customer: state.reportCustomerFilter,
      completedFrom: state.reportFrom,
      completedTo: state.reportTo,
    },
  });
  showToast(`Đã export ${rows.length} dòng theo danh sách đang lọc.`);
  renderReports();
}

function exportReportsCsv() {
  if (!hasPermission("RAW_DATA_EXPORT")) {
    showToast("User hiện tại không có quyền export báo cáo.");
    return;
  }
  if (!hasRequiredReportSurveyFilter()) {
    showToast("Vui lòng nhập mã khảo sát trước khi export báo cáo.");
    return;
  }
  const sourceReports = filteredReports();
  const rows = sourceReports.flatMap((report) =>
    report.answers.flatMap((answer) => exportAnswerRows(report, answer).map((answerRow) => ({
      surveyId: report.surveyId,
      surveyCode: report.surveyCode,
      surveyName: report.surveyName,
      versionNo: report.surveyVersion,
      sessionId: report.sessionId,
      salesforceContactId: report.salesforceContactId || report.customerId,
      customerCode: report.customerCode,
      customerName: report.customerName,
      answeredByUsername: report.answeredByUsername || currentUser.username,
      startedAt: report.startedAt,
      completedAt: report.completedAt,
      questionId: answerRow.questionId,
      questionCode: answerRow.questionCode,
      questionOrder: answerRow.questionOrder,
      questionType: answerRow.questionType,
      questionText: answerRow.questionText,
      matrixRow: answerRow.matrixRow,
      matrixColumn: answerRow.matrixColumn,
      answerStatus: answerRow.answerStatus,
      answerValue: answerRow.answerValue,
    }))),
  );
  const header = ["surveyId", "surveyCode", "surveyName", "versionNo", "sessionId", "salesforceContactId", "customerCode", "customerName", "answeredByUsername", "startedAt", "completedAt", "questionId", "questionCode", "questionOrder", "questionType", "questionText", "matrixRow", "matrixColumn", "answerStatus", "answerValue"];
  const headerLabels = ["ID khảo sát", "Mã khảo sát", "Tên khảo sát", "Phiên bản", "Mã phiên khảo sát", "Salesforce Contact ID", "Mã khách hàng", "Tên khách hàng", "User thực hiện", "Thời gian bắt đầu", "Thời gian hoàn thành", "ID câu hỏi", "Mã câu hỏi", "Thứ tự câu hỏi", "Loại câu hỏi", "Nội dung câu hỏi", "Dòng ma trận/Tiêu chí", "Cột ma trận", "Trạng thái trả lời", "Giá trị trả lời"];
  const exportedAt = new Date().toISOString().slice(0, 10);
  let exportFormat = "xlsx";
  if (window.XLSX) {
    const worksheetRows = [headerLabels, header, ...rows.map((row) => header.map((key) => row[key] ?? ""))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Raw data");
    XLSX.writeFile(workbook, `ecosurvey-raw-data-${exportedAt}.xlsx`);
  } else {
    exportFormat = "csv";
    const csv = [headerLabels.map(csvCell).join(","), header.join(","), ...rows.map((row) => header.map((key) => csvCell(row[key])).join(","))].join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ecosurvey-raw-data-${exportedAt}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  exportAudits.unshift({
    id: `EX${Date.now()}`,
    requestedBy: currentUser.username,
    requestedAt: new Date().toISOString(),
    format: exportFormat,
    rowCount: rows.length,
    filters: {
      surveyId: state.reportSurveyFilter,
      customer: state.reportCustomerFilter,
      completedFrom: state.reportFrom,
      completedTo: state.reportTo,
    },
  });
  showToast(`Đã export ${rows.length} dòng raw data từ ${sourceReports.length} kết quả đang lọc.`);
  renderReports();
}

function cleanReportFieldPart(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "")
    .toUpperCase();
}

function reportSurveyFromFilter(sourceReports = []) {
  if (sourceReports[0]?.surveyId) return sourceReports[0].surveyId;
  const keyword = normalizedText(state.reportSurveyFilter);
  return surveys.find((survey) => normalizedText(`${survey.code} ${survey.name} ${survey.id}`).includes(keyword))?.id || "";
}

function optionCodeForAnswer(question, answerValue) {
  const normalizedAnswer = normalizedText(String(answerValue || "").split(" - ")[0]);
  const option = allQuestionOptions(question).find((item) => normalizedText(item.text) === normalizedAnswer);
  return option?.code || cleanReportFieldPart(answerValue) || "VALUE";
}

function report2ColumnsForSurvey(surveyId, sourceReports = []) {
  const answersByQuestion = new Map();
  sourceReports.forEach((report) => {
    (report.answers || []).forEach((answer) => {
      if (!answersByQuestion.has(answer.code)) answersByQuestion.set(answer.code, answer);
    });
  });
  const surveyQuestions = questionsForSurvey(surveyId);
  const questionSources = [...answersByQuestion.values()].sort((a, b) => (a.order || 0) - (b.order || 0));

  return questionSources.flatMap((sourceAnswer) => {
    const question = surveyQuestions.find((item) => item.code === sourceAnswer.code) || sourceAnswer;
    const type = normalizedQuestionType(sourceAnswer.type || question.type);
    const questionCode = cleanReportFieldPart(sourceAnswer.code || question.code);
    const questionText = sourceAnswer.text || question.text || questionCode;
    const sourceOptions = normalizeOptions(sourceAnswer.options?.length ? sourceAnswer.options : question.options);

    if (type === TOP_N_TYPE) {
      return sourceOptions.map((option) => ({
        key: `${questionCode}_${cleanReportFieldPart(option.code)}`,
        label: `${questionText} - ${option.text}`,
        questionCode: sourceAnswer.code || question.code,
        type,
        optionText: option.text,
      }));
    }

    if (["Chọn một đáp án", "Chọn nhiều đáp án", "Đánh giá"].includes(type)) {
      return sourceOptions.map((option) => ({
        key: `${questionCode}_${cleanReportFieldPart(option.code)}`,
        label: `${questionText} - ${option.text}`,
        questionCode: sourceAnswer.code || question.code,
        type,
        optionText: option.text,
      }));
    }

    if (isMatrixRatingType(type)) {
      return matrixRowsForQuestion(question).map((row) => ({
        key: `${questionCode}_${cleanReportFieldPart(row)}`,
        label: `${questionText} - ${row}`,
        questionCode: sourceAnswer.code || question.code,
        type,
        matrixRow: row,
      }));
    }

    if (isMatrixMultipleType(type)) {
      const rowItems = matrixRowsConfigForQuestion(question);
      const columnItems = matrixColumnsConfigForQuestion(question);
      return rowItems.flatMap((row) =>
        columnItems.map((column) => ({
          key: `${questionCode}_${cleanReportFieldPart(row.code)}_${cleanReportFieldPart(column.code)}`,
          label: `${questionText} - ${row.text} / ${column.text}`,
          questionCode: sourceAnswer.code || question.code,
          type,
          matrixRow: row.text,
          matrixColumn: column.text,
        })),
      );
    }

    return [
      {
        key: questionCode,
        label: questionText,
        questionCode: sourceAnswer.code || question.code,
        type,
      },
    ];
  });
}

function valueForReport2Column(answer, column) {
  if (!answer) return ["Chọn một đáp án", "Chọn nhiều đáp án", "Đánh giá", TOP_N_TYPE, MATRIX_MULTI_TYPE].includes(normalizedQuestionType(column.type)) ? 0 : "";
  const type = normalizedQuestionType(answer.type);
  const value = answer.answer;
  if (["Chọn một đáp án", "Đánh giá"].includes(type)) {
    return normalizedText(String(value || "").split(" - ")[0]) === normalizedText(column.optionText) ? 1 : 0;
  }
  if (type === "Chọn nhiều đáp án") {
    const values = Array.isArray(value) ? value : [];
    return values.some((item) => normalizedText(String(item).split(" - ")[0]) === normalizedText(column.optionText)) ? 1 : 0;
  }
  if (type === TOP_N_TYPE) {
    const values = Array.isArray(value) ? value : [];
    const selectedIndex = values.findIndex((item) => normalizedText(String(item).split(" - ")[0]) === normalizedText(column.optionText));
    return selectedIndex >= 0 ? selectedIndex + 1 : 0;
  }
  if (isMatrixRatingType(type)) {
    return value && typeof value === "object" && !Array.isArray(value) ? value[column.matrixRow] || "" : "";
  }
  if (isMatrixMultipleType(type)) {
    const rowValue = value && typeof value === "object" && !Array.isArray(value) ? value[column.matrixRow] : [];
    return Array.isArray(rowValue) && rowValue.includes(column.matrixColumn) ? 1 : 0;
  }
  if (type === RANKING_TYPE) return formatRankingAnswer(value);
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

function exportReports2Excel() {
  if (!hasPermission("RAW_DATA_EXPORT")) {
    showToast("User hiện tại không có quyền export báo cáo.");
    return;
  }
  if (!hasRequiredReportSurveyFilter()) {
    showToast("Vui lòng nhập mã khảo sát trước khi export báo cáo 2.");
    return;
  }
  const sourceReports = filteredReports();
  const surveyId = reportSurveyFromFilter(sourceReports);
  const dynamicColumns = report2ColumnsForSurvey(surveyId, sourceReports);
  const baseHeader = ["surveyCode", "surveyName", "versionNo", "sessionId", "salesforceContactId", "customerName", "answeredByUsername", "startedAt", "completedAt"];
  const baseHeaderLabels = ["Mã khảo sát", "Tên khảo sát", "Phiên bản", "Mã phiên khảo sát", "Salesforce Contact ID", "Tên khách hàng", "User thực hiện", "Thời gian bắt đầu", "Thời gian hoàn thành"];
  const header = [...baseHeaderLabels, ...dynamicColumns.map((column) => column.key)];
  const rowKeys = [...baseHeader, ...dynamicColumns.map((column) => column.key)];
  const rows = sourceReports.map((report) => {
    const answerByCode = new Map((report.answers || []).map((answer) => [answer.code, answer]));
    const row = {
      surveyCode: report.surveyCode,
      surveyName: report.surveyName,
      versionNo: report.surveyVersion,
      sessionId: report.sessionId,
      salesforceContactId: report.salesforceContactId || report.customerId,
      customerName: report.customerName,
      answeredByUsername: report.answeredByUsername || currentUser.username,
      startedAt: report.startedAt,
      completedAt: report.completedAt,
    };
    dynamicColumns.forEach((column) => {
      row[column.key] = valueForReport2Column(answerByCode.get(column.questionCode), column);
    });
    return row;
  });
  const exportedAt = new Date().toISOString().slice(0, 10);
  let exportFormat = "xlsx";
  if (window.XLSX) {
    const worksheetRows = [header, ...rows.map((row) => rowKeys.map((key) => row[key] ?? ""))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bao cao 2");
    XLSX.writeFile(workbook, `ecosurvey-report-2-${exportedAt}.xlsx`);
  } else {
    exportFormat = "csv";
    const csv = [header.map(csvCell).join(","), ...rows.map((row) => rowKeys.map((key) => csvCell(row[key])).join(","))].join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ecosurvey-report-2-${exportedAt}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  exportAudits.unshift({
    id: `EX${Date.now()}`,
    requestedBy: currentUser.username,
    requestedAt: new Date().toISOString(),
    format: exportFormat,
    rowCount: rows.length,
    filters: {
      surveyId: state.reportSurveyFilter,
      customer: state.reportCustomerFilter,
      completedFrom: state.reportFrom,
      completedTo: state.reportTo,
      reportType: "Báo cáo 2",
    },
  });
  showToast(`Đã export Báo cáo 2 với ${rows.length} dòng và ${dynamicColumns.length} field câu hỏi/đáp án.`);
  renderReports2();
}

function answerCount(question) {
  return allQuestionOptions(question).length;
}

function isMatrixQuestionType(type) {
  return MATRIX_QUESTIONS_ENABLED && [MATRIX_MULTI_TYPE, MATRIX_RATING_TYPE].includes(type);
}

function isMatrixMultipleType(type) {
  return type === MATRIX_MULTI_TYPE;
}

function isMatrixRatingType(type) {
  return type === MATRIX_RATING_TYPE;
}

function questionSupportsOptions(type) {
  type = normalizedQuestionType(type);
  return ["Chọn một đáp án", "Chọn nhiều đáp án", "Đánh giá"].includes(type);
}

function normalizedQuestionType(type) {
  return type === "Văn bản ngắn" || type === "Văn bản dài" ? "Văn bản" : type;
}

function operatorOptionsForQuestion(question) {
  const type = normalizedQuestionType(question?.type || "");
  if (type === "Chọn một đáp án") return ["Bằng (=)", "Khác (!=)"];
  if (type === "Chọn nhiều đáp án" || type === MATRIX_MULTI_TYPE) return ["Có chứa", "Không chứa"];
  if (type === "Văn bản") return ["Có chứa", "Không chứa", "Bằng (=)", "Khác (!=)"];
  if (["Số", "Ngày", "Đánh giá", MATRIX_RATING_TYPE].includes(type)) return ["Bằng (=)", "Khác (!=)", "Lớn hơn", "Lớn hơn hoặc bằng", "Nhỏ hơn", "Nhỏ hơn hoặc bằng"];
  return ["Bằng (=)", "Khác (!=)"];
}

function defaultOperatorForQuestion(question) {
  return operatorOptionsForQuestion(question)[0] || "Bằng (=)";
}

function defaultOptionsForType(type) {
  if (type === "Đánh giá") return ["1", "2", "3", "4", "5"];
  if (type === "Chọn một đáp án" || type === "Chọn nhiều đáp án") return ["Có", "Không"];
  return [];
}

function defaultMatrixRows() {
  return ["Ăn một mình", "Ăn cùng gia đình/bạn bè", "Khi đi làm/văn phòng", "Cuối tuần", "Khi có khuyến mãi"];
}

function defaultMatrixRatingRows() {
  return ["Giá món ăn", "Phí giao hàng", "Tốc độ giao hàng", "Chất lượng món ăn", "Độ đúng món/đúng đơn", "Thái độ tài xế", "Ưu đãi/khuyến mãi", "Dễ sử dụng app"];
}

function defaultMatrixColumns(type = "") {
  if (type === MATRIX_RATING_TYPE) return ["1", "2", "3", "4", "5"];
  return ["Cơm/món chính", "Đồ uống", "Đồ ăn vặt"];
}

function questionSupportsOptions(type) {
  type = normalizedQuestionType(type);
  return ["Chọn một đáp án", "Chọn nhiều đáp án", "Đánh giá", RANKING_TYPE, TOP_N_TYPE].includes(type);
}

function operatorOptionsForQuestion(question) {
  const type = normalizedQuestionType(question?.type || "");
  if (type === RANKING_TYPE) return ["Có chứa lựa chọn", RANKING_POSITION_OPERATOR];
  if (type === TOP_N_TYPE) return ["Có chứa lựa chọn"];
  if (type === "Chọn một đáp án") return ["Bằng (=)", "Khác (!=)"];
  if (type === "Chọn nhiều đáp án" || type === MATRIX_MULTI_TYPE) return ["Có chứa", "Không chứa"];
  if (type === "Văn bản") return ["Có chứa", "Không chứa", "Bằng (=)", "Khác (!=)"];
  if (["Số", "Ngày", "Đánh giá", MATRIX_RATING_TYPE].includes(type)) return ["Bằng (=)", "Khác (!=)", "Lớn hơn", "Lớn hơn hoặc bằng", "Nhỏ hơn", "Nhỏ hơn hoặc bằng"];
  return ["Bằng (=)", "Khác (!=)"];
}

function defaultOptionsForType(type) {
  if (type === "Đánh giá") return ["1", "2", "3", "4", "5"];
  if (type === RANKING_TYPE) return ["Chất lượng bác sĩ", "Thời gian chờ", "Giá dịch vụ", "Thái độ nhân viên", "Cơ sở vật chất"];
  if (type === TOP_N_TYPE) return ["Bác sĩ giỏi", "Gần nhà", "Giá hợp lý", "Đặt lịch nhanh", "Ít phải chờ", "Nhân viên hỗ trợ tốt", "Cơ sở vật chất hiện đại"];
  if (type === "Chọn một đáp án" || type === "Chọn nhiều đáp án") return ["Có", "Không"];
  return [];
}

function matrixRowsForQuestion(question = {}) {
  return matrixRowsConfigForQuestion(question).map((item) => item.text);
}

function matrixColumnsForQuestion(question = {}) {
  return matrixColumnsConfigForQuestion(question).map((item) => item.text);
}

function rankingOptionsForQuestion(question = {}) {
  const options = activeOptionTexts(question);
  return options.length ? options : defaultOptionsForType(RANKING_TYPE);
}

function rankingAnswerForQuestion(question = {}) {
  const configuredOptions = rankingOptionsForQuestion(question);
  const current = state.answers[question.code];
  const ordered = Array.isArray(current) && current.length ? current.filter((item) => configuredOptions.includes(item)) : configuredOptions;
  return [...ordered, ...configuredOptions.filter((option) => !ordered.includes(option))];
}

function formatRankingAnswer(value) {
  return Array.isArray(value) && value.length ? value.map((item, index) => `${index + 1}. ${item}`).join(" | ") : "Chưa trả lời";
}

function rankingRuleValueOptions(question, selectedValue = "", operator = "") {
  const options = rankingOptionsForQuestion(question);
  if (!options.length) return `<option value="">-- Câu hỏi này chưa có danh sách giá trị --</option>`;
  if (normalizedText(operator) === normalizedText(RANKING_POSITION_OPERATOR)) {
    const values = options.flatMap((option) => options.map((_, index) => ({ value: `${option} @ ${index + 1}`, label: `${option} đứng vị trí ${index + 1}` })));
    return `
      <option value="">-- Chọn lựa chọn và vị trí --</option>
      ${values.map((item) => `<option value="${escapeHtml(item.value)}" ${item.value === selectedValue ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
    `;
  }
  return `
    <option value="">-- Chọn lựa chọn --</option>
    ${options.map((value) => `<option value="${escapeHtml(value)}" ${value === selectedValue ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}
  `;
}

function isTopNQuestion(type) {
  return normalizedQuestionType(type) === TOP_N_TYPE;
}

function topNLimit(question = {}) {
  const configured = Number(question.topN);
  return Number.isFinite(configured) && configured > 0 ? configured : 3;
}

function topNMode(question = {}) {
  return question.topNMode === "max" ? "max" : "exact";
}

function topNModeLabel(mode) {
  return mode === "max" ? "Tối đa N lựa chọn" : "Bắt buộc đúng N lựa chọn";
}

function topNHint(question = {}) {
  const limit = topNLimit(question);
  return topNMode(question) === "max" ? `Chọn tối đa ${limit} đáp án.` : `Chọn đúng ${limit} đáp án.`;
}

function renderTopNConfig(question = {}) {
  const limit = topNLimit(question);
  const mode = topNMode(question);
  return `
    <section class="answer-options-panel" id="topNConfigPanel" ${isTopNQuestion(question.type || "") ? "" : "hidden"}>
      <div class="block-heading compact">
        <div>
          <p class="block-eyebrow">Top N</p>
          <h3 class="block-title">Giới hạn số lượng lựa chọn</h3>
        </div>
      </div>
      <div class="form-grid">
        <div class="field">
          <label for="questionTopN">Số lựa chọn N</label>
          <input class="input" id="questionTopN" name="topN" type="number" min="1" value="${escapeHtml(limit)}" />
        </div>
        <div class="field">
          <label for="questionTopNMode">Quy tắc chọn</label>
          <select class="select" id="questionTopNMode" name="topNMode">
            <option value="exact" ${mode === "exact" ? "selected" : ""}>Bắt buộc đúng N lựa chọn</option>
            <option value="max" ${mode === "max" ? "selected" : ""}>Tối đa N lựa chọn</option>
          </select>
        </div>
      </div>
    </section>
  `;
}

function renderTopNAnswerControl(question, value) {
  const values = Array.isArray(value) ? value : [];
  const limit = topNLimit(question);
  const options = activeQuestionOptions(question);
  return `
    <div class="answer-stack top-n-answer">
      <div class="top-n-counter">${values.length}/${limit} đã chọn · ${topNHint(question)}</div>
      ${options
        .map((option) => {
          const text = option.text;
          const checked = values.includes(text);
          const selectedIndex = values.indexOf(text);
          const disabled = !checked && values.length >= limit;
          return `
            <label class="answer-option ${disabled ? "is-disabled" : ""}">
              <input type="checkbox" value="${escapeHtml(text)}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} data-top-n-answer="${escapeHtml(question.code)}" />
              <span>${escapeHtml(text)}</span>
              ${selectedIndex >= 0 ? `<span class="top-n-rank-badge">Top ${selectedIndex + 1}</span>` : ""}
            </label>
          `;
        })
        .join("")}
    </div>
  `;
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

function renderAgentScriptHint(question) {
  return question?.agentScript ? `<p class="question-guide-hint">${escapeHtml(question.agentScript)}</p>` : "";
}

function render() {
  persistPrototypeData();
  syncNav();
  const view = state.view;
  if (view === "dashboard") renderDashboard();
  if (view === "surveys") renderSurveys();
  if (view === "customers") renderCustomers();
  if (view === "users") renderUsers();
  if (view === "createSurvey") renderCreateSurvey();
  if (view === "surveyDetail") renderSurveyDetail();
  if (view === "branching") renderSurveys();
  if (view === "entry") renderEntry();
  if (view === "reports") renderReports();
  if (view === "reports2") renderReports2();
  if (view === "permissions") renderPermissions();
}

function syncNav() {
  const viewForNav = state.view === "surveyDetail" && state.selectedCustomerId && state.detailTab === "entry" ? "customers" : state.view === "createSurvey" || state.view === "surveyDetail" ? "surveys" : state.view;
  document.querySelectorAll(".nav-item").forEach((button) => {
    const active = button.dataset.view === viewForNav;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function renderDashboard() {
  const metrics = [
    { value: surveys.filter((survey) => isSurveyStatusActive(survey.status)).length, label: "Tổng khảo sát Hoạt động", iconName: "clipboard", tone: "tone-blue" },
    { value: questions.filter((question) => question.active !== false).length, label: "Tổng câu hỏi Hoạt động", iconName: "file", tone: "tone-violet" },
    { value: customers.filter((customer) => isCustomerActive(customer)).length, label: "Tổng khách hàng Hoạt động", iconName: "user", tone: "tone-green" },
    { value: users.filter((user) => isUserActive(user)).length, label: "Tổng user Hoạt động", iconName: "user", tone: "tone-cyan" },
  ];

  content.innerHTML = `
    ${renderHeader("Tổng quan", "Hệ thống quản lý khảo sát Tổng Đài ECOSURVEY")}
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

function renderSurveyActions(survey) {
  const active = isSurveyStatusActive(survey.status);
  const paused = isSurveyPausedStatus(survey.status);
  const ended = isSurveyEndedStatus(survey.status);
  const expired = isSurveyExpiredStatus(survey.status);
  const canApprove = !active && !paused && !ended && !expired;
  const canToggleActive = active || paused;
  return `
    ${actionButton("open-survey", survey.id, "eye", "Xem khảo sát")}
    ${!ended ? actionButton("edit-survey", survey.id, "edit", "Sửa khảo sát") : ""}
    ${canApprove ? actionButton("publish-survey", survey.id, "trend", "Duyệt khảo sát") : ""}
    ${canToggleActive ? actionButton("archive-survey", survey.id, active ? "clock" : "trend", active ? "Ngưng hoạt động" : "Hoạt động trở lại") : ""}
    ${!ended ? actionButton("finish-survey", survey.id, "check", "Kết thúc khảo sát") : ""}
    ${
      active
        ? `<button class="icon-action is-disabled" type="button" disabled aria-label="Không thể xóa khảo sát đang hoạt động" title="Không thể xóa khảo sát đang hoạt động">${icon("trash")}</button>`
        : actionButton("delete-survey", survey.id, "trash", "Xóa khảo sát", "danger")
    }
  `;
}

function renderSurveyActions(survey) {
  const active = isSurveyStatusActive(survey.status);
  const paused = isSurveyPausedStatus(survey.status);
  const ended = isSurveyEndedStatus(survey.status);
  const expired = isSurveyExpiredStatus(survey.status);
  const canApprove = !active && !paused && !ended && !expired;
  const canToggleActive = active || paused;
  return `
    ${actionButton("open-survey", survey.id, "eye", "Xem khảo sát")}
    ${!ended ? actionButton("edit-survey", survey.id, "edit", "Sửa khảo sát") : ""}
    ${actionButton("copy-survey", survey.id, "copy", "Sao chép khảo sát")}
    ${canApprove ? actionButton("publish-survey", survey.id, "trend", "Duyệt khảo sát") : ""}
    ${canToggleActive ? actionButton("archive-survey", survey.id, active ? "clock" : "trend", active ? "Ngưng hoạt động" : "Hoạt động trở lại") : ""}
    ${!ended ? actionButton("finish-survey", survey.id, "check", "Kết thúc khảo sát") : ""}
    ${
      active
        ? `<button class="icon-action is-disabled" type="button" disabled aria-label="Không thể xóa khảo sát đang hoạt động" title="Không thể xóa khảo sát đang hoạt động">${icon("trash")}</button>`
        : actionButton("delete-survey", survey.id, "trash", "Xóa khảo sát", "danger")
    }
  `;
}

function recentCompletedReports(limit = 5) {
  return [...reports]
    .filter((report) => report.completedAt)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, limit);
}

function renderDashboard() {
  const completedReports = reports.filter((report) => report.completedAt);
  const recentReports = recentCompletedReports(6);
  const metrics = [
    { value: surveys.filter((survey) => isSurveyStatusActive(survey.status)).length, label: "Tổng khảo sát Hoạt động", iconName: "clipboard", tone: "tone-blue" },
    { value: questions.filter((question) => question.active !== false).length, label: "Tổng câu hỏi Hoạt động", iconName: "file", tone: "tone-violet" },
    { value: customers.filter((customer) => isCustomerActive(customer)).length, label: "Tổng khách hàng Hoạt động", iconName: "user", tone: "tone-green" },
    { value: users.filter((user) => isUserActive(user)).length, label: "Tổng user Hoạt động", iconName: "user", tone: "tone-cyan" },
    { value: completedReports.length, label: "Khảo sát khách hàng đã hoàn thành", iconName: "check", tone: "tone-emerald" },
  ];

  content.innerHTML = `
    ${renderHeader("Tổng quan", "Hệ thống quản lý khảo sát Tổng Đài ECOSURVEY")}
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
        <h2 class="panel-title">Bài khảo sát đã làm gần đây</h2>
        <button class="btn ghost" data-action="view-reports" type="button">Xem báo cáo</button>
      </div>
      ${
        recentReports.length
          ? recentReports
              .map(
                (report) => `
                <div class="survey-row recent-report-row">
                  <button type="button" data-action="view-reports">
                    <span class="item-title">${escapeHtml(report.surveyName || "—")}</span>
                    <span class="item-meta">${escapeHtml(report.surveyCode || "—")} · ${escapeHtml(report.customerName || "—")} · ${escapeHtml(formatDateTime(report.completedAt))}</span>
                  </button>
                  ${badge("Hoàn thành", true)}
                </div>
              `,
              )
              .join("")
          : `<div class="empty-state">Chưa có bài khảo sát nào đã hoàn thành.</div>`
      }
    </section>
  `;
}

function renderSurveyActions(survey) {
  const active = isSurveyStatusActive(survey.status);
  const inactive = isSurveyInactiveStatus(survey.status) || survey.active === false;
  const paused = isSurveyPausedStatus(survey.status);
  const ended = isSurveyEndedStatus(survey.status);
  const expired = isSurveyExpiredStatus(survey.status);
  const canApprove = !active && !paused && !ended && !expired;
  const canToggleActive = active || paused;
  const editButton = inactive
    ? `<button class="icon-action is-disabled" type="button" disabled aria-label="Khảo sát không hoạt động không được sửa" title="Khảo sát không hoạt động không được sửa">${icon("edit")}</button>`
    : !ended
      ? actionButton("edit-survey", survey.id, "edit", "Sửa khảo sát")
      : "";
  return `
    ${actionButton("open-survey", survey.id, "eye", "Xem khảo sát")}
    ${editButton}
    ${actionButton("copy-survey", survey.id, "copy", "Sao chép khảo sát")}
    ${canApprove ? actionButton("publish-survey", survey.id, "trend", "Duyệt khảo sát") : ""}
    ${canToggleActive ? actionButton("archive-survey", survey.id, active ? "clock" : "trend", active ? "Ngưng hoạt động" : "Hoạt động trở lại") : ""}
    ${!ended ? actionButton("finish-survey", survey.id, "check", "Kết thúc khảo sát") : ""}
    ${
      active
        ? `<button class="icon-action is-disabled" type="button" disabled aria-label="Không thể xóa khảo sát đang hoạt động" title="Không thể xóa khảo sát đang hoạt động">${icon("trash")}</button>`
        : actionButton("delete-survey", survey.id, "trash", "Xóa khảo sát", "danger")
    }
  `;
}

function renderSurveyActions(survey) {
  const active = isSurveyStatusActive(survey.status);
  const paused = isSurveyPausedStatus(survey.status);
  const ended = isSurveyEndedStatus(survey.status);
  const expired = isSurveyExpiredStatus(survey.status);
  const canApprove = !active && !paused && !ended && !expired;
  const canToggleActive = active || paused;
  const editButton = active
    ? `<button class="icon-action is-disabled" type="button" disabled aria-label="Khảo sát đang hoạt động không được sửa" title="Khảo sát đang hoạt động không được sửa">${icon("edit")}</button>`
    : !ended
      ? actionButton("edit-survey", survey.id, "edit", "Sửa khảo sát")
      : "";
  return `
    ${actionButton("open-survey", survey.id, "eye", "Xem khảo sát")}
    ${editButton}
    ${actionButton("copy-survey", survey.id, "copy", "Sao chép khảo sát")}
    ${canApprove ? actionButton("publish-survey", survey.id, "trend", "Duyệt khảo sát") : ""}
    ${canToggleActive ? actionButton("archive-survey", survey.id, active ? "clock" : "trend", active ? "Ngưng hoạt động" : "Hoạt động trở lại") : ""}
    ${!ended ? actionButton("finish-survey", survey.id, "check", "Kết thúc khảo sát") : ""}
    ${
      active
        ? `<button class="icon-action is-disabled" type="button" disabled aria-label="Không thể xóa khảo sát đang hoạt động" title="Không thể xóa khảo sát đang hoạt động">${icon("trash")}</button>`
        : actionButton("delete-survey", survey.id, "trash", "Xóa khảo sát", "danger")
    }
  `;
}

function renderSurveyActions(survey) {
  const active = isSurveyStatusActive(survey.status);
  const paused = isSurveyPausedStatus(survey.status);
  const ended = isSurveyEndedStatus(survey.status);
  const expired = isSurveyExpiredStatus(survey.status);
  const canEditConfig = isSurveyConfigEditable(survey);
  const canEditBasic = isSurveyBasicEditable(survey);
  const canApprove = !active && !paused && !ended && !expired;
  const canToggleActive = active || paused;
  const editButton = canEditBasic
    ? actionButton("edit-survey", survey.id, "edit", canEditConfig ? "Sửa khảo sát" : "Sửa thông tin cơ bản")
    : `<button class="icon-action is-disabled" type="button" disabled aria-label="Chỉ khảo sát Khởi tạo hoặc Ngưng hoạt động mới được sửa" title="Chỉ khảo sát Khởi tạo hoặc Ngưng hoạt động mới được sửa">${icon("edit")}</button>`;
  const deleteButton = canEditConfig
    ? actionButton("delete-survey", survey.id, "trash", "Xóa khảo sát", "danger")
    : `<button class="icon-action is-disabled" type="button" disabled aria-label="Chỉ khảo sát Khởi tạo mới được xóa" title="Chỉ khảo sát Khởi tạo mới được xóa">${icon("trash")}</button>`;
  return `
    ${actionButton("view-survey", survey.id, "eye", "Xem khảo sát")}
    ${editButton}
    ${actionButton("copy-survey", survey.id, "copy", "Sao chép khảo sát")}
    ${canApprove ? actionButton("publish-survey", survey.id, "trend", "Duyệt khảo sát") : ""}
    ${canToggleActive ? actionButton("archive-survey", survey.id, active ? "clock" : "trend", active ? "Ngưng hoạt động" : "Hoạt động trở lại") : ""}
    ${!ended ? actionButton("finish-survey", survey.id, "check", "Kết thúc khảo sát") : ""}
    ${deleteButton}
  `;
}

function renderSurveys() {
  syncExpiredSurveys();
  const filtered = surveys.filter((survey) => {
    const value = normalizedText(`${survey.name} ${survey.code} ${survey.channel}`);
    const statusMatched = state.statusFilter === "all" || normalizedText(survey.status) === normalizedText(state.statusFilter);
    return (!state.search || value.includes(normalizedText(state.search))) && statusMatched;
  });
  const statuses = ["all", ...SURVEY_STATUSES.filter((status) => surveys.some((survey) => survey.status === status))];

  content.innerHTML = `
    ${renderHeader(
      "Quản lý Khảo sát",
      "Tạo, cập nhật và theo dõi phiên bản khảo sát.",
      `<button class="btn primary" data-action="create-survey" type="button">${icon("plus")} Tạo khảo sát mới</button>`,
    )}
    <form class="toolbar" id="surveySearchForm">
      <div class="toolbar-left">
        <input class="search" id="surveySearch" value="${escapeHtml(state.searchDraft || state.search)}" placeholder="Tìm theo tên, mã khảo sát..." autocomplete="off" />
        <button class="btn secondary" type="submit">${icon("search")} Tìm kiếm</button>
      </div>
      <select class="select compact-select" id="statusFilter" aria-label="Lọc trạng thái khảo sát">
        ${statuses
          .map((status) => `<option value="${status}" ${status === state.statusFilter ? "selected" : ""}>${status === "all" ? "Tất cả trạng thái" : escapeHtml(status)}</option>`)
          .join("")}
      </select>
    </form>
    <section class="panel table-panel">
      <div class="panel-header">
        <h2 class="panel-title">Danh sách khảo sát</h2>
        <span class="item-meta">${filtered.length} bản ghi</span>
      </div>
      <div class="survey-table-head" aria-hidden="true">
        <span>Mã / Tên khảo sát</span>
        <span>Kênh</span>
        <span>Bắt đầu</span>
        <span>Kết thúc</span>
        <span>Trạng thái</span>
        <span>Người tạo</span>
        <span>Ngày tạo</span>
        <span>Người cập nhật</span>
        <span>Ngày cập nhật</span>
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
                  <span class="table-cell">${escapeHtml(survey.channel || "—")}</span>
                  <span class="table-cell">${escapeHtml(formatDate(survey.startDate))}</span>
                  <span class="table-cell">${escapeHtml(formatDate(survey.endDate))}</span>
                  <span>${badge(survey.status || activeStatusLabel(isSurveyStatusActive(survey.status)), isSurveyStatusActive(survey.status))}</span>
                  <span class="table-cell">${escapeHtml(displayUserName(survey.createdBy))}</span>
                  <span class="table-cell">${escapeHtml(displayDateTime(survey.createdAt))}</span>
                  <span class="table-cell">${escapeHtml(displayUserName(survey.updatedBy))}</span>
                  <span class="table-cell">${escapeHtml(displayDateTime(survey.updatedAt))}</span>
                  <div class="row-actions">
                    ${renderSurveyActions(survey)}
                  </div>
                </div>
              `,
              )
              .join("")
          : `<div class="empty-state">Không tìm thấy khảo sát phù hợp.</div>`
      }
    </section>
  `;

  document.querySelector("#surveySearch")?.addEventListener("input", (event) => {
    state.searchDraft = event.target.value;
  });
  document.querySelector("#surveySearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.search = document.querySelector("#surveySearch")?.value || "";
    state.searchDraft = state.search;
    renderSurveys();
  });
  document.querySelector("#statusFilter").addEventListener("change", (event) => {
    state.statusFilter = event.target.value;
    renderSurveys();
  });
}

function renderSurveys() {
  syncExpiredSurveys();
  const filtered = surveys.filter((survey) => {
    const value = normalizedText(`${survey.name} ${survey.code} ${survey.channel}`);
    const statusMatched = state.statusFilter === "all" || normalizedText(survey.status) === normalizedText(state.statusFilter);
    return (!state.search || value.includes(normalizedText(state.search))) && statusMatched;
  });
  const statuses = ["all", ...SURVEY_STATUSES.filter((status) => surveys.some((survey) => survey.status === status))];

  content.innerHTML = `
    ${renderHeader("Quản lý Khảo sát", "Tạo, cập nhật và theo dõi khảo sát.", `<button class="btn primary" data-action="create-survey" type="button">${icon("plus")} Tạo khảo sát mới</button>`)}
    <form class="toolbar" id="surveySearchForm">
      <div class="inline-search">
        <input class="search" id="surveySearch" value="${escapeHtml(state.searchDraft || state.search)}" placeholder="Tìm theo mã, tên khảo sát..." autocomplete="off" />
        <button class="btn primary" type="submit">${icon("search")} Tìm kiếm</button>
      </div>
      <select class="select compact-select" id="statusFilter">
        ${statuses.map((status) => `<option value="${status}" ${status === state.statusFilter ? "selected" : ""}>${status === "all" ? "Tất cả trạng thái" : escapeHtml(status)}</option>`).join("")}
      </select>
    </form>
    <section class="panel table-panel">
      <div class="panel-header">
        <h2 class="panel-title">Danh sách khảo sát</h2>
        <span class="item-meta">${filtered.length} bản ghi</span>
      </div>
      <div class="survey-table-head" aria-hidden="true">
        <span>Mã khảo sát</span>
        <span>Tên khảo sát</span>
        <span>Kênh</span>
        <span>Bắt đầu</span>
        <span>Kết thúc</span>
        <span>Trạng thái</span>
        <span>Người tạo</span>
        <span>Ngày tạo</span>
        <span>Người cập nhật</span>
        <span>Ngày cập nhật</span>
        <span>Thao tác</span>
      </div>
      ${
        filtered.length
          ? filtered
              .map(
                (survey) => `
                <div class="survey-row survey-table-row">
                  <button type="button" data-action="open-survey" data-id="${survey.id}">
                    <span class="item-title">${escapeHtml(survey.code || "—")}</span>
                  </button>
                  <span class="table-cell item-title">${escapeHtml(survey.name || "—")}</span>
                  <span class="table-cell">${escapeHtml(survey.channel || "—")}</span>
                  <span class="table-cell">${escapeHtml(formatDate(survey.startDate))}</span>
                  <span class="table-cell">${escapeHtml(formatDate(survey.endDate))}</span>
                  <span>${badge(survey.status || activeStatusLabel(isSurveyStatusActive(survey.status)), isSurveyStatusActive(survey.status))}</span>
                  <span class="table-cell">${escapeHtml(displayUserName(survey.createdBy))}</span>
                  <span class="table-cell">${escapeHtml(displayDateTime(survey.createdAt))}</span>
                  <span class="table-cell">${escapeHtml(displayUserName(survey.updatedBy))}</span>
                  <span class="table-cell">${escapeHtml(displayDateTime(survey.updatedAt))}</span>
                  <div class="row-actions">${renderSurveyActions(survey)}</div>
                </div>
              `,
              )
              .join("")
          : `<div class="empty-state">Không tìm thấy khảo sát phù hợp.</div>`
      }
    </section>
  `;
  document.querySelector("#surveySearch")?.addEventListener("input", (event) => {
    state.searchDraft = event.target.value;
  });
  document.querySelector("#surveySearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.search = document.querySelector("#surveySearch")?.value || "";
    state.searchDraft = state.search;
    renderSurveys();
  });
  document.querySelector("#statusFilter").addEventListener("change", (event) => {
    state.statusFilter = event.target.value;
    renderSurveys();
  });
}

function renderCustomers() {
  const keyword = normalizedText(state.customerSearch);
  const visibleCustomers = customers.filter((customer) => {
    const haystack = normalizedText(`${customer.name} ${customer.code} ${customer.phone} ${customer.apartment}`);
    return !keyword || haystack.includes(keyword);
  });
  content.innerHTML = `
    ${renderHeader(
      "Khách hàng",
      "Danh sách khách hàng mẫu để chọn và thực hiện khảo sát.",
      "",
    )}
    <form class="panel customer-filter-panel" id="customerSearchForm">
      <div class="field customer-search-field">
        <label for="customerSearch">Tìm khách hàng</label>
        <div class="inline-search">
          <input class="search" id="customerSearch" value="${escapeHtml(state.customerSearchDraft || state.customerSearch)}" placeholder="Nhập tên, mã KH, SĐT, căn hộ..." autocomplete="off" />
          <button class="btn secondary" type="submit">${icon("search")} Tìm kiếm</button>
        </div>
      </div>
    </form>
    <section class="panel table-panel">
      <div class="panel-header">
        <h2 class="panel-title">Danh sách khách hàng</h2>
        <span class="item-meta">${visibleCustomers.length} / ${customers.length} khách hàng</span>
      </div>
      <div class="survey-table-head customer-table-head" aria-hidden="true">
        <span>Mã / Tên khách hàng</span>
        <span>Trạng thái</span>
        <span>Thao tác</span>
      </div>
      ${
        visibleCustomers.length
          ? visibleCustomers
              .map(
                (customer) => `
                <div class="survey-row survey-table-row customer-table-row ${customer.id === state.selectedCustomerId ? "is-selected" : ""}">
                  <button type="button" data-action="select-customer" data-id="${customer.id}">
                    <span class="item-title">${escapeHtml(customer.name)}</span>
                    <span class="item-meta">${escapeHtml(customer.code)}</span>
                  </button>
                  <div class="status-toggle-cell">
                    <button class="switch ${isCustomerActive(customer) ? "on" : ""}" type="button" data-action="toggle-customer-active" data-id="${customer.id}" aria-label="${isCustomerActive(customer) ? "Tắt khách hàng" : "Bật khách hàng"}"><span></span></button>
                    <span class="item-meta">${escapeHtml(activeStatusLabel(isCustomerActive(customer)))}</span>
                  </div>
                  <div class="row-actions">
                    <button class="btn primary compact-action" type="button" data-action="start-customer-survey" data-id="${customer.id}" ${isCustomerActive(customer) ? "" : "disabled"}>${icon("clipboard")} Làm khảo sát</button>
                  </div>
                </div>
              `,
              )
              .join("")
          : `<div class="empty-state">Không tìm thấy khách hàng phù hợp.</div>`
      }
    </section>
  `;

  document.querySelector("#customerSearch")?.addEventListener("input", (event) => {
    state.customerSearchDraft = event.target.value;
  });
  document.querySelector("#customerSearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.customerSearch = document.querySelector("#customerSearch")?.value || "";
    state.customerSearchDraft = state.customerSearch;
    renderCustomers();
  });
}

function renderUsers() {
  const roleName = (code) => roleCatalog.find((role) => role.code === code)?.name || code;
  const permissionSummary = (user) => {
    const granted = permissionsForUser(user);
    if (user.roleCode === "AGENT_VIA_SALESFORCE") return user.allowAgentEntry ? "Được phép hoàn thành khảo sát" : "Chưa có quyền hoàn thành khảo sát";
    if (!granted.length) return "Chưa cấu hình quyền";
    return `${granted.length} quyền: ${granted.slice(0, 3).join(", ")}${granted.length > 3 ? "..." : ""}`;
  };
  content.innerHTML = `
    ${renderHeader("Quản lý User", "Quản lý user nội bộ, agent trong allow list và quyền cấu hình phân quyền.", `<button class="btn primary" type="button" data-action="create-user">${icon("plus")} Tạo user mới</button>`)}
    <section class="panel table-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Danh sách user</h2>
          <p class="page-subtitle">Agent phải hoạt động và nằm trong allow list mới được bắt đầu khảo sát từ Salesforce/context khách hàng.</p>
        </div>
        <span class="item-meta">${users.length} user</span>
      </div>
      <div class="survey-table-head user-table-head" aria-hidden="true">
        <span>User</span>
        <span>Vai trò</span>
        <span>Trạng thái</span>
        <span>Allow list Agent</span>
        <span>Quyền áp dụng</span>
        <span>Thao tác</span>
      </div>
      ${
        users
          .map(
            (user) => `
            <div class="survey-row survey-table-row user-table-row">
              <div>
                <span class="item-title">${escapeHtml(user.displayName)}</span>
                <span class="item-meta">${escapeHtml(user.username)}</span>
                <span class="item-meta">
                  ${
                    currentUser.username === user.username
                      ? badge("Đang dùng", true)
                      : `<button class="btn secondary compact-action" type="button" data-action="set-current-user" data-id="${user.id}">Dùng user này</button>`
                  }
                </span>
              </div>
              <span class="table-cell">${escapeHtml(roleName(user.roleCode))}</span>
              <div class="status-toggle-cell">
                <button class="switch ${isUserActive(user) ? "on" : ""}" type="button" data-action="toggle-user-active" data-id="${user.id}" aria-label="${isUserActive(user) ? "Tắt user" : "Bật user"}"><span></span></button>
                <span class="item-meta">${escapeHtml(activeStatusLabel(isUserActive(user)))}</span>
              </div>
              <div class="status-toggle-cell">
                <button class="switch ${user.allowAgentEntry ? "on" : ""}" type="button" data-action="toggle-user-allowlist" data-id="${user.id}" aria-label="${user.allowAgentEntry ? "Gỡ khỏi allow list" : "Thêm vào allow list"}"><span></span></button>
                <span class="item-meta">${user.allowAgentEntry ? "Được phép" : "Không"}</span>
              </div>
              <span class="table-cell">${escapeHtml(permissionSummary(user))}</span>
              <div class="row-actions user-row-actions">
                ${
                  user.roleCode !== "AGENT_VIA_SALESFORCE"
                    ? `
                      <button class="btn secondary compact-action" type="button" data-action="edit-user-permissions" data-id="${user.id}">Gán quyền</button>
                      <button class="btn secondary compact-action" type="button" data-action="change-user-password" data-id="${user.id}">Đổi mật khẩu</button>
                    `
                    : `<span class="type-pill permission-action-label">Hoàn thành khảo sát</span>`
                }
              </div>
            </div>
          `,
          )
          .join("")
      }
    </section>
  `;
}

function renderUserPermissionChoices(selectedPermissions) {
  const granted = new Set(selectedPermissions);
  const groups = [...new Set(permissionCatalog.map((permission) => permission.group))];
  return groups
    .map((group) => {
      const items = permissionCatalog.filter((permission) => permission.group === group);
      return `
        <div class="permission-choice-group">
          <p class="section-label">${escapeHtml(group)}</p>
          <div class="permission-check-grid">
            ${items
              .map(
                (permission) => `
                  <label class="permission-check-card">
                    <input type="checkbox" name="permissions" value="${escapeHtml(permission.code)}" ${granted.has(permission.code) ? "checked" : ""} />
                    <span>
                      <strong>${escapeHtml(permission.label)}</strong>
                      <small>${escapeHtml(permission.code)}</small>
                    </span>
                  </label>
                `,
              )
              .join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

function renderUserRoleConfig(roleCode) {
  const selectedPermissions = permissionsForRole(roleCode);
  if (roleCode === "AGENT_VIA_SALESFORCE") {
    return `
      <div class="action-box user-role-config">
        <p class="section-label blue">Kiểm tra allow list Agent</p>
        <p class="confirm-copy">User vai trò Nhân viên tổng đài từ Salesforce chỉ được tạo/làm khảo sát từ CRM khi đang hoạt động và có trong allow list Agent.</p>
        <div class="check-row">
          <label>
            <input type="checkbox" id="userAllowAgent" name="allowAgentEntry" checked />
            Cho phép agent này tạo khảo sát từ Salesforce
          </label>
        </div>
      </div>
    `;
  }

  return `
    <div class="action-box user-role-config">
      <p class="section-label blue">Cấu hình phân quyền</p>
      <p class="confirm-copy">Vai trò khác Agent sẽ dùng bộ quyền bên dưới và có thể cập nhật mật khẩu đăng nhập portal.</p>
      <div class="field" style="margin-bottom: 16px">
        <label for="userPassword">Mật khẩu tạm</label>
        <input class="input" id="userPassword" name="password" type="password" placeholder="Nhập mật khẩu tạm cho user" autocomplete="new-password" />
      </div>
      ${renderUserPermissionChoices(selectedPermissions)}
    </div>
  `;
}

function openUserModal() {
  const defaultRole = "AGENT_VIA_SALESFORCE";
  openModal(`
    <form class="modal wide-modal" id="userForm" role="dialog" aria-modal="true" aria-labelledby="userModalTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="userModalTitle">Tạo user mới</h2>
        <button class="modal-close" type="button" data-action="close-modal" aria-label="Đóng">×</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="field">
            <label for="userDisplayName">Tên hiển thị <span class="required">*</span></label>
            <input class="input" id="userDisplayName" name="displayName" required placeholder="VD: Agent Nguyễn" />
          </div>
          <div class="field">
            <label for="userUsername">Username / Email <span class="required">*</span></label>
            <input class="input" id="userUsername" name="username" required placeholder="agent@salesforce.local" />
          </div>
          <div class="field">
            <label for="userRole">Vai trò <span class="required">*</span></label>
            <select class="select" id="userRole" name="roleCode" required>
              ${roleCatalog.map((role) => `<option value="${escapeHtml(role.code)}" ${role.code === defaultRole ? "selected" : ""}>${escapeHtml(role.name)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label>Trạng thái</label>
            <div class="status-toggle-cell form-switch-cell">
              <input type="hidden" name="statusActive" id="userStatusValue" value="true" />
              <button class="switch on" type="button" data-action="toggle-user-form-status" aria-label="Bật/tắt trạng thái user"><span></span></button>
              <span class="item-meta" id="userStatusLabel">Hoạt động</span>
            </div>
          </div>
        </div>
        <div id="userRoleConfig">${renderUserRoleConfig(defaultRole)}</div>
        <div class="form-footer">
          <button class="btn secondary" type="button" data-action="close-modal">Hủy</button>
          <button class="btn primary" type="submit">${icon("save")} Lưu user</button>
        </div>
      </div>
    </form>
  `);

  const form = document.querySelector("#userForm");
  form?.querySelector("#userRole")?.addEventListener("change", (event) => {
    const panel = form.querySelector("#userRoleConfig");
    if (panel) panel.innerHTML = renderUserRoleConfig(event.target.value);
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const username = String(formData.get("username") || "").trim();
    const displayName = String(formData.get("displayName") || "").trim();
    const roleCode = String(formData.get("roleCode") || defaultRole);
    if (!displayName || !username) {
      showToast("Vui lòng nhập tên hiển thị và username.");
      return;
    }
    if (users.some((user) => normalizedText(user.username) === normalizedText(username))) {
      showToast("Username này đã tồn tại.");
      return;
    }
    const isAgent = roleCode === "AGENT_VIA_SALESFORCE";
    const selectedPermissions = isAgent ? permissionsForRole(roleCode) : formData.getAll("permissions").map(String);
    const password = String(formData.get("password") || "").trim();
    users.push({
      id: `user-${Date.now()}`,
      username,
      displayName,
      roleCode,
      status: activeStatusLabel(formData.get("statusActive") === "true"),
      allowAgentEntry: isAgent ? formData.get("allowAgentEntry") === "on" : false,
      allowPermissionConfig: false,
      permissions: selectedPermissions.length ? selectedPermissions : permissionsForRole(roleCode),
      passwordSet: !isAgent && Boolean(password),
      passwordUpdatedBy: !isAgent && password ? currentUser.username : "",
      passwordUpdatedAt: !isAgent && password ? new Date().toISOString() : "",
      createdFrom: isAgent ? "Salesforce allow list" : "Portal phân quyền",
    });
    closeModal();
    showToast(isAgent ? "Đã tạo agent và cập nhật allow list." : "Đã tạo user và cấu hình quyền.");
    render();
  });
}

function openUserPermissionModal(userId) {
  const user = users.find((item) => item.id === userId);
  if (!user) return;
  if (user.roleCode === "AGENT_VIA_SALESFORCE") {
    showToast("Agent Salesforce dùng allow list, không gán bộ quyền thủ công.");
    return;
  }
  const role = roleCatalog.find((item) => item.code === user.roleCode);
  const selectedPermissions = permissionsForUser(user);
  openModal(`
    <form class="modal wide-modal" id="userPermissionForm" role="dialog" aria-modal="true" aria-labelledby="userPermissionTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="userPermissionTitle">Gán phân quyền</h2>
        <button class="modal-close" type="button" data-action="close-modal" aria-label="Đóng">×</button>
      </div>
      <div class="modal-body">
        <p class="confirm-copy"><strong>${escapeHtml(user.displayName)}</strong> · ${escapeHtml(user.username)} · ${escapeHtml(role?.name || user.roleCode)}</p>
        ${renderUserPermissionChoices(selectedPermissions)}
        <div class="form-footer">
          <button class="btn secondary" type="button" data-action="close-modal">Hủy</button>
          <button class="btn primary" type="submit">${icon("save")} Lưu phân quyền</button>
        </div>
      </div>
    </form>
  `);

  document.querySelector("#userPermissionForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const selected = formData.getAll("permissions").map(String);
    user.permissions = selected.length ? selected : [];
    user.updatedBy = currentUser.username;
    user.updatedAt = new Date().toISOString();
    closeModal();
    showToast("Đã cập nhật phân quyền user.");
    render();
  });
}

function openUserPasswordModal(userId) {
  const user = users.find((item) => item.id === userId);
  if (!user) return;
  if (user.roleCode === "AGENT_VIA_SALESFORCE") {
    showToast("Nhân viên tổng đài từ Salesforce không cập nhật mật khẩu trong portal.");
    return;
  }
  openModal(`
    <form class="modal confirm-modal" id="userPasswordForm" role="dialog" aria-modal="true" aria-labelledby="userPasswordTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="userPasswordTitle">Đổi mật khẩu user</h2>
        <button class="modal-close" type="button" data-action="close-modal" aria-label="Đóng">×</button>
      </div>
      <div class="modal-body">
        <p class="confirm-copy"><strong>${escapeHtml(user.displayName)}</strong> · ${escapeHtml(user.username)}</p>
        <div class="field" style="margin-top: 16px">
          <label for="newUserPassword">Mật khẩu mới <span class="required">*</span></label>
          <input class="input" id="newUserPassword" name="password" type="password" required minlength="6" placeholder="Tối thiểu 6 ký tự" autocomplete="new-password" />
        </div>
        <div class="field" style="margin-top: 12px">
          <label for="confirmUserPassword">Nhập lại mật khẩu <span class="required">*</span></label>
          <input class="input" id="confirmUserPassword" name="confirmPassword" type="password" required minlength="6" placeholder="Nhập lại mật khẩu" autocomplete="new-password" />
        </div>
        <div class="form-footer">
          <button class="btn secondary" type="button" data-action="close-modal">Hủy</button>
          <button class="btn primary" type="submit">${icon("save")} Cập nhật mật khẩu</button>
        </div>
      </div>
    </form>
  `);

  document.querySelector("#userPasswordForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    if (password.length < 6) {
      showToast("Mật khẩu cần tối thiểu 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Mật khẩu nhập lại chưa khớp.");
      return;
    }
    user.passwordSet = true;
    user.passwordUpdatedBy = currentUser.username;
    user.passwordUpdatedAt = new Date().toISOString();
    user.updatedBy = currentUser.username;
    user.updatedAt = new Date().toISOString();
    closeModal();
    showToast("Đã cập nhật mật khẩu user.");
    render();
  });
}

function renderReports() {
  const visibleReports = filteredReports();
  const surveyOptions = ["all", ...new Set(reports.map((report) => report.surveyId).filter(Boolean))];

  content.innerHTML = `
    ${renderHeader("Báo cáo", "Lọc danh sách kết quả và export raw data chi tiết theo filter hiện tại.", `<button class="btn primary" type="button" data-action="export-reports">${icon("file")} Export raw data</button>`)}
    <form class="panel report-filter-panel" id="reportSearchForm">
      <div class="form-grid four">
        <div class="field">
          <label for="reportSurveyFilter">Khảo sát</label>
          <select class="select" id="reportSurveyFilter">
            ${surveyOptions
              .map((surveyId) => {
                const surveyName = surveyId === "all" ? "Tất cả khảo sát" : reports.find((report) => report.surveyId === surveyId)?.surveyName || surveyId;
                return `<option value="${escapeHtml(surveyId)}" ${surveyId === state.reportSurveyFilter ? "selected" : ""}>${escapeHtml(surveyName)}</option>`;
              })
              .join("")}
          </select>
        </div>
        <div class="field">
          <label for="reportFrom">Từ ngày hoàn thành</label>
          <input class="input" id="reportFrom" type="date" value="${escapeHtml(state.reportFrom)}" />
        </div>
        <div class="field">
          <label for="reportTo">Đến ngày hoàn thành</label>
          <input class="input" id="reportTo" type="date" value="${escapeHtml(state.reportTo)}" />
        </div>
        <div class="field">
          <label for="reportCustomerFilter">Khách hàng / Contact ID</label>
          <input class="input" id="reportCustomerFilter" value="${escapeHtml(state.reportCustomerDraft || state.reportCustomerFilter)}" placeholder="Tên, mã, SĐT..." autocomplete="off" />
        </div>
      </div>
      <div class="form-actions-left">
        <button class="btn secondary" type="submit">${icon("search")} Tìm kiếm</button>
      </div>
      <p class="item-meta">${visibleReports.length} kết quả phù hợp filter. Export chỉ lấy dữ liệu đã hoàn thành và theo filter hiện tại.</p>
    </form>
    <section class="panel table-panel report-table-panel">
      <div class="panel-header">
        <h2 class="panel-title">Danh sách kết quả khảo sát</h2>
        <span class="item-meta">${visibleReports.length} bản ghi</span>
      </div>
      ${
        visibleReports.length
          ? `
            <div class="report-table-head" aria-hidden="true">
              <span>Phiên / Khách hàng</span>
              <span>Khảo sát</span>
              <span>Agent</span>
              <span>Bắt đầu</span>
              <span>Hoàn thành</span>
            </div>
            ${visibleReports
              .map(
                (report) => `
                <div class="report-table-row">
                  <div>
                    <span class="item-title">${escapeHtml(report.sessionId)} · ${escapeHtml(report.customerName)}</span>
                    <span class="item-meta">${escapeHtml(report.customerCode || "—")}</span>
                  </div>
                  <div>
                    <span class="item-title">${escapeHtml(report.surveyName)}</span>
                    <span class="item-meta">${escapeHtml(report.surveyCode || "—")}</span>
                  </div>
                  <span class="table-cell">${escapeHtml(displayUserName(report.answeredByUsername))}</span>
                  <span class="table-cell">${escapeHtml(formatDateTime(report.startedAt))}</span>
                  <span class="table-cell">${escapeHtml(formatDateTime(report.completedAt))}</span>
                </div>
              `,
              )
              .join("")}
          `
          : `<div class="empty-state">Chưa có kết quả phù hợp filter. Vào Khách hàng → Làm khảo sát và đi hết luồng câu hỏi để ghi nhận báo cáo.</div>`
      }
    </section>
  `;

  document.querySelector("#reportSurveyFilter")?.addEventListener("change", (event) => {
    state.reportSurveyFilter = event.target.value;
    renderReports();
  });
  document.querySelector("#reportFrom")?.addEventListener("change", (event) => {
    state.reportFrom = event.target.value;
    renderReports();
  });
  document.querySelector("#reportTo")?.addEventListener("change", (event) => {
    state.reportTo = event.target.value;
    renderReports();
  });
  document.querySelector("#reportCustomerFilter")?.addEventListener("input", (event) => {
    state.reportCustomerDraft = event.target.value;
  });
  document.querySelector("#reportSearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.reportCustomerFilter = document.querySelector("#reportCustomerFilter")?.value || "";
    state.reportCustomerDraft = state.reportCustomerFilter;
    renderReports();
  });
}

function renderReports() {
  const visibleReports = filteredReportsForScreen();
  const requiresSurveyFilter = !hasRequiredReportSurveyFilter();
  const surveyValue = state.reportSurveyDraft || (state.reportSurveyFilter === "all" ? "" : state.reportSurveyFilter);

  content.innerHTML = `
    ${renderHeader("Báo cáo", "Bắt buộc lọc theo mã khảo sát để export raw data đúng một bộ khảo sát.", `<button class="btn primary" type="button" data-action="export-reports">${icon("file")} Export raw data</button>`)}
    <form class="panel report-filter-panel" id="reportSearchForm">
      <div class="report-filter-grid">
        <div class="field">
          <label for="reportSurveyFilter">Mã khảo sát <span class="required">*</span></label>
          <input class="input" id="reportSurveyFilter" value="${escapeHtml(surveyValue)}" placeholder="Nhập chính xác mã khảo sát..." autocomplete="off" required />
        </div>
        <div class="field">
          <label for="reportFrom">Từ ngày hoàn thành</label>
          <input class="input" id="reportFrom" type="date" value="${escapeHtml(state.reportFrom)}" />
        </div>
        <div class="field">
          <label for="reportTo">Đến ngày hoàn thành</label>
          <input class="input" id="reportTo" type="date" value="${escapeHtml(state.reportTo)}" />
        </div>
        <div class="field">
          <label for="reportCustomerFilter">Khách hàng / Contact ID</label>
          <input class="input" id="reportCustomerFilter" value="${escapeHtml(state.reportCustomerDraft || state.reportCustomerFilter)}" placeholder="Tên, mã KH, SĐT..." autocomplete="off" />
        </div>
        <div class="field report-search-action">
          <label>&nbsp;</label>
          <button class="btn primary report-search-button" type="submit">${icon("search")} Tìm kiếm</button>
        </div>
      </div>
      <p class="item-meta">${requiresSurveyFilter ? "Vui lòng nhập chính xác mã khảo sát rồi bấm Tìm kiếm để xem dữ liệu." : `${visibleReports.length} kết quả phù hợp filter. Export chỉ lấy dữ liệu đã hoàn thành và theo filter hiện tại.`}</p>
    </form>
    <section class="panel table-panel report-table-panel">
      <div class="panel-header">
        <h2 class="panel-title">Danh sách kết quả khảo sát</h2>
        <span class="item-meta">${visibleReports.length} bản ghi</span>
      </div>
      ${
        visibleReports.length
          ? `
            <div class="report-table-scroll">
              <div class="report-table-head" aria-hidden="true">
                <span>Mã khách</span>
                <span>Tên khách hàng</span>
                <span>Mã khảo sát</span>
                <span>Tên khảo sát</span>
                <span>Agent</span>
                <span>Bắt đầu</span>
                <span>Hoàn thành</span>
              </div>
              ${visibleReports
                .map(
                  (report) => `
                  <div class="report-table-row">
                    <span class="table-cell">${escapeHtml(report.customerCode || "—")}</span>
                    <span class="table-cell item-title">${escapeHtml(report.customerName || "—")}</span>
                    <span class="table-cell">${escapeHtml(report.surveyCode || "—")}</span>
                    <span class="table-cell item-title">${escapeHtml(report.surveyName || "—")}</span>
                    <span class="table-cell">${escapeHtml(displayUserName(report.answeredByUsername))}</span>
                    <span class="table-cell">${escapeHtml(formatDateTime(report.startedAt))}</span>
                    <span class="table-cell">${escapeHtml(formatDateTime(report.completedAt))}</span>
                  </div>
                `,
                )
                .join("")}
            </div>
          `
          : `<div class="empty-state">${requiresSurveyFilter ? "Báo cáo yêu cầu nhập mã khảo sát trước khi lọc/export." : "Chưa có kết quả phù hợp filter. Vào Khách hàng → Làm khảo sát và đi hết luồng câu hỏi để ghi nhận báo cáo."}</div>`
      }
    </section>
  `;

  document.querySelector("#reportSurveyFilter")?.addEventListener("input", (event) => {
    state.reportSurveyDraft = event.target.value;
  });
  document.querySelector("#reportCustomerFilter")?.addEventListener("input", (event) => {
    state.reportCustomerDraft = event.target.value;
  });
  document.querySelector("#reportSearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.reportSurveyFilter = document.querySelector("#reportSurveyFilter")?.value || "all";
    state.reportSurveyDraft = state.reportSurveyFilter === "all" ? "" : state.reportSurveyFilter;
    state.reportFrom = document.querySelector("#reportFrom")?.value || "";
    state.reportTo = document.querySelector("#reportTo")?.value || "";
    state.reportCustomerFilter = document.querySelector("#reportCustomerFilter")?.value || "";
    state.reportCustomerDraft = state.reportCustomerFilter;
    renderReports();
  });
}

function renderReports2() {
  const visibleReports = filteredReportsForScreen();
  const requiresSurveyFilter = !hasRequiredReportSurveyFilter();
  const surveyValue = state.reportSurveyDraft || (state.reportSurveyFilter === "all" ? "" : state.reportSurveyFilter);

  content.innerHTML = `
    ${renderHeader("Báo cáo 2", "Test export raw data dạng cột động Qxx_Ax theo mã đáp án.", `<button class="btn primary" type="button" data-action="export-reports-2">${icon("file")} Export Excel</button>`)}
    <form class="panel report-filter-panel" id="reportSearchForm">
      <div class="report-filter-grid">
        <div class="field">
          <label for="reportSurveyFilter">Mã khảo sát <span class="required">*</span></label>
          <input class="input" id="reportSurveyFilter" value="${escapeHtml(surveyValue)}" placeholder="Nhập chính xác mã khảo sát..." autocomplete="off" required />
        </div>
        <div class="field">
          <label for="reportFrom">Từ ngày hoàn thành</label>
          <input class="input" id="reportFrom" type="date" value="${escapeHtml(state.reportFrom)}" />
        </div>
        <div class="field">
          <label for="reportTo">Đến ngày hoàn thành</label>
          <input class="input" id="reportTo" type="date" value="${escapeHtml(state.reportTo)}" />
        </div>
        <div class="field">
          <label for="reportCustomerFilter">Khách hàng / Contact ID</label>
          <input class="input" id="reportCustomerFilter" value="${escapeHtml(state.reportCustomerDraft || state.reportCustomerFilter)}" placeholder="Tên, mã KH, SĐT..." autocomplete="off" />
        </div>
        <div class="field report-search-action">
          <label>&nbsp;</label>
          <button class="btn primary report-search-button" type="submit">${icon("search")} Tìm kiếm</button>
        </div>
      </div>
      <p class="item-meta">${requiresSurveyFilter ? "Vui lòng nhập chính xác mã khảo sát rồi bấm Tìm kiếm để xem dữ liệu." : `${visibleReports.length} kết quả phù hợp filter. Export Báo cáo 2 chỉ lấy đúng các kết quả đang hiển thị.`}</p>
    </form>
    <section class="panel table-panel report-table-panel">
      <div class="panel-header">
        <h2 class="panel-title">Danh sách kết quả khảo sát</h2>
        <span class="item-meta">${visibleReports.length} bản ghi</span>
      </div>
      ${
        visibleReports.length
          ? `
            <div class="report-table-scroll">
              <div class="report-table-head" aria-hidden="true">
                <span>Mã khách</span>
                <span>Tên khách hàng</span>
                <span>Mã khảo sát</span>
                <span>Tên khảo sát</span>
                <span>Agent</span>
                <span>Bắt đầu</span>
                <span>Hoàn thành</span>
              </div>
              ${visibleReports
                .map(
                  (report) => `
                  <div class="report-table-row">
                    <span class="table-cell">${escapeHtml(report.customerCode || "—")}</span>
                    <span class="table-cell item-title">${escapeHtml(report.customerName || "—")}</span>
                    <span class="table-cell">${escapeHtml(report.surveyCode || "—")}</span>
                    <span class="table-cell item-title">${escapeHtml(report.surveyName || "—")}</span>
                    <span class="table-cell">${escapeHtml(displayUserName(report.answeredByUsername))}</span>
                    <span class="table-cell">${escapeHtml(formatDateTime(report.startedAt))}</span>
                    <span class="table-cell">${escapeHtml(formatDateTime(report.completedAt))}</span>
                  </div>
                `,
                )
                .join("")}
            </div>
          `
          : `<div class="empty-state">${requiresSurveyFilter ? "Báo cáo 2 yêu cầu nhập mã khảo sát trước khi lọc/export." : "Chưa có kết quả phù hợp filter."}</div>`
      }
    </section>
  `;

  document.querySelector("#reportSurveyFilter")?.addEventListener("input", (event) => {
    state.reportSurveyDraft = event.target.value;
  });
  document.querySelector("#reportCustomerFilter")?.addEventListener("input", (event) => {
    state.reportCustomerDraft = event.target.value;
  });
  document.querySelector("#reportSearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.reportSurveyFilter = document.querySelector("#reportSurveyFilter")?.value || "all";
    state.reportSurveyDraft = state.reportSurveyFilter === "all" ? "" : state.reportSurveyFilter;
    state.reportFrom = document.querySelector("#reportFrom")?.value || "";
    state.reportTo = document.querySelector("#reportTo")?.value || "";
    state.reportCustomerFilter = document.querySelector("#reportCustomerFilter")?.value || "";
    state.reportCustomerDraft = state.reportCustomerFilter;
    renderReports2();
  });
}

function renderPermissions() {
  const activeRole = roleCatalog.find((role) => role.code === state.currentRole) || roleCatalog[0];
  content.innerHTML = `
    ${renderHeader("Phân quyền", "Prototype role/permission MVP cho Survey. Agent đi từ Salesforce không cần tài khoản Survey riêng.")}
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Role hiện tại</h2>
          <p class="page-subtitle">${escapeHtml(currentUser.displayName)} · ${escapeHtml(currentUser.username)}</p>
        </div>
        <select class="select compact-select" id="roleSwitcher">
          ${roleCatalog.map((role) => `<option value="${role.code}" ${role.code === state.currentRole ? "selected" : ""}>${role.name}</option>`).join("")}
        </select>
      </div>
      <div class="info-grid">
        <div><span>Role Code</span><strong>${escapeHtml(activeRole.code)}</strong></div>
        <div><span>Role Name</span><strong>${escapeHtml(activeRole.name)}</strong></div>
        <div><span>Số quyền</span><strong>${activeRole.permissions.length}</strong></div>
        <div><span>Export raw data</span><strong>${hasPermission("RAW_DATA_EXPORT") ? "Được phép" : "Không được phép"}</strong></div>
      </div>
    </section>
    <section class="panel">
      <div class="panel-header">
        <h2 class="panel-title">Permission groups</h2>
        <span class="item-meta">${permissionCatalog.length} quyền MVP</span>
      </div>
      <div class="permission-grid">
        ${permissionCatalog
          .map(
            (permission) => `
            <article class="permission-card ${activeRole.permissions.includes(permission.code) ? "is-granted" : ""}">
              <span class="type-pill">${escapeHtml(permission.group)}</span>
              <h3 class="item-title">${escapeHtml(permission.label)}</h3>
              <p class="item-meta">${escapeHtml(permission.code)}</p>
              <p class="item-meta">${escapeHtml(permission.description)}</p>
              ${badge(activeRole.permissions.includes(permission.code) ? "Được phép" : "Không có quyền", activeRole.permissions.includes(permission.code))}
            </article>
          `,
          )
          .join("")}
      </div>
    </section>
  `;

  document.querySelector("#roleSwitcher")?.addEventListener("change", (event) => {
    state.currentRole = event.target.value;
    showToast(`Đã chuyển role sang ${roleCatalog.find((role) => role.code === state.currentRole)?.name || state.currentRole}.`);
    renderPermissions();
  });
}

function renderCreateSurvey() {
  content.innerHTML = `
    <button class="back-link" type="button" data-action="back-dashboard">${icon("arrowLeft")} Quay lại</button>
    <h1 class="page-title">Tạo khảo sát mới</h1>
    <form class="form-card" id="surveyForm" style="margin-top: 22px">
      <div class="form-grid">
        <div class="field">
          <label for="surveyCode">Mã khảo sát <span class="required">*</span></label>
          <input class="input" id="surveyCode" name="code" required placeholder="VD: SV001" />
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
          <label for="surveyChannel">Kênh trả lời <span class="required">*</span></label>
          <select class="select" id="surveyChannel" name="channel" required>
            <option>Agent nhập liệu</option>
          </select>
        </div>
      </div>
      <div class="form-grid" style="margin-top: 18px">
        <div class="field">
          <label for="surveyStart">Ngày bắt đầu <span class="required">*</span></label>
          <input class="input" id="surveyStart" name="startDate" type="date" required />
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
      status: "Khởi tạo",
      department: "",
      channel: "Agent nhập liệu",
      description: data.description.trim(),
      startDate: data.startDate,
      endDate: data.endDate,
      createdBy: currentUser.username,
      createdAt: new Date().toISOString(),
    };
    surveys.unshift(survey);
    state.selectedSurveyId = survey.id;
    state.detailTab = "questions";
    state.view = "surveyDetail";
    showToast("Đã lưu khảo sát mới.");
    render();
  });
}

function openSurveyEditModal(surveyId, readonly = false) {
  const survey = surveys.find((item) => item.id === surveyId);
  if (!survey) return;
  const fullEditable = isSurveyConfigEditable(survey);
  const basicEditable = isSurveyBasicEditable(survey);
  const canEditBasicFields = !readonly && basicEditable;
  const canEditFullFields = !readonly && fullEditable;
  const readonlyAttr = readonly ? "readonly disabled" : "";
  const basicReadonlyAttr = canEditBasicFields ? "" : "readonly disabled";
  const fullReadonlyAttr = canEditFullFields ? "" : "readonly disabled";
  const selectDisabled = canEditFullFields ? "" : "disabled";
  openModal(`
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="surveyEditTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="surveyEditTitle">${readonly ? "Chi tiết khảo sát" : "Sửa khảo sát"}</h2>
        <button class="modal-close" type="button" data-action="close-modal" aria-label="Đóng">×</button>
      </div>
      <form class="modal-body" id="surveyEditForm">
        <div class="form-grid">
          <div class="field">
            <label for="editSurveyCode">Mã khảo sát <span class="required">*</span></label>
            <input class="input" id="editSurveyCode" name="code" required value="${escapeHtml(survey.code)}" ${fullReadonlyAttr} />
          </div>
          <div class="field">
            <label for="editSurveyName">Tên khảo sát <span class="required">*</span></label>
            <input class="input" id="editSurveyName" name="name" required value="${escapeHtml(survey.name)}" ${basicReadonlyAttr} />
          </div>
          <div class="field full">
            <label for="editSurveyDescription">Mô tả</label>
            <textarea class="textarea" id="editSurveyDescription" name="description" ${basicReadonlyAttr}>${escapeHtml(survey.description || "")}</textarea>
          </div>
          <div class="field">
            <label for="editSurveyChannel">Kênh trả lời <span class="required">*</span></label>
            <select class="select" id="editSurveyChannel" name="channel" required ${selectDisabled}>
              <option selected>Agent nhập liệu</option>
            </select>
          </div>
          <div class="field">
            <label for="editSurveyStart">Ngày bắt đầu <span class="required">*</span></label>
            <input class="input" id="editSurveyStart" name="startDate" type="date" required value="${escapeHtml(survey.startDate || "")}" ${basicReadonlyAttr} />
          </div>
          <div class="field">
            <label for="editSurveyEnd">Ngày kết thúc</label>
            <input class="input" id="editSurveyEnd" name="endDate" type="date" value="${escapeHtml(survey.endDate || "")}" ${fullReadonlyAttr} />
          </div>
          <div class="field">
            <label>Trạng thái</label>
            <input class="input" value="${escapeHtml(survey.status || "Khởi tạo")}" readonly disabled />
          </div>
          <div class="field">
            <label>Người tạo</label>
            <input class="input" value="${escapeHtml(displayUserName(survey.createdBy))}" readonly disabled />
          </div>
          <div class="field">
            <label>Ngày tạo</label>
            <input class="input" value="${escapeHtml(displayDateTime(survey.createdAt))}" readonly disabled />
          </div>
          <div class="field">
            <label>Người cập nhật</label>
            <input class="input" value="${escapeHtml(displayUserName(survey.updatedBy))}" readonly disabled />
          </div>
          <div class="field">
            <label>Ngày cập nhật</label>
            <input class="input" value="${escapeHtml(displayDateTime(survey.updatedAt))}" readonly disabled />
          </div>
        </div>
        <div class="form-footer">
          <button class="btn secondary" type="button" data-action="close-modal">${readonly ? "Đóng" : "Hủy"}</button>
          ${readonly ? "" : `<button class="btn primary" type="submit">${icon("save")} Lưu</button>`}
        </div>
      </form>
    </div>
  `);

  if (readonly) return;
  document.querySelector("#surveyEditForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const payload = {
      code: fullEditable ? data.code.trim() : survey.code,
      name: basicEditable ? data.name.trim() : survey.name,
      description: basicEditable ? (data.description || "").trim() : survey.description,
      department: "",
      channel: "Agent nhập liệu",
      status: survey.status,
      startDate: basicEditable ? data.startDate : survey.startDate,
      endDate: fullEditable ? data.endDate : survey.endDate,
      updatedBy: currentUser.username,
      updatedAt: new Date().toISOString(),
    };
    const applyUpdate = () => {
      Object.assign(survey, payload);
      closeModal();
      showToast("Đã cập nhật khảo sát.");
      render();
    };
    if (payload.status !== survey.status) {
      openConfirmModal({
        title: "Cập nhật trạng thái khảo sát?",
        message: `Trạng thái khảo sát "${survey.name}" sẽ đổi từ "${survey.status}" sang "${payload.status}".`,
        confirmText: "Cập nhật trạng thái",
        onConfirm: applyUpdate,
      });
      return;
    }
    applyUpdate();
  });
}

function openSurveyViewModal(surveyId) {
  openSurveyEditModal(surveyId, true);
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
    questions.push({ ...question, id: `q-${Date.now()}-${index}`, surveyId: copyId, options: normalizeOptions(question.options || []) });
  });
  const sourceRules = rules.filter((rule) => rule.surveyId === surveyId);
  sourceRules.forEach((rule, index) => {
    rules.push({ ...rule, id: `r-${Date.now()}-${index}`, surveyId: copyId });
  });
  showToast("Đã nhân bản khảo sát.");
  render();
}

function deepCloneConfig(value) {
  return JSON.parse(JSON.stringify(value));
}

function duplicateSurvey(surveyId) {
  const survey = surveys.find((item) => item.id === surveyId);
  if (!survey) return;
  const now = Date.now();
  const timestamp = new Date().toISOString();
  const copyId = `sv-${now}`;
  const copiedSurvey = deepCloneConfig(survey);
  delete copiedSurvey.publishedBy;
  delete copiedSurvey.publishedAt;
  delete copiedSurvey.archivedBy;
  delete copiedSurvey.archivedAt;
  delete copiedSurvey.finishedBy;
  delete copiedSurvey.finishedAt;
  surveys.unshift({
    ...copiedSurvey,
    id: copyId,
    code: survey.code ? `${survey.code}-COPY` : "",
    name: `${survey.name} (bản sao)`,
    version: 1,
    status: "Khởi tạo",
    createdBy: currentUser.username,
    createdAt: timestamp,
    updatedBy: currentUser.username,
    updatedAt: timestamp,
  });
  questions
    .filter((question) => question.surveyId === surveyId)
    .forEach((question, index) => {
      questions.push({
        ...deepCloneConfig(question),
        id: `q-${now}-${index}`,
        surveyId: copyId,
        createdBy: currentUser.username,
        createdAt: timestamp,
        updatedBy: currentUser.username,
        updatedAt: timestamp,
      });
    });
  rules
    .filter((rule) => rule.surveyId === surveyId)
    .forEach((rule, index) => {
      rules.push({
        ...deepCloneConfig(rule),
        id: `r-${now}-${index}`,
        surveyId: copyId,
        active: rule.active !== false,
        createdBy: currentUser.username,
        createdAt: timestamp,
        updatedBy: currentUser.username,
        updatedAt: timestamp,
      });
    });
  state.selectedSurveyId = copyId;
  state.view = "surveyDetail";
  state.detailTab = "questions";
  persistPrototypeData();
  showToast("Đã sao chép khảo sát đầy đủ cấu hình, câu hỏi và điều kiện.");
  render();
}

function deleteSurvey(surveyId) {
  if (false && surveys.length <= 1) {
    showToast("Cần giữ lại ít nhất một khảo sát.");
    return;
  }
  const index = surveys.findIndex((survey) => survey.id === surveyId);
  if (index === -1) return;
  if (isSurveyStatusActive(surveys[index].status)) {
    showToast("Không thể xóa khảo sát đang hoạt động.");
    return;
  }
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
  const surveyEntryQs = previewQuestions();
  const tabContent = {
    questions: renderQuestionsTab(surveyQs),
    branching: renderBranchingTab(surveyRs),
    entry: renderEntryTab(surveyEntryQs),
  }[state.detailTab || "questions"];

  content.innerHTML = `
    <button class="back-link" type="button" data-action="view-surveys">${icon("arrowLeft")} Quay lại danh sách</button>
    ${renderSurveyInfoBlock(survey, surveyQs.length, surveyRs.length)}

    <div class="tabs" role="tablist">
      <button class="tab-button ${state.detailTab === "questions" ? "active" : ""}" type="button" data-action="detail-tab" data-tab="questions">Câu hỏi</button>
      <button class="tab-button ${state.detailTab === "branching" ? "active" : ""}" type="button" data-action="detail-tab" data-tab="branching">Điều kiện rẽ nhánh</button>
      <button class="tab-button ${state.detailTab === "entry" ? "active" : ""}" type="button" data-action="detail-tab" data-tab="entry">Kiểm tra câu hỏi</button>
    </div>

    ${tabContent}
  `;
}

function renderQuestionsTab(surveyQs) {
  const canEditConfig = isSelectedSurveyConfigEditable();
  return `
    <section class="panel block-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Danh sách câu hỏi</h2>
          <p class="page-subtitle">${surveyQs.length} câu hỏi trong khảo sát này</p>
        </div>
        <div class="toolbar-left">
          <button class="btn secondary" type="button" data-action="add-rule" ${canEditConfig ? "" : "disabled"}>${icon("plus")} Thêm điều kiện</button>
          <button class="btn primary" type="button" data-action="add-question" data-testid="add-question" ${canEditConfig ? "" : "disabled"}>${icon("plus")} Thêm câu hỏi</button>
        </div>
      </div>
      <div class="question-list">
        ${
          surveyQs.length
            ? `
              <div class="question-table-head" aria-hidden="true">
                <span></span>
                <span>Mã / Nội dung câu hỏi</span>
                <span>Loại</span>
                <span>Thứ tự</span>
                <span>Trạng thái</span>
                <span>Người tạo</span>
                <span>Ngày tạo</span>
                <span>Người cập nhật</span>
                <span>Ngày cập nhật</span>
                <span>Thao tác</span>
              </div>
            `
            : ""
        }
        ${
          surveyQs.length
            ? surveyQs
                .map(
                  (question) => `
                  <article class="question-card question-table-row ${question.active ? "" : "is-inactive"}" draggable="${canEditConfig ? "true" : "false"}" data-question-id="${question.id}">
                    <button class="drag-handle" type="button" aria-label="Kéo để sắp xếp câu hỏi" title="Kéo để sắp xếp">⋮⋮</button>
                    <div class="question-card-main">
                      <div class="question-card-meta">
                        <span class="code-pill">${escapeHtml(question.code)}</span>
                        ${question.required ? `<span class="type-pill danger-soft">Bắt buộc</span>` : ""}
                      </div>
                      <h3 class="question-title">${escapeHtml(question.text)}</h3>
                      <div class="item-meta">${allOptionTexts(question).length ? `${allOptionTexts(question).map(escapeHtml).join(", ")}` : ""}${isMatrixQuestionType(question.type) ? `${matrixRowsForQuestion(question).length} dòng · ${matrixColumnsForQuestion(question).length} cột` : ""}</div>
                    </div>
                    <span class="table-cell">${escapeHtml(normalizedQuestionType(question.type))}</span>
                    <span class="table-cell">${question.order}</span>
                    <div class="status-toggle-cell">
                      <button class="switch ${question.active ? "on" : ""}" type="button" data-action="toggle-question" data-id="${question.id}" aria-label="${question.active ? "Tắt câu hỏi" : "Bật câu hỏi"}" ${canEditConfig ? "" : "disabled"}><span></span></button>
                      <span class="item-meta">${question.active ? "Hoạt động" : "Không hoạt động"}</span>
                    </div>
                    <span class="table-cell">${escapeHtml(displayUserName(question.createdBy || question.updatedBy))}</span>
                    <span class="table-cell">${escapeHtml(displayDateTime(question.createdAt || question.updatedAt))}</span>
                    <span class="table-cell">${escapeHtml(displayUserName(question.updatedBy))}</span>
                    <span class="table-cell">${escapeHtml(displayDateTime(question.updatedAt))}</span>
                    <div class="question-actions">
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
  const canEditConfig = isSelectedSurveyConfigEditable();
  return `
    <section class="panel block-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Điều kiện rẽ nhánh</h2>
          <p class="page-subtitle">${surveyRs.length} điều kiện đang áp dụng trong khảo sát này</p>
        </div>
        <div class="toolbar-left">
          <button class="btn secondary" type="button" data-action="check-rule-loop">${icon("branch")} Kiểm tra vòng lặp</button>
          <button class="btn primary" type="button" data-action="add-rule" data-testid="add-rule" ${canEditConfig ? "" : "disabled"}>${icon("plus")} Thêm điều kiện</button>
        </div>
      </div>
      <div class="rule-list">
        ${
          surveyRs.length
            ? `
              <div class="rule-table-head" aria-hidden="true">
                <span>Mã / Tên điều kiện</span>
                <span>Trạng thái</span>
                <span>Người tạo</span>
                <span>Ngày tạo</span>
                <span>Người cập nhật</span>
                <span>Ngày cập nhật</span>
                <span>Thao tác</span>
              </div>
            `
            : ""
        }
        ${
          surveyRs.length
            ? surveyRs
                .map(
                  (rule) => {
                    return `
                  <article class="rule-card rule-table-row ${rule.active ? "" : "is-inactive"}">
                    <div class="rule-card-main">
                      <div class="question-card-meta">
                        <span class="code-pill">${escapeHtml(rule.code)}</span>
                      </div>
                      <h3 class="question-title">${escapeHtml(rule.name)}</h3>
                      ${rule.description ? `<p class="item-meta">${escapeHtml(rule.description)}</p>` : ""}
                    </div>
                    <div class="status-toggle-cell">
                      <button class="switch ${rule.active ? "on" : ""}" type="button" data-action="toggle-rule" data-id="${rule.id}" aria-label="${rule.active ? "Tắt điều kiện" : "Bật điều kiện"}" ${canEditConfig ? "" : "disabled"}><span></span></button>
                      <span class="item-meta">${rule.active ? "Hoạt động" : "Không hoạt động"}</span>
                    </div>
                    <span class="table-cell">${escapeHtml(displayUserName(rule.createdBy || rule.updatedBy))}</span>
                    <span class="table-cell">${escapeHtml(displayDateTime(rule.createdAt || rule.updatedAt))}</span>
                    <span class="table-cell">${escapeHtml(displayUserName(rule.updatedBy))}</span>
                    <span class="table-cell">${escapeHtml(displayDateTime(rule.updatedAt))}</span>
                    <div class="question-actions">
                      ${actionButton("view-rule", rule.id, "eye", "Xem điều kiện")}
                      ${
                        rule.active
                          ? `<button class="icon-action is-disabled" type="button" disabled aria-label="Tắt điều kiện trước khi sửa" title="Tắt điều kiện trước khi sửa">${icon("edit")}</button>`
                          : actionButton("edit-rule", rule.id, "edit", "Sửa điều kiện")
                      }
                      ${actionButton("delete-rule", rule.id, "trash", "Xóa điều kiện", "danger")}
                    </div>
                  </article>
                `;
                  },
                )
                .join("")
            : `<div class="empty-state">Chưa có điều kiện rẽ nhánh. Hãy thêm điều kiện đầu tiên.</div>`
        }
      </div>
    </section>
  `;
}

function renderQuestionsTab(surveyQs) {
  const canEditConfig = isSelectedSurveyConfigEditable();
  return `
    <section class="panel block-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Danh sách câu hỏi</h2>
          <p class="page-subtitle">${surveyQs.length} câu hỏi trong khảo sát này</p>
        </div>
        <div class="toolbar-left">
          <button class="btn secondary" type="button" data-action="add-rule" ${canEditConfig ? "" : "disabled"}>${icon("plus")} Thêm điều kiện</button>
          <button class="btn primary" type="button" data-action="add-question" data-testid="add-question" ${canEditConfig ? "" : "disabled"}>${icon("plus")} Thêm câu hỏi</button>
        </div>
      </div>
      <div class="question-list">
        ${
          surveyQs.length
            ? `
              <div class="question-table-head" aria-hidden="true">
                <span></span>
                <span>Mã câu hỏi</span>
                <span>Nội dung câu hỏi</span>
                <span>Loại</span>
                <span>Thứ tự</span>
                <span>Trạng thái</span>
                <span>Người tạo</span>
                <span>Ngày tạo</span>
                <span>Người cập nhật</span>
                <span>Ngày cập nhật</span>
                <span>Thao tác</span>
              </div>
            `
            : ""
        }
        ${
          surveyQs.length
            ? surveyQs
                .map(
                  (question) => `
                  <article class="question-card question-table-row ${question.active ? "" : "is-inactive"}" draggable="${canEditConfig ? "true" : "false"}" data-question-id="${question.id}">
                    <button class="drag-handle" type="button" aria-label="Kéo để sắp xếp câu hỏi" title="Kéo để sắp xếp">⋮⋮</button>
                    <button class="table-link-cell" type="button" data-action="view-question" data-id="${question.id}">${escapeHtml(question.code)}</button>
                    <div>
                      <button class="question-title question-title-button" type="button" data-action="view-question" data-id="${question.id}">${escapeHtml(question.text)}</button>
                      <div class="item-meta">${allOptionTexts(question).length ? allOptionTexts(question).map(escapeHtml).join(", ") : ""}${isMatrixQuestionType(question.type) ? `${matrixRowsForQuestion(question).length} dòng · ${matrixColumnsForQuestion(question).length} cột` : ""}</div>
                    </div>
                    <span class="table-cell">${escapeHtml(normalizedQuestionType(question.type))}</span>
                    <span class="table-cell">${question.order}</span>
                    <div class="status-toggle-cell">
                      <button class="switch ${question.active ? "on" : ""}" type="button" data-action="toggle-question" data-id="${question.id}" aria-label="${question.active ? "Tắt câu hỏi" : "Bật câu hỏi"}" ${canEditConfig ? "" : "disabled"}><span></span></button>
                      <span class="item-meta">${question.active ? "Hoạt động" : "Không hoạt động"}</span>
                    </div>
                    <span class="table-cell">${escapeHtml(displayUserName(question.createdBy || question.updatedBy))}</span>
                    <span class="table-cell">${escapeHtml(displayDateTime(question.createdAt || question.updatedAt))}</span>
                    <span class="table-cell">${escapeHtml(displayUserName(question.updatedBy))}</span>
                    <span class="table-cell">${escapeHtml(displayDateTime(question.updatedAt))}</span>
                    <div class="question-actions">
                      ${canEditConfig ? actionButton("add-rule", question.id, "branch", "Thêm điều kiện từ câu hỏi") : `<button class="icon-action is-disabled" type="button" disabled title="Chỉ khảo sát Khởi tạo mới được thêm điều kiện">${icon("branch")}</button>`}
                      ${
                        !canEditConfig
                          ? `<button class="icon-action is-disabled" type="button" disabled aria-label="Chỉ khảo sát Khởi tạo mới được sửa câu hỏi" title="Chỉ khảo sát Khởi tạo mới được sửa câu hỏi">${icon("edit")}</button>`
                          : actionButton("edit-question", question.id, "edit", "Sửa câu hỏi")
                      }
                      ${canEditConfig ? actionButton("delete-question", question.id, "trash", "Xóa câu hỏi", "danger") : `<button class="icon-action is-disabled" type="button" disabled title="Chỉ khảo sát Khởi tạo mới được xóa câu hỏi">${icon("trash")}</button>`}
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
  const canEditConfig = isSelectedSurveyConfigEditable();
  return `
    <section class="panel block-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Điều kiện rẽ nhánh</h2>
          <p class="page-subtitle">${surveyRs.length} điều kiện trong khảo sát này</p>
        </div>
        <div class="toolbar-left">
          <button class="btn secondary" type="button" data-action="check-rule-loop">${icon("branch")} Kiểm tra vòng lặp</button>
          <button class="btn primary" type="button" data-action="add-rule" data-testid="add-rule" ${canEditConfig ? "" : "disabled"}>${icon("plus")} Thêm điều kiện</button>
        </div>
      </div>
      <div class="rule-list">
        ${
          surveyRs.length
            ? `
              <div class="rule-table-head" aria-hidden="true">
                <span>Mã điều kiện</span>
                <span>Tên điều kiện</span>
                <span>Trạng thái</span>
                <span>Người tạo</span>
                <span>Ngày tạo</span>
                <span>Người cập nhật</span>
                <span>Ngày cập nhật</span>
                <span>Thao tác</span>
              </div>
            `
            : ""
        }
        ${
          surveyRs.length
            ? surveyRs
                .map(
                  (rule) => `
                  <article class="rule-card rule-table-row ${rule.active ? "" : "is-inactive"}">
                    <span class="table-cell item-title">${escapeHtml(rule.code)}</span>
                    <div>
                      <h3 class="question-title">${escapeHtml(rule.name)}</h3>
                      ${rule.description ? `<p class="item-meta">${escapeHtml(rule.description)}</p>` : ""}
                    </div>
                    <div class="status-toggle-cell">
                      <button class="switch ${rule.active ? "on" : ""}" type="button" data-action="toggle-rule" data-id="${rule.id}" aria-label="${rule.active ? "Tắt điều kiện" : "Bật điều kiện"}" ${canEditConfig ? "" : "disabled"}><span></span></button>
                      <span class="item-meta">${rule.active ? "Hoạt động" : "Không hoạt động"}</span>
                    </div>
                    <span class="table-cell">${escapeHtml(displayUserName(rule.createdBy || rule.updatedBy))}</span>
                    <span class="table-cell">${escapeHtml(displayDateTime(rule.createdAt || rule.updatedAt))}</span>
                    <span class="table-cell">${escapeHtml(displayUserName(rule.updatedBy))}</span>
                    <span class="table-cell">${escapeHtml(displayDateTime(rule.updatedAt))}</span>
                    <div class="question-actions">
                      ${actionButton("view-rule", rule.id, "eye", "Xem điều kiện")}
                      ${
                        !canEditConfig
                          ? `<button class="icon-action is-disabled" type="button" disabled aria-label="Chỉ khảo sát Khởi tạo mới được sửa điều kiện" title="Chỉ khảo sát Khởi tạo mới được sửa điều kiện">${icon("edit")}</button>`
                          : actionButton("edit-rule", rule.id, "edit", "Sửa điều kiện")
                      }
                      ${canEditConfig ? actionButton("delete-rule", rule.id, "trash", "Xóa điều kiện", "danger") : `<button class="icon-action is-disabled" type="button" disabled title="Chỉ khảo sát Khởi tạo mới được xóa điều kiện">${icon("trash")}</button>`}
                    </div>
                  </article>
                `,
                )
                .join("")
            : `<div class="empty-state">Chưa có điều kiện rẽ nhánh.</div>`
        }
      </div>
    </section>
  `;
}

function renderEntryTab(surveyQs) {
  const survey = selectedSurvey();
  const customer = selectedCustomer();
  const surveySessions = survey ? sessions.filter((session) => session.surveyId === survey.id) : [];
  const current = surveyQs[state.selectedQuestionIndex] || surveyQs[0];

  return `
    <section class="panel block-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Kiểm tra câu hỏi</h2>
          <p class="page-subtitle">${customer ? `Khách hàng: ${customer.name} · ${customer.apartment || "Chưa có căn hộ"}` : `${surveySessions.length} lượt kiểm tra của khảo sát này`}</p>
        </div>
      </div>
      <section class="entry-layout embedded-entry">
        <aside class="entry-list" aria-label="Danh sách câu hỏi">
          ${surveyQs
            .map(
              (question, index) => `
              <button class="entry-card ${index === state.selectedQuestionIndex ? "active" : ""}" type="button" disabled title="Làm khảo sát theo thứ tự từ câu 1">
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
                <h2 class="panel-title">${escapeHtml(current.code)} · ${escapeHtml(normalizedQuestionType(current.type))}</h2>
                ${badge(current.required ? "Bắt buộc" : "Tùy chọn", current.required)}
              </div>
              <div style="padding: 20px">
                <h3 class="question-title">${escapeHtml(current.text)}</h3>
                ${renderAgentScriptHint(current)}
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
        ${surveySessions.length ? surveySessions.map((session) => `<span class="type-pill">${escapeHtml(session.id)} · ${escapeHtml(session.customer)} · ${escapeHtml(session.status)}</span>`).join("") : `<span class="item-meta">Chưa có lượt kiểm tra.</span>`}
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
          <h2 class="panel-title">Kiểm tra câu hỏi</h2>
          <p class="page-subtitle">${surveySessions.length} lượt kiểm tra của khảo sát này</p>
        </div>
      </div>
      <section class="entry-layout embedded-entry">
        <aside class="entry-list" aria-label="Danh sách câu hỏi">
          ${surveyQs
            .map(
              (question, index) => `
              <button class="entry-card ${index === state.selectedQuestionIndex ? "active" : ""}" type="button" disabled title="Làm khảo sát theo thứ tự từ câu 1">
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
                <h2 class="panel-title">${escapeHtml(current.code)} · ${escapeHtml(normalizedQuestionType(current.type))}</h2>
                ${badge(current.required ? "Bắt buộc" : "Tùy chọn", current.required)}
              </div>
              <div style="padding: 20px">
                <h3 class="question-title">${escapeHtml(current.text)}</h3>
                ${renderAgentScriptHint(current)}
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
        ${surveySessions.length ? surveySessions.map((session) => `<span class="type-pill">${escapeHtml(session.id)} · ${escapeHtml(session.status)}</span>`).join("") : `<span class="item-meta">Chưa có lượt kiểm tra.</span>`}
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
                    <div class="item-meta">Nếu ${escapeHtml(rule.source)}: ${ruleGroups(rule).map(describeRuleGroup).join(" HOẶC ")}</div>
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
  const customer = selectedCustomer();
  if (!survey) {
    content.innerHTML = `
      ${renderHeader(
        "Kiểm tra câu hỏi",
        "Chưa có khảo sát để kiểm tra câu hỏi.",
        `<button class="btn primary" data-action="create-survey" type="button">${icon("plus")} Tạo khảo sát mới</button>`,
      )}
      <section class="panel">
        <div class="empty-state">Tạo khảo sát và câu hỏi trước khi kiểm tra.</div>
      </section>
    `;
    return;
  }
  const surveyQs = entryQuestions();
  const current = surveyQs[state.selectedQuestionIndex] || surveyQs[0];

  content.innerHTML = `
    ${renderHeader("Kiểm tra câu hỏi", customer ? "Đang làm khảo sát" : "Màn hình test logic câu hỏi và điều kiện rẽ nhánh.")}
    <div class="toolbar">
      <div class="toolbar-left">
        <select class="select" id="entrySurvey" style="width: 280px">
          ${surveys.map((item) => `<option value="${item.id}" ${item.id === survey.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
        </select>
      </div>
    </div>
    <section class="entry-layout">
      <aside class="entry-list" aria-label="Danh sách câu hỏi">
        ${surveyQs
          .map(
            (question, index) => `
            <button class="entry-card ${index === state.selectedQuestionIndex ? "active" : ""}" type="button" disabled title="Làm khảo sát theo thứ tự từ câu 1">
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
              ${renderAgentScriptHint(current)}
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
    state.entryHistory = [];
    renderEntry();
  });
}

function renderAnswerControl(question) {
  const type = normalizedQuestionType(question.type);
  const value = state.answers[question.code] || "";
  if (isMatrixQuestionType(type)) {
    const matrixValue = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const rows = matrixRowsForQuestion(question);
    const columns = matrixColumnsForQuestion(question);
    const isMultiple = isMatrixMultipleType(type);
    const isRating = isMatrixRatingType(type);
    return `
      <div class="matrix-answer ${isRating ? "matrix-rating-answer" : ""}" role="group" aria-label="${escapeHtml(question.text)}">
        <div class="matrix-table" style="--matrix-columns: ${columns.length}">
          <div class="matrix-row matrix-head">
            <div class="matrix-label-cell">${isRating ? "Tiêu chí" : "Tình huống"}</div>
            ${columns.map((column) => `<div class="matrix-choice-head">${escapeHtml(column)}</div>`).join("")}
          </div>
          ${rows
            .map((row, rowIndex) => {
              const rowAnswer = matrixValue[row];
              const selectedValues = Array.isArray(rowAnswer) ? rowAnswer : [];
              return `
                <div class="matrix-row">
                  <div class="matrix-label-cell">${escapeHtml(row)}</div>
                  ${columns
                    .map((column, columnIndex) => {
                      const checked = isMultiple ? selectedValues.includes(column) : rowAnswer === column;
                      const inputType = isMultiple ? "checkbox" : "radio";
                      const dataAttr = isMultiple ? "data-matrix-multi-answer" : "data-matrix-answer";
                      return `
                        <label class="matrix-choice-cell">
                          <input
                            type="${inputType}"
                            name="matrix-${escapeHtml(question.code)}-${rowIndex}"
                            value="${escapeHtml(column)}"
                            ${checked ? "checked" : ""}
                            ${dataAttr}="${escapeHtml(question.code)}"
                            data-matrix-row="${escapeHtml(row)}"
                          />
                          <span class="sr-only">${escapeHtml(row)} - ${escapeHtml(column)}</span>
                        </label>
                      `;
                    })
                    .join("")}
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  if (type === "Chọn một đáp án" || type === "Đánh giá") {
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

  if (type === "Chọn nhiều đáp án") {
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

  if (type === RANKING_TYPE) {
    const rankedValues = rankingAnswerForQuestion(question);
    return `
      <div class="ranking-answer" data-ranking-list="${escapeHtml(question.code)}">
        <p class="ranking-hint">Sắp xếp theo thứ tự ưu tiên từ cao xuống thấp.</p>
        ${rankedValues
          .map(
            (option, index) => `
              <div class="ranking-item">
                <span class="ranking-position">${index + 1}</span>
                <span class="ranking-label">${escapeHtml(option)}</span>
                <div class="ranking-actions">
                  <button class="icon-action" type="button" data-action="rank-option-up" data-code="${escapeHtml(question.code)}" data-index="${index}" ${index === 0 ? "disabled" : ""} aria-label="Đưa lên">${icon("chevron-up")}</button>
                  <button class="icon-action" type="button" data-action="rank-option-down" data-code="${escapeHtml(question.code)}" data-index="${index}" ${index === rankedValues.length - 1 ? "disabled" : ""} aria-label="Đưa xuống">${icon("chevron-down")}</button>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
    `;
  }
  if (type === RANKING_TYPE) {
    const rankedValues = rankingAnswerForQuestion(question);
    return `
      <div class="ranking-answer" data-ranking-list="${escapeHtml(question.code)}">
        <p class="ranking-hint">Sắp xếp theo thứ tự ưu tiên từ cao xuống thấp.</p>
        ${rankedValues
          .map(
            (option, index) => `
              <div class="ranking-item">
                <span class="ranking-position">${index + 1}</span>
                <span class="ranking-label">${escapeHtml(option)}</span>
                <div class="ranking-actions">
                  <button class="icon-action" type="button" data-action="rank-option-up" data-code="${escapeHtml(question.code)}" data-index="${index}" ${index === 0 ? "disabled" : ""} aria-label="Đưa lên">${icon("chevron-up")}</button>
                  <button class="icon-action" type="button" data-action="rank-option-down" data-code="${escapeHtml(question.code)}" data-index="${index}" ${index === rankedValues.length - 1 ? "disabled" : ""} aria-label="Đưa xuống">${icon("chevron-down")}</button>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
    `;
  }
  if (type === "Số") {
    return `<input class="input" style="margin-top: 16px" type="number" min="${escapeHtml(question.minValue || "")}" max="${escapeHtml(question.maxValue || "")}" data-answer-text="${question.code}" value="${escapeHtml(value || question.defaultValue || "")}" placeholder="${escapeHtml(question.placeholder || "Nhập giá trị số...")}" />`;
  }

  if (type === "Ngày") {
    return `<input class="input" style="margin-top: 16px" type="date" min="${escapeHtml(question.minDate || "")}" max="${escapeHtml(question.maxDate || "")}" data-answer-text="${question.code}" value="${escapeHtml(value || question.defaultDate || "")}" />`;
  }

  if (type === RANKING_TYPE) {
    const rankedValues = rankingAnswerForQuestion(question);
    return `
      <div class="ranking-answer" data-ranking-list="${escapeHtml(question.code)}">
        <p class="ranking-hint">Sắp xếp theo thứ tự ưu tiên từ cao xuống thấp.</p>
        ${rankedValues
          .map(
            (option, index) => `
              <div class="ranking-item">
                <span class="ranking-position">${index + 1}</span>
                <span class="ranking-label">${escapeHtml(option)}</span>
                <div class="ranking-actions">
                  <button class="icon-action" type="button" data-action="rank-option-up" data-code="${escapeHtml(question.code)}" data-index="${index}" ${index === 0 ? "disabled" : ""} aria-label="Đưa lên">${icon("chevron-up")}</button>
                  <button class="icon-action" type="button" data-action="rank-option-down" data-code="${escapeHtml(question.code)}" data-index="${index}" ${index === rankedValues.length - 1 ? "disabled" : ""} aria-label="Đưa xuống">${icon("chevron-down")}</button>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
    `;
  }
  return `<input class="input" style="margin-top: 16px" type="text" data-answer-text="${question.code}" value="${escapeHtml(value)}" placeholder="${escapeHtml(question.placeholder || "Nhập câu trả lời...")}" />`;
}

function renderChoiceOptionControl(question, option, value, isMultiple = false) {
  const normalizedOption = normalizeOption(option);
  const optionValue = normalizedOption.text;
  const values = Array.isArray(value) ? value : [];
  const checked = isMultiple ? values.includes(optionValue) : value === optionValue;
  const otherText = otherAnswerText(question);
  const input = isMultiple
    ? `<input type="checkbox" value="${escapeHtml(optionValue)}" ${checked ? "checked" : ""} data-multi-answer="${question.code}" />`
    : `<input type="radio" name="answer-${question.code}" value="${escapeHtml(optionValue)}" ${checked ? "checked" : ""} data-answer="${question.code}" />`;
  return `
    <label class="answer-option">
      ${input}
      <span>${escapeHtml(optionValue)}</span>
    </label>
    ${
      isOtherOption(optionValue)
        ? `<input class="input other-answer-input" type="text" maxlength="255" data-other-answer="${question.code}" value="${escapeHtml(otherText)}" placeholder="Nhập nội dung khác, tối đa 255 ký tự" ${checked ? "" : "hidden"} />`
        : ""
    }
  `;
}

function renderAnswerControl(question) {
  const type = normalizedQuestionType(question.type);
  const value = state.answers[question.code] || "";
  if (isMatrixQuestionType(type)) {
    const matrixValue = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const rows = matrixRowsForQuestion(question);
    const columns = matrixColumnsForQuestion(question);
    const isMultiple = isMatrixMultipleType(type);
    const isRating = isMatrixRatingType(type);
    return `
      <div class="matrix-answer ${isRating ? "matrix-rating-answer" : ""}" role="group" aria-label="${escapeHtml(question.text)}">
        <div class="matrix-table" style="--matrix-columns: ${columns.length}">
          <div class="matrix-row matrix-head">
            <div class="matrix-label-cell">${isRating ? "Tiêu chí" : "Tình huống"}</div>
            ${columns.map((column) => `<div class="matrix-choice-head">${escapeHtml(column)}</div>`).join("")}
          </div>
          ${rows
            .map((row, rowIndex) => {
              const rowAnswer = matrixValue[row];
              const selectedValues = Array.isArray(rowAnswer) ? rowAnswer : [];
              return `
                <div class="matrix-row">
                  <div class="matrix-label-cell">${escapeHtml(row)}</div>
                  ${columns
                    .map((column) => {
                      const checked = isMultiple ? selectedValues.includes(column) : rowAnswer === column;
                      const inputType = isMultiple ? "checkbox" : "radio";
                      const dataAttr = isMultiple ? "data-matrix-multi-answer" : "data-matrix-answer";
                      return `
                        <label class="matrix-choice-cell">
                          <input type="${inputType}" name="matrix-${escapeHtml(question.code)}-${rowIndex}" value="${escapeHtml(column)}" ${checked ? "checked" : ""} ${dataAttr}="${escapeHtml(question.code)}" data-matrix-row="${escapeHtml(row)}" />
                          <span class="sr-only">${escapeHtml(row)} - ${escapeHtml(column)}</span>
                        </label>
                      `;
                    })
                    .join("")}
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }
  if (type === "Chọn một đáp án" || type === "Đánh giá") {
    return `<div class="answer-stack">${(question.options || []).map((option) => renderChoiceOptionControl(question, option, value, false)).join("")}</div>`;
  }
  if (type === "Chọn nhiều đáp án") {
    return `<div class="answer-stack">${(question.options || []).map((option) => renderChoiceOptionControl(question, option, value, true)).join("")}</div>`;
  }
  if (type === "Số") {
    return `<input class="input" style="margin-top: 16px" type="number" min="${escapeHtml(question.minValue || "")}" max="${escapeHtml(question.maxValue || "")}" data-answer-text="${question.code}" value="${escapeHtml(value || question.defaultValue || "")}" placeholder="${escapeHtml(question.placeholder || "Nhập giá trị số...")}" />`;
  }
  if (type === "Ngày") {
    return `<input class="input" style="margin-top: 16px" type="date" min="${escapeHtml(question.minDate || "")}" max="${escapeHtml(question.maxDate || "")}" data-answer-text="${question.code}" value="${escapeHtml(value || question.defaultDate || "")}" />`;
  }
  return `<input class="input" style="margin-top: 16px" type="text" data-answer-text="${question.code}" value="${escapeHtml(value)}" placeholder="${escapeHtml(question.placeholder || "Nhập câu trả lời...")}" />`;
}

function renderRankingAnswerControl(question) {
  const rankedValues = rankingAnswerForQuestion(question);
  return `
    <div class="ranking-answer" data-ranking-list="${escapeHtml(question.code)}">
      <p class="ranking-hint">Sắp xếp theo thứ tự ưu tiên từ cao xuống thấp.</p>
      ${rankedValues
        .map(
          (option, index) => `
            <div class="ranking-item">
              <span class="ranking-position">${index + 1}</span>
              <span class="ranking-label">${escapeHtml(option)}</span>
              <div class="ranking-actions">
                <button class="icon-action" type="button" data-action="rank-option-up" data-code="${escapeHtml(question.code)}" data-index="${index}" ${index === 0 ? "disabled" : ""} aria-label="Đưa lên">${icon("chevron-up")}</button>
                <button class="icon-action" type="button" data-action="rank-option-down" data-code="${escapeHtml(question.code)}" data-index="${index}" ${index === rankedValues.length - 1 ? "disabled" : ""} aria-label="Đưa xuống">${icon("chevron-down")}</button>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderAnswerControl(question) {
  const type = normalizedQuestionType(question.type);
  const value = state.answers[question.code] || "";
  const scalarValue = scalarAnswerValue(value);
  if (type === TOP_N_TYPE) return renderTopNAnswerControl(question, value);
  if (type === RANKING_TYPE) return renderRankingAnswerControl(question);
  if (isMatrixQuestionType(type)) {
    const matrixValue = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const rows = matrixRowsForQuestion(question);
    const columns = matrixColumnsForQuestion(question);
    const isMultiple = isMatrixMultipleType(type);
    const isRating = isMatrixRatingType(type);
    return `
      <div class="matrix-answer ${isRating ? "matrix-rating-answer" : ""}" role="group" aria-label="${escapeHtml(question.text)}">
        <div class="matrix-table" style="--matrix-columns: ${columns.length}">
          <div class="matrix-row matrix-head">
            <div class="matrix-label-cell">${isRating ? "Tiêu chí" : "Tình huống"}</div>
            ${columns.map((column) => `<div class="matrix-choice-head">${escapeHtml(column)}</div>`).join("")}
          </div>
          ${rows
            .map((row, rowIndex) => {
              const rowAnswer = matrixValue[row];
              const selectedValues = Array.isArray(rowAnswer) ? rowAnswer : [];
              return `
                <div class="matrix-row">
                  <div class="matrix-label-cell">${escapeHtml(row)}</div>
                  ${columns
                    .map((column) => {
                      const checked = isMultiple ? selectedValues.includes(column) : rowAnswer === column;
                      const inputType = isMultiple ? "checkbox" : "radio";
                      const dataAttr = isMultiple ? "data-matrix-multi-answer" : "data-matrix-answer";
                      return `
                        <label class="matrix-choice-cell">
                          <input type="${inputType}" name="matrix-${escapeHtml(question.code)}-${rowIndex}" value="${escapeHtml(column)}" ${checked ? "checked" : ""} ${dataAttr}="${escapeHtml(question.code)}" data-matrix-row="${escapeHtml(row)}" />
                          <span class="sr-only">${escapeHtml(row)} - ${escapeHtml(column)}</span>
                        </label>
                      `;
                    })
                    .join("")}
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }
  if (type === "Chọn một đáp án" || type === "Đánh giá") return `<div class="answer-stack">${activeQuestionOptions(question).map((option) => renderChoiceOptionControl(question, option, value, false)).join("")}</div>`;
  if (type === "Chọn nhiều đáp án") return `<div class="answer-stack">${activeQuestionOptions(question).map((option) => renderChoiceOptionControl(question, option, value, true)).join("")}</div>`;
  if (type === "Số") return `<input class="input" style="margin-top: 16px" type="number" min="${escapeHtml(question.minValue || "")}" max="${escapeHtml(question.maxValue || "")}" data-answer-text="${question.code}" value="${escapeHtml(scalarValue || question.defaultValue || "")}" placeholder="${escapeHtml(question.placeholder || "Nhập giá trị số...")}" />`;
  if (type === "Ngày") return `<input class="input" style="margin-top: 16px" type="date" min="${escapeHtml(question.minDate || "")}" max="${escapeHtml(question.maxDate || "")}" data-answer-text="${question.code}" value="${escapeHtml(scalarValue || question.defaultDate || "")}" />`;
  return `<input class="input" style="margin-top: 16px" type="text" data-answer-text="${question.code}" value="${escapeHtml(scalarValue)}" placeholder="${escapeHtml(question.placeholder || "Nhập câu trả lời...")}" />`;
}

function renderRankingAnswerControl(question) {
  const rankedValues = rankingAnswerForQuestion(question);
  return `
    <div class="ranking-answer" data-ranking-list="${escapeHtml(question.code)}">
      <p class="ranking-hint">Kéo thả để sắp xếp theo thứ tự ưu tiên từ cao xuống thấp.</p>
      ${rankedValues
        .map(
          (option, index) => `
            <div class="ranking-item" draggable="true" data-ranking-code="${escapeHtml(question.code)}" data-ranking-index="${index}">
              <span class="ranking-position">${index + 1}</span>
              <span class="ranking-label">${escapeHtml(option)}</span>
              <span class="ranking-drag-handle" aria-hidden="true">⋮⋮</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderAnswerOptionRows(options) {
  const locked = isSurveyApprovedOrBeyond(selectedSurvey());
  return options
    .map((option, index) => {
      const normalizedOption = normalizeOption(option, index);
      const isOther = isOtherOption(normalizedOption);
      return `
        <div class="answer-option-row ${isOther ? "is-system-option" : ""}">
          <input class="input option-code-input" name="optionCode" value="${escapeHtml(normalizedOption.code)}" placeholder="${escapeHtml(defaultOptionCode(index))}" aria-label="Mã đáp án" />
          <input class="input" name="optionValue" value="${escapeHtml(isOther ? OTHER_OPTION_LABEL : normalizedOption.text)}" placeholder="Đáp án ${index + 1}" ${isOther ? "disabled" : ""} />
          ${isOther ? `<input type="hidden" name="optionValue" value="${escapeHtml(OTHER_OPTION_LABEL)}" />` : ""}
          <label class="option-active-toggle"><input type="checkbox" name="optionActive" ${normalizedOption.active ? "checked" : ""} /> Hoạt động</label>
          ${
            locked
              ? `<button class="icon-action danger" type="button" data-action="remove-answer-option" aria-label="Không thể xóa đáp án sau duyệt" disabled>${icon("trash")}</button>`
              : `<button class="icon-action danger" type="button" data-action="remove-answer-option" aria-label="Xóa đáp án">${icon("trash")}</button>`
          }
        </div>
      `;
    })
    .join("");
}

function renderMatrixConfigRows(values, name, placeholder, codePrefix = "R") {
  return values
    .map((value, index) => {
      const item = normalizeMatrixItem(value, index, codePrefix);
      return `
        <div class="answer-option-row matrix-config-option-row">
          <input class="input option-code-input" name="matrixItemCode" value="${escapeHtml(item.code)}" placeholder="${escapeHtml(defaultMatrixItemCode(codePrefix, index))}" aria-label="Mã ${escapeHtml(placeholder)}" />
          <input class="input" name="${name}" data-matrix-item-text value="${escapeHtml(item.text)}" placeholder="${escapeHtml(placeholder)} ${index + 1}" />
          <button class="icon-action danger" type="button" data-action="remove-matrix-item" aria-label="Xóa dòng/cột ma trận">${icon("trash")}</button>
        </div>
      `;
    })
    .join("");
}

function renderMatrixRequiredConfig(question = {}) {
  const mode = question.matrixRequiredMode || "each_column_min_one";
  const minColumnSelections = question.minColumnSelections || 1;
  return `
    <div class="matrix-required-config">
      <p class="block-eyebrow">Ràng buộc trả lời</p>
      <div class="form-grid">
        <div class="field">
          <label for="matrixRequiredMode">Quy tắc bắt buộc</label>
          <select class="select" id="matrixRequiredMode" name="matrixRequiredMode">
            <option value="each_column_min_one" ${mode === "each_column_min_one" ? "selected" : ""}>Mỗi cột phải chọn ít nhất N dòng</option>
            <option value="any_cell" ${mode === "any_cell" ? "selected" : ""}>Chỉ cần chọn ít nhất 1 ô trong toàn ma trận</option>
          </select>
        </div>
        <div class="field">
          <label for="minColumnSelections">Số dòng tối thiểu mỗi cột</label>
          <input class="input" id="minColumnSelections" name="minColumnSelections" type="number" min="1" value="${escapeHtml(minColumnSelections)}" />
        </div>
      </div>
      <p class="item-meta">Case BCH mẫu: mỗi cột như “Cơm/món chính”, “Đồ uống”, “Đồ ăn vặt” phải có ít nhất 1 tình huống được tick.</p>
    </div>
  `;
}

function questionValueConfigVisible(type) {
  return type === "Số" || type === "Ngày";
}

function renderQuestionValueConfig(type, question = {}) {
  if (type === "Số") {
    return `
      <div class="form-grid three">
        <div class="field">
          <label for="questionMinValue">Giá trị nhỏ nhất</label>
          <input class="input" id="questionMinValue" name="minValue" type="number" value="${escapeHtml(question.minValue || "")}" placeholder="VD: 0" />
        </div>
        <div class="field">
          <label for="questionMaxValue">Giá trị lớn nhất</label>
          <input class="input" id="questionMaxValue" name="maxValue" type="number" value="${escapeHtml(question.maxValue || "")}" placeholder="VD: 100" />
        </div>
        <div class="field">
          <label for="questionDefaultValue">Giá trị mặc định</label>
          <input class="input" id="questionDefaultValue" name="defaultValue" type="number" value="${escapeHtml(question.defaultValue || "")}" placeholder="Nhập số" />
        </div>
      </div>
    `;
  }

  if (type === "Ngày") {
    return `
      <div class="form-grid three">
        <div class="field">
          <label for="questionMinDate">Từ ngày</label>
          <input class="input" id="questionMinDate" name="minDate" type="date" value="${escapeHtml(question.minDate || "")}" />
        </div>
        <div class="field">
          <label for="questionMaxDate">Đến ngày</label>
          <input class="input" id="questionMaxDate" name="maxDate" type="date" value="${escapeHtml(question.maxDate || "")}" />
        </div>
        <div class="field">
          <label for="questionDefaultDate">Ngày mặc định</label>
          <input class="input" id="questionDefaultDate" name="defaultDate" type="date" value="${escapeHtml(question.defaultDate || "")}" />
        </div>
      </div>
    `;
  }

  return "";
}

function updateAnswerOptionsVisibility() {
  const form = document.querySelector("#questionForm");
  if (!form) return;
  const panel = form.querySelector("#answerOptionsPanel");
  const topNPanel = form.querySelector("#topNConfigPanel");
  const matrixPanel = form.querySelector("#matrixConfigPanel");
  const valuePanel = form.querySelector("#questionValueConfigPanel");
  const valueBody = form.querySelector("#questionValueConfigBody");
  const valueTitle = form.querySelector("#questionValueConfigTitle");
  const type = form.elements.type.value;
  panel.hidden = !questionSupportsOptions(type);
  if (questionSupportsOptions(type) && !panel.querySelector("[name='optionValue']")) {
    panel.querySelector(".answer-option-list").innerHTML = renderAnswerOptionRows(defaultOptionsForType(type));
  }
  if (topNPanel) topNPanel.hidden = !isTopNQuestion(type);
  matrixPanel.hidden = !isMatrixQuestionType(type);
  if (isMatrixQuestionType(type) && !matrixPanel.querySelector("[name='matrixRowValue']")) {
    matrixPanel.querySelector(".matrix-row-config-list").innerHTML = renderMatrixConfigRows(isMatrixRatingType(type) ? defaultMatrixRatingRows() : defaultMatrixRows(), "matrixRowValue", "Tiêu chí", "R");
    matrixPanel.querySelector(".matrix-column-config-list").innerHTML = renderMatrixConfigRows(defaultMatrixColumns(type), "matrixColumnValue", isMatrixRatingType(type) ? "Điểm" : "Lựa chọn", "C");
  }
  const matrixRequiredBody = form.querySelector("#matrixRequiredConfigBody");
  if (matrixRequiredBody) {
    if (!isMatrixQuestionType(type) || isMatrixRatingType(type)) matrixRequiredBody.innerHTML = "";
    else if (!matrixRequiredBody.querySelector("[name='matrixRequiredMode']")) matrixRequiredBody.innerHTML = renderMatrixRequiredConfig();
  }
  valuePanel.hidden = !questionValueConfigVisible(type);
  valueTitle.textContent = type === "Ngày" ? "Khoảng ngày hợp lệ" : "Khoảng số hợp lệ";
  valueBody.innerHTML = renderQuestionValueConfig(type);
}

function renderReadonlyOptionRows(options = []) {
  const normalizedOptions = normalizeOptions(options);
  return normalizedOptions.length
    ? normalizedOptions
        .map(
          (option, index) => `
          <div class="answer-option-row ${isOtherOption(option) ? "is-system-option" : ""}">
            <input class="input option-code-input" value="${escapeHtml(option.code || defaultOptionCode(index))}" readonly disabled />
            <input class="input" value="${escapeHtml(isOtherOption(option) ? OTHER_OPTION_LABEL : option.text || "")}" readonly disabled placeholder="Đáp án ${index + 1}" />
            <span class="option-active-toggle">${option.active === false ? "Không hoạt động" : "Hoạt động"}</span>
            <span></span>
          </div>
        `,
        )
        .join("")
    : `<p class="item-meta">Không có danh sách đáp án.</p>`;
}

function renderReadonlyMatrixRows(values = [], label = "Giá trị", codePrefix = "R") {
  const items = normalizeMatrixItems(values, codePrefix);
  return items.length
    ? items
        .map(
          (item, index) => `
          <div class="answer-option-row matrix-config-option-row">
            <input class="input option-code-input" value="${escapeHtml(item.code || defaultMatrixItemCode(codePrefix, index))}" readonly disabled />
            <input class="input" value="${escapeHtml(item.text)}" readonly disabled placeholder="${escapeHtml(label)} ${index + 1}" />
            <span></span>
          </div>
        `,
        )
        .join("")
    : `<p class="item-meta">Không có cấu hình.</p>`;
}

function openQuestionViewModal(questionId) {
  const question = questions.find((item) => item.id === questionId);
  if (!question) return;
  const type = normalizedQuestionType(question.type);
  openModal(`
    <div class="modal large-modal" role="dialog" aria-modal="true" aria-labelledby="questionViewTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="questionViewTitle">Chi tiết câu hỏi</h2>
        <button class="modal-close" type="button" data-action="close-modal" aria-label="Đóng">×</button>
      </div>
      <div class="modal-body readonly-form">
        <div class="form-grid three">
          <div class="field">
            <label>Mã câu hỏi</label>
            <input class="input" value="${escapeHtml(question.code || "—")}" readonly disabled />
          </div>
          <div class="field">
            <label>Thứ tự</label>
            <input class="input" value="${escapeHtml(question.order || "—")}" readonly disabled />
          </div>
          <div class="field">
            <label>Loại câu hỏi</label>
            <input class="input" value="${escapeHtml(type || "—")}" readonly disabled />
          </div>
          <div class="field full">
            <label>Nội dung câu hỏi</label>
            <textarea class="textarea" readonly disabled>${escapeHtml(question.text || "")}</textarea>
          </div>
          <div class="field full">
            <label>Kịch bản Agent (gợi ý đọc)</label>
            <textarea class="textarea" readonly disabled>${escapeHtml(question.agentScript || "")}</textarea>
          </div>
        </div>
        ${
          questionSupportsOptions(type)
            ? `
            <section class="answer-options-panel">
              <div class="block-heading compact">
                <div>
                  <p class="block-eyebrow">Đáp án</p>
                  <h3 class="block-title">Danh sách lựa chọn</h3>
                </div>
              </div>
              <div class="answer-option-list">${renderReadonlyOptionRows(question.options || [])}</div>
            </section>
          `
            : ""
        }
        ${
          isMatrixQuestionType(type)
            ? `
            <section class="answer-options-panel">
              <div class="block-heading compact">
                <div>
                  <p class="block-eyebrow">Ma trận</p>
                  <h3 class="block-title">Cấu hình dòng/cột</h3>
                </div>
              </div>
              <div class="matrix-config-grid">
                <div>
                  <div class="matrix-config-head"><h4>Dòng/Tiêu chí</h4></div>
                  ${renderReadonlyMatrixRows(matrixRowsConfigForQuestion(question), "Dòng", "R")}
                </div>
                <div>
                  <div class="matrix-config-head"><h4>Cột/Thang điểm</h4></div>
                  ${renderReadonlyMatrixRows(matrixColumnsConfigForQuestion(question), "Cột", "C")}
                </div>
              </div>
            </section>
          `
            : ""
        }
        ${
          questionValueConfigVisible(type)
            ? `
            <section class="answer-options-panel">
              <div class="block-heading compact">
                <div>
                  <p class="block-eyebrow">Cấu hình nhập liệu</p>
                  <h3 class="block-title">${type === "Số" ? "Giá trị số" : "Ngày"}</h3>
                </div>
              </div>
              <div class="form-grid three">
                <div class="field"><label>${type === "Số" ? "Giá trị nhỏ nhất" : "Từ ngày"}</label><input class="input" value="${escapeHtml(type === "Số" ? question.minValue || "" : question.minDate || "")}" readonly disabled /></div>
                <div class="field"><label>${type === "Số" ? "Giá trị lớn nhất" : "Đến ngày"}</label><input class="input" value="${escapeHtml(type === "Số" ? question.maxValue || "" : question.maxDate || "")}" readonly disabled /></div>
                <div class="field"><label>${type === "Số" ? "Giá trị mặc định" : "Ngày mặc định"}</label><input class="input" value="${escapeHtml(type === "Số" ? question.defaultValue || "" : question.defaultDate || "")}" readonly disabled /></div>
              </div>
            </section>
          `
            : ""
        }
        ${
          isTopNQuestion(type)
            ? `
            <section class="answer-options-panel">
              <div class="block-heading compact">
                <div>
                  <p class="block-eyebrow">Top N</p>
                  <h3 class="block-title">Cấu hình giới hạn lựa chọn</h3>
                </div>
              </div>
              <div class="form-grid">
                <div class="field"><label>Số lựa chọn N</label><input class="input" value="${escapeHtml(topNLimit(question))}" readonly disabled /></div>
                <div class="field"><label>Quy tắc chọn</label><input class="input" value="${escapeHtml(topNModeLabel(topNMode(question)))}" readonly disabled /></div>
              </div>
            </section>
          `
            : ""
        }
        <section class="answer-options-panel">
          <div class="form-grid four">
            <div class="field"><label>Bắt buộc trả lời</label><input class="input" value="${question.required ? "Có" : "Không"}" readonly disabled /></div>
            <div class="field"><label>Trạng thái</label><input class="input" value="${question.active === false ? "Không hoạt động" : "Hoạt động"}" readonly disabled /></div>
            <div class="field"><label>Người tạo</label><input class="input" value="${escapeHtml(displayUserName(question.createdBy || question.updatedBy))}" readonly disabled /></div>
            <div class="field"><label>Ngày tạo</label><input class="input" value="${escapeHtml(displayDateTime(question.createdAt || question.updatedAt))}" readonly disabled /></div>
            <div class="field"><label>Người cập nhật</label><input class="input" value="${escapeHtml(displayUserName(question.updatedBy))}" readonly disabled /></div>
            <div class="field"><label>Ngày cập nhật</label><input class="input" value="${escapeHtml(displayDateTime(question.updatedAt))}" readonly disabled /></div>
          </div>
        </section>
        <div class="form-footer">
          <button class="btn secondary" type="button" data-action="close-modal">Đóng</button>
        </div>
      </div>
    </div>
  `);
}

function openQuestionModal(questionId = null) {
  const surveyQs = selectedQuestions();
  const editingQuestion = questionId ? questions.find((question) => question.id === questionId) : null;
  const isEditing = Boolean(editingQuestion);
  const nextOrder = surveyQs.length + 1;
  const nextCode = `Q${String(nextOrder).padStart(2, "0")}`;
  const selectedType = normalizedQuestionType(editingQuestion?.type || "Chọn một đáp án");
  const optionValues = editingQuestion?.options?.length ? editingQuestion.options : defaultOptionsForType(selectedType);
  const matrixRowValues = matrixRowsConfigForQuestion(editingQuestion || {});
  const matrixColumnValues = matrixColumnsConfigForQuestion(editingQuestion || {});
  openModal(`
    <div class="modal wide-modal" role="dialog" aria-modal="true" aria-labelledby="questionModalTitle">
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
              <option ${RANKING_TYPE === selectedType ? "selected" : ""}>${RANKING_TYPE}</option>
              <option ${TOP_N_TYPE === selectedType ? "selected" : ""}>${TOP_N_TYPE}</option>
              ${["Chọn một đáp án", "Chọn nhiều đáp án", MATRIX_MULTI_TYPE, MATRIX_RATING_TYPE, "Văn bản", "Số", "Đánh giá", "Ngày"]
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
        ${renderTopNConfig(editingQuestion || { type: selectedType })}
        <section class="answer-options-panel" id="matrixConfigPanel" ${isMatrixQuestionType(selectedType) ? "" : "hidden"}>
          <div class="block-heading compact">
            <div>
              <p class="block-eyebrow">Ma trận</p>
              <h3 class="block-title">${isMatrixRatingType(selectedType) ? "Tiêu chí và thang điểm" : "Dòng tiêu chí và cột lựa chọn"}</h3>
            </div>
          </div>
          <div class="matrix-config-grid">
            <div>
              <div class="matrix-config-head">
                <h4>Dòng ma trận</h4>
                <button class="btn secondary compact-action" type="button" data-action="add-matrix-row">${icon("plus")} Thêm dòng</button>
              </div>
              <div class="matrix-row-config-list">
                ${renderMatrixConfigRows(matrixRowValues, "matrixRowValue", "Tiêu chí", "R")}
              </div>
            </div>
            <div>
              <div class="matrix-config-head">
                <h4>${isMatrixRatingType(selectedType) ? "Thang điểm" : "Cột lựa chọn"}</h4>
                <button class="btn secondary compact-action" type="button" data-action="add-matrix-column">${icon("plus")} Thêm cột</button>
              </div>
              <div class="matrix-column-config-list">
                ${renderMatrixConfigRows(matrixColumnValues, "matrixColumnValue", isMatrixRatingType(selectedType) ? "Điểm" : "Lựa chọn", "C")}
              </div>
            </div>
          </div>
          <div id="matrixRequiredConfigBody">
            ${isMatrixQuestionType(selectedType) && !isMatrixRatingType(selectedType) ? renderMatrixRequiredConfig(editingQuestion || {}) : ""}
          </div>
        </section>
        <section class="answer-options-panel" id="questionValueConfigPanel" ${questionValueConfigVisible(selectedType) ? "" : "hidden"}>
          <div class="block-heading compact">
            <div>
              <p class="block-eyebrow">Cấu hình giá trị</p>
              <h3 class="block-title" id="questionValueConfigTitle">${selectedType === "Ngày" ? "Khoảng ngày hợp lệ" : "Khoảng số hợp lệ"}</h3>
            </div>
          </div>
          <div id="questionValueConfigBody">
            ${renderQuestionValueConfig(selectedType, editingQuestion || {})}
          </div>
        </section>
        <div class="check-row">
          <label><input type="checkbox" name="required" ${isEditing ? (editingQuestion?.required ? "checked" : "") : "checked"} /> Bắt buộc trả lời</label>
          ${isEditing ? `<label><input type="checkbox" name="active" ${editingQuestion?.active === false ? "" : "checked"} /> Hoạt động</label>` : ""}
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
    const type = normalizedQuestionType(data.type);
    const optionFields = [...form.querySelectorAll(".answer-option-list .answer-option-row")]
      .map((row, index) => ({
        code: (row.querySelector("[name='optionCode']")?.value || defaultOptionCode(index)).trim(),
        text: (row.querySelector("[name='optionValue']")?.value || "").trim(),
        active: row.querySelector("[name='optionActive']")?.checked !== false,
      }))
      .filter((option) => option.text);
    const duplicatedOptionCode = optionFields.find((option, index) => optionFields.findIndex((item) => normalizedText(item.code) === normalizedText(option.code)) !== index);
    if (duplicatedOptionCode) {
      showToast(`Mã đáp án "${duplicatedOptionCode.code}" đang bị trùng. Vui lòng kiểm tra lại.`);
      form.querySelector("[name='optionCode']")?.focus();
      return;
    }
    const matrixRows = readMatrixConfigRowsFromList(form.querySelector(".matrix-row-config-list"), "R");
    const matrixColumns = readMatrixConfigRowsFromList(form.querySelector(".matrix-column-config-list"), "C");
    const duplicatedRowCode = isMatrixQuestionType(type) ? duplicatedMatrixCode(matrixRows, "R") : "";
    if (duplicatedRowCode) {
      showToast(`Mã dòng ma trận "${duplicatedRowCode}" đang bị trùng.`);
      return;
    }
    const duplicatedColumnCode = isMatrixQuestionType(type) ? duplicatedMatrixCode(matrixColumns, "C") : "";
    if (duplicatedColumnCode) {
      showToast(`Mã cột ma trận "${duplicatedColumnCode}" đang bị trùng.`);
      return;
    }
    const options = questionSupportsOptions(type) ? optionFields : [];
    const payload = {
      surveyId: selectedSurvey().id,
      code: data.code.trim() || nextCode,
      order: Number(data.order) || nextOrder,
      type,
      text: data.text.trim(),
      required: form.elements.required.checked,
      options: questionSupportsOptions(type) ? options : [],
      matrixRows: isMatrixQuestionType(type) ? (matrixRows.length ? matrixRows : normalizeMatrixItems(isMatrixRatingType(type) ? defaultMatrixRatingRows() : defaultMatrixRows(), "R")) : [],
      matrixColumns: isMatrixQuestionType(type) ? (matrixColumns.length ? matrixColumns : normalizeMatrixItems(defaultMatrixColumns(type), "C")) : [],
      matrixRequiredMode: isMatrixQuestionType(type) && !isMatrixRatingType(type) ? data.matrixRequiredMode || "each_column_min_one" : "",
      minColumnSelections: isMatrixQuestionType(type) && !isMatrixRatingType(type) ? Math.max(Number(data.minColumnSelections) || 1, 1) : "",
      topN: isTopNQuestion(type) ? Math.max(Number(data.topN) || 3, 1) : "",
      topNMode: isTopNQuestion(type) ? data.topNMode || "exact" : "",
      agentScript: data.agentScript.trim(),
      guideText: editingQuestion?.guideText || "",
      placeholder: editingQuestion?.placeholder || "",
      minValue: type === "Số" ? (data.minValue || "").trim() : "",
      maxValue: type === "Số" ? (data.maxValue || "").trim() : "",
      defaultValue: type === "Số" ? (data.defaultValue || "").trim() : "",
      minDate: type === "Ngày" ? data.minDate || "" : "",
      maxDate: type === "Ngày" ? data.maxDate || "" : "",
      defaultDate: type === "Ngày" ? data.defaultDate || "" : "",
      active: isEditing ? form.elements.active.checked : true,
    };
    if (isEditing) Object.assign(editingQuestion, payload, { updatedBy: currentUser.username, updatedAt: new Date().toISOString() });
    else questions.push({ id: `q-${Date.now()}`, ...payload, createdBy: currentUser.username, createdAt: new Date().toISOString() });
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
  document.querySelector("#answerOptionsPanel .block-heading")?.insertAdjacentHTML(
    "beforeend",
    `<button class="btn secondary" type="button" data-action="add-other-option">${icon("plus")} Thêm Khác</button>`,
  );
  updateAnswerOptionsVisibility();
}

function comparisonValueOptions(question, selectedValue = "", operator = "") {
  if (normalizedQuestionType(question?.type) === RANKING_TYPE) return rankingRuleValueOptions(question, selectedValue, operator);
  const values = isMatrixQuestionType(question?.type)
    ? matrixColumnsForQuestion(question)
    : allQuestionOptions(question).length
      ? activeOptionTexts(question)
      : defaultOptionsForType(question?.type);
  if (!values.length) return `<option value="">-- Câu hỏi này chưa có danh sách giá trị --</option>`;
  return `
    <option value="">-- Chọn giá trị --</option>
    ${values.map((value) => `<option value="${escapeHtml(value)}" ${value === selectedValue ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}
  `;
}

function comparisonValueControl(question, selectedValue = "", fieldName = "value", fieldId = "ruleValue", required = true, operator = "") {
  const requiredAttr = required ? "required" : "";
  if (question?.type === "Số") {
    return `<input class="input" id="${fieldId}" name="${fieldName}" type="number" value="${escapeHtml(selectedValue)}" placeholder="${required ? "Nhập giá trị số" : "Có thể bỏ trống để kết thúc luôn"}" ${requiredAttr} />`;
  }
  if (question?.type === "Ngày") {
    return `<input class="input" id="${fieldId}" name="${fieldName}" type="date" value="${escapeHtml(selectedValue)}" ${requiredAttr} />`;
  }
  if (!questionSupportsOptions(question?.type) && !isMatrixQuestionType(question?.type)) {
    return `<input class="input" id="${fieldId}" name="${fieldName}" value="${escapeHtml(selectedValue)}" placeholder="${required ? "Nhập giá trị so sánh" : "Có thể bỏ trống để kết thúc luôn"}" ${requiredAttr} />`;
  }
  return `
    <select class="select" id="${fieldId}" name="${fieldName}" ${requiredAttr}>
      ${required ? "" : `<option value="" ${selectedValue ? "" : "selected"}>-- Không cần giá trị --</option>`}
      ${comparisonValueOptions(question, selectedValue, operator)}
    </select>
  `;
}

function matrixRuleRowControl(question, selectedRow = "", fieldName = "matrixRow", fieldId = "ruleMatrixRow") {
  const rows = isMatrixQuestionType(question?.type) ? matrixRowsForQuestion(question) : [];
  return `
    <label for="${fieldId}">Dòng ma trận</label>
    <select class="select" id="${fieldId}" name="${fieldName}" ${rows.length ? "required" : ""}>
      ${
        rows.length
          ? rows.map((row) => `<option value="${escapeHtml(row)}" ${row === selectedRow ? "selected" : ""}>${escapeHtml(row)}</option>`).join("")
          : `<option value="">-- Câu hỏi này chưa có dòng ma trận --</option>`
      }
    </select>
  `;
}

function matrixRatingScopeControl(selectedScope = "row", fieldName = "matrixScope", fieldId = "ruleMatrixScope") {
  const scopes = [
    { value: "row", label: "Một tiêu chí cụ thể" },
    { value: "any", label: "Bất kỳ tiêu chí nào" },
    { value: "all", label: "Tất cả tiêu chí" },
  ];
  return `
    <label for="${fieldId}">Phạm vi kiểm tra</label>
    <select class="select" id="${fieldId}" name="${fieldName}">
      ${scopes.map((scope) => `<option value="${scope.value}" ${scope.value === selectedScope ? "selected" : ""}>${scope.label}</option>`).join("")}
    </select>
  `;
}

function matrixScopeLabel(scope = "row") {
  if (scope === "any") return "Bất kỳ tiêu chí nào";
  if (scope === "all") return "Tất cả tiêu chí";
  return "Một tiêu chí cụ thể";
}

function renderRuleGroupRows(groups = [], sourceQuestion = null) {
  const normalizedGroups = groups.length ? groups : ruleGroups({});
  const operatorOptions = operatorOptionsForQuestion(sourceQuestion);
  const actionOptions = ["Hiển thị câu hỏi", "Bỏ qua câu hỏi", "Bắt buộc trả lời", "Kết thúc khảo sát"];
  const optionList = (selectedCode = "") => {
    const surveyQs = selectedQuestions();
    return surveyQs.length
      ? `<option value="">-- Chọn câu hỏi --</option>${surveyQs.map((question) => `<option value="${question.code}" ${question.code === selectedCode ? "selected" : ""}>${question.code} - ${escapeHtml(question.text)}</option>`).join("")}`
      : `<option value="">-- Chọn câu hỏi --</option>`;
  };

  return normalizedGroups
    .map((group, index) => {
      const groupId = `ruleGroup${index + 1}`;
      const selectedAction = group.action === "Ẩn câu hỏi" ? "Bỏ qua câu hỏi" : group.action || "Hiển thị câu hỏi";
      const isEndAction = selectedAction === "Kết thúc khảo sát";
      const selectedTarget = isEndAction ? "" : group.target;
      const selectedOperator = operatorOptions.includes(group.operator) ? group.operator : defaultOperatorForQuestion(sourceQuestion);
      const selectedScope = isMatrixRatingType(sourceQuestion?.type) ? group.matrixScope || "row" : "row";
      return `
        <article class="rule-group-card" data-rule-group data-group-id="${escapeHtml(group.id || `group-${index + 1}`)}">
          <div class="rule-group-header">
            <div>
              <span class="code-pill">Nhóm ${index + 1}</span>
              <span class="type-pill">${index === 0 ? "Điều kiện đầu tiên" : "HOẶC"}</span>
            </div>
            <button class="icon-action danger" type="button" data-action="remove-rule-group" aria-label="Xóa nhóm điều kiện">${icon("trash")}</button>
          </div>
          <div class="form-grid">
            <div class="field">
              <label for="${groupId}Operator">Toán tử so sánh</label>
              <select class="select" id="${groupId}Operator" name="operator">
                ${operatorOptions.map((operator) => `<option ${operator === selectedOperator ? "selected" : ""}>${operator}</option>`).join("")}
              </select>
            </div>
            ${
              isMatrixRatingType(sourceQuestion?.type)
                ? `<div class="field rule-matrix-scope-field">${matrixRatingScopeControl(selectedScope, "matrixScope", `${groupId}MatrixScope`)}</div>`
                : ""
            }
            ${
              isMatrixQuestionType(sourceQuestion?.type) && (!isMatrixRatingType(sourceQuestion?.type) || selectedScope === "row")
                ? `<div class="field rule-matrix-row-field">${matrixRuleRowControl(sourceQuestion, group.matrixRow || "", "matrixRow", `${groupId}MatrixRow`)}</div>`
                : ""
            }
            <div class="field rule-value-field">
              <label for="${groupId}Value">Giá trị so sánh</label>
              ${comparisonValueControl(sourceQuestion, group.value || "", "value", `${groupId}Value`, !isEndAction, selectedOperator)}
              ${isEndAction ? `<p class="field-hint">Bỏ trống nếu muốn kết thúc khảo sát ngay khi tới câu hỏi nguồn.</p>` : ""}
            </div>
            <div class="field">
              <label for="${groupId}Action">Loại hành động</label>
              <select class="select" id="${groupId}Action" name="action">
                ${actionOptions.map((action) => `<option ${action === selectedAction ? "selected" : ""}>${action}</option>`).join("")}
              </select>
            </div>
            <div class="field rule-target-field" ${isEndAction ? "hidden" : ""}>
              <label for="${groupId}Target">Câu hỏi đích</label>
              <select class="select" id="${groupId}Target" name="target">
                ${optionList(selectedTarget)}
              </select>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function updateRuleGroupFields() {
  const form = document.querySelector("#ruleForm");
  if (!form) return;
  const sourceCode = form.elements.source.value;
  const sourceQuestion = selectedQuestions().find((question) => question.code === sourceCode);
  const validOperators = operatorOptionsForQuestion(sourceQuestion);
  const rows = [...form.querySelectorAll("[data-rule-group]")];
  const groups = rows.map((row) => {
    const selectedAction = row.querySelector('[name="action"]')?.value || "Hiển thị câu hỏi";
    const selectedTarget = row.querySelector('[name="target"]')?.value || "";
    const isEndAction = selectedAction === "Kết thúc khảo sát";
    const selectedOperator = row.querySelector('[name="operator"]')?.value || defaultOperatorForQuestion(sourceQuestion);
    return {
      operator: validOperators.includes(selectedOperator) ? selectedOperator : defaultOperatorForQuestion(sourceQuestion),
      matrixScope: isMatrixRatingType(sourceQuestion?.type) ? row.querySelector('[name="matrixScope"]')?.value || "row" : "row",
      matrixRow: row.querySelector('[name="matrixRow"]')?.value || "",
      value: row.querySelector('[name="value"]')?.value || "",
      action: selectedAction,
      target: isEndAction ? "" : selectedTarget,
    };
  });
  form.querySelector("#ruleGroupList").innerHTML = renderRuleGroupRows(groups, sourceQuestion);
}

function renderReadOnlyRuleGroupRows(rule, sourceQuestion) {
  return ruleGroups(rule)
    .map(
      (group, index) => `
        <article class="rule-group-card">
          <div class="rule-group-header">
            <div>
              <span class="code-pill">Nhóm ${index + 1}</span>
              <span class="type-pill">${index === 0 ? "Điều kiện đầu tiên" : "HOẶC"}</span>
            </div>
          </div>
          <div class="form-grid">
            <div class="field">
              <label>Toán tử so sánh</label>
              <input class="input" value="${escapeHtml(group.operator || "—")}" readonly />
            </div>
            ${
              isMatrixRatingType(sourceQuestion?.type)
                ? `<div class="field"><label>Phạm vi kiểm tra</label><input class="input" value="${escapeHtml(matrixScopeLabel(group.matrixScope))}" readonly /></div>`
                : ""
            }
            ${
              isMatrixQuestionType(sourceQuestion?.type) && (!isMatrixRatingType(sourceQuestion?.type) || group.matrixScope === "row")
                ? `<div class="field"><label>Dòng ma trận</label><input class="input" value="${escapeHtml(group.matrixRow || "—")}" readonly /></div>`
                : ""
            }
            <div class="field">
              <label>Giá trị so sánh</label>
              <input class="input" value="${escapeHtml(group.value || "—")}" readonly />
            </div>
            <div class="field">
              <label>Loại hành động</label>
              <input class="input" value="${escapeHtml(group.action || "—")}" readonly />
            </div>
            ${
              group.action === "Kết thúc khảo sát"
                ? ""
                : `<div class="field">
                    <label>Câu hỏi đích</label>
                    <input class="input" value="${escapeHtml(group.target || "—")}" readonly />
                  </div>`
            }
          </div>
        </article>
      `,
    )
    .join("");
}

function openRuleViewModal(ruleId) {
  const rule = rules.find((item) => item.id === ruleId);
  if (!rule) return;
  const sourceQuestion = selectedQuestions().find((question) => question.code === rule.source);
  openModal(`
    <div class="modal wide" role="dialog" aria-modal="true" aria-labelledby="ruleViewTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="ruleViewTitle">Chi tiết điều kiện rẽ nhánh</h2>
        <button class="modal-close" type="button" data-action="close-modal" aria-label="Đóng">×</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="field">
            <label>Mã điều kiện</label>
            <input class="input" value="${escapeHtml(rule.code || "—")}" readonly />
          </div>
          <div class="field">
            <label>Tên điều kiện</label>
            <input class="input" value="${escapeHtml(rule.name || "—")}" readonly />
          </div>
          <div class="field full">
            <label>Mô tả</label>
            <input class="input" value="${escapeHtml(rule.description || "—")}" readonly />
          </div>
        </div>
        <section class="condition-box">
          <h3 class="section-label">NẾU (ĐIỀU KIỆN)</h3>
          <div class="field full">
            <label>Câu hỏi nguồn</label>
            <input class="input" value="${escapeHtml(rule.source || "—")} - ${escapeHtml(sourceQuestion?.text || "")}" readonly />
          </div>
          <div class="rule-group-toolbar">
            <div>
              <h3 class="section-label blue">NHÓM SO SÁNH + HÀNH ĐỘNG</h3>
              <p class="item-meta">Chế độ xem chi tiết, không cho chỉnh sửa.</p>
            </div>
          </div>
          <div class="rule-group-list">
            ${renderReadOnlyRuleGroupRows(rule, sourceQuestion)}
          </div>
        </section>
        <div class="field" style="margin-top: 16px; max-width: 125px">
          <label>Độ ưu tiên</label>
          <input class="input" value="${escapeHtml(rule.priority || "—")}" readonly />
        </div>
        <div class="form-footer">
          <button class="btn secondary" type="button" data-action="close-modal">Đóng</button>
        </div>
      </div>
    </div>
  `);
}

function openRuleModal(ruleId = null, sourceQuestionId = null) {
  const surveyQs = selectedQuestions();
  const editingRule = ruleId ? rules.find((rule) => rule.id === ruleId) : null;
  const preselectedQuestion = sourceQuestionId ? surveyQs.find((question) => question.id === sourceQuestionId) : null;
  const isEditing = Boolean(editingRule);
  const nextOrder = selectedRules().length + 1;
  const selectedSourceCode = editingRule?.source || preselectedQuestion?.code || surveyQs[0]?.code || "";
  const selectedSourceQuestion = surveyQs.find((question) => question.code === selectedSourceCode);
  const editingGroups = editingRule ? ruleGroups(editingRule) : ruleGroups({});
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
          </div>
          <div class="rule-group-toolbar">
            <div>
              <h3 class="section-label blue">NHÓM SO SÁNH + HÀNH ĐỘNG</h3>
              <p class="item-meta">Các nhóm trong cùng điều kiện được nối bằng HOẶC. Nhóm nào khớp trước sẽ chạy hành động của nhóm đó.</p>
            </div>
            <button class="btn secondary" type="button" data-action="add-rule-group">${icon("plus")} Thêm nhóm</button>
          </div>
          <div class="rule-group-list" id="ruleGroupList">
            ${renderRuleGroupRows(editingGroups, selectedSourceQuestion)}
          </div>
        </section>

        <div class="field" style="margin-top: 16px; max-width: 125px">
          <label for="rulePriority">Độ ưu tiên</label>
          <input class="input" id="rulePriority" name="priority" type="number" min="1" value="${editingRule?.priority || nextOrder}" />
        </div>
        ${isEditing ? `<div class="check-row">
          <label><input type="checkbox" name="active" ${editingRule?.active === false ? "" : "checked"} /> Kích hoạt điều kiện</label>
        </div>` : ""}
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
    const sourceQuestion = selectedQuestions().find((question) => question.code === data.source);
    const validOperators = operatorOptionsForQuestion(sourceQuestion);
    const groups = [...form.querySelectorAll("[data-rule-group]")]
      .map((row, index) => {
        const selectedAction = row.querySelector('[name="action"]')?.value || "Hiển thị câu hỏi";
        const selectedTarget = row.querySelector('[name="target"]')?.value || "";
        const isEndAction = selectedAction === "Kết thúc khảo sát";
        const selectedOperator = row.querySelector('[name="operator"]')?.value || defaultOperatorForQuestion(sourceQuestion);
        const matrixScope = isMatrixRatingType(sourceQuestion?.type) ? row.querySelector('[name="matrixScope"]')?.value || "row" : "row";
        return {
          id: row.dataset.groupId || `g-${Date.now()}-${index}`,
          operator: validOperators.includes(selectedOperator) ? selectedOperator : defaultOperatorForQuestion(sourceQuestion),
          matrixScope,
          matrixRow: isMatrixQuestionType(sourceQuestion?.type) && (!isMatrixRatingType(sourceQuestion?.type) || matrixScope === "row") ? row.querySelector('[name="matrixRow"]')?.value || "" : "",
          value: (row.querySelector('[name="value"]')?.value || "").trim(),
          action: selectedAction,
          target: isEndAction ? "" : selectedTarget,
        };
      })
      .filter((group) => group.value || group.target || normalizedText(group.action) === normalizedText("Kết thúc khảo sát"));
    if (!groups.length) {
      showToast("Cần cấu hình ít nhất một nhóm điều kiện.");
      return;
    }
    const invalidGroupIndex = groups.findIndex((group) => {
      const isEndAction = normalizedText(group.action) === normalizedText("Kết thúc khảo sát");
      if (isEndAction && !group.value) return false;
      return !group.value || (isMatrixRatingType(sourceQuestion?.type) && group.matrixScope === "row" && !group.matrixRow) || (!isEndAction && !group.target);
    });
    if (invalidGroupIndex >= 0) {
      showToast(`Nhóm ${invalidGroupIndex + 1} cần đủ giá trị so sánh và câu hỏi đích.`);
      return;
    }
    const priority = Number(data.priority) || nextOrder;
    const duplicatedPriorityRule = rules.find((rule) => rule.surveyId === selectedSurvey().id && rule.id !== editingRule?.id && Number(rule.priority) === priority);
    if (duplicatedPriorityRule) {
      showToast(`Độ ưu tiên ${priority} đã được dùng bởi điều kiện "${duplicatedPriorityRule.name || duplicatedPriorityRule.code}".`);
      return;
    }
    const firstGroup = groups[0];
    const payload = {
      surveyId: selectedSurvey().id,
      code: data.code.trim() || `R${String(nextOrder).padStart(2, "0")}`,
      name: data.name.trim(),
      description: data.description.trim(),
      source: data.source,
      groups,
      operator: firstGroup.operator,
      matrixRow: firstGroup.matrixRow,
      matrixScope: firstGroup.matrixScope,
      value: firstGroup.value,
      action: firstGroup.action,
      target: firstGroup.target,
      priority,
      active: isEditing ? form.elements.active.checked : true,
    };
    if (isEditing) Object.assign(editingRule, payload, { updatedBy: currentUser.username, updatedAt: new Date().toISOString() });
    else rules.push({ id: `r-${Date.now()}`, ...payload, createdBy: currentUser.username, createdAt: new Date().toISOString() });
    closeModal();
    showToast(isEditing ? "Đã cập nhật điều kiện rẽ nhánh." : "Đã thêm điều kiện rẽ nhánh.");
    render();
  });

  document.querySelector("#ruleSource").addEventListener("change", () => updateRuleGroupFields());
  document.querySelector("#ruleGroupList")?.addEventListener("change", (event) => {
    if (event.target?.matches('[name="action"], [name="matrixScope"]')) updateRuleGroupFields();
  });
}

function openCustomerSurveyModal(customerId) {
  if (!canCurrentUserStartSession()) {
    showToast("User hiện tại chưa Hoạt động hoặc chưa nằm trong allow list Agent.");
    return;
  }
  const customer = customers.find((item) => item.id === customerId);
  if (!customer) return;
  if (!isCustomerActive(customer)) {
    showToast("Khách hàng đang không hoạt động nên không thể làm khảo sát.");
    return;
  }
  const availableSurveys = activeSurveys();
  const surveyOptions = (items) =>
    items
      .map((survey) => `<option value="${survey.id}">${escapeHtml(survey.name)} · ${escapeHtml(survey.code || "—")}</option>`)
      .join("");

  openModal(`
    <div class="modal confirm-modal" role="dialog" aria-modal="true" aria-labelledby="customerSurveyTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="customerSurveyTitle">Làm khảo sát</h2>
        <button class="modal-close" type="button" data-action="close-modal" aria-label="Đóng">×</button>
      </div>
      <form class="modal-body" id="customerSurveyForm">
        ${
          availableSurveys.length
            ? `
              <div class="field" style="margin-top: 18px">
                <label for="customerSurveySearch">Tìm kiếm khảo sát Hoạt động</label>
                <div class="inline-search">
                  <input class="input" id="customerSurveySearch" name="surveySearch" placeholder="Tìm theo tên, mã khảo sát..." autocomplete="off" />
                  <button class="btn secondary" type="button" data-action="search-customer-survey">${icon("search")} Tìm kiếm</button>
                </div>
              </div>
              <div class="field" style="margin-top: 18px">
                <label for="customerSurveySelect">Chọn khảo sát đang Hoạt động</label>
                <select class="select" id="customerSurveySelect" name="surveyId" required>
                  ${surveyOptions(availableSurveys)}
                </select>
                <p class="item-meta" id="customerSurveySearchResult">${availableSurveys.length} khảo sát đang Hoạt động</p>
              </div>
              <div class="form-footer">
                <button class="btn secondary" type="button" data-action="close-modal">Hủy</button>
                <button class="btn primary" type="submit">${icon("clipboard")} Bắt đầu</button>
              </div>
            `
            : `<div class="empty-state">Chưa có khảo sát nào ở trạng thái Đang hoạt động. Hãy cập nhật trạng thái khảo sát trước khi làm khảo sát.</div>`
        }
      </form>
    </div>
  `);

  const form = document.querySelector("#customerSurveyForm");
  if (!availableSurveys.length || !form) return;
  const searchInput = document.querySelector("#customerSurveySearch");
  const selectInput = document.querySelector("#customerSurveySelect");
  const resultText = document.querySelector("#customerSurveySearchResult");
  const applySurveySearch = () => {
    const keyword = normalizedText(searchInput?.value || "");
    const filtered = availableSurveys.filter((survey) => normalizedText(`${survey.name} ${survey.code}`).includes(keyword));
    selectInput.innerHTML = filtered.length ? surveyOptions(filtered) : `<option value="">Không tìm thấy khảo sát Hoạt động phù hợp</option>`;
    selectInput.disabled = !filtered.length;
    resultText.textContent = filtered.length ? `${filtered.length} khảo sát đang Hoạt động phù hợp` : "Không tìm thấy khảo sát Hoạt động phù hợp";
  };
  document.querySelector('[data-action="search-customer-survey"]')?.addEventListener("click", applySurveySearch);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const survey = surveys.find((item) => item.id === data.surveyId);
    if (!survey) return;
    state.selectedCustomerId = customer.id;
    state.selectedSurveyId = survey.id;
    state.detailTab = "entry";
    state.selectedQuestionIndex = 0;
    state.entryHistory = [];
    resetDraftAnswersForSurvey(survey.id);
    const sessionQuestions = questionsForSurvey(survey.id).filter(isQuestionActive);
    const sessionRules = rules.filter((rule) => rule.surveyId === survey.id && isRuleActive(rule)).sort((a, b) => a.priority - b.priority);
    sessions.unshift({
      id: `S${String(sessions.length + 1).padStart(3, "0")}`,
      surveyId: survey.id,
      customer: customer.name,
      customerId: customer.id,
      status: "Đang kiểm tra",
      answeredByUsername: currentUser.username,
      questionIds: sessionQuestions.map((question) => question.id),
      ruleIds: sessionRules.map((rule) => rule.id),
      visitedCodes: [sessionQuestions[0]?.code].filter(Boolean),
      startedAt: new Date().toISOString(),
      completedAt: "",
    });
    closeModal();
    showToast(`Bắt đầu khảo sát cho ${customer.name}.`);
    state.view = "surveyDetail";
    render();
  });
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

function markRequiredErrors(form) {
  const invalidFields = [...form.querySelectorAll("[required]")].filter((field) => !String(field.value || "").trim());
  form.querySelectorAll(".is-invalid").forEach((field) => field.classList.remove("is-invalid"));
  invalidFields.forEach((field) => field.classList.add("is-invalid"));
  if (invalidFields[0]) invalidFields[0].focus();
  return invalidFields;
}

document.addEventListener(
  "submit",
  (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const invalidFields = markRequiredErrors(form);
    if (invalidFields.length) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showToast("Vui lòng nhập đầy đủ các field bắt buộc (*).");
    }
  },
  true,
);

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    state.search = "";
    if (state.view === "entry") {
      state.selectedQuestionIndex = 0;
      state.entryHistory = [];
    }
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
    if (!isSurveyConfigEditable(surveyForQuestion(question))) {
      showToast("Chỉ khảo sát Khởi tạo mới được xóa câu hỏi.");
      return;
    }
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
    if (!isSurveyConfigEditable(surveyForRule(rule))) {
      showToast("Chỉ khảo sát Khởi tạo mới được xóa điều kiện.");
      return;
    }
    openConfirmModal({
      title: "Xóa điều kiện?",
      message: `Điều kiện "${rule?.code || "đã chọn"}" sẽ bị xóa khỏi khảo sát hiện tại và không còn được áp dụng khi làm khảo sát.`,
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

  if (action === "toggle-rule") {
    const rule = rules.find((item) => item.id === actionTarget.dataset.id);
    if (!rule) return;
    if (!isSurveyConfigEditable(surveyForRule(rule))) {
      showToast("Chỉ khảo sát Khởi tạo mới được bật/tắt điều kiện.");
      return;
    }
    const willActivate = !rule.active;
    openConfirmModal({
      title: willActivate ? "Bật điều kiện?" : "Tắt điều kiện?",
      message: willActivate
        ? `Điều kiện "${rule.code}" sẽ được áp dụng lại khi làm khảo sát.`
        : `Điều kiện "${rule.code}" sẽ chuyển sang không hoạt động và không còn được áp dụng khi làm khảo sát.`,
      confirmText: willActivate ? "Bật điều kiện" : "Tắt điều kiện",
      onConfirm: () => {
        rule.active = willActivate;
        rule.updatedBy = currentUser.username;
        rule.updatedAt = new Date().toISOString();
        showToast(willActivate ? "Đã bật điều kiện." : "Đã tắt điều kiện. Điều kiện này sẽ không được áp dụng khi làm khảo sát.");
        render();
      },
    });
    return;
  }

  if (action === "create-survey") {
    state.view = "createSurvey";
    render();
  }
  if (action === "create-user") openUserModal();
  if (action === "toggle-user-form-status") {
    const input = document.querySelector("#userStatusValue");
    const label = document.querySelector("#userStatusLabel");
    const nextValue = input?.value !== "true";
    if (input) input.value = String(nextValue);
    actionTarget.classList.toggle("on", nextValue);
    if (label) label.textContent = activeStatusLabel(nextValue);
  }
  if (action === "cancel-create" || action === "back-dashboard") {
    state.view = "dashboard";
    render();
  }
  if (action === "view-surveys") {
    state.view = "surveys";
    render();
  }
  if (action === "view-reports") {
    state.view = "reports";
    render();
  }
  if (action === "export-reports") exportReportsCsv();
  if (action === "export-reports-2") exportReports2Excel();
  if (action === "view-question") openQuestionViewModal(actionTarget.dataset.id);
  if (action === "select-customer") {
    state.selectedCustomerId = actionTarget.dataset.id;
    showToast("Đã chọn khách hàng.");
    renderCustomers();
  }
  if (action === "toggle-customer-active") {
    const customer = customers.find((item) => item.id === actionTarget.dataset.id);
    if (customer) {
      const willActivate = !isCustomerActive(customer);
      openConfirmModal({
        title: willActivate ? "Bật khách hàng?" : "Tắt khách hàng?",
        message: `${willActivate ? "Bật" : "Tắt"} trạng thái hoạt động của khách hàng "${customer.name}".`,
        confirmText: willActivate ? "Bật khách hàng" : "Tắt khách hàng",
        onConfirm: () => {
          customer.status = willActivate ? "Hoạt động" : "Không hoạt động";
          customer.updatedBy = currentUser.username;
          customer.updatedAt = new Date().toISOString();
          showToast(willActivate ? "Đã bật khách hàng." : "Đã tắt khách hàng.");
          renderCustomers();
        },
      });
    }
  }
  if (action === "reset-customer-context") {
    state.selectedCustomerId = null;
    state.entryHistory = [];
    showToast("Đã bỏ chọn khách hàng.");
    render();
  }
  if (action === "start-customer-survey") openCustomerSurveyModal(actionTarget.dataset.id);
  if (action === "set-current-user") {
    const user = users.find((item) => item.id === actionTarget.dataset.id);
    if (user) {
      currentUser.username = user.username;
      currentUser.displayName = user.displayName;
      state.currentRole = user.roleCode;
      showToast(`Đã dùng phiên ${user.displayName}.`);
      render();
    }
  }
  if (action === "toggle-user-active") {
    const user = users.find((item) => item.id === actionTarget.dataset.id);
    if (user) {
      const willActivate = !isUserActive(user);
      openConfirmModal({
        title: willActivate ? "Bật user?" : "Tắt user?",
        message: `${willActivate ? "Bật" : "Tắt"} trạng thái hoạt động của user "${user.displayName}". Thao tác này ảnh hưởng quyền truy cập/làm khảo sát.`,
        confirmText: willActivate ? "Bật user" : "Tắt user",
        onConfirm: () => {
          user.status = willActivate ? "Hoạt động" : "Không hoạt động";
          user.updatedBy = currentUser.username;
          user.updatedAt = new Date().toISOString();
          showToast(willActivate ? "Đã bật user." : "Đã tắt user.");
          render();
        },
      });
    }
  }
  if (action === "edit-user-permissions") openUserPermissionModal(actionTarget.dataset.id);
  if (action === "change-user-password") openUserPasswordModal(actionTarget.dataset.id);
  if (action === "toggle-user-allowlist") {
    const user = users.find((item) => item.id === actionTarget.dataset.id);
    if (user) {
      const willAllow = !user.allowAgentEntry;
      openConfirmModal({
        title: willAllow ? "Thêm vào allow list Agent?" : "Gỡ khỏi allow list Agent?",
        message: willAllow
          ? `User "${user.displayName}" sẽ được phép tạo/làm khảo sát từ Salesforce khi đang hoạt động.`
          : `User "${user.displayName}" sẽ bị gỡ khỏi allow list Agent và không thể tạo/làm khảo sát từ Salesforce.`,
        confirmText: willAllow ? "Thêm allow list" : "Gỡ allow list",
        onConfirm: () => {
          user.allowAgentEntry = willAllow;
          user.updatedBy = currentUser.username;
          user.updatedAt = new Date().toISOString();
          showToast(willAllow ? "Đã thêm user vào allow list Agent." : "Đã gỡ user khỏi allow list Agent.");
          render();
        },
      });
    }
  }
  if (action === "toggle-user-permission-config") {
    const user = users.find((item) => item.id === actionTarget.dataset.id);
    if (user) {
      const willAllow = !user.allowPermissionConfig;
      openConfirmModal({
        title: willAllow ? "Bật quyền cấu hình?" : "Tắt quyền cấu hình?",
        message: `${willAllow ? "Bật" : "Tắt"} quyền cấu hình phân quyền của user "${user.displayName}".`,
        confirmText: willAllow ? "Bật quyền" : "Tắt quyền",
        onConfirm: () => {
          user.allowPermissionConfig = willAllow;
          user.updatedBy = currentUser.username;
          user.updatedAt = new Date().toISOString();
          showToast(willAllow ? "Đã bật quyền cấu hình phân quyền." : "Đã tắt quyền cấu hình phân quyền.");
          render();
        },
      });
    }
  }
  if (action === "open-survey") {
    state.selectedSurveyId = actionTarget.dataset.id;
    state.detailTab = "questions";
    state.view = "surveyDetail";
    render();
  }
  if (action === "view-survey") {
    openSurveyViewModal(actionTarget.dataset.id);
  }
  if (action === "edit-survey") {
    const survey = surveys.find((item) => item.id === actionTarget.dataset.id);
    if (!isSurveyBasicEditable(survey)) return showToast("Chỉ khảo sát Khởi tạo hoặc Ngưng hoạt động mới được sửa.");
    openSurveyEditModal(actionTarget.dataset.id);
  }
  if (action === "copy-survey") {
    const survey = surveys.find((item) => item.id === actionTarget.dataset.id);
    openConfirmModal({
      title: "Sao chép khảo sát?",
      message: `Tạo bản sao khảo sát "${survey?.name || "đã chọn"}" với đầy đủ cấu hình, câu hỏi và điều kiện rẽ nhánh. Bản sao sẽ ở trạng thái Khởi tạo.`,
      confirmText: "Sao chép khảo sát",
      onConfirm: () => duplicateSurvey(actionTarget.dataset.id),
    });
  }
  if (action === "toggle-survey-active") {
    const survey = surveys.find((item) => item.id === actionTarget.dataset.id);
    if (survey) {
      const willActivate = !isSurveyStatusActive(survey.status);
      openConfirmModal({
        title: willActivate ? "Bật khảo sát?" : "Ngưng hoạt động khảo sát?",
        message: `${willActivate ? "Bật" : "Ngưng hoạt động"} khảo sát "${survey.name}".`,
        confirmText: willActivate ? "Bật khảo sát" : "Ngưng hoạt động",
        onConfirm: () => {
          survey.status = willActivate ? "Hoạt động" : "Ngưng hoạt động";
          survey.updatedBy = currentUser.username;
          survey.updatedAt = new Date().toISOString();
          showToast(willActivate ? "Đã bật khảo sát." : "Đã ngưng hoạt động khảo sát.");
          render();
        },
      });
    }
  }
  if (action === "publish-survey") {
    if (!hasPermission("SURVEY_PUBLISH")) {
      showToast("Role hiện tại không có quyền duyệt khảo sát.");
      return;
    }
    const survey = surveys.find((item) => item.id === actionTarget.dataset.id);
    const errors = validateSurveyConfig(actionTarget.dataset.id);
    if (!survey) return showToast("Không tìm thấy khảo sát.");
    if (errors.length) return showToast(`Không thể duyệt: ${errors[0]}`);
    openConfirmModal({
      title: "Duyệt khảo sát?",
      message: `Khảo sát "${survey.name}" sẽ chuyển sang trạng thái Hoạt động và có thể dùng để làm khảo sát.`,
      confirmText: "Duyệt khảo sát",
      onConfirm: () => {
        survey.status = "Hoạt động";
        survey.publishedBy = currentUser.username;
        survey.publishedAt = new Date().toISOString();
        survey.updatedBy = currentUser.username;
        survey.updatedAt = new Date().toISOString();
        showToast("Đã duyệt khảo sát sang trạng thái Hoạt động.");
        render();
      },
    });
  }
  if (action === "archive-survey") {
    const survey = surveys.find((item) => item.id === actionTarget.dataset.id);
    if (survey) {
      const willActivate = isSurveyPausedStatus(survey.status);
      openConfirmModal({
        title: willActivate ? "Cho khảo sát hoạt động trở lại?" : "Ngưng hoạt động khảo sát?",
        message: willActivate
          ? `Khảo sát "${survey.name}" sẽ chuyển lại trạng thái Hoạt động và có thể được chọn khi làm khảo sát.`
          : `Khảo sát "${survey.name}" sẽ không còn được chọn khi làm khảo sát.`,
        confirmText: willActivate ? "Hoạt động trở lại" : "Ngưng hoạt động",
        onConfirm: () => {
          survey.status = willActivate ? "Hoạt động" : "Ngưng hoạt động";
          if (!willActivate) {
            survey.archivedBy = currentUser.username;
            survey.archivedAt = new Date().toISOString();
          }
          survey.updatedBy = currentUser.username;
          survey.updatedAt = new Date().toISOString();
          showToast(willActivate ? "Đã cho khảo sát hoạt động trở lại." : "Đã ngưng hoạt động khảo sát.");
          render();
        },
      });
    }
  }
  if (action === "finish-survey") {
    const survey = surveys.find((item) => item.id === actionTarget.dataset.id);
    if (survey) {
      openConfirmModal({
        title: "Kết thúc khảo sát?",
        message: `Khảo sát "${survey.name}" sẽ chuyển sang trạng thái Kết thúc và không còn được duyệt/hoạt động lại.`,
        confirmText: "Kết thúc khảo sát",
        onConfirm: () => {
          survey.status = "Kết thúc";
          survey.finishedBy = currentUser.username;
          survey.finishedAt = new Date().toISOString();
          survey.updatedBy = currentUser.username;
          survey.updatedAt = new Date().toISOString();
          showToast("Đã kết thúc khảo sát.");
          render();
        },
      });
    }
  }
  if (action === "delete-survey") {
    const survey = surveys.find((item) => item.id === actionTarget.dataset.id);
    if (!isSurveyConfigEditable(survey)) {
      showToast("Chỉ khảo sát Khởi tạo mới được xóa.");
      return;
    }
    openConfirmModal({
      title: "Xóa khảo sát?",
      message: `Khảo sát "${survey?.name || "đã chọn"}" cùng câu hỏi, điều kiện và phiên nhập liệu liên quan sẽ bị xóa khỏi prototype.`,
      confirmText: "Xóa khảo sát",
      onConfirm: () => deleteSurvey(actionTarget.dataset.id),
    });
  }
  if (action === "add-question") {
    if (!isSelectedSurveyConfigEditable()) return showToast("Chỉ khảo sát Khởi tạo mới được thêm câu hỏi.");
    openQuestionModal();
  }
  if (action === "edit-question") {
    const question = questions.find((item) => item.id === actionTarget.dataset.id);
    if (!isSurveyConfigEditable(surveyForQuestion(question))) return showToast("Chỉ khảo sát Khởi tạo mới được sửa câu hỏi.");
    openQuestionModal(actionTarget.dataset.id);
  }
  if (action === "toggle-question") {
    const question = questions.find((item) => item.id === actionTarget.dataset.id);
    if (question) {
      if (!isSurveyConfigEditable(surveyForQuestion(question))) {
        showToast("Chỉ khảo sát Khởi tạo mới được bật/tắt câu hỏi.");
        return;
      }
      const willActivate = !question.active;
      openConfirmModal({
        title: willActivate ? "Bật câu hỏi?" : "Tắt câu hỏi?",
        message: `${willActivate ? "Bật" : "Tắt"} trạng thái câu hỏi "${question.code}".`,
        confirmText: willActivate ? "Bật câu hỏi" : "Tắt câu hỏi",
        onConfirm: () => {
          question.active = willActivate;
          question.updatedBy = currentUser.username;
          question.updatedAt = new Date().toISOString();
          showToast(willActivate ? "Đã bật câu hỏi." : "Đã tắt câu hỏi.");
          render();
        },
      });
    }
  }
  if (action === "delete-question") {
    const index = questions.findIndex((item) => item.id === actionTarget.dataset.id);
    const question = questions[index];
    if (!isSurveyConfigEditable(surveyForQuestion(question))) return showToast("Chỉ khảo sát Khởi tạo mới được xóa câu hỏi.");
    if (index >= 0) {
      questions.splice(index, 1);
      showToast("Đã xóa câu hỏi trong prototype.");
      render();
    }
  }
  if (action === "add-answer-option") {
    const list = document.querySelector(".answer-option-list");
    if (list) {
      const existingOptions = readOptionRowsFromList(list);
      list.insertAdjacentHTML("beforeend", renderAnswerOptionRows([{ code: nextOptionCodeFromOptions(existingOptions), text: "", active: true }]));
    }
  }
  if (action === "add-other-option") {
    const currentQuestionType = document.querySelector("#questionType")?.value || "";
    if ([RANKING_TYPE, TOP_N_TYPE].includes(normalizedQuestionType(currentQuestionType))) {
      showToast("Loại câu hỏi này không dùng đáp án Khác.");
      return;
    }
    const list = document.querySelector(".answer-option-list");
    if (!list) return;
    const existingOptions = readOptionRowsFromList(list);
    const existingValues = existingOptions.map((option) => normalizedText(option.text));
    if (existingValues.includes(normalizedText(OTHER_OPTION_LABEL))) {
      showToast("Đáp án Khác đã tồn tại.");
      return;
    }
    list.insertAdjacentHTML("beforeend", renderAnswerOptionRows([{ code: nextOptionCodeFromOptions(existingOptions), text: OTHER_OPTION_LABEL, active: true }]));
  }
  if (action === "remove-answer-option") {
    const row = actionTarget.closest(".answer-option-row");
    const list = actionTarget.closest(".answer-option-list");
    if (row && list && list.querySelectorAll(".answer-option-row").length > 1) row.remove();
    else showToast("Cần giữ lại ít nhất một đáp án.");
  }
  if (action === "rank-option-up" || action === "rank-option-down") {
    const question = entryQuestions().find((item) => item.code === actionTarget.dataset.code) || previewQuestions().find((item) => item.code === actionTarget.dataset.code);
    if (!question) return;
    const index = Number(actionTarget.dataset.index);
    const direction = action === "rank-option-up" ? -1 : 1;
    const nextIndex = index + direction;
    const ordered = rankingAnswerForQuestion(question);
    if (nextIndex < 0 || nextIndex >= ordered.length) return;
    [ordered[index], ordered[nextIndex]] = [ordered[nextIndex], ordered[index]];
    state.answers[question.code] = ordered;
    persistPrototypeData();
    render();
  }
  if (action === "add-matrix-row") {
    const list = document.querySelector(".matrix-row-config-list");
    if (list) list.insertAdjacentHTML("beforeend", renderMatrixConfigRows([{ code: nextMatrixItemCodeFromList(list, "R"), text: "" }], "matrixRowValue", "Tiêu chí", "R"));
  }
  if (action === "add-matrix-column") {
    const list = document.querySelector(".matrix-column-config-list");
    if (list) list.insertAdjacentHTML("beforeend", renderMatrixConfigRows([{ code: nextMatrixItemCodeFromList(list, "C"), text: "" }], "matrixColumnValue", "Lựa chọn", "C"));
  }
  if (action === "remove-matrix-item") {
    const row = actionTarget.closest(".answer-option-row");
    const list = actionTarget.closest(".matrix-row-config-list, .matrix-column-config-list");
    if (row && list && list.querySelectorAll(".answer-option-row").length > 1) row.remove();
    else showToast("Cần giữ lại ít nhất một dòng/cột.");
  }
  if (action === "add-rule-group") {
    const form = document.querySelector("#ruleForm");
    const list = document.querySelector("#ruleGroupList");
    if (form && list) {
      const sourceQuestion = selectedQuestions().find((question) => question.code === form.elements.source.value);
      const validOperators = operatorOptionsForQuestion(sourceQuestion);
      const groups = [...list.querySelectorAll("[data-rule-group]")].map((row) => {
        const selectedAction = row.querySelector('[name="action"]')?.value || "Hiển thị câu hỏi";
        const selectedTarget = row.querySelector('[name="target"]')?.value || "";
        const isEndAction = selectedAction === "Kết thúc khảo sát";
        const selectedOperator = row.querySelector('[name="operator"]')?.value || defaultOperatorForQuestion(sourceQuestion);
        const matrixScope = isMatrixRatingType(sourceQuestion?.type) ? row.querySelector('[name="matrixScope"]')?.value || "row" : "row";
        return {
          id: row.dataset.groupId,
          operator: validOperators.includes(selectedOperator) ? selectedOperator : defaultOperatorForQuestion(sourceQuestion),
          matrixScope,
          matrixRow: (!isMatrixRatingType(sourceQuestion?.type) || matrixScope === "row") ? row.querySelector('[name="matrixRow"]')?.value || "" : "",
          value: row.querySelector('[name="value"]')?.value || "",
          action: selectedAction,
          target: isEndAction ? "" : selectedTarget,
        };
      });
      groups.push({ ...ruleGroups({})[0], id: `g-${Date.now()}` });
      list.innerHTML = renderRuleGroupRows(groups, sourceQuestion);
    }
  }
  if (action === "remove-rule-group") {
    const row = actionTarget.closest("[data-rule-group]");
    const list = actionTarget.closest("#ruleGroupList");
    if (row && list && list.querySelectorAll("[data-rule-group]").length > 1) row.remove();
    else showToast("Cần giữ lại ít nhất một nhóm điều kiện.");
  }
  if (action === "add-rule") {
    if (!isSelectedSurveyConfigEditable()) return showToast("Chỉ khảo sát Khởi tạo mới được thêm điều kiện.");
    openRuleModal(null, actionTarget.dataset.id);
  }
  if (action === "view-rule") {
    openRuleViewModal(actionTarget.dataset.id);
  }
  if (action === "edit-rule") {
    const rule = rules.find((item) => item.id === actionTarget.dataset.id);
    if (!isSurveyConfigEditable(surveyForRule(rule))) {
      showToast("Chỉ khảo sát Khởi tạo mới được sửa điều kiện.");
      return;
    }
    openRuleModal(actionTarget.dataset.id);
  }
  if (action === "check-rule-loop") {
    showToast("Prototype: chưa phát hiện vòng lặp trong điều kiện hiện tại.");
  }
  if (action === "close-modal") closeModal();
  if (action === "backdrop" && event.target === actionTarget) return;
  if (action === "detail-tab") {
    state.detailTab = actionTarget.dataset.tab;
    if (state.detailTab === "entry") {
      resetDraftAnswersForSurvey(selectedSurvey()?.id);
      state.selectedQuestionIndex = 0;
      state.entryHistory = [];
    }
    renderSurveyDetail();
  }
  if (action === "goto-branching") {
    state.detailTab = "branching";
    renderSurveyDetail();
  }
  if (action === "goto-entry") {
    state.detailTab = "entry";
    resetDraftAnswersForSurvey(selectedSurvey()?.id);
    state.selectedQuestionIndex = 0;
    state.entryHistory = [];
    renderSurveyDetail();
  }
  if (action === "select-question") {
    state.selectedQuestionIndex = Number(actionTarget.dataset.index);
    state.entryHistory = [];
    if (state.view === "surveyDetail") renderSurveyDetail();
    else renderEntry();
  }
  if (action === "next-question") {
    if (!validateCurrentQuestionBeforeMove()) return;
    const current = entryQuestions()[state.selectedQuestionIndex];
    const matchedRule = matchedRuleForQuestion(current);
    if (matchedRule?.action === "Kết thúc khảo sát") {
      openConfirmModal({
        title: "Kết thúc khảo sát?",
        message: `Điều kiện rẽ nhánh "${matchedRule.parentRule?.name || matchedRule.code || "đã cấu hình"}" sẽ kết thúc khảo sát tại câu ${current?.code || "hiện tại"}.`,
        confirmText: "Kết thúc khảo sát",
        onConfirm: () => finishCurrentEntrySession("Đã xác nhận kết thúc khảo sát và ghi nhận báo cáo."),
      });
      return;
    }
    const nextIndex = nextEntryQuestionIndex();
    if (nextIndex < 0) {
      finishCurrentEntrySession("Đã hoàn thành khảo sát và ghi nhận báo cáo.");
      return;
    } else {
      goToEntryQuestion(nextIndex);
    }
    if (state.view === "surveyDetail") renderSurveyDetail();
    else renderEntry();
  }
  if (action === "prev-question") {
    state.selectedQuestionIndex = state.entryHistory.length ? state.entryHistory.pop() : Math.max(state.selectedQuestionIndex - 1, 0);
    if (state.view === "surveyDetail") renderSurveyDetail();
    else renderEntry();
  }
  if (action === "complete-session") {
    if (!hasPermission("SESSION_SUBMIT")) {
      showToast("Role hiện tại không có quyền submit phiên khảo sát.");
      return;
    }
    if (!validateCurrentQuestionBeforeMove()) return;
    const customer = selectedCustomer();
    const survey = selectedSurvey();
    const latestSession = customer ? sessions.find((session) => session.customerId === customer.id && session.surveyId === state.selectedSurveyId) : null;
    const currentSession = latestSession && latestSession.status !== "Hoàn thành" ? latestSession : latestSession;
    if (customer && survey) {
      const session =
        currentSession ||
        {
          id: `S${String(sessions.length + 1).padStart(3, "0")}`,
          surveyId: survey.id,
          customer: customer.name,
          customerId: customer.id,
          startedAt: new Date().toISOString(),
        };
      if (!currentSession) sessions.unshift(session);
      finishSurveySession(session, customer, survey);
    }
    showToast(customer ? `Đã hoàn thành kiểm tra cho ${customer.name}.` : "Lượt kiểm tra mẫu đã được đánh dấu hoàn thành.");
    renderReports();
  }
});

document.addEventListener("dragstart", (event) => {
  const rankingItem = event.target.closest(".ranking-item[data-ranking-code]");
  if (rankingItem) {
    draggedRanking = {
      code: rankingItem.dataset.rankingCode,
      index: Number(rankingItem.dataset.rankingIndex),
    };
    rankingItem.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `${draggedRanking.code}:${draggedRanking.index}`);
    return;
  }
  const card = event.target.closest(".question-card[data-question-id]");
  if (!card) return;
  if (!isSelectedSurveyConfigEditable()) return;
  draggedQuestionId = card.dataset.questionId;
  card.classList.add("is-dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedQuestionId);
});

document.addEventListener("dragover", (event) => {
  const rankingItem = event.target.closest(".ranking-item[data-ranking-code]");
  if (rankingItem && draggedRanking && rankingItem.dataset.rankingCode === draggedRanking.code) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    document.querySelectorAll(".ranking-item.is-drop-target").forEach((item) => item.classList.remove("is-drop-target"));
    rankingItem.classList.add("is-drop-target");
    return;
  }
  const card = event.target.closest(".question-card[data-question-id]");
  if (!card || !draggedQuestionId || card.dataset.questionId === draggedQuestionId) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  document.querySelectorAll(".question-card.is-drop-target").forEach((item) => item.classList.remove("is-drop-target"));
  card.classList.add("is-drop-target");
});

document.addEventListener("dragleave", (event) => {
  const rankingItem = event.target.closest(".ranking-item[data-ranking-code]");
  if (rankingItem && !rankingItem.contains(event.relatedTarget)) rankingItem.classList.remove("is-drop-target");
  const card = event.target.closest(".question-card[data-question-id]");
  if (card && !card.contains(event.relatedTarget)) card.classList.remove("is-drop-target");
});

document.addEventListener("drop", (event) => {
  const rankingItem = event.target.closest(".ranking-item[data-ranking-code]");
  if (rankingItem && draggedRanking && rankingItem.dataset.rankingCode === draggedRanking.code) {
    event.preventDefault();
    const question = entryQuestions().find((item) => item.code === draggedRanking.code) || previewQuestions().find((item) => item.code === draggedRanking.code);
    const targetIndex = Number(rankingItem.dataset.rankingIndex);
    if (question && Number.isInteger(targetIndex) && targetIndex !== draggedRanking.index) {
      const ordered = rankingAnswerForQuestion(question);
      const [moved] = ordered.splice(draggedRanking.index, 1);
      ordered.splice(targetIndex, 0, moved);
      state.answers[question.code] = ordered;
      persistPrototypeData();
    }
    draggedRanking = null;
    document.querySelectorAll(".ranking-item.is-dragging, .ranking-item.is-drop-target").forEach((item) => item.classList.remove("is-dragging", "is-drop-target"));
    render();
    return;
  }
  const card = event.target.closest(".question-card[data-question-id]");
  if (!card || !draggedQuestionId) return;
  event.preventDefault();
  const moved = reorderSurveyQuestions(selectedSurvey()?.id, draggedQuestionId, card.dataset.questionId);
  draggedQuestionId = null;
  document.querySelectorAll(".question-card.is-dragging, .question-card.is-drop-target").forEach((item) => item.classList.remove("is-dragging", "is-drop-target"));
  if (moved) {
    showToast("Đã cập nhật thứ tự câu hỏi.");
    render();
  }
});

document.addEventListener("dragend", () => {
  draggedRanking = null;
  draggedQuestionId = null;
  document.querySelectorAll(".question-card.is-dragging, .question-card.is-drop-target, .ranking-item.is-dragging, .ranking-item.is-drop-target").forEach((item) => item.classList.remove("is-dragging", "is-drop-target"));
});

document.addEventListener("change", (event) => {
  if (["operator", "action"].includes(event.target?.name) && event.target.closest("#ruleForm")) {
    const form = document.querySelector("#ruleForm");
    const list = document.querySelector("#ruleGroupList");
    const sourceQuestion = selectedQuestions().find((question) => question.code === form?.elements.source.value);
    if (form && list && sourceQuestion) {
      const validOperators = operatorOptionsForQuestion(sourceQuestion);
      const groups = [...list.querySelectorAll("[data-rule-group]")].map((row) => {
        const selectedAction = row.querySelector('[name="action"]')?.value || "Hiển thị câu hỏi";
        const selectedTarget = row.querySelector('[name="target"]')?.value || "";
        const isEndAction = normalizedText(selectedAction) === normalizedText("Kết thúc khảo sát");
        const selectedOperator = row.querySelector('[name="operator"]')?.value || defaultOperatorForQuestion(sourceQuestion);
        const matrixScope = isMatrixRatingType(sourceQuestion?.type) ? row.querySelector('[name="matrixScope"]')?.value || "row" : "row";
        return {
          id: row.dataset.groupId,
          operator: validOperators.includes(selectedOperator) ? selectedOperator : defaultOperatorForQuestion(sourceQuestion),
          matrixScope,
          matrixRow: (!isMatrixRatingType(sourceQuestion?.type) || matrixScope === "row") ? row.querySelector('[name="matrixRow"]')?.value || "" : "",
          value: row.querySelector('[name="value"]')?.value || "",
          action: selectedAction,
          target: isEndAction ? "" : selectedTarget,
        };
      });
      list.innerHTML = renderRuleGroupRows(groups, sourceQuestion);
    }
    return;
  }

  const answerCode = event.target.dataset.answer;
  if (answerCode) {
    state.answers[answerCode] = event.target.value;
    document.querySelectorAll(`[data-other-answer="${CSS.escape(answerCode)}"]`).forEach((input) => {
      input.hidden = !isOtherOption(event.target.value);
      if (!isOtherOption(event.target.value)) input.value = "";
    });
    if (!isOtherOption(event.target.value)) delete state.answers[otherAnswerKey(answerCode)];
    persistPrototypeData();
  }

  const multiCode = event.target.dataset.multiAnswer;
  if (multiCode) {
    const values = new Set(Array.isArray(state.answers[multiCode]) ? state.answers[multiCode] : []);
    if (event.target.checked) values.add(event.target.value);
    else values.delete(event.target.value);
    state.answers[multiCode] = [...values];
    document.querySelectorAll(`[data-other-answer="${CSS.escape(multiCode)}"]`).forEach((input) => {
      input.hidden = ![...values].some(isOtherOption);
      if (input.hidden) input.value = "";
    });
    if (![...values].some(isOtherOption)) delete state.answers[otherAnswerKey(multiCode)];
    persistPrototypeData();
  }

  const topNCode = event.target.dataset.topNAnswer;
  if (topNCode) {
    const values = new Set(Array.isArray(state.answers[topNCode]) ? state.answers[topNCode] : []);
    if (event.target.checked) values.add(event.target.value);
    else values.delete(event.target.value);
    state.answers[topNCode] = [...values];
    persistPrototypeData();
    render();
  }

  const matrixCode = event.target.dataset.matrixAnswer;
  if (matrixCode) {
    const row = event.target.dataset.matrixRow;
    const current = state.answers[matrixCode] && typeof state.answers[matrixCode] === "object" && !Array.isArray(state.answers[matrixCode]) ? state.answers[matrixCode] : {};
    state.answers[matrixCode] = { ...current, [row]: event.target.value };
    persistPrototypeData();
  }

  const matrixMultiCode = event.target.dataset.matrixMultiAnswer;
  if (matrixMultiCode) {
    const row = event.target.dataset.matrixRow;
    const current = state.answers[matrixMultiCode] && typeof state.answers[matrixMultiCode] === "object" && !Array.isArray(state.answers[matrixMultiCode]) ? state.answers[matrixMultiCode] : {};
    const values = new Set(Array.isArray(current[row]) ? current[row] : []);
    if (event.target.checked) values.add(event.target.value);
    else values.delete(event.target.value);
    state.answers[matrixMultiCode] = { ...current, [row]: [...values] };
    persistPrototypeData();
  }
});

document.addEventListener("input", (event) => {
  const answerCode = event.target.dataset.answerText;
  if (answerCode) {
    state.answers[answerCode] = event.target.value;
    persistPrototypeData();
  }

  const otherCode = event.target.dataset.otherAnswer;
  if (otherCode) {
    state.answers[otherAnswerKey(otherCode)] = event.target.value.slice(0, 255);
    if (event.target.value.length > 255) event.target.value = event.target.value.slice(0, 255);
    persistPrototypeData();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalRoot.innerHTML) closeModal();
});

async function initializeApp() {
  render();
  const loadedFromSupabase = await loadPrototypeDataFromSupabase();
  if (loadedFromSupabase) {
    render();
    showToast("Đã đồng bộ dữ liệu từ Supabase.");
  } else if (supabaseClient) {
    showToast("Đã sẵn sàng lưu dữ liệu demo lên Supabase.");
  }
}

initializeApp();
