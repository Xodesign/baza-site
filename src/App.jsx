import { useState, useEffect } from "react";
import {
	Search,
	Plus,
	Edit2,
	Trash2,
	Download,
	LogOut,
	Menu,
	X,
	Building2,
	Settings,
	Users,
	Calendar,
	FileText,
	Truck,
	DollarSign,
	Wrench,
	ClipboardList,
	BarChart3,
	Phone,
	MapPin,
	Clock,
	User,
	AlertCircle,
	Check,
	ChevronDown,
	ChevronUp,
	ShoppingCart,
	CreditCard,
	Briefcase,
	Target,
	UserCheck,
	Zap,
	PlusCircle,
} from "lucide-react";
import excelData from "./excel_data.js";
import "./App.css";
import EngineersCalendar from "./components/EngineersCalendar";

// === ИКОНКИ ДЛЯ РАЗДЕЛОВ ===
const SECTION_ICONS = {
	objects: Building2,
	costs: DollarSign,
	systems: Settings,
	contacts: Users,
	tools: Wrench,
	tree: ClipboardList,
	summary: BarChart3,
	calls: Phone,
	activation: FileText,
	buy: ShoppingCart,
	invoices: CreditCard,
	transport: Truck,
	staff: UserCheck,
	calendar_engineer: Calendar,
	calendar_object: Calendar,
	accounts: Briefcase,
	time: Clock,
	wishes: Target,
	extra: Zap,
};

// === МАППИНГ НАЗВАНИЙ ===
const SECTION_LABELS = {
	objects: "Объекты",
	costs: "Затраты и Договоры",
	systems: "Системы",
	contacts: "Контакты",
	tools: "Инструмент",
	tree: "Дерево",
	summary: "Сводная",
	calls: "Вызовы",
	activation: "Актирование",
	buy: "Купить",
	invoices: "Счета",
	transport: "Транспорт",
	staff: "Персонал",
	calendar_engineer: "Календарь инженер",
	calendar_object: "Календарь объект",
	accounts: "Учетные записи",
	time: "Время",
	wishes: "Пожелания",
	extra: "Доп. системы",
};

// === НАЧАЛЬНЫЕ ДАННЫЕ ОБЪЕКТОВ (из Excel) ===
const INITIAL_OBJECTS = excelData["Объекты"]?.rows?.map((row, idx) => ({
	id: idx + 1,
	...row,
})) || [
	{
		id: 1,
		"Наименование объекта": "Кубинка АВАНГАРД",
		Заказчик: "Полное наименование",
		Подрядчик: "СБ",
		"№ контр/дог": "№ 1-281224-РБ",
		"Тип договора": "ТО",
		"Продлеваемость ": "Продлеваемый автоматически",
	},
];

// === ДАННЫЕ ВЫЗОВОВ (из Excel) ===
const INITIAL_CALLS =
	excelData["Вызовы"]?.rows?.map((row, idx) => ({
		id: idx + 1,
		createdAt: row["дата заявки"] || new Date().toISOString(),
		deadline: row["Дедлайн"] || "",
		executionDate: row["Дата проведения"] || "",
		engineer: row["Исполнитель"] || "",
		assistant: row["Помощник"] || "",
		status: row["статус вызова"] || "new",
		type: row["тип заявка"] || "",
		objectName: row["Наименование объекта"] || "",
		shortAddress: row["сокращенный адрес"] || "",
		tenant: row["Арендатор"] || "",
		system: row["Система"] || "",
		request: row["Заявка"] || "",
		ourTool: row["наш инструмент для выполнения"] || "",
		toPurchase: row["Приобрести для выполнения"] || "",
		toRepair: row["отвезти в ремонт"] || "",
		activation: row["Актирование работ"] || "",
		dataOwner: row["У кого данные"] || "",
		customerContact: row["Кто обратился с заявкой от заказчика"] || "",
		creator: row["создатель заявки"] || "",
		description: "",
		extraData: {},
	})) || [];

// === ДАННЫЕ СИСТЕМ (из Excel) ===
const INITIAL_SYSTEMS =
	excelData["(Д) системы"]?.rows?.map((row, idx) => ({
		id: idx + 1,
		parentObject: row["Наименование объекта"] || "",
		systemType: row["дочерняя вкладка к объекту"] || "",
		brand: row["бренд"] || "",
		systemKind: row["тип"] || "",
		quantity: row["кол во"] || "",
	})) || [];

// === ДАННЫЕ ЗАТРАТ (из Excel) ===
const INITIAL_COSTS =
	excelData["Затраты"]?.rows?.map((row, idx) => ({
		id: idx + 1,
		objectName: row["Наименование объекта"] || "",
		shortAddress: row["сокращенный адрес"] || "",
		system: row["Система"] || "",
		employee: row["Сотрудник"] || "",
		amount: row["Сумма"] || "",
		comment: row["Коментарий (что и зачем)"] || "",
		receiptPhoto: row["Фото чека"] || "",
	})) || [];

// === ДАННЫЕ ИНСТРУМЕНТА (из Excel) ===
const INITIAL_TOOLS =
	excelData["Инструмент"]?.rows?.map((row, idx) => ({
		id: idx + 1,
		tool: row["Инструмент"] || "",
		inventoryNumber: row["инв. номер"] || "",
		brand: row["марка"] || "",
		objectName: row["Фактический"] || row["Наименование объекта"] || "",
		shortAddress: row["сокращенный адрес"] || "",
		arrivalDate: row["дата прибытия"] || "",
		callStatus: row["Статус вызова"] || "",
		transportRequest: row["подтвердить выбор "] || "",
		targetAddress: row["Целевой"] || "",
	})) || [];

// === ДАННЫЕ АКТИРОВАНИЯ (из Excel) ===
const INITIAL_ACTIVATIONS =
	excelData["Актирование"]?.rows?.map((row, idx) => ({
		id: idx + 1,
		requestDate: row["дата заявки"] || "",
		executionDate: row["Дата проведения"] || "",
		engineer: row["Исполнитель"] || "",
		requestType: row["тип заявки"] || "",
		objectName: row["Наименование объекта"] || "",
		shortAddress: row["сокращенный адрес"] || "",
		system: row["Система"] || "",
		request: row["Заявка"] || "",
		toPurchase: row["Приобрести для выполнения"] || "",
		customerContact: row["Кто обратился с заявкой от заказчика"] || "",
		creator: row["создатель заявки"] || "",
	})) || [];

// === ДАННЫЕ КУПИТЬ (из Excel) ===
const INITIAL_BUY =
	excelData["Купить"]?.rows?.map((row, idx) => ({
		id: idx + 1,
		requestDate: row["дата заявки"] || "",
		deadline: row["Дедлайн"] || "",
		status: row["статус заявки"] || "",
		contractNumber: row["№ контр/дог"] || "",
		objectName: row["Наименование\nобъекта"] || "",
		shortAddress: row["сокращенный адрес"] || "",
		payer: row["Кто оплачивает"] || "",
		whatToBuy: row["Что нужно приобрести"] || "",
		creator: row["создатель заявки"] || "",
	})) || [];

// === ДАННЫЕ ТРАНСПОРТ (из Excel) ===
const INITIAL_TRANSPORT =
	excelData["транспорт"]?.rows?.map((row, idx) => ({
		id: idx + 1,
		requestDate: row["дата заявки"] || "",
		deadline: row["Дедлайн"] || "",
		assignedDate: row["Дата назначено"] || "",
		assignedTo: row["Кому"] || "",
		purchaseStatus: row["статус заявки на закупку"] || "",
		callStatus: row["статус вызова"] || "",
		thisStatus: row["статус этой заявки"] || "",
		objectName: row["Наименование\nобъекта"] || "",
		shortAddress: row["сокращенный адрес"] || "",
		whatToTransport: row["Что нужно транспортировать"] || "",
		toolsList: row["Перечень инструмента"] || "",
		creator: row["создатель заявки"] || "",
	})) || [];

// === ДАННЫЕ СЧЕТА (из Excel) ===
const INITIAL_INVOICES =
	excelData["Счета"]?.rows?.map((row, idx) => ({
		id: idx + 1,
		requestDate: row["дата заявки"] || "",
		contractNumber: row["№ контр/дог"] || "",
		objectName: row["Наименование\nобъекта"] || "",
		shortAddress: row["сокращенный адрес"] || "",
		payer: row["Кто оплачивает"] || "",
		whatToBuy: row["Что нужно приобрести"] || "",
		creator: row["создатель заявки"] || "",
		confirmed: row["отметка о подверждении"] || "",
	})) || [];

// === ДАННЫЕ ВРЕМЯ (из Excel) ===
const INITIAL_TIME =
	excelData["Время"]?.rows?.map((row, idx) => ({
		id: idx + 1,
		customer: row["Заказчик"] || "",
		contractor: row["Подрядчик"] || "",
		contractNumber: row["№ контр/дог"] || "",
		fullAddress: row["Адрес полный объекта"] || "",
		shortAddress: row["Адрес сокращенный"] || "",
		objectName: row["Наименование объекта"] || "",
		tenant: row["Арендатор"] || "",
		systems: row["Системы"] || "",
		calculatedYearlyTime: row["Расчетное время на ТО за год"] || "",
		actualYearlyTime: row["Фактическое время на ТО за год"] || "",
		timeDifference: row["Разность расчетного и фактического"] || "",
	})) || [];

// === ДАННЫЕ СВОДНАЯ (из Excel) ===
const INITIAL_SUMMARY =
	excelData["Сводная"]?.rows?.slice(0, 50).map((row, idx) => ({
		id: idx + 1,
		...row,
	})) || [];

