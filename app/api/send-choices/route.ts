import { Resend } from 'resend'
import { RESEND_API_KEY } from '@/lib/config'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const resend = new Resend(RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { menuId, yourName, yourEmail, selectedItems } = await request.json()

    // Busca o email do criador do menu dos cookies
    const cookieStore = cookies()
    const creatorEmail = cookieStore.get(`creator-email-${menuId}`)?.value

    if (!creatorEmail) {
      return NextResponse.json(
        { error: 'Email do criador não encontrado' },
        { status: 404 }
      )
    }

    const data = await resend.emails.send({
      from: 'Cardápio do Amor <noreply@valentine-menu.com>',
      to: creatorEmail,
      subject: 'Suas escolhas do Cardápio do Amor! 💕',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #e11d48; text-align: center;">Cardápio do Amor</h1>
          <p>Olá! ${yourName} fez suas escolhas no seu cardápio! 🎉</p>
          
          <div style="background-color: #fff5f7; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #e11d48; margin-bottom: 15px;">Atividades Escolhidas:</h2>
            <ul style="list-style: none; padding: 0;">
              ${selectedItems.map(item => `
                <li style="margin-bottom: 15px; padding: 15px; background-color: white; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <h3 style="color: #e11d48; margin: 0 0 5px 0;">${item.title}</h3>
                  <p style="color: #666; margin: 0;">${item.description}</p>
                  <div style="margin-top: 5px;">
                    <span style="background-color: #f3f4f6; padding: 3px 8px; border-radius: 3px; font-size: 12px;">${item.category}</span>
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>

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