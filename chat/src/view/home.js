import React from "react";
import PrimarySearchAppBar from "../components/navbar/navbar";
import HomeMain from "../components/home/HomeMain";

const Home = () => {
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

export default Home