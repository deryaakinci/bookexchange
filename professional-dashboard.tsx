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

            {/* Tab content will be enhanced in next steps */}
            {activeTab === 'pdf' && (
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
            )}

            {activeTab === 'manual' && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <span className="text-5xl">📝</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Manual Menu Builder
                </h2>
                <p className="text-slate-600 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                  Create and customize your menu items with categories, pricing, and images.
                </p>
                <button
                  onClick={() => setMenuType('manual')}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <span className="text-5xl">👤</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6 bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                  Profile Settings
                </h2>
                <p className="text-slate-600 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                  Manage your account information, preferences, and security settings.
                </p>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <span className="text-5xl">👁️</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  Menu Preview & QR Code
                </h2>
                <p className="text-slate-600 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                  Preview your menu and generate professional QR codes for customers.
                </p>
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
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null)
  const [selectedWelcoming, setSelectedWelcoming] = useState<File | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [themeSettings, setThemeSettings] = useState({
    backgroundColor: userData?.company?.Themes?.[0]?.backgroundColor || '#ffffff',
    textColor: userData?.company?.Themes?.[0]?.textColor || '#000000',
    logoAreaColor: userData?.company?.Themes?.[0]?.logoAreaColor || '#f8f9fa',
    style: userData?.company?.Themes?.[0]?.style || 'modern'
  })
  const [pdfDisplayMode, setPdfDisplayMode] = useState('flipbook')

  // All the existing handlers remain the same, just with professional UI
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
    const formData = new FormData()
    formData.append('pdf', selectedFile)

    try {
      const res = await fetch('/api/QR_Panel/user/upload-pdf', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const data = await res.json()
      if (res.ok) {
        alert('PDF uploaded successfully!')
        setSelectedFile(null)
        window.location.reload()
      } else {
        alert(data.error || 'Upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Network error. Please check your connection and try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePDF = async () => {
    if (!confirm('Are you sure you want to delete the PDF menu?')) return
    setDeleting(true)
    try {
      const res = await fetch('/api/QR_Panel/user/delete-pdf', {
        method: 'DELETE',
        credentials: 'include'
      })
      if (res.ok) {
        alert('PDF successfully deleted!')
        window.location.reload()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete PDF. Please try again.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Network error. Please check your connection.')
    } finally {
      setDeleting(false)
    }
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
                  {userData?.company?.pdfMenuFile && (
                    <a 
                      href={`/api/AdminPanel/company/pdf/${userData.company.id}?t=${Date.now()}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-white/80 hover:bg-white text-emerald-700 hover:text-emerald-800 px-4 py-2 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                    >
                      <span>📁</span>
                      <span>View PDF</span>
                    </a>
                  )}
                  
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
            onClick={async () => {
              // Save display mode logic here
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

        <button
          className="group bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 border border-slate-200 hover:border-green-200 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-lg"
        >
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

function ManualMenuSection() {
  return <div>Manual Menu Section - Component will be enhanced in next steps</div>
}

function ThemeSection({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  return <div>Theme Section - Component will be enhanced in next steps</div>
}

function PreviewSection({ userData, theme, qrUrl, onDownloadQR }: any) {
  return <div>Preview Section - Component will be enhanced in next steps</div>
}

function ProfileSection({ userData }: { userData: UserData | null }) {
  return <div>Profile Section - Component will be enhanced in next steps</div>
}