import { Box, Card, Flex, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react"
import { TaskField, TasksService, TDataFileForField } from "../../client"
import { useState } from "react"



interface FieldAnswer {
    task_id: string,
    field: TaskField,
    index: number
}


const FieldAnswer = ({ task_id,field,index }: FieldAnswer) => {
    const [name, setName] = useState(field.represented_name)

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
                defaultValue={field.name}
                minHeight={"100px"}
                borderColor={"#A0AEC0"}
                _hover={{ borderColor: "#f37024" }}
            >
                <FormLabel marginTop={"10px"} marginLeft={"20px"} fontSize="sm" color="gray.500">
                    {field.name}
                </FormLabel>
                <Flex alignItems="center">
                    <Input
                        type="file"
                        style={{
                            color:"transparent",
                            width:"150px",
                            paddingTop: "5px"
                        }}
                        borderColor={"#A0AEC000"}
                        _hover={{ borderColor: "#f3702400" }}
                        onChange={(input)=>{
                            console.log(field);
                            console.log(input.target.files);
                            if(input&&input.target&&input.target.files&&input.target.files.length>0){
                                TasksService.addFileToField({task_id: task_id, field_id: field.id, file: input.target.files[0] } as TDataFileForField)
                                .then((res:any)=>{
                                    field.content = res.name
                                    field.represented_name = res.represent_name

                                    setName(res.represent_name)
                                })
                            }
                                
                        }}
                    /> 
                    {name === ""? 
                    <Text isTruncated maxW={350}>
                    No File Chosen
                    </Text>
                    :
                    <Text isTruncated maxW={350}>
                    File: {name}
                    </Text>
                    }
                
                </Flex>

                
            </Card>
        }
    </div>
    )
} 
export default FieldAnswer
  

