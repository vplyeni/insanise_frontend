import {
  Button,
  Checkbox,
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
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import {
  type ApiError,
  type UserCreate,
  UserPublic,
  UsersService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { handleError } from "../../utils";
import { useState } from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { it } from "node:test";

interface EditEmployeeProps {
  item: UserPublic;
  isOpen: boolean;
  onClose: () => void;
}

const EditEmployee = ({ item, isOpen, onClose }: EditEmployeeProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const [username, setUsername] = useState("");

  let new_date = new Date();

  if (item.date_of_birth) {
    new_date = new Date(item.date_of_birth);
  }

  const [date, setDate] = useState<Date>(new_date);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: item.username,
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
      position: item.position,
      department: item.department,
      is_active: item.is_active,
      is_manager: item.is_manager,
      is_lead: item.is_lead,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UserCreate) =>
      UsersService.updateUser({ userId: data.id + "", requestBody: data }),
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
    console.log(data);
    data.id = item.id;
    data.date_of_birth = date.toISOString().split("T")[0];
    mutation.mutate(data);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "lg", md: "xl" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Edit Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl
              marginTop={"2px"}
              isRequired
              isInvalid={username.split(" ").length > 1}
            >
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                {...register("username", {
                  required: "Username is required.",
                  validate: (value) =>
                    value.split(" ").length === 1 ||
                    "Username should not contain spaces.",
                })}
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
                  return e;
                }}
                type="text"
              />
              {errors.username && (
                <FormErrorMessage>{errors.username.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              marginTop={"2px"}
              isRequired
              isInvalid={!!errors.first_name}
            >
              <FormLabel htmlFor="first_name">First Name</FormLabel>
              <Input
                id="first_name"
                {...register("first_name", {
                  required: "First Name is required.",
                })}
                placeholder="First Name"
                type="text"
              />
              {errors.first_name && (
                <FormErrorMessage>{errors.first_name.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              marginTop={"2px"}
              isRequired
              isInvalid={!!errors.last_name}
            >
              <FormLabel htmlFor="last_name">Last Name</FormLabel>
              <Input
                id="last_name"
                {...register("last_name", {
                  required: "Last Name is required.",
                })}
                placeholder="Last Name"
                type="text"
              />
              {errors.first_name && (
                <FormErrorMessage>{errors.first_name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              marginTop={"2px"}
              isRequired
              isInvalid={!!errors.email}
            >
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                {...register("email", {
                  required: "Email is required.",
                })}
                placeholder="Email"
                type="email"
              />
              {errors.email && (
                <FormErrorMessage>{errors.email.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              marginTop={"2px"}
              isRequired
              isInvalid={!!errors.position}
            >
              <FormLabel htmlFor="position">Position</FormLabel>
              <Input
                id="position"
                {...register("position", {
                  required: "Position is required.",
                })}
                placeholder="Position"
                type="text"
              />
              {errors.position && (
                <FormErrorMessage>{errors.position.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              marginTop={"2px"}
              isRequired
              isInvalid={!!errors.department}
            >
              <FormLabel htmlFor="department">Department</FormLabel>
              <Input
                id="department"
                {...register("department", {
                  required: "Department is required.",
                })}
                placeholder="Department"
                type="text"
              />
              {errors.department && (
                <FormErrorMessage>{errors.department.message}</FormErrorMessage>
              )}
            </FormControl>
            <Flex marginTop={"3px"}>
              <FormControl marginTop={"2px"}>
                <FormLabel htmlFor="is_active">Is Active</FormLabel>
                <Checkbox
                  defaultChecked
                  id="is_active"
                  {...register("is_active", {
                    required: false,
                  })}
                  placeholder="Is Active"
                  type="checkbox"
                />
              </FormControl>
              <FormControl marginTop={"2px"}>
                <FormLabel htmlFor="is_manager">Is User a Manager</FormLabel>
                <Checkbox
                  id="is_manager"
                  {...register("is_manager", {
                    required: false,
                  })}
                  placeholder="Is Manager"
                  type="checkbox"
                />
              </FormControl>
              <FormControl marginTop={"2px"}>
                <FormLabel htmlFor="is_lead">Is User a Team Lead</FormLabel>
                <Checkbox
                  id="is_lead"
                  {...register("is_lead", {
                    required: false,
                  })}
                  placeholder="Is User a Team Lead"
                  type="checkbox"
                />
              </FormControl>
            </Flex>
            <Flex
              justify={"left"}
              style={{
                marginTop: "10px",
              }}
              alignContent={"start"}
              verticalAlign={"center"}
            >
              <Text
                style={{
                  alignContent: "center",
                  marginRight: "20px",
                }}
              >
                Date of Birth:
              </Text>

              <SingleDatepicker
                configs={{
                  dateFormat: "dd.MM.yyyy",
                }}
                name="date-input"
                date={date}
                onDateChange={setDate}
              />
            </Flex>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditEmployee;
