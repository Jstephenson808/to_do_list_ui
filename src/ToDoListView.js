import { Button, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ToDoListView() {
  const [addButtonOpenFlag, setAddButtonOpenFlag] = useState(false);
  const [addItemTextBoxValue, setAddItemTextBoxValue] = useState('');
  const [toDoList, setToDoList] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    axios.get(process.env.REACT_APP_API_URL + '/todos').then((response) => {
      setToDoList(response.data);
    });
  }, []);

  const handleClickOpen = () => {
    setAddButtonOpenFlag(true);
  };

  const handleClose = () => {
    setAddButtonOpenFlag(false);
    setAddItemTextBoxValue('');
  };

  const handleSave = () => {
    axios
      // eslint-disable-next-line no-undef
      .post(process.env.REACT_APP_API_URL + `/todos`, {
        name: addItemTextBoxValue,
      })
      .then((response) => {
        const updatedToDos = [...toDoList, response.data];
        setToDoList(updatedToDos);
      });
    handleClose();
  };

  const handleDelete = (itemToDeleteId) => {
    axios
      // eslint-disable-next-line no-undef
      .delete(process.env.REACT_APP_API_URL + `/todos`, {
        data: {
          id: itemToDeleteId,
        },
      })
      .then((response) => {
        setToDoList(toDoList.filter((toDo) => toDo.id !== response.data.id));
      });
  };

  return (
    <>
      <List id={'main-to-do-list'}>
        {toDoList.map((item) => (
          <ListItem key={item.id} id={item.id}>
            <ListItemText primary={item.name} />
            <Button aria-label={'delete-button-' + item.id} onClick={() => handleDelete(item.id)}>
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
      <Button aria-label={'add-button'} onClick={handleClickOpen}>
        Add
      </Button>

      <Dialog open={addButtonOpenFlag} aria-label={'add-new-to-do'}>
        <DialogTitle>Add New To Do</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter To Do here"
            value={addItemTextBoxValue}
            onChange={(event) => setAddItemTextBoxValue(event.target.value)}
          />
        </DialogContent>
        <Button onClick={handleClose} aria-label={'cancel-add'}>
          Cancel
        </Button>
        <Button onClick={handleSave} aria-label={'save-to-do'}>
          Save
        </Button>
      </Dialog>
    </>
  );
}
