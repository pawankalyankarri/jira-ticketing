import axios, { type AxiosResponse } from "axios"
import { useCallback } from "react"
import { toast } from "sonner";
interface CreateWorkflowProps {
    workflow_name: string,
  created_by: string
}
interface CreateWorkflowStatusProps{
    workflow_id : string,
    workflow_order : {ticket_state : string,ticket_status : string}[]
}

interface CreateBoardProps{
  board_name: string;
  board_owner: string;
  workflow_id: string;

}

interface AddUserProps{
    email: string[],
    role: string
}

interface SignUpUserProps{
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    phone_number: string,
}
interface SignInUserProps {
    email : string,
    password : string
}

export const BoardWorkflowAPI = () =>{
    const CreateWorkflow = useCallback(async(data : CreateWorkflowProps)=>{
        console.log(data)
        try {
            const res = await axios.post("/api/workflow/add-workflow",data
            )
            console.log(res)
            return res
        }
        catch(err){
            console.log('err from Createworkflow',err)
        }
    },[])

    const FetchWorkflows = useCallback(async()=>{
        try{
            const res = await axios.get("/api/workflow")
            return res
        }
        catch(err){
            console.log('err fetchworkflow',err)
        }
    },[CreateWorkflow])

     const CreateWorkflowStatus = useCallback(async(data:CreateWorkflowStatusProps)=>{
        try{
            const res = await axios.post("/api/workflow-status/update-order",data)
            console.log(res)
            return res
        }
        catch(err){
            console.log('error createworlfstatus',err)
        }
    },[])

    const GetWorkflowStatus = useCallback(async():Promise<AxiosResponse<any>|undefined>=>{
        try{
            const res = await axios.get("/api/workflow-status/workflow-status/")
            return res
        }
        catch(err){
            console.log('err getworkflowstatus',err)
        }
    },[CreateWorkflowStatus])

   

    const FetchAllBoards = useCallback(async()=>{
        try{
            const res = await axios.get("/api/boards")
            return res
        }
        catch(err){
            console.log("err fetchboard",err)
        }
    },[])


    const CreateBoard = useCallback(async(data :CreateBoardProps )=>{
        try{
            const res = await axios.post("/api/boards/add-board",data)
            return res
        }
        catch(err){
            toast.error("Board is not created")
            console.log("err fetchboard",err)
        }
    },[])

     const FetchAllBoardsWithWorkflows = useCallback(async()=>{
        try{
            const res = await axios.get("/api/boards/boards")
            return res
        }
        catch(err){
            console.log("err fetchboard",err)
        }
    },[CreateBoard])


    const AddUser = useCallback( async(data:AddUserProps)=>{
        try{
            const res = await axios.post("/api/users/add-user",data)
            return res
        }
        catch(err){
            console.log('addUser',err)

        }
    },[])

    const SignUpUser = useCallback(async(data:SignUpUserProps)=>{
        try{
            const res = await axios.post("/api/users/sign-up",data)
            return res
        }
        catch(err){
            console.log('signupuser',err)
        }
    },[])

    const SingInUser = useCallback(async(data : SignInUserProps) => {
        try{
            const res = await axios.post("/api/users/sign-in",data)
            return res
        }
        catch(err){
            console.log('signinuser',err)
        }

    },[])

    const GetUsers = useCallback(async()=>{
        try{
            const res = await axios.get("/api/users")
            
            if(res.statusText === "OK"){
                 return res.data
            }
            else{
                console.log(res)
            }
           
        }
        catch(err){
            console.log("GetUsers",err)
        }
    },[])

    

    return {
        CreateWorkflow,
        FetchWorkflows,
        GetWorkflowStatus,
        CreateWorkflowStatus,
        FetchAllBoards,
        CreateBoard,
        FetchAllBoardsWithWorkflows,
        AddUser,
        SignUpUser,
        SingInUser,
        GetUsers
    }
}