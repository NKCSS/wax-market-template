import cn from 'classnames'
import React, { useState } from 'react'
import config from '../../config.json'
import { useUAL } from '../../hooks/ual'
import Bids from '../auctions/Bids'
import ErrorMessage from '../common/util/ErrorMessage'
import Input from '../common/util/input/Input'
import { formatNumber } from '../helpers/Helpers'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import { bidAction } from '../wax/Wax'
import WindowButton from './WindowButton'
import WindowContent from './WindowContent'

function BidWindow(props) {
    const listing = props['listing']
    const ual = useUAL()

    const activeUser = ual['activeUser']
    const callBack = props['callBack']
    const userName = activeUser ? activeUser['accountName'] : null
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const closeCallBack = props['closeCallBack']

    const { price, assets, seller, bids, auction_id } = listing

    const asset = assets[0]

    const numBids = bids ? bids.length : 0

    const { collection, schema, name, data } = asset

    const image = data['img'] ? (data['img'].includes('http') ? data['img'] : config.ipfs + data['img']) : ''
    const video = data['video'] ? (data['video'].includes('http') ? data['video'] : config.ipfs + data['video']) : ''
    const listing_price = price['amount'] / Math.pow(10, price['token_precision'])

    const [sellPrice, setSellPrice] = useState(!bids || bids.length === 0 ? listing_price : listing_price * 1.10000001)

    const validBid = (price) => {
        if (!price) return false
        return price >= (numBids === 0 ? listing_price : listing_price * 1.10000001)
    }

    const bid = async () => {
        closeCallBack()
        if (!validBid(sellPrice)) {
            setError('Invalid Bid')
            return false
        }
        const quantity = parseFloat(sellPrice)
        setIsLoading(true)
        try {
            await bidAction(auction_id, quantity, activeUser)
            callBack({ bidPlaced: true })
        } catch (e) {
            setError(e.message)
            callBack({ bidPlaced: false, error: e.message })
        } finally {
            setIsLoading(false)
        }
    }

    const changePrice = (e) => {
        const val = e.target.value
        if (/^\d*\.?\d*$/.test(val)) setSellPrice(val)
    }

    const cancel = () => {
        callBack({ bidPlaced: false })
        closeCallBack()
    }

    return (
        <div
            className={cn(
                'fixed top-1/2 transform -translate-y-1/2',
                'left-1/2 transform -translate-x-1/2',
                'w-11/12 max-w-popup lg:max-w-popup-lg h-auto',
                'max-h-popup md:max-h-popup-lg',
                'p-3 lg:p-8 m-0 overflow-y-auto',
                'text-sm text-neutral font-light opacity-100',
                'bg-paper rounded-xl shadow-lg z-40',
                'backdrop-filter backdrop-blur-lg',
            )}
        >
            <img
                className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4"
                onClick={cancel}
                src="/close_btn.svg"
                alt="X"
            />
            <div className="text-xl sm:text-2xl md:text-3xl mt-4 lg:mt-0 text-center">{name}</div>
            <WindowContent image={image} video={video} collection={collection['name']} schema={schema['schema_name']} />
            <Bids bids={bids} />
            <div className="text-base sm:text-lg text-center my-0 md:my-4">
                {`Do you want to bid ${formatNumber(sellPrice)} WAX for this Item?`}
            </div>
            {error ? <ErrorMessage error={error} /> : ''}
            <div className={cn('relative m-auto lg:mb-10 py-1', 'flex flex-row items-center justify-evenly flex-wrap')}>
                <div className="flex items-center">Price</div>
                <div className={cn('flex flex-row', 'items-center')}>
                    <Input
                        type="text"
                        className="w-full bg-gray-700"
                        placeholder="Price"
                        onChange={changePrice}
                        value={sellPrice ? sellPrice : ''}
                    />
                </div>
            </div>
            <div className={cn('relative m-auto mt-5 h-20 lg:h-8', 'flex justify-evenly lg:justify-end')}>
                <WindowButton text="Cancel" onClick={cancel} className="text-neutral bg-paper border-neutral" />
                {userName !== seller ? <WindowButton text="Bid" onClick={bid} /> : ''}
            </div>
            {isLoading ? (
                <div className="absolute t-0 w-full h-full backdrop-filter backdrop-blur-md">
                    <LoadingIndicator text="Loading Transaction" />
                </div>
            ) : (
                ''
            )}
        </div>
    )
}

export default BidWindow
