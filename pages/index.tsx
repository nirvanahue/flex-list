import React from "react";

export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0070f3' }}>🎁 Flex List</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: 500, textAlign: 'center' }}>
        Welcome to <strong>Flex List</strong> — your voice-powered gift list assistant!<br />
        Easily create, manage, and get suggestions for your gift lists using AI.
      </p>
      <a
        href="/agent"
        style={{
          padding: '1rem 2rem',
          background: '#0070f3',
          color: 'white',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        🎤 Try the Voice Agent
      </a>
    </main>
  );
} 