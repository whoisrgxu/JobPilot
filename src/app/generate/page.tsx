"use client";
import { useState} from "react";
import { useAtom } from 'jotai';
import { menuOpenAtom } from '@/store/atoms';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CustomAlert from "@/components/CustomAlert";
import MyDropzone from "@/components/DropZone";



export default function Generate() {


  const [inputMode, setInputMode] = useState<"text" | "pdf">("text");
  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [menuOpen] = useAtom(menuOpenAtom);
  const [selectedTone, setSelectedTone] = useState("Enthusiastic");
  const tones = ["Enthusiastic", "Professional", "Confident", "Friendly", "Persuasive", "Creative"];
  const [showOutput, setShowOutput] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");


  // Get token from local storage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  let email = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      email = payload.email || "";
    } catch {
      email = "";
    }
  }
  const handleGenerate = async () => {

    setShowOutput(false);
    setLoading(true);
    setOutput("");

    try {
      let body: FormData | string;
      let headers: HeadersInit;
      if (!resumeFile && inputMode === "pdf") {
        alert("Please upload a PDF resume.");
        return;
      }
      if (inputMode === "pdf" && resumeFile) {
        body = new FormData();
        body.append("resume", resumeFile);
        body.append("job", job);
        body.append("email", email);
        body.append("tone", selectedTone);
        headers = {};
        console.log("FormData body:", body);
      } else {
        body = JSON.stringify({ resume, job, email, tone: selectedTone });
        headers = { "Content-Type": "application/json" };
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers,
        body,
      });
      const data = await response.json();
      console.log("Response data:", data);
      if (data.output === "User has not registered. Register first before use.") {
        setShowAlert(true);
        setAlertMessage("User has not registered. Register first.");
        return;
      }
      if (data.output === "Usage limit reached. Please upgrade.") {
        setShowAlert(true);
        setAlertMessage("Usage limit reached. Please upgrade.");
        return;
      }  
      setOutput(data.output || "No response received.");
      setShowOutput(true);
    } catch {
      setOutput("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const texasAreaClass = "shadow-lg dark:shadow-sm dark:shadow-neutral-800 dark:bg-neutral-800 dark:border-none dark:text-white border border-neutral-200 bg-neutral-50 w-full md:w-1/2 h-48 md:h-80 p-3 placeholder-gray-350 rounded resize-none focus:outline-none";
  return (
    <div className={`flex flex-col items-center p-4 sm:p-8 w-full min-h-screen bg-[#181a23]${menuOpen ? " hidden" : ""}`}>

      {/* Mode Toggle */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <FormControl>
            <FormLabel 
            id="resumeContent" 
            sx={{ 
              color: { xs: 'black', sm: 'black', md: 'black', lg: 'black', xl: 'black' }, 
              '.dark &': { color: 'white' }, // for dark mode
              '&.Mui-focused': { color: 'green' } 
            }}
            className="dark:text-white"
            >
            Choose how to provide resume:
            </FormLabel>
            <RadioGroup
            name="radio-buttons-group"
            row
            value={inputMode || "text"}
            onChange={(_, value) => setInputMode(value as "text" | "pdf")}
            >
            <FormControlLabel
              value="text"
              control={<Radio 
                sx={{
                  color: 'gray', // default color
                  '&.Mui-checked': {
                    color: 'green', // checked color (green = 'success')
                  },
                }}
              />}
              label={
              <span className="text-black dark:text-white">Paste Text</span>
              }
            />
            <FormControlLabel
              value="pdf"
              control={<Radio 
                sx={{
                  color: 'gray', // default color
                  '&.Mui-checked': {
                    color: 'green', // checked color (green = 'success')
                  },
                }}
              />}
              label={
              <span className="text-black dark:text-white">Upload PDF</span>
              }
            />
            </RadioGroup>
        </FormControl>
      </div>

      {/* Resume Input */}
      <div className="flex flex-col md:flex-row w-full max-w-3xl gap-4 mb-6">
        {inputMode === "text" ? (
          <textarea
            className={`${texasAreaClass}`}
            placeholder="Paste your resume here"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        ) : (
        <div className={`${texasAreaClass}`}>
          <MyDropzone setFile={setResumeFile} />
        </div>
        )}
        <textarea
          className={`${texasAreaClass}`}
          placeholder="Paste the job description here"
          value={job}
          onChange={(e) => setJob(e.target.value)}
        />
      </div>
      {/* Button */}
      <div className="card" style={{ padding: "1px"}}>
        <div className="w-full max-w-3xl flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-2 whitespace-pre-wrap dark:bg-gray-950 dark:text-rose-50 bg-gray-50 text-neutral-700 rounded-[8px] transition duration-300 ease-in-out shadow-lg hover:shadow-pink-500/50 hover:border-pink-400 w-full sm:w-auto"
          >
            <p>{loading ? "Generating..." : "Generate Cover Letter"} <AutoAwesomeIcon/></p>
          </button>
        </div>
      </div>
      {showAlert && (
        <CustomAlert message={alertMessage} />
      )}      
      <div className="h-8" />
      <div className="w-full max-w-3xl overflow-x-auto mb-4">
        <div className="flex gap-2 w-max">
          <p className="flex items-center dark:text-white whitespace-nowrap pr-2">Tones:</p>
          {tones.map((tone) => (
            <button
              key={tone}
              onClick={() => setSelectedTone(tone)}
              className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap transition ${
                selectedTone === tone
                  ? "bg-pink-600 text-white"
                  : "bg-neutral-200 dark:bg-neutral-700 dark:text-white text-gray-800"
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

        {/* Output */}
        <div className={`${texasAreaClass} `} style={{
          width: "100%",
          maxWidth: "48rem",           // max-w-3xl
          minHeight: "10rem",          // min-h-40 = 40 * 0.25rem
          padding: "1rem",             // p-4
          borderRadius: "10px",        // rounded-[10px]
          fontSize: "0.875rem",        // text-sm
        }}
        >
              <div
              className={`${showOutput? 'opacity-100':'opacity-0'} whitespace-pre-wrap transition-opacity duration-700 ease-in-out overflow-auto w-full h-full`}
              style={{ minHeight: "100%", minWidth: "100%", height: "100%", width: "100%" }}
              >
              {output || "Your generated cover letter will appear here..."}
              </div>
        </div>
    </div>
  );
}
