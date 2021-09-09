import React from 'react';

import DropDetails from "./DropDetails";

import AssetImage from "../asset/AssetImage";
import Header from "../common/util/Header"
import Page from "../common/layout/Page"
import cn from 'classnames';

import config from "../../config.json";

const DropComponent = (props) => {
    const drop = props.drop;

    const title = `Check out ${drop.name}`;

    let description = drop.description;

    return (
        <Page id="AssetPage">
            <Header
                title={title}
                image={image}
                description={description}
            />
            <div className={cn('container mx-auto pt-10')}>
                <div className="flex flex-col items-center md:justify-center md:flex-row h-auto px-10">
                    <div className="w-full md:w-2/5">
                        <AssetImage
                            asset={asset}
                        />
                    </div>
                    <div className="w-full md:w-3/5 md:px-10">
                        <DropDetails
                            asset={asset}
                        />
                    </div>
                </div>
                <div className="mt-20 mb-20 leading-10 text-center">
                    <div className="relative h-1/2 t-0 m-auto">
                        <a className="text-primary" href={`https://wax.atomichub.io/explorer/asset/${asset.asset_id}`}>
                            View on Atomichub
                        </a>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default DropComponent;
