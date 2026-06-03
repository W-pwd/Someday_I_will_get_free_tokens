import React, { useState, useRef, useCallback, useEffect, memo } from 'react';

const styles = {
    wrapper: {
        width: '100%',
        minWidth: '340px',
        maxWidth: '100%',
        height: '100%',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        backgroundColor: '#020617',
        color: '#f1f5f9',
        borderRadius: '16px',
        border: '1px solid rgba(30, 41, 59, 0.6)',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        boxSizing: 'border-box',
    },
    header: {
        flexShrink: 0,
        padding: '16px 24px',
        borderBottom: '1px solid rgba(30, 41, 59, 0.6)',
        backgroundColor: 'rgba(2, 6, 23, 0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    logoBox: {
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #6366f1, #9333ea)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)',
        flexShrink: 0,
    },
    title: {
        fontSize: '20px',
        fontWeight: 700,
        background: 'linear-gradient(to right, #fff, #94a3b8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0,
        lineHeight: 1.2,
    },
    subtitle: {
        fontSize: '12px',
        color: '#94a3b8',
        fontWeight: 500,
        margin: 0,
    },
    statusWrap: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    statusDotOuter: {
        position: 'relative',
        height: '10px',
        width: '10px',
    },
    statusDotPing: (active) => ({
        position: 'absolute',
        inset: 0,
        borderRadius: '9999px',
        opacity: 0.75,
        backgroundColor: active ? '#40f04e' : '#ff0000',
        animation: active ? 'chatPing 0.5s cubic-bezier(0, 0, 0.2, 0.6) infinite' : 'none',
    }),
    statusDotInner: (active) => ({
        position: 'relative',
        borderRadius: '9999px',
        height: '10px',
        width: '10px',
        backgroundColor: active ? '#10b981' : '#64748b',
    }),
    statusText: {
        fontSize: '12px',
        fontWeight: 500,
        color: '#94a3b8',
    },
    main: {
        height: '100%',
        flex: 1,
        overflowY: 'auto',
        padding: '24px 16px',
        boxSizing: 'border-box',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        gap: '16px',
        opacity: 0.6,
        paddingBottom: '80px',
    },
    emptyIconBox: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: '24px',
        fontWeight: 600,
        color: '#e2e8f0',
        margin: 0,
    },
    emptyDesc: {
        fontSize: '14px',
        color: '#94a3b8',
        maxWidth: '280px',
        margin: 0,
        lineHeight: 1.5,
    },
    footer: {
        flexShrink: 0,
        padding: '16px',
        backgroundColor: 'rgba(2, 6, 23, 0.8)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(30, 41, 59, 0.6)',
        boxSizing: 'border-box',
    },
    inputWrap: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        borderRadius: '16px',
        padding: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s',
        boxSizing: 'border-box',
    },
    textarea: {
        flex: 1,
        backgroundColor: 'transparent',
        color: '#f1f5f9',
        border: 'none',
        outline: 'none',
        resize: 'none',
        fontSize: '14px',
        lineHeight: 1.5,
        padding: '10px 12px',
        minHeight: '44px',
        maxHeight: '128px',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
    },
    sendBtn: (disabled) => ({
        flexShrink: 0,
        padding: '10px',
        borderRadius: '12px',
        backgroundColor: disabled ? '#4f46e5' : '#2AC900',
        color: disabled ? '#ffffff' : '#475569',
        border: 'none',
        cursor: disabled ? 'pointer' : 'not-allowed',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: disabled ? '0 4px 6px rgba(79, 70, 229, 0.25)' : 'none',
    }),
    disclaimer: {
        textAlign: 'center',
        fontSize: '11px',
        color: '#475569',
        marginTop: '12px',
        margin: '12px 0 0 0',
    },
    msgRow: (isUser) => ({
        display: 'flex',
        width: '100%',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        animation: 'chatFadeIn 0.3s ease-out forwards',
    }),
    msgInner: (isUser) => ({
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '12px',
        maxWidth: '85%',
    }),
    msgAvatar: (isUser) => ({
        flexShrink: 0,
        width: '32px',
        height: '32px',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        backgroundColor: isUser ? '#4f46e5' : '#059669',
    }),
    msgBubble: (isUser) => ({
        padding: '12px 16px',
        borderRadius: '16px',
        backgroundColor: isUser ? '#4f46e5' : 'rgba(30, 41, 59, 0.9)',
        color: isUser ? '#ffffff' : '#f1f5f9',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        borderBottomRightRadius: isUser ? '4px' : '16px',
        borderBottomLeftRadius: isUser ? '16px' : '4px',
        border: isUser ? 'none' : '1px solid rgba(51, 65, 85, 0.5)',
        boxSizing: 'border-box',
    }),
    msgText: {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 1.6,
        fontSize: '14px',
        margin: 0,
        userSelect: 'text',
    },
    cursor: {
        display: 'inline-block',
        width: '2px',
        height: '16px',
        marginLeft: '4px',
        backgroundColor: 'currentColor',
        animation: 'chatPulse 1s ease-in-out infinite',
        verticalAlign: 'middle',
        borderRadius: '2px',
    },
};

