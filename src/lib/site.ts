// Configurações da loja. Na fase do painel, estes valores passam a vir do banco.
export const SITE = {
  name: 'HL Parfums',
  tagline: 'Excelência que você sente, confiança que você percebe.',
  whatsapp: '5579999938117',
  whatsappDisplay: '+55 79 99993-8117',
  instagram: '', // ex.: '@hlparfums'
  hours: '', // ex.: 'Seg a sáb, 9h às 19h'
  url: 'https://hl-parfums.vercel.app',
};

export function waLink(message?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function productMessage(name: string, soldOut = false) {
  return soldOut
    ? `Olá, gostaria de ser avisado(a) quando o ${name} chegar.`
    : `Olá, gostaria de mais informações sobre o ${name}.`;
}
