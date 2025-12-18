import { Link, useLocation } from 'react-router-dom'
import { ConnectButton, useActiveAccount, useDisconnect } from 'thirdweb/react'
import { client, wallet } from '../lib/thirdweb'
import { createWallet } from 'thirdweb/wallets'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useTokenBalance } from '../services/paymentService'
import { getArcadeSession } from '../lib/arcade-session'

interface UserProfile {
  name: string
  avatar: string
  pfp?: string // Profile picture URL
  walletAddress: string
}

export default function NewHeader() {
  const account = useActiveAccount()
  const { disconnect } = useDisconnect()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showPfpModal, setShowPfpModal] = useState(false)
  const [pfpFile, setPfpFile] = useState<File | null>(null)
  const [pfpPreview, setPfpPreview] = useState<string | null>(null)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const { balance: tokenBalance, isLoading: balanceLoading } = useTokenBalance()

  // Load user profile from arcade session or localStorage
  useEffect(() => {
    // Check for arcade session first
    const arcadeSession = getArcadeSession()
    
    if (arcadeSession) {
      // Use arcade session data
      const profile: UserProfile = {
        name: arcadeSession.username,
        avatar: generateRandomAvatar(), // Could use session avatar if available
        walletAddress: arcadeSession.address || account?.address || '',
      }
      setUserProfile(profile)
      setPlayerName(arcadeSession.username)
      // Don't show name modal for arcade users (name comes from hub)
      return
    }
    
    // Fall back to local profile for standalone mode
    if (account) {
      const savedProfile = localStorage.getItem(`profile_${account.address}`)
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile))
        setPlayerName(JSON.parse(savedProfile).name)
      } else {
        // Generate random abstract avatar
        const avatar = generateRandomAvatar()
        const profile: UserProfile = {
          name: '',
          avatar,
          walletAddress: account.address
        }
        setUserProfile(profile)
        // Only show name modal in standalone mode
        const allowStandalone = import.meta.env.VITE_ALLOW_STANDALONE === 'true'
        if (allowStandalone) {
          setShowNameModal(true)
        }
      }
    }
  }, [account])

  // Track scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Click outside to close account menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false)
      }
    }

    if (showAccountMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAccountMenu])

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Generate random abstract avatar
  const generateRandomAvatar = () => {
    const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⚫', '⚪']
    const patterns = ['', '◢', '◣', '◤', '◥', '⬟', '⬢', '⬡']
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    const pattern = patterns[Math.floor(Math.random() * patterns.length)]
    return `${shape}${pattern}`
  }

  // Save user profile
  const saveProfile = () => {
    if (account && playerName.trim()) {
      const profile: UserProfile = {
        name: playerName.trim(),
        avatar: userProfile?.avatar || generateRandomAvatar(),
        pfp: userProfile?.pfp,
        walletAddress: account.address
      }
      setUserProfile(profile)
      localStorage.setItem(`profile_${account.address}`, JSON.stringify(profile))
      setShowNameModal(false)
    }
  }

  // Handle PFP file upload
  const handlePfpUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB')
        return
      }

      setPfpFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPfpPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Save PFP
  const savePfp = () => {
    if (account && pfpFile && pfpPreview) {
      const profile: UserProfile = {
        ...userProfile!,
        pfp: pfpPreview
      }
      setUserProfile(profile)
      localStorage.setItem(`profile_${account.address}`, JSON.stringify(profile))
      setShowPfpModal(false)
      setPfpFile(null)
      setPfpPreview(null)
    }
  }

  // Remove PFP
  const removePfp = () => {
    if (account && userProfile) {
      const profile: UserProfile = {
        ...userProfile,
        pfp: undefined
      }
      setUserProfile(profile)
      localStorage.setItem(`profile_${account.address}`, JSON.stringify(profile))
      setPfpPreview(null)
    }
  }

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect(wallet)
    setUserProfile(null)
    setPlayerName('')
    setShowAccountMenu(false)
  }

  const isHomePage = location.pathname === '/'
  
  // Get arcade session for stats display
  const arcadeSession = getArcadeSession()

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl' 
            : 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/30'
        }`}
      >
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            
            {/* Left: Logo */}
            <Link to="/" className="flex items-center group flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img 
                  src="/assets/cxrh-banner.png" 
                  alt="The Crypto Rabbit Hole" 
                  className="h-6 sm:h-8 w-auto"
                />
              </motion.div>
            </Link>

            {/* Center: Ape In! Title (Clickable) */}
            <Link to="/" className="flex items-center flex-shrink-0 mx-2">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="text-xl sm:text-2xl md:text-3xl font-display font-black bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent cursor-pointer"
              >
                APE IN!
              </motion.div>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
              
              {/* zkVerify Verification Badge */}
              <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-emerald-300">zkVerify</span>
              </div>

              {/* Leaderboard Button */}
              <Link
                to="/leaderboard"
                className="flex items-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-500/50 transition-all group"
              >
                <span className="text-sm sm:text-lg">🏆</span>
                <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white ml-1 sm:ml-2">Leaderboard</span>
              </Link>

              {/* Wallet Connection / Account */}
              {account ? (
                <div className="relative" ref={accountMenuRef}>
                  {/* Account Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center space-x-1 sm:space-x-3 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 hover:border-green-500/50 transition-all"
                  >
                    {/* Avatar */}
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-sm sm:text-lg overflow-hidden">
                      {userProfile?.pfp ? (
                        <img 
                          src={userProfile.pfp} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        userProfile?.avatar || '👤'
                      )}
                    </div>
                    
                    {/* Wallet Info */}
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-xs font-semibold text-white">
                        {userProfile?.name || 'Player'}
                      </span>
                      <span className="text-xs font-mono text-green-400">
                        {formatAddress(account.address)}
                      </span>
                    </div>
                    
                    {/* Connection Status */}
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </motion.button>

                  {/* Account Dropdown */}
                  <AnimatePresence>
                    {showAccountMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden"
                      >
                        {/* Profile Section */}
                        <div className="p-4 border-b border-slate-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-2xl overflow-hidden">
                              {userProfile?.pfp ? (
                                <img 
                                  src={userProfile.pfp} 
                                  alt="Profile" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                userProfile?.avatar || '👤'
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{userProfile?.name || 'Player'}</h3>
                              <p className="text-xs text-slate-400 font-mono">{formatAddress(account.address)}</p>
                            </div>
                          </div>
                          
                          {/* ApeCoin Balance */}
                          <div className="mt-3 p-3 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg border border-orange-500/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">🪙</span>
                                <span className="text-sm font-semibold text-orange-400">ApeCoin</span>
                              </div>
                              <div className="text-right">
                                {balanceLoading ? (
                                  <div className="w-12 h-4 bg-slate-700/50 rounded animate-pulse"></div>
                                ) : (
                                  <span className="text-sm font-bold text-white">
                                    {parseFloat(tokenBalance).toFixed(2)} {import.meta.env.VITE_TOKEN_SYMBOL || 'APE'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Arcade Stats (if session exists) */}
                          {arcadeSession && (
                            <>
                              <div className="mt-2 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">⭐</span>
                                    <span className="text-sm font-semibold text-purple-400">Points</span>
                                  </div>
                                  <span className="text-sm font-bold text-white">
                                    {arcadeSession.points.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">🎫</span>
                                    <span className="text-sm font-semibold text-pink-400">Tickets</span>
                                  </div>
                                  <span className="text-sm font-bold text-white">
                                    {arcadeSession.tickets}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setShowNameModal(true)
                              setShowAccountMenu(false)
                            }}
                            className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center space-x-3"
                          >
                            <span>✏️</span>
                            <span>Edit Name</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setShowPfpModal(true)
                              setShowAccountMenu(false)
                            }}
                            className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center space-x-3"
                          >
                            <span>🖼️</span>
                            <span>{userProfile?.pfp ? 'Change Profile Picture' : 'Upload Profile Picture'}</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              // TODO: Show profile stats
                              setShowAccountMenu(false)
                            }}
                            className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center space-x-3"
                          >
                            <span>📊</span>
                            <span>My Stats</span>
                          </button>
                        </div>

                        {/* Disconnect */}
                        <div className="p-2 border-t border-slate-700/50">
                          <button
                            onClick={handleDisconnect}
                            className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-900/20 transition-colors flex items-center space-x-3"
                          >
                            <span>🚪</span>
                            <span>Disconnect</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <ConnectButton
                  client={client}
                  wallets={[
                    wallet,
                    createWallet('io.metamask'),
                    createWallet('com.coinbase.wallet'),
                    createWallet('me.rainbow'),
                  ]}
                  theme="dark"
                  connectButton={{
                    label: 'Connect Wallet',
                    className: 'custom-connect-button',
                  }}
                  connectModal={{
                    size: 'compact',
                    title: 'Welcome to Ape In!',
                    titleIcon: '🎮',
                    showThirdwebBranding: false,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Name Entry Modal */}
      <AnimatePresence>
        {showNameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowNameModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
                  {userProfile?.avatar || '👤'}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Welcome to Ape In!</h2>
                <p className="text-slate-400">Enter your name to get started</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Player Name
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 focus:border-purple-500/50 focus:outline-none text-white placeholder-slate-400"
                    maxLength={20}
                    autoFocus
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      if (playerName.trim()) {
                        saveProfile()
                      }
                    }}
                    disabled={!playerName.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save & Play
                  </button>
                  
                  <button
                    onClick={() => {
                      const randomName = `Player${Math.floor(Math.random() * 1000)}`
                      setPlayerName(randomName)
                    }}
                    className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg font-semibold text-slate-300 hover:bg-slate-600/50 transition-all"
                  >
                    Random
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PFP Upload Modal */}
      <AnimatePresence>
        {showPfpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPfpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-3xl mx-auto mb-4 overflow-hidden">
                  {pfpPreview ? (
                    <img 
                      src={pfpPreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : userProfile?.pfp ? (
                    <img 
                      src={userProfile.pfp} 
                      alt="Current PFP" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    '🖼️'
                  )}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Profile Picture</h2>
                <p className="text-slate-400">Upload a custom profile picture for your games</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Choose Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePfpUpload}
                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 focus:border-purple-500/50 focus:outline-none text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
                </div>

                {userProfile?.pfp && (
                  <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <p className="text-sm text-slate-300 mb-2">Current Profile Picture:</p>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={userProfile.pfp} 
                        alt="Current PFP" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <button
                        onClick={removePfp}
                        className="px-3 py-1.5 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-600/30 transition-all text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      if (pfpFile && pfpPreview) {
                        savePfp()
                      }
                    }}
                    disabled={!pfpFile || !pfpPreview}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {pfpFile ? 'Save Picture' : 'No Image Selected'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowPfpModal(false)
                      setPfpFile(null)
                      setPfpPreview(null)
                    }}
                    className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg font-semibold text-slate-300 hover:bg-slate-600/50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add top padding to body to account for fixed header */}
      <div className="h-20"></div>
    </>
  )
}
