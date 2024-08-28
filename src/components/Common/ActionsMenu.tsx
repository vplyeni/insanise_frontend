import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiCornerDownRight, FiEdit, FiTrash } from "react-icons/fi";

import type {
  ItemPublic,
  TaskBase,
  TaskPublic,
  TaskUserPublic,
  UserPublic,
} from "../../client";
import EditUser from "../Admin/EditUser";
import EditItem from "../Items/EditItem";
import Delete from "./DeleteAlert";

import EditTask from "../Task/EditTask";
import AnswerMyTask from "../MyTasks/AnswerMyTask";
import AssignTask from "../Task/AssignTask";

interface ActionsMenuProps {
  type: string;
  value: ItemPublic | UserPublic | TaskBase;
  disabled?: boolean;
}

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
  const editUserModal = useDisclosure();
  const assignTaskModal = useDisclosure();
  const deleteModal = useDisclosure();

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
          {type === "Task" && (
            <MenuItem
              onClick={assignTaskModal.onOpen}
              icon={<FiCornerDownRight fontSize="16px" />}
              color="ui.success"
            >
              Assign {type}
            </MenuItem>
          )}
          {type !== "MyTasks" && (
            <MenuItem
              onClick={deleteModal.onOpen}
              icon={<FiTrash fontSize="16px" />}
              color="ui.danger"
            >
              Delete {type}
            </MenuItem>
          )}
        </MenuList>
        {type === "User" && (
          <EditUser
            user={value as UserPublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        )}
        {type === "MyTasks" && (
          <AnswerMyTask
            item={value as TaskUserPublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        )}
        {type === "Task" && (
          <EditTask
            item={value as TaskPublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          ></EditTask>
        )}
        {type === "Task" && (
          <AssignTask
            item={value as TaskPublic}
            isOpen={assignTaskModal.isOpen}
            onClose={assignTaskModal.onClose}
          ></AssignTask>
        )}
        {type !== "MyTasks" && (
          <Delete
            type={type}
            id={value.id + ""}
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.onClose}
          />
        )}
      </Menu>
    </>
  );
};

export default ActionsMenu;
