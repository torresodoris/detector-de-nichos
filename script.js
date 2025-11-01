// ⚙️ CONFIGURACIÓN INICIAL
const API_KEY = "AIzaSyB902kj5fuK98xPQBXWUrh20uYFdiNfReQ"; // <-- reemplaza aquí con tu clave real
const API_URL = "/api/gemini";

// 🎯 FUNCIÓN PRINCIPAL
async function analizarNicho(nicho) {
  const prompt = `
  Analiza el siguiente nicho: "${nicho}".
  Identifica 3 problemas reales o puntos de dolor comunes dentro de este nicho, 
  basándote en búsquedas y tendencias actuales en la web.
  Explica brevemente por qué cada uno es importante y su posible impacto.
  `;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo obtener una respuesta de la IA.";
}

// 🚀 EVENTO DEL BOTÓN
document.getElementById("analizarBtn").addEventListener("click", async () => {
  const nicho = document.getElementById("nicho").value.trim();
  const resultado = document.getElementById("resultado");
  
  if (!nicho) {
    resultado.innerHTML = "⚠️ Por favor, escribe un nicho.";
    return;
  }

  resultado.innerHTML = "⏳ Analizando nicho...";
  const respuesta = await analizarNicho(nicho);
  resultado.innerHTML = `<h3>Resultados para "${nicho}"</h3><p>${respuesta}</p>`;
});
