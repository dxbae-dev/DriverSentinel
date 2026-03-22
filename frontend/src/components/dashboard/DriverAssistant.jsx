import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Mic, MicOff, Volume2, VolumeX, Trash2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export function DriverAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('driverAI_chat_history');
    if (saved) {
      return JSON.parse(saved);
    }
    return [{ id: 'init', role: 'model', text: '¡Hola! Soy DriverAI, el asistente de DriverSentinel. ¿Tienes dudas sobre tus métricas o sobre cómo funciona el sistema?', isLoading: false }];
  });

  const [isTtsEnabled, setIsTtsEnabled] = useState(() => {
    const saved = localStorage.getItem('driverAI_tts_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputDomRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const inputRef = useRef('');
  const interimInputRef = useRef('');
  const ttsEnabledRef = useRef(isTtsEnabled);

  useEffect(() => {
    ttsEnabledRef.current = isTtsEnabled;
    localStorage.setItem('driverAI_tts_enabled', JSON.stringify(isTtsEnabled));
    if (!isTtsEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [isTtsEnabled]);

  useEffect(() => {
    const isTyping = messages.some(msg => msg.isLoading);
    if (!isTyping) {
      localStorage.setItem('driverAI_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (inputDomRef.current) {
      inputDomRef.current.scrollLeft = inputDomRef.current.scrollWidth;
    }
  }, [input]);

  useEffect(() => {
    if (!isOpen && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [isOpen]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; 
      recognitionRef.current.interimResults = true; 
      recognitionRef.current.lang = 'es-MX';

      recognitionRef.current.onresult = (event) => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          inputRef.current = inputRef.current ? `${inputRef.current} ${finalTranscript}` : finalTranscript;
        }

        const displayText = `${inputRef.current} ${interimTranscript}`.trim();
        setInput(displayText);
        interimInputRef.current = displayText;

        if (displayText) {
          silenceTimerRef.current = setTimeout(() => {
            if (recognitionRef.current) recognitionRef.current.stop();
            const textToSend = inputRef.current || interimInputRef.current;
            if (textToSend.trim()) {
              sendMessageToGemini(textToSend.trim());
            }
          }, 4000);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      };
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Tu navegador actual no soporta el reconocimiento de voz nativo.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if (ttsEnabledRef.current && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const playTypingEffect = (botMsgId, fullText) => {
    const words = fullText.split(/(?<=\s)/);
    let currentText = '';
    let wordIndex = 0;

    const intervalId = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += words[wordIndex];
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, text: currentText, isLoading: false }
            : msg
        ));
        
        wordIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);
  };

  const sendMessageToGemini = async (userText) => {
    if (!userText.trim()) return;

    setInput('');
    inputRef.current = '';
    interimInputRef.current = '';
    setIsLoading(true);
    
    const botMessageId = Date.now().toString();

    setMessages(prev => [
      ...prev, 
      { id: Date.now().toString() + '-user', role: 'user', text: userText, isLoading: false },
      { id: botMessageId, role: 'model', text: '', isLoading: true }
    ]);

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        systemInstruction: `Eres DriverAI, el asistente virtual de DriverSentinel. 
        REGLA DE FORMATO ESTRICTA: Escribe TODO en formato de texto plano. NO uses viñetas, NO uses listas (- o *), NO uses negritas (**). Usa párrafos cortos y limpios.
        CONTEXTO DEL SISTEMA:
        DriverSentinel es un sistema inteligente de monitoreo biométrico y seguridad vial diseñado para prevenir accidentes de tránsito. Integra telemetría de hardware en el borde (Edge Computing) con una plataforma web progresiva (PWA) para el análisis de datos en tiempo real. 
        Este es un proyecto desarrollado por el equipo NovaTech para la Ingenieria en Desarrollo y Gestión de Software
        CARACTERÍSTICAS:
        1. Monitoreo en el Borde: Utiliza un ESP32 con sensor MAX30102 (para BPM y SpO2) y un giroscopio MPU6050 (para pitch/cabeceo). Detecta somnolencia y anomalías.
        2. PWA: Interfaz instalable en móviles (Dark/Glassmorphism) para acceso rápido sin distracciones.
        3. Perfilado Progresivo: Autenticación JWT segura, registro de tipo de sangre, contactos de emergencia y vehículo.
        Si te preguntan qué es el BPM, explica que son los Latidos Por Minuto y cómo el MAX30102 los lee para detectar si el conductor se está quedando dormido.
        Si te preguntan qué es el Pitch, explica que es el grado de inclinación de la cabeza (cabeceo) medido por el MPU6050.
        Sé amable, conciso y técnico. Respuestas breves (máximo 2 párrafos).`
      });

      const chatHistory = messages
        .filter(msg => !msg.isLoading && msg.text.trim() !== '' && msg.id !== 'init')
        .map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        }));

      const chat = model.startChat({ history: chatHistory });
      const result = await chat.sendMessage(userText);
      const fullTextResponse = result.response.text().replace(/[*_#]/g, '');

      speakText(fullTextResponse);
      playTypingEffect(botMessageId, fullTextResponse);

    } catch (error) {
      console.error("Error detallado de Gemini:", error);
      
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { ...msg, text: 'Ups, perdí la conexión con el servidor central. Intenta de nuevo en un momento.', isLoading: false }
          : msg
      ));
      speakText('Ups, perdí la conexión con el servidor central. Intenta de nuevo en un momento.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isListening) {
      recognitionRef.current?.stop();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    }
    sendMessageToGemini(input || interimInputRef.current);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    inputRef.current = e.target.value;
  };

  const clearHistory = () => {
    if (window.confirm("¿Deseas borrar todo el historial de la conversación?")) {
      const initMessage = [{ id: 'init', role: 'model', text: '¡Hola! Soy DriverAI, el asistente de DriverSentinel. ¿Tienes dudas sobre tus métricas o sobre cómo funciona el sistema?', isLoading: false }];
      setMessages(initMessage);
      localStorage.setItem('driverAI_chat_history', JSON.stringify(initMessage));
    }
  };

  const defaultQuestions = [
    "¿Qué es DriverSentinel?",
    "¿Qué es el BPM?",
    "¿Qué es el Pitch (Cabeceo)?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-ds-primary hover:bg-cyan-400 text-slate-900 p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-110 group animate-in zoom-in"
        >
          <MessageSquare size={28} className="group-hover:animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="bg-[#0B1120]/95 backdrop-blur-xl border border-white/10 w-[350px] sm:w-[400px] h-[500px] rounded-2xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
          
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/5 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-ds-primary/20 p-2 rounded-lg">
                <Bot size={20} className="text-ds-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold uppercase tracking-widest text-sm">DriverAI</h3>
                <p className="text-ds-safe text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-ds-safe animate-pulse"></span> Online
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsTtsEnabled(!isTtsEnabled)} 
                className={`p-1.5 rounded-md transition-colors ${isTtsEnabled ? 'text-ds-primary bg-ds-primary/10' : 'text-ds-muted hover:text-white'}`}
                title={isTtsEnabled ? "Silenciar voz" : "Activar voz"}
              >
                {isTtsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button 
                onClick={clearHistory} 
                className="p-1.5 text-ds-muted hover:text-red-400 transition-colors rounded-md hover:bg-red-400/10"
                title="Borrar historial"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 text-ds-muted hover:text-white transition-colors ml-1"
                title="Cerrar asistente"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => {
              if (msg.role === 'model' && msg.isLoading) {
                return (
                  <div key={msg.id} className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 text-white rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-ds-primary" />
                      <span className="text-xs text-ds-muted animate-pulse">Escuchando a los sensores...</span>
                    </div>
                  </div>
                );
              }

              if (!msg.text && !msg.isLoading) return null;

              return (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-ds-primary text-slate-900 rounded-br-sm font-medium' 
                      : 'bg-white/5 border border-white/10 text-white rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            
            {messages.length === 1 && !isLoading && (
              <div className="flex flex-col gap-2 mt-4 animate-in fade-in duration-500">
                <p className="text-[10px] text-ds-muted uppercase tracking-widest font-bold ml-1">Preguntas sugeridas:</p>
                <div className="flex flex-wrap gap-2">
                  {defaultQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessageToGemini(q)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white px-3 py-2 rounded-lg transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-black/20 rounded-b-2xl">
            <div className="relative flex items-center">
              <input
                ref={inputDomRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder={isListening ? "Te escucho..." : "Pregúntale a DriverAI..."}
                className={`w-full bg-[#0B1120] border text-white text-sm rounded-xl pl-4 pr-20 py-3 outline-none transition-all placeholder:text-white/20 ${
                  isListening ? "border-red-500/50 ring-1 ring-red-500/50" : "border-white/10 focus:border-ds-primary focus:ring-1 focus:ring-ds-primary/50"
                }`}
                disabled={isLoading}
              />
              
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                    isListening 
                      ? "text-red-400 bg-red-500/20 animate-pulse" 
                      : "text-ds-muted hover:text-white hover:bg-white/5"
                  }`}
                  title="Dictar por voz"
                >
                  {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-ds-primary text-slate-900 rounded-lg disabled:opacity-50 hover:bg-cyan-400 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </form>

        </div>
      )}
    </div>
  );
}