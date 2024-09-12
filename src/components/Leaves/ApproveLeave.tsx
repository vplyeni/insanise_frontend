import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";

import {
  ItemsService,
  LeavePublic,
  LeavesService,
  TasksService,
  UsersService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface ApproveLeaveProps {
  item: LeavePublic;
  isOpen: boolean;
  onClose: () => void;
}

const ApproveLeave = ({ item, isOpen, onClose }: ApproveLeaveProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (id: string) => LeavesService.approveLeave({ id: id }),
    onSuccess: () => {
      showToast("Success", `The leave was approved successfully.`, "success");
      onClose();
    },
    onError: () => {
      showToast(
        "An error occurred.",
        `An error occurred while approving the leave.`,
        "error"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });
    },
  });

  const onSubmit = async () => {
    console.log("Approving leave");

    mutation.mutate(item.id + "");
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent as="form" onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader>Approve Leave</AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You are about to Approve the Leave Request.
            </AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button variant="danger" type="submit" isLoading={isSubmitting}>
                Approve
              </Button>
              <Button
                ref={cancelRef}
                onClick={onClose}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ApproveLeave;
