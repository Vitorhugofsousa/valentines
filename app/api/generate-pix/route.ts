import { PIX_CONFIG } from '@/lib/config'
import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET() {
  try {
    // Gera o payload do PIX
    const pixPayload = generatePixPayload()

    // Gera o QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(pixPayload)

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      pixKey: PIX_CONFIG.CHAVE_PIX,
      value: PIX_CONFIG.VALOR,
      receiver: PIX_CONFIG.NOME_RECEBEDOR
    })
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar QR Code' },
      { status: 500 }
    )
  }
}

function generatePixPayload() {
  // Formata o valor para o padrão do PIX (sem ponto)
  const valor = PIX_CONFIG.VALOR.replace('.', '')
  
  // Gera o payload do PIX
  const payload = [
    '00020126', // Payload Format Indicator
    '35', // Merchant Account Information
    '0014BR.GOV.BCB.PIX', // GUI
    '01', // Chave PIX
    `${PIX_CONFIG.CHAVE_PIX.length}${PIX_CONFIG.CHAVE_PIX}`,
    '52040000', // Merchant Category Code
    '5303986', // Transaction Currency (BRL)
    `5802BR`, // Country Code
    '5906', // Merchant Name
    `${PIX_CONFIG.NOME_RECEBEDOR.length}${PIX_CONFIG.NOME_RECEBEDOR}`,
    '6008BRASILIA', // Merchant City
    '6207', // Additional Data Field
    `0503${PIX_CONFIG.IDENTIFICADOR}`, // Reference Label
    '6304' // CRC16
  ].join('')

  // Adiciona o valor ao payload
  const payloadWithValue = payload.replace('5303986', `5303986${valor}`)

  return payloadWithValue
} 