import React, {useEffect, useState, useRef} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Container from "@mui/material/Container";
import {
    currentUser,
    addFriendList,
    friendList,
    requestSend, requestList, acceptFriendRequest
} from "../../api/user";
import {userInfo} from "../../utils/auth";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import Message from "../chat/child/Message";
import {useForm} from "react-hook-form";
import moment from "moment";
import {getMessage, messageStore} from "../../api/message";
import { io } from "socket.io-client";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    },
    scrollChat :{
        overflow: "scroll",
        height: "45rem"
    }
});

const HomeMain = () => {
    const classes = useStyles();
    const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });
    const [user, setUser] = useState({})
    const [friendAddList, setFriendAddList] = useState([])
    const [friends, setFriends] = useState([])
    const [requests, setRequests] = useState([])
    const [conversation, setConversation] = useState({id2 : ''})
    const {id, token} = userInfo()
    const [conversations, setConversations] = useState([]);
    // const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState({
        conversationId: '',
        message: '',
        time: '',
    });
    const [onlineUsers, setOnlineUsers] = useState([]);
    // const [socket, setSocket] = useState([]);
    const socket = useRef((io("ws://localhost:5001")));
    // const { user } = useContext(AuthContext);
    const scrollRef = useRef();

    useEffect(() => {
      // setSocket(io("ws://localhost:5001"))
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                conversationId: data.senderId,
                message: data.text,
                time: data.time,
            });
        });
    }, []);

    useEffect(() => {
        // arrivalMessage &&
        // conversations?.members.includes(arrivalMessage.sender) &&
        // setMessages((prev) => [...prev, arrivalMessage]);
       arrivalMessage && conversations[0]?.chatId?.includes(arrivalMessage?.conversationId) && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, conversations]);


    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (users) => {
            console.log(users)
            // setOnlineUsers(
            //     user.followings.filter((f) => users.some((u) => u.userId === f))
            // );
        });
    }, [user]);



    useEffect(() => {
        const getConversations = async () => {
            try {
                await getMessage(id, conversation.id2, token).then(res => {
                    setConversations(res.data);
                })

            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [conversation]);

    useEffect(async () => {
        await currentUser(id, token).then(res => {
            setUser(res.data)
        })
    }, [])


    useEffect(async () => {
        await addFriendList(id, token).then(res => {
            setFriendAddList(res.data)
        })
    }, [])

    useEffect(async () => {
        await friendList(id, token).then(res => {
            setFriends(res.data)
        })
    }, [])
    useEffect(async () => {
        await requestList(id, token).then(res => {
            setRequests(res.data)
        })
    }, [])

    useEffect(async () => {
        setMessages(conversations[0].messages)
     }, [conversations])
    // console.log(friends)
    const RenderFunction = () => {

        async function addFriend(e, _id) {
            const data = {
                friendId: _id
            }
            await requestSend(id, token, data)

            return undefined;
        }

        function addRequest(e, _id) {
            const data = {
                friendId: _id
            }
            acceptFriendRequest(id, token, data).then(res => console.log(res))
        }

        function gotoChat(e, _id) {
            setConversation({
                ...conversation,
                id2: _id
            })
        }

        const onSubmit = async (data) => {
            try {
                const msg = {
                    conversationId: id,
                    chatIds: [id, conversation.id2],
                    messageBody: data.messageBody,
                    time: moment().unix()
                }
                socket.current.emit("sendMessage", {
                    senderId: id,
                    receiverId : conversation.id2 ,
                    text: data.messageBody,
                    time: moment().unix()
                });

                await messageStore(id, token, msg).then(res => {
                    console.log(res.data)
                    setMessages(
                       res.data[0].messages
                    )

                })
                 reset({ messageBody: "" }, {
                    keepErrors: true,
                    keepDirty: true,
                    keepIsSubmitted: false,
                    keepTouched: false,
                    keepIsValid: false,
                    keepSubmitCount: false,
                })

            } catch (err) {
                console.log(err)
            }
        }


        return (
            <>

                <Container style={{marginTop: 10}} container>

                    <Grid container component={Paper} className={classes.chatSection}>
                        <Grid item xs={3} className={classes.borderRight500}>
                            <List>
                                <ListItem button key="RemySharp" onClick={e=>setConversation({id2: ''})}>
                                    <ListItemIcon>
                                        <Avatar alt="Remy Sharp"/>
                                    </ListItemIcon>
                                    <ListItemText primary={user.fullName}/>
                                </ListItem>
                            </List>
                            <Divider/>
                            <Grid item xs={12} style={{padding: '10px'}}>
                                <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth/>
                            </Grid>
                            <Divider/>
                            <List>
                                {friends?.map((data, index) => {
                                    return (
                                        <ListItem key={index} button onClick={e => gotoChat(e, data._id)}>
                                            <ListItemIcon>
                                                <Avatar alt="Remy Sharp"/>
                                            </ListItemIcon>
                                            <ListItemText primary={data.fullName}>{data.fullName}</ListItemText>
                                            <ListItemText secondary="online" align="right"/>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Grid>
                        <Grid item xs={6}>
                            <div className={classes.scrollChat}>
                                {conversations ? (<>
                                    <Grid xs={12} item>
                                        {messages?.map((data, index)=>(
                                            <Message key={index} message={data} own={data.conversationId===id}/>
                                        ))}

                                        <Divider/>

                                        <Grid container style={{padding: '20px'}}>
                                            <Grid item xs={11}>
                                                <form >
                                                    <TextField
                                                        autoFocus
                                                        placeholder="Type your message"
                                                        {...register("messageBody", { required: "Please enter your first name." })}
                                                    />
                                                </form>
                                            </Grid>
                                            <Grid xs={1} align="right">
                                                <Fab color="primary" aria-label="add"
                                                     onClick={handleSubmit(onSubmit)}
                                                ><SendIcon/></Fab>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>) : (
                                    <span style={{textAlign:"center", fontSize:20, marginLeft: 50}}>Open a conversation to start a chat.</span>
                                )}
                            </div>

                        </Grid>
                        <Grid item xs={3} component={Paper}>
                            <ListItem button>
                                <ListItemText primary="Friend Request">Friend Request</ListItemText>
                            </ListItem>

                            {
                                requests?.map((data, index) => {
                                    return (
                                        <ListItem button onClick={e => addRequest(e, data._id)} key={index}>
                                            <ListItemIcon>
                                                <Avatar alt="Alice"/>
                                            </ListItemIcon>
                                            <ListItemText primary={data.fullName}/>
                                            <AddCircleIcon/>
                                        </ListItem>
                                    )
                                })
                            }

                            <ListItem button key="Alice">
                                <ListItemText primary="Suggestion">Suggestion</ListItemText>
                            </ListItem>
                            {friendAddList?.map((data, index) => {
                                return (
                                    <ListItem button onClick={e => addFriend(e, data._id)} key={index}>
                                        <ListItemIcon>
                                            <Avatar alt="Alice"/>
                                        </ListItemIcon>
                                        <ListItemText primary={data.fullName}/>
                                        <AddCircleIcon/>
                                    </ListItem>
                                )
                            })}

                        </Grid>
                        {/*<Grid item xs={9}>*/}
                        {/*    <List className={classes.messageArea}>*/}
                        {/*        <ListItem key="1">*/}
                        {/*            <Grid container>*/}
                        {/*                <Grid item xs={12}>*/}
                        {/*                    <ListItemText align="right" primary="Hey man, What's up ?"/>*/}
                        {/*                </Grid>*/}
                        {/*                <Grid item xs={12}>*/}
                        {/*                    <ListItemText align="right" secondary="09:30"/>*/}
                        {/*                </Grid>*/}
                        {/*            </Grid>*/}
                        {/*        </ListItem>*/}
                        {/*        <ListItem key="2">*/}
                        {/*            <Grid container>*/}
                        {/*                <Grid item xs={12}>*/}
                        {/*                    <ListItemText align="left" primary="Hey, Iam Good! What about you ?"/>*/}
                        {/*                </Grid>*/}
                        {/*                <Grid item xs={12}>*/}
                        {/*                    <ListItemText align="left" secondary="09:31"/>*/}
                        {/*                </Grid>*/}
                        {/*            </Grid>*/}
                        {/*        </ListItem>*/}
                        {/*        <ListItem key="3">*/}
                        {/*            <Grid container>*/}
                        {/*                <Grid item xs={12}>*/}
                        {/*                    <ListItemText align="right" primary="Cool. i am good, let's catch up!"/>*/}
                        {/*                </Grid>*/}
                        {/*                <Grid item xs={12}>*/}
                        {/*                    <ListItemText align="right" secondary="10:30"/>*/}
                        {/*                </Grid>*/}
                        {/*            </Grid>*/}
                        {/*        </ListItem>*/}
                        {/*        <div align="left" className="message-list">*/}
                        {/*            {[...Object.values(messages)]*/}
                        {/*                .sort((a, b) => a.time - b.time)*/}
                        {/*                .map((message) => (*/}
                        {/*                    <div*/}
                        {/*                        key={message.id}*/}
                        {/*                        className="message-container"*/}
                        {/*                        title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}*/}
                        {/*                    >*/}
                        {/*                        <ListItem key="2">*/}
                        {/*                            <Grid container>*/}
                        {/*                                <Grid item xs={12}>*/}
                        {/*                                    <ListItemText align="left" secondary={message.user}/>*/}
                        {/*                                </Grid>*/}
                        {/*                                <Grid style={{marginTop: 0}} item xs={12}>*/}
                        {/*                                    <ListItemText align="left" primary={message.value}/>*/}
                        {/*                                </Grid>*/}
                        {/*                                <Grid item xs={12}>*/}
                        {/*                                    <ListItemText align="left" secondary={new Date(message.time).toLocaleTimeString()}/>*/}
                        {/*                                </Grid>*/}
                        {/*                            </Grid>*/}

                        {/*                        </ListItem>*/}
                        {/*                    </div>*/}
                        {/*                ))*/}
                        {/*            }*/}
                        {/*        </div>*/}
                        {/*    </List>*/}
                        {/*    <Divider/>*/}
                        {/*    <Grid container style={{padding: '20px'}}>*/}
                        {/*        <Grid item xs={11}>*/}
                        {/*            <form onSubmit={submitForm}>*/}
                        {/*                <TextField*/}
                        {/*                    autoFocus*/}
                        {/*                    value={value}*/}
                        {/*                    placeholder="Type your message"*/}
                        {/*                    onChange={(e) => {*/}
                        {/*                        setValue(e.currentTarget.value);*/}
                        {/*                    }}*/}
                        {/*                />*/}
                        {/*            </form>*/}
                        {/*        </Grid>*/}
                        {/*        <Grid xs={1} align="right">*/}
                        {/*            <Fab color="primary" aria-label="add"*/}
                        {/*                 // onClick={(e) => {setValue(e.currentTarget.value);}}*/}
                        {/*            ><SendIcon/></Fab>*/}
                        {/*        </Grid>*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Container>
            </>
        )
    }

    return (
        <>
            <RenderFunction/>
        </>
    )
}

export default HomeMain