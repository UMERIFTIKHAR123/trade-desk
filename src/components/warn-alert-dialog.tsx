'use client'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../src-old/components/ui/alert-dialog"
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  triggerElement?: React.ReactNode;
  confirmBtnTitle?: string;
  onConfirm: () => void;
}

export const WarnAlertDialog = ({ title, description, triggerElement, confirmBtnTitle, onConfirm }: Props) => {
  const [open, setOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const handleConfirmClick = () => {

    startTransition(async () => {
      await onConfirm();
      setOpen(false);
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {triggerElement}
        {/* <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={"destructive"} onClick={handleConfirmClick} disabled={isLoading}>
            {isLoading && (<Loader className="mr-2 h-4 w-4 animate-spin" />)}
            {confirmBtnTitle || "Confirm"}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}