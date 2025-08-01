import { Box } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";

import { useStore } from "../store/useStore";

import NavPages from "./NavPages";
import ModalEntry from "./ModalEntry";
import NavScales from "./NavScales";

export default function Ui() {
    const theme = useTheme();
    const fadeRef = useRef(null);
    const selectedId = useStore((state) => state.selectedId);
    const landing = useStore((state) => state.landing);

    return (
        <>
            <ModalEntry />
            <NavScales />
            <NavPages />
        </>
    );
}
