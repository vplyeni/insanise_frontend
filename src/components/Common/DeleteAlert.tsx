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
  LeavesService,
  TargetGroupsService,
  TasksService,
  TeamsService,
  UsersService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface DeleteProps {
  type: string;
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const Delete = ({ type, id, isOpen, onClose }: DeleteProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  console.log(type);

  const deleteEntity = async (id: string) => {
    if (type === "Item") {
      await ItemsService.deleteItem({ id: id });
    } else if (type === "User") {
      await UsersService.deleteUser({ userId: id });
    } else if (type === "Task") {
      await TasksService.deleteTask({ id: id });
    } else if (type === "MyLeaves" || type === "Leave") {
      await LeavesService.deleteLeave({ id: id });
    } else if (type === "Team") {
      await TeamsService.deleteTeam({ id: id });
    } else if (type === "TargetGroup") {
      await TargetGroupsService.deleteTargetGroup({ id: id });
    } else {
      throw new Error(`Unexpected type: ${type}`);
    }
  };

  const mutation = useMutation({
    mutationFn: deleteEntity,
    onSuccess: () => {
      showToast(
        "Success",
        `The ${type.toLowerCase()} was deleted successfully.`,
        "success"
      );
      onClose();
    },
    onError: () => {
      showToast(
        "An error occurred.",
        `An error occurred while deleting the ${type.toLowerCase()}.`,
        "error"
      );
    },
    onSettled: () => {
      let item = "";
      if (type === "Item") {
        item = "items";
      } else if (type === "User") {
        item = "users";
      } else if (type === "Task") {
        item = "tasks";
      } else if (type === "MyLeaves") {
        item = "my_leaves";
      } else if (type === "Leave") {
        item = "leaves";
      } else if (type === "TargetGroup") {
        item = "target_groups";
      } else if (type === "Team") {
        item = "teams";
      } else {
        throw new Error(`Unexpected type: ${type}`);
      }
      queryClient.invalidateQueries({
        queryKey: [item],
      });
    },
  });

  const onSubmit = async () => {
    mutation.mutate(id);
  };

  let type_text = type;

  if (type === "MyLeaves") {
    type_text = "Leave";
  }

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
            <AlertDialogHeader>Delete {type_text}</AlertDialogHeader>

            <AlertDialogBody>
              {type === "User" && (
                <span>
                  All items associated with this user will also be{" "}
                  <strong>permantly deleted. </strong>
                </span>
              )}
              Are you sure? You will not be able to undo this action.
            </AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button variant="danger" type="submit" isLoading={isSubmitting}>
                Delete
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

export default Delete;
