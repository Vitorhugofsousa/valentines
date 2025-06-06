"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Plus,
  Trash2,
  Share2,
  Edit3,
  Crown,
  Lock,
  Check,
  CreditCard,
  MapPin,
  Search,
  Utensils,
  Ticket,
  Compass,
  Coffee,
  Music,
  Film,
  Palmtree,
  Wine,
  Send,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface MenuItem {
  id: string
  title: string
  description: string
  price: string
  category: string
  image: string
  isDefault?: boolean
  placeId?: string
  address?: string
  rating?: number
}

interface UserPlan {
  type: "free" | "premium"
  expiresAt?: string
}

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  googleType: string
}

const DEFAULT_ITEMS: MenuItem[] = [
  {
    id: "default-1",
    title: "Jantar Romântico em Casa",
    description: "Jantar à luz de velas com sua comida favorita, música suave e muito carinho",
    price: "💕 Priceless",
    category: "Experiência Gastronômica",
    image: "/placeholder.svg?height=200&width=300",
    isDefault: true,
  },
  {
    id: "default-2",
    title: "Sessão Cinema & Pipoca",
    description: "Maratona dos seus filmes favoritos com pipoca, chocolate e muito aconchego",
    price: "💕 Priceless",
    category: "Entretenimento",
    image: "/placeholder.svg?height=200&width=300",
    isDefault: true,
  },
  {
    id: "default-3",
    title: "Piquenique no Parque",
    description: "Tarde ao ar livre com lanche especial, jogos e muito romance",
    price: "💕 Priceless",
    category: "Aventura",
    image: "/placeholder.svg?height=200&width=300",
    isDefault: true,
  },
]

const EXPERIENCE_CATEGORIES: Category[] = [
  { id: "restaurant", name: "Restaurantes", icon: <Utensils className="h-4 w-4" />, googleType: "restaurant" },
  { id: "cafe", name: "Cafés", icon: <Coffee className="h-4 w-4" />, googleType: "cafe" },
  { id: "bar", name: "Bares", icon: <Wine className="h-4 w-4" />, googleType: "bar" },
  { id: "movie_theater", name: "Cinemas", icon: <Film className="h-4 w-4" />, googleType: "movie_theater" },
  {
    id: "amusement_park",
    name: "Parques de Diversão",
    icon: <Ticket className="h-4 w-4" />,
    googleType: "amusement_park",
  },
  {
    id: "tourist_attraction",
    name: "Atrações Turísticas",
    icon: <Compass className="h-4 w-4" />,
    googleType: "tourist_attraction",
  },
  { id: "park", name: "Parques", icon: <Palmtree className="h-4 w-4" />, googleType: "park" },
  { id: "night_club", name: "Vida Noturna", icon: <Music className="h-4 w-4" />, googleType: "night_club" },
  { id: "museum", name: "Museus", icon: <Compass className="h-4 w-4" />, googleType: "museum" },
]

