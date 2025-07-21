'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

interface UserData {
  id: string
  cId: number
  userName: string
  CreatedAt: string
  UpdatedAt: string
  role?: {
    roleName: string
  }
  company?: {
    id: string
    C_Name?: string
    C_Logo_Image?: any
    C_QR_URL?: string
    pdfMenuFile?: any
    menuType?: string
    Welcoming_Page?: any
    Main_Categories?: Array<{
      id: string
      name: string
      categoryNo: number
      subCategories: Array<{
        id: string
        name: string
        orderNo: number
        price?: number
        menuImage?: any
      }>
    }>
    Themes?: Array<{
      style?: string
      backgroundColor?: string
      textColor?: string
      logoAreaColor?: string
      facebookUrl?: string
      instagramUrl?: string
      xUrl?: string
    }>
  }
}

interface Theme {
  backgroundColor?: string
  textColor?: string
  style?: string
}

export default function UserDashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pdf' | 'manual' | 'theme' | 'preview' | 'profile' | ''>('')
  const [menuType, setMenuType] = useState<'pdf' | 'manual' | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState<Theme>({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    style: 'modern'
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/QR_Portal/user_login')
      return
    }

    try {
      const res = await fetch('/api/QR_Panel/user/profile', {
        credentials: 'include'
      })
      
      if (!res.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const data = await res.json()
      setUserData(data.user)
      
      if (data.user.company?.pdfMenuFile) {
        setMenuType('pdf')
      } else if (data.user.company?.Main_Categories?.length > 0) {
        setMenuType('manual')
      }
      
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/QR_Portal/user_login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/QR_Panel/user/logout', { method: 'POST', credentials: 'include' })
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      router.push('/QR_Portal/user_login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleMenuTypeSelect = (type: 'pdf' | 'manual') => {
    setMenuType(type)
    setActiveTab(type)
  }

  const generateQRUrl = () => {
    if (!userData?.company?.id) return ''
    if (userData.company.C_QR_URL) {
      return userData.company.C_QR_URL
    }
    return `${window.location.origin}/QR_Portal/menu/${userData.company.id}`
  }

  const downloadQR = () => {
    try {
      const qrContainer = document.getElementById('qr-container')
      const svgElement = qrContainer?.querySelector('svg')
      
      if (svgElement) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)
        
        const img = new Image()
        img.onload = () => {
          canvas.width = 400
          canvas.height = 400
          
          ctx!.fillStyle = 'white'
          ctx!.fillRect(0, 0, canvas.width, canvas.height)
          ctx!.drawImage(img, 0, 0, 400, 400)
          
          const downloadUrl = canvas.toDataURL('image/png')
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = `${userData?.company?.C_Name || 'menu'}-qr-code.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          URL.revokeObjectURL(url)
        }
        img.src = url
      } else {
        alert('QR code not found. Please try again.')
      }
    } catch (error) {
      console.error('QR download error:', error)
      alert('Failed to download QR code. Please try again.')
    }
  }

  // STEP 1: PROFESSIONAL LOADING SCREEN ✨
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>
          <p className="mt-6 text-slate-600 font-medium text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* STEP 2: PROFESSIONAL HEADER WITH GLASSMORPHISM ✨ */}
      <header className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Enhanced Company Brand */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">🍽️</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                  {userData?.company?.C_Name || 'Restaurant Dashboard'}
                </h1>
                <p className="text-sm text-slate-500 font-medium">Menu Management System</p>
              </div>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search menu items, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-slate-50/70 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-300 transition-all placeholder-slate-400 text-slate-700"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Notifications with indicator */}
              <button
                onClick={() => router.push('get_started')}
                className="relative p-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-200 group"
                title="Notifications"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM6 10h9a3 3 0 010 6h-9V10z" />
                </svg>
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
              </button>

              {/* Enhanced Profile Button */}
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-2xl transition-all duration-200 group"
                title="Profile Settings"
              >
                <div className="relative">
                  <img
                    src={
                      userData?.company?.C_Logo_Image
                        ? `/api/AdminPanel/company/image/${userData.company.id}/logo`
                        : '/user-icon-on-transparent-background-free-png.webp'
                    }
                    alt="Profile"
                    className="w-11 h-11 object-cover rounded-2xl border-2 border-slate-200 group-hover:border-indigo-300 transition-colors"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-slate-700">{userData?.userName}</p>
                  <p className="text-xs text-slate-500 font-medium">{userData?.role?.roleName || 'User'}</p>
                </div>
                <svg className="w-4 h-4 text-slate-400 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Enhanced Logout Button */}
              <button
                onClick={handleLogout}
                className="p-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200"
                title="Sign Out"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* STEP 3: ENHANCED QUICK MENU ACCESS ✨ */}
        <div className="mb-10">
          <div className="flex justify-center">
            <button 
              onClick={() => setActiveTab('preview')}
              className="group bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:via-indigo-800 hover:to-purple-800 text-white font-semibold py-5 px-16 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 text-xl flex items-center space-x-4 transform hover:scale-105"
            >
              <span className="text-2xl group-hover:animate-bounce">🍽️</span>
              <span>View Live Menu</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* STEP 4: PROFESSIONAL ACTION CARDS WITH 3D EFFECTS ✨ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 max-w-5xl mx-auto">
          
          {/* PDF Upload Card */}
          <div
            onClick={() => {
              setMenuType('pdf')
              setActiveTab('pdf')
            }}
            className="group relative bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-3xl p-10 cursor-pointer transition-all duration-500 shadow-lg hover:shadow-2xl border border-slate-200 hover:border-blue-200 overflow-hidden transform hover:-translate-y-1"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <span className="text-4xl">📄</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">PDF Menu</h3>
              <p className="text-slate-600 leading-relaxed">Upload and manage your PDF menu files with advanced customization options</p>
              
              {/* Status indicator */}
              {userData?.company?.pdfMenuFile && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Manual Upload Card */}
          <div
            onClick={() => {
              setMenuType('manual')
              setActiveTab('manual')
            }}
            className="group relative bg-white hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 rounded-3xl p-10 cursor-pointer transition-all duration-500 shadow-lg hover:shadow-2xl border border-slate-200 hover:border-emerald-200 overflow-hidden transform hover:-translate-y-1"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-green-100/50 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Manual Menu</h3>
              <p className="text-slate-600 leading-relaxed">Create and customize your menu manually with categories, items, and pricing</p>
              
              {/* Status indicator */}
              {userData?.company?.Main_Categories && userData.company.Main_Categories.length > 0 && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
              )}
            </div>
          </div>
        </div>

        {/* STEP 5: ENHANCED CONTENT AREA WITH GLASSMORPHISM ✨ */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
          <div className="p-10">
            
            {/* Tab Content */}
            {activeTab === 'pdf' && (
              <div>
                {!menuType ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                      <span className="text-5xl">📄</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      PDF Menu Management
                    </h2>
                    <p className="text-slate-600 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                      Upload your restaurant's PDF menu and generate professional QR codes for seamless customer access.
                    </p>
                    <button
                      onClick={() => setMenuType('pdf')}
                      className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Get Started
                    </button>
                  </div>
                ) : (
                  <PDFUploadSection userData={userData} />
                )}
              </div>
            )}

            {activeTab === 'manual' && <ManualMenuSection />}
            {activeTab === 'theme' && <ThemeSection theme={theme} setTheme={setTheme} />}
            {activeTab === 'preview' && (
              <PreviewSection 
                userData={userData} 
                theme={theme}
                qrUrl={generateQRUrl()}
                onDownloadQR={downloadQR}
              />
            )}
            {activeTab === 'profile' && <ProfileSection userData={userData} />}
            
            {/* Enhanced Default Welcome Screen */}
            {!activeTab && (
              <div className="text-center py-20">
                <div className="relative mb-10">
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <span className="text-6xl">🍽️</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm">✨</span>
                  </div>
                </div>
                
                <h2 className="text-4xl font-bold text-slate-800 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to Your Dashboard
                </h2>
                <p className="text-slate-600 mb-12 max-w-2xl mx-auto text-xl leading-relaxed">
                  Transform your restaurant's dining experience with our comprehensive digital menu management platform. 
                  Create, customize, and share your menus effortlessly.
                </p>
                
                {/* Feature badges with enhanced styling */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  <div className="group bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-4 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📄</div>
                    <span className="text-blue-800 font-semibold text-sm">PDF Upload</span>
                  </div>
                  <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 px-6 py-4 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</div>
                    <span className="text-emerald-800 font-semibold text-sm">Manual Creation</span>
                  </div>
                  <div className="group bg-gradient-to-br from-purple-50 to-purple-100 px-6 py-4 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📱</div>
                    <span className="text-purple-800 font-semibold text-sm">QR Generation</span>
                  </div>
                  <div className="group bg-gradient-to-br from-orange-50 to-orange-100 px-6 py-4 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎨</div>
                    <span className="text-orange-800 font-semibold text-sm">Customization</span>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  )
}

// STEP 6: PROFESSIONAL PDF UPLOAD SECTION ✨
function PDFUploadSection({ userData }: { userData: UserData | null }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showThemeOptions, setShowThemeOptions] = useState(false)
  const [showImageOptions, setShowImageOptions] = useState(false)
  const [pdfDisplayMode, setPdfDisplayMode] = useState('flipbook')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    } else {
      alert('Please select a valid PDF file')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    // Simulate upload
    setTimeout(() => {
      alert('PDF uploaded successfully!')
      setSelectedFile(null)
      setUploading(false)
    }, 2000)
  }

  const handleDeletePDF = async () => {
    if (!confirm('Are you sure you want to delete the PDF menu?')) return
    setDeleting(true)
    // Simulate delete
    setTimeout(() => {
      alert('PDF successfully deleted!')
      setDeleting(false)
    }, 1000)
  }

  const existingPDF = userData?.company?.pdfMenuFile

  return (
    <div className="space-y-10">
      {/* Professional Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          PDF Menu Management
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
          Upload, customize, and manage your restaurant's PDF menu with advanced features including display modes, themes, and QR code generation.
        </p>
      </div>
      
      {/* Existing PDF Status Card */}
      {existingPDF && (
        <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border border-emerald-200/60 rounded-3xl p-8 shadow-lg">
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-700 text-sm font-medium">Active</span>
            </div>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <span className="text-3xl text-white">📄</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-emerald-800">Current PDF Menu</h3>
                <p className="text-emerald-600 font-medium">Successfully uploaded and ready for customers</p>
                
                <div className="flex items-center space-x-4 mt-4">
                  <a 
                    href="#" 
                    className="inline-flex items-center space-x-2 bg-white/80 hover:bg-white text-emerald-700 hover:text-emerald-800 px-4 py-2 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    <span>📁</span>
                    <span>View PDF</span>
                  </a>
                  
                  <div className="flex items-center space-x-2 text-emerald-600 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleDeletePDF}
              disabled={deleting}
              className="group bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 border border-red-200 hover:border-red-500 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>{deleting ? 'Deleting...' : 'Delete PDF'}</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Professional Upload Zone */}
      <div className="relative group">
        <div className="border-2 border-dashed border-slate-300 group-hover:border-indigo-400 rounded-3xl p-16 text-center transition-all duration-300 bg-gradient-to-br from-slate-50/50 to-white hover:from-indigo-50/50 hover:to-blue-50/50">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
          />
          
          <label htmlFor="pdf-upload" className="cursor-pointer block">
            <div className="relative mb-8">
              <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-indigo-200 group-hover:from-indigo-200 group-hover:to-indigo-300 rounded-full flex items-center justify-center mx-auto shadow-xl transition-all duration-300 group-hover:scale-110">
                <span className="text-5xl">📄</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white text-xl">+</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800">
                {selectedFile ? `Selected: ${selectedFile.name}` : existingPDF ? 'Upload New PDF (Replaces Current)' : 'Upload PDF Menu'}
              </h3>
              <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                {existingPDF 
                  ? 'Choose a new PDF file to replace your current menu' 
                  : 'Drag and drop your PDF file here or click to browse your computer'
                }
              </p>
              
              <div className="flex items-center justify-center space-x-6 text-sm text-slate-400 mt-6">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>PDF Only</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Max 10MB</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure Upload</span>
                </div>
              </div>
            </div>
          </label>
        </div>
        
        {/* Upload Progress/Actions */}
        {selectedFile && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">📄</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{selectedFile.name}</p>
                  <p className="text-slate-500 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedFile(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-8 py-3 rounded-xl font-semibold text-lg disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      <span>{existingPDF ? 'Update PDF' : 'Upload PDF'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Display Mode Selection */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-8 shadow-lg">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">PDF Display Mode</h3>
          <p className="text-slate-600">Choose how customers will view your PDF menu</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Flipbook Mode */}
          <div 
            onClick={() => setPdfDisplayMode('flipbook')}
            className={`group relative cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2 ${
              pdfDisplayMode === 'flipbook' 
                ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all ${
                pdfDisplayMode === 'flipbook' 
                  ? 'bg-indigo-200' 
                  : 'bg-orange-100 group-hover:bg-orange-200'
              }`}>
                <span className="text-3xl">📖</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2 text-lg">Flipbook Style</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Interactive page-turning experience like a real book. Perfect for multi-page menus with a premium feel.
              </p>
              
              {pdfDisplayMode === 'flipbook' && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-indigo-600 font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Selected</span>
                </div>
              )}
            </div>
          </div>

          {/* Scroll Mode */}
          <div 
            onClick={() => setPdfDisplayMode('scroll')}
            className={`group relative cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2 ${
              pdfDisplayMode === 'scroll' 
                ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all ${
                pdfDisplayMode === 'scroll' 
                  ? 'bg-indigo-200' 
                  : 'bg-slate-100 group-hover:bg-slate-200'
              }`}>
                <span className="text-3xl">📜</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2 text-lg">Scroll Style</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Traditional continuous scrolling view. Familiar and accessible for all customers with smooth navigation.
              </p>
              
              {pdfDisplayMode === 'scroll' && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-indigo-600 font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Selected</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Display Mode */}
        <div className="text-center mt-8">
          <button
            onClick={() => {
              localStorage.setItem('pdfDisplayMode', pdfDisplayMode)
              alert(`PDF display mode saved as: ${pdfDisplayMode}`)
            }}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-8 py-3 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <span>💾</span>
            <span>Save Display Mode</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setShowThemeOptions(!showThemeOptions)}
          className="group bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 border border-slate-200 hover:border-purple-200 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
              <span className="text-2xl">🎨</span>
            </div>
            <h4 className="font-semibold text-slate-800 mb-1">Customize Theme</h4>
            <p className="text-slate-600 text-sm">Colors & styling</p>
          </div>
        </button>

        <button
          onClick={() => setShowImageOptions(!showImageOptions)}
          className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 border border-slate-200 hover:border-blue-200 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
              <span className="text-2xl">🖼️</span>
            </div>
            <h4 className="font-semibold text-slate-800 mb-1">Upload Images</h4>
            <p className="text-slate-600 text-sm">Logo & welcome</p>
          </div>
        </button>

        <button className="group bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 border border-slate-200 hover:border-green-200 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-lg">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
              <span className="text-2xl">📊</span>
            </div>
            <h4 className="font-semibold text-slate-800 mb-1">Analytics</h4>
            <p className="text-slate-600 text-sm">View stats</p>
          </div>
        </button>
      </div>
    </div>
  )
}

// STEP 7: PROFESSIONAL MANUAL MENU BUILDER ✨
function ManualMenuSection() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    backgroundImage: null as File | null
  })

  const [itemForm, setItemForm] = useState({
    name: '',
    price: '',
    menuImage: null as File | null
  })

  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) {
      alert('Please enter a category name')
      return
    }
    
    const newCategory = {
      id: Date.now().toString(),
      name: categoryForm.name,
      subCategories: []
    }
    
    setCategories([...categories, newCategory])
    setCategoryForm({ name: '', backgroundImage: null })
    setShowCategoryForm(false)
    alert('Category added successfully!')
  }

  const handleAddItem = (categoryId: string) => {
    if (!itemForm.name.trim()) {
      alert('Please enter an item name')
      return
    }
    
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        const newItem = {
          id: Date.now().toString(),
          name: itemForm.name,
          price: parseFloat(itemForm.price) || 0,
          menuImage: itemForm.menuImage
        }
        return {
          ...category,
          subCategories: [...category.subCategories, newItem]
        }
      }
      return category
    })
    
    setCategories(updatedCategories)
    setItemForm({ name: '', price: '', menuImage: null })
    setShowItemForm(null)
    alert('Item added successfully!')
  }

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    if (confirm(`Are you sure you want to delete "${categoryName}" category?`)) {
      setCategories(categories.filter(cat => cat.id !== categoryId))
      alert('Category deleted successfully!')
    }
  }

  const handleDeleteItem = (categoryId: string, itemId: string, itemName: string) => {
    if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            subCategories: category.subCategories.filter((item: any) => item.id !== itemId)
          }
        }
        return category
      })
      setCategories(updatedCategories)
      alert('Item deleted successfully!')
    }
  }

  return (
    <div className="space-y-10">
      {/* Professional Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
          Manual Menu Builder
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
          Create and customize your menu items with categories, pricing, and images. Build a professional digital menu that reflects your restaurant's brand.
        </p>
      </div>

      {/* Action Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">📝</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Menu Categories</h3>
            <p className="text-slate-600 text-sm">{categories.length} categories created</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCategoryForm(true)}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105"
        >
          <span>+</span>
          <span>Add Category</span>
        </button>
      </div>

      {/* Add Category Form */}
      {showCategoryForm && (
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-emerald-800">Add New Category</h3>
            <button
              onClick={() => setShowCategoryForm(false)}
              className="text-emerald-600 hover:text-emerald-800 p-2 hover:bg-emerald-100 rounded-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-emerald-800 mb-3">Category Name</label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                className="w-full px-4 py-3 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-300 transition-all bg-white/80"
                placeholder="e.g., Appetizers, Main Courses, Desserts"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-emerald-800 mb-3">Background Image (Optional)</label>
              <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center hover:border-emerald-400 transition-all bg-white/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCategoryForm({...categoryForm, backgroundImage: e.target.files?.[0] || null})}
                  className="hidden"
                  id="category-image"
                />
                <label htmlFor="category-image" className="cursor-pointer block">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <p className="text-emerald-700 font-medium">Click to upload image</p>
                  <p className="text-emerald-600 text-sm mt-1">PNG, JPG up to 5MB</p>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>💾</span>
              <span>Save Category</span>
            </button>
            <button
              onClick={() => setShowCategoryForm(false)}
              className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-3xl border border-slate-200">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🍽️</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">No Categories Yet</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">Start building your menu by adding your first category</p>
          <button
            onClick={() => setShowCategoryForm(true)}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Create First Category
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-lg">
              {/* Category Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">📂</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{category.name}</h3>
                    <p className="text-slate-600">{category.subCategories?.length || 0} items</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowItemForm(showItemForm === category.id ? null : category.id)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>Add Item</span>
                  </button>
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Add Item Form */}
              {showItemForm === category.id && (
                <div className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-blue-800 mb-4">Add New Item to {category.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">Item Name</label>
                      <input
                        type="text"
                        value={itemForm.name}
                        onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                        className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white/80"
                        placeholder="e.g., Grilled Chicken Salad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">Price (₺)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={itemForm.price}
                        onChange={(e) => setItemForm({...itemForm, price: e.target.value})}
                        className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white/80"
                        placeholder="19.99"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Item Image (Optional)</label>
                    <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 text-center bg-white/50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setItemForm({...itemForm, menuImage: e.target.files?.[0] || null})}
                        className="hidden"
                        id={`item-image-${category.id}`}
                      />
                      <label htmlFor={`item-image-${category.id}`} className="cursor-pointer block">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl">📷</span>
                        </div>
                        <p className="text-blue-700 font-medium text-sm">Upload item photo</p>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => handleAddItem(category.id)}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      Save Item
                    </button>
                    <button
                      onClick={() => setShowItemForm(null)}
                      className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-xl font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-4">
                {category.subCategories?.map((item: any) => (
                  <div key={item.id} className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                          <span className="text-xl">🍴</span>
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800">{item.name}</h5>
                          {item.price > 0 && (
                            <p className="text-green-600 font-bold">₺{item.price.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {item.menuImage && (
                          <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                              <span className="text-slate-500 text-xs">IMG</span>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-lg transition-all"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteItem(category.id, item.id, item.name)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-slate-500">
                    <p>No items yet. Click "Add Item" to add your first menu item.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {categories.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Menu Statistics</h3>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div>
                <p className="text-3xl font-bold">{categories.length}</p>
                <p className="text-emerald-100">Categories</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {categories.reduce((total, cat) => total + (cat.subCategories?.length || 0), 0)}
                </p>
                <p className="text-emerald-100">Items</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  ₺{categories.reduce((total, cat) => 
                    total + (cat.subCategories?.reduce((subTotal: number, item: any) => 
                      subTotal + (item.price || 0), 0) || 0), 0
                  ).toFixed(0)}
                </p>
                <p className="text-emerald-100">Avg. Total</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// STEP 8: PROFESSIONAL PROFILE SECTION ✨
function ProfileSection({ userData }: { userData: UserData | null }) {
  const [formData, setFormData] = useState({
    userName: userData?.userName || '',
    companyName: userData?.company?.C_Name || '',
    facebookUrl: userData?.company?.Themes?.[0]?.facebookUrl || '',
    instagramUrl: userData?.company?.Themes?.[0]?.instagramUrl || '',
    xUrl: userData?.company?.Themes?.[0]?.xUrl || ''
  })
  const [saving, setSaving] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loadingPassword, setLoadingPassword] = useState(false)

  useEffect(() => {
    if (userData) {
      setFormData({
        userName: userData.userName || '',
        companyName: userData.company?.C_Name || '',
        facebookUrl: userData.company?.Themes?.[0]?.facebookUrl || '',
        instagramUrl: userData.company?.Themes?.[0]?.instagramUrl || '',
        xUrl: userData.company?.Themes?.[0]?.xUrl || ''
      })
    }
  }, [userData])

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      alert('Profile updated successfully!')
      setSaving(false)
    }, 1500)
  }

  const handlePasswordReset = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters!')
      return
    }
    
    setLoadingPassword(true)
    // Simulate password update
    setTimeout(() => {
      alert('Password updated successfully!')
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
      setLoadingPassword(false)
    }, 2000)
  }

  return (
    <div className="space-y-10">
      {/* Professional Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
          Profile Settings
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
          Manage your account information, preferences, and security settings. Keep your restaurant's digital presence up to date.
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={
                userData?.company?.C_Logo_Image
                  ? `/api/AdminPanel/company/image/${userData.company.id}/logo`
                  : '/user-icon-on-transparent-background-free-png.webp'
              }
              alt="Profile"
              className="w-24 h-24 object-cover rounded-3xl border-4 border-white shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-800">{userData?.userName || 'User'}</h3>
            <p className="text-slate-600 font-medium">{userData?.company?.C_Name || 'Restaurant Name'}</p>
            <p className="text-slate-500 text-sm">{userData?.role?.roleName || 'User'} • ID: {userData?.cId}</p>
            
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2 text-slate-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Joined: {userData?.CreatedAt ? new Date(userData.CreatedAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Updated: {userData?.UpdatedAt ? new Date(userData.UpdatedAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Account Information */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Account Information</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Username</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all bg-white"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Restaurant Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all bg-white"
                placeholder="Enter your restaurant name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">User ID</label>
              <input
                type="text"
                value={userData?.cId || ''}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-100 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-2">*This field cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Social Media</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Facebook URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-sm">📘</span>
                </div>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all bg-white"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Instagram URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-sm">📷</span>
                </div>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all bg-white"
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">X (Twitter) URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-sm">𝕏</span>
                </div>
                <input
                  type="url"
                  value={formData.xUrl}
                  onChange={(e) => setFormData({ ...formData, xUrl: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all bg-white"
                  placeholder="https://x.com/yourpage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Security Settings</h3>
              <p className="text-slate-600 text-sm">Manage your password and account security</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <span>🔑</span>
            <span>{showPasswordForm ? 'Cancel' : 'Change Password'}</span>
          </button>
        </div>

        {showPasswordForm && (
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-red-800 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                className="w-full px-4 py-3 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all bg-white"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-red-800 mb-2">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-4 py-3 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all bg-white"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-red-800 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all bg-white"
                placeholder="Confirm new password"
              />
            </div>

            <button
              onClick={handlePasswordReset}
              disabled={loadingPassword}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loadingPassword ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span>🔒</span>
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Account Statistics */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-800 rounded-3xl p-8 text-white shadow-xl">
        <h3 className="text-2xl font-bold mb-6 text-center">Account Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📄</span>
            </div>
            <p className="text-3xl font-bold">{userData?.company?.pdfMenuFile ? '1' : '0'}</p>
            <p className="text-slate-300">PDF Menus</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📂</span>
            </div>
            <p className="text-3xl font-bold">{userData?.company?.Main_Categories?.length || 0}</p>
            <p className="text-slate-300">Categories</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎨</span>
            </div>
            <p className="text-3xl font-bold">{userData?.company?.Themes?.length || 0}</p>
            <p className="text-slate-300">Themes</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📱</span>
            </div>
            <p className="text-3xl font-bold">{userData?.company?.C_QR_URL ? '1' : '0'}</p>
            <p className="text-slate-300">QR Codes</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3 mx-auto"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Save Profile Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// STEP 9: PROFESSIONAL PREVIEW & QR SECTION ✨
function PreviewSection({ userData, theme, qrUrl, onDownloadQR }: any) {
  const [selectedMenuType, setSelectedMenuType] = useState<'pdf' | 'manual' | null>(null)
  const [qrStyle, setQrStyle] = useState('modern')
  const [qrSize, setQrSize] = useState(200)
  const [showQRCustomizer, setShowQRCustomizer] = useState(false)

  useEffect(() => {
    if (userData?.company?.menuType === 'pdf') {
      setSelectedMenuType('pdf')
    } else if (userData?.company?.menuType === 'manual') {
      setSelectedMenuType('manual')
    }
  }, [userData])

  const handleMenuTypeChange = async (menuType: 'pdf' | 'manual') => {
    setSelectedMenuType(menuType)
    alert(`Menu type updated to ${menuType}!`)
  }

  return (
    <div className="space-y-10">
      {/* Professional Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
          Menu Preview & QR Code
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
          Preview your menu and generate professional QR codes for customers. Customize the appearance and download high-quality codes.
        </p>
      </div>

      {/* Menu Type Selector */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Select Active Menu Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* PDF Menu Option */}
          <div 
            onClick={() => handleMenuTypeChange('pdf')}
            className={`group cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2 ${
              selectedMenuType === 'pdf' 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="text-center">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 transition-all ${
                selectedMenuType === 'pdf' 
                  ? 'bg-blue-200' 
                  : 'bg-blue-100 group-hover:bg-blue-200'
              }`}>
                <span className="text-4xl">📄</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2 text-lg">PDF Menu</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Display your uploaded PDF menu with professional formatting and interactive features.
              </p>
              
              {selectedMenuType === 'pdf' && (
                <div className="flex items-center justify-center space-x-2 text-blue-600 font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Currently Active</span>
                </div>
              )}
              
              {!userData?.company?.pdfMenuFile && (
                <div className="mt-3 text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">
                  No PDF uploaded yet
                </div>
              )}
            </div>
          </div>

          {/* Manual Menu Option */}
          <div 
            onClick={() => handleMenuTypeChange('manual')}
            className={`group cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2 ${
              selectedMenuType === 'manual' 
                ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md'
            }`}
          >
            <div className="text-center">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 transition-all ${
                selectedMenuType === 'manual' 
                  ? 'bg-emerald-200' 
                  : 'bg-emerald-100 group-hover:bg-emerald-200'
              }`}>
                <span className="text-4xl">📝</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2 text-lg">Manual Menu</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Show your manually created menu with categories, items, and custom styling.
              </p>
              
              {selectedMenuType === 'manual' && (
                <div className="flex items-center justify-center space-x-2 text-emerald-600 font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Currently Active</span>
                </div>
              )}
              
              {(!userData?.company?.Main_Categories || userData.company.Main_Categories.length === 0) && (
                <div className="mt-3 text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">
                  No categories created yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview and QR Code Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Menu Preview */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-800">Live Preview</h3>
            <div className="flex items-center space-x-2 text-slate-600 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          
          <div 
            className="border-2 border-slate-200 rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center"
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">🍽️</span>
            </div>
            <h1 className="text-2xl font-bold mb-3">
              {userData?.company?.C_Name || 'Your Restaurant'}
            </h1>
            <p className="text-base mb-6 opacity-80">
              {selectedMenuType === 'pdf' ? 'PDF Menu Preview' : 'Manual Menu Preview'}
            </p>
            
            {userData?.company?.id && (
              <a
                href={`/QR_Portal/menu/${userData.company.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>🔗</span>
                <span>Open Full Preview</span>
              </a>
            )}
          </div>
        </div>

        {/* QR Code Generator */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-800">QR Code Generator</h3>
            <button
              onClick={() => setShowQRCustomizer(!showQRCustomizer)}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center space-x-1"
            >
              <span>⚙️</span>
              <span>Customize</span>
            </button>
          </div>

          {/* QR Customizer */}
          {showQRCustomizer && (
            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-4">
              <div>
                <label className="block text-sm font-semibold text-indigo-800 mb-2">QR Style</label>
                <select
                  value={qrStyle}
                  onChange={(e) => setQrStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="rounded">Rounded</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-indigo-800 mb-2">Size: {qrSize}px</label>
                <input
                  type="range"
                  min="150"
                  max="300"
                  value={qrSize}
                  onChange={(e) => setQrSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
          
          <div className="text-center">
            {qrUrl ? (
              <>
                <div className="inline-block p-6 bg-white rounded-2xl shadow-lg border-2 border-slate-100 mb-6" id="qr-container">
                  <QRCodeSVG 
                    value={qrUrl} 
                    size={qrSize}
                    style={{
                      borderRadius: qrStyle === 'rounded' ? '8px' : '0px'
                    }}
                  />
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={onDownloadQR}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span>📥</span>
                    <span>Download QR Code</span>
                  </button>
                  
                  <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                    <p className="font-medium mb-1">QR Code URL:</p>
                    <code className="break-all">{qrUrl}</code>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <p className="text-slate-600">No QR URL available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Information */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">QR Code Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-bold mb-2">Contactless Dining</h4>
              <p className="text-indigo-100 text-sm">Customers can view your menu safely without physical contact</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-bold mb-2">Instant Updates</h4>
              <p className="text-indigo-100 text-sm">Update your menu and prices in real-time without reprinting</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-bold mb-2">Cost Effective</h4>
              <p className="text-indigo-100 text-sm">Save money on printing and reduce paper waste</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// STEP 10: PROFESSIONAL THEME CUSTOMIZATION ✨
function ThemeSection({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  const [customTheme, setCustomTheme] = useState({
    backgroundColor: theme.backgroundColor || '#ffffff',
    textColor: theme.textColor || '#000000',
    accentColor: '#3b82f6',
    headerFont: 'Inter',
    bodyFont: 'Inter',
    style: theme.style || 'modern'
  })
  const [previewMode, setPreviewMode] = useState('light')
  const [saving, setSaving] = useState(false)

  const presetThemes = [
    {
      name: 'Classic White',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      accentColor: '#3b82f6',
      style: 'modern'
    },
    {
      name: 'Dark Mode',
      backgroundColor: '#1f2937',
      textColor: '#ffffff',
      accentColor: '#60a5fa',
      style: 'modern'
    },
    {
      name: 'Warm Beige',
      backgroundColor: '#fef7ed',
      textColor: '#92400e',
      accentColor: '#d97706',
      style: 'classic'
    },
    {
      name: 'Ocean Blue',
      backgroundColor: '#eff6ff',
      textColor: '#1e40af',
      accentColor: '#3b82f6',
      style: 'modern'
    },
    {
      name: 'Forest Green',
      backgroundColor: '#f0fdf4',
      textColor: '#166534',
      accentColor: '#22c55e',
      style: 'classic'
    },
    {
      name: 'Royal Purple',
      backgroundColor: '#faf5ff',
      textColor: '#6b21a8',
      accentColor: '#a855f7',
      style: 'elegant'
    }
  ]

  const handlePresetSelect = (preset: any) => {
    setCustomTheme({
      ...customTheme,
      backgroundColor: preset.backgroundColor,
      textColor: preset.textColor,
      accentColor: preset.accentColor,
      style: preset.style
    })
  }

  const handleSaveTheme = async () => {
    setSaving(true)
    setTheme(customTheme)
    // Simulate API call
    setTimeout(() => {
      alert('Theme saved successfully!')
      setSaving(false)
    }, 1500)
  }

  return (
    <div className="space-y-10">
      {/* Professional Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Theme Customization
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
          Personalize your menu's appearance and branding to match your restaurant's style. Create a unique visual experience for your customers.
        </p>
      </div>

      {/* Theme Presets */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Quick Theme Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {presetThemes.map((preset, index) => (
            <div
              key={index}
              onClick={() => handlePresetSelect(preset)}
              className="group cursor-pointer p-4 rounded-2xl border-2 border-slate-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
            >
              <div 
                className="w-full h-16 rounded-xl mb-3 border"
                style={{ 
                  backgroundColor: preset.backgroundColor,
                  borderColor: preset.textColor + '20'
                }}
              >
                <div 
                  className="w-full h-4 rounded-t-xl"
                  style={{ backgroundColor: preset.accentColor }}
                ></div>
                <div className="p-2">
                  <div 
                    className="w-full h-1 rounded mb-1"
                    style={{ backgroundColor: preset.textColor + '60' }}
                  ></div>
                  <div 
                    className="w-2/3 h-1 rounded"
                    style={{ backgroundColor: preset.textColor + '40' }}
                  ></div>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-700 text-center">{preset.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Theme Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Color Settings */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Color Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Background Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customTheme.backgroundColor}
                  onChange={(e) => setCustomTheme({...customTheme, backgroundColor: e.target.value})}
                  className="w-16 h-12 rounded-xl border-2 border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={customTheme.backgroundColor}
                  onChange={(e) => setCustomTheme({...customTheme, backgroundColor: e.target.value})}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Text Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customTheme.textColor}
                  onChange={(e) => setCustomTheme({...customTheme, textColor: e.target.value})}
                  className="w-16 h-12 rounded-xl border-2 border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={customTheme.textColor}
                  onChange={(e) => setCustomTheme({...customTheme, textColor: e.target.value})}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Accent Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customTheme.accentColor}
                  onChange={(e) => setCustomTheme({...customTheme, accentColor: e.target.value})}
                  className="w-16 h-12 rounded-xl border-2 border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={customTheme.accentColor}
                  onChange={(e) => setCustomTheme({...customTheme, accentColor: e.target.value})}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="#3b82f6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Style */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Typography & Style</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Header Font</label>
              <select
                value={customTheme.headerFont}
                onChange={(e) => setCustomTheme({...customTheme, headerFont: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="Inter">Inter (Modern)</option>
                <option value="Playfair Display">Playfair Display (Elegant)</option>
                <option value="Roboto">Roboto (Clean)</option>
                <option value="Merriweather">Merriweather (Classic)</option>
                <option value="Poppins">Poppins (Friendly)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Body Font</label>
              <select
                value={customTheme.bodyFont}
                onChange={(e) => setCustomTheme({...customTheme, bodyFont: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="Inter">Inter (Modern)</option>
                <option value="Open Sans">Open Sans (Readable)</option>
                <option value="Roboto">Roboto (Clean)</option>
                <option value="Lato">Lato (Friendly)</option>
                <option value="Source Sans Pro">Source Sans Pro (Professional)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Menu Style</label>
              <select
                value={customTheme.style}
                onChange={(e) => setCustomTheme({...customTheme, style: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="modern">Modern (Clean & Minimal)</option>
                <option value="classic">Classic (Traditional)</option>
                <option value="elegant">Elegant (Sophisticated)</option>
                <option value="casual">Casual (Relaxed)</option>
                <option value="bold">Bold (Eye-catching)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Live Preview</h3>
        
        <div 
          className="border-2 border-slate-200 rounded-2xl p-8 min-h-[300px] transition-all duration-300"
          style={{
            backgroundColor: customTheme.backgroundColor,
            color: customTheme.textColor,
            fontFamily: customTheme.bodyFont
          }}
        >
          <div className="text-center">
            <h1 
              className="text-3xl font-bold mb-4"
              style={{ 
                fontFamily: customTheme.headerFont,
                color: customTheme.accentColor 
              }}
            >
              Restaurant Name
            </h1>
            <div 
              className="w-20 h-1 mx-auto mb-6 rounded"
              style={{ backgroundColor: customTheme.accentColor }}
            ></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-left">
                <h3 
                  className="text-lg font-bold mb-3"
                  style={{ color: customTheme.accentColor }}
                >
                  Appetizers
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Caesar Salad</span>
                    <span className="font-bold">$12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bruschetta</span>
                    <span className="font-bold">$8</span>
                  </div>
                </div>
              </div>
              
              <div className="text-left">
                <h3 
                  className="text-lg font-bold mb-3"
                  style={{ color: customTheme.accentColor }}
                >
                  Main Courses
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Grilled Salmon</span>
                    <span className="font-bold">$24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beef Steak</span>
                    <span className="font-bold">$28</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Theme */}
      <div className="text-center">
        <button
          onClick={handleSaveTheme}
          disabled={saving}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-12 py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3 mx-auto"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              <span>Saving Theme...</span>
            </>
          ) : (
            <>
              <span>🎨</span>
              <span>Save Custom Theme</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}