import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Aqui você integraria com um serviço de email real como:
    // - Resend
    // - SendGrid
    // - Nodemailer

    console.log("Pedido recebido:", orderData)

    // Simular envio de email
    const emailContent = `
      🌹 Novo pedido do Cardápio do Amor! 💕
      
      De: ${orderData.customerName} (${orderData.customerEmail})
      Data: ${new Date(orderData.orderDate).toLocaleString("pt-BR")}
      
      ❤️ Atividades escolhidas:
      ${orderData.items
        .map(
          (item: any) =>
            `• ${item.title} (Quantidade: ${item.quantity})${item.notes ? `\n  💭 Observações: ${item.notes}` : ""}`,
        )
        .join("\n")}
      
      ${orderData.specialRequest ? `💌 Pedido especial: ${orderData.specialRequest}` : ""}
      
      ---
      Enviado com amor através do Cardápio do Amor 💕
    `

    // Aqui você enviaria o email para orderData.partnerEmail
    console.log("Email que seria enviado:", emailContent)

    // Simular delay de processamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Pedido enviado com sucesso!",
    })
  } catch (error) {
    console.error("Erro ao processar pedido:", error)
    return NextResponse.json({ success: false, message: "Erro ao enviar pedido" }, { status: 500 })
  }
}
