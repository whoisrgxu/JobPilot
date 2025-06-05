// CustomAlert.tsx
import React from "react";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function CustomAlert({ message }: { message: string }) {
    return (
        <div className="text-red-600 bg-red-50 font-bold  rounded md:px-3 pt-2 my-4 text-sm">
            <WarningAmberIcon />{message}
        </div>
    );
}
