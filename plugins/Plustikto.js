// Versión mejorada con manejo de errores y diagnóstico
class TikTokViewBot {
  constructor() {
    console.log('🤖 Bot Mejorado - Simulador de TikTok');
  }

  validateUrl(url) {
    try {
      // Patrón mejorado que acepta más variantes de URLs
      const tiktokPattern = /^(https?:\/\/)?(www\.|vm\.|m\.)?tiktok\.com\/.+\/video\/\d+|tiktok\.com\/@.+/i;
      return tiktokPattern.test(url);
    } catch (e) {
      return false;
    }
  }

  async simulateViews(url, views) {
    try {
      if (!this.validateUrl(url)) {
        throw new Error('Formato de URL inválido. Ejemplo válido: https://www.tiktok.com/@usuario/video/123456');
      }

      const numericViews = Number(views);
      if (isNaN(numericViews) || numericViews <= 0) {
        throw new Error('El número de vistas debe ser un valor numérico mayor a 0');
      }

      console.log(`\n🔍 Analizando comando...`);
      console.log(`📌 URL: ${url}`);
      console.log(`🎯 Vistas: ${numericViews.toLocaleString()}`);

      // Simulación mejorada
      const steps = 5;
      for (let i = 1; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const progress = (i/steps)*100;
        console.log(`🔄 Progreso: ${progress}% | ${Math.round(numericViews*(i/steps))} vistas simuladas`);
      }

      console.log(`\n✅ Simulación completada para:\n${url}\nVistas simuladas: ${numericViews.toLocaleString()}`);

    } catch (error) {
      console.error(`\n❌ Error: ${error.message}`);
      console.log(`💡 Ejemplo de uso correcto:\n.plus https://www.tiktok.com/@user/video/123456 1000`);
    }
  }

  processCommand(rawCommand) {
    try {
      // Limpieza y validación mejorada del comando
      const cleanedCommand = rawCommand.trim().replace(/\s+/g, ' ');
      const args = cleanedCommand.split(' ');
      
      if (args.length < 3 || !args[0].startsWith('.plus')) {
        throw new Error('Formato de comando incorrecto');
      }

      // Extraer URL (puede contener espacios si está entre comillas)
      let url = '';
      let viewCount = 0;
      
      if (cleanedCommand.includes('"')) {
        // Manejo de URLs con espacios entre comillas
        const quoteParts = cleanedCommand.split('"');
        url = quoteParts[1];
        viewCount = quoteParts[2].trim().split(' ')[0];
      } else {
        url = args[1];
        viewCount = args[2];
      }

      this.simulateViews(url, viewCount);
    } catch (error) {
      console.error(`\n⚠️ Error al procesar el comando: ${error.message}`);
      console.log(`🔧 Revise el formato. Ejemplo válido:\n.plus "https://www.tiktok.com/@user/video/123456" 1000`);
    }
  }
}

// 1. Prueba básica automática
const bot = new TikTokViewBot();

// 2. Simulación de diferentes casos (descomenta para probar)
// bot.processCommand('.plus https://www.tiktok.com/@example/video/123456789 5000'); // Caso normal
// bot.processCommand('.plus "https://www.tiktok.com/@user with spaces/video/123456" 1000'); // URL con espacios
// bot.processCommand('.plus invalid_url 500'); // URL inválida
// bot.processCommand('.plus https://www.tiktok.com/@user/video/123456 not_number'); // Vistas no numéricas

// 3. Para integrar con tu bot real:
/*
client.on('message', msg => {
  if (msg.content.trim().startsWith('.plus')) {
    bot.processCommand(msg.content);
  }
});
*/
