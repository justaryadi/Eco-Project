import { useEffect, useMemo, useState } from 'react'
import api from './api'
import './App.css'

const categoryIcons = {
  Hair: '💇',
  Shirt: '👕',
  Pants: '👖',
  Shoes: '👟',
  Hat: '🎩',
  Accessory: '🎒',
  Aura: '✨',
  Skin: '🧑',
}

const rarityClass = {
  Common: 'common',
  Uncommon: 'uncommon',
  Rare: 'rare',
  Epic: 'epic',
  Legendary: 'legendary',
}

function App() {
  // =====================================================
  // AUTH
  // =====================================================

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user')

    try {
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // =====================================================
  // QUEST
  // =====================================================

  const [quests, setQuests] = useState([])
  const [questLoading, setQuestLoading] = useState(false)
  const [questError, setQuestError] = useState('')

  const [showQuestForm, setShowQuestForm] = useState(false)
  const [editingQuest, setEditingQuest] = useState(null)

  const emptyQuestForm = {
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    due_date: '',
    completed: false,
  }

  const [questForm, setQuestForm] = useState(emptyQuestForm)

  // =====================================================
  // SHOP
  // =====================================================

  const [shopItems, setShopItems] = useState([])
  const [shopLoading, setShopLoading] = useState(false)
  const [shopError, setShopError] = useState('')
  const [shopCategory, setShopCategory] = useState('All')
  const [buyingItem, setBuyingItem] = useState(null)

  // =====================================================
  // INVENTORY
  // =====================================================

  const [inventory, setInventory] = useState([])
  const [inventoryLoading, setInventoryLoading] = useState(false)

  // =====================================================
  // AVATAR
  // =====================================================

  const [avatar, setAvatar] = useState(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarAction, setAvatarAction] = useState(null)

  // =====================================================
  // UI
  // =====================================================

  const [activePage, setActivePage] = useState('dashboard')

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    if (currentUser) {
      loadAllData()
    }
  }, [currentUser])

  const loadAllData = async () => {
    await Promise.all([
      getQuests(),
      getShop(),
      getInventory(),
      getAvatar(),
    ])
  }

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!loginForm.email || !loginForm.password) {
      setLoginError('Email dan password harus diisi.')
      return
    }

    try {
      setLoginLoading(true)
      setLoginError('')

      const response = await api.post('/login', loginForm)

      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      setCurrentUser(user)

      setLoginForm({
        email: '',
        password: '',
      })
    } catch (error) {
      console.error(error)

      setLoginError(
        error.response?.data?.message ||
          'Login gagal. Periksa email dan password.'
      )
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setCurrentUser(null)
    setQuests([])
    setShopItems([])
    setInventory([])
    setAvatar(null)
  }

  // =====================================================
  // QUEST - GET
  // =====================================================

  const getQuests = async () => {
    try {
      setQuestLoading(true)

      const response = await api.get('/quests')

      setQuests(Array.isArray(response.data) ? response.data : [])
      setQuestError('')
    } catch (error) {
      console.error(error)

      setQuestError(
        error.response?.data?.message ||
          'Gagal mengambil data quest.'
      )
    } finally {
      setQuestLoading(false)
    }
  }

  // =====================================================
  // QUEST - FORM
  // =====================================================

  const handleQuestChange = (e) => {
    const { name, value, type, checked } = e.target

    setQuestForm({
      ...questForm,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const resetQuestForm = () => {
    setQuestForm(emptyQuestForm)
    setEditingQuest(null)
    setShowQuestForm(false)
  }

  // =====================================================
  // QUEST - CREATE
  // =====================================================

  const handleQuestSubmit = async (e) => {
    e.preventDefault()

    if (!questForm.title.trim()) {
      setQuestError('Judul quest harus diisi.')
      return
    }

    try {
      setQuestError('')

      await api.post('/quests', {
        title: questForm.title,
        description: questForm.description,
        category: questForm.category,
        priority: questForm.priority,
        due_date: questForm.due_date || null,
        completed: false,
      })

      resetQuestForm()
      await getQuests()
    } catch (error) {
      console.error(error)

      setQuestError(
        error.response?.data?.message ||
          'Gagal membuat quest.'
      )
    }
  }

  // =====================================================
  // QUEST - EDIT
  // =====================================================

  const handleEditQuest = (quest) => {
    setEditingQuest(quest)

    setQuestForm({
      title: quest.title || '',
      description: quest.description || '',
      category: quest.category || '',
      priority: quest.priority || 'Medium',
      due_date: quest.due_date
        ? String(quest.due_date).substring(0, 10)
        : '',
      completed: Boolean(quest.completed),
    })

    setShowQuestForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // =====================================================
  // QUEST - UPDATE
  // =====================================================

  const handleQuestUpdate = async (e) => {
    e.preventDefault()

    if (!editingQuest) {
      return
    }

    if (!questForm.title.trim()) {
      setQuestError('Judul quest harus diisi.')
      return
    }

    try {
      setQuestError('')

      const response = await api.put(
        `/quests/${editingQuest.id}`,
        {
          title: questForm.title,
          description: questForm.description,
          category: questForm.category,
          priority: questForm.priority,
          due_date: questForm.due_date || null,
          completed: questForm.completed,
        }
      )

      // Update points & level jika backend memberikan data terbaru
      if (response.data?.points !== undefined) {
        updateUserStats(
          response.data.points,
          response.data.level
        )
      }

      resetQuestForm()
      await getQuests()
    } catch (error) {
      console.error(error)

      setQuestError(
        error.response?.data?.message ||
          'Gagal mengupdate quest.'
      )
    }
  }

  // =====================================================
  // QUEST - TOGGLE COMPLETE
  // =====================================================

  const handleToggleQuest = async (quest) => {
    try {
      const response = await api.put(
        `/quests/${quest.id}`,
        {
          title: quest.title,
          description: quest.description || '',
          category: quest.category || '',
          priority: quest.priority || '',
          due_date: quest.due_date || null,
          completed: !quest.completed,
        }
      )

      if (response.data?.points !== undefined) {
        updateUserStats(
          response.data.points,
          response.data.level
        )
      }

      await getQuests()
    } catch (error) {
      console.error(error)

      setQuestError(
        error.response?.data?.message ||
          'Gagal mengubah status quest.'
      )
    }
  }

  // =====================================================
  // QUEST - DELETE
  // =====================================================

  const handleDeleteQuest = async (id) => {
    const confirmed = window.confirm(
      'Yakin ingin menghapus quest ini?'
    )

    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/quests/${id}`)

      await getQuests()
    } catch (error) {
      console.error(error)

      setQuestError(
        error.response?.data?.message ||
          'Gagal menghapus quest.'
      )
    }
  }

  // =====================================================
  // USER STATS
  // =====================================================

  const updateUserStats = (points, level) => {
    setCurrentUser((previousUser) => {
      if (!previousUser) {
        return previousUser
      }

      const updatedUser = {
        ...previousUser,
        points,
        level,
      }

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )

      return updatedUser
    })
  }

  // =====================================================
  // SHOP - GET
  // =====================================================

  const getShop = async () => {
    try {
      setShopLoading(true)

      const response = await api.get('/shop')

      setShopItems(response.data?.items || [])

      if (response.data?.points !== undefined) {
        updateUserStats(
          response.data.points,
          response.data.level
        )
      }

      setShopError('')
    } catch (error) {
      console.error(error)

      setShopError(
        error.response?.data?.message ||
          'Gagal mengambil data shop.'
      )
    } finally {
      setShopLoading(false)
    }
  }

  // =====================================================
  // SHOP - BUY
  // =====================================================

  const handleBuyItem = async (item) => {
    if (item.owned) {
      return
    }

    if (
      currentUser?.points === undefined ||
      currentUser.points < item.price
    ) {
      setShopError(
        'Points kamu belum cukup untuk membeli item ini.'
      )
      return
    }

    try {
      setBuyingItem(item.id)
      setShopError('')

      const response = await api.post(
        `/shop/${item.id}/buy`
      )

      if (response.data?.points !== undefined) {
        updateUserStats(
          response.data.points,
          currentUser.level
        )
      }

      await Promise.all([
        getShop(),
        getInventory(),
      ])
    } catch (error) {
      console.error(error)

      setShopError(
        error.response?.data?.message ||
          'Gagal membeli item.'
      )
    } finally {
      setBuyingItem(null)
    }
  }

  // =====================================================
  // INVENTORY - GET
  // =====================================================

  const getInventory = async () => {
    try {
      setInventoryLoading(true)

      const response = await api.get(
        '/avatar/inventory'
      )

      setInventory(
        Array.isArray(response.data)
          ? response.data
          : []
      )
    } catch (error) {
      console.error(error)

      setInventory([])
    } finally {
      setInventoryLoading(false)
    }
  }

  // =====================================================
  // AVATAR - GET
  // =====================================================

  const getAvatar = async () => {
    try {
      setAvatarLoading(true)

      const response = await api.get('/avatar')

      setAvatar(response.data || null)
    } catch (error) {
      console.error(error)

      setAvatar(null)
    } finally {
      setAvatarLoading(false)
    }
  }

  // =====================================================
  // AVATAR - EQUIP
  // =====================================================

  const handleEquip = async (itemId) => {
    try {
      setAvatarAction(itemId)

      await api.post(`/avatar/${itemId}/equip`)

      await Promise.all([
        getAvatar(),
        getInventory(),
        getShop(),
      ])
    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.message ||
          'Gagal memakai item.'
      )
    } finally {
      setAvatarAction(null)
    }
  }

  // =====================================================
  // AVATAR - UNEQUIP
  // =====================================================

  const handleUnequip = async (itemId) => {
    try {
      setAvatarAction(itemId)

      await api.post(`/avatar/${itemId}/unequip`)

      await Promise.all([
        getAvatar(),
        getInventory(),
        getShop(),
      ])
    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.message ||
          'Gagal melepas item.'
      )
    } finally {
      setAvatarAction(null)
    }
  }

  // =====================================================
  // CALCULATIONS
  // =====================================================

  const completedQuests = useMemo(() => {
    return quests.filter(
      (quest) => Boolean(quest.completed)
    ).length
  }, [quests])

  const totalQuests = quests.length

  const progressPercentage =
    totalQuests > 0
      ? Math.round(
          (completedQuests / totalQuests) * 100
        )
      : 0

  const level = currentUser?.level || 1
  const points = currentUser?.points || 0

  const pointsInsideLevel =
    points % 100

  const levelProgress =
    pointsInsideLevel

  const filteredShopItems =
    shopCategory === 'All'
      ? shopItems
      : shopItems.filter(
          (item) =>
            String(item.category).toLowerCase() ===
            shopCategory.toLowerCase()
        )

  const shopCategories = [
    'All',
    ...Array.from(
      new Set(
        shopItems.map((item) => item.category)
      )
    ),
  ]

  // =====================================================
  // AVATAR HELPERS
  // =====================================================

  const getAvatarItem = (slot) => {
    return avatar?.[slot] || null
  }

  const getAvatarEmoji = (item) => {
    if (!item) {
      return null
    }

    return categoryIcons[item.category] || '🌿'
  }

  const isItemEquipped = (itemId) => {
    return inventory.some(
      (inventoryItem) =>
        inventoryItem.shop_item_id === itemId &&
        inventoryItem.equipped
    )
  }

  // =====================================================
  // LOGIN PAGE
  // =====================================================

  if (!currentUser) {
    return (
      <div className="login-page">
        <div className="login-background">
          <div className="floating-leaf leaf-one">
            🍃
          </div>

          <div className="floating-leaf leaf-two">
            🌿
          </div>

          <div className="floating-leaf leaf-three">
            🍃
          </div>
        </div>

        <div className="login-card">
          <div className="login-logo">
            <div className="logo-icon">
              🌱
            </div>

            <div>
              <strong>Eco</strong>
              <span>Project</span>
            </div>
          </div>

          <div className="login-heading">
            <p>WELCOME BACK</p>
            <h1>Let's make an impact.</h1>

            <span>
              Login untuk melanjutkan perjalanan
              eco-friendly kamu.
            </span>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="contoh@email.com"
              />
            </div>

            <div className="form-field">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Masukkan password"
              />
            </div>

            {loginError && (
              <div className="error-box">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="primary-button login-button"
              disabled={loginLoading}
            >
              {loginLoading
                ? 'Logging in...'
                : 'Login →'}
            </button>
          </form>

          <div className="login-footer">
            🌍 Every small action matters.
          </div>
        </div>
      </div>
    )
  }

  // =====================================================
  // MAIN APP
  // =====================================================

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <div
          className="brand"
          onClick={() => setActivePage('dashboard')}
        >
          <div className="brand-icon">
            🌱
          </div>

          <div className="brand-text">
            <strong>Eco</strong>
            <span>Project</span>
          </div>
        </div>

        <nav className="main-nav">
          <button
            className={
              activePage === 'dashboard'
                ? 'nav-link active'
                : 'nav-link'
            }
            onClick={() =>
              setActivePage('dashboard')
            }
          >
            Dashboard
          </button>

          <button
            className={
              activePage === 'quests'
                ? 'nav-link active'
                : 'nav-link'
            }
            onClick={() =>
              setActivePage('quests')
            }
          >
            Quests
          </button>

          <button
            className={
              activePage === 'shop'
                ? 'nav-link active'
                : 'nav-link'
            }
            onClick={() =>
              setActivePage('shop')
            }
          >
            Shop
          </button>

          <button
            className={
              activePage === 'inventory'
                ? 'nav-link active'
                : 'nav-link'
            }
            onClick={() =>
              setActivePage('inventory')
            }
          >
            Inventory
          </button>
        </nav>

        <div className="navbar-right">
          <div className="points-pill">
            <span>💎</span>
            <strong>{points}</strong>
            <small>PTS</small>
          </div>

          <div className="user-mini">
            <div className="user-avatar-mini">
              {currentUser.name
                ?.charAt(0)
                ?.toUpperCase() || 'U'}
            </div>

            <div>
              <strong>{currentUser.name}</strong>
              <span>Level {level}</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main>
        {/* =================================================
            DASHBOARD
        ================================================= */}
        {activePage === 'dashboard' && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <div className="eyebrow">
                  <span>✦</span>
                  ECO ADVENTURE
                </div>

                <h1>
                  Small actions.
                  <br />
                  <span>Big impact.</span>
                </h1>

                <p>
                  Selesaikan quest, kumpulkan points,
                  naik level, dan customize avatar kamu
                  sambil melakukan hal baik untuk bumi.
                </p>

                <div className="hero-actions">
                  <button
                    className="primary-button"
                    onClick={() =>
                      setActivePage('quests')
                    }
                  >
                    Start Quest →
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() =>
                      setActivePage('shop')
                    }
                  >
                    🛍 Open Shop
                  </button>
                </div>
              </div>

              {/* HERO AVATAR */}
              <div className="hero-avatar-card">
                <div className="avatar-card-top">
                  <div>
                    <span className="avatar-kicker">CHARACTER</span>
                    <strong>{currentUser.name}</strong>
                  </div>
                  <div className="avatar-level-badge">
                    <span>LV</span>
                    <strong>{level}</strong>
                  </div>
                </div>

                <div className="avatar-stage">
                  {avatar?.aura && (
                    <div className="character-aura">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}

                  <div className="character-shadow"></div>

                  <div className="character">
                    {/* Back accessory */}
                    {avatar?.accessory && (
                      <div className="character-backpack">
                        <span></span>
                        <i></i>
                      </div>
                    )}

                    {/* Hair behind head */}
                    <div className="character-hair-back"></div>

                    {/* Head */}
                    <div className="character-head">
                      <div className="character-hair">
                        {avatar?.hair && <span></span>}
                      </div>

                      {avatar?.hat && (
                        <div className="character-hat">
                          <span></span>
                          <i></i>
                        </div>
                      )}

                      <div className="character-face">
                        <span className="eye left"></span>
                        <span className="eye right"></span>
                        <span className="mouth"></span>
                        <span className="cheek left"></span>
                        <span className="cheek right"></span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="character-torso">
                      <div className="character-shirt">
                        <span className="shirt-logo">♻</span>
                      </div>
                      <div className="character-arm left"></div>
                      <div className="character-arm right"></div>
                    </div>

                    {/* Pants */}
                    <div className="character-legs">
                      <div className="character-leg left"></div>
                      <div className="character-leg right"></div>
                    </div>

                    {/* Shoes */}
                    <div className="character-feet">
                      <div className="character-shoe left"></div>
                      <div className="character-shoe right"></div>
                    </div>

                    {avatar?.accessory && (
                      <div className="character-accessory">
                        <span></span>
                      </div>
                    )}
                  </div>

                  <div className="avatar-item-tags">
                    {avatar?.hair && <span>HAIR</span>}
                    {avatar?.shirt && <span>TOP</span>}
                    {avatar?.pants && <span>BOTTOM</span>}
                    {avatar?.shoes && <span>SHOES</span>}
                    {avatar?.hat && <span>HAT</span>}
                    {avatar?.aura && <span>EFFECT</span>}
                  </div>
                </div>

                <div className="avatar-bottom-info">
                  <div>
                    <strong>Eco Explorer</strong>
                    <span>{inventory.length} items collected</span>
                  </div>
                  <button
                    className="avatar-customize-button"
                    onClick={() => setActivePage('inventory')}
                  >
                    Customize
                    <span>→</span>
                  </button>
                </div>
              </div>
            </section>

            {/* STATS */}
            <section className="dashboard-section">
              <div className="stats-grid">
                <div className="stat-card green">
                  <div className="stat-icon">
                    ⭐
                  </div>

                  <div>
                    <span>Total Points</span>
                    <strong>{points}</strong>
                  </div>
                </div>

                <div className="stat-card purple">
                  <div className="stat-icon">
                    🏆
                  </div>

                  <div>
                    <span>Current Level</span>
                    <strong>{level}</strong>
                  </div>
                </div>

                <div className="stat-card blue">
                  <div className="stat-icon">
                    📋
                  </div>

                  <div>
                    <span>Completed</span>
                    <strong>
                      {completedQuests}
                    </strong>
                  </div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-icon">
                    🎒
                  </div>

                  <div>
                    <span>Items Owned</span>
                    <strong>
                      {inventory.length}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {/* LEVEL */}
            <section className="level-section">
              <div className="level-card">
                <div className="level-top">
                  <div>
                    <span className="level-small">
                      YOUR PROGRESS
                    </span>

                    <h2>
                      Level {level}
                    </h2>
                  </div>

                  <div className="level-badge">
                    🌱
                  </div>
                </div>

                <div className="level-progress">
                  <div
                    className="level-progress-fill"
                    style={{
                      width: `${levelProgress}%`,
                    }}
                  ></div>
                </div>

                <div className="level-progress-text">
                  <span>
                    {pointsInsideLevel} / 100 XP
                  </span>

                  <span>
                    {100 - pointsInsideLevel} XP
                    to next level
                  </span>
                </div>
              </div>

              <div className="impact-card">
                <div className="impact-icon">
                  🌎
                </div>

                <div>
                  <span>YOUR IMPACT</span>

                  <strong>
                    Keep making the planet
                    greener!
                  </strong>
                </div>
              </div>
            </section>

            {/* RECENT QUESTS */}
            <section className="content-section">
              <div className="section-heading">
                <div>
                  <span className="section-eyebrow">
                    ADVENTURE
                  </span>

                  <h2>Recent Quests</h2>
                </div>

                <button
                  className="text-button"
                  onClick={() =>
                    setActivePage('quests')
                  }
                >
                  View All →
                </button>
              </div>

              {quests.length === 0 ? (
                <div className="empty-state">
                  <div>🌱</div>
                  <h3>No quests yet</h3>
                  <p>
                    Buat quest pertama kamu dan
                    mulai perjalananmu.
                  </p>
                </div>
              ) : (
                <div className="quest-preview-grid">
                  {quests
                    .slice(0, 3)
                    .map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        onToggle={handleToggleQuest}
                        onEdit={handleEditQuest}
                        onDelete={
                          handleDeleteQuest
                        }
                      />
                    ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* =================================================
            QUEST PAGE
        ================================================= */}
        {activePage === 'quests' && (
          <section className="page-section">
            <div className="page-header">
              <div>
                <span className="section-eyebrow">
                  YOUR ADVENTURE
                </span>

                <h1>Quests</h1>

                <p>
                  Complete quests untuk mendapatkan
                  +10 points.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setEditingQuest(null)
                  setQuestForm(emptyQuestForm)
                  setShowQuestForm(true)
                }}
              >
                + New Quest
              </button>
            </div>

            {/* QUEST FORM */}
            {showQuestForm && (
              <div className="form-card">
                <div className="form-card-header">
                  <div>
                    <span className="section-eyebrow">
                      QUEST BUILDER
                    </span>

                    <h2>
                      {editingQuest
                        ? 'Edit Quest'
                        : 'Create New Quest'}
                    </h2>
                  </div>

                  <button
                    className="close-button"
                    onClick={resetQuestForm}
                  >
                    ×
                  </button>
                </div>

                <form
                  onSubmit={
                    editingQuest
                      ? handleQuestUpdate
                      : handleQuestSubmit
                  }
                  className="quest-form"
                >
                  <div className="form-grid">
                    <div className="form-field">
                      <label>
                        Quest Title
                      </label>

                      <input
                        name="title"
                        value={questForm.title}
                        onChange={handleQuestChange}
                        placeholder="Contoh: Bawa botol reusable"
                      />
                    </div>

                    <div className="form-field">
                      <label>
                        Category
                      </label>

                      <input
                        name="category"
                        value={questForm.category}
                        onChange={handleQuestChange}
                        placeholder="Environment"
                      />
                    </div>

                    <div className="form-field full">
                      <label>
                        Description
                      </label>

                      <textarea
                        name="description"
                        value={
                          questForm.description
                        }
                        onChange={handleQuestChange}
                        placeholder="Deskripsikan quest..."
                        rows="4"
                      />
                    </div>

                    <div className="form-field">
                      <label>
                        Priority
                      </label>

                      <select
                        name="priority"
                        value={questForm.priority}
                        onChange={handleQuestChange}
                      >
                        <option value="Low">
                          Low
                        </option>

                        <option value="Medium">
                          Medium
                        </option>

                        <option value="High">
                          High
                        </option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>
                        Due Date
                      </label>

                      <input
                        type="date"
                        name="due_date"
                        value={
                          questForm.due_date
                        }
                        onChange={handleQuestChange}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={resetQuestForm}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="primary-button"
                    >
                      {editingQuest
                        ? 'Save Changes'
                        : 'Create Quest'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {questError && (
              <div className="error-box page-error">
                {questError}
              </div>
            )}

            <div className="quest-summary">
              <div>
                <span>Progress</span>

                <strong>
                  {completedQuests} / {totalQuests}
                </strong>
              </div>

              <div className="summary-progress">
                <div
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                ></div>
              </div>

              <span>
                {progressPercentage}%
              </span>
            </div>

            {questLoading ? (
              <div className="loading-state">
                Loading quests...
              </div>
            ) : quests.length === 0 ? (
              <div className="empty-state large">
                <div>🗺️</div>

                <h3>
                  Your adventure starts here
                </h3>

                <p>
                  Belum ada quest. Buat quest
                  pertamamu sekarang.
                </p>
              </div>
            ) : (
              <div className="quest-grid">
                {quests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onToggle={handleToggleQuest}
                    onEdit={handleEditQuest}
                    onDelete={
                      handleDeleteQuest
                    }
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* =================================================
            SHOP PAGE
        ================================================= */}
        {activePage === 'shop' && (
          <section className="page-section">
            <div className="page-header shop-header">
              <div>
                <span className="section-eyebrow">
                  AVATAR CUSTOMIZATION
                </span>

                <h1>Eco Shop</h1>

                <p>
                  Gunakan points untuk unlock
                  item avatar baru.
                </p>
              </div>

              <div className="shop-balance">
                <span>💎</span>

                <div>
                  <small>Your Balance</small>
                  <strong>
                    {points} Points
                  </strong>
                </div>
              </div>
            </div>

            {shopError && (
              <div className="error-box page-error">
                {shopError}
              </div>
            )}

            <div className="category-tabs">
              {shopCategories.map(
                (category) => (
                  <button
                    key={category}
                    className={
                      shopCategory === category
                        ? 'category-tab active'
                        : 'category-tab'
                    }
                    onClick={() =>
                      setShopCategory(category)
                    }
                  >
                    {category === 'All'
                      ? '✨ All Items'
                      : `${categoryIcons[category] || '🌿'} ${category}`}
                  </button>
                )
              )}
            </div>

            {shopLoading ? (
              <div className="loading-state">
                Loading shop...
              </div>
            ) : (
              <div className="shop-grid">
                {filteredShopItems.map(
                  (item) => {
                    const equipped =
                      isItemEquipped(item.id)

                    return (
                      <div
                        className={`shop-card ${
                          rarityClass[
                            item.rarity
                          ] || 'common'
                        }`}
                        key={item.id}
                      >
                        <div className="shop-card-top">
                          <span
                            className={`rarity-badge ${
                              rarityClass[
                                item.rarity
                              ] || 'common'
                            }`}
                          >
                            {item.rarity}
                          </span>

                          {item.owned && (
                            <span className="owned-badge">
                              ✓ Owned
                            </span>
                          )}
                        </div>

                        <div className="shop-item-visual">
                          <div className="item-glow"></div>

                          <span className="item-emoji">
                            {categoryIcons[
                              item.category
                            ] || '🌿'}
                          </span>
                        </div>

                        <div className="shop-item-info">
                          <span className="item-category">
                            {item.category}
                          </span>

                          <h3>{item.name}</h3>

                          <p>
                            {item.description ||
                              'Eco item untuk avatar kamu.'}
                          </p>
                        </div>

                        <div className="shop-card-bottom">
                          <div className="price">
                            <span>💎</span>

                            <strong>
                              {item.price}
                            </strong>
                          </div>

                          {equipped ? (
                            <button
                              className="equipped-button"
                              onClick={() =>
                                handleUnequip(
                                  item.id
                                )
                              }
                              disabled={
                                avatarAction ===
                                item.id
                              }
                            >
                              {avatarAction ===
                              item.id
                                ? '...'
                                : 'Equipped ✓'}
                            </button>
                          ) : item.owned ? (
                            <button
                              className="equip-button"
                              onClick={() =>
                                handleEquip(
                                  item.id
                                )
                              }
                              disabled={
                                avatarAction ===
                                item.id
                              }
                            >
                              {avatarAction ===
                              item.id
                                ? '...'
                                : 'Equip'}
                            </button>
                          ) : (
                            <button
                              className="buy-button"
                              onClick={() =>
                                handleBuyItem(
                                  item
                                )
                              }
                              disabled={
                                buyingItem ===
                                item.id ||
                                points <
                                  item.price
                              }
                            >
                              {buyingItem ===
                              item.id
                                ? 'Buying...'
                                : points <
                                  item.price
                                ? 'Locked'
                                : 'Buy'}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </section>
        )}

        {/* =================================================
            INVENTORY PAGE
        ================================================= */}
        {activePage === 'inventory' && (
          <section className="page-section">
            <div className="page-header">
              <div>
                <span className="section-eyebrow">
                  YOUR COLLECTION
                </span>

                <h1>Inventory</h1>

                <p>
                  Semua item yang sudah kamu miliki.
                </p>
              </div>

              <div className="inventory-count">
                <strong>
                  {inventory.length}
                </strong>

                <span>Items</span>
              </div>
            </div>

            <div className="inventory-layout">
              {/* AVATAR PREVIEW */}
              <div className="inventory-avatar-card">
                <div className="inventory-avatar-header">
                  <span>AVATAR PREVIEW</span>

                  <strong>
                    Level {level}
                  </strong>
                </div>

                <div className="inventory-avatar">
                  <AvatarPreview
                    avatar={avatar}
                    currentUser={currentUser}
                    level={level}
                    compact
                  />
                </div>

                <button
                  className="primary-button full-button"
                  onClick={() =>
                    setActivePage('shop')
                  }
                >
                  Customize Avatar →
                </button>
              </div>

              {/* ITEMS */}
              <div className="inventory-items">
                {inventoryLoading ? (
                  <div className="loading-state">
                    Loading inventory...
                  </div>
                ) : inventory.length === 0 ? (
                  <div className="empty-state">
                    <div>🎒</div>

                    <h3>
                      Inventory masih kosong
                    </h3>

                    <p>
                      Kunjungi shop dan mulai
                      mengoleksi item.
                    </p>

                    <button
                      className="primary-button"
                      onClick={() =>
                        setActivePage('shop')
                      }
                    >
                      Open Shop
                    </button>
                  </div>
                ) : (
                  <div className="inventory-grid">
                    {inventory.map(
                      (inventoryItem) => {
                        const item =
                          inventoryItem.shopItem

                        if (!item) {
                          return null
                        }

                        const equipped =
                          inventoryItem.equipped

                        return (
                          <div
                            className={
                              equipped
                                ? 'inventory-card equipped'
                                : 'inventory-card'
                            }
                            key={
                              inventoryItem.id
                            }
                          >
                            <div className="inventory-visual">
                              <span>
                                {categoryIcons[
                                  item.category
                                ] || '🌿'}
                              </span>
                            </div>

                            <div>
                              <span className="item-category">
                                {item.category}
                              </span>

                              <h3>
                                {item.name}
                              </h3>
                            </div>

                            {equipped ? (
                              <button
                                className="equipped-button"
                                onClick={() =>
                                  handleUnequip(
                                    item.id
                                  )
                                }
                                disabled={
                                  avatarAction ===
                                  item.id
                                }
                              >
                                Equipped ✓
                              </button>
                            ) : (
                              <button
                                className="equip-button"
                                onClick={() =>
                                  handleEquip(
                                    item.id
                                  )
                                }
                                disabled={
                                  avatarAction ===
                                  item.id
                                }
                              >
                                {avatarAction ===
                                item.id
                                  ? '...'
                                  : 'Equip'}
                              </button>
                            )}
                          </div>
                        )
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-logo">
          🌱 <strong>EcoProject</strong>
        </div>

        <p>
          Make small actions. Create big changes. 🌍
        </p>

        <span>
          © 2026 Eco-Project
        </span>
      </footer>
    </div>
  )
}

// =======================================================
// AVATAR PREVIEW COMPONENT
// =======================================================

function AvatarPreview({ avatar, currentUser, level, compact = false }) {
  const item = (slot) => avatar?.[slot]

  return (
    <div className={`avatar-stage ${compact ? 'compact' : ''}`}>
      <div className="avatar-platform"></div>

      {item('aura') && (
        <div className="avatar-effect">
          <span>✦</span>
          <span>✦</span>
          <span>✧</span>
        </div>
      )}

      <div className="game-avatar">
        {item('accessory') && (
          <div className="avatar-backpack">
            <span>◈</span>
          </div>
        )}

        <div className="avatar-hair-back"></div>

        <div className="avatar-head">
          {item('hair') && <div className="avatar-hair"></div>}
          {item('hat') && <div className="avatar-hat"><span>♢</span></div>}
          <div className="avatar-face">
            <span className="eye left"></span>
            <span className="eye right"></span>
            <span className="mouth"></span>
          </div>
        </div>

        <div className="avatar-neck"></div>

        <div className="avatar-torso">
          <div className="avatar-shirt-detail">
            {item('shirt') ? 'ECO' : ''}
          </div>
        </div>

        <div className="avatar-arms">
          <div className="avatar-arm left"></div>
          <div className="avatar-arm right"></div>
        </div>

        <div className="avatar-legs">
          <div className="avatar-leg left">
            {item('pants') && <span></span>}
          </div>
          <div className="avatar-leg right">
            {item('pants') && <span></span>}
          </div>
        </div>

        <div className="avatar-feet">
          <div className="avatar-foot left">
            {item('shoes') && <span>+</span>}
          </div>
          <div className="avatar-foot right">
            {item('shoes') && <span>+</span>}
          </div>
        </div>
      </div>

      {!compact && (
        <div className="avatar-nameplate">
          <div>
            <strong>{currentUser?.name || 'Eco Explorer'}</strong>
            <span>LEVEL {level}</span>
          </div>
          <b>✦</b>
        </div>
      )}
    </div>
  )
}

// =======================================================
// QUEST CARD COMPONENT
// =======================================================

function QuestCard({
  quest,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <article
      className={
        quest.completed
          ? 'quest-card completed'
          : 'quest-card'
      }
    >
      <div className="quest-card-top">
        <div className="quest-icon">
          {quest.completed ? '✓' : '🌱'}
        </div>

        <span
          className={`quest-status ${
            quest.completed
              ? 'done'
              : 'pending'
          }`}
        >
          {quest.completed
            ? 'Completed'
            : 'In Progress'}
        </span>
      </div>

      <div className="quest-content">
        <span className="quest-category">
          {quest.category || 'General'}
        </span>

        <h3>{quest.title}</h3>

        <p>
          {quest.description ||
            'Complete this quest to earn points.'}
        </p>
      </div>

      <div className="quest-meta">
        <span>
          ⚡ +10 Points
        </span>

        <span>
          📅 {quest.due_date
            ? String(
                quest.due_date
              ).substring(0, 10)
            : 'No deadline'}
        </span>
      </div>

      <div className="quest-actions">
        <button
          className={
            quest.completed
              ? 'secondary-button small'
              : 'complete-button'
          }
          onClick={() => onToggle(quest)}
        >
          {quest.completed
            ? '↩ Undo'
            : '✓ Complete'}
        </button>

        <button
          className="icon-action"
          onClick={() => onEdit(quest)}
          title="Edit"
        >
          ✏️
        </button>

        <button
          className="icon-action danger"
          onClick={() => onDelete(quest.id)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </article>
  )
}

export default App