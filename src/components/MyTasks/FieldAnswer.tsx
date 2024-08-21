import { Card, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react"
import { TaskField, TasksService, TDataFileForField } from "../../client"



interface FieldAnswer {
    task_id: string,
    field: TaskField,
    index: number
}


const FieldAnswer = ({ task_id,field,index }: FieldAnswer) => {
    return (
    <div key={index}>
        {
            field.type == "plain_text" ?
            <Input
            placeholder={field.name}
            />
            :
            
            <Card
                marginTop={"10px"}
                paddingTop={"6px"}
                padding={"10px"}
                minHeight={"100px"}
                borderColor={"#A0AEC0"}
                _hover={{ borderColor: "#f37024" }}
            >
                <FormLabel marginTop={"10px"} marginLeft={"20px"} fontSize="sm" color="gray.500">
                    {field.name}
                </FormLabel>
                <Input
                    type="file"
                    borderColor={"#A0AEC000"}
                    _hover={{ borderColor: "#f3702400" }}
                    onChange={(input)=>{
                        console.log(field);
                        console.log(input.target.files);
                        if(input&&input.target&&input.target.files&&input.target.files.length>0){
                            TasksService.addFileToField({task_id: task_id, field_id: field.id, file: input.target.files[0] } as TDataFileForField)
                            .then((res)=>{
                                console.log(res);
                            })
                        }
                            
                    }}
                    placeholder={field.name}
                />
            </Card>
        }
    </div>
    )
} 
export default FieldAnswer
  

