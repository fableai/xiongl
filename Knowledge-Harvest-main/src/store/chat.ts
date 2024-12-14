import { create } from 'zustand'

type ChatMessage = {
    role: 'user' | 'assistant'
    msg: string
    index: number
}

type ChatState = {
    chatId: string | null
    messages: ChatMessage[]
    setChatId: (id: string | null) => void
    addMessage: (message: ChatMessage) => void
    setMessages: (messages: ChatMessage[]) => void
    reset: () => void
}

/**
 * Chat store for managing chat state
 */
const useChatStore = create<ChatState>((set) => ({
    chatId: null,
    messages: [],
    setChatId: (chatId) => set({ chatId }),
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),
    setMessages: (messages) => set({ messages }),
    reset: () => set({
        chatId: null,
        messages: []
    })
}))

export default useChatStore
