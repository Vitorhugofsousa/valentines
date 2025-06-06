import { Resend } from 'resend'
import { RESEND_API_KEY } from '@/lib/config'
import { NextResponse } from 'next/server'

const resend = new Resend(RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, menuId, partnerName } = await request.json()

    const data = await resend.emails.send({
      from: 'Cardápio do Amor <noreply@valentine-menu.com>',
      to: email,
      subject: 'Seu Cardápio do Amor está pronto! 💕',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #e11d48; text-align: center;">Cardápio do Amor</h1>
          <p>Olá! Seu cardápio especial para ${partnerName} está pronto! 🎉</p>
          <p>Compartilhe o link abaixo com seu amor para que ele(a) possa escolher as atividades preferidas:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/menu/${menuId}" 
               style="background-color: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Ver Cardápio
            </a>
          </p>
          <p>Quando seu amor fizer as escolhas, você receberá um email com todas as atividades selecionadas! 💝</p>
          <p style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            Com amor,<br>
            Cardápio do Amor 💕
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar email' },
      { status: 500 }
    )
  }
} 