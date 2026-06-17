import { useState, useEffect } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Download, LogOut, Menu, X, 
  Building2, Settings, Users, Calendar, FileText, Truck, 
  DollarSign, Wrench, ClipboardList, BarChart3, Phone, MapPin
} from 'lucide-react';
import './App.css';

// Начальные данные
const INITIAL_OBJECTS = [
  {
    id: 1,
    name: 'Кубинка АВАНГАРД',
    client: 'СБ',
    customer: 'СБ',
    contractNumber: '№ 1-201224-РБ',
    contract: '№ 1-201224-РБ',
    contractType: 'СМР',
    type: 'СМР',
    systems: 'АПС, СОУЭ, ВПВ, АПТ',
    cost: '55 000',
    fullAddress: 'РФ, Московская область, Одинцовский г.о., тер. Парк Патриот, дом 3',
    address: 'РФ, Московская область, Одинцовский г.о., тер. Парк Патриот, дом 3',
    contact: 'Иванов Иван Иванович (+7999754413)',
    payment: 'Аванс',
    contractor: 'СБ',
    startDate: '20.12.2024',
    endDate: '31.12.2025',
    prolongationType: 'Продлеваемый автоматически',
    maintenancePriceLetter: '—',
    priceIncreaseDate: '—',
    addAgreement: '—',
    repairPayer: 'Все за наш счёт',
    extraWorkPayment: 'Сметы',
    extraWorkAdvance: 'Без аванса',
    shortAddress: 'Парк Патриот, дом 3',
    documentsType: '—',
    tenant: '—',
    estimatedTime: '—',
    notes: 'Крупный объект, требуется согласование',
    toolsOnSite: 'нет'
  },
  {
    id: 2,
    name: 'ЧОУ «Ступени»',
    client: 'СБ+',
    customer: 'СБ+',
    contractNumber: 'Заполняется вручную',
    contract: 'Заполняется вручную',
    contractType: 'СМР',
    type: 'СМР',
    systems: 'АПС, СОУЭ',
    cost: '32 000',
    fullAddress: 'г. Москва, ул. Марии Поливановой, д. 12А, стр. 1',
    address: 'г. Москва, ул. Марии Поливановой, д. 12А, стр. 1',
    contact: 'Петров Петр (+79991112233)',
    payment: 'Без аванса',
    contractor: 'СБ+',
    startDate: '15.01.2025',
    endDate: '—',
    prolongationType: 'Продлеваемый автоматически',
    maintenancePriceLetter: '—',
    priceIncreaseDate: '—',
    addAgreement: '—',
    repairPayer: 'Все за наш счёт',
    extraWorkPayment: 'Сметы',
    extraWorkAdvance: 'Без аванса',
    shortAddress: 'Поливановой, 12А',
    documentsType: '—',
    tenant: '—',
    estimatedTime: '—',
    notes: '—',
    toolsOnSite: 'нет'
  },
  {
    id: 3,
    name: 'ЗАО «ПИОНЕР» 4',
    client: 'ВСТ',
    customer: 'ВСТ',
    contractNumber: 'В процессе',
    contract: 'В процессе',
    contractType: 'ПИР',
    type: 'ПИР',
    systems: 'АПС, СОУЭ',
    cost: '120 000',
    fullAddress: 'г. Москва, Симферопольский бульвар, дом 25, корп. 4',
    address: 'г. Москва, Симферопольский бульвар, дом 25, корп. 4',
    contact: 'Сидоров С.С. (+79994445566)',
    payment: 'Расчет по договору',
    contractor: 'ВСТ',
    startDate: '—',
    endDate: '—',
    prolongationType: '—',
    maintenancePriceLetter: '—',
    priceIncreaseDate: '—',
    addAgreement: '—',
    repairPayer: '—',
    extraWorkPayment: '—',
    extraWorkAdvance: '—',
    shortAddress: 'Симферопольский, 25',
    documentsType: '—',
    tenant: '—',
    estimatedTime: '—',
    notes: 'Проектные работы',
    toolsOnSite: 'нет'
  },
  {
    id: 4,
    name: 'ИП Пупкин',
    client: 'ИП Пупкин',
    customer: 'ИП Пупкин',
    contractNumber: '№ 1-281224-РБ',
    contract: '№ 1-281224-РБ',
    contractType: 'СМР',
    type: 'СМР',
    systems: 'АПС, СОУЭ, ВПВ',
    cost: '45 000',
    fullAddress: 'Касаткина д.3 стр. 1 пом 408',
    address: 'Касаткина д.3 стр. 1 пом 408',
    contact: 'Пупкин В.В. (+79998889900)',
    payment: 'КП',
    contractor: 'ИП Пупкин',
    startDate: '28.12.2024',
    endDate: '28.06.2025',
    prolongationType: '—',
    maintenancePriceLetter: '—',
    priceIncreaseDate: '—',
    addAgreement: '—',
    repairPayer: 'Все за наш счёт',
    extraWorkPayment: 'Сметы',
    extraWorkAdvance: 'Без аванса',
    shortAddress: 'Касаткина, 3',
    documentsType: '—',
    tenant: '—',
    estimatedTime: '—',
    notes: '—',
    toolsOnSite: 'да'
  }
];

