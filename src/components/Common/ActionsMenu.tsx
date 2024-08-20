import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { FiEdit, FiTrash } from "react-icons/fi"

import type { ItemPublic, TaskPublic, UserPublic } from "../../client"
import EditUser from "../Admin/EditUser"
import EditItem from "../Items/EditItem"
import Delete from "./DeleteAlert"
import AnswerMyTask from "../MyTasks/AnswerMyTask"

interface ActionsMenuProps {
  type: string
  value: ItemPublic | UserPublic
  disabled?: boolean
}

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
  const editUserModal = useDisclosure()
  const deleteModal = useDisclosure()

  console.log(type);
  
  return (
    <>
      <Menu>
        <MenuButton
          isDisabled={disabled}
          as={Button}
          rightIcon={<BsThreeDotsVertical />}
          variant="unstyled"
        />
        <MenuList>
          <MenuItem
            onClick={editUserModal.onOpen}
            icon={<FiEdit fontSize="16px" />}
          >
            {type == "MyTasks" ? "Answer Your Task" : <>Edit {type}</>}
          </MenuItem>
          {
          type !== "MyTasks" &&
          <MenuItem
            onClick={deleteModal.onOpen}
            icon={<FiTrash fontSize="16px" />}
            color="ui.danger"
          >
            Delete {type}
          </MenuItem>
        }
        </MenuList>
        {type === "User" ? (
          <EditUser
            user={value as UserPublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        ) : type === "MyTasks" ? (
        <AnswerMyTask
          item={value as TaskPublic}
          isOpen={editUserModal.isOpen}
          onClose={editUserModal.onClose}
        />
        ) :(
          <EditItem
            item={value as ItemPublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        )}
        {
          type !== "MyTasks" &&
          <Delete
          type={type}
          id={value.id+""}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
        />
        }

      </Menu>
    </>
  )
}

export default ActionsMenu
