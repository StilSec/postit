"use client";

import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPost } from "@/app/(dashboard)/posts/dataOps";
import { useRouter } from "next/navigation";

//Checks if the given image URL is valid
function useImageValidation(url: string) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');

  useEffect(() => {
    if (!url) {
      setStatus('idle');
      return;
    }

    setStatus('checking');
    const img = new Image();

    img.onload = () => setStatus('valid');
    img.onerror = () => setStatus('invalid');
    img.src = url;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  return status;
}

//Component for adding a new post
export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const status = useImageValidation(thumbnail);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const [errorModal, showErrorModal] = useState(false);
  const [confirmModal, showConfirmModal] = useState(false);

  //Handles the post logic; Contains several conditions that will throw an error if met
  const handlePost = async () => {

    //Throws error if title is not 1-50 characters long
    if(title.length < 1 || title.length > 50) {
      setErrorMessage("Title must be 1-20 characters long.")
      showErrorModal(true);
    }
    else {
      //Throws error if summary is not 1-100 characters long
      if(summary.length < 1 || summary.length > 100) {
        setErrorMessage("Summary must be 1-100 characters long.")
        showErrorModal(true);
      }
      else {
        //Throws error if content is less than 1 character long
        if(content.length < 1) {
          setErrorMessage("Content must be at least 1 character long.")
          showErrorModal(true);
        }
        else {
          //Shows confirmation modal for posting
          showConfirmModal(true);
        }
      }
    }
  }

  //Handles confirmation of post
  const handleConfirm = async () => {
    const finalThumbnail = ( status === 'invalid' || thumbnail == '') ? '/images/postit-thumbnail.png' : thumbnail;

    await createPost(
      title,
      content,
      summary,
      finalThumbnail
    );

    //Redirects user to main page
    resetValues();
    router.push(`/posts`);
    router.refresh();
  }

  //Resets component values for when user exits the page
  const resetValues = () => {
    setTitle("");
    setContent("");
    setSummary("");
    setThumbnail("");
  }

  //Handles the back button to the main page
  const handleBack = async () => {
    router.push(`/posts/`);
    router.refresh();
    resetValues();
  }

  //Allows the textarea for the post's content to expand when necessary
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const scrollContainer = el.closest('.overflow-y-auto') as HTMLElement | null;
    const scrollPos = scrollContainer?.scrollTop ?? window.scrollY;

    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;

    if (scrollContainer) {
        scrollContainer.scrollTop = scrollPos;
    } else {
        window.scrollTo(0, scrollPos);
    }
  }, [content]);

  {/* Main component body */}
  return (
    <div className="flex flex-col min-h-[80vh] space-y-5 sm:space-y-6 text-black">
      <Button
        className="flex items-center justify-center w-10 h-10 rounded-full border mb-2"
        onClick={handleBack}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill="black"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="18,4 18,20 6,12" />
        </svg>
      </Button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-black">
            Create Post
          </h2>
        </div>
      </div>

      <div className="w-full">
        <Label htmlFor="post-thumbnail" className="text-lg">Choose a Thumbnail</Label>
        <Input
            id="post-thumbnail"
            placeholder="Enter Thumbnail URL ..."
            value={thumbnail}
            onChange={(event) => setThumbnail(event.target.value)}
            className="bg-white"
        />
        {thumbnail && (
          <img
            src={thumbnail}
            alt={"Image not loaded"}
            className="w-full object-cover h-48 sm:h-64 w-full object-cover mt-3 border-1 rounded"
          />
        )} 
      </div>

      <div className="w-full">
        <Label htmlFor="post-title" className="mb-1 text-lg">Title</Label>
        <Input
            id="post-title"
            placeholder="Enter Title ..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="bg-white"
        />
      </div>

      <div className="w-full">
        <Label htmlFor="post-summary" className="mb-1 text-lg">Summary</Label>
        <Input
            id="post-summary"
            placeholder="Enter Summary ..."
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            className="bg-white"
        />
      </div>

      <div className="w-full">
        <h3>Content</h3>
        <div className="grid grid-cols-1 gap-4">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter Content ..."
            className="w-full h-96 p-3 border rounded-md text-sm resize-none bg-white"
          />
        </div>
      </div>

      <Button type="button" size="sm" className="mt-3" onClick={handlePost}>
        Post
      </Button>

      {/* Modal for showing error messages */}
      {errorModal ?
        (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog">
            <div 
                className="w-full max-w-[400px] rounded-xl bg-white shadow-2xl flex flex-col p-8 items-center text-center"
            >
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">
                Error
            </h3>
            
            <p className="text-slate-600 mb-8 text-sm">
                {errorMessage}
            </p>
    
            <div className="flex justify-center gap-4 w-full">
                <Button onClick={() => {showErrorModal(false)}} size="sm">
                  Ok
                </Button>
            </div>
            </div>
        </div>) : null
      }

      {/* Modal for verification of post upload */}
      {confirmModal ?
        (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog">
            <div 
                className="w-full max-w-[400px] rounded-xl bg-white shadow-2xl flex flex-col p-8 items-center text-center"
            >
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">
                Save Post?
            </h3>
            
            <p className="text-slate-600 mb-8 text-sm">
                The post will be uploaded to the blog website.
            </p>
    
            <div className="flex justify-center gap-4 w-full">
                <Button onClick={handleConfirm} size="sm">
                  Yes
                </Button>
                <Button onClick={() => {showConfirmModal(false)}} size="sm">
                  No
                </Button>
            </div>
            </div>
        </div>) : null
      }
    </div>
  );
}
