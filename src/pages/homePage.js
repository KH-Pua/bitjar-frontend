import { useState, useEffect, useContext, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../providers/globalProvider.js";

export default function HomePage() {
    const infoToPass = useContext(GlobalContext);
    const navigate = useNavigate();

    return (
        <h1>HomePage</h1>
    )
}