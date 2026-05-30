import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ServerUrl } from "../App"
import axios from "axios"
import Step3Report from "../components/Step3Report"

const InterviewReport = () => {
  const {id}= useParams()
  const [report,setReport] = useState(null)

  useEffect(() => {
    const getReport = async()=>{
      try {
        const response = await axios.get(ServerUrl + `/interview/report/${id}`,{withCredentials:true})
        setReport(response.data)
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    getReport();
  },[id])

  if(!report){
    return(
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report...</p>
      </div>
    )
  }

  return (
    <Step3Report report={report}/>
  )
}

export default InterviewReport