const MENU_ITEMS = [
  { id: 'objects', label: 'Объекты', icon: Building2 },
  { id: 'systems', label: 'Системы', icon: Settings },
  { id: 'costs', label: 'Затраты и Договоры', icon: DollarSign },
  { id: 'contacts', label: 'Контакты', icon: Users },
  { id: 'tools', label: 'Инструмент', icon: Wrench },
  { id: 'tree', label: 'Дерево', icon: ClipboardList },
  { id: 'summary', label: 'Сводная', icon: BarChart3 },
  { id: 'calls', label: 'Вызовы', icon: Phone },
  { id: 'activation', label: 'Актирование', icon: FileText },
  { id: 'buy', label: 'Купить', icon: DollarSign },
  { id: 'invoices', label: 'Счета', icon: FileText },
  { id: 'transport', label: 'Транспорт', icon: Truck },
  { id: 'staff', label: 'Персонал', icon: Users },
  { id: 'calendar_engineer', label: 'Календарь инженер', icon: Calendar },
  { id: 'calendar_object', label: 'Календарь объект', icon: Calendar },
  { id: 'accounts', label: 'Учетные записи', icon: Settings },
  { id: 'time', label: 'Время', icon: Calendar },
  { id: 'wishes', label: 'Пожелания', icon: ClipboardList }
];

