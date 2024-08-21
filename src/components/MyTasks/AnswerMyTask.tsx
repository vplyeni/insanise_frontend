import {
    Button,
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
  } from "@chakra-ui/react"
  import { useMutation, useQueryClient } from "@tanstack/react-query"
  import { type SubmitHandler, useForm } from "react-hook-form"
  import FieldAnswer from "./FieldAnswer"
  import {
    type ApiError,
    TaskField,
    type TaskPublic,
    type TaskUpdate,
    TasksService,
  } from "../../client"
  import useCustomToast from "../../hooks/useCustomToast"
  import { handleError } from "../../utils"
  
  interface AnswerMyTaskProps {
    item: TaskPublic
    isOpen: boolean
    onClose: () => void
  }
  
  const AnswerMyTask = ({ item, isOpen, onClose }: AnswerMyTaskProps) => {
    const queryClient = useQueryClient()
    const showToast = useCustomToast()
    const {
      register,
      handleSubmit,
      reset,
      formState: { isSubmitting, errors, isDirty },
    } = useForm<TaskUpdate>({
      mode: "onBlur",
      criteriaMode: "all",
      defaultValues: item,
    })
  
    const mutation = useMutation({
      mutationFn: (data: TaskUpdate) =>
        TasksService.updateTask({ id: item.id, requestBody: data }),
      onSuccess: () => {
        showToast("Success!", "Task updated successfully.", "success")
        onClose()
      },
      onError: (err: ApiError) => {
        handleError(err, showToast)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] })
      },
    })
  
    const onSubmit: SubmitHandler<TaskUpdate> = async (data) => {
      mutation.mutate(data)
    }
  
    const onCancel = () => {
      reset()
      onClose()
    }

    console.log(item);
    
  
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
            <Text marginLeft={"25px"} marginRight={"25px"} marginBottom={"20px"} color={"dimgray"}>
              {item.description}
            </Text>
            <ModalCloseButton />
            <ModalBody pb={6}>
                {

                item.fields.map((field:TaskField,index)=>(
                    <FieldAnswer
                        key={index}
                        task_id={item.id}
                        field={field}
                        index={index}
                    />
                ))

                }
                

            </ModalBody>
            <ModalFooter gap={3}>
              <Button
                variant="primary"
                type="submit"
                isLoading={isSubmitting}
              >
                Save
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
  
  export default AnswerMyTask
  