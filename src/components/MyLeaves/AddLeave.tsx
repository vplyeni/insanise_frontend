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
import { ApiError, LeavePublic, LeavesService } from "../../client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleError } from "../../utils";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { useState } from "react";

interface AddLeaveProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddLeaveModal = ({ isOpen, onClose }: AddLeaveProps) => {
  const showToast = useCustomToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    new Date(),
    new Date(),
  ]);

  const [reason, setReason] = useState<string>("");

  const reset = () => {
    setSelectedDates([new Date(), new Date()]);
    setReason("");
  };

  const onCancel = () => {
    reset();
    onClose();
  };

  const mutation = useMutation({
    mutationFn: (data: LeavePublic) =>
      LeavesService.createLeave({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Leave added successfully.", "success");
      setIsLoading(false);
      onClose();
    },
    onError: (err: ApiError) => {
      setIsLoading(false);
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["my_leaves"] });
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
          <ModalHeader>Add Leave</ModalHeader>
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
                  minWidth: "122px",
                  alignContent: "center",
                  marginRight: "10px",
                }}
              >
                Start - End Date:
              </Text>

              <RangeDatepicker
                configs={{
                  dateFormat: "dd.MM.yyyy",
                }}
                selectedDates={selectedDates}
                onDateChange={(event) => {
                  setSelectedDates(event);
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
                  minWidth: "122px",
                  alignContent: "center",
                  marginRight: "10px",
                }}
              >
                Reason for Leave:
              </Text>
              <Textarea
                marginTop={4}
                background={"#00000000"}
                placeholder={""}
                value={reason}
                onChange={(event) => {
                  const text = event.target.value;
                  setReason(text);
                }}
                style={{
                  minHeight: "120px",
                }}
              />
            </Flex>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              isLoading={isLoading}
              variant="primary"
              onClick={() => {
                if (selectedDates.length !== 2) {
                  showToast(
                    "Error",
                    "Please select start and end date",
                    "error"
                  );
                  return;
                }
                if (reason === "") {
                  showToast("Error", "Please fill reason", "error");
                  return;
                }
                const [startDate, endDate] = selectedDates.map((date) =>
                  date
                    .toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                    .split(".")
                    .reverse()
                    .join("-")
                );

                const leave: LeavePublic = {
                  start_date: startDate,
                  end_date: endDate,
                  description: reason,
                };
                setIsLoading(true);

                mutation.mutate(leave);
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
export default AddLeaveModal;
