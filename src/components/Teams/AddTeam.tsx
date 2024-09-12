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
import useCustomToast from "../../hooks/useCustomToast";
import { ApiError, TeamPublic, TeamsService } from "../../client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleError } from "../../utils";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { useState } from "react";
import { it } from "node:test";

interface EditMyTeamProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditMyTeam = ({ isOpen, onClose }: EditMyTeamProps) => {
  const showToast = useCustomToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const reset = () => {};

  const onCancel = () => {
    reset();
    onClose();
  };

  const mutation = useMutation({
    mutationFn: (data: TeamPublic) =>
      TeamsService.createTeam({
        requestBody: data,
      }),
    onSuccess: () => {
      showToast("Success!", "Team created successfully.", "success");
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
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
          <ModalHeader>Edit Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex
              justify={"left"}
              style={{
                marginBottom: "10px",
              }}
              alignContent={"start"}
              verticalAlign={"center"}
            >
              <Text
                style={{
                  alignContent: "center",
                  marginRight: "10px",
                  width: "120px",
                }}
              >
                Name:
              </Text>
              <Input
                width={"450px"}
                background={"#00000000"}
                placeholder={"Name"}
                value={name}
                onChange={(event) => {
                  const text = event.target.value;
                  setName(text);
                }}
              />
            </Flex>
            <Flex
              justify={"left"}
              style={{
                marginBottom: "10px",
              }}
              alignContent={"start"}
              verticalAlign={"center"}
            >
              <Text
                style={{
                  alignContent: "center",
                  marginRight: "10px",
                  width: "120px",
                }}
              >
                Description:
              </Text>
              <Input
                width={"450px"}
                background={"#00000000"}
                placeholder={"Description"}
                value={description}
                onChange={(event) => {
                  const text = event.target.value;
                  setDescription(text);
                }}
              />
            </Flex>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="primary"
              onClick={() => {
                const item = {} as TeamPublic;
                item.name = name;
                item.description = description;
                mutation.mutate(item);
              }}
            >
              Save
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default EditMyTeam;