function App() {
  // --- СТЕЙТЫ АВТОРИЗАЦИИ ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('demo_isAuthenticated') === 'true';
  });
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('authToken') || null;
  });
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // --- СТЕЙТЫ ДАННЫХ ---
  const [objects, setObjects] = useState(() => {
    const savedObjects = localStorage.getItem('demo_objects');
    return savedObjects ? JSON.parse(savedObjects) : INITIAL_OBJECTS;
  });
  const [activeTab, setActiveTab] = useState('objects');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- СТЕЙТЫ ФОРМЫ ---
  const [newFormData, setNewFormData] = useState({
    objectName: '',
    customer: '',
    contractor: 'СБ',
    contractNumber: '',
    startDate: '',
    endDate: '',
    contractType: 'ТО',
    prolongationType: '',
    maintenancePriceLetter: '',
    priceIncreaseDate: '',
    addAgreement: '',
    repairPayer: '',
    extraWorkPayment: '',
    extraWorkAdvance: '',
    fullAddress: '',
    shortAddress: '',
    systems: '',
    estimatedTime: '',
    contact: '',
    notes: '',
    toolsOnSite: 'нет'
  });

  // --- СТЕЙТЫ РЕДАКТИРОВАНИЯ ---
  const [editingObject, setEditingObject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // --- СТЕЙТЫ ЭКСПОРТА ---
  const [isExporting, setIsExporting] = useState(false);

  // --- ЭФФЕКТЫ ---
  useEffect(() => {
    localStorage.setItem('demo_objects', JSON.stringify(objects));
  }, [objects]);

  // --- ЛОГИКА АВТОРИЗАЦИИ ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);

    // Имитируем задержку ответа сети
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (authEmail === 'admin@baza.ru' && authPassword === 'baza123') {
      const fakeToken = 'demo_jwt_token_baza_2026';
      localStorage.setItem('authToken', fakeToken);
      localStorage.setItem('demo_isAuthenticated', 'true');
      setAuthToken(fakeToken);
      setIsAuthenticated(true);
      setAuthEmail('');
      setAuthPassword('');
    } else {
      setAuthError('Неверный email или пароль. Используйте admin@baza.ru / baza123');
    }
    setIsAuthLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('demo_isAuthenticated');
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  // --- ЛОГИКА ЭКСПОРТА ---
  const handleExportFiles = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      let csvContent = "ID;Наименование объекта;Заказчик;Подрядчик;Договор;Тип договора;Системы;Адрес;Контакт;Оплата;Стоимость\n";
      objects.forEach(obj => {
        csvContent += `${obj.id};${obj.name || ''};${obj.customer || obj.client || ''};${obj.contractor || ''};${obj.contractNumber || obj.contract || ''};${obj.contractType || obj.type || ''};${obj.systems || ''};${obj.fullAddress || obj.address || ''};${obj.contact || ''};${obj.payment || ''};${obj.cost || ''}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `baza_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      alert('Ошибка генерации файла экспорта');
    }
    setIsExporting(false);
  };

  // --- ЛОГИКА ДОБАВЛЕНИЯ ---
  const handleAddObject = (e) => {
    e.preventDefault();
    if (!newFormData.objectName.trim() || !newFormData.customer.trim()) {
      alert('Заполните обязательно: Наименование объекта и Заказчика!');
      return;
    }

    const newObj = {
      id: Date.now(),
      name: newFormData.objectName,
      client: newFormData.customer,
      customer: newFormData.customer,
      contractor: newFormData.contractor || 'СБ',
      contractNumber: newFormData.contractNumber || 'Заполняется вручную',
      contract: newFormData.contractNumber || 'Заполняется вручную',
      startDate: newFormData.startDate || '—',
      endDate: newFormData.endDate || '—',
      contractType: newFormData.contractType,
      type: newFormData.contractType,
      prolongationType: newFormData.prolongationType || '—',
      maintenancePriceLetter: newFormData.maintenancePriceLetter || '—',
      priceIncreaseDate: newFormData.priceIncreaseDate || '—',
      addAgreement: newFormData.addAgreement || '—',
      repairPayer: newFormData.repairPayer || '—',
      extraWorkPayment: newFormData.extraWorkPayment || '—',
      extraWorkAdvance: newFormData.extraWorkAdvance || '—',
      fullAddress: newFormData.fullAddress || 'Не указан',
      address: newFormData.fullAddress || 'Не указан',
      shortAddress: newFormData.shortAddress || '—',
      systems: newFormData.systems || '—',
      estimatedTime: newFormData.estimatedTime || '—',
      contact: newFormData.contact || '—',
      notes: newFormData.notes || '—',
      toolsOnSite: newFormData.toolsOnSite,
      payment: '—',
      cost: '—'
    };

    setObjects([newObj, ...objects]);

    // Очищаем форму
    setNewFormData({
      objectName: '',
      customer: '',
      contractor: 'СБ',
      contractNumber: '',
      startDate: '',
      endDate: '',
      contractType: 'ТО',
      prolongationType: '',
      maintenancePriceLetter: '',
      priceIncreaseDate: '',
      addAgreement: '',
      repairPayer: '',
      extraWorkPayment: '',
      extraWorkAdvance: '',
      fullAddress: '',
      shortAddress: '',
      systems: '',
      estimatedTime: '',
      contact: '',
      notes: '',
      toolsOnSite: 'нет'
    });
  };

  // --- ЛОГИКА УДАЛЕНИЯ ---
  const handleDeleteObject = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот объект из базы?')) {
      setObjects(objects.filter(obj => obj.id !== id));
    }
  };

  // --- ЛОГИКА РЕДАКТИРОВАНИЯ ---
  const handleEditObject = (obj) => {
    setEditingObject({ ...obj });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setObjects(objects.map(obj => obj.id === editingObject.id ? editingObject : obj));
    setIsEditModalOpen(false);
    setEditingObject(null);
  };

  const handleEditChange = (field, value) => {
    setEditingObject({ ...editingObject, [field]: value });
  };

  // --- ФИЛЬТРАЦИЯ ---
  const filteredObjects = objects.filter(obj => {
    const query = searchQuery.toLowerCase();
    return (
      (obj.name || '').toLowerCase().includes(query) ||
      (obj.customer || '').toLowerCase().includes(query) ||
      (obj.contractNumber || '').toLowerCase().includes(query) ||
      (obj.systems || '').toLowerCase().includes(query)
    );
  });

  // --- ЭКРАН АВТОРИЗАЦИИ ---
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <Building2 size={48} />
            </div>
            <h1>База</h1>
            <p>CRM система для управления объектами</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@baza.ru"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="baza123"
                required
              />
            </div>
            {authError && <div className="auth-error">{authError}</div>}
            <button type="submit" className="btn btn-primary btn-full" disabled={isAuthLoading}>
              {isAuthLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Войти'
              )}
            </button>
          </form>
          <div className="login-hint">
            <p>Демо-доступ: <code>admin@baza.ru</code> / <code>baza123</code></p>
          </div>
        </div>
      </div>
    );
  }

  // --- ОСНОВНОЕ ПРИЛОЖЕНИЕ ---
  return (
    <div className="app">
      {/* ХЕДЕР */}
      <header className="header">
        <div className="header-left">
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="logo">
            <Building2 size={28} />
            <span>База</span>
          </div>
        </div>
        <div className="header-right">
          <div className="objects-count">
            Объектов: <strong>{objects.length}</strong>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={handleExportFiles}
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
        </div>
      </header>

      <div className="main-layout">
        {/* БОКОВОЕ МЕНЮ */}
        <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {MENU_ITEMS.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
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

        {/* КОНТЕНТ */}
        <main className="content">
          {activeTab === 'objects' && (
            <>
              {/* ПОИСК И ДОБАВЛЕНИЕ */}
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
                    <button className="clear-search" onClick={() => setSearchQuery('')}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* ТАБЛИЦА */}
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Наименование</th>
                      <th>Заказчик</th>
                      <th>Тип</th>
                      <th>Договор</th>
                      <th>Системы</th>
                      <th>Адрес</th>
                      <th>Контакт</th>
                      <th>Оплата</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredObjects.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="empty-state">
                          {searchQuery ? 'Ничего не найдено' : 'Нет объектов'}
                        </td>
                      </tr>
                    ) : (
                      filteredObjects.map(obj => (
                        <tr key={obj.id}>
                          <td className="cell-id">{obj.id}</td>
                          <td className="cell-name">
                            <strong>{obj.name}</strong>
                          </td>
                          <td>
                            <span className="badge badge-client">{obj.customer || obj.client}</span>
                          </td>
                          <td>
                            <span className={`badge badge-type badge-${obj.contractType?.toLowerCase()}`}>
                              {obj.contractType || obj.type}
                            </span>
                          </td>
                          <td className="cell-contract">{obj.contractNumber || obj.contract}</td>
                          <td className="cell-systems">{obj.systems}</td>
                          <td className="cell-address">
                            <span className="address-text">
                              <MapPin size={14} />
                              {obj.shortAddress || obj.address?.substring(0, 30)}
                            </span>
                          </td>
                          <td className="cell-contact">{obj.contact}</td>
                          <td>
                            <span className={`badge badge-payment badge-${obj.payment?.toLowerCase().replace(/\s/g, '-')}`}>
                              {obj.payment}
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

              {/* ФОРМА ДОБАВЛЕНИЯ */}
              <div className="add-form-section">
                <h3>
                  <Plus size={20} />
                  Добавить новый объект
                </h3>
                <form onSubmit={handleAddObject} className="add-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Наименование объекта *</label>
                      <input
                        type="text"
                        value={newFormData.objectName}
                        onChange={(e) => setNewFormData({...newFormData, objectName: e.target.value})}
                        placeholder="Например: ТЦ Мега"
                      />
                    </div>
                    <div className="form-group">
                      <label>Заказчик *</label>
                      <input
                        type="text"
                        value={newFormData.customer}
                        onChange={(e) => setNewFormData({...newFormData, customer: e.target.value})}
                        placeholder="Например: ООО СтройИнвест"
                      />
                    </div>
                    <div className="form-group">
                      <label>Подрядчик</label>
                      <select
                        value={newFormData.contractor}
                        onChange={(e) => setNewFormData({...newFormData, contractor: e.target.value})}
                      >
                        <option value="СБ">СБ</option>
                        <option value="СБ+">СБ+</option>
                        <option value="ВСТ">ВСТ</option>
                        <option value="ИП">ИП</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Тип договора</label>
                      <select
                        value={newFormData.contractType}
                        onChange={(e) => setNewFormData({...newFormData, contractType: e.target.value})}
                      >
                        <option value="ТО">ТО (Техобслуживание)</option>
                        <option value="СМР">СМР (Строительно-монтажные работы)</option>
                        <option value="ПИР">ПИР (Проектные работы)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Номер договора</label>
                      <input
                        type="text"
                        value={newFormData.contractNumber}
                        onChange={(e) => setNewFormData({...newFormData, contractNumber: e.target.value})}
                        placeholder="№ 1-2024-РБ"
                      />
                    </div>
                    <div className="form-group">
                      <label>Дата начала</label>
                      <input
                        type="text"
                        value={newFormData.startDate}
                        onChange={(e) => setNewFormData({...newFormData, startDate: e.target.value})}
                        placeholder="ДД.ММ.ГГГГ"
                      />
                    </div>
                    <div className="form-group">
                      <label>Дата окончания</label>
                      <input
                        type="text"
                        value={newFormData.endDate}
                        onChange={(e) => setNewFormData({...newFormData, endDate: e.target.value})}
                        placeholder="ДД.ММ.ГГГГ"
                      />
                    </div>
                    <div className="form-group">
                      <label>Системы</label>
                      <input
                        type="text"
                        value={newFormData.systems}
                        onChange={(e) => setNewFormData({...newFormData, systems: e.target.value})}
                        placeholder="АПС, СОУЭ, ВПВ"
                      />
                    </div>
                    <div className="form-group form-group-full">
                      <label>Полный адрес</label>
                      <input
                        type="text"
                        value={newFormData.fullAddress}
                        onChange={(e) => setNewFormData({...newFormData, fullAddress: e.target.value})}
                        placeholder="г. Москва, ул. Примерная, д. 1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Короткий адрес</label>
                      <input
                        type="text"
                        value={newFormData.shortAddress}
                        onChange={(e) => setNewFormData({...newFormData, shortAddress: e.target.value})}
                        placeholder="Примерная, 1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Контакт</label>
                      <input
                        type="text"
                        value={newFormData.contact}
                        onChange={(e) => setNewFormData({...newFormData, contact: e.target.value})}
                        placeholder="Иванов Иван (+79991234567)"
                      />
                    </div>
                    <div className="form-group">
                      <label>Инструмент на объекте</label>
                      <select
                        value={newFormData.toolsOnSite}
                        onChange={(e) => setNewFormData({...newFormData, toolsOnSite: e.target.value})}
                      >
                        <option value="нет">Нет</option>
                        <option value="да">Да</option>
                      </select>
                    </div>
                    <div className="form-group form-group-full">
                      <label>Примечания</label>
                      <textarea
                        value={newFormData.notes}
                        onChange={(e) => setNewFormData({...newFormData, notes: e.target.value})}
                        placeholder="Дополнительная информация..."
                        rows={2}
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
          )}

          {/* ДРУГИЕ ВКЛАДКИ */}
          {activeTab !== 'objects' && (
            <div className="placeholder-section">
              <div className="placeholder-icon">
                {MENU_ITEMS.find(m => m.id === activeTab)?.icon && 
                  (() => {
                    const IconComponent = MENU_ITEMS.find(m => m.id === activeTab).icon;
                    return <IconComponent size={64} />;
                  })()
                }
              </div>
              <h2>{MENU_ITEMS.find(m => m.id === activeTab)?.label}</h2>
              <p>Этот раздел находится в разработке</p>
              <div className="coming-soon-features">
                <h4>Планируемые функции:</h4>
                <ul>
                  <li>Управление {MENU_ITEMS.find(m => m.id === activeTab)?.label.toLowerCase()}</li>
                  <li>Детальная аналитика</li>
                  <li>Интеграция с внешними сервисами</li>
                  <li>Автоматизация процессов</li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ */}
      {isEditModalOpen && editingObject && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Редактирование объекта</h2>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Наименование</label>
                  <input
                    type="text"
                    value={editingObject.name || ''}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Заказчик</label>
                  <input
                    type="text"
                    value={editingObject.customer || editingObject.client || ''}
                    onChange={(e) => handleEditChange('customer', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Тип договора</label>
                  <select
                    value={editingObject.contractType || editingObject.type || 'ТО'}
                    onChange={(e) => handleEditChange('contractType', e.target.value)}
                  >
                    <option value="ТО">ТО</option>
                    <option value="СМР">СМР</option>
                    <option value="ПИР">ПИР</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Номер договора</label>
                  <input
                    type="text"
                    value={editingObject.contractNumber || editingObject.contract || ''}
                    onChange={(e) => handleEditChange('contractNumber', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Системы</label>
                  <input
                    type="text"
                    value={editingObject.systems || ''}
                    onChange={(e) => handleEditChange('systems', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Адрес</label>
                  <input
                    type="text"
                    value={editingObject.fullAddress || editingObject.address || ''}
                    onChange={(e) => handleEditChange('fullAddress', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Контакт</label>
                  <input
                    type="text"
                    value={editingObject.contact || ''}
                    onChange={(e) => handleEditChange('contact', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Оплата</label>
                  <input
                    type="text"
                    value={editingObject.payment || ''}
                    onChange={(e) => handleEditChange('payment', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Стоимость</label>
                  <input
                    type="text"
                    value={editingObject.cost || ''}
                    onChange={(e) => handleEditChange('cost', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Инструмент на объекте</label>
                  <select
                    value={editingObject.toolsOnSite || 'нет'}
                    onChange={(e) => handleEditChange('toolsOnSite', e.target.value)}
                  >
                    <option value="нет">Нет</option>
                    <option value="да">Да</option>
                  </select>
                </div>
                <div className="form-group form-group-full">
                  <label>Примечания</label>
                  <textarea
                    value={editingObject.notes || ''}
                    onChange={(e) => handleEditChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  Сохранить изменения
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
