import { useState, useEffect, useRef } from "react";

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
	AlertCircle,
	Check,
	ShoppingCart,
	CreditCard,
	Briefcase,
	Target,
	UserCheck,
	Zap,
	ChevronDown,
	UserCog,
	Folder,
	FolderPlus,
	File,
	Upload,
	Trash,
	ArrowLeft,
} from "lucide-react";
import { authApi, hasAccess } from "./api/auth";
import UsersPanel from "./components/UsersPanel";
import "./App.css";
import EngineersCalendar from "./components/EngineersCalendar";
import CallsForm from "./components/CallsForm";

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
	users: UserCog,
	rd: Folder,
};

// === МАППИНГ НАЗВАНИЙ ===
const SECTION_LABELS = {
	objects: "Объекты",
	costs: "Затраты",
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
	users: "Пользователи",
	rd: "РД",
};

// === ВСЕ РАЗДЕЛЫ ===
const ALL_SECTIONS = [
	{ id: "objects", name: "Объекты", icon: "objects" },
	{ id: "calls", name: "Вызовы", icon: "calls" },
	{ id: "contacts", name: "Контакты", icon: "contacts" },
	{ id: "staff", name: "Персонал", icon: "staff" },
	{ id: "systems", name: "Системы", icon: "systems" },
	{ id: "tools", name: "Инструменты", icon: "tools" },
	{ id: "activation", name: "Актирование", icon: "activation" },
	{ id: "costs", name: "Расходы", icon: "costs" },
	{ id: "buy", name: "Закупки", icon: "buy" },
	{ id: "invoices", name: "Счета", icon: "invoices" },
	{ id: "transport", name: "Транспорт", icon: "transport" },
	{ id: "time", name: "Время", icon: "time" },
	{ id: "wishes", name: "Пожелания", icon: "wishes" },
	{ id: "users", name: "Пользователи", icon: "users" },
	{ id: "rd", name: "РД", icon: "rd" },
];

// === ДАННЫЕ ОБЪЕКТОВ (загружаются из Excel) ===
// Пустая заглушка - данные загружаются через useEffect
const INITIAL_OBJECTS = [];

// excelData будет загружен через fetch, но для INITIAL_* нужна заглушка
const excelData = {};

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
		objectId: row["objectId"] || null,
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
	})) || [];

// === ДАННЫЕ СИСТЕМ (из Excel) ===
const INITIAL_SYSTEMS =
	excelData["(Д) системы"]?.rows?.map((row, idx) => {
		const matchedObj = INITIAL_OBJECTS.find(
			(o) => o["Наименование объекта"] === row["Наименование объекта"],
		);
		return {
			id: idx + 1,
			objectId: matchedObj?.id || null,
			parentObject: row["Наименование объекта"] || "",
			systemType: row["дочерняя вкладка к объекту"] || "",
			brand: row["бренд"] || "",
			systemKind: row["тип"] || "",
			quantity: row["кол во"] || "",
		};
	}) || [];

// === ДАННЫЕ ПЕРСОНАЛА ===
const INITIAL_STAFF = [
	{
		id: 1,
		fullName: "Иванов Иван Иванович",
		position: "Главный инженер",
		category: "engineer",
		location: "Офис Москва",
		phone: "+7 (999) 123-45-67",
		email: "ivanov@company.ru",
		description: "Опыт работы 10 лет, сертификаты по АПС и СОУЭ",
		photo: "",
	},
	{
		id: 2,
		fullName: "Петров Пётр Петрович",
		position: "Инженер",
		category: "engineer",
		location: "Офис СПб",
		phone: "+7 (999) 234-56-78",
		email: "petrov@company.ru",
		description: "Специалист по видеонаблюдению",
		photo: "",
	},
	{
		id: 3,
		fullName: "Сидоров Алексей Сергеевич",
		position: "Старший инженер",
		category: "engineer",
		location: "Офис Екатеринбург",
		phone: "+7 (999) 345-67-89",
		email: "sidorov@company.ru",
		description: "Монтаж и наладка систем безопасности",
		photo: "",
	},
	{
		id: 4,
		fullName: "Козлова Мария Олеговна",
		position: "Инженер",
		category: "engineer",
		location: "Офис Новосибирск",
		phone: "+7 (999) 456-78-90",
		email: "kozlova@company.ru",
		description: "Обслуживание СКУД",
		photo: "",
	},
	{
		id: 5,
		fullName: "Смирнов Дмитрий Андреевич",
		position: "Техник",
		category: "engineer",
		location: "Офис Москва",
		phone: "+7 (999) 567-89-01",
		email: "smirnov@company.ru",
		description: "Выездной специалист",
		photo: "",
	},
	{
		id: 6,
		fullName: "Новикова Елена Викторовна",
		position: "Менеджер проектов",
		category: "engineer",
		location: "Офис Москва",
		phone: "+7 (999) 678-90-12",
		email: "novikova@company.ru",
		description: "Координация работ",
		photo: "",
	},
	{
		id: 7,
		fullName: "Волков Сергей Михайлович",
		position: "Водитель",
		category: "driver",
		location: "Офис Москва",
		phone: "+7 (999) 789-01-23",
		email: "volkov@company.ru",
		description: "Водитель-экспедитор",
		photo: "",
	},
	{
		id: 8,
		fullName: "Морозов Андрей Викторович",
		position: "Водитель",
		category: "driver",
		location: "Офис СПб",
		phone: "+7 (999) 890-12-34",
		email: "morozov@company.ru",
		description: "Водитель-экспедитор",
		photo: "",
	},
	{
		id: 9,
		fullName: "Павлова Ольга Николаевна",
		position: "Курьер",
		category: "courier",
		location: "Офис Москва",
		phone: "+7 (999) 901-23-45",
		email: "pavlova@company.ru",
		description: "Курьер доставки",
		photo: "",
	},
];

// Категории персонажа для сортировки
const STAFF_CATEGORIES = { driver: 1, courier: 2, engineer: 3 };

// === СТАТУСЫ ЗАКУПКИ ===
const BUY_STATUS = {
	ORDERED: "заказан_счёт",
	WAITING_CONFIRM: "счёт_ждёт_подтверждения",
	CAN_PAY: "счёт_можно_оплатить",
	PAID: "счёт_оплачен",
	WAREHOUSE: "заказ_на_складе",
	OFFICE: "заказ_в_офисе",
};

const BUY_STATUS_LABELS = {
	[BUY_STATUS.ORDERED]: "Заказан счёт",
	[BUY_STATUS.WAITING_CONFIRM]: "Счёт ждёт подтверждения на оплату",
	[BUY_STATUS.CAN_PAY]: "Счёт можно оплачивать",
	[BUY_STATUS.PAID]: "Счёт оплачен",
	[BUY_STATUS.WAREHOUSE]: "Заказ на складе",
	[BUY_STATUS.OFFICE]: "Заказ в офисе",
};

// Текущий пользователь (заглушка - можно заменить на реальный логин)
const CURRENT_USER = "Текущий пользователь";

// === ДАННЫЕ ЗАТРАТ (из Excel) ===
const INITIAL_COSTS = excelData["Затраты"]?.rows?.map((row, idx) => {
	const matchedObj = INITIAL_OBJECTS.find(
		(o) => o["Наименование объекта"] === row["Наименование объекта"],
	);
	return {
		id: idx + 1,
		objectId: matchedObj?.id || null,
		objectName: row["Наименование объекта"] || "",
		shortAddress:
			row["сокращенный адрес"] || matchedObj?.["Адрес сокращенный"] || "",
		system: row["Система"] || "",
		employee: row["Сотрудник"] || "",
		amount: row["Сумма"] || "",
		comment: row["Коментарий (что и зачем)"] || "",
		receiptPhoto: row["Фото чека"] || "",
	};
}) || [
	{
		id: 1,
		objectId: 1,
		objectName: "ТЦ Мега",
		shortAddress: "Тверская, 15",
		system: "АПС",
		employee: "Иванов Иван Иванович",
		amount: "15 000",
		reason: "Замена датчика",
		description: "Вышел из строя дымовой датчик",
		photo: "",
		comment: "",
	},
	{
		id: 2,
		objectId: 2,
		objectName: "БЦ Невский",
		shortAddress: "Невский, 100",
		system: "ВИДЕОНАБЛЮДЕНИЕ",
		employee: "Петров Пётр Петрович",
		amount: "8 500",
		reason: "Ремонт камеры",
		description: "Замена блока питания камеры видеонаблюдения",
		photo: "",
		comment: "",
	},
	{
		id: 3,
		objectId: 3,
		objectName: "ТРЦ Галерея",
		shortAddress: "Ленина, 50",
		system: "СОУЭ",
		employee: "Сидоров Алексей Сергеевич",
		amount: "25 000",
		reason: "Модернизация",
		description: "Установка дополнительных оповещателей",
		photo: "",
		comment: "Срочный заказ",
	},
	{
		id: 4,
		objectId: 4,
		objectName: "Супермаркет Ромашка",
		shortAddress: "Красная, 25",
		system: "ОПС",
		employee: "Козлова Мария Олеговна",
		amount: "5 000",
		reason: "Обслуживание",
		description: "Плановое ТО охранной сигнализации",
		photo: "",
		comment: "",
	},
	{
		id: 5,
		objectId: 5,
		objectName: "Штаб-квартира Газпром",
		shortAddress: "Пресненская, 12",
		system: "СКУД",
		employee: "Смирнов Дмитрий Андреевич",
		amount: "45 000",
		reason: "Замена замка",
		description: "Вы自强不息自强不息 replacement of magnetic lock",
		photo: "",
		comment: "VIP клиент",
	},
];

// === ДАННЫЕ ИНСТРУМЕНТА (из Excel) ===
const INITIAL_TOOLS =
	excelData["Инструмент"]?.rows?.map((row, idx) => {
		const objName = row["Фактический"] || row["Наименование объекта"] || "";
		const matchedObj = INITIAL_OBJECTS.find(
			(o) => o["Наименование объекта"] === objName,
		);
		return {
			id: idx + 1,
			objectId: matchedObj?.id || null,
			tool: row["Инструмент"] || "",
			inventoryNumber: row["инв. номер"] || "",
			brand: row["марка"] || "",
			objectName: objName,
			shortAddress:
				row["сокращенный адрес"] || matchedObj?.["Адрес сокращенный"] || "",
			arrivalDate: row["дата прибытия"] || "",
			callStatus: row["Статус вызова"] || "",
			transportRequest: row["подтвердить выбор "] || "",
			targetAddress: row["Целевой"] || "",
			// Новые поля для связи с транспортом
			transportRequestId: null, // ID заявки на транспорт
			factObjectName: "", // Фактический объект
			factShortAddress: "", // Фактический адрес
			isConfirmed: false, // Подтвержден ли выбор
		};
	}) || [];

// === ДАННЫЕ АКТИРОВАНИЯ (из Excel) ===
const INITIAL_ACTIVATIONS =
	excelData["Актирование"]?.rows?.map((row, idx) => {
		const matchedObj = INITIAL_OBJECTS.find(
			(o) => o["Наименование объекта"] === row["Наименование объекта"],
		);
		return {
			id: idx + 1,
			objectId: matchedObj?.id || null,
			requestDate: row["дата заявки"] || "",
			executionDate: row["Дата проведения"] || "",
			engineer: row["Исполнитель"] || "",
			requestType: row["тип заявки"] || "",
			objectName: row["Наименование объекта"] || "",
			shortAddress:
				row["сокращенный адрес"] || matchedObj?.["Адрес сокращенный"] || "",
			system: row["Система"] || "",
			request: row["Заявка"] || "",
			toPurchase: row["Приобрести для выполнения"] || "",
			customerContact: row["Кто обратился с заявкой от заказчика"] || "",
			creator: row["создатель заявки"] || "",
		};
	}) || [];

// === ДАННЫЕ КУПИТЬ (из Excel) ===
const INITIAL_BUY =
	excelData["Купить"]?.rows?.map((row, idx) => {
		const objName = row["Наименование\nобъекта"] || "";
		const matchedObj = INITIAL_OBJECTS.find(
			(o) => o["Наименование объекта"] === objName,
		);
		return {
			id: idx + 1,
			objectId: matchedObj?.id || null,
			requestDate: row["дата заявки"] || "",
			deadline: row["Дедлайн"] || "",
			status: row["статус заявки"] || "",
			contractNumber: row["№ контр/дог"] || "",
			objectName: objName,
			shortAddress:
				row["сокращенный адрес"] || matchedObj?.["Адрес сокращенный"] || "",
			payer: row["Кто оплачивает"] || "",
			whatToBuy: row["Что нужно приобрести"] || "",
			creator: row["создатель заявки"] || "",
		};
	}) || [];

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
		thisStatus: (row["статус этой заявки"] || "new").toString(),
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
				shortAddress:
					obj["Адрес сокращенный"] || obj["Адрес полный объекта"] || "",
				source: "object",
				objectId: obj.id,
			});
		}
	});
	return contacts;
}

const INITIAL_CONTACTS = extractContactsFromObjects(INITIAL_OBJECTS);

