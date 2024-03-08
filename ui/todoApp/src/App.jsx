import { useState, useEffect} from 'react'
import './App.css'

function App() {
  
  const [notes, setNotes] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const API_URL="https://localhost:7190/";

  const refreshNotes = async () => {
    try {
      const response = await fetch(API_URL + 'api/toDoApp/GetNotes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const inputHandler = (event) => {
    setInputValue(event.target.value);
    console.log(inputValue);
  };


  const addNoteHandler = async () => {
    try {
      const formData = new FormData();
      formData.append('newNotes', inputValue);
  
      const response = await fetch(API_URL + 'api/toDoApp/AddNotes', {
        method: 'POST',
        body: formData,
      });
  
      console.log('Response Status:', response.status);
      console.log('Response Text:', await response.text());
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Refresh the notes after successfully adding a new note
      await refreshNotes();
      // Clear the input value
      setInputValue('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNoteHandler = async (id) =>{
    try{
      const response = await fetch(`${API_URL}api/ToDoApp/DeleteNotes?id=${id}`, {
        method: "DELETE"
  
      })

      if(!response.ok){
        throw new Error(`HTTP error status: ${response.status}`)
      }
      await refreshNotes();
    } catch (error){
      console.error("Error deleting note:", error)
    }

  }

  useEffect(()=>{
    refreshNotes();
  },[])


  return (
    <>
    <h2>Todo App</h2>
    <div>
      <input onChange={inputHandler}>
      </input>
      <button onClick={addNoteHandler}>Add note</button>
    </div>
    <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.description}<button onClick={() => deleteNoteHandler(note.id)}>X</button></li>
        ))}
      </ul>
    </>
  )
}

export default App
