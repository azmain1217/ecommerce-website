import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDownUp,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Scale,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Truck,
  X,
} from 'lucide-react'
import './App.css'

const products = [
  {
    id: 'studio-pro',
    name: 'Studio Pro Headphones',
    category: 'Audio',
    description: 'Quiet the world. Keep the good stuff.',
    price: 349,
    oldPrice: 399,
    rating: 4.9,
    reviews: 284,
    label: 'BEST SELLER',
    color: 'Obsidian',
    variants: ['Obsidian', 'Frost', 'Electric teal'],
    image: 'photo-1505740420928-5e560c06d30e',
    specs: ['Adaptive noise cancelling', '40-hour battery', 'Spatial audio'],
  },
  {
    id: 'arc-speaker',
    name: 'Arc Bluetooth Speaker',
    category: 'Audio',
    description: 'Room-filling sound, shelf-friendly size.',
    price: 189,
    rating: 4.8,
    reviews: 163,
    label: 'NEW COLOR',
    color: 'Sea glass',
    variants: ['Sea glass', 'Midnight', 'Coral'],
    image: 'photo-1608043152269-423dbba4e7e1',
    specs: ['360-degree sound', '18-hour playtime', 'Water resistant'],
  },
  {
    id: 'field-camera',
    name: 'Field Camera 35',
    category: 'Photography',
    description: 'A little grain. A lot of feeling.',
    price: 579,
    rating: 4.7,
    reviews: 91,
    label: 'EDITOR PICK',
    color: 'Silver / black',
    variants: ['Silver / black', 'Graphite', 'Moss'],
    image: 'photo-1516035069371-29a1b244cc32',
    specs: ['24 MP sensor', '4K video', 'USB-C charging'],
  },
  {
    id: 'everyday-watch',
    name: 'Everyday Watch 2',
    category: 'Wearables',
    description: 'The useful bits, right on your wrist.',
    price: 229,
    rating: 4.6,
    reviews: 207,
    label: '',
    color: 'Cloud white',
    variants: ['Cloud white', 'Graphite', 'Sage'],
    image: 'photo-1523275335684-37898b6baf30',
    specs: ['7-day battery', 'Sleep and activity', '5 ATM water rating'],
  },
  {
    id: 'air-laptop',
    name: 'Air Laptop 13',
    category: 'Computing',
    description: 'Big ideas, very little weight.',
    price: 1099,
    rating: 4.9,
    reviews: 118,
    label: 'STAFF FAVORITE',
    color: 'Starlight',
    variants: ['Starlight', 'Midnight', 'Silver'],
    image: 'photo-1496181133206-80ce9b88a853',
    specs: ['13.6-inch display', '16 GB memory', 'Up to 18-hour battery'],
  },
  {
    id: 'mechanical-keys',
    name: 'Keys Mechanical Board',
    category: 'Accessories',
    description: 'A satisfying little click, all day long.',
    price: 149,
    rating: 4.8,
    reviews: 76,
    label: '',
    color: 'Graphite',
    variants: ['Graphite', 'Fog', 'Electric teal'],
    image: 'photo-1587829741301-dc798b83add3',
    specs: ['Hot-swappable switches', 'Wireless + USB-C', 'Mac and Windows'],
  },
  {
    id: 'pocket-buds',
    name: 'Pocket Buds ANC',
    category: 'Audio',
    description: 'Your soundtrack, minus the outside world.',
    price: 159,
    rating: 4.5,
    reviews: 332,
    label: 'UNDER $200',
    color: 'Porcelain',
    variants: ['Porcelain', 'Black', 'Sage'],
    image: 'photo-1606220945770-b5b6c2c55bf1',
    specs: ['Active noise cancelling', '28-hour case battery', 'Wireless charging'],
  },
  {
    id: 'desk-light',
    name: 'Orbit Desk Light',
    category: 'Accessories',
    description: 'A softer glow for late-night ideas.',
    price: 119,
    rating: 4.7,
    reviews: 54,
    label: '',
    color: 'Warm white',
    variants: ['Warm white', 'Slate', 'Brass'],
    image: 'photo-1507473885765-e6ed057f782c',
    specs: ['Adjustable color temperature', 'Touch dimmer', 'USB-C powered'],
  },
]

