import React, { type FormEvent } from "react";
import { useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constents";

const Upload: () => Element =() =>{
    const{auth,isLoading,fs,ai,kv} = usePuterStore();
    const navigate = useNavigate(); 
    const [isProcessing,setIsProcessing] = useState(false);
    const[statusText,setStatusText]=  useState('');
    const[file,setFile] =useState<File |null >(null);

    const handleFileSect =(file: File | null) => {
    setFile(file)
    }
    const  handleAnalyze =async({companyName,jobTitle,jobDescription,file}: {companyName: string, jobTitle: string, jobDescription: string, file: File}) => {
        setIsProcessing(true);
        setStatusText('uploading the file...');
        const uploaderFile =await fs.upload([file]);

        if(!uploaderFile ) return setStatusText('Error: Failed to upload file.');

        setStatusText('Converting to image...');
        const imageFile=await convertPdfToImage(file);
        console.log("Converted File Output:", imageFile);

        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image.');

        setStatusText('Uploading image...');
        const uploadedImage = await fs.upload([imageFile.file]);

        if(!uploadedImage) return setStatusText('Error: Failed to upload image.');

        setStatusText('Preapring data...');
        const uuid = generateUUID();

        const data = {
            id: uuid,
            resumePath: uploaderFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback :''
        };
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analyzing resume...');
        const feedback = await ai.chat(
           prepareInstructions({ jobTitle, jobDescription }),
           uploaderFile // Pass the file object, not uploaderFile.path
        );
        if(!feedback) return setStatusText('Error: Failed to analyze resume.');
       const feedbackText = typeof feedback.message.content === 'string' 
          ?feedback.message.content 
          : (feedback.message.content?.[0]?.text || "{}");
    

        try {
           // Clean the text in case the AI added markdown blocks
          const cleanedText = feedbackText.replace(/```json|```/g, "").trim();
          data.feedback = JSON.parse(cleanedText);
        } catch (e) {
           console.error("Failed to parse AI response", e);
           data.feedback = { error: "AI response was not valid JSON", raw: feedbackText };
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis  complete! Redirecting ...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit =(e: FormEvent<HTMLFormElement>)=>{
       e.preventDefault();
       const form =e.currentTarget.closest('form');
       if(!form) return;
       const formData = new FormData(form);
       const companyName = formData.get('company-name') as string;
       const jobTitle = formData.get('job-title') as string;
       const jobDescription = formData.get('job-description') as string;

       if(!file) return;

        handleAnalyze({companyName, jobTitle, jobDescription, file});
    }

    return(
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
       <Navbar />
    
       <section className="main-section">
            <div className="page-heading  py-16">
                <h1>Smart feedback for your dream job</h1>
                {isProcessing?(
                    <>
                    <h2>{statusText}</h2>
                    <img src="/images/resume-scan.gif" className="w-full"/>
                    </>
                ): (
                    <h2>Drop your resume for an Ats score and improvement tips</h2>
                )}
                {!isProcessing && (
                    <form id="upload-form" onSubmit={handleSubmit} className="flesx flex-col gap-4 mt-8"> 
                    <div className="form-div">
                        <label htmlFor="company-name">Company Name</label>
                        <input type="text" name="company-name" placeholder="Company Name"  id="company-name"/>

                    </div>
                    <div className="form-div">
                        <label htmlFor="job-title">Job Title</label>
                        <input type="text" name="job-title" placeholder="Job Title"  id="job-title"/>

                    </div>
                    <div className="form-div">
                        <label htmlFor="job-description">Job Description</label>
                        <textarea rows={5} name="job-description" placeholder="Job Description"  id="job-description"/>

                    </div>
                    <div className="form-div">
                        <label htmlFor="uploader">Upload Resume</label>
                        <FileUploader  onFileSelect = {handleFileSect}/>

                    </div>
                    <button className="primary-button " type="submit">
                        Analyse Resume
                    </button>
                    </form>
                )}
            </div>
        </section>
    </main>
    )
}
export default Upload;