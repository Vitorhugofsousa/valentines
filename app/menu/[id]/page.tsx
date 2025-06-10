"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart } from "lucide-react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Minus, Send, Check, MapPin } from "lucide-react"

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

interface CartItem extends MenuItem {
  quantity: number
  notes?: string
}

export default function MenuPage() {
  const params = useParams()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [partnerName, setPartnerName] = useState("Amor")
  const [yourName, setYourName] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [specialRequest, setSpecialRequest] = useState("")
  const [showCart, setShowCart] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Simular carregamento dos dados do menu baseado no ID
    const savedMenu = localStorage.getItem(`valentine-menu-${params.id}`)
    const savedPartnerName = localStorage.getItem(`partner-name-${params.id}`)

    if (savedMenu) setMenuItems(JSON.parse(savedMenu))
    if (savedPartnerName) setPartnerName(savedPartnerName)
  }, [params.id])

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      setCart(
        cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }

    if (isMobile) {
      setShowCart(true)
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id)
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const updateNotes = (id: string, notes: string) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, notes } : item)))
  }

  const submitOrder = async () => {
    if (!customerName || !customerEmail || cart.length === 0) {
      alert("Por favor, preencha seus dados e adicione pelo menos uma atividade ao carrinho!")
      return
    }

    const orderData = {
      customerName,
      customerEmail,
      partnerEmail: partnerName,
      items: cart,
      specialRequest,
      orderDate: new Date().toISOString(),
    }

    try {
      const response = await fetch("/api/send-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        setShowSuccessModal(true)
        // Limpar carrinho
        setCart([])
        setCustomerName("")
        setCustomerEmail("")
        setSpecialRequest("")
      } else {
        alert("Erro ao enviar pedido. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao enviar pedido. Tente novamente.")
    }
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Agrupar itens por categoria
  const groupedItems = menuItems.reduce(
    (acc, item) => {
      const category = item.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((current) => {
      if (current.includes(itemId)) {
        return current.filter((id) => id !== itemId)
      } else {
        return [...current, itemId]
      }
    })
  }

  const sendChoices = async () => {
    if (!yourName) {
      alert("Por favor, preencha seu nome!")
      return
    }

    if (selectedItems.length === 0) {
      alert("Por favor, selecione pelo menos uma atividade!")
      return
    }

    setEmailLoading(true)
    try {
      const response = await fetch('/api/send-choices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuId: params.id,
          yourName,
          selectedItems: selectedItems.map(id => menuItems.find(item => item.id === id)),
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar escolhas')
      }

      setEmailSent(true)
      alert("Suas escolhas foram enviadas com sucesso! 💕")
    } catch (error) {
      console.error("Erro ao enviar escolhas:", error)
      alert("Ocorreu um erro ao enviar suas escolhas. Tente novamente.")
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 mb-2 flex items-center justify-center gap-2 flex-wrap">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8" />
            Cardápio Especial para {partnerName}
            <Heart className="h-6 w-6 sm:h-8 sm:w-8" />
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Escolha as atividades que mais te interessam para o nosso Dia dos Namorados!
          </p>
        </div>

        {/* Carrinho flutuante - Desktop */}
        {!isMobile && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              onClick={() => setShowCart(!showCart)}
              className="bg-red-500 hover:bg-red-600 rounded-full w-16 h-16 relative shadow-lg"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        )}

        {/* Carrinho fixo - Mobile */}
        {isMobile && totalItems > 0 && (
          <div className="fixed bottom-4 left-4 right-4 z-50">
            <Button
              onClick={() => setShowCart(!showCart)}
              className="w-full bg-red-500 hover:bg-red-600 shadow-lg"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ver Carrinho ({totalItems} {totalItems === 1 ? "item" : "itens"})
            </Button>
          </div>
        )}

        {/* Menu de atividades agrupado por categoria */}
        <div className={`space-y-8 ${totalItems > 0 && isMobile ? "mb-20" : "mb-6 sm:mb-8"}`}>
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
                <Heart className="h-5 w-5" />
                {category}
              </h2>
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card 
                    key={item.id} 
                    className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                      selectedItems.includes(item.id) ? 'ring-2 ring-pink-500' : ''
                    }`}
                    onClick={() => toggleItemSelection(item.id)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center">
                      <Heart className="h-8 w-8 sm:h-12 sm:w-12 text-red-300" />
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        {selectedItems.includes(item.id) && (
                          <Badge variant="default" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Selecionado
                          </Badge>
                        )}
                        {item.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Especial
                          </Badge>
                        )}
                        {item.rating && <div className="text-yellow-500 text-xs font-semibold">{item.rating} ⭐</div>}
                      </div>
                      <h3 className="font-semibold text-sm sm:text-lg mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-3">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-red-600 font-bold text-sm">{item.price}</div>
                      </div>
                      {item.address && (
                        <div className="text-xs text-gray-500 flex items-center mt-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{item.address}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Botão de enviar escolhas */}
        <div className="flex justify-center">
          <Button 
            onClick={() => setShowEmailModal(true)}
            className="bg-pink-500 hover:bg-pink-600"
            size="lg"
            disabled={selectedItems.length === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar Minhas Escolhas
          </Button>
        </div>

        {/* Modal do Carrinho */}
        <Dialog open={showCart} onOpenChange={setShowCart}>
          <DialogContent className="sm:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Suas Escolhas ({totalItems} {totalItems === 1 ? "atividade" : "atividades"})
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma atividade selecionada ainda</p>
              ) : (
                <>
                  {/* Itens do carrinho */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-600">{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`notes-${item.id}`} className="text-xs">
                            Observações especiais:
                          </Label>
                          <Input
                            id={`notes-${item.id}`}
                            placeholder="Ex: Prefiro no final de semana..."
                            value={item.notes || ""}
                            onChange={(e) => updateNotes(item.id, e.target.value)}
                            className="mt-1 text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Formulário de finalização */}
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-semibold">Finalizar Pedido</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="customer-name" className="text-sm">
                          Seu Nome
                        </Label>
                        <Input
                          id="customer-name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Como você gostaria de ser chamado(a)?"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-email" className="text-sm">
                          Seu Email
                        </Label>
                        <Input
                          id="customer-email"
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="seu@email.com"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="special-request" className="text-sm">
                        Pedido Especial (opcional)
                      </Label>
                      <Textarea
                        id="special-request"
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                        placeholder="Alguma observação especial ou sugestão para tornar o dia ainda mais especial?"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={submitOrder}
                      className="w-full bg-red-500 hover:bg-red-600"
                      size="lg"
                      disabled={!customerName || !customerEmail}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Minhas Escolhas 💕
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Sucesso */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                Pedido Enviado com Sucesso! 💕
              </DialogTitle>
              <DialogDescription className="text-center space-y-2">
                <p>Obrigado {customerName}!</p>
                <p>Suas escolhas foram enviadas e seu amor receberá um email com todos os detalhes.</p>
                <p className="text-sm text-gray-500">Prepare-se para momentos inesquecíveis! ✨</p>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center pt-4">
              <Button onClick={() => setShowSuccessModal(false)} className="bg-pink-500 hover:bg-pink-600">
                <Heart className="h-4 w-4 mr-2" />
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Email */}
        <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
          <DialogContent className="sm:max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-pink-600" />
                Enviar Minhas Escolhas
              </DialogTitle>
              <DialogDescription>
                Preencha seu nome para enviar suas escolhas
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm">
                  Seu Nome
                </Label>
                <Input
                  id="name"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  placeholder="Seu nome"
                  className="mt-1"
                />
              </div>

              <Button
                onClick={sendChoices}
                className="w-full bg-pink-500 hover:bg-pink-600"
                disabled={emailLoading || !yourName}
              >
                {emailLoading ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Escolhas
                  </>
                )}
              </Button>

              {emailSent && (
                <p className="text-sm text-green-600 text-center">
                  Suas escolhas foram enviadas com sucesso! 💕
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
