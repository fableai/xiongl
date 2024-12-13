import { create } from 'zustand'
import useKnowledgeLibStore from './KnowledgeLib/store'

type WorkbenchStore = {
    selectedMenu: string, // 当前选中的菜单
    setSelectedMenu: (menu: string) => void, // 设置当前选中的菜单

    reset: () => void
}

const useWorkbenchStore = create<WorkbenchStore>((set) => ({
    selectedMenu: 'knowledgeLib',
    setSelectedMenu(menu) {
        set({ selectedMenu: menu })
    },

    reset: () => {
        useKnowledgeLibStore.getState().reset()
    }
}))

export default useWorkbenchStore