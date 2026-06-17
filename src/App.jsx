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
};

// === ДАННЫЕ ОБЪЕКТОВ ===
const INITIAL_OBJECTS = [
	{
		id: 1,
		objectNumber: 1,
		Заказчик: "ООО Торговый центр",
		Подрядчик: "СБ",
		"№ контр/дог": "ТЦ-001/2024",
		"Начало действия договора": "01.01.2024",
		"Окончание действия договора": "31.12.2024",
		"Тип договора": "ТО",
		Продлеваемость: "Продлеваемый автоматически",
		"Письмо о повышении стоимости ТО": "15.03.2024",
		"Свершившееся повышение цены ТО": "10%",
		"Доп соглашение": "№2",
		Письма: "Исх.№45",
		"Кто оплачивает ремонт": "Заказчик",
		"Как оплачиваются доп.работы": "Сметы",
		"К доп работам есть ли аванс": "Аванс",
		"Адрес полный объекта": "г. Москва, ул. Тверская, д. 15",
		"Адрес сокращенный": "Тверская, 15",
		"Наименование объекта": "ТЦ Мега",
		"РД ИД ПД": "РД-001",
		Арендатор: "Арендатор1",
		Системы: "АПС, СОУЭ",
		"Расчетное время на обслуживание": "4 часа",
		Контакты: "Иванов +79991234567",
		"Инструмент на объекте": "есть",
		Заметки: "VIP клиент",
	},
	{
		id: 2,
		objectNumber: 2,
		Заказчик: "ЗАО СтройИнвест",
		Подрядчик: "СБ+",
		"№ контр/дог": "СИ-002/2024",
		"Начало действия договора": "15.02.2024",
		"Окончание действия договора": "14.02.2025",
		"Тип договора": "СМР",
		Продлеваемость: "Конкурсный",
		"Письмо о повышении стоимости ТО": "",
		"Свершившееся повышение цены ТО": "",
		"Доп соглашение": "",
		Письма: "",
		"Кто оплачивает ремонт": "Наш счёт",
		"Как оплачиваются доп.работы": "КП",
		"К доп работам есть ли аванс": "Без аванса",
		"Адрес полный объекта": "г. СПб, Невский пр., д. 100",
		"Адрес сокращенный": "Невский, 100",
		"Наименование объекта": "БЦ Невский",
		"РД ИД ПД": "РД-002",
		Арендатор: "Арендатор2",
		Системы: "ВИДЕОНАБЛЮДЕНИЕ",
		"Расчетное время на обслуживание": "2 часа",
		Контакты: "Петров +79992345678",
		"Инструмент на объекте": "нет",
		Заметки: "",
	},
	{
		id: 3,
		objectNumber: 3,
		Заказчик: "ИП Сидоров",
		Подрядчик: "ВСТ",
		"№ контр/дог": "ИП-003/2024",
		"Начало действия договора": "01.03.2024",
		"Окончание действия договора": "28.02.2025",
		"Тип договора": "ПИР",
		Продлеваемость: "Не продлеваемый",
		"Письмо о повышении стоимости ТО": "10.05.2024",
		"Свершившееся повышение цены ТО": "5%",
		"Доп соглашение": "№1",
		Письма: "Вх.№78",
		"Кто оплачивает ремонт": "Заказчик",
		"Как оплачиваются доп.работы": "По договору",
		"К доп работам есть ли аванс": "Аванс",
		"Адрес полный объекта": "г. Екатеринбург, ул. Ленина, д. 50",
		"Адрес сокращенный": "Ленина, 50",
		"Наименование объекта": "ТРЦ Галерея",
		"РД ИД ПД": "РД-003",
		Арендатор: "Арендатор3",
		Системы: "АПС, СОУЭ, ВПВ",
		"Расчетное время на обслуживание": "6 часов",
		Контакты: "Сидоров +79993456789",
		"Инструмент на объекте": "есть",
		Заметки: "Срочные заявки",
	},
	{
		id: 4,
		objectNumber: 4,
		Заказчик: "ООО Ромашка",
		Подрядчик: "ИП",
		"№ контр/дог": "РМ-004/2024",
		"Начало действия договора": "20.04.2024",
		"Окончание действия договора": "19.04.2025",
		"Тип договора": "ТО",
		Продлеваемость: "Продлеваемый доп соглашением",
		"Письмо о повышении стоимости ТО": "",
		"Свершившееся повышение цены ТО": "",
		"Доп соглашение": "",
		Письма: "",
		"Кто оплачивает ремонт": "Наш счёт",
		"Как оплачиваются доп.работы": "Сметы",
		"К доп работам есть ли аванс": "Без аванса",
		"Адрес полный объекта": "г. Новосибирск, ул. Красная, д. 25",
		"Адрес сокращенный": "Красная, 25",
		"Наименование объекта": "Супермаркет Ромашка",
		"РД ИД ПД": "РД-004",
		Арендатор: "Арендатор4",
		Системы: "ОПС",
		"Расчетное время на обслуживание": "1 час",
		Контакты: "Козлов +79994567890",
		"Инструмент на объекте": "нет",
		Заметки: "",
	},
	{
		id: 5,
		objectNumber: 5,
		Заказчик: "ПАО Газпром",
		Подрядчик: "СБ",
		"№ контр/дог": "ГЗ-005/2024",
		"Начало действия договора": "01.05.2024",
		"Окончание действия договора": "31.12.2025",
		"Тип договора": "ТО",
		Продлеваемость: "Продлеваемый автоматически",
		"Письмо о повышении стоимости ТО": "20.06.2024",
		"Свершившееся повышение цены ТО": "15%",
		"Доп соглашение": "№3",
		Письма: "Исх.№156",
		"Кто оплачивает ремонт": "Заказчик",
		"Как оплачиваются доп.работы": "КП",
		"К доп работам есть ли аванс": "Аванс",
		"Адрес полный объекта": "г. Москва, Пресненская наб., д. 12",
		"Адрес сокращенный": "Пресненская, 12",
		"Наименование объекта": "Штаб-квартира Газпром",
		"РД ИД ПД": "РД-005",
		Арендатор: "",
		Системы: "АПС, СОУЭ, ВПВ, ВИДЕОНАБЛЮДЕНИЕ",
		"Расчетное время на обслуживание": "8 часов",
		Контакты: "Смирнов +79995678901",
		"Инструмент на объекте": "есть",
		Заметки: "Высший приоритет",
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
		location: "Офис Москва",
		phone: "+7 (999) 678-90-12",
		email: "novikova@company.ru",
		description: "Координация работ",
		photo: "",
	},
];

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
		const saved = localStorage.getItem("demo_objects_v2");
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
	const MENU_ITEMS = Object.keys(SECTION_LABELS).map((id) => ({
		id,
		label: SECTION_LABELS[id],
		icon: SECTION_ICONS[id] || FileText,
	}));

	useEffect(() => {
		localStorage.setItem("demo_calls", JSON.stringify(calls));
	}, [calls]);
	useEffect(() => {
		localStorage.setItem("demo_objects_v2", JSON.stringify(objects));
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
			purchaseStatus: "",
			callStatus: "",
			thisStatus: "new",
			objectName: "",
			shortAddress: "",
			whatToTransport: "",
			toolsList: "",
			creator: "",
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
		setObjects([newObj, ...objects]);
		setNewFormData(getEmptyObjectForm());
	};

	const handleDeleteObject = (id) => {
		if (confirm("Удалить объект?")) {
			objectContactsSyncRef.current = true;
			setObjects(objects.filter((o) => o.id !== id));
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
		setObjects(
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
	const handleAddCall = (e) => {
		e?.preventDefault();
		if (!newCallData.objectName?.trim()) {
			alert("Выберите объект!");
			return;
		}
		const newCall = {
			id: Date.now(),
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

	const handleEditTransport = (item) => {
		setEditingTransport({ ...item });
		setIsTransportModalOpen(true);
	};

	const handleSaveTransport = (e) => {
		e?.preventDefault();
		setTransportItems(
			transportItems.map((t) =>
				t.id === editingTransport.id ? editingTransport : t,
			),
		);
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
			!objectFilters.type ||
			o["Тип договора"] === objectFilters.type;

		// Фильтр по подрядчику
		const matchesContractor =
			!objectFilters.contractor ||
			o["Подрядчик"] === objectFilters.contractor;

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

		return matchesSearch && matchesType && matchesContractor && matchesExtendable && matchesTool;
	});

	// Получение уникальных значений для фильтров
	const uniqueContractors = [...new Set(objects.map((o) => o["Подрядчик"]).filter(Boolean))];
	const uniqueTypes = [...new Set(objects.map((o) => o["Тип договора"]).filter(Boolean))];
	const uniqueExtendable = [...new Set(objects.map((o) => o["Продлеваемость"] || o["Продлеваемость "]).filter(Boolean))];

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
				return renderStaffSection();
			case "accounts":
			default:
				return renderPlaceholderSection();
		}
	};

	function renderObjectsSection() {
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
			setObjects(
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
										setObjectFilters({ ...objectFilters, contractor: e.target.value })
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
										setObjectFilters({ ...objectFilters, extendable: e.target.value })
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
							{(objectFilters.type || objectFilters.contractor || objectFilters.extendable || objectFilters.hasTool) && (
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
						</div>

						{/* ФОРМА ДОБАВЛЕНИЯ ОБЪЕКТА - НАВЕРХУ */}
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
				<div className="add-form-section add-form-full">
					<h3>
						<Plus size={20} />
						Новая заявка (вызов)
					</h3>
					<form onSubmit={handleAddCall} className="add-form">
						<div className="form-grid">
							{/* Дата заявки */}
							<div className="form-group">
								<label>Дата заявки</label>
														<input
																type="date"
																	value={newCallData.createdAt || ""}
																	onChange={(e) =>
																		setNewCallData({
																			...newCallData,
																				createdAt: e.target.value,
																			})
																	}
																/>
							</div>

							{/* Дедлайн */}
							<div className="form-group">
								<label>Дедлайн</label>
										<input
												type="date"
													value={newCallData.deadline || ""}
													onChange={(e) =>
													setNewCallData({ ...newCallData, deadline: e.target.value })
													}
												/>
							</div>

							{/* Дата проведения */}
							<div className="form-group">
								<label>Дата проведения</label>
										<input
												type="date"
													value={newCallData.executionDate || ""}
													onChange={(e) =>
														setNewCallData({
															...newCallData,
															executionDate: e.target.value,
														})
														}
												/>
							</div>

							{/* Исполнитель */}
							<div className="form-group">
								<label>Исполнитель</label>
								<input
									type="text"
									value={newCallData.engineer || ""}
									onChange={(e) =>
										setNewCallData({ ...newCallData, engineer: e.target.value })
									}
									placeholder="ФИО"
									list="calls-engineers-list"
								/>
								<datalist id="calls-engineers-list">
									{staff.map((s) => (
										<option key={s.id} value={s.fullName} />
									))}
								</datalist>
							</div>

							{/* Помощник */}
							<div className="form-group">
								<label>Помощник</label>
								<input
									type="text"
									value={newCallData.assistant || ""}
									onChange={(e) =>
										setNewCallData({
											...newCallData,
											assistant: e.target.value,
										})
									}
									placeholder="ФИО"
									list="calls-engineers-list"
								/>
							</div>

							{/* Статус вызова */}
							<div className="form-group">
								<label>Статус вызова</label>
								<select
									value={newCallData.status || "new"}
									onChange={(e) =>
										setNewCallData({ ...newCallData, status: e.target.value })
									}
								>
									<option value="new">Новый</option>
									<option value="in_progress">В работе</option>
									<option value="completed">Завершён</option>
								</select>
							</div>

							{/* Тип заявки */}
							<div className="form-group">
								<label>Тип заявки</label>
								<input
									type="text"
									value={newCallData.type || ""}
									onChange={(e) =>
										setNewCallData({ ...newCallData, type: e.target.value })
									}
									placeholder="ТО / СМР / Аварийная"
								/>
							</div>

							{/* Объект */}
							<div className="form-group">
								<label>Объект (выберите или введите) *</label>
								<input
									type="text"
									value={newCallData.objectName || ""}
									onChange={(e) => {
										const inputVal = e.target.value;
										// Ищем объект по номеру или названию
										const selectedByNum = objects.find(
											(o) =>
												`${o.objectNumber || o.id}.` ===
												inputVal.split(".")[0] + ".",
										);
										const selectedByName = objects.find(
											(o) => o["Наименование объекта"] === inputVal,
										);
										const selected = selectedByNum || selectedByName;

										if (selected) {
											setNewCallData({
												...newCallData,
												objectId: selected.id,
												objectNumber: selected.objectNumber,
												objectName: selected["Наименование объекта"],
												shortAddress: selected["Адрес сокращенный"] || "",
												tenant: selected["Арендатор"] || "",
												// Подтягиваем дополнительные данные из объекта
											});
										} else {
											setNewCallData({
												...newCallData,
												objectId: null,
												objectNumber: null,
												objectName: inputVal,
											});
										}
									}}
									list="calls-objects-list"
									required
								/>
								<div className="form-hint">
									Введите номер объекта (1, 2...) или название
								</div>
								<datalist id="calls-objects-list">
									{objects.map((obj) => (
										<option
											key={obj.id}
											value={`${obj.objectNumber || obj.id}. ${obj["Наименование объекта"]}`}
										/>
									))}
								</datalist>
							</div>

							{/* Сокращенный адрес */}
							<div className="form-group">
								<label>Сокращенный адрес</label>
								<input
									type="text"
									value={newCallData.shortAddress || ""}
									onChange={(e) =>
										setNewCallData({
											...newCallData,
											shortAddress: e.target.value,
										})
									}
									placeholder="Адрес объекта"
								/>
							</div>

							{/* Арендатор */}
							<div className="form-group">
								<label>Арендатор</label>
								<input
									type="text"
									value={newCallData.tenant || ""}
									onChange={(e) =>
										setNewCallData({ ...newCallData, tenant: e.target.value })
									}
									placeholder="Арендатор"
								/>
							</div>

							{/* Система */}
							<div className="form-group">
								<label>Система</label>
								<input
									type="text"
									value={newCallData.system || ""}
									onChange={(e) =>
										setNewCallData({ ...newCallData, system: e.target.value })
									}
									placeholder="АПС, СОУЭ, ВПВ"
								/>
							</div>

							{/* Заявка */}
							<div className="form-group form-group-full">
								<label>Заявка (описание)</label>
								<textarea
									value={newCallData.request || ""}
									onChange={(e) =>
										setNewCallData({ ...newCallData, request: e.target.value })
									}
									rows={3}
									placeholder="Опишите заявку подробно..."
								/>
							</div>

							{/* Наш инструмент */}
							<div className="form-group form-group-full">
								<label>Наш инструмент для выполнения (не обязательно)</label>
								<textarea
									value={newCallData.ourTool || ""}
									onChange={(e) =>
										setNewCallData({ ...newCallData, ourTool: e.target.value })
									}
									rows={4}
									placeholder={`Укажите необходимый инструмент:\n• Перфоратор\n• Безаккумуляторные устройства\n• Стремянка (высота___) / тура\n• Удлинители\n• Болгарка (тип диска___)\n• Буры (диаметр___ х длина___)\n• Средства защиты`}
								/>
							</div>

							{/* Приобрести для выполнения */}
							<div className="form-group form-group-full">
								<label>Приобрести для выполнения</label>
								<textarea
									value={newCallData.toPurchase || ""}
									onChange={(e) =>
										setNewCallData({
											...newCallData,
											toPurchase: e.target.value,
										})
									}
									rows={2}
									placeholder="Что нужно приобрести..."
								/>
							</div>

							{/* Отвезти в ремонт */}
							<div className="form-group form-group-full">
								<label>Отвезти в ремонт</label>
								<textarea
									value={newCallData.toRepair || ""}
									onChange={(e) =>
										setNewCallData({ ...newCallData, toRepair: e.target.value })
									}
									rows={2}
									placeholder="Что требует ремонта..."
								/>
							</div>

							{/* Актирование работ */}
							<div className="form-group">
								<label>Актирование работ</label>
								<input
									type="text"
									value={newCallData.activation || ""}
									onChange={(e) =>
										setNewCallData({
											...newCallData,
											activation: e.target.value,
										})
									}
									placeholder="Да / Нет / ..."
								/>
							</div>

							{/* У кого данные */}
							<div className="form-group">
								<label>У кого данные</label>
								<input
									type="text"
									value={newCallData.dataOwner || ""}
									onChange={(e) =>
										setNewCallData({
											...newCallData,
											dataOwner: e.target.value,
										})
									}
									placeholder="У кого хранятся данные..."
								/>
							</div>

							{/* Кто обратился */}
							<div className="form-group">
								<label>Кто обратился с заявкой от заказчика</label>
								<input
									type="text"
									value={newCallData.customerContact || ""}
									onChange={(e) =>
										setNewCallData({
											...newCallData,
											customerContact: e.target.value,
										})
									}
									placeholder="ФИО контакта"
								/>
							</div>

							{/* Создатель заявки */}
							<div className="form-group">
								<label>Создатель заявки</label>
								<input
									type="text"
									value={newCallData.creator || ""}
									onChange={(e) =>
										setNewCallData({ ...newCallData, creator: e.target.value })
									}
									placeholder="Ваше имя"
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
								<th>Объект</th>
								<th>Адрес</th>
								<th>Статус</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{tools.length === 0 ? (
								<tr>
									<td colSpan="9" className="empty-state">
										Нет инструментов
									</td>
								</tr>
							) : (
								tools.map((t) => (
									<tr
										key={t.id}
										className={
											selectedToolIds.includes(t.id) ? "tr-selected" : ""
										}
									>
										<td className="td-checkbox">
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

		// Статусы для заявки на транспорт
		const transportStatuses = [
			{ value: "new", label: "Новая", className: "stat-new" },
			{ value: "in_progress", label: "В работе", className: "stat-progress" },
			{ value: "completed", label: "Выполнена", className: "stat-completed" },
			{ value: "cancelled", label: "Отменена", className: "stat-cancelled" },
		];

		const getStatusBadge = (status) => {
			const statusInfo = transportStatuses.find((s) => s.value === status);
			if (!statusInfo) return <span className="badge">{status}</span>;
			return (
				<span className={`badge ${statusInfo.className}`}>
					{statusInfo.label}
				</span>
			);
		};

		// Статистика
		const stats = {
			new: transportItems.filter((t) => t.thisStatus === "new").length,
			in_progress: transportItems.filter((t) => t.thisStatus === "in_progress")
				.length,
			completed: transportItems.filter((t) => t.thisStatus === "completed")
				.length,
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
							<span className="stat-label">Новых</span>
						</div>
					</div>
					<div className="stat-card stat-progress">
						<div className="stat-icon">
							<Clock size={20} />
						</div>
						<div className="stat-info">
							<span className="stat-count">{stats.in_progress}</span>
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
								<th>Дата заявки</th>
								<th>Дедлайн</th>
								<th>Дата назначено</th>
								<th>Кому (исполнитель)</th>
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
									<td colSpan="14" className="empty-state">
										Нет заявок на транспорт
									</td>
								</tr>
							) : (
								transportItems.map((t) => (
									<tr key={t.id}>
										<td>{t.id}</td>
										<td>{t.requestDate || "-"}</td>
										<td>{t.deadline || "-"}</td>
										<td>{t.assignedDate || "-"}</td>
										<td>{t.assignedTo || "-"}</td>
										<td>{t.purchaseStatus || "-"}</td>
										<td>{t.callStatus || "-"}</td>
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
							{/* Дата заявки */}
							<div className="form-group">
								<label>Дата заявки</label>
									<input
										type="date"
											value={newTransportData.requestDate}
											onChange={(e) =>
											setNewTransportData({
												...newTransportData,
												requestDate: e.target.value,
											})
											}
										/>
							</div>

							{/* Дедлайн */}
							<div className="form-group">
								<label>Дедлайн</label>
									<input
										type="date"
											value={newTransportData.deadline}
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

							{/* Кому (исполнитель) */}
							<div className="form-group">
								<label>Кому (исполнитель)</label>
								<input
									type="text"
									value={newTransportData.assignedTo}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											assignedTo: e.target.value,
										})
									}
									placeholder="ФИО исполнителя"
									list="staff-list"
								/>
								<datalist id="staff-list">
									{staff.map((s) => (
										<option key={s.id} value={s.fullName} />
									))}
								</datalist>
							</div>

							{/* Статус заявки на закупку */}
							<div className="form-group">
								<label>Статус заявки на закупку</label>
								<input
									type="text"
									value={newTransportData.purchaseStatus}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											purchaseStatus: e.target.value,
										})
									}
									placeholder="Ожидает / Закуплено / -"
								/>
							</div>

							{/* Статус вызова */}
							<div className="form-group">
								<label>Статус вызова</label>
								<input
									type="text"
									value={newTransportData.callStatus}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											callStatus: e.target.value,
										})
									}
									placeholder="Новый / В работе / Завершён"
								/>
							</div>

							{/* Статус этой заявки */}
							<div className="form-group">
								<label>Статус заявки</label>
								<select
									value={newTransportData.thisStatus || "new"}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
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

							{/* Наименование объекта */}
							<div className="form-group">
								<label>Объект (выберите или введите) *</label>
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

							{/* Сокращенный адрес */}
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
									placeholder="Адрес объекта"
								/>
							</div>

							{/* Что нужно транспортировать */}
							<div className="form-group form-group-full">
								<label>Что нужно транспортировать</label>
								<input
									type="text"
									value={newTransportData.whatToTransport}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											whatToTransport: e.target.value,
										})
									}
									placeholder="Опишите, что требуется перевезти"
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
									placeholder="Список инструмента для перевозки"
								/>
							</div>

							{/* Создатель заявки */}
							<div className="form-group">
								<label>Создатель заявки</label>
								<input
									type="text"
									value={newTransportData.creator}
									onChange={(e) =>
										setNewTransportData({
											...newTransportData,
											creator: e.target.value,
										})
									}
									placeholder="Ваше имя"
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
