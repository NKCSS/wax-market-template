import qs from 'qs'
import React from 'react'
import { getAuction } from '../../../api/fetch'
import AuctionComponent from '../../../components/auction/AuctionComponent'

/**
 * @type {import('next').NextPage<{ auction?: import('../../../api/fetch').Auction}>}
 */
const AuctionPage = (props) => {
    return <AuctionComponent {...props} />
}

AuctionPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/')

    const auctionId =
        paths[paths.length - 1].indexOf('?') > 0
            ? paths[paths.length - 1].substr(0, paths[paths.length - 1].indexOf('?'))
            : paths[paths.length - 1]

    const auction = await getAuction(auctionId)

    const values = qs.parse(paths[2].replace(`${auctionId}?`, ''))

    values['auction'] = auction && auction.data

    return values
}

export default AuctionPage
