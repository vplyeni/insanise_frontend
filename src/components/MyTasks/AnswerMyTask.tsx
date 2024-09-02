import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";
import FieldAnswer from "./FieldAnswer";
import {
  type ApiError,
  TaskField,
  type TaskUserPublic,
  TasksService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { handleError } from "../../utils";
import { useEffect, useState } from "react";

interface AnswerMyTaskProps {
  item: TaskUserPublic;
  isOpen: boolean;
  onClose: () => void;
}

const AnswerMyTask = ({ item, isOpen, onClose }: AnswerMyTaskProps) => {
  const [textareas, setTextareas] = useState({});
  const [completeText, setCompleteText] = useState("Complete");
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<TaskUserPublic>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: item,
  });

  const mutation = useMutation({
    mutationFn: (data: TaskUserPublic) =>
      TasksService.updateTask({ id: item.task_id, requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Task updated successfully.", "success");
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["my_tasks"] });
    },
  });

  const complete = useMutation({
    mutationFn: (data: TaskUserPublic) =>
      TasksService.completeTaskByTaskId({ task_id: data.task_id }),
    onSuccess: () => {
      showToast("Success!", "Task updated successfully.", "success");
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["my_tasks"] });
    },
  });

  const onSubmit: SubmitHandler<TaskUserPublic> = async (data) => {
    mutation.mutate(data);
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "xl", md: "2xl" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Task : {item.name}</ModalHeader>
          <Text marginLeft={"25px"} marginRight={"25px"} marginBottom={"0px"}>
            Description:
          </Text>
          <Text
            marginLeft={"25px"}
            marginRight={"25px"}
            marginBottom={"10px"}
            color={"dimgray"}
          >
            {item.description}
          </Text>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {item.fields.map((field: TaskField, index) => (
              <FieldAnswer
                key={index}
                task_id={item.task_id}
                field={field}
                index={index}
                textareas={textareas}
                setTextareas={setTextareas}
              />
            ))}
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              _hover={{
                backgroundColor: "#FF1002",
                width: "200px",
                transition:
                  "width 1s ease-in-out, background-color 0.5s ease-in-out", // You can adjust the timing
              }}
              width="150px" // Initial width
              transition="width 1s ease-in-out, background-color 0.5s ease-in-out" // Transition for non-hover states
              onMouseEnter={() => {
                setCompleteText("Are You Sure?");
              }}
              onMouseLeave={() => {
                setCompleteText("Complete");
              }}
              variant="primary"
              onClick={() => {
                console.log(item.fields);
                complete.mutate(item);
              }}
              isLoading={isSubmitting}
            >
              {completeText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AnswerMyTask;