// === ДАННЫЕ ИНЖЕНЕРОВ (для Календаря инженеров) ===
const INITIAL_ENGINEERS = [
	{
		id: 1,
		name: "Иванов Иван Иванович",
		position: "Инженер",
		phone: "+7 (999) 123-45-67",
		salary: 80000,
		workSchedule: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
		workHours: { start: "09:00", end: "18:00" },
		vacations: [
			{ id: 1, start: "2025-07-01", end: "2025-07-14", type: "Основной" },
			{ id: 2, start: "2025-12-25", end: "2026-01-08", type: "Новогодний" }
		],
		status: "active"
	},
	{
		id: 2,
		name: "Петров Пётр Петрович",
		position: "Старший инженер",
		phone: "+7 (999) 234-56-78",
		salary: 95000,
		workSchedule: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
		workHours: { start: "08:00", end: "17:00" },
		vacations: [
			{ id: 1, start: "2025-08-15", end: "2025-08-28", type: "Основной" }
		],
		status: "active"
	},
	{
		id: 3,
		name: "Сидоров Алексей Сергеевич",
		position: "Инженер",
		phone: "+7 (999) 345-67-89",
		salary: 75000,
		workSchedule: { mon: false, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false },
		workHours: { start: "10:00", end: "19:00" },
		vacations: [],
		status: "active"
	}
];

// === ДАННЫЕ КАЛЕНДАРЬ ОБЪЕКТ (из Excel) ===
const INITIAL_CALENDAR_OBJECT =
	excelData["Календарь объект"]?.rows?.slice(0, 50).map((row, idx) => ({
		id: idx + 1,
		...row,
	})) || [];

// === ДАННЫЕ ПОЖЕЛАНИЯ (из Excel) ===
const INITIAL_WISHES =
	excelData["Пожелания"]?.rows?.map((row, idx) => ({
		id: idx + 1,
		wish:
			row["Столбцы должны быть выключаемые"] ||
			row["учет рабочего времени"] ||
			"",
		description: Object.values(row)[1] || "",
	})) || [];

// === ДАННЫЕ ДОПОЛНИТЕЛЬНЫЕ (из Excel Артем) ===
const INITIAL_EXTRA =
	excelData["Артем"]?.rows?.map((row, idx) => ({
		id: idx + 1,
		...row,
	})) || [];

// === ФУНКЦИЯ ИЗВЛЕЧЕНИЯ КОНТАКТОВ ИЗ ОБЪЕКТОВ ===
function extractContactsFromObjects(objects) {
	const contacts = [];
	objects.forEach((obj) => {
		const contactStr = obj["Контакты"] || "";
		if (contactStr && contactStr.trim()) {
			// Парсим строку контакта: "Иванов Иван +79991234567"
			const match = contactStr.match(/^(.+?)\s*([+\d\s()]+)$/);
			contacts.push({
				id: `obj_${obj.id}`,
				name: match ? match[1].trim() : contactStr,
				phone: match ? match[2].trim() : "",
				objectName: obj["Наименование объекта"] || "",
				shortAddress: obj["Адрес сокращенный"] || obj["Адрес полный объекта"] || "",
				source: "object",
				objectId: obj.id,
			});
		}
	});
	return contacts;
}

const INITIAL_CONTACTS = extractContactsFromObjects(INITIAL_OBJECTS);

