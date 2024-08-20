import { Input } from "@chakra-ui/react"
import { TaskField } from "../../client"



interface FieldAnswer {
    field: TaskField,
    index: number
}


const FieldAnswer = ({ field,index }: FieldAnswer) => {
    return (
    <div
    key={index}>
        {field.name}
        {
            field.type == "plain_text" ?
            <Input
            placeholder={field.name}
            />
            :
            <div>
                Daha Yapmadın
            </div>
        }
    </div>
    )
} 
export default FieldAnswer
  

