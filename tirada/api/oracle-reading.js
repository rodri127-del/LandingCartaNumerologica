const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { name, birthdate, email, theme } = req.body;
    
    // Configurar Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Crear prompt según la temática
    const prompts = {
      oraculo: `Haz una tirada del oráculo para ${name} (nacido el ${birthdate}). 
      Selecciona 3 cartas del oráculo, indica qué cartas han salido y proporciona una interpretación detallada 
      sobre su significado y mensaje para la persona. Incluye consejos prácticos.`,

      tarot: `Realiza una tirada de tarot de 3 cartas (pasado, presente, futuro) para ${name} (${birthdate}). 
      Indica qué cartas del tarot han salido, si están en posición normal o invertida, y ofrece una interpretación 
      profunda de cada carta y su relación en la tirada.`,

      cabala: `Realiza una consulta cabalística para ${name} (nacido el ${birthdate}). 
      Basándote en la Cábala, analiza los caminos y sefirot relevantes, proporciona una interpretación 
      espiritual y guía para el camino actual de la persona.`,

      numerologia: `Realiza un análisis numerológico completo para ${name} (${birthdate}). 
      Calcula los números importantes (camino de vida, destino, etc.) y proporciona una interpretación 
      detallada sobre su significado y cómo influyen en la persona.`,

      astrologica: `Realiza una consulta astrológica para ${name} (${birthdate}). 
      Analiza las influencias planetarias actuales, aspectos relevantes y proporciona una interpretación 
      sobre cómo afectan a la vida de la persona, con consejos prácticos.`
    };

    const prompt = prompts[theme] || prompts.oraculo;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reading = response.text();

    res.status(200).json({ 
      success: true, 
      reading: reading 
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};
