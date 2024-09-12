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
  LeavePublic,
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
import EditMyLeave from "../MyLeaves/EditMyLeave";
import EditLeave from "../Leaves/EditLeave";
import ApproveLeave from "../Leaves/ApproveLeave";

interface ActionsMenuProps {
  type: string;
  value: ItemPublic | UserPublic | TaskBase | LeavePublic | TaskUserPublic;
  disabled?: boolean;
}

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
  const editUserModal = useDisclosure();
  const assignTaskModal = useDisclosure();
  const approveLeaveModal = useDisclosure();
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
          {type === "Leaves" && (
            <MenuItem
              onClick={approveLeaveModal.onOpen}
              icon={<FiEdit fontSize="16px" />}
              color="ui.primary"
            >
              Approve Leave
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
        {type === "Leaves" && (
          <EditLeave
            item={value as LeavePublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        )}
        {type === "Leaves" && (
          <ApproveLeave
            item={value as LeavePublic}
            isOpen={approveLeaveModal.isOpen}
            onClose={approveLeaveModal.onClose}
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
        {type === "MyLeaves" && (
          <EditMyLeave
            item={value as LeavePublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
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