function App() {
	console.log("App rendering...");
	// --- СТЕЙТЫ АВТОРИЗАЦИИ ---
	const [isAuthenticated, setIsAuthenticated] = useState(
		() => localStorage.getItem("authToken") !== null,
	);
	const [authToken, setAuthToken] = useState(
		() => localStorage.getItem("authToken") || null,
	);
	const [currentUser, setCurrentUser] = useState(null);
	const [authUsername, setAuthUsername] = useState("");
	const [authPassword, setAuthPassword] = useState("");
	const [authError, setAuthError] = useState("");
	const [isAuthLoading, setIsAuthLoading] = useState(false);

	// --- ОСНОВНЫЕ СТЕЙТЫ ---
	const [activeTab, setActiveTab] = useState("objects");
	const [searchQuery, setSearchQuery] = useState("");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isExporting, setIsExporting] = useState(false);
	const [rdFolderCount, setRDFolderCount] = useState(0);

	// --- СТЕЙТЫ ОБЪЕКТОВ ---
	const [objects, setObjects] = useState(() => {
		const saved = localStorage.getItem("baza_objects");
		if (saved) {
			try {
				return JSON.parse(saved);
			} catch {}
		}
		return [];
	});
	const [isLoading, setIsLoading] = useState(true);
	const [initialObjectsLoaded, setInitialObjectsLoaded] = useState(false);
	const [newFormData, setNewFormData] = useState(getEmptyObjectForm());

	// Обёртка над setObjects — сохраняет в localStorage
	const saveObjects = (newObjects) => {
		setObjects(newObjects);
		try {
			localStorage.setItem("baza_objects", JSON.stringify(newObjects));
		} catch (err) {
			console.warn("baza_objects save error:", err);
		}
	};
	const [editingObject, setEditingObject] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isAddFormOpen, setIsAddFormOpen] = useState(false);

	// Загрузка объектов из Excel или из localStorage
	useEffect(() => {
		// Если уже загружали — не перезаписываем из Excel
		const saved = localStorage.getItem("baza_objects");
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (parsed.length > 0) {
					setObjects(parsed);
					setInitialObjectsLoaded(true);
					setIsLoading(false);
					return;
				}
			} catch (err) {
				console.warn("baza_objects parse error:", err);
			}
		}
		// Фоллбэк на Excel
		fetch("/excel_data.json")
			.then((r) => r.json())
			.then((data) => {
				const rows = data["Объекты"]?.rows || [];
				const parsed = rows
					.filter(
						(row) =>
							row["Наименование объекта"] &&
							row["Наименование объекта"] !== "Наименование объекта",
					)
					.map((row, idx) => ({
						id: idx + 1,
						objectNumber: idx + 1,
						"№": row["№"] || "",
						Заказчик: row["Заказчик"] || "",
						Подрядчик: row["Подрядчик"] || "",
						"№ контр/дог": row["№ контр/дог"] || "",
						"Начало действия договора": row["Начало действия договора"] || "",
						"Окончание действия договора":
							row["Окончание действия договора"] || "",
						"Тип договора": row["Тип договора"] || "",
						Продлеваемость: row["Продлеваемость"] || "",
						"Письмо о повышении стоимости ТО":
							row["Письмо о повышении стоимость ТО"] || "",
						"Свершившееся повышение цены ТО":
							row["Свершившееся повышение цены ТО"] || "",
						"Доп соглашение": row["Доп соглашени"] || "",
						Письма: row["Письма"] || "",
						"Кто оплачивает ремонт": row["Кто оплачивает ремонт"] || "",
						"Как оплачиваются доп.работы":
							row["Как оплачиваются доп.работы"] || "",
						"К доп работам есть ли аванс":
							row["К доп работам есть ли аванс"] || "",
						"Адрес полный объекта": row["Адрес полный объекта"] || "",
						"Адрес сокращенный": row["Адрес сокращенный"] || "",
						"Наименование объекта": row["Наименование объекта"] || "",
						"РД ИД ПД": row["РД ИД ПД"] || "",
						Арендатор: row["Арендатор"] || "",
						Системы: row["Системы"] || "",
						"Расчетное время на обслуживание":
							row["Расчетное время на обслуживание"] || "",
						Контакты: row["Контакты"] || "",
						Заметки: row["Заметки"] || "",
						"Инструмент на объекте": row["Инструмент на объекте"] || "",
					}));
				if (parsed.length > 0) {
					localStorage.setItem("baza_objects", JSON.stringify(parsed));
				}
				setObjects(parsed);
				setInitialObjectsLoaded(true);
				setIsLoading(false);
			})
			.catch((err) => {
				console.error("Ошибка загрузки данных:", err);
				setInitialObjectsLoaded(true);
				setIsLoading(false);
			});
	}, []);

	// --- СТЕЙТЫ ВЫЗОВОВ ---
	const [calls, setCalls] = useState(() => {
		const saved = localStorage.getItem("demo_calls");
		return saved ? JSON.parse(saved) : INITIAL_CALLS;
	});
	const [newCallData, setNewCallData] = useState(getEmptyCallForm());
	const [editingCall, setEditingCall] = useState(null);
	const [isCallModalOpen, setIsCallModalOpen] = useState(false);
	const [callFilter, setCallFilter] = useState("all");

	// --- СТЕЙТЫ СИСТЕМ ---
	const [systems, setSystems] = useState(() => {
		const saved = localStorage.getItem("demo_systems");
		return saved ? JSON.parse(saved) : INITIAL_SYSTEMS;
	});
	const [newSystemData, setNewSystemData] = useState(getEmptySystemForm());

	// --- СТЕЙТЫ ПЕРСОНАЛА ---
	const [staff, setStaff] = useState(() => {
		const saved = localStorage.getItem("demo_staff");
		return saved ? JSON.parse(saved) : INITIAL_STAFF;
	});
	const [newStaffData, setNewStaffData] = useState({
		fullName: "",
		position: "",
		location: "",
		phone: "",
		email: "",
		description: "",
		photo: "",
	});

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
	const [editingTool, setEditingTool] = useState(null); // Инструмент для редактирования в модалке
	const [isToolModalOpen, setIsToolModalOpen] = useState(false); // Открыта ли модалка

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
	const [editingTransport, setEditingTransport] = useState(null);
	const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);

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

	// States для систем времени
	const [customTimeSystems, setCustomTimeSystems] = useState(() => {
		const saved = localStorage.getItem("demo_custom_time_systems");
		return saved ? JSON.parse(saved) : [];
	});
	const [isTimeSystemModalOpen, setIsTimeSystemModalOpen] = useState(false);
	const [newTimeSystemData, setNewTimeSystemData] = useState({
		systemName: "",
		systemType: "",
		quantity: "",
		objectName: "",
	});

	// Арендаторы для крупных объектов
	const LARGE_OBJECT_TENANTS = {
		"НПО экран": ["Арендатор 1", "Арендатор 2", "Арендатор 3"],
		Большевичка: ["Арендатор А", "Арендатор Б", "Арендатор В", "Арендатор Г"],
	};

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

	// --- СТЕЙТЫ ВЫБОРА ИНСТРУМЕНТА ---
	const [selectedToolIds, setSelectedToolIds] = useState([]);

	// --- СТЕЙТЫ ВЫБОРА ИНСТРУМЕНТА ДЛЯ ВЫЗОВА ---
	const [selectedToolsForNewCall, setSelectedToolsForNewCall] = useState([]);
	const [isToolPickerOpen, setIsToolPickerOpen] = useState(false);

	// --- СТЕЙТЫ МОДАЛЬНОГО ОКНА ВЫБОРА СИСТЕМ ---
	const [isSystemPickerOpen, setIsSystemPickerOpen] = useState(false);
	const [systemPickerObject, setSystemPickerObject] = useState(null);
	const [systemPickerSearch, setSystemPickerSearch] = useState("");
	const [selectedSystemsForObject, setSelectedSystemsForObject] = useState([]);

	// --- СТЕЙТЫ ФИЛЬТРОВ ОБЪЕКТОВ ---
	const [objectFilters, setObjectFilters] = useState({
		type: "", // Тип договора
		contractor: "", // Подрядчик
		extendable: "", // Продлеваемость
		hasTool: "", // Инструмент на объекте
	});

	// --- СТЕЙТЫ ФИЛЬТРОВ ДЛЯ ДРУГИХ РАЗДЕЛОВ ---
	const [callDateFilter, setCallDateFilter] = useState({
		from: "",
		to: "",
	});
	const [costDateFilter, setCostDateFilter] = useState({
		from: "",
		to: "",
	});
	const [transportDateFilter, setTransportDateFilter] = useState({
		from: "",
		to: "",
	});
	const [activationDateFilter, setActivationDateFilter] = useState({
		from: "",
		to: "",
	});

	// Все доступные типы систем
	const ALL_SYSTEM_TYPES = [
		"АПС",
		"СОУЭ",
		"ВПВ",
		"АПТ",
		"ОПС",
		"ВИДЕОНАБЛЮДЕНИЕ",
		"СКУД",
		"Охрана периметра",
		"Дымоудаление",
		"Пожарная автоматика",
	];

	// --- СПИСОК РАЗДЕЛОВ ---
	const getMenuItems = () => {
		// Показываем все разделы — фильтр по доступу убран,
		// т.к. авторизация optional для просмотра объектов
		return ALL_SECTIONS.map((item) => ({
			...item,
			label: item.name,
			icon: SECTION_ICONS[item.icon] || FileText,
		}));
	};
	const MENU_ITEMS = getMenuItems();

	// Счётчик папок РД в сайдбаре
	useEffect(() => {
		const fetchCount = async () => {
			try {
				const res = await fetch("http://37.252.17.205:3001/api/rd/folders");
				if (res.ok) {
					const data = await res.json();
					setRDFolderCount(Array.isArray(data) ? data.length : 0);
				}
			} catch {}
		};
		fetchCount();
	}, []);

	useEffect(() => {
		localStorage.setItem("demo_calls", JSON.stringify(calls));
	}, [calls]);
	useEffect(() => {
		// Сохраняем только если есть данные
		if (objects.length > 0) {
			localStorage.setItem("demo_objects_v2", JSON.stringify(objects));
		}
	}, [objects]);
	useEffect(() => {
		localStorage.setItem("demo_staff", JSON.stringify(staff));
	}, [staff]);
	useEffect(() => {
		localStorage.setItem("demo_costs", JSON.stringify(costs));
	}, [costs]);
	useEffect(() => {
		localStorage.setItem("demo_systems", JSON.stringify(systems));
	}, [systems]);

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
		localStorage.setItem("demo_contacts", JSON.stringify(contacts));
	}, [contacts]);

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
			createdAt: new Date().toISOString().split("T")[0],
			deadline: "",
			executionDate: "",
			engineer: "",
			assistant: "",
			status: "new",
			type: "",
			objectId: null,
			objectName: "",
			shortAddress: "",
			tenant: "",
			system: "",
			request: "",
			ourTool: "",
			toPurchase: "",
			toRepair: "",
			activation: "",
			dataOwner: "",
			customerContact: "",
			creator: "",
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
			reason: "",
			description: "",
			photo: "",
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
			requestDate: new Date().toLocaleDateString("ru-RU"),
			deadline: "",
			status: BUY_STATUS.ORDERED,
			contractNumber: "",
			objectName: "",
			objectId: null,
			shortAddress: "",
			payer: "",
			whatToBuy: "",
			creator: CURRENT_USER,
		};
	}

	function getEmptyTransportForm() {
		const today = new Date().toLocaleDateString("ru-RU");
		return {
			requestDate: today,
			deadline: "",
			assignedDate: "",
			assignedTo: "",
			purchaseStatus: "",
			callStatus: "",
			thisStatus: "0",
			objectName: "",
			objectId: null,
			shortAddress: "",
			whatToTransport: "",
			toolsList: "",
			toolsIds: [],
			creator: "Система",
			linkedPurchaseId: null,
			linkedCallId: null,
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
			objectId: null,
			tenant: "",
			systemId: null,
			systemName: "",
			systemQuantity: "",
			systems: [], // Массив выбранных систем с количеством
			calculatedYearlyTime: 0, // В часах
			actualYearlyTime: 0, // В часах
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
	// Синхронизация контактов при изменении объектов
	// Используем ref-флаг, чтобы избежать зацикливания useEffect
	const objectContactsSyncRef = useRef(false);
	const prevObjectsLengthRef = useRef(0);

	useEffect(() => {
		// Синхронизируем контакты только при реальных изменениях объектов
		// (добавление, удаление, редактирование через handleSaveEdit)
		if (objectContactsSyncRef.current) {
			objectContactsSyncRef.current = false;
			return;
		}
		// Синхронизируем только если количество объектов изменилось
		if (objects.length !== prevObjectsLengthRef.current) {
			prevObjectsLengthRef.current = objects.length;
			const objectContacts = extractContactsFromObjects(objects);
			const manualContacts = contacts.filter((c) => c.source === "manual");
			const existingIds = new Set([
				...manualContacts.map((c) => c.id),
				...objectContacts.map((c) => c.id),
			]);
			const merged = [...manualContacts];
			objectContacts.forEach((oc) => {
				if (!existingIds.has(oc.id)) {
					merged.push(oc);
				}
			});
			setContacts(merged);
		}
	}, [objects.length]);

	const handleAddObject = (e) => {
		e?.preventDefault();
		const name = newFormData["Наименование объекта"];
		const customer = newFormData["Заказчик"];
		if (!name?.trim() || !customer?.trim()) {
			alert("Заполните: Наименование объекта и Заказчика!");
			return;
		}
		const maxNumber = objects.reduce(
			(max, obj) => Math.max(max, obj.objectNumber || 0),
			0,
		);
		const newObj = {
			id: Date.now(),
			objectNumber: maxNumber + 1,
			...newFormData,
		};
		objectContactsSyncRef.current = true;
		saveObjects([newObj, ...objects]);
		setNewFormData(getEmptyObjectForm());
	};

	// Генерация рандомного объекта
	const generateRandomObject = () => {
		const customers = [
			"ООО СтройМир",
			"ЗАО Энерго",
			"ИП Кленов",
			"ПАО Связь",
			"ООО ТехноСервис",
			"АО МегаСтрой",
			"ИП Сидоров",
			"ООО Инфраструктура",
		];
		const contractors = ["СБ", "СБ+", "ВСТ", "ИП"];
		const contractTypes = ["ТО", "СМР", "ПИР"];
		const extendables = [
			"Продлеваемый автоматически",
			"Не продлеваемый",
			"Продлеваемый доп соглашением",
			"Конкурсный",
		];
		const systems = ["АПС", "СОУЭ", "ВПВ", "ОПС", "ВИДЕОНАБЛЮДЕНИЕ", "СКУД"];
		const streets = [
			"Ленина",
			"Пушкина",
			"Гагарина",
			"Кирова",
			"Советская",
			"Октябрьская",
			"Мира",
			"Победы",
		];
		const cities = [
			"Москва",
			"СПб",
			"Екатеринбург",
			"Новосибирск",
			"Казань",
			"Воронеж",
		];
		const payOptions = ["Заказчик", "Наш счёт"];
		const toolOptions = ["есть", "нет"];
		const rdOptions = [
			["РД"],
			["ИД"],
			["ПД"],
			["РД", "ИД"],
			["РД", "ПД"],
			["ИД", "ПД"],
			["РД", "ИД", "ПД"],
		];

		const customer = customers[Math.floor(Math.random() * customers.length)];
		const city = cities[Math.floor(Math.random() * cities.length)];
		const street = streets[Math.floor(Math.random() * streets.length)];
		const num = Math.floor(Math.random() * 100) + 1;
		const objectName = `${customer} - Объект ${num}`;
		const address = `${city}, ул. ${street}, д. ${num}`;
		const shortAddress = `${street}, ${num}`;
		const rd =
			rdOptions[Math.floor(Math.random() * rdOptions.length)].join(", ");

		const randomObj = {
			id: Date.now() + Math.random(),
			objectNumber: objects.length + 1,
			Заказчик: customer,
			Подрядчик: contractors[Math.floor(Math.random() * contractors.length)],
			"№ контр/дог": `${customer.slice(0, 2)}-${num}/2024`,
			"Начало действия договора": "2024-01-01",
			"Окончание действия договора": "2025-12-31",
			"Тип договора":
				contractTypes[Math.floor(Math.random() * contractTypes.length)],
			Продлеваемость:
				extendables[Math.floor(Math.random() * extendables.length)],
			"Письмо о повышении стоимости ТО":
				Math.random() > 0.5 ? "15.03.2024" : "",
			"Свершившееся повышение цены ТО":
				Math.random() > 0.5 ? `${Math.floor(Math.random() * 15) + 5}%` : "",
			"Доп соглашение":
				Math.random() > 0.5 ? `№${Math.floor(Math.random() * 5) + 1}` : "",
			Письма:
				Math.random() > 0.7 ? `Исх.№${Math.floor(Math.random() * 200)}` : "",
			"Кто оплачивает ремонт":
				payOptions[Math.floor(Math.random() * payOptions.length)],
			"Как оплачиваются доп.работы": ["Сметы", "КП", "По договору"][
				Math.floor(Math.random() * 3)
			],
			"К доп работам есть ли аванс": ["Аванс", "Без аванса"][
				Math.floor(Math.random() * 2)
			],
			"Адрес полный объекта": address,
			"Адрес сокращенный": shortAddress,
			"Наименование объекта": objectName,
			"РД ИД ПД": rd,
			Арендатор: `Арендатор${num}`,
			Системы: ["АПС", "СОУЭ", "ВПВ", "ОПС", "ВИДЕОНАБЛЮДЕНИЕ", "СКУД"]
				.filter(() => Math.random() > 0.5)
				.slice(0, 3)
				.join(", "),
			"Расчетное время на обслуживание": `${Math.floor(Math.random() * 8) + 1} часов`,
			Контакты: `Контактное лицо +7999${Math.floor(Math.random() * 90000000) + 10000000}`,
			"Инструмент на объекте":
				toolOptions[Math.floor(Math.random() * toolOptions.length)],
			Заметки: Math.random() > 0.7 ? "Дополнительная информация" : "",
		};
		return randomObj;
	};

	const handleAddRandomObjects = (count = 5) => {
		objectContactsSyncRef.current = true;
		const newObjects = Array.from({ length: count }, () =>
			generateRandomObject(),
		);
		saveObjects([...newObjects, ...objects]);
	};

	const handleDeleteObject = (id) => {
		if (confirm("Удалить объект?")) {
			objectContactsSyncRef.current = true;
			saveObjects(objects.filter((o) => o.id !== id));
		}
	};

	const handleEditObject = (obj) => {
		setEditingObject({ ...obj });
		setIsEditModalOpen(true);
	};

	const handleSaveEdit = (e) => {
		e?.preventDefault();
		const oldObject = objects.find((o) => o.id === editingObject.id);
		const newObject = editingObject;

		// Синхронизация данных объекта во всех связанных разделах
		const oldName = oldObject ? oldObject["Наименование объекта"] : "";
		const newName = newObject["Наименование объекта"] || "";
		const newAddress = newObject["Адрес сокращенный"] || "";
		const newTenant = newObject["Арендатор"] || "";

		objectContactsSyncRef.current = true;
		saveObjects(
			objects.map((o) => (o.id === editingObject.id ? editingObject : o)),
		);

		// Синхронизация в вызовах
		if (
			oldName !== newName ||
			oldObject?.["Адрес сокращенный"] !== newAddress
		) {
			setCalls(
				calls.map((c) => {
					if (c.objectName === oldName || c.objectId === editingObject.id) {
						return {
							...c,
							objectName: newName,
							shortAddress: newAddress,
							tenant: newTenant,
							objectId: editingObject.id,
						};
					}
					return c;
				}),
			);
		}

		// Синхронизация в транспорте
		setTransportItems(
			transportItems.map((t) => {
				if (t.objectName === oldName || t.objectId === editingObject.id) {
					return {
						...t,
						objectName: newName,
						shortAddress: newAddress,
						objectId: editingObject.id,
					};
				}
				return t;
			}),
		);

		// Синхронизация в закупках
		setBuyItems(
			buyItems.map((b) => {
				if (b.objectName === oldName || b.objectId === editingObject.id) {
					return {
						...b,
						objectName: newName,
						shortAddress: newAddress,
						objectId: editingObject.id,
					};
				}
				return b;
			}),
		);

		// Синхронизация в затратах
		setCosts(
			costs.map((c) => {
				if (c.objectName === oldName || c.objectId === editingObject.id) {
					return {
						...c,
						objectName: newName,
						shortAddress: newAddress,
						objectId: editingObject.id,
					};
				}
				return c;
			}),
		);

		// Синхронизация в инструментах
		setTools(
			tools.map((t) => {
				if (t.objectName === oldName || t.objectId === editingObject.id) {
					return {
						...t,
						objectName: newName,
						shortAddress: newAddress,
						objectId: editingObject.id,
					};
				}
				return t;
			}),
		);

		// Синхронизация в актировании
		setActivations(
			activations.map((a) => {
				if (a.objectName === oldName || a.objectId === editingObject.id) {
					return {
						...a,
						objectName: newName,
						shortAddress: newAddress,
						objectId: editingObject.id,
					};
				}
				return a;
			}),
		);

		// Синхронизация в счетах
		setInvoices(
			invoices.map((i) => {
				if (i.objectName === oldName || i.objectId === editingObject.id) {
					return {
						...i,
						objectName: newName,
						shortAddress: newAddress,
						objectId: editingObject.id,
					};
				}
				return i;
			}),
		);

		// Синхронизация в учете времени
		setTimeEntries(
			timeEntries.map((t) => {
				if (t.objectName === oldName || t.objectId === editingObject.id) {
					return {
						...t,
						objectName: newName,
						shortAddress: newAddress,
						objectId: editingObject.id,
					};
				}
				return t;
			}),
		);

		// Синхронизация в системах
		setSystems(
			systems.map((s) => {
				if (s.parentObject === oldName || s.objectId === editingObject.id) {
					return { ...s, parentObject: newName, objectId: editingObject.id };
				}
				return s;
			}),
		);

		// Синхронизация в контактах
		setContacts(
			contacts.map((c) => {
				if (c.objectName === oldName || c.objectId === editingObject.id) {
					return {
						...c,
						objectName: newName,
						shortAddress: newAddress,
						objectId: editingObject.id,
					};
				}
				return c;
			}),
		);

		setIsEditModalOpen(false);
		setEditingObject(null);
	};

	// === ЛОГИКА ВЫЗОВОВ ===
	const handleAddCall = (formData) => {
		// formData может быть событием (e) или объектом с данными
		const callData = formData?.preventDefault ? null : formData;

		if (callData) {
			// Новый компонент передаёт данные напрямую
			const newCall = {
				id: Date.now(),
				...callData,
				createdAt: callData.createdAt || new Date().toISOString().split("T")[0],
			};
			setCalls([newCall, ...calls]);
		} else {
			// Старая форма через событие
			if (!newCallData.objectName?.trim()) {
				alert("Выберите объект!");
				return;
			}
			const selectedToolsList = selectedToolsForNewCall
				.map((id) => {
					const tool = tools.find((t) => t.id === id);
					return tool
						? `• ${tool.tool}${tool.brand ? ` (${tool.brand})` : ""}${tool.inventoryNumber ? ` [${tool.inventoryNumber}]` : ""}`
						: null;
				})
				.filter(Boolean)
				.join("\n");
			const newCall = {
				id: Date.now(),
				...newCallData,
				selectedToolIds: [...selectedToolsForNewCall],
				selectedToolsList: selectedToolsList,
			};
			setCalls([newCall, ...calls]);
			setNewCallData(getEmptyCallForm());
			setSelectedToolsForNewCall([]);
		}
	};

	// Создание заявки на транспорт из раздела Вызовы
	const handleCreateTransportFromCall = (data) => {
		const newTransport = {
			id: Date.now(),
			requestDate: new Date().toISOString().split("T")[0],
			deadline: "",
			assignedDate: "",
			assignedTo: "",
			purchaseStatus: "",
			callStatus: "new",
			thisStatus: "new",
			objectName: data.objectName || "",
			shortAddress: data.shortAddress || "",
			whatToTransport: data.whatToTransport || "",
			toolsList: "",
			creator: data.creator || "",
		};
		setTransportItems([newTransport, ...transportItems]);
		alert("Заявка на транспорт создана!");
	};

	// Создание заявки на закупку из раздела Вызовы
	const handleCreateBuyFromCall = (data) => {
		const obj = objects.find(
			(o) => o["Наименование объекта"] === data.objectName,
		);
		const newBuy = {
			id: Date.now(),
			requestDate: new Date().toISOString().split("T")[0],
			deadline: "",
			status: "new",
			contractNumber: obj?.["№ контр/дог"] || "",
			objectName: data.objectName || "",
			shortAddress: data.shortAddress || "",
			payer: obj?.["Кто оплачивает ремонт"] || "",
			whatToBuy: data.whatToBuy || "",
			creator: data.creator || "",
		};
		setBuyItems([newBuy, ...buyItems]);
		alert("Заявка на закупку создана!");
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

	// Открытие модалки редактирования инструмента
	const handleToolClick = (tool) => {
		setEditingTool({ ...tool });
		setIsToolModalOpen(true);
	};

	// Закрытие модалки
	const handleCloseToolModal = () => {
		setIsToolModalOpen(false);
		setEditingTool(null);
	};

	// Сохранение изменений инструмента
	const handleSaveTool = () => {
		if (!editingTool) return;
		setTools(tools.map((t) => (t.id === editingTool.id ? editingTool : t)));
		handleCloseToolModal();
	};

	// Подтверждение выбора инструмента для заявки на транспорт
	const handleConfirmToolSelection = () => {
		if (!editingTool?.transportRequestId) return;
		setTools(
			tools.map((t) =>
				t.id === editingTool.id
					? {
							...t,
							isConfirmed: true,
							transportRequest: t.transportRequestId.toString(),
						}
					: t,
			),
		);
		setEditingTool({ ...editingTool, isConfirmed: true });
	};

	// Обработчик изменения статуса в транспорте - автообновление инструментов
	const handleTransportStatusChange = (transportId, newStatus) => {
		if (newStatus !== "Выполнена") return;

		// Найти заявку на транспорт
		const transport = transportItems.find((t) => t.id === transportId);
		if (!transport) return;

		// Найти все инструменты привязанные к этой заявке
		const toolsToUpdate = tools.filter(
			(t) => t.transportRequestId === transportId,
		);

		if (toolsToUpdate.length === 0) return;

		// Обновить инструменты: фактический адрес = из транспорта, дата прибытия = сейчас
		const now = new Date().toLocaleDateString("ru-RU");
		setTools(
			tools.map((t) =>
				t.transportRequestId === transportId
					? {
							...t,
							factObjectName: transport.objectName,
							factShortAddress: transport.shortAddress,
							arrivalDate: now,
							transportRequestId: null, // Очищаем связь
							isConfirmed: false,
						}
					: t,
			),
		);
	};

	const handleToggleToolSelection = (id) => {
		setSelectedToolIds((prev) =>
			prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id],
		);
	};

	const handleSelectAllTools = () => {
		if (selectedToolIds.length === tools.length) {
			setSelectedToolIds([]);
		} else {
			setSelectedToolIds(tools.map((t) => t.id));
		}
	};

	// === ЛОГИКА ВЫБОРА ИНСТРУМЕНТА ДЛЯ ВЫЗОВА ===
	const handleToggleToolForCall = (toolId) => {
		setSelectedToolsForNewCall((prev) =>
			prev.includes(toolId)
				? prev.filter((id) => id !== toolId)
				: [...prev, toolId],
		);
	};

	const handleSelectAllToolsForCall = () => {
		if (selectedToolsForNewCall.length === tools.length) {
			setSelectedToolsForNewCall([]);
		} else {
			setSelectedToolsForNewCall(tools.map((t) => t.id));
		}
	};

	const handleClearToolsForCall = () => {
		setSelectedToolsForNewCall([]);
	};

	const handleAddToolToCall = (toolId) => {
		setSelectedToolsForNewCall((prev) => {
			if (prev.includes(toolId)) {
				return prev;
			}
			return [...prev, toolId];
		});
	};

	const handleBulkDeleteTools = () => {
		if (selectedToolIds.length === 0) return;
		if (
			confirm(`Удалить выбранные инструменты (${selectedToolIds.length} шт.)?`)
		) {
			setTools(tools.filter((t) => !selectedToolIds.includes(t.id)));
			setSelectedToolIds([]);
		}
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

		// Валидация обязательных полей
		if (!newBuyData.objectName?.trim()) {
			alert("Выберите объект!");
			return;
		}
		if (!newBuyData.whatToBuy?.trim()) {
			alert("Заполните что нужно приобрести!");
			return;
		}

		// Найти объект для получения данных
		const selectedObject = objects.find(
			(o) => o["Наименование объекта"] === newBuyData.objectName,
		);

		// Автозаполнение полей из объекта если не указаны
		const autoBuyData = { ...newBuyData };
		if (!autoBuyData.contractNumber && selectedObject) {
			autoBuyData.contractNumber = selectedObject["№ контр/дог"] || "";
		}
		if (!autoBuyData.shortAddress && selectedObject) {
			autoBuyData.shortAddress = selectedObject["Адрес сокращенный"] || "";
		}
		if (!autoBuyData.payer && selectedObject) {
			autoBuyData.payer = selectedObject["Кто оплачивает ремонт"] || "";
		}
		autoBuyData.objectId = selectedObject?.id || null;
		autoBuyData.creator = CURRENT_USER;

		const newItem = { id: Date.now(), ...autoBuyData };

		// Если статус "заказан_счёт" - создать запись в счетах
		if (autoBuyData.status === BUY_STATUS.ORDERED) {
			const newInvoice = {
				id: Date.now(),
				requestDate: autoBuyData.requestDate,
				contractNumber: autoBuyData.contractNumber,
				objectName: autoBuyData.objectName,
				shortAddress: autoBuyData.shortAddress,
				description: autoBuyData.whatToBuy,
				status: "pending", // Ожидает подтверждения
				payer: autoBuyData.payer,
				buyItemId: newItem.id, // Связь с закупкой
				creator: CURRENT_USER,
			};
			setInvoices([newInvoice, ...invoices]);
		}

		// Если плательщик не "всё за наш счёт" - создать заявку на актирование
		if (autoBuyData.payer && autoBuyData.payer !== "всё за наш счёт") {
			const newActivation = {
				id: Date.now() + 1,
				requestDate: autoBuyData.requestDate,
				deadline: autoBuyData.deadline,
				objectName: autoBuyData.objectName,
				shortAddress: autoBuyData.shortAddress,
				description: `Закупка: ${autoBuyData.whatToBuy}. Плательщик: ${autoBuyData.payer}`,
				status: "new",
				buyItemId: newItem.id, // Связь с закупкой
				creator: CURRENT_USER,
			};
			setActivations([newActivation, ...activations]);
		}

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
		// Валидация: поле "Что нужно транспортировать" обязательно
		if (!newTransportData.whatToTransport?.trim()) {
			alert('Заполните поле "Что нужно транспортировать"!');
			return;
		}
		const newItem = { id: Date.now(), ...newTransportData };
		setTransportItems([newItem, ...transportItems]);
		setNewTransportData(getEmptyTransportForm());
	};

	const handleDeleteTransport = (id) => {
		if (confirm("Удалить заявку?"))
			setTransportItems(transportItems.filter((t) => t.id !== id));
	};

	const handleEditTransport = (item) => {
		setEditingTransport({ ...item });
		setIsTransportModalOpen(true);
	};

	const handleSaveTransport = (e) => {
		e?.preventDefault();
		const oldStatus = transportItems.find(
			(t) => t.id === editingTransport.id,
		)?.thisStatus;
		const newStatus = editingTransport.thisStatus;
		setTransportItems(
			transportItems.map((t) =>
				t.id === editingTransport.id ? editingTransport : t,
			),
		);
		// Если статус изменился на "Выполнена", обновить связанные инструменты
		if (oldStatus !== "Выполнена" && newStatus === "Выполнена") {
			handleTransportStatusChange(editingTransport.id, newStatus);
		}
		setIsTransportModalOpen(false);
		setEditingTransport(null);
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

		// Валидация
		if (!newTimeData.objectName?.trim()) {
			alert("Выберите объект!");
			return;
		}

		// Расчёт разности
		const calcTime = parseFloat(newTimeData.calculatedYearlyTime) || 0;
		const factTime = parseFloat(newTimeData.actualYearlyTime) || 0;
		const timeDifference = calcTime - factTime;

		// Формируем строку систем для отображения
		const systemsDisplay =
			newTimeData.systems
				?.map((s) => `${s.systemName}${s.quantity ? ` (${s.quantity})` : ""}`)
				.join(", ") || "";

		const newTime = {
			id: Date.now(),
			...newTimeData,
			systemsDisplay,
			timeDifference: timeDifference.toFixed(1),
		};

		setTimeEntries([newTime, ...timeEntries]);
		setNewTimeData(getEmptyTimeForm());
	};

	const handleDeleteTime = (id) => {
		if (confirm("Удалить запись?"))
			setTimeEntries(timeEntries.filter((t) => t.id !== id));
	};

	// === ЛОГИКА СИСТЕМ ВРЕМЕНИ ===
	const handleAddTimeSystem = (e) => {
		e?.preventDefault();
		if (!newTimeSystemData.systemName?.trim()) {
			alert("Введите название системы!");
			return;
		}
		const newSystem = {
			id: Date.now(),
			...newTimeSystemData,
			createdAt: new Date().toLocaleDateString("ru-RU"),
		};
		setCustomTimeSystems([newSystem, ...customTimeSystems]);
		localStorage.setItem(
			"demo_custom_time_systems",
			JSON.stringify([newSystem, ...customTimeSystems]),
		);

		// Добавить в newTimeData
		setNewTimeData({
			...newTimeData,
			systems: [...(newTimeData.systems || []), newSystem],
			systemName: newSystem.systemName,
		});

		setNewTimeSystemData({
			systemName: "",
			systemType: "",
			quantity: "",
			objectName: "",
		});
		setIsTimeSystemModalOpen(false);
	};

	const handleRemoveSystemFromTime = (systemId) => {
		setNewTimeData({
			...newTimeData,
			systems: newTimeData.systems.filter((s) => s.id !== systemId),
		});
	};

	// Получить все системы для выбранного объекта
	const getSystemsForObject = (objectName) => {
		// Системы из Excel
		const excelSystems = systems
			.filter((s) => s.parentObject === objectName)
			.map((s) => ({
				id: `excel_${s.id}`,
				systemName: s.systemType || s.systemKind || s.system,
				systemType: s.systemKind || s.systemType || "",
				quantity: s.quantity || "",
				objectName: objectName,
				fromExcel: true,
			}));

		// Кастомные системы
		const customForObject = customTimeSystems.filter(
			(s) => s.objectName === objectName,
		);

		return [...excelSystems, ...customForObject];
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
		setContacts(
			contacts.map((c) => (c.id === editingContact.id ? editingContact : c)),
		);
		setIsContactModalOpen(false);
		setEditingContact(null);
	};

	const handleContactChange = (field, value) => {
		setEditingContact({ ...editingContact, [field]: value });
	};

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
									: activeTab === "transport"
										? transportItems
										: activeTab === "buy"
											? buyItems
											: activeTab === "staff"
												? staff
												: [];
			if (data.length === 0) {
				setIsExporting(false);
				return;
			}
			const headers = Object.keys(data[0]);
			// BOM маркер для правильной кодировки UTF-8 в Excel
			const BOM = "\uFEFF";
			// Используем табуляцию как разделитель для лучшей совместимости с Excel
			const delimiter = "\t";
			const csv = [
				headers.join(delimiter),
				...data.map((r) =>
					headers
						.map((h) => {
							let val = r[h] || "";
							// Экранируем кавычки и переносы строк
							if (typeof val === "string") {
								val = val.replace(/"/g, '""');
								if (
									val.includes(delimiter) ||
									val.includes('"') ||
									val.includes("\n")
								) {
									val = `"${val}"`;
								}
							}
							return val;
						})
						.join(delimiter),
				),
			].join("\n");
			const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			// Формат xlsx для лучшей совместимости
			a.download = `${activeTab}_${new Date().toISOString().split("T")[0]}.xlsx`;
			a.click();
			URL.revokeObjectURL(url);
			setIsExporting(false);
		}, 500);
	};

	// === ФИЛЬТРАЦИЯ ОБЪЕКТОВ ===
	const filteredObjects = objects.filter((o) => {
		// Текстовый поиск
		const q = searchQuery.toLowerCase();
		const matchesSearch =
			!q ||
			(o["Наименование объекта"] || "").toLowerCase().includes(q) ||
			(o["Заказчик"] || "").toLowerCase().includes(q) ||
			(o["№ контр/дог"] || "").toLowerCase().includes(q) ||
			(o["Адрес полный объекта"] || "").toLowerCase().includes(q) ||
			(o["Адрес сокращенный"] || "").toLowerCase().includes(q) ||
			(o["Арендатор"] || "").toLowerCase().includes(q) ||
			(o["Системы"] || "").toLowerCase().includes(q);

		// Фильтр по типу договора
		const matchesType =
			!objectFilters.type || o["Тип договора"] === objectFilters.type;

		// Фильтр по подрядчику
		const matchesContractor =
			!objectFilters.contractor || o["Подрядчик"] === objectFilters.contractor;

		// Фильтр по продлеваемости
		const objExtendable = o["Продлеваемость"] || o["Продлеваемость "] || "";
		const matchesExtendable =
			!objectFilters.extendable ||
			objectFilters.extendable === "all" ||
			objectFilters.extendable === "undefined"
				? !objExtendable
				: objExtendable === objectFilters.extendable;

		// Фильтр по наличию инструмента
		const matchesTool =
			!objectFilters.hasTool ||
			o["Инструмент на объекте"] === objectFilters.hasTool;

		return (
			matchesSearch &&
			matchesType &&
			matchesContractor &&
			matchesExtendable &&
			matchesTool
		);
	});

	// Получение уникальных значений для фильтров
	const uniqueContractors = [
		...new Set(objects.map((o) => o["Подрядчик"]).filter(Boolean)),
	];
	const uniqueTypes = [
		...new Set(objects.map((o) => o["Тип договора"]).filter(Boolean)),
	];
	const uniqueExtendable = [
		...new Set(
			objects
				.map((o) => o["Продлеваемость"] || o["Продлеваемость "])
				.filter(Boolean),
		),
	];

	// === АВТОРИЗАЦИЯ ===
	const handleLogin = async (e) => {
		e.preventDefault();
		setAuthError("");
		setIsAuthLoading(true);
		try {
			const result = await authApi.login(authUsername, authPassword);
			localStorage.setItem("authToken", result.token);
			setAuthToken(result.token);
			setCurrentUser(result.user);
			setIsAuthenticated(true);
			setAuthUsername("");
			setAuthPassword("");
		} catch (error) {
			setAuthError(error.message || "Ошибка авторизации");
		} finally {
			setIsAuthLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			await authApi.logout();
		} catch (e) {
			// Ignore logout errors
		}
		localStorage.removeItem("authToken");
		setAuthToken(null);
		setCurrentUser(null);
		setIsAuthenticated(false);
	};

	// Load current user on mount if token exists
	useEffect(() => {
		if (authToken) {
			authApi.getCurrentUser().then((user) => {
				if (user) {
					setCurrentUser(user);
				} else {
					// Token invalid
					localStorage.removeItem("authToken");
					setAuthToken(null);
					setIsAuthenticated(false);
				}
			});
		}
	}, [authToken]);

	// === ЭКРАН ЛОГИНА ===
	if (!isAuthenticated) {
		return (
			<div className="app-layout">
				<aside className="sidebar">
					<div className="sidebar-header">
						<Building2 size={22} />
						<span>База CRM</span>
					</div>
					<nav className="sidebar-nav">
						{MENU_ITEMS.map((item) => (
							<button key={item.id} className="nav-item" onClick={() => {}}>
								<item.icon size={20} />
								<span>{item.label}</span>
								{item.id === 'rd' && rdFolderCount > 0 && (
										<span className="sidebar-badge">{rdFolderCount > 99 ? '99+' : rdFolderCount}</span>
								)}
							</button>
						))}
					</nav>
				</aside>
				<main className="content">
					<div className="login-overlay">
						<div className="login-card">
							<div className="login-header">
								<Building2 size={48} />
								<h1>База CRM</h1>
								<p>Управление объектами и заявками</p>
							</div>
							<form onSubmit={handleLogin} className="login-form">
								<div className="form-group">
									<label>Логин</label>
									<input
										type="text"
										value={authUsername}
										onChange={(e) => setAuthUsername(e.target.value)}
										placeholder="admin"
										required
										autocomplete="username"
									/>
								</div>
								<div className="form-group">
									<label>Пароль</label>
									<input
										type="password"
										value={authPassword}
										onChange={(e) => setAuthPassword(e.target.value)}
										placeholder="123456"
										required
										autocomplete="current-password"
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
						</div>
					</div>
				</main>
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
				return (
					<>
						{renderToolsSection()}
						<ToolEditModal />
					</>
				);
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
				return renderStaffSection();
			case "accounts":
			case "users":
				return <UsersPanel />;
			case "rd":
				return <RenderRDSection onFolderCountChange={setRDFolderCount} />;
			default:
				return renderPlaceholderSection();
		}
	};

	function renderObjectsSection() {
		if (isLoading) {
			return (
				<div className="section">
					<div className="loading">Загрузка данных...</div>
				</div>
			);
		}
		// Функция открытия окна выбора систем
		const openSystemPicker = (obj, e) => {
			e?.stopPropagation();
			setSystemPickerObject(obj);
			// Парсим текущие системы объекта
			const currentSystems = obj["Системы"] || "";
			const systemsArray = currentSystems
				.split(",")
				.map((s) => s.trim())
				.filter((s) => s);
			setSelectedSystemsForObject(systemsArray);
			setSystemPickerSearch("");
			setIsSystemPickerOpen(true);
		};

		// Функция сохранения выбранных систем
		const saveObjectSystems = () => {
			if (!systemPickerObject) return;

			const newSystemsString = selectedSystemsForObject.join(", ");
			objectContactsSyncRef.current = true;
			saveObjects(
				objects.map((o) =>
					o.id === systemPickerObject.id
						? { ...o, Системы: newSystemsString }
						: o,
				),
			);
			setIsSystemPickerOpen(false);
			setSystemPickerObject(null);
		};

		// Переключение системы в выборе
		const toggleSystem = (system) => {
			setSelectedSystemsForObject((prev) =>
				prev.includes(system)
					? prev.filter((s) => s !== system)
					: [...prev, system],
			);
		};

		// Фильтрованные типы систем для пикера
		const filteredSystemTypes = ALL_SYSTEM_TYPES.filter((s) =>
			s.toLowerCase().includes(systemPickerSearch.toLowerCase()),
		);

		return (
			<>
				<div className="content-header">
					<div className="search-box">
						<Search size={20} />
						<input
							type="text"
							placeholder="Поиск: название, заказчик, договор, адрес, арендатор, системы..."
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
					<span className="badge-count">
						{filteredObjects.length} из {objects.length}
					</span>
				</div>

				{/* ФИЛЬТРЫ ОБЪЕКТОВ */}
				<div className="filters-bar">
					<div className="filter-group">
						<label>Тип договора:</label>
						<select
							value={objectFilters.type}
							onChange={(e) =>
								setObjectFilters({ ...objectFilters, type: e.target.value })
							}
						>
							<option value="">Все</option>
							{uniqueTypes.map((t) => (
								<option key={t} value={t}>
									{t}
								</option>
							))}
						</select>
					</div>
					<div className="filter-group">
						<label>Подрядчик:</label>
						<select
							value={objectFilters.contractor}
							onChange={(e) =>
								setObjectFilters({
									...objectFilters,
									contractor: e.target.value,
								})
							}
						>
							<option value="">Все</option>
							{uniqueContractors.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
					</div>
					<div className="filter-group">
						<label>Продлеваемость:</label>
						<select
							value={objectFilters.extendable}
							onChange={(e) =>
								setObjectFilters({
									...objectFilters,
									extendable: e.target.value,
								})
							}
						>
							<option value="">Все</option>
							<option value="undefined">Не указано</option>
							{uniqueExtendable.map((e) => (
								<option key={e} value={e}>
									{e}
								</option>
							))}
						</select>
					</div>
					<div className="filter-group">
						<label>Инструмент:</label>
						<select
							value={objectFilters.hasTool}
							onChange={(e) =>
								setObjectFilters({ ...objectFilters, hasTool: e.target.value })
							}
						>
							<option value="">Все</option>
							<option value="есть">Есть</option>
							<option value="нет">Нет</option>
						</select>
					</div>
					{(objectFilters.type ||
						objectFilters.contractor ||
						objectFilters.extendable ||
						objectFilters.hasTool) && (
						<button
							className="btn-clear-filters"
							onClick={() =>
								setObjectFilters({
									type: "",
									contractor: "",
									extendable: "",
									hasTool: "",
								})
							}
						>
							<X size={14} /> Сбросить фильтры
						</button>
					)}

					<div className="header-actions">
						<button
							className="btn btn-secondary"
							onClick={() => handleAddRandomObjects(5)}
						>
							<Zap size={16} />
							Добавить 5 рандомных
						</button>
						<button
							className="btn btn-primary"
							onClick={() => setIsAddFormOpen(!isAddFormOpen)}
						>
							<Plus size={16} />
							Добавить объект
						</button>
					</div>
				</div>

				{/* СЕКЦИЯ ДОБАВЛЕНИЯ */}
				{isAddFormOpen && (
					<div className="collapsible-content">
						<div className="add-form-section add-form-full">
							<div className="form-actions-row">
								<form onSubmit={handleAddObject} className="add-form-inline">
									<button type="submit" className="btn btn-primary">
										<Plus size={18} />
										Добавить объект
									</button>
								</form>
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => handleAddRandomObjects(5)}
								>
									<Zap size={18} />
									Добавить 5 рандомных
								</button>
							</div>
							<form onSubmit={handleAddObject} className="add-form">
								<div className="form-grid">
									<div className="form-group">
										<label>Заказчик</label>
										<input
											type="text"
											value={newFormData["Заказчик"] || ""}
											onChange={(e) =>
												setNewFormData({
													...newFormData,
													Заказчик: e.target.value,
												})
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
											type="date"
											value={newFormData["Начало действия договора"] || ""}
											onChange={(e) =>
												setNewFormData({
													...newFormData,
													"Начало действия договора": e.target.value,
												})
											}
										/>
									</div>
									<div className="form-group">
										<label>Окончание действия договора</label>
										<input
											type="date"
											value={newFormData["Окончание действия договора"] || ""}
											onChange={(e) =>
												setNewFormData({
													...newFormData,
													"Окончание действия договора": e.target.value,
												})
											}
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
											value={
												newFormData["Письмо о повышении стоимости ТО"] || ""
											}
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
											value={
												newFormData["Свершившееся повышение цены ТО"] || ""
											}
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
												setNewFormData({
													...newFormData,
													Письма: e.target.value,
												})
											}
										/>
									</div>
									<div className="form-group">
										<label>Кто оплачивает ремонт</label>
										<select
											value={newFormData["Кто оплачивает ремонт"] || ""}
											onChange={(e) =>
												setNewFormData({
													...newFormData,
													"Кто оплачивает ремонт": e.target.value,
												})
											}
										>
											<option value="">—</option>
											<option value="Заказчик">Заказчик</option>
											<option value="Наш счёт">За наш счёт</option>
										</select>
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
										<div className="checkbox-group">
											<label className="checkbox-label">
												<input
													type="checkbox"
													checked={(newFormData["РД ИД ПД"] || "").includes(
														"РД",
													)}
													onChange={(e) => {
														const current = newFormData["РД ИД ПД"] || "";
														const values = current.split(", ").filter(Boolean);
														const newValues = e.target.checked
															? [...values, "РД"]
															: values.filter((v) => v !== "РД");
														setNewFormData({
															...newFormData,
															"РД ИД ПД": newValues.join(", "),
														});
													}}
												/>
												<span>РД</span>
											</label>
											<label className="checkbox-label">
												<input
													type="checkbox"
													checked={(newFormData["РД ИД ПД"] || "").includes(
														"ИД",
													)}
													onChange={(e) => {
														const current = newFormData["РД ИД ПД"] || "";
														const values = current.split(", ").filter(Boolean);
														const newValues = e.target.checked
															? [...values, "ИД"]
															: values.filter((v) => v !== "ИД");
														setNewFormData({
															...newFormData,
															"РД ИД ПД": newValues.join(", "),
														});
													}}
												/>
												<span>ИД</span>
											</label>
											<label className="checkbox-label">
												<input
													type="checkbox"
													checked={(newFormData["РД ИД ПД"] || "").includes(
														"ПД",
													)}
													onChange={(e) => {
														const current = newFormData["РД ИД ПД"] || "";
														const values = current.split(", ").filter(Boolean);
														const newValues = e.target.checked
															? [...values, "ПД"]
															: values.filter((v) => v !== "ПД");
														setNewFormData({
															...newFormData,
															"РД ИД ПД": newValues.join(", "),
														});
													}}
												/>
												<span>ПД</span>
											</label>
										</div>
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
												setNewFormData({
													...newFormData,
													Системы: e.target.value,
												})
											}
											placeholder="АПС, СОУЭ, ВПВ"
										/>
									</div>
									<div className="form-group">
										<label>Расчетное время на обслуживание</label>
										<input
											type="text"
											value={
												newFormData["Расчетное время на обслуживание"] || ""
											}
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
												setNewFormData({
													...newFormData,
													Контакты: e.target.value,
												})
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
												setNewFormData({
													...newFormData,
													Заметки: e.target.value,
												})
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
					</div>
				)}

				{/* ТАБЛИЦА ОБЪЕКТОВ */}
				<div className="table-container table-horizontal">
					<table className="data-table">
						<thead>
							<tr>
								<th className="sticky-col">Действия</th>
								<th>Заказчик</th>
								<th>Подрядчик</th>
								<th>№ контр/дог</th>
								<th>Начало</th>
								<th>Окончание</th>
								<th>Тип</th>
								<th>Продлеваемость</th>
								<th>Письмо ТО</th>
								<th>Повышение ТО</th>
								<th>Доп.согл</th>
								<th>Письма</th>
								<th>Оплата ремонта</th>
								<th>Доп.работы</th>
								<th>Аванс</th>
								<th>Адрес полный</th>
								<th>Адрес сокр.</th>
								<th>Наименование</th>
								<th>РД ИД ПД</th>
								<th>Арендатор</th>
								<th>Системы</th>
								<th>Время</th>
								<th>Контакты</th>
								<th>Инструмент</th>
								<th>Заметки</th>
							</tr>
						</thead>
						<tbody>
							{filteredObjects.length === 0 ? (
								<tr>
									<td colSpan="24" className="empty-state">
										Нет объектов
									</td>
								</tr>
							) : (
								filteredObjects.map((obj) => (
									<tr key={obj.id}>
										<td className="sticky-col cell-actions">
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
										<td>{obj["Заказчик"]}</td>
										<td>{obj["Подрядчик"]}</td>
										<td>{obj["№ контр/дог"]}</td>
										<td>{obj["Начало действия договора"]}</td>
										<td>
											{obj["Окончание действия договора"] ||
												obj["окончание действия договора"]}
										</td>
										<td>
											<span
												className={`badge badge-type badge-${(obj["Тип договора"] || "").toLowerCase()}`}
											>
												{obj["Тип договора"]}
											</span>
										</td>
										<td>{obj["Продлеваемость"] || obj["Продлеваемость "]}</td>
										<td>
											{obj["Письмо о повышении стоимости ТО"] ||
												obj["Письмо о повышении стоимость ТО"]}
										</td>
										<td>{obj["Свершившееся повышение цены ТО"]}</td>
										<td>{obj["Доп соглашение"] || obj["Доп соглашени"]}</td>
										<td>{obj["Письма"]}</td>
										<td>{obj["Кто оплачивает ремонт"]}</td>
										<td>{obj["Как оплачиваются доп.работы"]}</td>
										<td>{obj["К доп работам есть ли аванс"]}</td>
										<td>{obj["Адрес полный объекта"]}</td>
										<td>{obj["Адрес сокращенный"]}</td>
										<td>{obj["Наименование объекта"]}</td>
										<td>{obj["РД ИД ПД"]}</td>
										<td>{obj["Арендатор"]}</td>
										<td
											className="cell-systems"
											onClick={(e) => openSystemPicker(obj, e)}
											title="Нажмите для выбора систем"
										>
											<span className="systems-link">
												{obj["Системы"] || <em>Нажмите для выбора</em>}
											</span>
										</td>
										<td>{obj["Расчетное время на обслуживание"]}</td>
										<td>{obj["Контакты"]}</td>
										<td>{obj["Инструмент на объекте"]}</td>
										<td className="cell-notes">{obj["Заметки"]}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* МОДАЛЬНОЕ ОКНО ВЫБОРА СИСТЕМ */}
				{isSystemPickerOpen && systemPickerObject && (
					<div
						className="modal-overlay"
						onClick={() => setIsSystemPickerOpen(false)}
					>
						<div
							className="modal modal-systems"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="modal-header">
								<h2>
									<Settings size={20} />
									Выбор систем для объекта
								</h2>
								<button
									className="modal-close"
									onClick={() => setIsSystemPickerOpen(false)}
								>
									<X size={24} />
								</button>
							</div>
							<div className="modal-body">
								<div className="system-picker-info">
									<strong>{systemPickerObject["Наименование объекта"]}</strong>
									<span className="system-picker-address">
										{systemPickerObject["Адрес сокращенный"] ||
											systemPickerObject["Адрес полный объекта"]}
									</span>
								</div>

								<div className="search-box system-search">
									<Search size={18} />
									<input
										type="text"
										placeholder="Поиск системы..."
										value={systemPickerSearch}
										onChange={(e) => setSystemPickerSearch(e.target.value)}
									/>
								</div>

								<div className="systems-list">
									{filteredSystemTypes.map((system) => (
										<div
											key={system}
											className={`system-item ${selectedSystemsForObject.includes(system) ? "selected" : ""}`}
											onClick={() => toggleSystem(system)}
										>
											<div className="system-checkbox">
												{selectedSystemsForObject.includes(system) && (
													<Check size={16} />
												)}
											</div>
											<span className="system-name">{system}</span>
										</div>
									))}
									{filteredSystemTypes.length === 0 && (
										<div className="systems-empty">
											Системы не найдены. Попробуйте другой запрос.
										</div>
									)}
								</div>

								<div className="system-picker-selected">
									<strong>Выбрано:</strong>
									<span className="selected-tags">
										{selectedSystemsForObject.length > 0 ? (
											selectedSystemsForObject.join(", ")
										) : (
											<em>Ничего не выбрано</em>
										)}
									</span>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => setIsSystemPickerOpen(false)}
								>
									Отмена
								</button>
								<button
									type="button"
									className="btn btn-primary"
									onClick={saveObjectSystems}
								>
									<Check size={18} />
									Сохранить
								</button>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}

	function renderCallsSection() {
		const getStatusBadge = (status) => {
			const statusMap = {
				new: { label: "Новый", class: "stat-new" },
				in_progress: { label: "В работе", class: "stat-progress" },
				completed: { label: "Завершён", class: "stat-completed" },
			};
			const info = statusMap[status] || { label: status, class: "" };
			return <span className={`badge ${info.class}`}>{info.label}</span>;
		};

		return (
			<>
				<div className="content-header">
					<h2>Вызовы (заявки)</h2>
				</div>

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

				<div className="table-container table-horizontal">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Дата заявки</th>
								<th>Дедлайн</th>
								<th>Дата пров.</th>
								<th>Исполнитель</th>
								<th>Помощник</th>
								<th>Статус</th>
								<th>Тип</th>
								<th>Объект</th>
								<th>Адрес</th>
								<th>Арендатор</th>
								<th>Система</th>
								<th>Заявка</th>
								<th>Инструмент</th>
								<th>Приобрести</th>
								<th>В ремонт</th>
								<th>Актирование</th>
								<th>Данные у</th>
								<th>Контакт</th>
								<th>Создатель</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{filteredCalls.length === 0 ? (
								<tr>
									<td colSpan="21" className="empty-state">
										Нет заявок
									</td>
								</tr>
							) : (
								filteredCalls.map((call) => (
									<tr key={call.id}>
										<td>{call.id}</td>
										<td>{call.createdAt || "-"}</td>
										<td>{call.deadline || "-"}</td>
										<td>{call.executionDate || "-"}</td>
										<td>{call.engineer || "-"}</td>
										<td>{call.assistant || "-"}</td>
										<td>{getStatusBadge(call.status)}</td>
										<td>{call.type || "-"}</td>
										<td>{call.objectName || "-"}</td>
										<td>{call.shortAddress || "-"}</td>
										<td>{call.tenant || "-"}</td>
										<td>{call.system || "-"}</td>
										<td className="cell-notes">{call.request || "-"}</td>
										<td className="cell-notes">{call.ourTool || "-"}</td>
										<td className="cell-notes">{call.toPurchase || "-"}</td>
										<td className="cell-notes">{call.toRepair || "-"}</td>
										<td>{call.activation || "-"}</td>
										<td>{call.dataOwner || "-"}</td>
										<td>{call.customerContact || "-"}</td>
										<td>{call.creator || "-"}</td>
										<td>
											{call.status !== "completed" && (
												<button
													className="btn btn-success btn-sm"
													onClick={() =>
														handleStatusChange(call.id, "completed")
													}
													title="Завершить"
												>
													<Check size={14} />
												</button>
											)}
											<button
												className="btn btn-icon btn-edit"
												onClick={() => handleEditCall(call)}
												title="Редактировать"
											>
												<Edit2 size={14} />
											</button>
											<button
												className="btn btn-icon btn-delete"
												onClick={() => handleDeleteCall(call.id)}
												title="Удалить"
											>
												<Trash2 size={14} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				{/* Новый компонент формы вызова */}
				<CallsForm
					objects={objects}
					staff={staff}
					systems={systems}
					contacts={contacts}
					onAddCall={handleAddCall}
					onCreateTransport={handleCreateTransportFromCall}
					onCreateBuy={handleCreateBuyFromCall}
				/>
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
							<div className="form-group">
								<label>Причина</label>
								<input
									type="text"
									value={newCostData.reason}
									onChange={(e) =>
										setNewCostData({ ...newCostData, reason: e.target.value })
									}
									placeholder="Причина затраты"
								/>
							</div>
							<div className="form-group form-group-full">
								<label>Описание</label>
								<textarea
									value={newCostData.description}
									onChange={(e) =>
										setNewCostData({
											...newCostData,
											description: e.target.value,
										})
									}
									rows={2}
									placeholder="Описание затраты..."
								/>
							</div>
							<div className="form-group form-group-full">
								<label>Фото</label>
								<input
									type="file"
									accept="image/*"
									onChange={async (e) => {
										const file = e.target.files[0];
										if (file) {
											const reader = new FileReader();
											reader.onload = (ev) => {
												setNewCostData({
													...newCostData,
													photo: ev.target.result,
												});
											};
											reader.readAsDataURL(file);
										}
									}}
								/>
								{newCostData.photo && (
									<img
										src={newCostData.photo}
										alt="Preview"
										style={{
											maxWidth: "100px",
											marginTop: "8px",
											borderRadius: "8px",
										}}
									/>
								)}
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
					{selectedToolIds.length > 0 && (
						<button className="btn btn-danger" onClick={handleBulkDeleteTools}>
							<Trash2 size={16} />
							Удалить выбранные ({selectedToolIds.length})
						</button>
					)}
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th className="th-checkbox">
									<input
										type="checkbox"
										checked={
											tools.length > 0 &&
											selectedToolIds.length === tools.length
										}
										indeterminate={
											selectedToolIds.length > 0 &&
											selectedToolIds.length < tools.length
										}
										onChange={handleSelectAllTools}
										aria-label="Выбрать все"
									/>
								</th>
								<th>ID</th>
								<th>Инструмент</th>
								<th>Инв. номер</th>
								<th>Марка</th>
								<th>Целевой объект</th>
								<th>Целевой адрес</th>
								<th>Заявка на транспорт</th>
								<th>Статус вызова</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{tools.length === 0 ? (
								<tr>
									<td colSpan="10" className="empty-state">
										Нет инструментов
									</td>
								</tr>
							) : (
								tools.map((t) => (
									<tr
										key={t.id}
										className={`tool-row ${selectedToolIds.includes(t.id) ? "tr-selected" : ""} ${t.transportRequestId ? "has-transport" : ""}`}
										onClick={() => handleToolClick(t)}
										title="Нажмите для редактирования"
									>
										<td
											className="td-checkbox"
											onClick={(e) => e.stopPropagation()}
										>
											<input
												type="checkbox"
												checked={selectedToolIds.includes(t.id)}
												onChange={() => handleToggleToolSelection(t.id)}
												aria-label={`Выбрать инструмент ${t.tool}`}
											/>
										</td>
										<td>{t.id}</td>
										<td>{t.tool}</td>
										<td>{t.inventoryNumber}</td>
										<td>{t.brand}</td>
										<td>{t.objectName || "-"}</td>
										<td>{t.shortAddress || "-"}</td>
										<td>
											{t.transportRequestId ? (
												<span
													className={`transport-badge ${t.isConfirmed ? "confirmed" : "pending"}`}
												>
													{t.isConfirmed ? "✓ " : "• "}Заявка #
													{t.transportRequestId}
												</span>
											) : (
												<span className="text-muted">Не назначен</span>
											)}
										</td>
										<td>
											{t.transportRequestId
												? transportItems.find(
														(tr) => tr.id === t.transportRequestId,
													)?.callStatus || "-"
												: "-"}
										</td>
										<td onClick={(e) => e.stopPropagation()}>
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

	// МОДАЛКА РЕДАКТИРОВАНИЯ ИНСТРУМЕНТА
	function ToolEditModal() {
		if (!isToolModalOpen || !editingTool) return null;

		// Найти статус вызова из связанной заявки на транспорт
		const linkedTransport = transportItems.find(
			(t) => t.id === editingTool.transportRequestId,
		);
		const callStatus = linkedTransport?.callStatus || "-";
		const transportStatus = linkedTransport?.thisStatus || "-";

		return (
			<div className="modal-overlay" onClick={handleCloseToolModal}>
				<div className="modal tool-modal" onClick={(e) => e.stopPropagation()}>
					<div className="modal-header">
						<h2>Редактирование инструмента</h2>
						<button className="modal-close" onClick={handleCloseToolModal}>
							<X size={24} />
						</button>
					</div>
					<div className="modal-body">
						<div className="tool-info-section">
							<h3>Информация об инструменте</h3>
							<div className="form-grid">
								<div className="form-group">
									<label>Инструмент</label>
									<input
										type="text"
										value={editingTool.tool}
										onChange={(e) =>
											setEditingTool({ ...editingTool, tool: e.target.value })
										}
									/>
								</div>
								<div className="form-group">
									<label>Инв. номер</label>
									<input
										type="text"
										value={editingTool.inventoryNumber}
										onChange={(e) =>
											setEditingTool({
												...editingTool,
												inventoryNumber: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Марка</label>
									<input
										type="text"
										value={editingTool.brand}
										onChange={(e) =>
											setEditingTool({ ...editingTool, brand: e.target.value })
										}
									/>
								</div>
							</div>
						</div>

						<div className="tool-target-section">
							<h3>Целевые данные (откуда забираем)</h3>
							<div className="form-grid">
								<div className="form-group">
									<label>Целевой объект</label>
									<input
										type="text"
										value={editingTool.objectName || ""}
										onChange={(e) =>
											setEditingTool({
												...editingTool,
												objectName: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Целевой адрес</label>
									<input
										type="text"
										value={editingTool.shortAddress || ""}
										onChange={(e) =>
											setEditingTool({
												...editingTool,
												shortAddress: e.target.value,
											})
										}
									/>
								</div>
							</div>
						</div>

						<div className="tool-transport-section">
							<h3>Заявка на транспорт</h3>
							<div className="form-grid">
								<div className="form-group">
									<label>Выберите заявку на транспорт</label>
									<select
										value={editingTool.transportRequestId || ""}
										onChange={(e) =>
											setEditingTool({
												...editingTool,
												transportRequestId: e.target.value
													? Number(e.target.value)
													: null,
												isConfirmed: false,
											})
										}
									>
										<option value="">-- Не назначен --</option>
										{transportItems
											.filter((t) => t.thisStatus !== "Выполнена")
											.map((t) => (
												<option key={t.id} value={t.id}>
													Заявка #{t.id} - {t.objectName || "Без объекта"} (
													{t.shortAddress || "нет адреса"})
												</option>
											))}
									</select>
								</div>
								<div className="form-group">
									<label>Статус заявки на транспорт</label>
									<div className="info-field">{transportStatus}</div>
								</div>
								<div className="form-group">
									<label>Статус вызова</label>
									<div className="info-field">{callStatus}</div>
								</div>
							</div>
							{editingTool.transportRequestId && !editingTool.isConfirmed && (
								<button
									type="button"
									className="btn btn-primary btn-confirm"
									onClick={handleConfirmToolSelection}
								>
									Подтвердите выбор
								</button>
							)}
							{editingTool.transportRequestId && editingTool.isConfirmed && (
								<div className="confirmed-badge">✓ Выбор подтверждён</div>
							)}
						</div>

						<div className="tool-fact-section">
							<h3>Фактические данные (куда доставлен)</h3>
							<div className="form-grid">
								<div className="form-group">
									<label>Фактический объект</label>
									<input
										type="text"
										value={editingTool.factObjectName || ""}
										onChange={(e) =>
											setEditingTool({
												...editingTool,
												factObjectName: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Фактический адрес</label>
									<input
										type="text"
										value={editingTool.factShortAddress || ""}
										onChange={(e) =>
											setEditingTool({
												...editingTool,
												factShortAddress: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Дата прибытия</label>
									<input
										type="text"
										value={editingTool.arrivalDate || ""}
										onChange={(e) =>
											setEditingTool({
												...editingTool,
												arrivalDate: e.target.value,
											})
										}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={handleCloseToolModal}
						>
							Отмена
						</button>
						<button
							type="button"
							className="btn btn-primary"
							onClick={handleSaveTool}
						>
							Сохранить
						</button>
					</div>
				</div>
			</div>
		);
	}

	function renderBuySection() {
		// Обработчик выбора объекта - автозаполнение данных
		const handleObjectSelect = (objectName) => {
			const selectedObject = objects.find(
				(o) => o["Наименование объекта"] === objectName,
			);
			if (selectedObject) {
				setNewBuyData({
					...newBuyData,
					objectName: selectedObject["Наименование объекта"] || "",
					contractNumber: selectedObject["№ контр/дог"] || "",
					shortAddress: selectedObject["Адрес сокращенный"] || "",
					payer: selectedObject["Кто оплачивает ремонт"] || "",
				});
			} else {
				setNewBuyData({ ...newBuyData, objectName });
			}
		};

		// Обработчик изменения статуса
		const handleStatusChange = (id, newStatus) => {
			setBuyItems(
				buyItems.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
			);
		};

		// Статус заявки на покупку
		const getBuyStatusBadge = (status) => {
			const statusMap = {
				[BUY_STATUS.ORDERED]: { label: "Заказан счёт", class: "badge-order" },
				[BUY_STATUS.WAITING_CONFIRM]: {
					label: "Ждёт подтверждения",
					class: "badge-wait",
				},
				[BUY_STATUS.CAN_PAY]: { label: "Можно оплачивать", class: "badge-pay" },
				[BUY_STATUS.PAID]: { label: "Счёт оплачен", class: "badge-paid" },
				[BUY_STATUS.WAREHOUSE]: {
					label: "На складе",
					class: "badge-warehouse",
				},
				[BUY_STATUS.OFFICE]: { label: "В офисе", class: "badge-office" },
			};
			const info = statusMap[status] || { label: status, class: "" };
			return <span className={`badge ${info.class}`}>{info.label}</span>;
		};

		const uniqueObjects = [
			...new Set(objects.map((o) => o["Наименование объекта"]).filter(Boolean)),
		];

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
								<th>№ дог/контр</th>
								<th>Адрес</th>
								<th>Что купить</th>
								<th>Плательщик</th>
								<th>Создатель</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{buyItems.length === 0 ? (
								<tr>
									<td colSpan="11" className="empty-state">
										Нет закупок
									</td>
								</tr>
							) : (
								buyItems.map((b) => (
									<tr key={b.id}>
										<td className="cell-id">{b.id}</td>
										<td>{b.requestDate}</td>
										<td>
											{b.deadline || <span className="text-muted">—</span>}
										</td>
										<td>
											<select
												value={b.status}
												onChange={(e) =>
													handleStatusChange(b.id, e.target.value)
												}
												style={{
													padding: "4px 8px",
													borderRadius: "6px",
													border: "1px solid var(--border)",
												}}
											>
												<option value={BUY_STATUS.ORDERED}>Заказан счёт</option>
												<option value={BUY_STATUS.WAITING_CONFIRM}>
													Счёт ждёт подтверждения
												</option>
												<option value={BUY_STATUS.CAN_PAY}>
													Счёт можно оплачивать
												</option>
												<option value={BUY_STATUS.PAID}>Счёт оплачен</option>
												<option value={BUY_STATUS.WAREHOUSE}>
													Заказ на складе
												</option>
												<option value={BUY_STATUS.OFFICE}>Заказ в офисе</option>
											</select>
										</td>
										<td>{b.objectName}</td>
										<td>
											{b.contractNumber || (
												<span className="text-muted">—</span>
											)}
										</td>
										<td>
											{b.shortAddress || <span className="text-muted">—</span>}
										</td>
										<td>{b.whatToBuy}</td>
										<td>{b.payer || <span className="text-muted">—</span>}</td>
										<td>
											{b.creator || <span className="text-muted">—</span>}
										</td>
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
									placeholder="дд.мм.гггг"
									onChange={(e) =>
										setNewBuyData({ ...newBuyData, deadline: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label>Объект *</label>
								<select
									value={newBuyData.objectName}
									onChange={(e) => handleObjectSelect(e.target.value)}
								>
									<option value="">Выберите объект</option>
									{uniqueObjects.map((name) => (
										<option key={name} value={name}>
											{name}
										</option>
									))}
								</select>
							</div>
							<div className="form-group">
								<label>№ договор/контр</label>
								<input
									type="text"
									value={newBuyData.contractNumber}
									placeholder="Авто из объекта"
									onChange={(e) =>
										setNewBuyData({
											...newBuyData,
											contractNumber: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Адрес</label>
								<input
									type="text"
									value={newBuyData.shortAddress}
									placeholder="Авто из объекта"
									onChange={(e) =>
										setNewBuyData({
											...newBuyData,
											shortAddress: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Кто оплачивает</label>
								<input
									type="text"
									value={newBuyData.payer}
									placeholder="Авто из объекта"
									onChange={(e) =>
										setNewBuyData({ ...newBuyData, payer: e.target.value })
									}
								/>
							</div>
							<div className="form-group form-group-full">
								<label>Что нужно приобрести *</label>
								<textarea
									value={newBuyData.whatToBuy}
									placeholder="Опишите что нужно приобрести..."
									rows={3}
									onChange={(e) =>
										setNewBuyData({ ...newBuyData, whatToBuy: e.target.value })
									}
								/>
							</div>
						</div>
						<div
							style={{
								marginTop: "16px",
								padding: "12px",
								background: "var(--gray-50)",
								borderRadius: "8px",
								fontSize: "0.85rem",
							}}
						>
							<strong>Важно:</strong>
							<ul style={{ margin: "8px 0 0 20px", paddingLeft: "16px" }}>
								<li>
									При статусе "Заказан счёт" автоматически создаётся запись во
									вкладке "Счета"
								</li>
								<li>
									Если плательщик отличается от "всё за наш счёт", создаётся
									заявка на актирование
								</li>
								<li>Создатель заявки заполняется автоматически</li>
							</ul>
						</div>
						<button
							type="submit"
							className="btn btn-primary"
							style={{ marginTop: "16px" }}
						>
							<Plus size={18} />
							Добавить закупку
						</button>
					</form>
				</div>
			</>
		);
	}

	function renderTransportSection() {
		// Обработчик выбора объекта из списка - подтягивает ВСЕ данные из объекта
		const handleObjectSelect = (objectName) => {
			const selectedObject = objects.find(
				(o) => o["Наименование объекта"] === objectName,
			);
			if (selectedObject) {
				setNewTransportData({
					...newTransportData,
					objectId: selectedObject.id,
					objectNumber: selectedObject.objectNumber,
					objectName: selectedObject["Наименование объекта"] || "",
					shortAddress: selectedObject["Адрес сокращенный"] || "",
				});
			} else {
				setNewTransportData({
					...newTransportData,
					objectId: null,
					objectName: objectName,
				});
			}
		};

		// Статусы для заявки на транспорт (новые коды 0-5)
		const transportStatuses = [
			{ value: "0", label: "Черновик", className: "stat-draft" },
			{ value: "1", label: "Сформирована", className: "stat-new" },
			{ value: "2", label: "Дата назначена", className: "stat-progress" },
			{ value: "3", label: "В машине", className: "stat-incar" },
			{ value: "4", label: "В ремонте", className: "stat-repair" },
			{ value: "5", label: "Выполнено", className: "stat-completed" },
		];

		const getStatusBadge = (status) => {
			const statusInfo = transportStatuses.find(
				(s) => s.value === String(status),
			);
			if (!statusInfo) return <span className="badge">{status}</span>;
			return (
				<span className={`badge ${statusInfo.className}`}>
					{statusInfo.label}
				</span>
			);
		};

		// Проверка дедлайна - красный если <= 2 дней
		const getDeadlineClass = (deadline) => {
			if (!deadline) return "deadline-empty";
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const deadlineDate = new Date(deadline);
			deadlineDate.setHours(0, 0, 0, 0);
			const diffDays = Math.ceil(
				(deadlineDate - today) / (1000 * 60 * 60 * 24),
			);
			if (diffDays <= 2) return "deadline-urgent";
			return "";
		};

		// Сортировка персонала: водители -> курьеры -> инженеры
		const getSortedStaff = () => {
			return [...staff].sort((a, b) => {
				const catA = STAFF_CATEGORIES[a.category] || 99;
				const catB = STAFF_CATEGORIES[b.category] || 99;
				if (catA !== catB) return catA - catB;
				return a.fullName.localeCompare(b.fullName);
			});
		};

		// Получить статус связанной закупки
		const getLinkedPurchaseStatus = (linkedId) => {
			if (!linkedId) return "-";
			const purchase = buyItems.find((b) => b.id === linkedId);
			return purchase?.status || "-";
		};

		// Получить статус связанного вызова
		const getLinkedCallStatus = (linkedId) => {
			if (!linkedId) return "-";
			const call = calls.find((c) => c.id === linkedId);
			return call?.status || "-";
		};

		// Статистика
		const stats = {
			new: transportItems.filter((t) => t.thisStatus === "1").length,
			progress: transportItems.filter((t) =>
				["2", "3", "4"].includes(String(t.thisStatus)),
			).length,
			completed: transportItems.filter((t) => t.thisStatus === "5").length,
		};

		return (
			<>
				<div className="content-header">
					<h2>Заявки на транспорт</h2>
				</div>

				{/* Статистика заявок */}
				<div className="calls-stats">
					<div className="stat-card stat-new">
						<div className="stat-icon">
							<AlertCircle size={20} />
						</div>
						<div className="stat-info">
							<span className="stat-count">{stats.new}</span>
							<span className="stat-label">Сформировано</span>
						</div>
					</div>
					<div className="stat-card stat-progress">
						<div className="stat-icon">
							<Clock size={20} />
						</div>
						<div className="stat-info">
							<span className="stat-count">{stats.progress}</span>
							<span className="stat-label">В работе</span>
						</div>
					</div>
					<div className="stat-card stat-completed">
						<div className="stat-icon">
							<Check size={20} />
						</div>
						<div className="stat-info">
							<span className="stat-count">{stats.completed}</span>
							<span className="stat-label">Выполнено</span>
						</div>
					</div>
				</div>

				<div className="table-container table-horizontal">
					<table className="data-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Дата</th>
								<th className="th-deadline">Дедлайн</th>
								<th>Кому</th>
								<th>Закупка</th>
								<th>Вызов</th>
								<th>Статус</th>
								<th>Объект</th>
								<th>Адрес</th>
								<th>Что везти</th>
								<th>Инструменты</th>
								<th>Создатель</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{transportItems.length === 0 ? (
								<tr>
									<td colSpan="13" className="empty-state">
										Нет заявок на транспорт
									</td>
								</tr>
							) : (
								transportItems.map((t) => (
									<tr key={t.id}>
										<td>{t.id}</td>
										<td>{t.requestDate || "-"}</td>
										<td className={getDeadlineClass(t.deadline)}>
											{t.deadline || "–"}
										</td>
										<td>{t.assignedTo || "-"}</td>
										<td>
											{getLinkedPurchaseStatus(t.linkedPurchaseId) ||
												t.purchaseStatus ||
												"-"}
										</td>
										<td>
											{getLinkedCallStatus(t.linkedCallId) ||
												t.callStatus ||
												"-"}
										</td>
										<td>{getStatusBadge(t.thisStatus)}</td>
										<td>{t.objectName || "-"}</td>
										<td>{t.shortAddress || "-"}</td>
										<td>{t.whatToTransport || "-"}</td>
										<td>{t.toolsList || "-"}</td>
										<td>{t.creator || "-"}</td>
										<td>
											<button
												className="btn-icon btn-edit"
												onClick={() => handleEditTransport(t)}
												title="Редактировать"
											>
												<Edit2 size={16} />
											</button>
											<button
												className="btn-icon btn-delete"
												onClick={() => handleDeleteTransport(t.id)}
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
						Новая заявка на транспорт
					</h3>
					<form onSubmit={handleAddTransport} className="add-form">
						<div className="form-grid">
							{/* Дата заявки - автозаполняется */}
							<div className="form-group">
								<label>Дата заявки</label>
								<input
									type="text"
									value={newTransportData.requestDate}
									disabled
									className="input-disabled"
								/>
							</div>

							{/* Дедлайн с цветовой индикацией */}
							<div className="form-group">
								<label
									className={
										getDeadlineClass(newTransportData.deadline)
											? "label-deadline-urgent"
											: ""
									}
								>
									Дедлайн
									{newTransportData.deadline && (
										<span className="deadline-hint">
											{" "}
											(
											{getDeadlineClass(newTransportData.deadline) ===
											"deadline-urgent"
												? "Скоро!"
												: "Норма"}
											)
										</span>
									)}
								</label>
								<input
									type="date"
									value={newTransportData.deadline}
									className={getDeadlineClass(newTransportData.deadline)}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											deadline: e.target.value,
										})
									}
								/>
							</div>

							{/* Дата назначено */}
							<div className="form-group">
								<label>Дата назначено</label>
								<input
									type="date"
									value={newTransportData.assignedDate}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											assignedDate: e.target.value,
										})
									}
								/>
							</div>

							{/* Кому - выпадающий список отсортированный */}
							<div className="form-group">
								<label>Кому (исполнитель)</label>
								<select
									value={newTransportData.assignedTo}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											assignedTo: e.target.value,
										})
									}
								>
									<option value="">-- Выберите --</option>
									<optgroup label="Водители">
										{getSortedStaff()
											.filter((s) => s.category === "driver")
											.map((s) => (
												<option key={s.id} value={s.fullName}>
													{s.fullName}
												</option>
											))}
									</optgroup>
									<optgroup label="Курьеры">
										{getSortedStaff()
											.filter((s) => s.category === "courier")
											.map((s) => (
												<option key={s.id} value={s.fullName}>
													{s.fullName}
												</option>
											))}
									</optgroup>
									<optgroup label="Инженеры">
										{getSortedStaff()
											.filter((s) => s.category === "engineer")
											.map((s) => (
												<option key={s.id} value={s.fullName}>
													{s.fullName}
												</option>
											))}
									</optgroup>
								</select>
							</div>

							{/* Статус заявки на закупку -readonly */}
							<div className="form-group">
								<label>Статус заявки на закупку</label>
								<div className="info-field">
									{newTransportData.linkedPurchaseId
										? getLinkedPurchaseStatus(newTransportData.linkedPurchaseId)
										: newTransportData.purchaseStatus || "-"}
								</div>
							</div>

							{/* Статус вызова - readonly */}
							<div className="form-group">
								<label>Статус вызова</label>
								<div className="info-field">
									{newTransportData.linkedCallId
										? getLinkedCallStatus(newTransportData.linkedCallId)
										: newTransportData.callStatus || "-"}
								</div>
							</div>

							{/* Статус этой заявки - новые коды */}
							<div className="form-group">
								<label>Статус заявки</label>
								<select
									value={newTransportData.thisStatus || "0"}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											thisStatus: e.target.value,
										})
									}
								>
									<option value="0">0 - Черновик</option>
									<option value="1">1 - Сформирована</option>
									<option value="2">2 - Дата назначена</option>
									<option value="3">3 - В машине</option>
									<option value="4">4 - В ремонте</option>
									<option value="5">5 - Выполнено</option>
								</select>
							</div>

							{/* Наименование объекта - автозаполнение */}
							<div className="form-group">
								<label>Объект *</label>
								<input
									type="text"
									value={newTransportData.objectName || ""}
									onChange={(e) => handleObjectSelect(e.target.value)}
									placeholder="Введите номер или название"
									list="transport-objects-list"
									required
								/>
								<div className="form-hint">
									Введите номер объекта (1, 2...) или название
								</div>
								<datalist id="transport-objects-list">
									{objects.map((obj) => (
										<option
											key={obj.id}
											value={`${obj.objectNumber || obj.id}. ${obj["Наименование объекта"]}`}
										/>
									))}
								</datalist>
							</div>

							{/* Сокращенный адрес - автозаполнение */}
							<div className="form-group">
								<label>Сокращенный адрес</label>
								<input
									type="text"
									value={newTransportData.shortAddress}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											shortAddress: e.target.value,
										})
									}
									placeholder="Заполняется автоматически"
								/>
							</div>

							{/* Что нужно транспортировать - ОБЯЗАТЕЛЬНО */}
							<div className="form-group form-group-full">
								<label className="label-required">
									Что нужно транспортировать *
								</label>
								<input
									type="text"
									value={newTransportData.whatToTransport}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											whatToTransport: e.target.value,
										})
									}
									placeholder="Обязательно для заполнения"
									required
								/>
							</div>

							{/* Перечень инструмента */}
							<div className="form-group form-group-full">
								<label>Перечень инструмента</label>
								<textarea
									value={newTransportData.toolsList}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											toolsList: e.target.value,
										})
									}
									rows={3}
									placeholder="Список инструмента для перевозки (можно выбрать в разделе Инструменты)"
								/>
							</div>

							{/* Создатель заявки - автозаполняется */}
							<div className="form-group">
								<label>Создатель заявки</label>
								<input
									type="text"
									value={newTransportData.creator}
									disabled
									className="input-disabled"
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Создать заявку
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
		// Обработчик выбора объекта
		const handleObjectSelect = (objectName) => {
			const selectedObject = objects.find(
				(o) => o["Наименование объекта"] === objectName,
			);
			if (selectedObject) {
				setNewTimeData({
					...newTimeData,
					objectName: selectedObject["Наименование объекта"] || "",
					shortAddress: selectedObject["Адрес сокращенный"] || "",
					fullAddress: selectedObject["Адрес полный"] || "",
					objectId: selectedObject.id,
					contractNumber: selectedObject["№ контр/дог"] || "",
				});
			} else {
				setNewTimeData({ ...newTimeData, objectName });
			}
		};

		const uniqueObjects = [
			...new Set(objects.map((o) => o["Наименование объекта"]).filter(Boolean)),
		];
		const availableTenants = LARGE_OBJECT_TENANTS[newTimeData.objectName] || [];
		const isLargeObject = newTimeData.objectName in LARGE_OBJECT_TENANTS;
		const availableSystems = getSystemsForObject(newTimeData.objectName);

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
								<th>Адрес сокр.</th>
								<th>Адрес полн.</th>
								<th>Арендатор</th>
								<th>Системы</th>
								<th>Расч. время (ч/год)</th>
								<th>Факт. время (ч/год)</th>
								<th>Разница</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{timeEntries.length === 0 ? (
								<tr>
									<td colSpan="13" className="empty-state">
										Нет записей
									</td>
								</tr>
							) : (
								timeEntries.map((t) => (
									<tr key={t.id}>
										<td className="cell-id">{t.id}</td>
										<td>{t.customer}</td>
										<td>{t.contractor}</td>
										<td>{t.contractNumber}</td>
										<td>{t.objectName}</td>
										<td>
											{t.shortAddress || <span className="text-muted">—</span>}
										</td>
										<td>
											{t.fullAddress || <span className="text-muted">—</span>}
										</td>
										<td>{t.tenant || <span className="text-muted">—</span>}</td>
										<td>{t.systemsDisplay || t.systems || "—"}</td>
										<td>{t.calculatedYearlyTime} ч</td>
										<td>{t.actualYearlyTime} ч</td>
										<td>
											<span
												className={
													parseFloat(t.timeDifference) >= 0
														? "text-success"
														: "text-danger"
												}
											>
												{t.timeDifference} ч
											</span>
										</td>
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
									placeholder="Название заказчика"
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
									placeholder="Авто из объекта"
									onChange={(e) =>
										setNewTimeData({
											...newTimeData,
											contractNumber: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Объект *</label>
								<select
									value={newTimeData.objectName}
									onChange={(e) => handleObjectSelect(e.target.value)}
								>
									<option value="">Выберите объект</option>
									{uniqueObjects.map((name) => (
										<option key={name} value={name}>
											{name}
										</option>
									))}
								</select>
							</div>
							<div className="form-group">
								<label>Адрес сокращённый</label>
								<input
									type="text"
									value={newTimeData.shortAddress}
									placeholder="Авто из объекта"
									onChange={(e) =>
										setNewTimeData({
											...newTimeData,
											shortAddress: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Адрес полный</label>
								<input
									type="text"
									value={newTimeData.fullAddress}
									placeholder="Полный адрес объекта"
									onChange={(e) =>
										setNewTimeData({
											...newTimeData,
											fullAddress: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>
									Арендатор {isLargeObject ? "*" : "(для крупных объектов)"}
								</label>
								{isLargeObject ? (
									<select
										value={newTimeData.tenant}
										onChange={(e) =>
											setNewTimeData({ ...newTimeData, tenant: e.target.value })
										}
									>
										<option value="">Выберите арендатора</option>
										{availableTenants.map((t) => (
											<option key={t} value={t}>
												{t}
											</option>
										))}
									</select>
								) : (
									<input
										type="text"
										value={newTimeData.tenant}
										placeholder="Не требуется"
										disabled
										onChange={(e) =>
											setNewTimeData({ ...newTimeData, tenant: e.target.value })
										}
									/>
								)}
							</div>
							<div className="form-group form-group-full">
								<label>Системы (оборудование)</label>
								{newTimeData.systems?.length > 0 && (
									<div className="selected-systems">
										{newTimeData.systems.map((sys) => (
											<span key={sys.id} className="system-tag">
												{sys.systemName}
												{sys.quantity ? ` (${sys.quantity})` : ""}
												<button
													type="button"
													className="system-tag-remove"
													onClick={() => handleRemoveSystemFromTime(sys.id)}
												>
													&times;
												</button>
											</span>
										))}
									</div>
								)}
								<div
									style={{ display: "flex", gap: "8px", alignItems: "center" }}
								>
									<select
										value=""
										onChange={(e) => {
											if (e.target.value === "__new__") {
												setIsTimeSystemModalOpen(true);
											} else if (e.target.value) {
												const sys = availableSystems.find(
													(s) =>
														s.id === parseInt(e.target.value) ||
														s.id === e.target.value,
												);
												if (
													sys &&
													!newTimeData.systems?.find((s) => s.id === sys.id)
												) {
													setNewTimeData({
														...newTimeData,
														systems: [...(newTimeData.systems || []), sys],
													});
												}
											}
										}}
									>
										<option value="">Выберите систему...</option>
										{availableSystems.map((sys) => (
											<option key={sys.id} value={sys.id}>
												{sys.systemName}{" "}
												{sys.quantity ? `(${sys.quantity})` : ""}
												{sys.fromExcel ? " [из Excel]" : ""}
											</option>
										))}
										<option value="__new__">+ Новая система</option>
									</select>
								</div>
							</div>
							<div className="form-group">
								<label>Расчётное время на ТО (ч/год)</label>
								<div
									style={{ display: "flex", alignItems: "center", gap: "8px" }}
								>
									<input
										type="range"
										min="0"
										max="2000"
										value={parseFloat(newTimeData.calculatedYearlyTime) || 0}
										onChange={(e) =>
											setNewTimeData({
												...newTimeData,
												calculatedYearlyTime: parseFloat(e.target.value),
											})
										}
										style={{ flex: 1 }}
									/>
									<input
										type="number"
										min="0"
										value={parseFloat(newTimeData.calculatedYearlyTime) || 0}
										onChange={(e) =>
											setNewTimeData({
												...newTimeData,
												calculatedYearlyTime: parseFloat(e.target.value) || 0,
											})
										}
										style={{ width: "80px" }}
									/>
									<span>ч</span>
								</div>
							</div>
							<div className="form-group">
								<label>Фактическое время на ТО (ч/год)</label>
								<div
									style={{ display: "flex", alignItems: "center", gap: "8px" }}
								>
									<input
										type="range"
										min="0"
										max="2000"
										value={parseFloat(newTimeData.actualYearlyTime) || 0}
										onChange={(e) =>
											setNewTimeData({
												...newTimeData,
												actualYearlyTime: parseFloat(e.target.value),
											})
										}
										style={{ flex: 1 }}
									/>
									<input
										type="number"
										min="0"
										value={parseFloat(newTimeData.actualYearlyTime) || 0}
										onChange={(e) =>
											setNewTimeData({
												...newTimeData,
												actualYearlyTime: parseFloat(e.target.value) || 0,
											})
										}
										style={{ width: "80px" }}
									/>
									<span>ч</span>
								</div>
							</div>
							<div className="form-group">
								<label>Разность (расчётное − фактическое)</label>
								<div
									style={{
										padding: "10px 16px",
										background:
											(parseFloat(newTimeData.calculatedYearlyTime) || 0) >=
											(parseFloat(newTimeData.actualYearlyTime) || 0)
												? "#e8f5e9"
												: "#ffebee",
										borderRadius: "8px",
										fontWeight: "bold",
										color:
											(parseFloat(newTimeData.calculatedYearlyTime) || 0) >=
											(parseFloat(newTimeData.actualYearlyTime) || 0)
												? "#2e7d32"
												: "#c62828",
									}}
								>
									{(
										(parseFloat(newTimeData.calculatedYearlyTime) || 0) -
										(parseFloat(newTimeData.actualYearlyTime) || 0)
									).toFixed(1)}{" "}
									ч
								</div>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Добавить запись
						</button>
					</form>
				</div>

				{/* МОДАЛКА НОВОЙ СИСТЕМЫ */}
				{isTimeSystemModalOpen && (
					<div
						className="modal-overlay"
						onClick={() => setIsTimeSystemModalOpen(false)}
					>
						<div className="modal" onClick={(e) => e.stopPropagation()}>
							<div className="modal-header">
								<h3>Новая система</h3>
								<button
									className="modal-close"
									onClick={() => setIsTimeSystemModalOpen(false)}
								>
									&times;
								</button>
							</div>
							<div className="modal-body">
								<form onSubmit={handleAddTimeSystem}>
									<div className="form-group">
										<label>Название системы *</label>
										<input
											type="text"
											value={newTimeSystemData.systemName}
											placeholder="Например: АПС, СОУЭ, ПС"
											onChange={(e) =>
												setNewTimeSystemData({
													...newTimeSystemData,
													systemName: e.target.value,
													objectName: newTimeData.objectName,
												})
											}
										/>
									</div>
									<div className="form-group">
										<label>Тип оборудования</label>
										<input
											type="text"
											value={newTimeSystemData.systemType}
											placeholder="Например: рукава, датчики, огнетушители"
											onChange={(e) =>
												setNewTimeSystemData({
													...newTimeSystemData,
													systemType: e.target.value,
												})
											}
										/>
									</div>
									<div className="form-group">
										<label>Количество</label>
										<input
											type="number"
											min="0"
											value={newTimeSystemData.quantity}
											onChange={(e) =>
												setNewTimeSystemData({
													...newTimeSystemData,
													quantity: e.target.value,
												})
											}
										/>
									</div>
									<div className="form-actions">
										<button
											type="button"
											className="btn btn-secondary"
											onClick={() => setIsTimeSystemModalOpen(false)}
										>
											Отмена
										</button>
										<button type="submit" className="btn btn-primary">
											Добавить систему
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}

	function RenderRDSection({ onFolderCountChange }) {
		const [rdFolders, setRDFolders] = useState([]);
		const [rdFiles, setRDFiles] = useState([]);
		const [currentFolder, setCurrentFolder] = useState(null);
		const [isCreatingFolder, setIsCreatingFolder] = useState(false);
		const [newFolderName, setNewFolderName] = useState("");
		const [searchQ, setSearchQ] = useState("");
		const [loading, setLoading] = useState(true);
		const fileInputRef = useRef(null);
		const apiBase = "http://37.252.17.205:3001/api";

		// Загрузка данных с сервера
		const loadData = async () => {
			setLoading(true);
			try {
				const [foldersRes, filesRes] = await Promise.all([
					fetch(`${apiBase}/rd/folders`),
					fetch(`${apiBase}/rd/files`),
				]);
				if (foldersRes.ok) {
					const folders = await foldersRes.json();
					setRDFolders(Array.isArray(folders) ? folders : []);
					onFolderCountChange?.(Array.isArray(folders) ? folders.length : 0);
				}
				if (filesRes.ok) {
					const files = await filesRes.json();
					setRDFiles(Array.isArray(files) ? files : []);
				}
			} catch (err) {
				console.error("RD load error:", err);
			}
			setLoading(false);
		};

		useEffect(() => {
			loadData();
		}, []);

		const breadcrumbs = [];
		let parent = currentFolder;
		while (parent) {
			breadcrumbs.unshift(parent);
			parent = rdFolders.find((f) => f.id === parent.parent_id);
		}

		const currentFolders = rdFolders.filter(
			(f) => f.parent_id === (currentFolder ? currentFolder.id : null),
		);
		const currentFiles = rdFiles.filter(
			(f) => f.folder_id === (currentFolder ? currentFolder.id : null),
		);

		const filteredFolders = currentFolders.filter(
			(f) =>
				!searchQ ||
				(f.name || "").toLowerCase().includes(searchQ.toLowerCase()),
		);
		const filteredFiles = currentFiles.filter(
			(f) =>
				!searchQ ||
				(f.name || "").toLowerCase().includes(searchQ.toLowerCase()),
		);

		const createFolder = async () => {
			if (!newFolderName.trim()) return;
			try {
				const res = await fetch(`${apiBase}/rd/folders`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: newFolderName.trim(),
						parentId: currentFolder ? currentFolder.id : null,
					}),
				});
				if (res.ok) await loadData();
			} catch (err) {
				console.error("Create folder error:", err);
			}
			setNewFolderName("");
			setIsCreatingFolder(false);
		};

		const deleteFolder = async (folderId) => {
			if (!confirm("Удалить папку и все вложения?")) return;
			try {
				const res = await fetch(`${apiBase}/rd/folders/${folderId}`, {
					method: "DELETE",
				});
				if (res.ok) {
					await loadData();
				}
			} catch (err) {
				console.error("Delete folder error:", err);
			}
		};

		const handleFileUpload = async (e) => {
			const files = Array.from(e.target.files || []);
			for (const file of files) {
				const formData = new FormData();
				formData.append("file", file);
				if (currentFolder)
					formData.append("folderId", String(currentFolder.id));
				try {
					await fetch(`${apiBase}/rd/files`, {
						method: "POST",
						body: formData,
					});
				} catch (err) {
					console.error("Upload error:", err);
				}
			}
			e.target.value = "";
			await loadData();
		};

		const downloadFile = (file) => {
			window.open(`${apiBase}/rd/files/${file.id}/download`, "_blank");
		};

		const deleteFile = async (fileId) => {
			if (!confirm("Удалить файл?")) return;
			try {
				const res = await fetch(`${apiBase}/rd/files/${fileId}`, {
					method: "DELETE",
				});
				if (res.ok) await loadData();
			} catch (err) {
				console.error("Delete file error:", err);
			}
		};

		const formatSize = (bytes) => {
			if (!bytes) return "—";
			if (bytes < 1024) return bytes + " B";
			if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
			return (bytes / (1024 * 1024)).toFixed(1) + " MB";
		};

		const formatDate = (iso) => {
			if (!iso) return "—";
			return new Date(iso).toLocaleDateString("ru-RU");
		};

		if (loading) {
			return (
				<div className="section">
					<div className="content-header">
						<h2>РД — Рабочая документация</h2>
					</div>
					<div className="loading">Загрузка данных...</div>
				</div>
			);
		}

		return (
			<div className="section">
				<div className="content-header">
					<div className="content-header-left">
						<h2>РД — Рабочая документация</h2>
					</div>
					<div className="content-header-right">
						<button
							className="btn btn-secondary"
							onClick={() => setIsCreatingFolder(true)}
						>
							<FolderPlus size={16} /> Создать папку
						</button>
						<button
							className="btn btn-primary"
							onClick={() => fileInputRef.current?.click()}
						>
							<Upload size={16} /> Загрузить файл
						</button>
						<input
							ref={fileInputRef}
							type="file"
							multiple
							style={{ display: "none" }}
							onChange={handleFileUpload}
						/>
					</div>
				</div>

				{currentFolder && (
					<div className="rd-breadcrumbs">
						<button className="rd-crumb" onClick={() => setCurrentFolder(null)}>
							РД
						</button>
						{breadcrumbs.map((f) => (
							<button
								key={f.id}
								className="rd-crumb"
								onClick={() => setCurrentFolder(f)}
							>
								<span className="rd-crumb-sep">/</span> {f.name}
							</button>
						))}
					</div>
				)}

				<div className="rd-search">
					<Search size={16} className="rd-search-icon" />
					<input
						type="text"
						placeholder="Поиск..."
						value={searchQ}
						onChange={(e) => setSearchQ(e.target.value)}
						className="rd-search-input"
					/>
				</div>

				<div className="rd-content">
					{isCreatingFolder && (
						<div className="rd-create-folder">
							<FolderPlus size={16} />
							<input
								autoFocus
								type="text"
								value={newFolderName}
								onChange={(e) => setNewFolderName(e.target.value)}
								placeholder="Название папки..."
								onKeyDown={(e) => {
									if (e.key === "Enter") createFolder();
									if (e.key === "Escape") setIsCreatingFolder(false);
								}}
							/>
							<button className="btn btn-primary btn-sm" onClick={createFolder}>
								Создать
							</button>
							<button
								className="btn btn-secondary btn-sm"
								onClick={() => setIsCreatingFolder(false)}
							>
								Отмена
							</button>
						</div>
					)}

					{filteredFolders.length > 0 && (
						<div className="rd-section">
							<h3 className="rd-section-title">Папки</h3>
							<div className="rd-grid">
								{filteredFolders.map((folder) => (
									<div key={folder.id} className="rd-item rd-folder">
										<div
											className="rd-item-icon"
											onClick={() => setCurrentFolder(folder)}
										>
											<Folder size={40} />
										</div>
										<div className="rd-item-info">
											<span
												className="rd-item-name"
												onClick={() => setCurrentFolder(folder)}
											>
												{folder.name}
											</span>
											<span className="rd-item-meta">
												{formatDate(folder.created_at)}
											</span>
										</div>
										<div className="rd-item-actions">
											<button
												className="btn btn-icon"
												title="Удалить"
												onClick={() => deleteFolder(folder.id)}
											>
												<Trash size={16} />
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{filteredFiles.length > 0 && (
						<div className="rd-section">
							<h3 className="rd-section-title">Файлы</h3>
							<div className="rd-grid">
								{filteredFiles.map((file) => (
									<div key={file.id} className="rd-item rd-file">
										<div
											className="rd-item-icon"
											onClick={() => downloadFile(file)}
										>
											<File size={40} />
										</div>
										<div className="rd-item-info">
											<span
												className="rd-item-name"
												onClick={() => downloadFile(file)}
											>
												{file.name}
											</span>
											<span className="rd-item-meta">
												{formatSize(file.size)} · {formatDate(file.created_at)}
											</span>
										</div>
										<div className="rd-item-actions">
											<button
												className="btn btn-icon"
												title="Скачать"
												onClick={() => downloadFile(file)}
											>
												<Download size={16} />
											</button>
											<button
												className="btn btn-icon"
												title="Удалить"
												onClick={() => deleteFile(file.id)}
											>
												<Trash size={16} />
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{filteredFolders.length === 0 &&
						filteredFiles.length === 0 &&
						!isCreatingFolder && (
							<div className="rd-empty">
								<Folder size={64} />
								<p>Папка пуста</p>
								<span>Создайте папку или загрузите файлы</span>
							</div>
						)}
				</div>
			</div>
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
							<button
								className="clear-search"
								onClick={() => setSearchQuery("")}
							>
								<X size={16} />
							</button>
						)}
					</div>
					<div className="filter-tabs">
						<button
							className={`filter-tab ${contactFilter === "all" ? "active" : ""}`}
							onClick={() => setContactFilter("all")}
						>
							Все
						</button>
						<button
							className={`filter-tab ${contactFilter === "object" ? "active" : ""}`}
							onClick={() => setContactFilter("object")}
						>
							Из объектов
						</button>
						<button
							className={`filter-tab ${contactFilter === "manual" ? "active" : ""}`}
							onClick={() => setContactFilter("manual")}
						>
							Добавленные
						</button>
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
								<tr>
									<td colSpan="7" className="empty-state">
										Нет контактов
									</td>
								</tr>
							) : (
								filteredContacts.map((contact) => (
									<tr key={contact.id}>
										<td>{contact.id}</td>
										<td>
											<strong>{contact.name}</strong>
										</td>
										<td>
											<a href={`tel:${contact.phone}`}>{contact.phone}</a>
										</td>
										<td>{contact.objectName}</td>
										<td>{contact.shortAddress}</td>
										<td>
											<span
												className={`badge ${contact.source === "object" ? "badge-type" : "badge-payment"}`}
											>
												{contact.source === "object"
													? "Из объекта"
													: "Добавлен"}
											</span>
										</td>
										<td>
											<button
												className="btn-icon btn-edit"
												onClick={() => handleEditContact(contact)}
												title="Редактировать"
											>
												<Edit2 size={16} />
											</button>
											{contact.source === "manual" && (
												<button
													className="btn-icon btn-delete"
													onClick={() => handleDeleteContact(contact.id)}
													title="Удалить"
												>
													<Trash2 size={16} />
												</button>
											)}
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
						Добавить контакт
					</h3>
					<form onSubmit={handleAddContact} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>Имя контакта *</label>
								<input
									type="text"
									value={newContactData.name}
									onChange={(e) =>
										setNewContactData({
											...newContactData,
											name: e.target.value,
										})
									}
									placeholder="Иванов Иван Иванович"
								/>
							</div>
							<div className="form-group">
								<label>Телефон</label>
								<input
									type="tel"
									value={newContactData.phone}
									onChange={(e) =>
										setNewContactData({
											...newContactData,
											phone: e.target.value,
										})
									}
									placeholder="+7 (999) 123-45-67"
								/>
							</div>
							<div className="form-group">
								<label>Объект</label>
								<input
									type="text"
									value={newContactData.objectName}
									onChange={(e) =>
										setNewContactData({
											...newContactData,
											objectName: e.target.value,
										})
									}
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
									onChange={(e) =>
										setNewContactData({
											...newContactData,
											shortAddress: e.target.value,
										})
									}
									placeholder="Примерная, 1"
								/>
							</div>
							<div className="form-group">
								<label>Email</label>
								<input
									type="email"
									value={newContactData.email}
									onChange={(e) =>
										setNewContactData({
											...newContactData,
											email: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group">
								<label>Должность</label>
								<input
									type="text"
									value={newContactData.position}
									onChange={(e) =>
										setNewContactData({
											...newContactData,
											position: e.target.value,
										})
									}
								/>
							</div>
							<div className="form-group form-group-full">
								<label>Заметки</label>
								<textarea
									value={newContactData.notes}
									onChange={(e) =>
										setNewContactData({
											...newContactData,
											notes: e.target.value,
										})
									}
									rows={2}
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							<Plus size={18} />
							Добавить контакт
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

	function renderStaffSection() {
		const handleAddStaff = (e) => {
			e?.preventDefault();
			const newStaff = { id: Date.now(), ...newStaffData };
			setStaff([...staff, newStaff]);
			setNewStaffData({
				fullName: "",
				position: "",
				location: "",
				phone: "",
				email: "",
				description: "",
				photo: "",
			});
		};

		const handleDeleteStaff = (id) => {
			if (confirm("Удалить сотрудника?"))
				setStaff(staff.filter((s) => s.id !== id));
		};

		return (
			<>
				<div className="content-header">
					<h2>Персонал</h2>
					<span className="badge-count">{staff.length} сотрудников</span>
				</div>
				<div className="staff-grid">
					{staff.map((person) => (
						<div key={person.id} className="staff-card">
							<div className="staff-photo">
								{person.photo ? (
									<img src={person.photo} alt={person.fullName} />
								) : (
									<div className="staff-avatar">
										{person.fullName
											.split(" ")
											.map((n) => n[0])
											.join("")
											.slice(0, 2)}
									</div>
								)}
							</div>
							<div className="staff-info">
								<h3>{person.fullName}</h3>
								<p className="staff-position">{person.position}</p>
								<p className="staff-location">
									<MapPin size={14} /> {person.location}
								</p>
								<p className="staff-contact">{person.phone}</p>
								<p className="staff-contact">{person.email}</p>
								<p className="staff-description">{person.description}</p>
							</div>
							<div className="staff-actions">
								<button
									className="btn-icon btn-delete"
									onClick={() => handleDeleteStaff(person.id)}
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>
					))}
				</div>
				<div className="add-form-section">
					<h3>
						<Plus size={20} />
						Добавить сотрудника
					</h3>
					<form onSubmit={handleAddStaff} className="add-form">
						<div className="form-grid">
							<div className="form-group">
								<label>ФИО</label>
								<input
									type="text"
									value={newStaffData.fullName}
									onChange={(e) =>
										setNewStaffData({
											...newStaffData,
											fullName: e.target.value,
										})
									}
									placeholder="Иванов Иван Иванович"
									required
								/>
							</div>
							<div className="form-group">
								<label>Должность</label>
								<input
									type="text"
									value={newStaffData.position}
									onChange={(e) =>
										setNewStaffData({
											...newStaffData,
											position: e.target.value,
										})
									}
									placeholder="Инженер"
								/>
							</div>
							<div className="form-group">
								<label>Место работы</label>
								<input
									type="text"
									value={newStaffData.location}
									onChange={(e) =>
										setNewStaffData({
											...newStaffData,
											location: e.target.value,
										})
									}
									placeholder="Офис Москва"
								/>
							</div>
							<div className="form-group">
								<label>Телефон</label>
								<input
									type="text"
									value={newStaffData.phone}
									onChange={(e) =>
										setNewStaffData({ ...newStaffData, phone: e.target.value })
									}
									placeholder="+7 (999) 123-45-67"
								/>
							</div>
							<div className="form-group">
								<label>Email</label>
								<input
									type="email"
									value={newStaffData.email}
									onChange={(e) =>
										setNewStaffData({ ...newStaffData, email: e.target.value })
									}
									placeholder="email@company.ru"
								/>
							</div>
							<div className="form-group form-group-full">
								<label>Описание</label>
								<textarea
									value={newStaffData.description}
									onChange={(e) =>
										setNewStaffData({
											...newStaffData,
											description: e.target.value,
										})
									}
									rows={2}
									placeholder="Опыт работы, навыки..."
								/>
							</div>
							<div className="form-group form-group-full">
								<label>Фото</label>
								<input
									type="file"
									accept="image/*"
									onChange={async (e) => {
										const file = e.target.files[0];
										if (file) {
											const reader = new FileReader();
											reader.onload = (ev) => {
												setNewStaffData({
													...newStaffData,
													photo: ev.target.result,
												});
											};
											reader.readAsDataURL(file);
										}
									}}
								/>
								{newStaffData.photo && (
									<img
										src={newStaffData.photo}
										alt="Preview"
										style={{
											maxWidth: "100px",
											marginTop: "8px",
											borderRadius: "8px",
										}}
									/>
								)}
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
					<button
						className="btn btn-danger-outline"
						onClick={() => {
							if (window.confirm("Вы уверены? Все данные будут удалены!")) {
								localStorage.clear();
								window.location.reload();
							}
						}}
					>
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
					<div
						className="modal modal-object-edit"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="modal-header">
							<h2>Редактирование объекта</h2>
							<span className="modal-subtitle">
								{editingObject["Наименование объекта"] || ""}
							</span>
							<button
								className="modal-close"
								onClick={() => setIsEditModalOpen(false)}
							>
								<X size={24} />
							</button>
						</div>
						<form onSubmit={handleSaveEdit} className="modal-body">
							<div className="form-grid">
								<div className="form-group">
									<label>Заказчик</label>
									<input
										type="text"
										value={editingObject["Заказчик"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												Заказчик: e.target.value,
											})
										}
										placeholder="Заказчик"
									/>
								</div>
								<div className="form-group">
									<label>Подрядчик</label>
									<select
										value={editingObject["Подрядчик"] || "СБ"}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
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
										value={editingObject["№ контр/дог"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"№ контр/дог": e.target.value,
											})
										}
										placeholder="№ 1-2024-РБ"
									/>
								</div>
								<div className="form-group">
									<label>Начало договора</label>
									<input
										type="date"
										value={editingObject["Начало действия договора"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Начало действия договора": e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Окончание договора</label>
									<input
										type="date"
										value={editingObject["Окончание действия договора"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Окончание действия договора": e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Тип договора</label>
									<select
										value={editingObject["Тип договора"] || "ТО"}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Тип договора": e.target.value,
											})
										}
									>
										<option value="ТО">ТО</option>
										<option value="СМР">СМР</option>
										<option value="ПИР">ПИР</option>
										<option value="">—</option>
									</select>
								</div>
								<div className="form-group">
									<label>Продлеваемость</label>
									<select
										value={editingObject["Продлеваемость"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												Продлеваемость: e.target.value,
											})
										}
									>
										<option value="">—</option>
										<option value="Продлеваемый автоматически">
											Продлеваемый автоматически
										</option>
										<option value="Не продлеваемый">Не продлеваемый</option>
										<option value="Конкурсный">Конкурсный</option>
									</select>
								</div>
								<div className="form-group">
									<label>Кто оплачивает ремонт</label>
									<select
										value={editingObject["Кто оплачивает ремонт"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Кто оплачивает ремонт": e.target.value,
											})
										}
									>
										<option value="">—</option>
										<option value="Заказчик">Заказчик</option>
										<option value="Наш счёт">За наш счёт</option>
									</select>
								</div>
								<div className="form-group">
									<label>Аванс</label>
									<select
										value={editingObject["К доп работам есть ли аванс"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
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
									<label>Адрес полный</label>
									<input
										type="text"
										value={editingObject["Адрес полный объекта"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Адрес полный объекта": e.target.value,
											})
										}
										placeholder="Полный адрес объекта"
									/>
								</div>
								<div className="form-group">
									<label>Адрес сокращенный</label>
									<input
										type="text"
										value={editingObject["Адрес сокращенный"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Адрес сокращенный": e.target.value,
											})
										}
										placeholder="Сокращенный адрес"
									/>
								</div>
								<div className="form-group">
									<label>Наименование объекта</label>
									<input
										type="text"
										value={editingObject["Наименование объекта"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Наименование объекта": e.target.value,
											})
										}
										placeholder="Наименование объекта"
									/>
								</div>
								<div className="form-group">
									<label>Арендатор</label>
									<input
										type="text"
										value={editingObject["Арендатор"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												Арендатор: e.target.value,
											})
										}
										placeholder="Арендатор"
									/>
								</div>
								<div className="form-group">
									<label>РД ИД ПД</label>
									<div className="checkbox-group">
										{["РД", "ИД", "ПД"].map((opt) => {
											const current = editingObject["РД ИД ПД"] || "";
											const checked = current.includes(opt);
											return (
												<label key={opt} className="checkbox-label">
													<input
														type="checkbox"
														checked={checked}
														onChange={() => {
															const vals = current
																.split(",")
																.map((v) => v.trim())
																.filter(Boolean);
															const newVals = checked
																? vals.filter((v) => v !== opt)
																: [...vals, opt];
															setEditingObject({
																...editingObject,
																"РД ИД ПД": newVals.join(", "),
															});
														}}
													/>
													<span>{opt}</span>
												</label>
											);
										})}
									</div>
								</div>
								<div className="form-group form-group-full">
									<label>Системы</label>
									<input
										type="text"
										value={editingObject["Системы"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												Системы: e.target.value,
											})
										}
										placeholder="Вентиляция, Кондиционирование..."
									/>
								</div>
								<div className="form-group">
									<label>Контакты</label>
									<input
										type="text"
										value={editingObject["Контакты"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												Контакты: e.target.value,
											})
										}
										placeholder="Телефон, имя..."
									/>
								</div>
								<div className="form-group">
									<label>Инструмент</label>
									<select
										value={editingObject["Инструмент на объекте"] || "нет"}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Инструмент на объекте": e.target.value,
											})
										}
									>
										<option value="нет">Нет</option>
										<option value="есть">Есть</option>
									</select>
								</div>
								<div className="form-group">
									<label>Расчетное время</label>
									<input
										type="text"
										value={
											editingObject["Расчетное время на обслуживание"] || ""
										}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Расчетное время на обслуживание": e.target.value,
											})
										}
										placeholder="2 часа"
									/>
								</div>
								<div className="form-group">
									<label>Письмо о повышении ТО</label>
									<input
										type="text"
										value={
											editingObject["Письмо о повышении стоимости ТО"] || ""
										}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Письмо о повышении стоимости ТО": e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Повышение цены ТО</label>
									<input
										type="text"
										value={
											editingObject["Свершившееся повышение цены ТО"] || ""
										}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Свершившееся повышение цены ТО": e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Доп. соглашение</label>
									<input
										type="text"
										value={editingObject["Доп соглашение"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Доп соглашение": e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Письма</label>
									<input
										type="text"
										value={editingObject["Письма"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												Письма: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Оплата доп. работ</label>
									<input
										type="text"
										value={editingObject["Как оплачиваются доп.работы"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												"Как оплачиваются доп.работы": e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group form-group-full">
									<label>Заметки</label>
									<textarea
										value={editingObject["Заметки"] || ""}
										onChange={(e) =>
											setEditingObject({
												...editingObject,
												Заметки: e.target.value,
											})
										}
										rows={3}
										placeholder="Дополнительная информация..."
									/>
								</div>
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
									<Check size={16} /> Сохранить
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ ТРАНСПОРТА */}
			{isTransportModalOpen && editingTransport && (
				<div
					className="modal-overlay"
					onClick={() => setIsTransportModalOpen(false)}
				>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h2>Редактирование заявки на транспорт</h2>
							<button
								className="modal-close"
								onClick={() => setIsTransportModalOpen(false)}
							>
								<X size={24} />
							</button>
						</div>
						<form onSubmit={handleSaveTransport} className="modal-body">
							<div className="form-grid">
								<div className="form-group">
									<label>Дата заявки</label>
									<input
										type="text"
										value={editingTransport.requestDate || ""}
										onChange={(e) =>
											setEditingTransport({
												...editingTransport,
												requestDate: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Дедлайн</label>
									<input
										type="text"
										value={editingTransport.deadline || ""}
										onChange={(e) =>
											setEditingTransport({
												...editingTransport,
												deadline: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Дата назначено</label>
									<input
										type="text"
										value={editingTransport.assignedDate || ""}
										onChange={(e) =>
											setEditingTransport({
												...editingTransport,
												assignedDate: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Кому</label>
									<input
										type="text"
										value={editingTransport.assignedTo || ""}
										onChange={(e) =>
											setEditingTransport({
												...editingTransport,
												assignedTo: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Статус заявки на закупку</label>
									<input
										type="text"
										value={editingTransport.purchaseStatus || ""}
										onChange={(e) =>
											setEditingTransport({
												...editingTransport,
												purchaseStatus: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Статус вызова</label>
									<input
										type="text"
										value={editingTransport.callStatus || ""}
										onChange={(e) =>
											setEditingTransport({
												...editingTransport,
												callStatus: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Статус заявки</label>
									<select
										value={editingTransport.thisStatus || "new"}
										onChange={(e) =>
											setEditingTransport({
												...editingTransport,
												thisStatus: e.target.value,
											})
										}
									>
										<option value="new">Новая</option>
										<option value="in_progress">В работе</option>
										<option value="completed">Выполнена</option>
										<option value="cancelled">Отменена</option>
									</select>
								</div>
								<div className="form-group">
									<label>Объект</label>
									<input
										type="text"
										value={editingTransport.objectName || ""}
										onChange={(e) =>
											setEditingTransport({
												...editingTransport,
												objectName: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group">
									<label>Адрес</label>
									<input
										type="text"
										value={editingTransport.shortAddress || ""}
										onChange={(e) =>
											setEditingTransport({
												...editingTransport,
												shortAddress: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group form-group-full">
									<label>Что транспортировать</label>
									<input
										type="text"
										value={editingTransport.whatToTransport || ""}
										onChange={(e) =>
											setEditingTransport({
												...editingTransport,
												whatToTransport: e.target.value,
											})
										}
									/>
								</div>
								<div className="form-group form-group-full">
									<label>Перечень инструмента</label>
									<textarea
										value={editingTransport.toolsList || ""}
										onChange={(e) =>
											setEditingTransport({
												...editingTransport,
												toolsList: e.target.value,
											})
										}
										rows={3}
									/>
								</div>
								<div className="form-group">
									<label>Создатель</label>
									<input
										type="text"
										value={editingTransport.creator || ""}
										onChange={(e) =>
											setEditingTransport({
												...editingTransport,
												creator: e.target.value,
											})
										}
									/>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => setIsTransportModalOpen(false)}
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
				<div
					className="modal-overlay"
					onClick={() => setIsContactModalOpen(false)}
				>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h2>Редактирование контакта</h2>
							<button
								className="modal-close"
								onClick={() => setIsContactModalOpen(false)}
							>
								<X size={24} />
							</button>
						</div>
						<form onSubmit={handleSaveContact} className="modal-body">
							<div className="form-grid">
								<div className="form-group">
									<label>Имя контакта *</label>
									<input
										type="text"
										value={editingContact.name || ""}
										onChange={(e) =>
											handleContactChange("name", e.target.value)
										}
										required
									/>
								</div>
								<div className="form-group">
									<label>Телефон</label>
									<input
										type="tel"
										value={editingContact.phone || ""}
										onChange={(e) =>
											handleContactChange("phone", e.target.value)
										}
									/>
								</div>
								<div className="form-group">
									<label>Объект</label>
									<input
										type="text"
										value={editingContact.objectName || ""}
										onChange={(e) =>
											handleContactChange("objectName", e.target.value)
										}
										list="objects-list-edit"
									/>
									<datalist id="objects-list-edit">
										{objects.map((obj) => (
											<option
												key={obj.id}
												value={obj["Наименование объекта"]}
											/>
										))}
									</datalist>
								</div>
								<div className="form-group">
									<label>Короткий адрес</label>
									<input
										type="text"
										value={editingContact.shortAddress || ""}
										onChange={(e) =>
											handleContactChange("shortAddress", e.target.value)
										}
									/>
								</div>
								<div className="form-group">
									<label>Email</label>
									<input
										type="email"
										value={editingContact.email || ""}
										onChange={(e) =>
											handleContactChange("email", e.target.value)
										}
									/>
								</div>
								<div className="form-group">
									<label>Должность</label>
									<input
										type="text"
										value={editingContact.position || ""}
										onChange={(e) =>
											handleContactChange("position", e.target.value)
										}
									/>
								</div>
								<div className="form-group form-group-full">
									<label>Заметки</label>
									<textarea
										value={editingContact.notes || ""}
										onChange={(e) =>
											handleContactChange("notes", e.target.value)
										}
										rows={3}
									/>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => setIsContactModalOpen(false)}
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
