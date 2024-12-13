import { create } from 'zustand'
import { fetchGetPriceSet } from '@/service'

export type Price = {
    priceAmount: number
    priceCurrency: string
    priceItems: string[]
    priceRemark: string
    priceSetGuid: string
    priceTitle: string
    priceUnit: string
}

type PricingStore = {
    pricingList: Price[],
    fetchPricingList: () => Promise<void> // 返回一个Promise
}

const usePricingStore = create<PricingStore>((set) => ({
    pricingList: [],
    fetchPricingList: async () => {
        const list = await fetchGetPriceSet()
        console.log(list)

        set(() => ({ pricingList: list }))
    }
}))

export default usePricingStore