const Message = memo(({ role, content, isStreaming }) =>
{
    const isUser = role === 'user';
    return (
        <div style={styles.msgRow(isUser)}>
            <div style={styles.msgInner(isUser)}>
                <div style={styles.msgAvatar(isUser)}>
                    {isUser ? (
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#fff' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">
                            <defs>
                                <filter id="shadow">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                                    <feOffset dy="5" result="offsetblur" />
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope=".4" />
                                    </feComponentTransfer>
                                    <feMerge>
                                        <feMergeNode />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <g filter="url(#shadow)">
                                <path d="M54 30C62 32 68 38 72 46 74 52 74 58 72 64 68 72 62 78 54 80 50 78 46 74 42 68 38 62 36 54 38 46 40 38 46 32 54 30Z" fill="#2AC900" />
                                <path d="M54 30C62 32 68 38 72 46 74 52 74 58 72 64 68 72 62 78 54 80L54 30Z" fill="#B8D944" opacity=".4" />
                                <path d="M54 30C46 32 40 38 38 46 36 54 38 62 42 68 46 74 50 78 54 80L54 30Z" fill="#7CB342" opacity=".2" />
                                <line x1="54" y1="30" x2="54" y2="80" stroke="#FB9B3F" strokeWidth={1.5} opacity=".6" />
                                <path d="M54 40Q60 44 64 50" stroke="#FB9B37" opacity=".3" fill="none" />
                                <path d="M54 50Q60 54 64 60" stroke="#FB9B37" opacity=".3" fill="none" /><path d="M54 40Q48 44 44 50" stroke="#FB9B37" opacity=".3" fill="none" />
                                <path d="M54 50Q48 54 44 60" stroke="#FB9B37" opacity=".3" fill="none" />
                            </g>
                            <line x1="54" y1="80" x2="54" y2="86" stroke="#FB9B37" strokeWidth={1.5} filter="url(#shadow)" />
                        </svg>
                    )}
                </div>
                <div style={styles.msgBubble(isUser)}>
                    <div style={styles.msgText}>
                        {content}
                        {isStreaming && <span style={styles.cursor} />}
                    </div>
                </div>
            </div>
        </div>
    );
});

Message.displayName = 'Message';

