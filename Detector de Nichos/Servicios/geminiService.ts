import { GoogleGenAI, Type } from "@google/genai";
import type { Problem, ProductIdea } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const problemsSchema = {
  type: Type.ARRAY,
  description: "Una lista de los 10 principales puntos de dolor o problemas.",
  items: {
    type: Type.OBJECT,
    properties: {
      problem: {
        type: Type.STRING,
        description: "Un resumen del problema o punto de dolor identificado."
      },
      quote: {
        type: Type.STRING,
        description: "Una cita directa y textual de un usuario que ilustra el problema."
      }
    },
    required: ["problem", "quote"]
  }
};

const ideasSchema = {
    type: Type.ARRAY,
    description: "Una lista de 3 a 5 ideas de productos digitales para resolver los problemas identificados.",
    items: {
        type: Type.OBJECT,
        properties: {
        name: {
            type: Type.STRING,
            description: "Un nombre atractivo para la idea de producto digital."
        },
        description: {
            type: Type.STRING,
            description: "Una breve descripción de la idea del producto y cómo resuelve el problema específico."
        }
        },
        required: ["name", "description"]
    }
};

const anglesSchema = {
    type: Type.ARRAY,
    description: "Una lista de 5 ángulos de venta o marketing para el producto.",
    items: {
        type: Type.STRING,
        description: "Una frase o párrafo corto que representa un ángulo de venta."
    }
};

async function callGeminiAPI<T>(prompt: string, schema: object): Promise<T> {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.6,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as T;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("No se pudo obtener una respuesta válida de la IA.");
    }
}


export async function analyzeNiche(niche: string): Promise<Problem[]> {
  const prompt = `
    Actúa como un experto investigador de mercados.
    Tu tarea es analizar el nicho de mercado: "${niche}".
    
    1. Simula un análisis de discusiones en plataformas como Reddit, foros, reseñas en Amazon y Etsy, y comentarios en redes sociales.
    2. Identifica los 10 problemas o "dolores" más significativos y mencionados con frecuencia por los usuarios.
    3. Para cada problema, proporciona una cita directa y textual ("verbatim") que lo ilustre.
    
    Devuelve tu respuesta exclusivamente como un array de objetos JSON que se ajuste al esquema proporcionado. No incluyas texto fuera del JSON.
  `;
  const result = await callGeminiAPI<{problems: Problem[]}> (prompt, { type: Type.OBJECT, properties: { problems: problemsSchema }, required: ["problems"] });
  return result.problems;
}

export async function generateProductIdeas(problem: Problem, niche: string): Promise<ProductIdea[]> {
    const prompt = `
        Actúa como un estratega de productos digitales.
        En el nicho de mercado de "${niche}", los usuarios enfrentan el siguiente problema: "${problem.problem}", ilustrado por esta queja: "${problem.quote}".

        Genera entre 3 y 4 ideas de productos digitales innovadores que solucionen específicamente este problema. Para cada idea, proporciona un nombre y una breve descripción.

        Devuelve tu respuesta exclusivamente como un array de objetos JSON que se ajuste al esquema proporcionado. No incluyas texto fuera del JSON.
    `;
    const result = await callGeminiAPI<{productIdeas: ProductIdea[]}> (prompt, { type: Type.OBJECT, properties: { productIdeas: ideasSchema }, required: ["productIdeas"] });
    return result.productIdeas;
}

export async function generateSellingAngles(idea: ProductIdea, problem: Problem, niche: string): Promise<string[]> {
    const prompt = `
        Actúa como un experto en copywriting y marketing digital.
        El producto es: "${idea.name}".
        Descripción: "${idea.description}".
        Este producto soluciona el problema de: "${problem.problem}" para el nicho de "${niche}".

        Crea 5 ángulos de venta persuasivos y distintos para promocionar este producto. Cada ángulo debe ser una frase o un párrafo corto que resalte un beneficio clave, despierte una emoción o aborde directamente el dolor del cliente.

        Devuelve tu respuesta exclusivamente como un array de strings en formato JSON que se ajuste al esquema proporcionado. No incluyas texto fuera del JSON.
    `;
    const result = await callGeminiAPI<{sellingAngles: string[]}> (prompt, { type: Type.OBJECT, properties: { sellingAngles: anglesSchema }, required: ["sellingAngles"] });
    return result.sellingAngles;
}