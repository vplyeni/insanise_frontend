import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import FieldTask from "./FieldTask";
import useCustomToast from "../../hooks/useCustomToast";
import { ApiError, TaskBase, TasksService } from "../../client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleError } from "../../utils";

interface AssignTaskProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssignTask = ({ isOpen, onClose }: AssignTaskProps) => {
  const showToast = useCustomToast();
  const queryClient = useQueryClient();

  const removeArea = (index: number) => {
    if (index >= 0 && index < fields.length) {
      const ls = [...fields.slice(0, index), ...fields.slice(index + 1)];
      setFields(ls);
    }
  };

  const reset = () => {
    setFields([]);
    setTask({});
    setHour(undefined);
    setDay(undefined);
    setNewName("");
    setNewType("");
  };

  const onCancel = () => {
    onClose();
  };

  const mutation = useMutation({
    mutationFn: (data: TaskBase) =>
      TasksService.createTask({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Item created successfully.", "success");
      reset();
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "xl", md: "2xl" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form">
          <ModalHeader>Assign This Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}></ModalBody>
          <ModalFooter gap={3}>
            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AssignTask;
