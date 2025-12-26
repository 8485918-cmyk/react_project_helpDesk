import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
} from "@mui/material";
import { useState } from "react";
import { api } from "../api/api";

interface AddPriorityDialogProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

const AddPriorityDialog = ({ open, onClose, onCreated }: AddPriorityDialogProps) => {
    const [name, setName] = useState("");

    const handleCreate = async () => {
        try {
            await api("/priorities", {
                method: "POST",
                body: JSON.stringify({ name })
            });
            setName("");
            onClose();
            onCreated?.();
        } catch (error) {
            console.error("Failed to create priority:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create Priority</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Priority name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleCreate} variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPriorityDialog;
