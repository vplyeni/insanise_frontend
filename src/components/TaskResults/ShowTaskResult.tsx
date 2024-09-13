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

interface ShowTaskResultProps {
  item: TaskUserPublic;
  isOpen: boolean;
  onClose: () => void;
}

const ShowTaskResult = ({ item, isOpen, onClose }: ShowTaskResultProps) => {
  const [textareas, setTextareas] = useState({});
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
        <ModalContent as="form">
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
          <ModalFooter gap={3}></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShowTaskResult;
