import { NextResponse } from 'next/server'
import { PIX_CONFIG } from '@/lib/config'

export async function POST(request: Request) {
  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

    if (!accessToken) {
      throw new Error('Mercado Pago access token não configurado')
    }

    // Criar pagamento PIX
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_amount: parseFloat(PIX_CONFIG.VALOR),
        description: 'Upgrade Premium - Cardápio do Amor',
        payment_method_id: 'pix',
        payer: {
          email: 'cliente@email.com', // Será substituído pelo email do usuário
          first_name: 'Cliente',
          last_name: 'Premium',
        },
        metadata: {
          product_id: PIX_CONFIG.IDENTIFICADOR,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao gerar pagamento PIX')
    }

    // Retornar dados do PIX
    return NextResponse.json({
      success: true,
      qrCode: data.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: data.point_of_interaction.transaction_data.qr_code_base64,
      paymentId: data.id,
      value: PIX_CONFIG.VALOR,
      pixKey: PIX_CONFIG.CHAVE_PIX,
      receiver: PIX_CONFIG.NOME_RECEBEDOR,
    })
  } catch (error) {
    console.error('Erro ao gerar PIX:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar pagamento PIX' },
      { status: 500 }
    )
  }
} 