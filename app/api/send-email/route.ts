import { Resend } from 'resend'
import { RESEND_API_KEY } from '@/lib/config'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const resend = new Resend(RESEND_API_KEY)
const TEST_EMAIL = 'kenji.devsec@gmail.com' // Email associado à conta do Resend

export async function POST(request: Request) {
  try {
    // Verifica se a chave da API está configurada
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY não está configurada')
      return NextResponse.json(
        { error: 'Configuração de email não está disponível' },
        { status: 500 }
      )
    }

    const { email, menuId, partnerName } = await request.json()
    console.log('Dados recebidos:', { email, menuId, partnerName })

    // Salva o email do criador em um cookie
    const cookieStore = await cookies()
    cookieStore.set(`creator-email-${menuId}`, email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    })

    try {
      const data = await resend.emails.send({
        from: 'onboarding@resend.dev', // Usando o domínio de teste do Resend
        to: TEST_EMAIL, // Enviando para o email de teste
        subject: 'Seu Cardápio do Amor está pronto! 💕',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #e11d48; text-align: center;">Cardápio do Amor</h1>
            <p>Olá! Seu cardápio personalizado para ${partnerName} está pronto! 🎉</p>
            <p>Email do destinatário original: ${email}</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/menu/${menuId}" 
                 style="background-color: #e11d48; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Meu Cardápio 💝
              </a>
            </div>

            <p style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
              Com amor,<br>
              Cardápio do Amor 💕
            </p>
          </div>
        `,
      })

      console.log('Email enviado com sucesso:', data)
      return NextResponse.json({ success: true, data })
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError)
      return NextResponse.json(
        { error: 'Erro ao enviar email', details: emailError },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erro geral:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error },
      { status: 500 }
    )
  }
} 