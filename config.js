window.PTD_CONFIG = {
  marca: "Posta Todo Dia",
  // WhatsApp comercial, só números com DDI e DDD (ex.: 5511999998888). Vazio = leads vão por e-mail.
  whatsapp: "",
  email: "marcelohoc@gmail.com",
  // Webhook do roteirista no n8n (usado só pelo painel interno).
  webhookRoteiros: "https://n8n.olimpoit.com.br/webhook/posta-todo-dia/roteiros",
  planos: [
    { id: "teste", nome: "Teste grátis", preco: 0, periodo: "", itens: ["3 vídeos prontos", "1 produto", "Roteiro de gravação de 15 min"], destaque: false },
    { id: "afiliado", nome: "Afiliado", preco: 97, periodo: "/mês", itens: ["30 vídeos por mês", "1 produto novo por semana", "Ganchos, texto na tela, legenda e hashtags", "Entrega em até 48h após a gravação"], destaque: true },
    { id: "lojista", nome: "Lojista", preco: 297, periodo: "/mês", itens: ["90 vídeos por mês", "Até 5 produtos por mês", "Testes de gancho A/B", "Relatório dos vídeos que mais venderam"], destaque: false }
  ],
  metaPixelId: ""
};
