import {
  Button,
  Center,
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
  Spinner,
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
  const [isLoading, setIsLoading] = useState(true);

  const reset = () => {};

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
          <ModalBody minH="300px" pb={6}>
            {false ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "260px",
                  alignItems: "center",
                }}
              >
                {" "}
                {/* Ensures the spinner is centered */}
                <Spinner size="xl" />
              </div>
            ) : (
              <>Loaded</>
            )}
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              _hover={{ backgroundColor: "#FF1002" }}
              variant={"primary"}
              onClick={onCancel}
            >
              Assign
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AssignTask;