export default function Chat()
{
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() =>
    {
        if (textareaRef.current)
        {
            textareaRef.current.focus();
        }
    }, []);

    useEffect(() =>
    {
        if (containerRef.current)
        {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() =>
    {
        if (textareaRef.current)
        {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
        }
    }, [input]);

    const handleSend = useCallback(async () =>
    {
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) return;

        const userMessage = { id: `${Date.now()}-user`, role: 'user', content: trimmedInput };
        const aiMessageId = `${Date.now()}-ai`;
        const aiMessage = { id: aiMessageId, role: 'assistant', content: '', isStreaming: true };

        setMessages(prev => [...prev, userMessage, aiMessage]);
        setInput('');
        setIsLoading(true);

        try
        {
            const response = await fetch('https://public-api.devexpress.com/demo-openai/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-02-01', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': 'DEMO',
                    'content-type': 'application/json',
                    'origin': 'https://js.devexpress.com',
                    'x-stainless-lang': 'js',
                    'x-stainless-runtime': 'browser:chrome'
                },
                body: JSON.stringify({
                    messages: [{ role: "system", content: trimmedInput }, { role: "user", content: trimmedInput }],
                    model: "gpt-4o-mini",
                    max_tokens: 16380,
                    temperature: 0.8,
                    stream: true
                })
            });

            if (!response.ok)
            {
                console.log(`HTTP error! status: ${response.status}`);
            }
            if (!response.body)
            {
                console.log('Response body is null');
            }
            console.log('Request sent:', trimmedInput);
            console.log('-------------------------------------------------------------')
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done)
            {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;

                if (value)
                {
                    const text = decoder.decode(value, { stream: true });
                    console.log('Response received:', text);
                    const lines = text.split('\n');

                    for (const line of lines)
                    {
                        if (line.startsWith('data: '))
                        {
                            const payload = line.substring(6);
                            if (payload === '[DONE]') continue;

                            try
                            {
                                const obj = JSON.parse(payload);
                                const content = obj.choices?.[0]?.delta?.content ?? '';

                                if (content)
                                {
                                    setMessages(prev =>
                                    {
                                        const lastMsg = prev[prev.length - 1];
                                        if (lastMsg && lastMsg.id === aiMessageId)
                                        {
                                            const newMessages = [...prev];
                                            newMessages[newMessages.length - 1] = {
                                                ...lastMsg,
                                                content: lastMsg.content + content
                                            };
                                            return newMessages;
                                        }
                                        return prev;
                                    });
                                }
                            } catch (e)
                            {
                                console.log('Error parsing JSON:', e);
                            }
                        }
                    }
                }
            }
        } catch (error)
        {
            console.log('Chat error:', error);
            setMessages(prev =>
            {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.id === aiMessageId)
                {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        ...lastMsg,
                        content: lastMsg.content + '\n\n[Error: Failed to get response. Please try again.]',
                        isStreaming: false
                    };
                    return newMessages;
                }
                return prev;
            });
        } finally
        {
            setMessages(prev =>
            {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.id === aiMessageId)
                {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        ...lastMsg,
                        isStreaming: false
                    };
                    return newMessages;
                }
                return prev;
            });
            setIsLoading(false);
        }
    }, [input, isLoading]);

    const handleKeyDown = useCallback((e) =>
    {
        if (e.key === 'Enter' && !e.shiftKey)
        {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    const handleTextareaInput = useCallback((e) =>
    {
        setInput(e.target.value);
    }, []);

    return (
        <>
            <style>{`
        @import url('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.19/index.css');
        
        @keyframes chatFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes chatPing {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .chat-root {
          all: initial;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          height: 100vh;
          width: 100%;
          min-width: 340px;
          min-height: 560px;
          border-radius: 16px;
          border: 1px solid rgba(30, 41, 59, 0.6);
          overflow: hidden;
          background-color: #020617;
          color: #f1f5f9;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          margin-bottom: 400px;
        }
        
        .chat-root *,
        .chat-root *::before,
        .chat-root *::after {
          box-sizing: border-box;
        }
        
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.3);
          border-radius: 20px;
        }
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(148, 163, 184, 0.5);
        }
        
        .chat-textarea:focus {
          outline: none;
        }

        .chat-textarea {
        user-select: text !important;
        curosr: text !important;
        }
        
        .chat-textarea::placeholder {
          color: #64748b;
        }
        
        .chat-send-btn:hover:not(:disabled) {
          background-color: #4338ca !important;
          transform: scale(0.95);
        }
        
        .chat-send-btn:active:not(:disabled) {
          transform: scale(0.92);
        }
      `}</style>
            <div className="chat-root">
                <header style={styles.header}>
                    <div style={styles.headerLeft}>
                        <div style={styles.logoBox}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">
                                <defs>
                                    <filter id="shadow">
                                        <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                                        <feOffset dy="5" result="offsetblur" />
                                        <feComponentTransfer>
                                            <feFuncA type="linear" slope=".4" />
                                        </feComponentTransfer>
                                        <feMerge>
                                            <feMergeNode />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <g filter="url(#shadow)">
                                    <path d="M54 30C62 32 68 38 72 46 74 52 74 58 72 64 68 72 62 78 54 80 50 78 46 74 42 68 38 62 36 54 38 46 40 38 46 32 54 30Z" fill="#2AC900" />
                                    <path d="M54 30C62 32 68 38 72 46 74 52 74 58 72 64 68 72 62 78 54 80L54 30Z" fill="#B8D944" opacity=".4" />
                                    <path d="M54 30C46 32 40 38 38 46 36 54 38 62 42 68 46 74 50 78 54 80L54 30Z" fill="#7CB342" opacity=".2" />
                                    <line x1="54" y1="30" x2="54" y2="80" stroke="#FB9B3F" opacity=".6" />
                                    <path d="M54 40Q60 44 64 50" stroke="#FB9B37" opacity=".3" fill="none" />
                                    <path d="M54 50Q60 54 64 60" stroke="#FB9B37" opacity=".3" fill="none" /><path d="M54 40Q48 44 44 50" stroke="#FB9B37" opacity=".3" fill="none" />
                                    <path d="M54 50Q48 54 44 60" stroke="#FB9B37" opacity=".3" fill="none" />
                                </g>
                                <line x1="54" y1="80" x2="54" y2="86" stroke="#FB9B37" filter="url(#shadow)" />
                            </svg>
                        </div>
                        <div>
                            <h1 style={styles.title}>AI Assistant</h1>
                            <p style={styles.subtitle}>Powered by AI Hallucinations</p>
                        </div>
                    </div>
                    <div style={styles.statusWrap}>
                        <span style={styles.statusDotOuter}>
                            <span style={styles.statusDotPing(!isLoading)}></span>
                            <span style={styles.statusDotInner(isLoading)}></span>
                        </span>
                        <span style={styles.statusText}>{isLoading ? 'Processing...' : 'Online'}</span>
                    </div>
                </header>

                <main ref={containerRef} className="chat-scroll" style={styles.main}>
                    {messages.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIconBox}>
                                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#94a3b8' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <h2 style={styles.emptyTitle}>How can I help you today?</h2>
                            <p style={styles.emptyDesc}>
                                Start a conversation with the AI assistant.
                            </p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <Message
                                key={msg.id}
                                role={msg.role}
                                content={msg.content}
                                isStreaming={msg.isStreaming || false}
                            />
                        ))
                    )}
                </main>

                <footer style={styles.footer}>
                    <div style={styles.inputWrap}>
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleTextareaInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            rows={1}
                            className="chat-textarea"
                            style={styles.textarea}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="chat-send-btn"
                            style={styles.sendBtn(!input.trim() || isLoading)}
                            aria-label="Send message"
                        >
                            {isLoading ? (
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
                                </svg>
                            ) : (
                                <svg width="20" height="20" fill="golden" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <p style={styles.disclaimer}>
                        AI makes mistakes. Consider checking important information.
                    </p>
                </footer>
            </div>
        </>
    );
}
