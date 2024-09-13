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
import { it } from "node:test";

interface EditLeaveProps {
  item: LeavePublic;
  isOpen: boolean;
  onClose: () => void;
}

const EditLeave = ({ item, isOpen, onClose }: EditLeaveProps) => {
  const showToast = useCustomToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    new Date(item.start_date),
    new Date(item.end_date),
  ]);

  const [reason, setReason] = useState<string>(item.description);

  const reset = () => {
    setSelectedDates([new Date(), new Date()]);
    setIsLoading(false);
    setReason("");
  };

  const onCancel = () => {
    reset();
    onClose();
  };

  const mutation = useMutation({
    mutationFn: (data: LeavePublic) =>
      LeavesService.updateLeave({ requestBody: data, id: item.id + "" }),
    onSuccess: () => {
      showToast("Success!", "Leave offered successfully.", "success");
      setIsLoading(false);
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
      setIsLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
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
          <ModalHeader>Edit Leave</ModalHeader>
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
                isDisabled
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
export default EditLeave;
