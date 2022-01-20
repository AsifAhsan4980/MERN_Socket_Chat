import React from "react";
import PrimarySearchAppBar from "../components/navbar/navbar";
import HomeMain from "../components/home/homeCompany";

const HomeCmp = () => {
    const Main = () => {
        return (
            <>
                <PrimarySearchAppBar/>
                <HomeMain/>
            </>
        )
    }

    return (
        <>
            <Main/>
        </>
    )
}

export default HomeCmp