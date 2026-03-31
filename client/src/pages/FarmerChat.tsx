import React, {useState, useEffect, ChangeEvent} from 'react';
import { api } from '../services/api';
import ReactMarkdown from 'react-markdown';
import '../styles/Chat.css';

type Sender = "User" | "AI";

interface message {
	text: string;
	sender: Sender;
}

interface MessageWindowArgs {
	list: message[];
	loading: boolean;
}

const MessageWindow: React.FC<MessageWindowArgs> = ({list, loading})=>{
	return(
		<div className = "container">
	      {list.map((elem, index)=> (elem.sender ==="AI" ? (<div className = "left-div" key = {index}><ReactMarkdown>{elem.text}</ReactMarkdown></div>) : (<div className = "right-div" key = {index}> <ReactMarkdown>{elem.text}</ReactMarkdown></div>)))}
	      { loading && <div className = "left-div">Thinking . . .</div> }
        </div>
		)
	
}

const InputBox : React.FC<{addMessage: (msg: message) => void}> = ({addMessage}) => {
	const [prompt, setPrompt] = useState<string>('');

	const handleSubmit = (e: React.FormEvent)=>{
		e.preventDefault()
		// will do something here
		addMessage({text: prompt,sender: "User"})
		setPrompt("")
	}

	return (
  <div className="input-wrapper">
    <form className="input-form" onSubmit={handleSubmit}>
      <input 
        className="chat-input"
        type="text" 
        value={prompt} 
        placeholder="Ask your agriculture question..."
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)} 
      />
      <button className="send-button" type="submit" disabled={!prompt.trim()}>
        Send
      </button>
    </form>
  </div>
)
}

const FarmerChat: React.FC = ()=>{
	const [messageList, setMessageList] = useState<message[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const addMessage = async (input: message) =>{
		setMessageList((previousList)=>[...previousList, input]);
		if(input.sender == "User"){
		setLoading(true)
		const AiResponse = await api.post('/chat',{history:messageList, newMessage: input.text})
		setLoading(false)
		setMessageList((previousList) => [...previousList, {text: AiResponse.data.response, sender: "AI"}]);
	}
	}
	return(
		<div>
		<MessageWindow list = {messageList} loading = {loading}/>
		<InputBox addMessage = {addMessage}/>
		</div>
		)
}

export default FarmerChat;