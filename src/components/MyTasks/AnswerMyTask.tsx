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
    type TaskUserPublic,
    TasksService,
  } from "../../client"
  import useCustomToast from "../../hooks/useCustomToast"
  import { handleError } from "../../utils"
import { useEffect, useState } from "react"
  
  interface AnswerMyTaskProps {
    item: TaskUserPublic
    isOpen: boolean
    onClose: () => void
  }
  
  const AnswerMyTask = ({ item, isOpen, onClose }: AnswerMyTaskProps) => {
    const [textareas, setTextareas] = useState({})
    
    const queryClient = useQueryClient()
    const showToast = useCustomToast()
    const {
      register,
      handleSubmit,
      reset,
      formState: { isSubmitting, errors, isDirty },
    } = useForm<TaskUserPublic>({
      mode: "onBlur",
      criteriaMode: "all",
      defaultValues: item,
    })
  
    const mutation = useMutation({
      mutationFn: (data: TaskUserPublic) =>
        TasksService.updateTask({ id: item.task_id, requestBody: data }),
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
  
    const onSubmit: SubmitHandler<TaskUserPublic> = async (data) => {
      mutation.mutate(data)
    }
  
    const onCancel = () => {
      onClose()
    }
    
  
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
                        task_id={item.task_id}
                        field={field}
                        index={index}
                        textareas={textareas}
                        setTextareas={setTextareas}
                    />
                ))

                }
                

            </ModalBody>
            <ModalFooter gap={3}>
              <Button
                variant="primary"
                />
              <Button
                variant="primary"
                onClick={()=>{
                  const keys: string[] = Object.keys(textareas);
                  const values: string[]  = Object.values(textareas);
                  
                  console.log(keys);
                  console.log(values);
                  
                  console.log(textareas);
                  
                  for(let i = 0; i < item.fields.length; i++){
                    for(let j = 0; i < keys.length; i++){
                      if(item.fields[i].id = keys[j]){
                        item.fields[i].content = values[j]
                      }
                    }
                  } 
                  let count = 0;
                  for(let i = 0; i < keys.length; i++){
                      console.log(keys[i]);

                      TasksService.customizeFieldWithTaskId({
                        content: values[i],
                        field_id: keys[i],
                        task_id: item.task_id,
                      }).then(()=>{
                        i++;
                        if(i>keys.length-1){
                          onClose()
                          showToast("Success!", "Task Successfuly saved.", "success")
                        }
                      })
                  }
                }}
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
  