export default function HomePage() {
  const router = useRouter()
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_ITEMS)
  const [userPlan, setUserPlan] = useState<UserPlan>({ type: "free" })
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    title: "",
    description: "",
    price: "💕 Priceless",
    category: "",
    image: "/placeholder.svg?height=200&width=300",
  })

  const [partnerName, setPartnerName] = useState("Amor")
  const [yourEmail, setYourEmail] = useState("")
  const [menuId, setMenuId] = useState("")

  // Payment form
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
  })

  useEffect(() => {
    const savedMenu = localStorage.getItem("valentine-menu")
    const savedPartnerName = localStorage.getItem("partner-name")
    const savedEmail = localStorage.getItem("your-email")
    const savedMenuId = localStorage.getItem("menu-id")
    const savedUserPlan = localStorage.getItem("user-plan")

    if (savedMenu) {
      const parsedMenu = JSON.parse(savedMenu)
      setMenuItems(parsedMenu)
    }
    if (savedPartnerName) setPartnerName(savedPartnerName)
    if (savedEmail) setYourEmail(savedEmail)
    if (savedMenuId) setMenuId(savedMenuId)
    if (savedUserPlan) setUserPlan(JSON.parse(savedUserPlan))
  }, [])

  const saveToStorage = () => {
    const currentMenuId = menuId || Math.random().toString(36).substring(2, 15)
    if (!menuId) {
      setMenuId(currentMenuId)
    }

    // Salva no localStorage
    localStorage.setItem(`valentine-menu-${currentMenuId}`, JSON.stringify(menuItems))
    localStorage.setItem(`partner-name-${currentMenuId}`, partnerName)
    localStorage.setItem("user-plan", JSON.stringify(userPlan))
    localStorage.setItem("menu-id", currentMenuId)

    // Salva o email do criador nos cookies
    if (yourEmail) {
      document.cookie = `creator-email-${currentMenuId}=${yourEmail}; path=/; max-age=31536000` // 1 ano
    }
  }

  const isPremium = userPlan.type === "premium"

  const handlePremiumAction = (action: () => void) => {
    if (isPremium) {
      action()
    } else {
      setShowPaymentModal(true)
    }
  }

  const addMenuItem = () => {
    if (newItem.title && newItem.description && newItem.category) {
      const item: MenuItem = {
        id: Date.now().toString(),
        title: newItem.title,
        description: newItem.description,
        price: newItem.price || "💕 Priceless",
        category: newItem.category,
        image: newItem.image || "/placeholder.svg?height=200&width=300",
        isDefault: false,
      }

      setMenuItems([...menuItems, item])
      setNewItem({
        title: "",
        description: "",
        price: "💕 Priceless",
        category: "",
        image: "/placeholder.svg?height=200&width=300",
      })
    }
  }

  const removeMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id))
  }

  const processPayment = () => {
    setPaymentLoading(true)
    try {
      window.open('https://mpago.li/1Jri1bX', '_blank')
      const confirmPayment = window.confirm(
        `Para finalizar o pagamento:\n\n` +
        `1. Complete o pagamento na janela do Mercado Pago\n` +
        `2. Após o pagamento, clique em OK aqui\n\n` +
        `Valor: R$ 5,99`
      )

      if (confirmPayment) {
        const newUserPlan: UserPlan = {
          type: "premium",
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        }
        setUserPlan(newUserPlan)
        localStorage.setItem("user-plan", JSON.stringify(newUserPlan))
        setShowPaymentModal(false)
        alert("Pagamento confirmado! Agora você pode personalizar seu cardápio! 🎉")
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error)
      alert("Ocorreu um erro ao processar o pagamento. Tente novamente.")
    } finally {
      setPaymentLoading(false)
    }
  }

  const generateShareLink = () => {
    saveToStorage()
    const currentMenuId = menuId || Math.random().toString(36).substring(2, 15)
    if (!menuId) {
      setMenuId(currentMenuId)
      localStorage.setItem("menu-id", currentMenuId)
    }

    const shareUrl = `${window.location.origin}/menu/${currentMenuId}`
    
    // Verifica se o clipboard está disponível
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          alert("Link copiado para a área de transferência!")
        })
        .catch(() => {
          // Fallback para navegadores que não suportam clipboard
          const tempInput = document.createElement('input')
          tempInput.value = shareUrl
          document.body.appendChild(tempInput)
          tempInput.select()
          document.execCommand('copy')
          document.body.removeChild(tempInput)
          alert("Link copiado para a área de transferência!")
        })
    } else {
      // Fallback para navegadores que não suportam clipboard
      const tempInput = document.createElement('input')
      tempInput.value = shareUrl
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand('copy')
      document.body.removeChild(tempInput)
      alert("Link copiado para a área de transferência!")
    }
  }

  const previewMenu = () => {
    saveToStorage()
    const currentMenuId = menuId || Math.random().toString(36).substring(2, 15)
    if (!menuId) {
      setMenuId(currentMenuId)
      localStorage.setItem("menu-id", currentMenuId)
    }
    router.push(`/menu/${currentMenuId}`)
  }

  const sendEmail = async () => {
    if (!yourEmail) {
      alert("Por favor, adicione seu email para receber as escolhas!")
      return
    }

    setEmailLoading(true)
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: yourEmail,
          menuId,
          partnerName,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar email')
      }

      setEmailSent(true)
      alert("Email enviado com sucesso! Você receberá as escolhas do seu amor em breve! 💕")
    } catch (error) {
      console.error("Erro ao enviar email:", error)
      alert("Ocorreu um erro ao enviar o email. Tente novamente.")
    } finally {
      setEmailLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 mb-2 flex items-center justify-center gap-2 flex-wrap">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8" />
            Cardápio do Amor
            <Heart className="h-6 w-6 sm:h-8 sm:w-8" />
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Crie um cardápio especial de atividades para o Dia dos Namorados
          </p>

          {/* Status do plano */}
          <div className="mt-4 flex justify-center">
            <Badge variant={isPremium ? "default" : "secondary"} className="text-xs sm:text-sm">
              {isPremium ? (
                <>
                  <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Plano Premium
                </>
              ) : (
                <>
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Plano Gratuito
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Configurações */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Edit3 className="h-4 w-4 sm:h-5 sm:w-5" />
              Configurações do Cardápio
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="partner-name" className="text-sm">
                  Nome do(a) Namorado(a)
                </Label>
                <Input
                  id="partner-name"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Ex: Maria, João..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="your-email" className="text-sm">
                  Seu Email (para receber as escolhas)
                </Label>
                <Input
                  id="your-email"
                  type="email"
                  value={yourEmail}
                  onChange={(e) => setYourEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade para Premium */}
        {!isPremium && (
          <Card className="mb-6 sm:mb-8 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <Crown className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="text-lg sm:text-xl font-bold text-yellow-800 mb-2">
                  Desbloqueie a Personalização Completa!
                </h3>
                <p className="text-sm sm:text-base text-yellow-700 mb-4">
                  Por apenas <strong>R$ 5,99</strong>, você pode adicionar atividades personalizadas e editar o cardápio
                </p>
                <div className="grid gap-2 sm:gap-3 text-left max-w-md mx-auto mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>3 atividades padrão (sempre gratuitas)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    <span>Adicionar atividades ilimitadas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    <span>Editar e remover atividades</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    <span>Personalização completa</span>
                  </div>
                </div>
                <Button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Upgrade por R$ 5,99
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Adicionar novo item - apenas para premium */}
        <Card className={`mb-6 sm:mb-8 ${!isPremium ? "opacity-50" : ""}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              Adicionar Nova Atividade
              {!isPremium && <Lock className="h-4 w-4 text-gray-400" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="title" className="text-sm">
                  Título da Atividade
                </Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Ex: Massagem Relaxante"
                  disabled={!isPremium}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-sm">
                  Categoria
                </Label>
                <Input
                  id="category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  placeholder="Ex: Relaxamento, Aventura..."
                  disabled={!isPremium}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Descreva a atividade de forma romântica e detalhada..."
                disabled={!isPremium}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="price" className="text-sm">
                Preço (simbólico)
              </Label>
              <Input
                id="price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                placeholder="💕 Priceless"
                disabled={!isPremium}
                className="mt-1"
              />
            </div>
            <Button
              onClick={() => handlePremiumAction(addMenuItem)}
              className="bg-red-500 hover:bg-red-600 w-full sm:w-auto"
              disabled={!isPremium && (!newItem.title || !newItem.description || !newItem.category)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isPremium ? "Adicionar Atividade" : "Upgrade para Adicionar"}
            </Button>
          </CardContent>
        </Card>

        {/* Lista de itens do menu */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
          {menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center">
                <Heart className="h-8 w-8 sm:h-12 sm:w-12 text-red-300" />
              </div>
              <CardContent className="p-3 sm:p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                  {item.isDefault && (
                    <Badge variant="outline" className="text-xs">
                      Padrão
                    </Badge>
                  )}
                  {!item.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePremiumAction(() => removeMenuItem(item.id))}
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                      disabled={!isPremium}
                    >
                      {isPremium ? <Trash2 className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    </Button>
                  )}
                </div>
                <h3 className="font-semibold text-sm sm:text-lg mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-red-600 font-bold text-sm">{item.price}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button onClick={previewMenu} className="bg-pink-500 hover:bg-pink-600" size="lg">
            <Heart className="h-4 w-4 mr-2" />
            Visualizar Cardápio
          </Button>
          <Button onClick={generateShareLink} className="bg-red-500 hover:bg-red-600" size="lg">
            <Share2 className="h-4 w-4 mr-2" />
            Gerar Link para Compartilhar
          </Button>
          <Button onClick={() => setShowEmailModal(true)} className="bg-green-500 hover:bg-green-600" size="lg">
            <Send className="h-4 w-4 mr-2" />
            Enviar por Email
          </Button>
        </div>

        {menuId && (
          <div className="mt-6 p-3 sm:p-4 bg-green-50 rounded-lg text-center">
            <p className="text-green-700 text-sm sm:text-base break-all">
              <strong>Link do seu cardápio:</strong> {window.location.origin}/menu/{menuId}
            </p>
          </div>
        )}

        {/* Modal de Pagamento */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="sm:max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                Upgrade para Premium
              </DialogTitle>
              <DialogDescription>Desbloqueie todas as funcionalidades por apenas R$ 5,99</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">O que você ganha:</h4>
                <ul className="text-xs space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-600" />
                    Adicionar atividades ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-600" />
                    Editar e remover atividades
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-600" />
                    Personalização completa
                  </li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm">Total:</span>
                  <span className="text-lg font-bold text-green-600">R$ 5,99</span>
                </div>

                <Button
                  onClick={processPayment}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    "Processando..."
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pagar com PIX
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">Pagamento via PIX</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Email */}
        <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
          <DialogContent className="sm:max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-green-600" />
                Enviar Cardápio por Email
              </DialogTitle>
              <DialogDescription>
                Envie o cardápio para seu email para receber as escolhas do seu amor
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Como funciona:</h4>
                <ul className="text-xs space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-600" />
                    Compartilhe o link com seu amor
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-600" />
                    Ele(a) escolherá as atividades preferidas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-600" />
                    Você receberá as escolhas por email
                  </li>
                </ul>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">
                  Seu Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={yourEmail}
                  onChange={(e) => setYourEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="mt-1"
                />
              </div>

              <Button
                onClick={sendEmail}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={emailLoading || !yourEmail}
              >
                {emailLoading ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Cardápio
                  </>
                )}
              </Button>

              {emailSent && (
                <p className="text-sm text-green-600 text-center">
                  Email enviado com sucesso! Você receberá as escolhas do seu amor em breve! 💕
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