const categories = ['Everything', 'Audio', 'Computing', 'Photography', 'Wearables', 'Accessories']
const variantSwatches = {
  Obsidian: '#394353',
  Frost: '#d8e7eb',
  'Electric teal': '#35d6e8',
  'Sea glass': '#7cbcb8',
  Midnight: '#16263c',
  Coral: '#ff8b78',
  'Silver / black': 'linear-gradient(135deg, #b6c1cc 50%, #252d38 50%)',
  Graphite: '#596474',
  Moss: '#869585',
  'Cloud white': '#e8edf1',
  Sage: '#98b99a',
  Starlight: '#e2d3b5',
  Silver: '#becbd5',
  Fog: '#c0cbd0',
  Porcelain: '#f2eee6',
  Black: '#171b22',
  'Warm white': '#fff0ce',
  Slate: '#617087',
  Brass: '#b59055',
}
const imageUrl = (image, width = 720) => `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=85`
const formatPrice = (price) => `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

function App() {
  const [activeCategory, setActiveCategory] = useState('Everything')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [cart, setCart] = useState({})
  const [favorites, setFavorites] = useState([])
  const [compare, setCompare] = useState([])
  const [cartOpen, setCartOpenState] = useState(false)
  const [savedOpen, setSavedOpenState] = useState(false)
  const [cartClosing, setCartClosing] = useState(false)
  const [savedClosing, setSavedClosing] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)
  const [selectedProduct, setSelectedProductState] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState('')
  const [productClosing, setProductClosing] = useState(false)
  const [notice, setNotice] = useState('')
  const searchInput = useRef(null)
  const closeTimers = useRef({ cart: null, saved: null, product: null })

  const setCartOpen = useCallback((nextOpen) => {
    const shouldOpen = typeof nextOpen === 'function' ? nextOpen(cartOpen) : nextOpen
    if (shouldOpen) {
      window.clearTimeout(closeTimers.current.cart)
      closeTimers.current.cart = null
      setCartClosing(false)
      setCartOpenState(true)
    } else if (cartOpen && !closeTimers.current.cart) {
      setCartClosing(true)
      closeTimers.current.cart = window.setTimeout(() => {
        setCartOpenState(false)
        setCartClosing(false)
        closeTimers.current.cart = null
      }, 180)
    }
  }, [cartOpen])

  const setSavedOpen = useCallback((nextOpen) => {
    const shouldOpen = typeof nextOpen === 'function' ? nextOpen(savedOpen) : nextOpen
    if (shouldOpen) {
      window.clearTimeout(closeTimers.current.saved)
      closeTimers.current.saved = null
      setSavedClosing(false)
      setSavedOpenState(true)
    } else if (savedOpen && !closeTimers.current.saved) {
      setSavedClosing(true)
      closeTimers.current.saved = window.setTimeout(() => {
        setSavedOpenState(false)
        setSavedClosing(false)
        closeTimers.current.saved = null
      }, 180)
    }
  }, [savedOpen])

  const setSelectedProduct = useCallback((product) => {
    if (product) {
      window.clearTimeout(closeTimers.current.product)
      closeTimers.current.product = null
      setProductClosing(false)
      setSelectedProductState(product)
    } else if (selectedProduct && !closeTimers.current.product) {
      setProductClosing(true)
      closeTimers.current.product = window.setTimeout(() => {
        setSelectedProductState(null)
        setProductClosing(false)
        closeTimers.current.product = null
      }, 180)
    }
  }, [selectedProduct])

  function openProduct(product) {
    setSelectedVariant(product.variants?.[0] ?? product.color ?? '')
    setSelectedProduct(product)
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInput.current?.focus()
      }
      if (event.key === 'Escape') {
        setCartOpen(false)
        setSavedOpen(false)
        setCompareOpen(false)
        setSelectedProduct(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cartOpen, savedOpen, selectedProduct, setCartOpen, setSavedOpen, setSelectedProduct])

  useEffect(() => {
    if (!cartOpen && !savedOpen) return undefined

    function handleOutsideClick(event) {
      if (!(event.target instanceof Element)) return
      if (event.target.closest('.cart-drawer, .bag-button, .favorite-shortcut, .add-button, .favorite-button')) return
      setCartOpen(false)
      setSavedOpen(false)
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [cartOpen, savedOpen, setCartOpen, setSavedOpen])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timer)
  }, [notice])

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const filtered = products.filter((product) => {
      const matchesCategory = activeCategory === 'Everything' || product.category === activeCategory
      const matchesSearch = !normalizedSearch || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(normalizedSearch)
      return matchesCategory && matchesSearch
    })

    if (sort === 'price-low') return [...filtered].sort((first, second) => first.price - second.price)
    if (sort === 'price-high') return [...filtered].sort((first, second) => second.price - first.price)
    if (sort === 'rating') return [...filtered].sort((first, second) => second.rating - first.rating)
    return filtered
  }, [activeCategory, search, sort])

  const cartItems = Object.entries(cart).map(([cartKey, quantity]) => {
    const separatorIndex = cartKey.indexOf('::')
    const productId = cartKey.slice(0, separatorIndex)
    const variant = decodeURIComponent(cartKey.slice(separatorIndex + 2))
    const product = products.find((item) => item.id === productId)
    return {
      ...product,
      id: cartKey,
      variant,
      quantity,
      category: <><span className="cart-category-name">{product.category}</span><span className="cart-variant"><span className="cart-variant-dot" style={{ background: variantSwatches[variant] }} />{variant}</span></>,
    }
  })
  const savedProducts = products.filter((product) => favorites.includes(product.id))
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const subtotal = cartItems.reduce((total, product) => total + product.price * product.quantity, 0)
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8.95
  const comparedProducts = products.filter((product) => compare.includes(product.id))

  function addToCart(product, variant = product.variants?.[0] ?? product.color) {
    const cartKey = `${product.id}::${encodeURIComponent(variant)}`
    setCart((current) => ({ ...current, [cartKey]: (current[cartKey] || 0) + 1 }))
    setNotice(`${product.name} · ${variant} added to your bag`)
  }

  function changeQuantity(productId, amount) {
    setCart((current) => {
      const nextQuantity = (current[productId] || 0) + amount
      if (nextQuantity <= 0) {
        const next = { ...current }
        delete next[productId]
        return next
      }
      return { ...current, [productId]: nextQuantity }
    })
  }

  function toggleFavorite(productId) {
    setFavorites((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId])
  }

  function toggleCompare(productId) {
    setCompare((current) => {
      if (current.includes(productId)) return current.filter((id) => id !== productId)
      if (current.length >= 3) {
        setNotice('Compare up to three products at a time')
        return current
      }
      return [...current, productId]
    })
  }

  return (
    <div className={`storefront${cartClosing ? ' cart-closing' : ''}${savedClosing ? ' saved-closing' : ''}${productClosing ? ' product-closing' : ''}`}>
      <div className="announcement"><span>Complimentary shipping on orders over $100</span><span className="announcement-note">GOOD GEAR. GOOD DAYS.</span></div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Circuit Supply home">
          <span className="brand-mark">c.</span><span className="brand-name">circuit<span>supply</span></span>
        </a>
        <div className="header-search">
          <Search size={17} aria-hidden="true" />
          <input ref={searchInput} aria-label="Search products" placeholder="What are you looking for?" value={search} onChange={(event) => setSearch(event.target.value)} />
          <kbd>⌘ K</kbd>
        </div>
        <div className="header-actions">
          <button className={`icon-button favorite-shortcut ${savedOpen ? 'saved-active' : ''}`} type="button" aria-expanded={savedOpen} aria-label={`Open saved items, ${favorites.length} saved`} onClick={() => { setCartOpen(false); setSavedOpen((current) => !current) }}><Heart size={20} fill={savedOpen ? 'currentColor' : 'none'} /><span className="action-label">Saved{favorites.length ? ` (${favorites.length})` : ''}</span></button>
          <button className="bag-button" type="button" aria-expanded={cartOpen} onClick={() => { setSavedOpen(false); setCartOpen((current) => !current) }} aria-label={`Open shopping bag, ${cartCount} items`}><ShoppingBag size={19} /><span>Bag</span><span className="bag-count">{cartCount}</span></button>
        </div>
        {savedOpen && <div className="overlay saved-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setSavedOpen(false) }}><aside className="cart-drawer saved-drawer" role="dialog" aria-modal="true" aria-label="Saved items"><div className="drawer-heading"><div><span className="section-kicker">YOUR SHORTLIST</span><h2>Saved items <span>({savedProducts.length})</span></h2></div><button className="close-button" type="button" aria-label="Close saved items" onClick={() => setSavedOpen(false)}><X size={21} /></button></div>{savedProducts.length ? <div className="saved-lines">{savedProducts.map((product) => <div className="saved-line" key={product.id}><img src={imageUrl(product.image, 240)} alt="" /><div className="saved-line-copy"><span className="product-category">{product.category}</span><strong>{product.name}</strong><span>{formatPrice(product.price)}</span><div className="saved-line-actions"><button className="saved-remove" type="button" aria-label={`Remove ${product.name} from saved items`} onClick={() => toggleFavorite(product.id)}><Heart size={15} fill="currentColor" /></button><button className="saved-add" type="button" onClick={() => addToCart(product)}><Plus size={14} /><span>Add to bag</span></button></div></div></div>)}</div> : <div className="empty-bag saved-empty"><span className="empty-bag-icon"><Heart size={25} /></span><h3>Your shortlist starts here.</h3><p>Tap the heart on a product to save it for later.</p><button type="button" onClick={() => setSavedOpen(false)}>Explore the lineup <ArrowRight size={15} /></button></div>}</aside></div>}
      </header>

      <main id="top">
        <section className="hero-strip" aria-label="Featured collection">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> THE GOOD GEAR EDIT · 2026</div>
            <h1>Tech that just<br /><em>makes sense.</em></h1>
            <p>Thoughtful essentials for the way you work, play, and switch off.</p>
            <a className="hero-link" href="#shop">Shop the collection <ArrowRight size={16} /></a>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrap"><img src={imageUrl('photo-1505740420928-5e560c06d30e', 1000)} alt="Studio headphones in a rich burnt-orange finish" /></div>
            <div className="hero-sticker"><Sparkles size={14} /><span>GOOD SOUND.<br />NO FUSS.</span></div>
            <div className="hero-product-note"><span>01 / AUDIO</span><strong>Studio Pro</strong></div>
          </div>
          <div className="hero-index"><span>CURATED FOR REAL LIFE</span><span>SCROLL TO EXPLORE ↓</span></div>
        </section>

        <section className="benefits" aria-label="Shopping benefits">
          <div><Truck size={18} /><span>Free shipping over $100</span></div>
          <div><RotateCcw size={18} /><span>30-day easy returns</span></div>
          <div><ShieldCheck size={18} /><span>Two-year warranty, always</span></div>
          <div><Sparkles size={17} /><span>Only the stuff we love</span></div>
        </section>

        <section className="catalog" id="shop">
          <div className="catalog-heading">
            <div><p className="section-kicker">THE CURRENT LINEUP</p><h2>Good things, <em>picked well.</em></h2></div>
            <div className="catalog-tools">
              <label className="sort-control"><ArrowDownUp size={15} /><span className="sr-only">Sort products</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select><ChevronDown size={14} /></label>
              <span className="result-count">{visibleProducts.length} items</span>
            </div>
          </div>

          <div className="catalog-layout">
            <aside className="category-rail" aria-label="Product categories">
              <div className="rail-title"><SlidersHorizontal size={15} /><span>SHOP BY</span></div>
              {categories.map((category) => <button className={`category-button ${activeCategory === category ? 'active' : ''}`} key={category} type="button" onClick={() => setActiveCategory(category)}><span>{category}</span><span className="category-count">{category === 'Everything' ? products.length : products.filter((product) => product.category === category).length}</span></button>)}
              <div className="rail-note"><span className="note-mark">↗</span><p>Not sure where to start?</p><button type="button" onClick={() => { setActiveCategory('Everything'); setSort('rating') }}>Shop customer favorites</button></div>
            </aside>

            <div className="product-area">
              <div className="mobile-categories" aria-label="Product categories">{categories.map((category) => <button className={activeCategory === category ? 'active' : ''} key={category} type="button" onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
              <div className="product-grid">
                {visibleProducts.map((product, index) => (
                  <article className="product-card" key={product.id} style={{ '--card-index': index }}>
                    <div className={`product-photo photo-${product.id}`}>
                      <button className={`favorite-button ${favorites.includes(product.id) ? 'is-favorite' : ''}`} type="button" aria-label={favorites.includes(product.id) ? `Remove ${product.name} from saved items` : `Save ${product.name}`} onClick={() => toggleFavorite(product.id)}><Heart size={18} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button>
                      {product.label && <span className="product-label">{product.label}</span>}
                      <button className="photo-trigger" type="button" aria-label={`View ${product.name} details`} onClick={() => openProduct(product)}><img src={imageUrl(product.image, 680)} alt={product.name} loading={index > 3 ? 'lazy' : 'eager'} /></button>
                      <button className={`compare-toggle ${compare.includes(product.id) ? 'selected' : ''}`} type="button" onClick={() => toggleCompare(product.id)} aria-label={`${compare.includes(product.id) ? 'Remove from' : 'Add to'} comparison`} title="Compare"><span>{compare.includes(product.id) ? <Check size={13} /> : '+'}</span> Compare</button>
                    </div>
                    <div className="product-info">
                      <div className="product-category">{product.category}<span className="rating">★ {product.rating} <span>({product.reviews})</span></span></div>
                      <button className="product-name" type="button" onClick={() => openProduct(product)}>{product.name}</button>
                      <p className="product-description">{product.description}</p>
                      <div className="product-bottom"><div className="price-line"><strong>{formatPrice(product.price)}</strong>{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div><button className="add-button" type="button" aria-label={`Choose options for ${product.name}`} onClick={() => openProduct(product)}><Plus size={17} /></button></div>
                    </div>
                  </article>
                ))}
              </div>
              {visibleProducts.length === 0 && <div className="empty-results"><Search size={23} /><h3>No matches just yet.</h3><p>Try another search or explore all of our good gear.</p><button type="button" onClick={() => { setSearch(''); setActiveCategory('Everything') }}>Show everything <ArrowRight size={15} /></button></div>}
            </div>
          </div>
        </section>

        <footer className="site-footer"><a className="brand footer-brand" href="#top"><span className="brand-mark">c.</span><span className="brand-name">circuit<span>supply</span></span></a><p>Good gear. Good days. Since 2018.</p><span>© 2025 CIRCUIT SUPPLY</span></footer>
      </main>

      {compare.length > 0 && <div className="compare-bar"><div><Scale size={18} /><strong>{compare.length} selected</strong><span>{compare.length < 2 ? 'Select one more to compare' : 'Compare up to 3 products'}</span></div><button type="button" className="compare-open" disabled={compare.length < 2} onClick={() => setCompareOpen(true)}>Compare now <ArrowRight size={15} /></button><button className="compare-clear" type="button" onClick={() => setCompare([])} aria-label="Clear comparison"><X size={17} /></button></div>}

      {cartOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag"><div className="drawer-heading"><div><span className="section-kicker">YOUR GOOD GEAR</span><h2>Your bag <span>({cartCount})</span></h2></div><button className="close-button" type="button" aria-label="Close bag" onClick={() => setCartOpen(false)}><X size={21} /></button></div>{cartItems.length ? <><div className="cart-lines">{cartItems.map((product) => <div className="cart-line" key={product.id}><img src={imageUrl(product.image, 240)} alt="" /><div className="cart-line-copy"><span className="product-category">{product.category}</span><strong>{product.name}</strong><span>{formatPrice(product.price)}</span><div className="quantity-control"><button type="button" aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(product.id, -1)}><Minus size={13} /></button><span>{cart[product.id]}</span><button type="button" aria-label={`Add one ${product.name}`} onClick={() => changeQuantity(product.id, 1)}><Plus size={13} /></button></div></div><strong className="line-total">{formatPrice(product.price * cart[product.id])}</strong></div>)}</div><div className="cart-summary"><div className="shipping-message"><Truck size={16} />{shipping === 0 ? 'You unlocked free shipping.' : `${formatPrice(100 - subtotal)} away from free shipping.`}</div><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div><span>Shipping</span><strong>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</strong></div><div className="total-row"><span>Total</span><strong>{formatPrice(subtotal + shipping)}</strong></div><button className="checkout-button" type="button" onClick={() => { setCart({}); setCartOpen(false); setNotice('Demo checkout complete. Thanks for shopping Circuit Supply!') }}>Complete demo checkout <ArrowRight size={17} /></button><p className="checkout-note"><ShieldCheck size={14} /> Demo only · No payment is processed</p></div></> : <div className="empty-bag"><span className="empty-bag-icon"><ShoppingBag size={27} /></span><h3>Your bag is taking a breather.</h3><p>Find something good for your everyday.</p><button type="button" onClick={() => setCartOpen(false)}>Explore the lineup <ArrowRight size={15} /></button></div>}</aside></div>}

      {selectedProduct && <div className="overlay modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null) }}><section className="product-modal" role="dialog" aria-modal="true" aria-label={`${selectedProduct.name} product details`}><button className="close-button modal-close" type="button" aria-label="Close product details" onClick={() => setSelectedProduct(null)}><X size={21} /></button><div className="modal-photo"><img src={imageUrl(selectedProduct.image, 900)} alt={selectedProduct.name} /></div><div className="modal-copy"><span className="section-kicker">{selectedProduct.category} · ★ {selectedProduct.rating} ({selectedProduct.reviews} reviews)</span><h2>{selectedProduct.name}</h2><p>{selectedProduct.description}</p><strong className="modal-price">{formatPrice(selectedProduct.price)}</strong><div className="variant-picker"><div className="variant-heading"><span>COLOR</span><span>{selectedVariant}</span></div><div className="variant-swatches" role="group" aria-label={`Color options for ${selectedProduct.name}`}>{selectedProduct.variants.map((variant) => <button className={`variant-swatch ${selectedVariant === variant ? 'selected' : ''}`} type="button" key={variant} aria-label={`Choose ${variant}`} aria-pressed={selectedVariant === variant} onClick={() => setSelectedVariant(variant)}><span style={{ background: variantSwatches[variant] }} /></button>)}</div></div><ul>{selectedProduct.specs.map((spec) => <li key={spec}><Check size={15} />{spec}</li>)}</ul><button className="checkout-button" type="button" onClick={() => { addToCart(selectedProduct, selectedVariant); setSelectedProduct(null) }}>Add to bag <Plus size={17} /></button><p className="checkout-note"><Truck size={14} /> Free shipping over $100</p></div></section></div>}

      {compareOpen && <div className="overlay modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCompareOpen(false) }}><section className="compare-modal" role="dialog" aria-modal="true" aria-label="Product comparison"><div className="drawer-heading"><div><span className="section-kicker">SIDE BY SIDE</span><h2>Find your fit.</h2></div><button className="close-button" type="button" aria-label="Close comparison" onClick={() => setCompareOpen(false)}><X size={21} /></button></div><div className="comparison-grid"><div className="comparison-labels"><span>PRODUCT</span><span>PRICE</span><span>RATING</span><span>HIGHLIGHTS</span></div>{comparedProducts.map((product) => <div className="comparison-product" key={product.id}><button className="remove-compare" type="button" onClick={() => toggleCompare(product.id)} aria-label={`Remove ${product.name} from comparison`}><X size={15} /></button><img src={imageUrl(product.image, 360)} alt="" /><strong>{product.name}</strong><span>{formatPrice(product.price)}</span><span>★ {product.rating} ({product.reviews})</span><ul>{product.specs.map((spec) => <li key={spec}>{spec}</li>)}</ul><button className="compare-add" type="button" onClick={() => addToCart(product)}>Add to bag <Plus size={15} /></button></div>)}</div></section></div>}

      {notice && <div className="toast" role="status"><span className="toast-check"><Check size={15} /></span>{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={15} /></button></div>}
    </div>
  )
}

export default App
