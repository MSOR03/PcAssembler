"use client";
import React, { useState } from 'react';
import Image from 'next/image';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const teamMembers = [
    {
      name: "Sebastian Olarte",
      role: "Desarrollador Backend",
      image: "default.png",
      specialty: "Node.js & PostgreSQL",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Cristian",
      role: "Desarrollador Backend",
      image: "default.png",
      specialty: "APIs & Databases",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Diego Rojas",
      role: "Desarrollador Fullstack",
      image: "default.png",
      specialty: "React & Next.js",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Fuentes",
      role: "Desarrollador Backend",
      image: "default.png",
      specialty: "Cloud & DevOps",
      color: "from-orange-500 to-red-500"
    },
  ];

  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      description: "Respuesta en 24 horas",
      contact: "support@techstore.com",
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
    },
    {
      icon: "💬",
      title: "Chat en Vivo",
      description: "Disponible 24/7",
      contact: "Iniciar chat",
      color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
    },
    {
      icon: "📞",
      title: "Teléfono",
      description: "Lun-Vie 9am-6pm",
      contact: "+57 300 123 4567",
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
    },
    {
      icon: "📍",
      title: "Oficina",
      description: "Visítanos",
      contact: "Bogotá, Colombia",
      color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí iría la lógica de envío
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-purple-50/30 to-white dark:from-gray-900 dark:via-purple-900/10 dark:to-black">
      {/* Hero Section Mejorado */}
      <div className="relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-purple-600 rounded-full mr-2 animate-pulse"></span>
              Estamos en línea
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                ¿En qué podemos ayudarte?
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
              Nuestro equipo de expertos está listo para resolver tus dudas sobre componentes de PC
            </p>

            {/* Métodos de Contacto Rápido */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className={`${method.color} border-2 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {method.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {method.description}
                  </p>
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {method.contact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Formulario y FAQ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulario de Contacto */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100 dark:border-gray-700">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Envíanos un mensaje
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Completa el formulario y te responderemos lo antes posible
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  placeholder="juan@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Asunto
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none"
                  required
                >
                  <option value="">Selecciona un tema</option>
                  <option value="soporte">Soporte Técnico</option>
                  <option value="ventas">Consulta de Ventas</option>
                  <option value="garantia">Garantías y Devoluciones</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mensaje
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none resize-none"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Enviar mensaje 🚀
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Preguntas Frecuentes
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Encuentra respuestas rápidas a las consultas más comunes
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "¿Cuál es el tiempo de envío?",
                  a: "Realizamos envíos en 24-48 horas a nivel nacional. En Bogotá, entrega el mismo día para pedidos antes de las 2pm."
                },
                {
                  q: "¿Ofrecen garantía?",
                  a: "Todos nuestros productos tienen garantía del fabricante. Componentes hasta 3 años, periféricos 1 año."
                },
                {
                  q: "¿Puedo devolver un producto?",
                  a: "Sí, tienes 30 días para devoluciones sin preguntas. El producto debe estar en perfecto estado y empaque original."
                },
                {
                  q: "¿Hacen builds personalizados?",
                  a: "¡Por supuesto! Nuestro equipo puede ayudarte a diseñar y ensamblar tu PC ideal. Contáctanos para más detalles."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 cursor-pointer group"
                >
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-3">¿Aún tienes dudas?</h3>
              <p className="mb-6 opacity-90">
                Habla directamente con un experto por WhatsApp
              </p>
              <button className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center gap-2">
                <span>💬</span>
                Chat en WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section Mejorado */}
      <div className="bg-gradient-to-b from-white to-purple-50/50 dark:from-black dark:to-purple-900/10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Conoce a nuestro{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Equipo
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Expertos apasionados por la tecnología, listos para ayudarte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Imagen con overlay gradient */}
                  <div className="relative h-72 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                    <Image
                      src={'/team/default.png'}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Badge flotante */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-purple-600 dark:text-purple-400 shadow-lg">
                      ⭐ Experto
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {member.specialty}
                    </p>

                    {/* Social icons */}
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                        <span className="text-lg">💼</span>
                      </button>
                      <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                        <span className="text-lg">📧</span>
                      </button>
                    </div>
                  </div>

                  {/* Borde animado */}
                  <div className={`absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-3xl transition-all duration-300`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Listo para armar tu PC ideal?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Agenda una asesoría gratuita con nuestros expertos
            </p>
            <button className="bg-white text-purple-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl">
              Agendar ahora →
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}