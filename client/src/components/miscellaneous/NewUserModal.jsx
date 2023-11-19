import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  InputGroup,
  InputRightElement,
  useToast,
  Select
} from "@chakra-ui/react";
import { useState } from "react";

import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const NewUserModal = ({ children }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    pic: "",
  });

  const handleNewUser = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user, chats, setChats } = ChatState();


  const handleSubmit = async () => {
    setLoading(true);
    console.log(newUser);
    // If anything is missing
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password ||
      !newUser.confirmPassword ||
      !newUser.role
    ) {
      setLoading(false);
      return toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "left-accent",
      });
    }

    // If password and confirm password doesn't match
    if (newUser.password !== newUser.confirmPassword) {
      setLoading(false);
      return toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "left-accent",
      });
    }

    // Now submit the data
    try {
      const response = await fetch("/api/admin/add-user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          pic: newUser.pic,
        }),
      });
      const data = await response.json();

      toast({
        title: data.message,
        status: !data.success ? "error" : "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: !data.success ? "left-accent" : "solid",
      });

      if (data.success) {
        setLoading(false);
        onClose(); // Close the modal
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      return toast({
        title: "Internal server error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
    }
  };


  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="35px"
            fontFamily="Work sans"
          >
            Add New User
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl isRequired id="name">
              <Input
                type="text"
                placeholder="Name"
                name="name"
                mb={3}
                value={newUser.name}
                onChange={(e) => handleNewUser(e)}
              />
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Email"
                name="email"
                mb={3}
                value={newUser.email}
                onChange={(e) => handleNewUser(e)}
              />
            </FormControl>
            <FormControl isRequired id="password">
              <InputGroup 
                mb={3}>
                <InputRightElement w="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
                <Input
                  type={show ? "text" : "password"}
                  name="password"
                  value={newUser.password}
                  placeholder="Password"
                  onChange={(e) => handleNewUser(e)}
                />
              </InputGroup>
            </FormControl>
            <FormControl isRequired id="confirmPassword">
              <InputGroup 
                mb={3}>
                <InputRightElement w="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
                <Input
                  type={show ? "text" : "password"}
                  name="confirmPassword"
                  value={newUser.confirmPassword}
                  placeholder="Confirm Password"
                  onChange={(e) => handleNewUser(e)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <Select placeholder='Select user role' 
                name="role"
                mb={3}
                value={newUser.role}
                onChange={(e) => handleNewUser(e)}
                >
                <option value='admin'>Admin</option>
                <option value='user'>User</option>
              </Select>
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Profile Picture URL"
                name="pic"
                mb={3}
                value={newUser.pic}
                onChange={(e) => handleNewUser(e)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
              Add User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewUserModal;