function App() {
	// --- СТЕЙТЫ АВТОРИЗАЦИИ ---
	const [isAuthenticated, setIsAuthenticated] = useState(
		() => localStorage.getItem("demo_isAuthenticated") === "true",
	);
	const [_authToken, setAuthToken] = useState(
		() => localStorage.getItem("authToken") || null,
	);
	const [authEmail, setAuthEmail] = useState("");
	const [authPassword, setAuthPassword] = useState("");
	const [authError, setAuthError] = useState("");
	const [isAuthLoading, setIsAuthLoading] = useState(false);

	// --- ОСНОВНЫЕ СТЕЙТЫ ---
	const [activeTab, setActiveTab] = useState("objects");
	const [searchQuery, setSearchQuery] = useState("");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isExporting, setIsExporting] = useState(false);

	// --- СТЕЙТЫ ОБЪЕКТОВ ---
	const [objects, setObjects] = useState(() => {
		const saved = localStorage.getItem("demo_objects");
		return saved ? JSON.parse(saved) : INITIAL_OBJECTS;
	});
	const [newFormData, setNewFormData] = useState(getEmptyObjectForm());
	const [editingObject, setEditingObject] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	// --- СТЕЙТЫ ВЫЗОВОВ ---
	const [calls, setCalls] = useState(() => {
		const saved = localStorage.getItem("demo_calls");
		return saved ? JSON.parse(saved) : INITIAL_CALLS;
	});
	const [newCallData, setNewCallData] = useState(getEmptyCallForm());
	const [editingCall, setEditingCall] = useState(null);
	const [isCallModalOpen, setIsCallModalOpen] = useState(false);
	const [expandedCallId, setExpandedCallId] = useState(null);
	const [callFilter, setCallFilter] = useState("all");

	// --- СТЕЙТЫ СИСТЕМ ---
	const [systems, setSystems] = useState(() => {
		const saved = localStorage.getItem("demo_systems");
		return saved ? JSON.parse(saved) : INITIAL_SYSTEMS;
	});
	const [newSystemData, setNewSystemData] = useState(getEmptySystemForm());

	// --- СТЕЙТЫ ЗАТРАТ ---
	const [costs, setCosts] = useState(() => {
		const saved = localStorage.getItem("demo_costs");
		return saved ? JSON.parse(saved) : INITIAL_COSTS;
	});
	const [newCostData, setNewCostData] = useState(getEmptyCostForm());

	// --- СТЕЙТЫ ИНСТРУМЕНТА ---
	const [tools, setTools] = useState(() => {
		const saved = localStorage.getItem("demo_tools");
		return saved ? JSON.parse(saved) : INITIAL_TOOLS;
	});
	const [newToolData, setNewToolData] = useState(getEmptyToolForm());

	// --- СТЕЙТЫ АКТИРОВАНИЯ ---
	const [activations, setActivations] = useState(() => {
		const saved = localStorage.getItem("demo_activations");
		return saved ? JSON.parse(saved) : INITIAL_ACTIVATIONS;
	});
	const [newActivationData, setNewActivationData] = useState(
		getEmptyActivationForm(),
	);

	// --- СТЕЙТЫ КУПИТЬ ---
	const [buyItems, setBuyItems] = useState(() => {
		const saved = localStorage.getItem("demo_buy");
		return saved ? JSON.parse(saved) : INITIAL_BUY;
	});
	const [newBuyData, setNewBuyData] = useState(getEmptyBuyForm());

	// --- СТЕЙТЫ ТРАНСПОРТ ---
	const [transportItems, setTransportItems] = useState(() => {
		const saved = localStorage.getItem("demo_transport");
		return saved ? JSON.parse(saved) : INITIAL_TRANSPORT;
	});
	const [newTransportData, setNewTransportData] = useState(
		getEmptyTransportForm(),
	);

	// --- СТЕЙТЫ СЧЕТА ---
	const [invoices, setInvoices] = useState(() => {
		const saved = localStorage.getItem("demo_invoices");
		return saved ? JSON.parse(saved) : INITIAL_INVOICES;
	});
	const [newInvoiceData, setNewInvoiceData] = useState(getEmptyInvoiceForm());

	// --- СТЕЙТЫ ВРЕМЯ ---
	const [timeEntries, setTimeEntries] = useState(() => {
		const saved = localStorage.getItem("demo_time");
		return saved ? JSON.parse(saved) : INITIAL_TIME;
	});
	const [newTimeData, setNewTimeData] = useState(getEmptyTimeForm());

	// --- СТЕЙТЫ СВОДНАЯ ---
	const [summary] = useState(INITIAL_SUMMARY);

	const [calendarObject] = useState(INITIAL_CALENDAR_OBJECT);

	// --- СТЕЙТЫ ПОЖЕЛАНИЯ ---
	const [wishes] = useState(INITIAL_WISHES);

	// --- СТЕЙТЫ ДОПОЛНИТЕЛЬНЫЕ ---
	const [extra] = useState(INITIAL_EXTRA);

	// --- СТЕЙТЫ КОНТАКТОВ ---
	const [contacts, setContacts] = useState(() => {
		const saved = localStorage.getItem("demo_contacts");
		return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
	});
	const [newContactData, setNewContactData] = useState(getEmptyContactForm());
	const [editingContact, setEditingContact] = useState(null);
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);
	const [contactFilter, setContactFilter] = useState("all");

	// --- СПИСОК РАЗДЕЛОВ ---
	const MENU_ITEMS = Object.keys(SECTION_LABELS).map((id) => ({
		id,
		label: SECTION_LABELS[id],
		icon: SECTION_ICONS[id] || FileText,
	}));

	// --- ЭФФЕКТЫ СОХРАНЕНИЯ ---
	useEffect(() => {
		localStorage.setItem("demo_objects", JSON.stringify(objects));
	}, [objects]);
	useEffect(() => {
		localStorage.setItem("demo_calls", JSON.stringify(calls));
	}, [calls]);
	useEffect(() => {
		localStorage.setItem("demo_systems", JSON.stringify(systems));
	}, [systems]);
	useEffect(() => {
		localStorage.setItem("demo_costs", JSON.stringify(costs));
	}, [costs]);
	useEffect(() => {
		localStorage.setItem("demo_tools", JSON.stringify(tools));
	}, [tools]);
	useEffect(() => {
		localStorage.setItem("demo_activations", JSON.stringify(activations));
	}, [activations]);
	useEffect(() => {
		localStorage.setItem("demo_buy", JSON.stringify(buyItems));
	}, [buyItems]);
	useEffect(() => {
		localStorage.setItem("demo_transport", JSON.stringify(transportItems));
	}, [transportItems]);
	useEffect(() => {
		localStorage.setItem("demo_invoices", JSON.stringify(invoices));
	}, [invoices]);
	useEffect(() => {
		localStorage.setItem("demo_time", JSON.stringify(timeEntries));
	}, [timeEntries]);
	useEffect(() => {
		localStorage.setItem("demo_engineers", JSON.stringify(engineers));
	}, [engineers]);

	// === ФУНКЦИИ ДЛЯ ПУСТЫХ ФОРМ ===
	function getEmptyObjectForm() {
		return {
			"Наименование объекта": "",
			Заказчик: "",
			Подрядчик: "СБ",
			"№ контр/дог": "",
			"Начало действия договора": "",
			"окончание действия договора": "",
			"Тип договора": "ТО",
			"Продлеваемость ": "",
			"Письмо о повышении стоимость ТО": "",
			"Свершившееся повышение цены ТО": "",
			"Доп соглашени": "",
			Письма: "",
			"Кто оплачивает ремонт": "",
			"Как оплачиваются доп.работы": "",
			"К доп работам есть ли аванс": "",
			"Адрес полный объекта": "",
			"Адрес сокращенный": "",
			"РД ИД ПД": "",
			Арендатор: "",
			Системы: "",
			"Расчетное время на обслуживание": "",
			Контакты: "",
			Заметки: "",
			"Инструмент на объекте": "нет",
		};
	}

	function getEmptyCallForm() {
		return {
			customerName: "",
			contactPerson: "",
			phone: "",
			address: "",
			reason: "",
			system: "АПС",
			priority: "normal",
			description: "",
			objectName: "",
			engineer: "",
			status: "new",
		};
	}

	function getEmptySystemForm() {
		return {
			parentObject: "",
			systemType: "",
			brand: "",
			systemKind: "",
			quantity: "",
		};
	}

	function getEmptyCostForm() {
		return {
			objectName: "",
			shortAddress: "",
			system: "",
			employee: "",
			amount: "",
			comment: "",
		};
	}

	function getEmptyToolForm() {
		return {
			tool: "",
			inventoryNumber: "",
			brand: "",
			objectName: "",
			shortAddress: "",
			arrivalDate: "",
			callStatus: "",
		};
	}

	function getEmptyActivationForm() {
		return {
			requestDate: "",
			executionDate: "",
			engineer: "",
			requestType: "",
			objectName: "",
			shortAddress: "",
			system: "",
			request: "",
			toPurchase: "",
			customerContact: "",
		};
	}

	function getEmptyBuyForm() {
		return {
			requestDate: "",
			deadline: "",
			status: "",
			contractNumber: "",
			objectName: "",
			shortAddress: "",
			payer: "",
			whatToBuy: "",
		};
	}

	function getEmptyTransportForm() {
		return {
			requestDate: "",
			deadline: "",
			assignedDate: "",
			assignedTo: "",
			objectName: "",
			shortAddress: "",
			whatToTransport: "",
			toolsList: "",
		};
	}

	function getEmptyInvoiceForm() {
		return {
			requestDate: "",
			contractNumber: "",
			objectName: "",
			shortAddress: "",
			payer: "",
			whatToBuy: "",
			confirmed: "",
		};
	}

	function getEmptyTimeForm() {
		return {
			customer: "",
			contractor: "СБ",
			contractNumber: "",
			fullAddress: "",
			shortAddress: "",
			objectName: "",
			tenant: "",
			systems: "",
			calculatedYearlyTime: "",
			actualYearlyTime: "",
		};
	}

	function getEmptyContactForm() {
		return {
			name: "",
			phone: "",
			objectName: "",
			shortAddress: "",
			position: "",
			email: "",
			notes: "",
			source: "manual",
			objectId: null,
		};
	}

	// === ЛОГИКА ОБЪЕКТОВ ===
	const handleAddObject = (e) => {
		e?.preventDefault();
		const name = newFormData["Наименование объекта"];
		const customer = newFormData["Заказчик"];
		if (!name?.trim() || !customer?.trim()) {
			alert("Заполните: Наименование объекта и Заказчика!");
			return;
		}
		const newObj = { id: Date.now(), ...newFormData };
		setObjects([newObj, ...objects]);
		setNewFormData(getEmptyObjectForm());
	};

	const handleDeleteObject = (id) => {
		if (confirm("Удалить объект?")) {
			setObjects(objects.filter((o) => o.id !== id));
		}
	};

	const handleEditObject = (obj) => {
		setEditingObject({ ...obj });
		setIsEditModalOpen(true);
	};

	const handleSaveEdit = (e) => {
		e?.preventDefault();
		setObjects(
			objects.map((o) => (o.id === editingObject.id ? editingObject : o)),
		);
		setIsEditModalOpen(false);
		setEditingObject(null);
	};

	// === ЛОГИКА ВЫЗОВОВ ===
	const handleAddCall = (e) => {
		e?.preventDefault();
		if (!newCallData.customerName?.trim()) {
			alert("Заполните Заказчика!");
			return;
		}
		const newCall = {
			id: Date.now(),
			createdAt: new Date().toISOString(),
			...newCallData,
		};
		setCalls([newCall, ...calls]);
		setNewCallData(getEmptyCallForm());
	};

	const handleDeleteCall = (id) => {
		if (confirm("Удалить вызов?")) setCalls(calls.filter((c) => c.id !== id));
	};

	const handleEditCall = (call) => {
		setEditingCall({ ...call });
		setIsCallModalOpen(true);
	};

	const handleSaveCall = (e) => {
		e?.preventDefault();
		setCalls(calls.map((c) => (c.id === editingCall.id ? editingCall : c)));
		setIsCallModalOpen(false);
		setEditingCall(null);
	};

	const handleStatusChange = (id, status) => {
		setCalls(calls.map((c) => (c.id === id ? { ...c, status } : c)));
	};

	const filteredCalls = calls.filter((c) => {
		if (callFilter === "all") return true;
		return c.status === callFilter;
	});

	// === ЛОГИКА СИСТЕМ ===
	const handleAddSystem = (e) => {
		e?.preventDefault();
		const newSys = { id: Date.now(), ...newSystemData };
		setSystems([newSys, ...systems]);
		setNewSystemData(getEmptySystemForm());
	};

	const handleDeleteSystem = (id) => {
		if (confirm("Удалить систему?"))
			setSystems(systems.filter((s) => s.id !== id));
	};

	// === ЛОГИКА ЗАТРАТ ===
	const handleAddCost = (e) => {
		e?.preventDefault();
		const newCost = { id: Date.now(), ...newCostData };
		setCosts([newCost, ...costs]);
		setNewCostData(getEmptyCostForm());
	};

	const handleDeleteCost = (id) => {
		if (confirm("Удалить затрату?")) setCosts(costs.filter((c) => c.id !== id));
	};

	// === ЛОГИКА ИНСТРУМЕНТА ===
	const handleAddTool = (e) => {
		e?.preventDefault();
		const newTool = { id: Date.now(), ...newToolData };
		setTools([newTool, ...tools]);
		setNewToolData(getEmptyToolForm());
	};

	const handleDeleteTool = (id) => {
		if (confirm("Удалить инструмент?"))
			setTools(tools.filter((t) => t.id !== id));
	};

	// === ЛОГИКА АКТИРОВАНИЯ ===
	const handleAddActivation = (e) => {
		e?.preventDefault();
		const newAct = { id: Date.now(), ...newActivationData };
		setActivations([newAct, ...activations]);
		setNewActivationData(getEmptyActivationForm());
	};

	const handleDeleteActivation = (id) => {
		if (confirm("Удалить акт?"))
			setActivations(activations.filter((a) => a.id !== id));
	};

	// === ЛОГИКА КУПИТЬ ===
	const handleAddBuy = (e) => {
		e?.preventDefault();
		const newItem = { id: Date.now(), ...newBuyData };
		setBuyItems([newItem, ...buyItems]);
		setNewBuyData(getEmptyBuyForm());
	};

	const handleDeleteBuy = (id) => {
		if (confirm("Удалить заявку?"))
			setBuyItems(buyItems.filter((b) => b.id !== id));
	};

	// === ЛОГИКА ТРАНСПОРТ ===
	const handleAddTransport = (e) => {
		e?.preventDefault();
		const newItem = { id: Date.now(), ...newTransportData };
		setTransportItems([newItem, ...transportItems]);
		setNewTransportData(getEmptyTransportForm());
	};

	const handleDeleteTransport = (id) => {
		if (confirm("Удалить заявку?"))
			setTransportItems(transportItems.filter((t) => t.id !== id));
	};

	// === ЛОГИКА СЧЕТА ===
	const handleAddInvoice = (e) => {
		e?.preventDefault();
		const newInv = { id: Date.now(), ...newInvoiceData };
		setInvoices([newInv, ...invoices]);
		setNewInvoiceData(getEmptyInvoiceForm());
	};

	const handleDeleteInvoice = (id) => {
		if (confirm("Удалить счёт?"))
			setInvoices(invoices.filter((i) => i.id !== id));
	};

	// === ЛОГИКА ВРЕМЯ ===
	const handleAddTime = (e) => {
		e?.preventDefault();
		const newTime = { id: Date.now(), ...newTimeData };
		setTimeEntries([newTime, ...timeEntries]);
		setNewTimeData(getEmptyTimeForm());
	};

	const handleDeleteTime = (id) => {
		if (confirm("Удалить запись?"))
			setTimeEntries(timeEntries.filter((t) => t.id !== id));
	};

	// === ЛОГИКА КОНТАКТОВ ===
	const handleAddContact = (e) => {
		e?.preventDefault();
		if (!newContactData.name?.trim()) {
			alert("Введите имя контакта!");
			return;
		}
		const newContact = { id: Date.now(), ...newContactData };
		setContacts([newContact, ...contacts]);
		setNewContactData(getEmptyContactForm());
	};

	const handleDeleteContact = (id) => {
		if (confirm("Удалить контакт?"))
			setContacts(contacts.filter((c) => c.id !== id));
	};

	const handleEditContact = (contact) => {
		setEditingContact({ ...contact });
		setIsContactModalOpen(true);
	};

	const handleSaveContact = (e) => {
		e?.preventDefault();
		setContacts(contacts.map((c) => (c.id === editingContact.id ? editingContact : c)));
		setIsContactModalOpen(false);
		setEditingContact(null);
	};

	const handleContactChange = (field, value) => {
		setEditingContact({ ...editingContact, [field]: value });
	};

	// Синхронизация контактов при изменении объектов
	useEffect(() => {
		const objectContacts = extractContactsFromObjects(objects);
		const manualContacts = contacts.filter((c) => c.source === "manual");
		setContacts([...manualContacts, ...objectContacts]);
	}, [objects]);

	useEffect(() => {
		localStorage.setItem("demo_contacts", JSON.stringify(contacts));
	}, [contacts]);

	// === ЭКСПОРТ ===
	const handleExport = () => {
		setIsExporting(true);
		setTimeout(() => {
			const data =
				activeTab === "objects"
					? objects
					: activeTab === "calls"
						? calls
						: activeTab === "systems"
							? systems
							: activeTab === "costs"
								? costs
								: activeTab === "tools"
									? tools
									: [];
			if (data.length === 0) {
				setIsExporting(false);
				return;
			}
			const headers = Object.keys(data[0]);
			const csv = [
				headers.join(";"),
				...data.map((r) => headers.map((h) => r[h] || "").join(";")),
			].join("\n");
			const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${activeTab}_${new Date().toISOString().split("T")[0]}.csv`;
			a.click();
			URL.revokeObjectURL(url);
			setIsExporting(false);
		}, 500);
	};

	// === ФИЛЬТРАЦИЯ ===
	const filteredObjects = objects.filter((o) => {
		const q = searchQuery.toLowerCase();
		return (
			(o["Наименование объекта"] || "").toLowerCase().includes(q) ||
			(o["Заказчик"] || "").toLowerCase().includes(q) ||
			(o["№ контр/дог"] || "").toLowerCase().includes(q)
		);
	});

	// === АВТОРИЗАЦИЯ ===
	const handleLogin = async (e) => {
		e.preventDefault();
		setAuthError("");
		setIsAuthLoading(true);
		await new Promise((r) => setTimeout(r, 1000));
		if (authEmail === "admin@baza.ru" && authPassword === "baza123") {
			localStorage.setItem("authToken", "demo_token");
			localStorage.setItem("demo_isAuthenticated", "true");
			setAuthToken("demo_token");
			setIsAuthenticated(true);
			setAuthEmail("");
			setAuthPassword("");
		} else {
			setAuthError("Неверный email или пароль. admin@baza.ru / baza123");
		}
		setIsAuthLoading(false);
	};

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("demo_isAuthenticated");
		setIsAuthenticated(false);
	};

	// === ЭКРАН ЛОГИНА ===
	if (!isAuthenticated) {
		return (
			<div className="login-container">
				<div className="login-card">
					<div className="login-header">
						<Building2 size={48} />
						<h1>База CRM</h1>
						<p>Управление объектами и заявками</p>
					</div>
					<form onSubmit={handleLogin} className="login-form">
						<div className="form-group">
							<label>Email</label>
							<input
								type="email"
								value={authEmail}
								onChange={(e) => setAuthEmail(e.target.value)}
								placeholder="admin@baza.ru"
								required
							/>
						</div>
						<div className="form-group">
							<label>Пароль</label>
							<input
								type="password"
								value={authPassword}
								onChange={(e) => setAuthPassword(e.target.value)}
								placeholder="baza123"
								required
							/>
						</div>
						{authError && <div className="auth-error">{authError}</div>}
						<button
							type="submit"
							className="btn btn-primary btn-full"
							disabled={isAuthLoading}
						>
							{isAuthLoading ? (
								<span className="loading-spinner"></span>
							) : (
								"Войти"
							)}
						</button>
					</form>
					<div className="login-hint">
						<p>
							Демо: <code>admin@baza.ru</code> / <code>baza123</code>
						</p>
					</div>
				</div>
			</div>
		);
	}

	// === РЕНДЕР РАЗДЕЛОВ ===
	const renderSection = () => {
		switch (activeTab) {
			case "objects":
				return renderObjectsSection();
			case "calls":
				return renderCallsSection();
			case "systems":
				return renderSystemsSection();
			case "costs":
				return renderCostsSection();
			case "tools":
				return renderToolsSection();
			case "buy":
				return renderBuySection();
			case "transport":
				return renderTransportSection();
			case "invoices":
				return renderInvoicesSection();
			case "time":
				return renderTimeSection();
			case "activation":
				return renderActivationSection();
			case "calendar_engineer":
				return renderCalendarEngineerSection();
			case "calendar_object":
				return renderCalendarObjectSection();
			case "summary":
				return renderSummarySection();
			case "wishes":
				return renderWishesSection();
			case "extra":
				return renderExtraSection();
			case "contacts":
				return renderContactsSection();
			case "tree":
			case "staff":
			case "accounts":
			default:
				return renderPlaceholderSection();
		}
	};

	function renderObjectsSection() {
		return (
			<>
				<div className="content-header">
					<div className="search-box">
						<Search size={20} />
						<input
							type="text"
							placeholder="Поиск по названию, заказчику, договору..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						{searchQuery && (
							<button
								className="clear-search"
								onClick={() => setSearchQuery("")}
							>
								<X size={16} />
							</button>
						)}
					</div>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Наименование</th>
								<th>Заказчик</th>
								<th>Подрядчик</th>
								<th>Договор</th>
								<th>Тип</th>
								<th>Адрес</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{filteredObjects.length === 0 ? (
								<tr>
									<td colSpan="8" className="empty-state">
										Нет объектов
									</td>
								</tr>
							) : (
								filteredObjects.map((obj) => (
									<tr key={obj.id}>
										<td className="cell-id">{obj.id}</td>
										<td>
											<strong>{obj["Наименование объекта"]}</strong>
										</td>
										<td>{obj["Заказчик"]}</td>
										<td>{obj["Подрядчик"]}</td>
										<td>{obj["№ контр/дог"]}</td>
										<td>
											<span
												className={`badge badge-type badge-${(obj["Тип договора"] || "").toLowerCase()}`}
											>
												{obj["Тип договора"]}
											</span>
										</td>
										<td>
											<span className="address-text">
												<MapPin size={14} />
												{obj["Адрес сокращенный"] ||
													obj["Адрес полный объекта"]}
											</span>
										</td>
										<td className="cell-actions">
											<button
												className="btn-icon btn-edit"
												onClick={() => handleEditObject(obj)}
												title="Редактировать"
											>
												<Edit2 size={16} />
											</button>
											<button
												className="btn-icon btn-delete"
												onClick={() => handleDeleteObject(obj.id)}
												title="Удалить"
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				<div className="add-form-section add-form-full">
					<h3>
						<Plus size={20} />
						Добавить объект
					</h3>
					<form onSubmit={handleAddObject} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>Заказчик</label>
								<input
									type="text"
									value={newFormData["Заказчик"] || ""}
									onChange={(e) =>
										setNewFormData({ ...newFormData, Заказчик: e.target.value })
									}
									placeholder="Заказчик"
								/>
							</div>
							<div className="form-group">
								<label>Подрядчик</label>
								<select
									value={newFormData["Подрядчик"] || "СБ"}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											Подрядчик: e.target.value,
										})
									}
								>
									<option value="СБ">СБ</option>
									<option value="СБ+">СБ+</option>
									<option value="ВСТ">ВСТ</option>
									<option value="ИП">ИП</option>
								</select>
							</div>
							<div className="form-group">
								<label>№ контр/дог</label>
								<input
									type="text"
									value={newFormData["№ контр/дог"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"№ контр/дог": e.target.value,
										})
									}
									placeholder="№ 1-2024-РБ"
								/>
							</div>
							<div className="form-group">
								<label>Начало действия договора</label>
								<input
									type="text"
									value={newFormData["Начало действия договора"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Начало действия договора": e.target.value,
										})
									}
									placeholder="ДД.ММ.ГГГГ"
								/>
							</div>
							<div className="form-group">
								<label>Окончание действия договора</label>
								<input
									type="text"
									value={newFormData["Окончание действия договора"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Окончание действия договора": e.target.value,
										})
									}
									placeholder="ДД.ММ.ГГГГ"
								/>
							</div>
							<div className="form-group">
								<label>Тип договора</label>
								<select
									value={newFormData["Тип договора"] || "ТО"}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Тип договора": e.target.value,
										})
									}
								>
									<option value="ТО">ТО</option>
									<option value="СМР">СМР</option>
									<option value="ПИР">ПИР</option>
								</select>
							</div>
							<div className="form-group">
								<label>Продлеваемость</label>
								<select
									value={newFormData["Продлеваемость"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											Продлеваемость: e.target.value,
										})
									}
								>
									<option value="">—</option>
									<option value="Продлеваемый автоматически">
										Продлеваемый автоматически
									</option>
									<option value="Не продлеваемый">Не продлеваемый</option>
									<option value="Продлеваемый доп соглашением">
										Продлеваемый доп соглашением
									</option>
									<option value="Конкурсный">Конкурсный</option>
								</select>
							</div>
							<div className="form-group">
								<label>Письмо о повышении стоимости ТО</label>
								<input
									type="text"
									value={newFormData["Письмо о повышении стоимости ТО"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Письмо о повышении стоимости ТО": e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Свершившееся повышение цены ТО</label>
								<input
									type="text"
									value={newFormData["Свершившееся повышение цены ТО"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Свершившееся повышение цены ТО": e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Доп соглашение</label>
								<input
									type="text"
									value={newFormData["Доп соглашение"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Доп соглашение": e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Письма</label>
								<input
									type="text"
									value={newFormData["Письма"] || ""}
									onChange={(e) =>
										setNewFormData({ ...newFormData, Письма: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>Кто оплачивает ремонт</label>
								<input
									type="text"
									value={newFormData["Кто оплачивает ремонт"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Кто оплачивает ремонт": e.target.value,
										})
									}
									placeholder="за наш счёт / заказчик"
								/>
							</div>
							<div className="form-group">
								<label>Как оплачиваются доп.работы</label>
								<input
									type="text"
									value={newFormData["Как оплачиваются доп.работы"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Как оплачиваются доп.работы": e.target.value,
										})
									}
									placeholder="Сметы / КП / По договору"
								/>
							</div>
							<div className="form-group">
								<label>К доп работам есть ли аванс</label>
								<select
									value={newFormData["К доп работам есть ли аванс"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"К доп работам есть ли аванс": e.target.value,
										})
									}
								>
									<option value="">—</option>
									<option value="Аванс">Аванс</option>
									<option value="Без аванса">Без аванса</option>
								</select>
							</div>
							<div className="form-group form-group-full">
								<label>Адрес полный объекта</label>
								<input
									type="text"
									value={newFormData["Адрес полный объекта"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Адрес полный объекта": e.target.value,
										})
									}
									placeholder="г. Москва, ул. Примерная, д. 1"
								/>
							</div>
							<div className="form-group">
								<label>Адрес сокращенный</label>
								<input
									type="text"
									value={newFormData["Адрес сокращенный"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Адрес сокращенный": e.target.value,
										})
									}
									placeholder="Примерная, 1"
								/>
							</div>
							<div className="form-group">
								<label>Наименование объекта</label>
								<input
									type="text"
									value={newFormData["Наименование объекта"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Наименование объекта": e.target.value,
										})
									}
									placeholder="Название объекта"
								/>
							</div>
							<div className="form-group">
								<label>РД ИД ПД</label>
								<input
									type="text"
									value={newFormData["РД ИД ПД"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"РД ИД ПД": e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Арендатор</label>
								<input
									type="text"
									value={newFormData["Арендатор"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											Арендатор: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Системы</label>
								<input
									type="text"
									value={newFormData["Системы"] || ""}
									onChange={(e) =>
										setNewFormData({ ...newFormData, Системы: e.target.value })
									}
									placeholder="АПС, СОУЭ, ВПВ"
								/>
							</div>
							<div className="form-group">
								<label>Расчетное время на обслуживание</label>
								<input
									type="text"
									value={newFormData["Расчетное время на обслуживание"] || ""}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Расчетное время на обслуживание": e.target.value,
										})
									}
									placeholder="2 часа"
								/>
							</div>
							<div className="form-group">
								<label>Контакты</label>
								<input
									type="text"
									value={newFormData["Контакты"] || ""}
									onChange={(e) =>
										setNewFormData({ ...newFormData, Контакты: e.target.value })
									}
									placeholder="Иванов Иван +79991234567"
								/>
							</div>
							<div className="form-group">
								<label>Инструмент на объекте</label>
								<select
									value={newFormData["Инструмент на объекте"] || "нет"}
									onChange={(e) =>
										setNewFormData({
											...newFormData,
											"Инструмент на объекте": e.target.value,
										})
									}
								>
									<option value="нет">Нет</option>
									<option value="есть">Есть</option>
								</select>
							</div>
							<div className="form-group form-group-full">
								<label>Заметки</label>
								<textarea
									value={newFormData["Заметки"] || ""}
									onChange={(e) =>
										setNewFormData({ ...newFormData, Заметки: e.target.value })
									}
									rows={3}
									placeholder="Дополнительная информация..."
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Добавить объект
						</button>
					</form>
				</div>
			</>
		);
	}

	function renderCallsSection() {
		return (
			<>
				<div className="calls-header">
					<div className="calls-stats">
						<div className="stat-card stat-new">
							<div className="stat-icon">
								<AlertCircle size={20} />
							</div>
							<div className="stat-info">
								<span className="stat-count">
									{calls.filter((c) => c.status === "new").length}
								</span>
								<span className="stat-label">Новых</span>
							</div>
						</div>
						<div className="stat-card stat-progress">
							<div className="stat-icon">
								<Clock size={20} />
							</div>
							<div className="stat-info">
								<span className="stat-count">
									{calls.filter((c) => c.status === "in_progress").length}
								</span>
								<span className="stat-label">В работе</span>
							</div>
						</div>
						<div className="stat-card stat-completed">
							<div className="stat-icon">
								<Check size={20} />
							</div>
							<div className="stat-info">
								<span className="stat-count">
									{calls.filter((c) => c.status === "completed").length}
								</span>
								<span className="stat-label">Завершено</span>
							</div>
						</div>
					</div>
					<div className="filter-tabs">
						{["all", "new", "in_progress", "completed"].map((f) => (
							<button
								key={f}
								className={`filter-tab ${callFilter === f ? "active" : ""}`}
								onClick={() => setCallFilter(f)}
							>
								{f === "all"
									? "Все"
									: f === "new"
										? "Новые"
										: f === "in_progress"
											? "В работе"
											: "Завершённые"}
							</button>
						))}
					</div>
				</div>
				<div className="calls-list">
					{filteredCalls.length === 0 ? (
						<div className="empty-calls">
							<Phone size={48} />
							<h3>Вызовов нет</h3>
						</div>
					) : (
						filteredCalls.map((call) => (
							<div key={call.id} className="call-card">
								<div
									className="call-header"
									onClick={() =>
										setExpandedCallId(
											expandedCallId === call.id ? null : call.id,
										)
									}
								>
									<div className="call-main-info">
										<h3>{call.objectName || call.customerName}</h3>
										<p>{call.request || call.reason}</p>
									</div>
									<div className="call-expand-icon">
										{expandedCallId === call.id ? (
											<ChevronUp size={20} />
										) : (
											<ChevronDown size={20} />
										)}
									</div>
								</div>
								{expandedCallId === call.id && (
									<div className="call-details">
										<div className="call-details-grid">
											<div className="detail-section">
												<h4>
													<User size={16} /> Заказчик
												</h4>
												<p>{call.customerContact || call.contactPerson}</p>
											</div>
											<div className="detail-section">
												<h4>
													<MapPin size={16} /> Адрес
												</h4>
												<p>{call.shortAddress || call.address}</p>
											</div>
											<div className="detail-section">
												<h4>
													<Settings size={16} /> Система
												</h4>
												<p>{call.system}</p>
											</div>
											<div className="detail-section">
												<h4>
													<Calendar size={16} /> Дата
												</h4>
												<p>
													{call.executionDate || call.createdAt?.split("T")[0]}
												</p>
											</div>
										</div>
										<div className="call-actions">
											{call.status !== "completed" && (
												<button
													className="btn btn-success btn-sm"
													onClick={() =>
														handleStatusChange(call.id, "completed")
													}
												>
													<Check size={16} /> Завершить
												</button>
											)}
											<button
												className="btn btn-icon btn-edit"
												onClick={() => handleEditCall(call)}
											>
												<Edit2 size={16} />
											</button>
											<button
												className="btn btn-icon btn-delete"
												onClick={() => handleDeleteCall(call.id)}
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>
								)}
							</div>
						))
					)}
				</div>
				<div className="add-form-section">
					<h3>
						<Plus size={20} />
						Новый вызов
					</h3>
					<form onSubmit={handleAddCall} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>Объект / Заказчик *</label>
								<input
									type="text"
									value={newCallData.customerName}
									onChange={(e) =>
										setNewCallData({
											...newCallData,
											customerName: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Адрес</label>
								<input
									type="text"
									value={newCallData.address}
									onChange={(e) =>
										setNewCallData({ ...newCallData, address: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>Система</label>
								<select
									value={newCallData.system}
									onChange={(e) =>
										setNewCallData({ ...newCallData, system: e.target.value })
									}
								>
									<option value="АПС">АПС</option>
									<option value="СОУЭ">СОУЭ</option>
									<option value="ВПВ">ВПВ</option>
									<option value="АПТ">АПТ</option>
								</select>
							</div>
							<div className="form-group">
								<label>Заявка</label>
								<input
									type="text"
									value={newCallData.reason}
									onChange={(e) =>
										setNewCallData({ ...newCallData, reason: e.target.value })
									}
									placeholder="Опишите заявку"
								/>
							</div>
							<div className="form-group">
								<label>Исполнитель</label>
								<input
									type="text"
									value={newCallData.engineer}
									onChange={(e) =>
										setNewCallData({ ...newCallData, engineer: e.target.value })
									}
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Создать вызов
						</button>
					</form>
				</div>
			</>
		);
	}

	function renderSystemsSection() {
		return (
			<>
				<div className="content-header">
					<h2>Системы объектов</h2>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Объект</th>
								<th>Тип системы</th>
								<th>Бренд</th>
								<th>Тип</th>
								<th>Кол-во</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{systems.length === 0 ? (
								<tr>
									<td colSpan="7" className="empty-state">
										Нет систем
									</td>
								</tr>
							) : (
								systems.map((s) => (
									<tr key={s.id}>
										<td>{s.id}</td>
										<td>{s.parentObject}</td>
										<td>{s.systemType}</td>
										<td>{s.brand}</td>
										<td>{s.systemKind}</td>
										<td>{s.quantity}</td>
										<td>
											<button
												className="btn-icon btn-delete"
												onClick={() => handleDeleteSystem(s.id)}
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				<div className="add-form-section">
					<h3>
						<Plus size={20} />
						Добавить систему
					</h3>
					<form onSubmit={handleAddSystem} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>Объект</label>
								<input
									type="text"
									value={newSystemData.parentObject}
									onChange={(e) =>
										setNewSystemData({
											...newSystemData,
											parentObject: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Тип системы</label>
								<select
									value={newSystemData.systemType}
									onChange={(e) =>
										setNewSystemData({
											...newSystemData,
											systemType: e.target.value,
										})
									}
								>
									<option value="АПС">АПС</option>
									<option value="СОУЭ">СОУЭ</option>
									<option value="ВПВ">ВПВ</option>
									<option value="АПТ">АПТ</option>
								</select>
							</div>
							<div className="form-group">
								<label>Бренд</label>
								<input
									type="text"
									value={newSystemData.brand}
									onChange={(e) =>
										setNewSystemData({
											...newSystemData,
											brand: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Тип оборудования</label>
								<input
									type="text"
									value={newSystemData.systemKind}
									onChange={(e) =>
										setNewSystemData({
											...newSystemData,
											systemKind: e.target.value,
										})
									}
									placeholder="датчиков, динамики, рукава..."
								/>
							</div>
							<div className="form-group">
								<label>Количество</label>
								<input
									type="text"
									value={newSystemData.quantity}
									onChange={(e) =>
										setNewSystemData({
											...newSystemData,
											quantity: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Добавить
						</button>
					</form>
				</div>
			</>
		);
	}

	function renderCostsSection() {
		return (
			<>
				<div className="content-header">
					<h2>Затраты</h2>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Объект</th>
								<th>Адрес</th>
								<th>Система</th>
								<th>Сотрудник</th>
								<th>Сумма</th>
								<th>Комментарий</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{costs.length === 0 ? (
								<tr>
									<td colSpan="8" className="empty-state">
										Нет затрат
									</td>
								</tr>
							) : (
								costs.map((c) => (
									<tr key={c.id}>
										<td>{c.id}</td>
										<td>{c.objectName}</td>
										<td>{c.shortAddress}</td>
										<td>{c.system}</td>
										<td>{c.employee}</td>
										<td>{c.amount}</td>
										<td>{c.comment}</td>
										<td>
											<button
												className="btn-icon btn-delete"
												onClick={() => handleDeleteCost(c.id)}
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				<div className="add-form-section">
					<h3>
						<Plus size={20} />
						Добавить затрату
					</h3>
					<form onSubmit={handleAddCost} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>Объект</label>
								<input
									type="text"
									value={newCostData.objectName}
									onChange={(e) =>
										setNewCostData({
											...newCostData,
											objectName: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Адрес</label>
								<input
									type="text"
									value={newCostData.shortAddress}
									onChange={(e) =>
										setNewCostData({
											...newCostData,
											shortAddress: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Система</label>
								<input
									type="text"
									value={newCostData.system}
									onChange={(e) =>
										setNewCostData({ ...newCostData, system: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>Сотрудник</label>
								<input
									type="text"
									value={newCostData.employee}
									onChange={(e) =>
										setNewCostData({ ...newCostData, employee: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>Сумма</label>
								<input
									type="text"
									value={newCostData.amount}
									onChange={(e) =>
										setNewCostData({ ...newCostData, amount: e.target.value })
									}
									placeholder="10000"
								/>
							</div>
							<div className="form-group form-group-full">
								<label>Комментарий</label>
								<input
									type="text"
									value={newCostData.comment}
									onChange={(e) =>
										setNewCostData({ ...newCostData, comment: e.target.value })
									}
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Добавить
						</button>
					</form>
				</div>
			</>
		);
	}

	function renderToolsSection() {
		return (
			<>
				<div className="content-header">
					<h2>Инструмент</h2>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Инструмент</th>
								<th>Инв. номер</th>
								<th>Марка</th>
								<th>Объект</th>
								<th>Адрес</th>
								<th>Статус</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{tools.length === 0 ? (
								<tr>
									<td colSpan="8" className="empty-state">
										Нет инструментов
									</td>
								</tr>
							) : (
								tools.map((t) => (
									<tr key={t.id}>
										<td>{t.id}</td>
										<td>{t.tool}</td>
										<td>{t.inventoryNumber}</td>
										<td>{t.brand}</td>
										<td>{t.objectName}</td>
										<td>{t.shortAddress}</td>
										<td>{t.callStatus}</td>
										<td>
											<button
												className="btn-icon btn-delete"
												onClick={() => handleDeleteTool(t.id)}
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				<div className="add-form-section">
					<h3>
						<Plus size={20} />
						Добавить инструмент
					</h3>
					<form onSubmit={handleAddTool} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>Инструмент</label>
								<input
									type="text"
									value={newToolData.tool}
									onChange={(e) =>
										setNewToolData({ ...newToolData, tool: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>Инв. номер</label>
								<input
									type="text"
									value={newToolData.inventoryNumber}
									onChange={(e) =>
										setNewToolData({
											...newToolData,
											inventoryNumber: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Марка</label>
								<input
									type="text"
									value={newToolData.brand}
									onChange={(e) =>
										setNewToolData({ ...newToolData, brand: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>Объект</label>
								<input
									type="text"
									value={newToolData.objectName}
									onChange={(e) =>
										setNewToolData({
											...newToolData,
											objectName: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Адрес</label>
								<input
									type="text"
									value={newToolData.shortAddress}
									onChange={(e) =>
										setNewToolData({
											...newToolData,
											shortAddress: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Дата прибытия</label>
								<input
									type="text"
									value={newToolData.arrivalDate}
									onChange={(e) =>
										setNewToolData({
											...newToolData,
											arrivalDate: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Статус</label>
								<input
									type="text"
									value={newToolData.callStatus}
									onChange={(e) =>
										setNewToolData({
											...newToolData,
											callStatus: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Добавить
						</button>
					</form>
				</div>
			</>
		);
	}

	function renderBuySection() {
		return (
			<>
				<div className="content-header">
					<h2>Закупки</h2>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Дата</th>
								<th>Дедлайн</th>
								<th>Статус</th>
								<th>Объект</th>
								<th>Адрес</th>
								<th>Что купить</th>
								<th>Плательщик</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{buyItems.length === 0 ? (
								<tr>
									<td colSpan="9" className="empty-state">
										Нет закупок
									</td>
								</tr>
							) : (
								buyItems.map((b) => (
									<tr key={b.id}>
										<td>{b.id}</td>
										<td>{b.requestDate}</td>
										<td>{b.deadline}</td>
										<td>{b.status}</td>
										<td>{b.objectName}</td>
										<td>{b.shortAddress}</td>
										<td>{b.whatToBuy}</td>
										<td>{b.payer}</td>
										<td>
											<button
												className="btn-icon btn-delete"
												onClick={() => handleDeleteBuy(b.id)}
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				<div className="add-form-section">
					<h3>
						<Plus size={20} />
						Новая закупка
					</h3>
					<form onSubmit={handleAddBuy} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>Дата</label>
								<input
									type="text"
									value={newBuyData.requestDate}
									onChange={(e) =>
										setNewBuyData({
											...newBuyData,
											requestDate: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Дедлайн</label>
								<input
									type="text"
									value={newBuyData.deadline}
									onChange={(e) =>
										setNewBuyData({ ...newBuyData, deadline: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>Статус</label>
								<input
									type="text"
									value={newBuyData.status}
									onChange={(e) =>
										setNewBuyData({ ...newBuyData, status: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>№ договора</label>
								<input
									type="text"
									value={newBuyData.contractNumber}
									onChange={(e) =>
										setNewBuyData({
											...newBuyData,
											contractNumber: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Объект</label>
								<input
									type="text"
									value={newBuyData.objectName}
									onChange={(e) =>
										setNewBuyData({ ...newBuyData, objectName: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>Адрес</label>
								<input
									type="text"
									value={newBuyData.shortAddress}
									onChange={(e) =>
										setNewBuyData({
											...newBuyData,
											shortAddress: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Плательщик</label>
								<input
									type="text"
									value={newBuyData.payer}
									onChange={(e) =>
										setNewBuyData({ ...newBuyData, payer: e.target.value })
									}
								/>
							</div>
							<div className="form-group form-group-full">
								<label>Что купить</label>
								<input
									type="text"
									value={newBuyData.whatToBuy}
									onChange={(e) =>
										setNewBuyData({ ...newBuyData, whatToBuy: e.target.value })
									}
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Добавить
						</button>
					</form>
				</div>
			</>
		);
	}

	function renderTransportSection() {
		return (
			<>
				<div className="content-header">
					<h2>Транспорт</h2>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Дата</th>
								<th>Кому</th>
								<th>Объект</th>
								<th>Адрес</th>
								<th>Что везти</th>
								<th>Инструменты</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{transportItems.length === 0 ? (
								<tr>
									<td colSpan="8" className="empty-state">
										Нет заявок
									</td>
								</tr>
							) : (
								transportItems.map((t) => (
									<tr key={t.id}>
										<td>{t.id}</td>
										<td>{t.requestDate}</td>
										<td>{t.assignedTo}</td>
										<td>{t.objectName}</td>
										<td>{t.shortAddress}</td>
										<td>{t.whatToTransport}</td>
										<td>{t.toolsList}</td>
										<td>
											<button
												className="btn-icon btn-delete"
												onClick={() => handleDeleteTransport(t.id)}
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				<div className="add-form-section">
					<h3>
						<Plus size={20} />
						Заявка на транспорт
					</h3>
					<form onSubmit={handleAddTransport} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>Дата</label>
								<input
									type="text"
									value={newTransportData.requestDate}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											requestDate: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Дедлайн</label>
								<input
									type="text"
									value={newTransportData.deadline}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											deadline: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Кому</label>
								<input
									type="text"
									value={newTransportData.assignedTo}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											assignedTo: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Объект</label>
								<input
									type="text"
									value={newTransportData.objectName}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											objectName: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Адрес</label>
								<input
									type="text"
									value={newTransportData.shortAddress}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											shortAddress: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Что везти</label>
								<input
									type="text"
									value={newTransportData.whatToTransport}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											whatToTransport: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group form-group-full">
								<label>Перечень инструмента</label>
								<input
									type="text"
									value={newTransportData.toolsList}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											toolsList: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Добавить
						</button>
					</form>
				</div>
			</>
		);
	}

	function renderInvoicesSection() {
		return (
			<>
				<div className="content-header">
					<h2>Счета</h2>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Дата</th>
								<th>№ договора</th>
								<th>Объект</th>
								<th>Адрес</th>
								<th>Плательщик</th>
								<th>Что</th>
								<th>Подтверждён</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{invoices.length === 0 ? (
								<tr>
									<td colSpan="9" className="empty-state">
										Нет счетов
									</td>
								</tr>
							) : (
								invoices.map((i) => (
									<tr key={i.id}>
										<td>{i.id}</td>
										<td>{i.requestDate}</td>
										<td>{i.contractNumber}</td>
										<td>{i.objectName}</td>
										<td>{i.shortAddress}</td>
										<td>{i.payer}</td>
										<td>{i.whatToBuy}</td>
										<td>{i.confirmed}</td>
										<td>
											<button
												className="btn-icon btn-delete"
												onClick={() => handleDeleteInvoice(i.id)}
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				<div className="add-form-section">
					<h3>
						<Plus size={20} />
						Новый счёт
					</h3>
					<form onSubmit={handleAddInvoice} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>Дата</label>
								<input
									type="text"
									value={newInvoiceData.requestDate}
									onChange={(e) =>
										setNewInvoiceData({
											...newInvoiceData,
											requestDate: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>№ договора</label>
								<input
									type="text"
									value={newInvoiceData.contractNumber}
									onChange={(e) =>
										setNewInvoiceData({
											...newInvoiceData,
											contractNumber: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Объект</label>
								<input
									type="text"
									value={newInvoiceData.objectName}
									onChange={(e) =>
										setNewInvoiceData({
											...newInvoiceData,
											objectName: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Адрес</label>
								<input
									type="text"
									value={newInvoiceData.shortAddress}
									onChange={(e) =>
										setNewInvoiceData({
											...newInvoiceData,
											shortAddress: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Плательщик</label>
								<input
									type="text"
									value={newInvoiceData.payer}
									onChange={(e) =>
										setNewInvoiceData({
											...newInvoiceData,
											payer: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Что</label>
								<input
									type="text"
									value={newInvoiceData.whatToBuy}
									onChange={(e) =>
										setNewInvoiceData({
											...newInvoiceData,
											whatToBuy: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Подтверждён</label>
								<input
									type="text"
									value={newInvoiceData.confirmed}
									onChange={(e) =>
										setNewInvoiceData({
											...newInvoiceData,
											confirmed: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Добавить
						</button>
					</form>
				</div>
			</>
		);
	}

	function renderTimeSection() {
		return (
			<>
				<div className="content-header">
					<h2>Учёт времени</h2>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Заказчик</th>
								<th>Подрядчик</th>
								<th>Договор</th>
								<th>Объект</th>
								<th>Адрес</th>
								<th>Системы</th>
								<th>Расчётное время (год)</th>
								<th>Факт. время (год)</th>
								<th>Разница</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{timeEntries.length === 0 ? (
								<tr>
									<td colSpan="11" className="empty-state">
										Нет записей
									</td>
								</tr>
							) : (
								timeEntries.map((t) => (
									<tr key={t.id}>
										<td>{t.id}</td>
										<td>{t.customer}</td>
										<td>{t.contractor}</td>
										<td>{t.contractNumber}</td>
										<td>{t.objectName}</td>
										<td>{t.shortAddress}</td>
										<td>{t.systems}</td>
										<td>{t.calculatedYearlyTime}</td>
										<td>{t.actualYearlyTime}</td>
										<td>{t.timeDifference}</td>
										<td>
											<button
												className="btn-icon btn-delete"
												onClick={() => handleDeleteTime(t.id)}
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				<div className="add-form-section">
					<h3>
						<Plus size={20} />
						Добавить запись времени
					</h3>
					<form onSubmit={handleAddTime} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>Заказчик</label>
								<input
									type="text"
									value={newTimeData.customer}
									onChange={(e) =>
										setNewTimeData({ ...newTimeData, customer: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>Подрядчик</label>
								<select
									value={newTimeData.contractor}
									onChange={(e) =>
										setNewTimeData({
											...newTimeData,
											contractor: e.target.value,
										})
									}
								>
									<option value="СБ">СБ</option>
									<option value="СБ+">СБ+</option>
									<option value="ВСТ">ВСТ</option>
								</select>
							</div>
							<div className="form-group">
								<label>№ договора</label>
								<input
									type="text"
									value={newTimeData.contractNumber}
									onChange={(e) =>
										setNewTimeData({
											...newTimeData,
											contractNumber: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Объект</label>
								<input
									type="text"
									value={newTimeData.objectName}
									onChange={(e) =>
										setNewTimeData({
											...newTimeData,
											objectName: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Адрес</label>
								<input
									type="text"
									value={newTimeData.shortAddress}
									onChange={(e) =>
										setNewTimeData({
											...newTimeData,
											shortAddress: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Арендатор</label>
								<input
									type="text"
									value={newTimeData.tenant}
									onChange={(e) =>
										setNewTimeData({ ...newTimeData, tenant: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>Системы</label>
								<input
									type="text"
									value={newTimeData.systems}
									onChange={(e) =>
										setNewTimeData({ ...newTimeData, systems: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>Расчётное время (год)</label>
								<input
									type="text"
									value={newTimeData.calculatedYearlyTime}
									onChange={(e) =>
										setNewTimeData({
											...newTimeData,
											calculatedYearlyTime: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Факт. время (год)</label>
								<input
									type="text"
									value={newTimeData.actualYearlyTime}
									onChange={(e) =>
										setNewTimeData({
											...newTimeData,
											actualYearlyTime: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Добавить
						</button>
					</form>
				</div>
			</>
		);
	}

	function renderActivationSection() {
		return (
			<>
				<div className="content-header">
					<h2>Актирование</h2>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Дата заявки</th>
								<th>Дата проведения</th>
								<th>Исполнитель</th>
								<th>Тип</th>
								<th>Объект</th>
								<th>Адрес</th>
								<th>Система</th>
								<th>Заявка</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{activations.length === 0 ? (
								<tr>
									<td colSpan="10" className="empty-state">
										Нет актов
									</td>
								</tr>
							) : (
								activations.map((a) => (
									<tr key={a.id}>
										<td>{a.id}</td>
										<td>{a.requestDate}</td>
										<td>{a.executionDate}</td>
										<td>{a.engineer}</td>
										<td>{a.requestType}</td>
										<td>{a.objectName}</td>
										<td>{a.shortAddress}</td>
										<td>{a.system}</td>
										<td>{a.request}</td>
										<td>
											<button
												className="btn-icon btn-delete"
												onClick={() => handleDeleteActivation(a.id)}
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				<div className="add-form-section">
					<h3>
						<Plus size={20} />
						Новый акт
					</h3>
					<form onSubmit={handleAddActivation} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>Дата заявки</label>
								<input
									type="text"
									value={newActivationData.requestDate}
									onChange={(e) =>
										setNewActivationData({
											...newActivationData,
											requestDate: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Дата проведения</label>
								<input
									type="text"
									value={newActivationData.executionDate}
									onChange={(e) =>
										setNewActivationData({
											...newActivationData,
											executionDate: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Исполнитель</label>
								<input
									type="text"
									value={newActivationData.engineer}
									onChange={(e) =>
										setNewActivationData({
											...newActivationData,
											engineer: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Тип заявки</label>
								<input
									type="text"
									value={newActivationData.requestType}
									onChange={(e) =>
										setNewActivationData({
											...newActivationData,
											requestType: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Объект</label>
								<input
									type="text"
									value={newActivationData.objectName}
									onChange={(e) =>
										setNewActivationData({
											...newActivationData,
											objectName: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Адрес</label>
								<input
									type="text"
									value={newActivationData.shortAddress}
									onChange={(e) =>
										setNewActivationData({
											...newActivationData,
											shortAddress: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Система</label>
								<input
									type="text"
									value={newActivationData.system}
									onChange={(e) =>
										setNewActivationData({
											...newActivationData,
											system: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group form-group-full">
								<label>Заявка</label>
								<input
									type="text"
									value={newActivationData.request}
									onChange={(e) =>
										setNewActivationData({
											...newActivationData,
											request: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Добавить
						</button>
					</form>
				</div>
			</>
		);
	}

		function renderCalendarEngineerSection() {
		return <EngineersCalendar />;
	}

	function renderCalendarObjectSection() {
		const headers = calendarObject[0] ? Object.keys(calendarObject[0]) : [];
		return (
			<>
				<div className="content-header">
					<h2>Календарь объект</h2>
				</div>
				<div className="table-container" style={{ overflowX: "auto" }}>
					<table className="data-table">
						<thead>
							<tr>
								{headers.map((h, i) => (
									<th key={i}>{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{calendarObject.length === 0 ? (
								<tr>
									<td colSpan={headers.length} className="empty-state">
										Нет данных
									</td>
								</tr>
							) : (
								calendarObject.map((row, i) => (
									<tr key={i}>
										{headers.map((h, j) => (
											<td key={j}>{row[h]}</td>
										))}
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</>
		);
	}

	function renderSummarySection() {
		const headers = summary[0] ? Object.keys(summary[0]) : [];
		return (
			<>
				<div className="content-header">
					<h2>Сводная</h2>
				</div>
				<div className="table-container" style={{ overflowX: "auto" }}>
					<table className="data-table">
						<thead>
							<tr>
								{headers.map((h, i) => (
									<th key={i}>{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{summary.length === 0 ? (
								<tr>
									<td colSpan={headers.length} className="empty-state">
										Нет данных
									</td>
								</tr>
							) : (
								summary.map((row, i) => (
									<tr key={i}>
										{headers.map((h, j) => (
											<td key={j}>{String(row[h] || "").substring(0, 50)}</td>
										))}
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</>
		);
	}

	function renderWishesSection() {
		return (
			<>
				<div className="content-header">
					<h2>Пожелания</h2>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Пожелание</th>
								<th>Описание</th>
							</tr>
						</thead>
						<tbody>
							{wishes.length === 0 ? (
								<tr>
									<td colSpan="3" className="empty-state">
										Нет пожеланий
									</td>
								</tr>
							) : (
								wishes.map((w) => (
									<tr key={w.id}>
										<td>{w.id}</td>
										<td>{w.wish}</td>
										<td>{w.description}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</>
		);
	}

	function renderContactsSection() {
		const filteredContacts = contacts.filter((c) => {
			if (contactFilter === "all") return true;
			if (contactFilter === "object") return c.source === "object";
			if (contactFilter === "manual") return c.source === "manual";
			return true;
		});

		return (
			<>
				<div className="content-header">
					<div className="search-box">
						<Search size={20} />
						<input
							type="text"
							placeholder="Поиск по имени, телефону, объекту..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						{searchQuery && (
							<button className="clear-search" onClick={() => setSearchQuery("")}>
								<X size={16} />
							</button>
						)}
					</div>
					<div className="filter-tabs">
						<button className={`filter-tab ${contactFilter === "all" ? "active" : ""}`} onClick={() => setContactFilter("all")}>Все</button>
						<button className={`filter-tab ${contactFilter === "object" ? "active" : ""}`} onClick={() => setContactFilter("object")}>Из объектов</button>
						<button className={`filter-tab ${contactFilter === "manual" ? "active" : ""}`} onClick={() => setContactFilter("manual")}>Добавленные</button>
					</div>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Имя</th>
								<th>Телефон</th>
								<th>Объект</th>
								<th>Адрес</th>
								<th>Источник</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{filteredContacts.length === 0 ? (
								<tr><td colSpan="7" className="empty-state">Нет контактов</td></tr>
							) : filteredContacts.map((contact) => (
								<tr key={contact.id}>
									<td>{contact.id}</td>
									<td><strong>{contact.name}</strong></td>
									<td><a href={`tel:${contact.phone}`}>{contact.phone}</a></td>
									<td>{contact.objectName}</td>
									<td>{contact.shortAddress}</td>
									<td>
										<span className={`badge ${contact.source === "object" ? "badge-type" : "badge-payment"}`}>
											{contact.source === "object" ? "Из объекта" : "Добавлен"}
										</span>
									</td>
									<td>
										<button className="btn-icon btn-edit" onClick={() => handleEditContact(contact)} title="Редактировать">
											<Edit2 size={16} />
										</button>
										{contact.source === "manual" && (
										<button className="btn-icon btn-delete" onClick={() => handleDeleteContact(contact.id)} title="Удалить">
												<Trash2 size={16} />
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="add-form-section">
					<h3><Plus size={20} />Добавить контакт</h3>
					<form onSubmit={handleAddContact} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>Имя контакта *</label>
								<input
									type="text"
									value={newContactData.name}
									onChange={(e) => setNewContactData({ ...newContactData, name: e.target.value })}
									placeholder="Иванов Иван Иванович"
								/>
							</div>
							<div className="form-group">
								<label>Телефон</label>
								<input
									type="tel"
									value={newContactData.phone}
									onChange={(e) => setNewContactData({ ...newContactData, phone: e.target.value })}
									placeholder="+7 (999) 123-45-67"
								/>
							</div>
							<div className="form-group">
								<label>Объект</label>
								<input
									type="text"
									value={newContactData.objectName}
									onChange={(e) => setNewContactData({ ...newContactData, objectName: e.target.value })}
									placeholder="Выберите или введите объект"
									list="objects-list"
								/>
								<datalist id="objects-list">
									{objects.map((obj) => (
										<option key={obj.id} value={obj["Наименование объекта"]} />
									))}
								</datalist>
							</div>
							<div className="form-group">
								<label>Короткий адрес</label>
								<input
									type="text"
									value={newContactData.shortAddress}
									onChange={(e) => setNewContactData({ ...newContactData, shortAddress: e.target.value })}
									placeholder="Примерная, 1"
								/>
							</div>
							<div className="form-group">
								<label>Email</label>
								<input
									type="email"
									value={newContactData.email}
									onChange={(e) => setNewContactData({ ...newContactData, email: e.target.value })}
								/>
							</div>
							<div className="form-group">
								<label>Должность</label>
								<input
									type="text"
									value={newContactData.position}
									onChange={(e) => setNewContactData({ ...newContactData, position: e.target.value })}
								/>
							</div>
							<div className="form-group form-group-full">
								<label>Заметки</label>
								<textarea
									value={newContactData.notes}
									onChange={(e) => setNewContactData({ ...newContactData, notes: e.target.value })}
									rows={2}
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />Добавить контакт
						</button>
					</form>
				</div>
			</>
		);
	}

	function renderExtraSection() {
		const headers = INITIAL_EXTRA[0] ? Object.keys(INITIAL_EXTRA[0]) : [];
		return (
			<>
				<div className="content-header">
					<h2>Дополнительные данные (Артём)</h2>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								{headers.map((h, i) => (
									<th key={i}>{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{extra.map((row, i) => (
								<tr key={i}>
									{headers.map((h, j) => (
										<td key={j}>{row[h]}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</>
		);
	}

	function renderPlaceholderSection() {
		const IconComponent = SECTION_ICONS[activeTab] || FileText;
		const label = SECTION_LABELS[activeTab] || activeTab;
		return (
			<div className="placeholder-section">
				<div className="placeholder-icon">
					<IconComponent size={64} />
				</div>
				<h2>{label}</h2>
				<p>Этот раздел находится в разработке</p>
			</div>
		);
	}

	// === ОСНОВНОЙ РЕНДЕР ===
	return (
		<div className="app">
			<header className="header">
				<div className="header-left">
					<button
						className="mobile-menu-btn"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
					<div className="logo">
						<Building2 size={28} />
						<span>База CRM</span>
					</div>
				</div>
				<div className="header-right">
					<div className="objects-count">
						Объектов: <strong>{objects.length}</strong>
					</div>
					<button
						className="btn btn-secondary"
						onClick={handleExport}
						disabled={isExporting}
					>
						{isExporting ? (
							<span className="loading-spinner small"></span>
						) : (
							<>
								<Download size={18} />
								Экспорт
							</>
						)}
					</button>
					<button className="btn btn-outline" onClick={handleLogout}>
						<LogOut size={18} />
						Выйти
					</button>
					<button className="btn btn-danger-outline" onClick={() => {
						if (window.confirm('Вы уверены? Все данные будут удалены!')) {
							localStorage.clear();
							window.location.reload();
						}
					}}>
						Сброс данных
					</button>
				</div>
			</header>
			<div className="main-layout">
				<aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
					<nav className="sidebar-nav">
						{MENU_ITEMS.map((item) => (
							<button
								key={item.id}
								className={`nav-item ${activeTab === item.id ? "active" : ""}`}
								onClick={() => {
									setActiveTab(item.id);
									setIsMobileMenuOpen(false);
								}}
							>
								<item.icon size={20} />
								<span>{item.label}</span>
							</button>
						))}
					</nav>
				</aside>
				<main className="content">{renderSection()}</main>
			</div>

			{/* МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ ОБЪЕКТА */}
			{isEditModalOpen && editingObject && (
				<div
					className="modal-overlay"
					onClick={() => setIsEditModalOpen(false)}
				>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h2>Редактирование объекта</h2>
							<button
								className="modal-close"
								onClick={() => setIsEditModalOpen(false)}
							>
								<X size={24} />
							</button>
						</div>
						<form onSubmit={handleSaveEdit} className="modal-body">
							<div className="form-grid">
								{Object.keys(editingObject)
									.filter((k) => k !== "id")
									.map((key) => (
										<div key={key} className="form-group">
											<label>{key}</label>
											<input
												type="text"
												value={editingObject[key] || ""}
												onChange={(e) =>
													setEditingObject({
														...editingObject,
														[key]: e.target.value,
													})
												}
											/>
										</div>
									))}
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => setIsEditModalOpen(false)}
								>
									Отмена
								</button>
								<button type="submit" className="btn btn-primary">
									Сохранить
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ КОНТАКТА */}
			{isContactModalOpen && editingContact && (
				<div className="modal-overlay" onClick={() => setIsContactModalOpen(false)}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h2>Редактирование контакта</h2>
							<button className="modal-close" onClick={() => setIsContactModalOpen(false)}>
								<X size={24} />
							</button>
						</div>
						<form onSubmit={handleSaveContact} className="modal-body">
							<div className="form-grid">
								<div className="form-group">
									<label>Имя контакта *</label>
									<input type="text" value={editingContact.name || ""} onChange={(e) => handleContactChange("name", e.target.value)} required />
								</div>
								<div className="form-group">
									<label>Телефон</label>
									<input type="tel" value={editingContact.phone || ""} onChange={(e) => handleContactChange("phone", e.target.value)} />
								</div>
								<div className="form-group">
									<label>Объект</label>
									<input type="text" value={editingContact.objectName || ""} onChange={(e) => handleContactChange("objectName", e.target.value)} list="objects-list-edit" />
									<datalist id="objects-list-edit">
										{objects.map((obj) => (
											<option key={obj.id} value={obj["Наименование объекта"]} />
										))}
									</datalist>
								</div>
								<div className="form-group">
									<label>Короткий адрес</label>
									<input type="text" value={editingContact.shortAddress || ""} onChange={(e) => handleContactChange("shortAddress", e.target.value)} />
								</div>
								<div className="form-group">
									<label>Email</label>
									<input type="email" value={editingContact.email || ""} onChange={(e) => handleContactChange("email", e.target.value)} />
								</div>
								<div className="form-group">
									<label>Должность</label>
									<input type="text" value={editingContact.position || ""} onChange={(e) => handleContactChange("position", e.target.value)} />
								</div>
								<div className="form-group form-group-full">
									<label>Заметки</label>
									<textarea value={editingContact.notes || ""} onChange={(e) => handleContactChange("notes", e.target.value)} rows={3} />
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" onClick={() => setIsContactModalOpen(false)}>Отмена</button>
								<button type="submit" className="btn btn-primary">Сохранить</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ ВЫЗОВА */}
			{isCallModalOpen && editingCall && (
				<div
					className="modal-overlay"
					onClick={() => setIsCallModalOpen(false)}
				>
					<div
						className="modal modal-call"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="modal-header">
							<h2>Редактирование вызова</h2>
							<button
								className="modal-close"
								onClick={() => setIsCallModalOpen(false)}
							>
								<X size={24} />
							</button>
						</div>
						<form onSubmit={handleSaveCall} className="modal-body">
							<div className="form-grid">
								{Object.keys(editingCall)
									.filter((k) => k !== "id" && k !== "createdAt")
									.map((key) => (
										<div key={key} className="form-group">
											<label>{key}</label>
											<input
												type="text"
												value={editingCall[key] || ""}
												onChange={(e) =>
													setEditingCall({
														...editingCall,
														[key]: e.target.value,
													})
												}
											/>
										</div>
									))}
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => setIsCallModalOpen(false)}
								>
									Отмена
								</button>
								<button type="submit" className="btn btn-primary">
									Сохранить
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
