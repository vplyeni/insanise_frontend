import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  ModalOverlay,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type ApiError, type UserCreate, UsersService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { handleError } from "../../utils";
import { useState } from "react";

interface AddEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEmployee = ({ isOpen, onClose }: AddEmployeeProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  const [employee, setEmployee] = useState<any>({});
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UserCreate) =>
      UsersService.createEmployee({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Employee created successfully.", "success");
      reset();
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const onSubmit: SubmitHandler<UserCreate> = (data) => {
    mutation.mutate(data);
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
          <ModalHeader>Add Employee</ModalHeader>
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
                FirstName:
              </Text>
              <Input
                width={"450px"}
                background={"#00000000"}
                placeholder={"First Name"}
                value={employee["first_name"]}
                onChange={(event) => {
                  const text = event.target.value;
                  employee["first_name"] = text;
                  setEmployee(employee);
                }}
              />
            </Flex>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="primary" isLoading={isSubmitting}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddEmployee;
