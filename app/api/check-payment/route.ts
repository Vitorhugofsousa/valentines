import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json()
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

    if (!accessToken) {
      throw new Error('Mercado Pago access token não configurado')
    }

    // Verificar status do pagamento
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao verificar pagamento')
    }

    // Verificar se o pagamento foi aprovado
    const isApproved = data.status === 'approved'

    return NextResponse.json({
      success: true,
      isApproved,
      status: data.status,
      paymentId: data.id,
    })
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar pagamento' },
      { status: 500 }
    )
  }
} 